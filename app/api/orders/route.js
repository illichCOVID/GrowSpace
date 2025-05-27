// app/api/orders/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    // (optional) you can filter to only the logged-in seller:
    const cookieStore = await cookies();
    const c = cookieStore.get("user");
    if (!c) return NextResponse.json([], { status: 200 });
    const { email } = JSON.parse(c.value);
    // find the seller’s user record to get their id
    const seller = await prisma.user.findUnique({ where: { email } });
    if (!seller) return NextResponse.json([], { status: 200 });

    const orders = await prisma.order.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  const { items, fullName, phone, city, branch, total } = await request.json();

  // 1) check auth
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const buyer = JSON.parse(cookie.value);

  // 2) load plants & group, etc.
  const plantIds = items.map((i) => i.id);
  const plants = await prisma.plant.findMany({
    where: { id: { in: plantIds } },
  });

  // 3) ensure each has a sellerId
  const invalid = plants.filter((p) => !p.sellerId);
  if (invalid.length) {
    const names = invalid.map((p) => p.name).join(", ");
    return NextResponse.json(
      { error: `У цих лотів немає продавця: ${names}` },
      { status: 400 }
    );
  }

  // 4) group by sellerId
  const bySeller = {};
  for (const item of items) {
    (bySeller[item.sellerId] ??= []).push(item);
  }

  // 5) create one order per seller
  const created = [];
  for (const [sid, sellerItems] of Object.entries(bySeller)) {
    const order = await prisma.order.create({
      data: {
        buyerName: fullName,
        buyerPhone: phone,
        city,
        branch,
        total,
        sellerId: Number(sid),
        items: sellerItems,
      },
    });
    created.push(order);
  }

  return NextResponse.json(
    { message: "Замовлення успішно створено", orders: created },
    { status: 201 }
  );
}
