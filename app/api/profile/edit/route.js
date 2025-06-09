// app/api/profile/edit/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export const runtime = "nodejs"; // Використання Node.js

export async function POST(request) {
  try {
    // Авторизація через cookie
    const cookieStore = cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = JSON.parse(userCookie.value);

    // Отримуємо користувача з БД
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Отримуємо FormData
    const formData = await request.formData();
    const city = formData.get("city") || "";
    const bio = formData.get("bio") || "";
    const experience = formData.get("experience") || "";

    // Обробка аватара (якщо є)
    let avatarUrl = existingUser.avatar;
    const avatarFile = formData.get("avatar");

    if (avatarFile && avatarFile instanceof File) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), "public", "avatars");
      await fs.promises.mkdir(uploadsDir, { recursive: true });

      const fileName = `avatar-${existingUser.id}-${Date.now()}-${
        avatarFile.name
      }`;
      const filePath = path.join(uploadsDir, fileName);

      await fs.promises.writeFile(filePath, buffer);

      avatarUrl = `/avatars/${fileName}`;
    }

    // Оновлення даних користувача в БД
    const updatedUser = await prisma.user.update({
      where: { email: userData.email },
      data: {
        city,
        bio,
        experience,
        avatar: avatarUrl,
      },
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

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error("Error updating profile:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
