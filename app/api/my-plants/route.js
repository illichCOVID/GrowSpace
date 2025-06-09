// app/api/my-plants/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  // 1) Перевіряємо cookie "user"
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = JSON.parse(cookie.value);

  // 2) Отримуємо всі рослини, у яких sellerId = user.id
  try {
    const plants = await prisma.plant.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(plants, { status: 200 });
  } catch (err) {
    console.error("GET /api/my-plants error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
