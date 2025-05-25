"use client";

import { useState, useEffect } from "react";
import { inputStyle } from "@/utils/tailwindStyles";

export default function AddPlantModal({ onClose, onPlantAdded, initialCategory }) {
  const [formData, setFormData] = useState({
    name:        "",
    description: "",
    care:        "",
    price:       "",
    category:    initialCategory || "",
  });
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Оберіть фото");
      return;
    }
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name",        formData.name);
      fd.append("description", formData.description);
      fd.append("care",        formData.care);
      fd.append("price",       formData.price);
      fd.append("category",    formData.category);
      fd.append("photo",       file);

      const res = await fetch("/api/plants", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);

      onPlantAdded();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6 animate-fadeInScale flex">
        {/* Кнопка закриття, прив’язана до модалки */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        {/* Ліва частина з банером */}
        <div className="hidden md:block flex-1 pr-6">
          <img
            src="/plant-banner.jpg"
            alt="GrowSpace"
            className="h-full w-full object-cover rounded-2xl"
          />
        </div>

        {/* Форма праворуч */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
            Додати рослину
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Назва рослини"
              className={inputStyle}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="description"
              placeholder="Опис"
              className={inputStyle}
              value={formData.description}
              onChange={handleChange}
              required
            />
            <input
              name="care"
              placeholder="Догляд"
              className={inputStyle}
              value={formData.care}
              onChange={handleChange}
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Ціна (грн)"
              className={inputStyle}
              value={formData.price}
              onChange={handleChange}
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-green-300 rounded-full px-4 py-2 text-gray-700"
              required
            >
              <option value="">— Виберіть категорію —</option>
              <option value="кімнатні">🌼 Кімнатні</option>
              <option value="декоративні">🌸 Декоративні</option>
              <option value="дерева">🌳 Дерева</option>
              <option value="овочі">🥬 Овочеві</option>
            </select>
            <input
              type="file"
              onChange={handleFile}
              className="block w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer"
              required
            />
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full transition"
            >
              {loading ? "Додаємо..." : "Додати рослину"}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) }
          to   { opacity: 1; transform: scale(1) }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
