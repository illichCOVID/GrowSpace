export default function AboutFooterPage() {
  return (
    <main className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-800 text-center mb-4">🌱 Про проєкт GrowSpace</h1>

      <div className="max-w-4xl mx-auto text-gray-800 space-y-4 text-base">
        <p>
          <strong>GrowSpace</strong> — онлайн-платформа для садівників-початківців. Ми допомагаємо легко орієнтуватися в догляді за рослинами, а також даємо змогу купувати й продавати розсаду чи кімнатні рослини.
        </p>

        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>🌿 Додавайте рослини на продаж</li>
          <li>💬 Спілкуйтесь з іншими користувачами</li>
          <li>📖 Дізнавайтеся про догляд та сорти</li>
        </ul>

        <p>
          Проєкт створено в рамках дипломної роботи з використанням:
        </p>

        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>⚙️ Next.js</li>
          <li>🎨 Tailwind CSS</li>
          <li>💾 Prisma + SQLite</li>
        </ul>

        <p className="text-center text-green-700 font-medium mt-6">
          Дякуємо, що з нами 🌷
        </p>
      </div>
    </main>
  );
}
