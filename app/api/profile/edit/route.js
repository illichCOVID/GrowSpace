import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("user");

    if (!cookie) {
      return NextResponse.json(
        { message: "Користувач не авторизований" },
        { status: 401 }
      );
    }

    const userData = JSON.parse(cookie.value);
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Користувача не знайдено" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const description = formData.get("description");
    const experience = formData.get("experience");
    const file = formData.get("avatar");

    let avatarUrl = user.avatar;

    if (file && typeof file === "object" && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = uuidv4() + path.extname(file.name);
      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName
      );
      await writeFile(uploadPath, buffer);
      avatarUrl = `/uploads/${fileName}`;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        description,
        experience,
        avatar: avatarUrl,
      },
    });

    return NextResponse.json({ message: "Профіль оновлено" });
  } catch (error) {
    console.error("Помилка редагування профілю:", error);
    return NextResponse.json(
      { message: "Помилка оновлення профілю" },
      { status: 500 }
    );
  }
}
