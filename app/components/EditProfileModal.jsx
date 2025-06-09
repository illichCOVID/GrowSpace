"use client";

import { useEffect, useState } from "react";
import { inputStyle } from "@/utils/tailwindStyles";
import { useUser } from "../context/UserContext"; // ⬅️ Додано

export default function EditProfileModal({ onClose }) {
  const { setUser } = useUser(); // ⬅️ Отримуємо глобальну функцію оновлення
  const [form, setForm] = useState({
    city: "",
    bio: "",
    experience: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setForm({
            city: data.user.city || "",
            bio: data.user.bio || "",
            experience: data.user.experience || "",
          });
          if (data.user.avatar) {
            setAvatarPreview(data.user.avatar);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("city", form.city);
      formData.append("bio", form.bio);
      formData.append("experience", form.experience);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch("/api/profile/edit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Не вдалося зберегти зміни");
      }

      setUser(data.user);  // ⬅️ Глобальне оновлення user-а
      onClose();           // ⬅️ Закриття модалки
    } catch (err) {
      setError(err.message || "Помилка при збереженні");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-lg p-6 flex animate-fadeInScale">
        {/* Кнопка закриття */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
        >
          ✕
        </button>

        {/* Ліва частина з превʼю */}
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

        {/* Форма */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center gap-2">
            ✏️ Редагування профілю
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Місто"
              className={`${inputStyle} w-full border-green-300`}
            />

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Про себе..."
              className={`${inputStyle} w-full h-24 resize-none rounded-xl border-green-300`}
            />

            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className={`${inputStyle} w-full border-green-300`}
            >
              <option value="">— Оберіть досвід —</option>
              <option value="Початківець">🌱 Початківець</option>
              <option value="Любитель">🌿 Любитель</option>
              <option value="Професіонал">🌳 Професіонал</option>
              <option value="Експерт">🌟 Експерт</option>
            </select>

            <div>
              <label className="block text-gray-700 mb-1">Аватар</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-600 
                  file:py-2 file:px-4 file:rounded-full 
                  file:border-0 file:text-sm file:font-semibold 
                  file:bg-green-100 file:text-green-700 
                  hover:file:bg-green-200 cursor-pointer"
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
              className="w-full bg-green-600 hover:bg-green-700 
                text-white py-2 rounded-full transition 
                disabled:opacity-50"
            >
              {loading ? "Зберігаю..." : "Зберегти зміни"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
