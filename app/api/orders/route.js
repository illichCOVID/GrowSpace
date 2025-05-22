// app/api/orders/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(request) {
  const { items, fullName, phone, city, branch, total } = await request.json();

  // 1) Перевірка залогіненого користувача
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const buyer = JSON.parse(cookie.value);

  // 2) Завантажуємо всі потрібні рослини, щоб перевірити sellerId
  const plantIds = items.map((i) => i.id);
  const plants = await prisma.plant.findMany({
    where: { id: { in: plantIds } },
  });

  // 3) Перевіряємо, чи всі мають sellerId
  const invalid = plants.filter((p) => !p.sellerId);
  if (invalid.length) {
    const names = invalid.map((p) => p.name).join(", ");
    return NextResponse.json(
      { error: `У цих лотів немає продавця: ${names}` },
      { status: 400 }
    );
  }

  // 4) Групуємо по sellerId
  const bySeller = {};
  for (const item of items) {
    (bySeller[item.sellerId] ??= []).push(item);
  }

  // 5) Створюємо замовлення для кожного sellerId
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
        items: sellerItems, // JSON поле
      },
    });
    created.push(order);
  }

  return NextResponse.json(
    { message: "Замовлення успішно створено", orders: created },
    { status: 201 }
  );
}
