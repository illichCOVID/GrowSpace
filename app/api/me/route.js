// app/api/me/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Вказуємо явно runtime = "nodejs", інакше Next.js бере edge (де Prisma не працює)
export const runtime = "nodejs";

export async function GET() {
  // 1. Отримуємо куки
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");

  if (!cookie) {
    // Якщо немає куки — повертаємо user: null
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // 2. Розбираємо вміст куки (вона містить щось на кшталт { name, email })
  let userData;
  try {
    userData = JSON.parse(cookie.value);
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    // 3. Шукаймо по email полного користувача, включаючи city
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        bio: true,
        experience: true,
        avatar: true,
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("GET /api/me error:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
