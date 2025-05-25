// app/api/plants/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const plants = await prisma.plant.findMany({
      include: { seller: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(plants);
  } catch (err) {
    console.error("GET /api/plants error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  // 1) авторизація
  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = JSON.parse(cookie.value);

  try {
    // 2) зчитуємо форму
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const care = formData.get("care");
    const priceStr = formData.get("price");
    const category = formData.get("category");
    const photoFile = formData.get("photo");

    if (!(photoFile instanceof File)) {
      return NextResponse.json(
        { error: "Не завантажено фото" },
        { status: 400 }
      );
    }

    // 3) зберігаємо зображення
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await fs.promises.mkdir(uploadsDir, { recursive: true });
    const filename = `plant-${Date.now()}-${photoFile.name}`;
    await fs.promises.writeFile(path.join(uploadsDir, filename), buffer);

    // 4) створюємо рослину, phone беремо з user.email
    const plant = await prisma.plant.create({
      data: {
        name,
        description,
        care,
        price: parseFloat(priceStr),
        category,
        photo: `/uploads/${filename}`,
        sellerId: user.id,
        phone: user.email, // ← обов'язкове поле заповнюємо email
      },
    });

    return NextResponse.json(plant, { status: 201 });
  } catch (err) {
    console.error("POST /api/plants error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
