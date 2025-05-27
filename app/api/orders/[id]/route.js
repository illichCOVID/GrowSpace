// app/api/orders/[id]/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const runtime = "nodejs"; // щоб Next.js точно запустив цей роут у Node.js (і дозволив працювати з cookies())

// GET /api/orders/:id — повернути конкретне замовлення (тільки тому продавцю, кому воно належить)
export async function GET(request, context) {
  const { params } = await context;
  const id = Number(params.id);

  // Авторизація
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  if (!userCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = JSON.parse(userCookie.value);

  // Шукаймо замовлення і перевіряємо, що воно дійсно цього продавця
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order || order.sellerId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

// PUT /api/orders/:id — оновити статус замовлення
export async function PUT(request, context) {
  const { params } = await context;
  const id = Number(params.id);

  const body = await request.json();
  const { status } = body;

  // Перевірка валідності статусу
  const allowed = ["new", "processing", "done"];
  if (!allowed.includes(status)) {
    return NextResponse.json(
      {
        error: `Неприпустимий статус (має бути один із: ${allowed.join(", ")})`,
      },
      { status: 400 }
    );
  }

  // Авторизація
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  if (!userCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = JSON.parse(userCookie.value);

  // Перевіряємо, що це замовлення справді належить цьому продавцю
  const existing = await prisma.order.findUnique({
    where: { id },
    select: { sellerId: true },
  });
  if (!existing || existing.sellerId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Оновлюємо статус
  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}
