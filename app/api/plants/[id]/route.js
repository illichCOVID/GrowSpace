// app/api/plants/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function DELETE(request, context) {
  // 1) Дістаємо params із context
  const { params } = context;
  const plantId = Number(params.id);

  // 2) Перевірка авторизації через куку
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = JSON.parse(cookie.value);

  // 3) Перевіряємо, що ця рослина належить поточному користувачу
  const plant = await prisma.plant.findUnique({
    where: { id: plantId },
    select: { sellerId: true },
  });

  if (!plant || plant.sellerId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 4) Видаляємо запис із бази
  try {
    await prisma.plant.delete({ where: { id: plantId } });
    return NextResponse.json({ message: "Plant deleted" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting plant:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
