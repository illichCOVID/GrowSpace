// app/api/plants/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
  // params — це асинхронний об’єкт, тому чекаємо його перед використанням
  const { id } = await params;

  try {
    await prisma.plant.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(
      { message: "Рослину успішно видалено" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/plants/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
