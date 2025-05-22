// app/api/plants/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(request) {
  try {
    const plants = await prisma.plant.findMany({
      include: {
        seller: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(plants, { status: 200 });
  } catch (err) {
    console.error("GET /api/plants error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  // ⚠️ Асинхронно отримуємо куки
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = JSON.parse(cookie.value);

  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const care = formData.get("care");
    const priceStr = formData.get("price");
    const phone = formData.get("phone");
    const photoFile = formData.get("photo");

    if (!(photoFile instanceof File)) {
      return NextResponse.json(
        { error: "Не завантажено фото" },
        { status: 400 }
      );
    }

    // Зберігаємо фото в public/uploads
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.promises.mkdir(uploadsDir, { recursive: true });
    const filename = `plant-${Date.now()}-${photoFile.name}`;
    await fs.promises.writeFile(path.join(uploadsDir, filename), buffer);

    // Створюємо запис із прив’язкою sellerId = user.id
    const plant = await prisma.plant.create({
      data: {
        name,
        description,
        care,
        price: parseFloat(priceStr),
        phone,
        photo: `/uploads/${filename}`,
        sellerId: user.id,
      },
    });

    return NextResponse.json(plant, { status: 201 });
  } catch (err) {
    console.error("POST /api/plants error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
