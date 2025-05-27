import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request) {
  // 1. Перевіряємо, що продавець залогінений
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = JSON.parse(cookie.value);

  // 2. Зчитуємо параметр ?status=new (або інші, якщо потрібно)
  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status") || undefined;

  // 3. Витягуємо лише ті замовлення, що належать цьому продавцю
  //    і (за потреби) мають status = статус із параметра
  const orders = await prisma.order.findMany({
    where: {
      sellerId: user.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request) {
  // Створення нових замовлень (без змін)
  const { items, fullName, phone, city, branch, total } = await request.json();

  // Авторизація
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const buyer = JSON.parse(cookie.value);

  // Валідація sellerId у кожної рослини
  const plantIds = items.map((i) => i.id);
  const plants = await prisma.plant.findMany({
    where: { id: { in: plantIds } },
  });
  const invalid = plants.filter((p) => !p.sellerId);
  if (invalid.length) {
    const names = invalid.map((p) => p.name).join(", ");
    return NextResponse.json(
      { error: `У цих лотів немає продавця: ${names}` },
      { status: 400 }
    );
  }

  // Групуємо по sellerId і створюємо по одній заявці на продавця
  const bySeller = {};
  items.forEach((i) => {
    (bySeller[i.sellerId] ||= []).push(i);
  });

  const created = [];
  for (const [sellerId, sellerItems] of Object.entries(bySeller)) {
    const order = await prisma.order.create({
      data: {
        buyerName: fullName,
        buyerPhone: phone,
        city,
        branch,
        total,
        sellerId: Number(sellerId),
        items: sellerItems, // json-поле
      },
    });
    created.push(order);
  }

  return NextResponse.json(
    { message: "Замовлення успішно створено", orders: created },
    { status: 201 }
  );
}
