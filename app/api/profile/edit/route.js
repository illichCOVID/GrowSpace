// app/api/profile/edit/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    // 1. Дочікуємося cookies()
    const cookieStore = await cookies();
    const cookie = cookieStore.get("user");
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userData = JSON.parse(cookie.value);

    // 2. Розбираємо FormData із запиту
    const formData = await request.formData();
    const city = formData.get("city")?.toString() || "";
    const bio = formData.get("bio")?.toString() || "";
    const experience = formData.get("experience")?.toString() || "";
    const avatarFile = formData.get("avatar");

    // 3. Якщо файл аватара передано — збережіть його в public/avatars
    let avatarUrl = userData.avatar || null;
    if (avatarFile instanceof File) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const avatarsDir = path.join(process.cwd(), "public", "avatars");
      await fs.promises.mkdir(avatarsDir, { recursive: true });
      const filename = `avatar-${userData.email}-${Date.now()}-${
        avatarFile.name
      }`;
      const filepath = path.join(avatarsDir, filename);
      await fs.promises.writeFile(filepath, buffer);
      avatarUrl = `/avatars/${filename}`;
    }

    // 4. Оновлюємо користувача в БД (тут точно є city, bio, experience, avatar)
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

    // 5. Повертаємо оновлені дані назад клієнту
    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error("POST /api/profile/edit error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
