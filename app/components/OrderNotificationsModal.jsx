"use client";

import { useEffect, useState } from "react";

export default function OrderNotificationsModal({ onClose }) {
  const [orders, setOrders]   = useState([]);   // за замовчуванням — []
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders?seller=new")
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      // Видаляємо виконане з локального списку
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error("Помилка оновлення статусу", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl animate-fadeInScale overflow-auto max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Нові замовлення</h3>

        {loading ? (
          <p className="text-gray-600">Завантаження…</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">Немає нових замовлень</p>
        ) : (
          <ul className="space-y-4">
            {orders.map(o => (
              <li key={o.id} className="border border-gray-200 p-4 rounded-lg">
                <p className="text-gray-800 font-semibold">
                  Замовник: {o.buyerName} ({o.buyerPhone})
                </p>
                <p className="text-gray-700 text-sm">
                  Адреса: {o.city}, відд. №{o.branch}
                </p>
                <p className="text-gray-700 mt-1 whitespace-pre-line">
                  {(o.items || []).map(i =>
                    `• ${i.name} × ${i.quantity} = ${i.price * i.quantity}₴`
                  ).join("\n")}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-green-700 font-semibold">
                    {o.total}₴
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(o.id, "processing")}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      В обробці
                    </button>
                    <button
                      onClick={() => updateStatus(o.id, "done")}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      Виконано
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
