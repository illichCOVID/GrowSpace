import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const runtime = "nodejs"; // Потрібно для cookies() в App Router

// GET /api/orders/:id — отримати конкретне замовлення
export async function GET(req, { params }) {
  const id = Number(params.id);

  const cookieStore = await cookies(); // ✅ await обов’язково
  const userCookie = cookieStore.get("user");
  if (!userCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = JSON.parse(userCookie.value);

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order || order.sellerId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

// PUT /api/orders/:id — оновити статус замовлення
export async function PUT(req, { params }) {
  const id = Number(params.id);
  const body = await req.json();
  const { status } = body;

  const allowedStatuses = ["new", "processing", "done"];
  if (!allowedStatuses.includes(status)) {
    return NextResponse.json(
      {
        error: `Неприпустимий статус (має бути: ${allowedStatuses.join(", ")})`,
      },
      { status: 400 }
    );
  }

  const cookieStore = await cookies(); // ✅ await
  const userCookie = cookieStore.get("user");
  if (!userCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = JSON.parse(userCookie.value);

  const existingOrder = await prisma.order.findUnique({
    where: { id },
    select: { sellerId: true },
  });

  if (!existingOrder || existingOrder.sellerId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updatedOrder);
}
