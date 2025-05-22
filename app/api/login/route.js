// app/api/login/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();

  // Знаходимо користувача за email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { message: "Невірний email або пароль" },
      { status: 401 }
    );
  }

  // Створюємо значення куки із id, name і email
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  // Створюємо відповідь і встановлюємо httpOnly-куку
  const res = NextResponse.json({ message: "Вхід успішний" }, { status: 200 });

  res.cookies.set("user", JSON.stringify(userData), {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 днів
    sameSite: "lax",
  });

  return res;
}
