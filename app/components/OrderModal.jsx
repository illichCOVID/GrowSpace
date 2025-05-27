// app/components/OrderModal.jsx
"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { inputStyle } from "@/utils/tailwindStyles";

export default function OrderModal({ onClose, onOrderSaved }) {
  const { items = [], total = 0, clearCart = () => {} } = useCart();

  const [form, setForm]       = useState({ fullName: "", phone: "", city: "", branch: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      setError("Ваш кошик порожній");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, total }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Помилка при оформленні");
      }

      clearCart();
      onOrderSaved?.();
      onClose();
      alert("Дякуємо! Ваше замовлення прийнято.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Помилка при оформленні замовлення");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-lg animate-fadeInScale"
        onClick={e => e.stopPropagation()}
      >
        {/* Хрестик */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
        >
          ✕
        </button>

        {/* Заголовок */}
        <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
          Оформити замовлення
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ПІБ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">ПІБ</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className={inputStyle}
              placeholder="Ваше ім’я та прізвище"
            />
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Телефон</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              className={inputStyle}
              placeholder="+380..."
            />
          </div>

          {/* Місто */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Місто</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className={inputStyle}
              placeholder="Наприклад, Київ"
            />
          </div>

          {/* Відділення НП */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Відділення “Нова Пошта”
            </label>
            <input
              name="branch"
              value={form.branch}
              onChange={handleChange}
              required
              className={inputStyle}
              placeholder="Номер відділення"
            />
          </div>

          {/* Сума */}
          <div className="text-right font-semibold">
            Сума: <span className="text-green-700">{total}₴</span>
          </div>

          {/* Помилка */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Кнопка */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full transition disabled:opacity-50"
          >
            {loading ? "Надсилаю…" : "Оформити замовлення"}
          </button>
        </form>
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
