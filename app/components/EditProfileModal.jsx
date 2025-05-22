"use client";

import React, { useState } from "react";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    city: user?.city || "",
    bio: user?.bio || "",
    experience: user?.experience || "",
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      form.append(key, value)
    );

    const res = await fetch("/api/profile/edit", {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      onSave();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-2">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-700 text-2xl font-bold hover:text-black"
        >
          ×
        </button>

        <div className="hidden md:block w-1/2">
          <img
            src="/plant-banner.jpg"
            alt="Banner"
            className="object-cover w-full h-full"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 p-8 flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            ✏️ Редагування профілю
          </h2>

          <input
            type="text"
            name="city"
            placeholder="Місто"
            value={formData.city}
            onChange={handleChange}
            className="border-2 border-green-400 rounded px-3 py-2 placeholder-gray-800"
          />

          <textarea
            name="bio"
            placeholder="Про себе..."
            value={formData.bio}
            onChange={handleChange}
            className="border-2 border-green-400 rounded px-3 py-2 h-24 placeholder-gray-800"
          ></textarea>

          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="border-2 border-green-400 rounded px-3 py-2 text-gray-800"
          >
            <option value="">Оберіть досвід</option>
            <option value="Початківець">Початківець</option>
            <option value="Любитель">Любитель</option>
            <option value="Професіонал">Професіонал</option>
            <option value="Експерт">Експерт</option>
          </select>

          <div>
            <label className="block text-gray-700 mb-1">Аватар</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="text-sm text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
          >
            Зберегти зміни
          </button>
        </form>
      </div>
    </div>
  );
}
