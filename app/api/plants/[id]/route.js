import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  const plantId = Number(params.id);

  const cookieStore = await cookies();
  const cookie = cookieStore.get("user");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = JSON.parse(cookie.value);

  const body = await request.json();
  const { name, description, care, price, category } = body;

  // Перевірка, чи рослина належить користувачу
  const plant = await prisma.plant.findUnique({
    where: { id: plantId },
  });
  if (!plant || plant.sellerId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const updatedPlant = await prisma.plant.update({
      where: { id: plantId },
      data: {
        name,
        description,
        care,
        price: parseFloat(price), // конвертація в число
        category,
      },
    });

    return NextResponse.json(updatedPlant);
  } catch (err) {
    console.error("Error updating plant:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
