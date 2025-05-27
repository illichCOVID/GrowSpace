// app/api/orders/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const id = Number(params.id);

  // 1. Перевіряємо, що користувач залогінений
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = JSON.parse(cookie.value);

  // 2. Шукаємо замовлення в БД
  const order = await prisma.order.findUnique({
    where: { id },
  });

  // 3. Переконуємося, що це замовлення належить поточному користувачу (sellerId)
  if (!order || order.sellerId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 4. Повертаємо замовлення
  return NextResponse.json(order, { status: 200 });
}

export async function PUT(request, { params }) {
  const id = Number(params.id);
  const { status } = await request.json();

  // 1. Перевіряємо коректність нового статусу
  const allowed = ["new", "processing", "done"];
  if (!allowed.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status: must be one of ${allowed.join(", ")}` },
      { status: 400 }
    );
  }

  // 2. Перевіряємо, що користувач залогінений
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = JSON.parse(cookie.value);

  // 3. Переконуємося, що замовлення належить цьому користувачу
  const existing = await prisma.order.findUnique({
    where: { id },
    select: { sellerId: true },
  });
  if (!existing || existing.sellerId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 4. Оновлюємо статус
  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated, { status: 200 });
}
