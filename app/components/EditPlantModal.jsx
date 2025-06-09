// app/components/EditPlantModal.jsx
"use client";

import { useState } from "react";

export default function EditPlantModal({ plant, onClose, onPlantSaved }) {
  const [formData, setFormData] = useState({
    name: plant.name || "",
    description: plant.description || "",
    care: plant.care || "",
    price: plant.price || "",
    category: plant.category || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/plants/${plant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      onPlantSaved(data);
      onClose();
    } catch (err) {
      console.error("EditPlantModal error:", err);
      setError(err.message || "Помилка редактування");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-2">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative animate-fadeInScale">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Редагувати рослину
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Назва рослини"
            className="w-full border border-green-300 rounded-full px-4 py-2 text-gray-800 placeholder-gray-400"
            required
          />
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опис"
            className="w-full border border-green-300 rounded-full px-4 py-2 text-gray-800 placeholder-gray-400"
            required
          />
          <input
            name="care"
            value={formData.care}
            onChange={handleChange}
            placeholder="Догляд"
            className="w-full border border-green-300 rounded-full px-4 py-2 text-gray-800 placeholder-gray-400"
            required
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Ціна (грн)"
            className="w-full border border-green-300 rounded-full px-4 py-2 text-gray-800 placeholder-gray-400"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-full px-4 py-2 text-gray-800 placeholder-gray-400"
            required
          >
            <option value="">— Виберіть категорію —</option>
            <option value="кімнатні">🌼 Кімнатні</option>
            <option value="декоративні">🌸 Декоративні</option>
            <option value="дерева">🌳 Дерева</option>
            <option value="овочі">🥬 Овочеві</option>
          </select>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full transition disabled:opacity-50"
          >
            {loading ? "Зберігаю..." : "Зберегти зміни"}
          </button>
        </form>
      </div>
    </div>
  );
}
