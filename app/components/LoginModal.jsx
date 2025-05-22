"use client";

import { useState, useEffect } from "react";
import { inputStyle } from "@/utils/tailwindStyles";

export default function LoginModal({ onClose, isRegistering, switchMode, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

      onLoginSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-3xl flex shadow-lg relative animate-fadeInScale">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        <div className="flex-1 pr-4 hidden md:block">
          <img
            src="/plant-banner.jpg"
            alt="GrowSpace"
            className="rounded-2xl object-cover h-full w-full"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4 text-green-700 text-center">
            {isRegistering ? "Реєстрація" : "Вхід"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <input
                name="name"
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
              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-xl text-sm animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 transition"
            >
              {loading ? "Зачекайте..." : isRegistering ? "Зареєструватися" : "Увійти"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            {isRegistering ? "Вже маєте акаунт?" : "Новий користувач?"}{" "}
            <button
              className="text-green-600 hover:underline"
              onClick={switchMode}
            >
              {isRegistering ? "Увійдіть зараз" : "Зареєструйтесь прямо зараз"}
            </button>
          </p>
        </div>
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
