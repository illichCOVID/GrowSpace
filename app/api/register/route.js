import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password } = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { message: "Користувач вже існує" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const cookie = `user=${encodeURIComponent(
    JSON.stringify({ name: user.name, email: user.email })
  )}; Path=/;`;

  return NextResponse.json(
    { message: "Реєстрація успішна" },
    {
      status: 200,
      headers: { "Set-Cookie": cookie },
    }
  );
}
