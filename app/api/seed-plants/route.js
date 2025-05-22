import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.plant.createMany({
      data: [
        {
          name: "Фікус",
          description: "Красиве велике листя, чудово підходить для дому.",
          care: "Поливати раз на 4 дні, не ставити під пряме сонце.",
          photo: "/ficus.jpg",
          seller: "Олена",
          phone: "096-123-45-67",
          price: 250,
        },
        {
          name: "Сансевієрія",
          description: "Невибаглива та стильна.",
          care: "Полив раз на тиждень, ідеальна для офісів.",
          photo: "/sansevieria.jpg",
          seller: "Артем",
          phone: "093-456-78-90",
          price: 180,
        },
        {
          name: "Папороть",
          description: "Очищає повітря, пишна зелень.",
          care: "Потрібна висока вологість та частий полив.",
          photo: "/fern.jpg",
          seller: "Ірина",
          phone: "097-987-65-43",
          price: 300,
        },
      ],
    });

    return new Response("Рослини успішно додано ✅");
  } catch (error) {
    console.error(error);
    return new Response("Помилка при додаванні рослин", { status: 500 });
  }
}
