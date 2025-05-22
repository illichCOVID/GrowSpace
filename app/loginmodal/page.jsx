"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { inputStyle } from "@/utils/tailwindStyles";

export default function LoginModal() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegistering ? "/api/register" : "/api/login";

    if (isRegistering && formData.password !== formData.confirmPassword) {
      setError("Паролі не співпадають");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Помилка");

      alert(data.message);
      router.push("/"); // Повернення після успішного входу/реєстрації
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.push("/"); // Повернення на головну при закритті модалки
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="animate-fadeInScale bg-white/80 backdrop-blur-md border border-green-100 shadow-2xl rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden relative">
        {/* Кнопка Закриття */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl z-10"
        >
          ✕
        </button>

        {/* Ліва частина */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto hidden md:block">
          <img
            src="/plant-banner.jpg"
            alt="GrowSpace"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white px-6">
            <h1 className="text-4xl font-bold mb-2">GrowSpace</h1>
            <p className="text-sm text-center">
              Твій простір для зеленого майбутнього 🌿
            </p>
          </div>
        </div>

        {/* Права частина: Форма */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
            {isRegistering ? "Реєстрація" : "Вхід"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <input
                name="name"
                type="text"
                placeholder="Ім’я"
                className={inputStyle}
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}
            <input
              name="email"
              type="email"
              placeholder="Email"
              className={inputStyle}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Пароль"
              className={inputStyle}
              value={formData.password}
              onChange={handleChange}
              required
            />
            {isRegistering && (
              <input
                name="confirmPassword"
                type="password"
                placeholder="Підтвердження пароля"
                className={inputStyle}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            )}

            {error && (
              <p className="text-red-500 bg-red-100 px-3 py-2 rounded text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-2 transition font-semibold"
            >
              {loading
                ? "Зачекайте..."
                : isRegistering
                ? "Зареєструватися"
                : "Увійти"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            {isRegistering ? "Вже є акаунт?" : "Новий користувач?"}{" "}
            <button
              className="text-green-600 hover:underline"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Увійдіть зараз" : "Зареєструйтеся прямо зараз"}
            </button>
          </p>
        </div>
      </div>

      {/* Анімація */}
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
