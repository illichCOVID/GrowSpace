export default function MarketFooterPage() {
  return (
    <main className="p-8 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-800 text-center mb-6">🛒 Як працює маркетплейс</h1>

      <p className="text-center text-gray-700 mb-8 max-w-3xl mx-auto">
        GrowSpace — це місце, де кожен може продати або купити рослини напряму. Ми об’єднуємо садівників-початківців і досвідчених вирощувачів.
      </p>

      <div className="grid gap-6 md:grid-cols-3 text-gray-800 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">👤 Продавці</h2>
          <p>Будь-хто після реєстрації може додати свою рослину на продаж. Просто натисни кнопку “+ Sell your plant”.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">💬 Покупці</h2>
          <p>Переглядай каталог на головній сторінці та звʼязуйся з продавцем напряму через контактну інформацію.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">🔐 Безпека</h2>
          <p>Ми не зберігаємо платіжні дані. Усі угоди — напряму між користувачами. Будь уважним при виборі продавця.</p>
        </div>
      </div>
    </main>
  );
}
