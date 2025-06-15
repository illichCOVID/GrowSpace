"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function OrderModal({ onClose, sellerEmail }) {
  const { items, clearCart, total } = useCart();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    branch: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycby9hiv_AAr1MaJ6hWmka0vsQ79fapeg4tEDqMtbmJUiMN9oMQx171BW0xTUvEtCKQzw/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            items,
            total,
            sellerEmail,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }

      clearCart();
      onClose();
      alert("Дякуємо! Ваше замовлення прийнято.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Помилка відправки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-lg animate-fadeInScale">
        {/* Закриття */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl"
        >
          ✕
        </button>

        {/* Заголовок */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Оформити замовлення
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ПІБ */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              ПІБ
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              placeholder="Шевченко Петро Васильович"
              className="w-full border border-gray-300 rounded-full px-4 py-2 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Телефон
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="0951234567"
              className="w-full border border-gray-300 rounded-full px-4 py-2 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Місто */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Місто
            </label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="Київ"
              className="w-full border border-gray-300 rounded-full px-4 py-2 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Відділення НП */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Відділення «Нова Пошта»
            </label>
            <input
              name="branch"
              value={form.branch}
              onChange={handleChange}
              required
              placeholder="№ відділення"
              className="w-full border border-gray-300 rounded-full px-4 py-2 placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Сума */}
          <div className="flex justify-between items-center text-gray-800 font-medium">
            <span>Сума:</span>
            <span className="text-green-700">{total}₴</span>
          </div>

          {/* Помилка */}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          {/* Кнопка */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full transition disabled:opacity-50"
          >
            {loading ? "Надсилаю..." : "Оформити замовлення"}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
