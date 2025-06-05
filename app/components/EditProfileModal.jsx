// app/components/EditProfileModal.jsx
"use client";

import { useState, useEffect } from "react";
import { inputStyle } from "@/utils/tailwindStyles";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    city: user?.city || "",
    bio: user?.bio || "",
    experience: user?.experience || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Початково показуємо існуюче превʼю (якщо є)
  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  // Очищаємо помилку через 3 секунди
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("city", formData.city);
      fd.append("bio", formData.bio);
      fd.append("experience", formData.experience);
      if (avatarFile) {
        fd.append("avatar", avatarFile);
      }

      const res = await fetch("/api/profile/edit", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Не вдалося зберегти редагування");
      }

      onSave(data.user); // передаємо оновлений об’єкт користувача в батьківський компонент
      onClose();
    } catch (err) {
      setError(err.message || "Помилка при збереженні");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6 flex animate-fadeInScale">
        {/* Хрестик для закриття */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
        >
          ✕
        </button>

        {/* Ліва частина: прев’ю аватара або банер */}
        <div className="hidden md:block flex-1 pr-6">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            <img
              src="/plant-banner.jpg"
              alt="GrowSpace"
              className="h-full w-full object-cover rounded-2xl"
            />
          )}
        </div>

        {/* Форма з правого боку */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center gap-2">
            <span>✏️</span> Редагування профілю
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Місто"
              className={`${inputStyle} w-full`}
              required
            />

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Про себе..."
              className={`${inputStyle} w-full h-24 resize-none`}
            />

            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className={`${inputStyle} w-full`}
              required
            >
              <option value="">— Оберіть досвід —</option>
              <option value="Початківець">🌱 Початківець</option>
              <option value="Любитель">🌿 Любитель</option>
              <option value="Професіонал">🌳 Професіонал</option>
              <option value="Експерт">🏆 Експерт</option>
            </select>

            <div>
              <label className="block text-gray-700 mb-1">Аватар</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer"
              />
            </div>

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
