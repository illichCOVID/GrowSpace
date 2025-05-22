import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const plants = await prisma.plant.findMany();
    return Response.json(plants);
  } catch (error) {
    console.error("DB Error:", error);
    return new Response("Database error", { status: 500 });
  }
}
