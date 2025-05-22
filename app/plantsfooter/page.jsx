export default function PlantsFooterPage() {
  return (
    <main className="p-8 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-800 text-center mb-6">🌿 Категорії рослин</h1>

      <p className="text-center text-gray-700 mb-8 max-w-3xl mx-auto">
        У GrowSpace ви знайдете великий вибір рослин — від кімнатних до декоративних дерев та овочевих культур.
        Кожна категорія має свої особливості та переваги.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-gray-800 max-w-7xl mx-auto">
        {/* Кімнатні */}
        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">🌻 Кімнатні</h2>
          <p>Ідеальні для інтерʼєру та очищення повітря: фікус, алое, сансевієрія.</p>
        </div>

        {/* Декоративні квітучі */}
        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">🌸 Декоративні</h2>
          <p>Краса і колір у кожному бутоні: троянди, орхідеї, хризантеми.</p>
        </div>

        {/* Декоративні дерева */}
        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">🌳 Декоративні дерева</h2>
          <p>Для озеленення дворів і садів: туя, клен японський, ялівець.</p>
        </div>

        {/* Овочеві */}
        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-green-700 mb-2">🥬 Овочеві</h2>
          <p>Смачні врожаї власноруч: помідори, огірки, перець, салат.</p>
        </div>
      </div>
    </main>
  );
}
