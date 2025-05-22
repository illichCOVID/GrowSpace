// app/api/my-plants/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request) {
  // 1) Дістаємо cookies — тепер асинхронно
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = JSON.parse(cookie.value);

  try {
    // 2) Повертаємо лише ті рослини, які продавець створив сам
    const myPlants = await prisma.plant.findMany({
      where: { sellerId: user.id },
      include: {
        seller: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(myPlants, { status: 200 });
  } catch (err) {
    console.error("GET /api/my-plants error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
