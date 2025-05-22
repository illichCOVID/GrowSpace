"use client";

import { useEffect, useState } from "react";

export default function EditProfileForm() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    bio: "",
    city: "",
    experience: "Початківець",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setUser(data.user);
        setFormData({
          bio: data.user.bio || "",
          city: data.user.city || "",
          experience: data.user.experience || "Початківець",
        });
      } catch (error) {
        console.error("Не вдалося отримати дані користувача", error);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("experience", formData.experience);
      if (selectedFile) {
        formDataToSend.append("avatar", selectedFile);
      }

      const res = await fetch("/api/profile/edit", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Помилка збереження");

      setStatus("✅ Профіль оновлено!");
    } catch (error) {
      setStatus("❌ Помилка при збереженні");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
        ✏️ Редагування профілю
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Місто"
          className="w-full border rounded-lg px-4 py-2"
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Про себе..."
          className="w-full border rounded-lg px-4 py-2 h-24"
        ></textarea>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="Початківець">Початківець</option>
          <option value="Любитель">Любитель</option>
          <option value="Досвідчений">Досвідчений</option>
          <option value="Професіонал">Професіонал</option>
        </select>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-800 hover:file:bg-green-200"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Зберегти зміни
        </button>
      </form>
      {status && (
        <p className="text-center mt-4 text-sm text-green-700">{status}</p>
      )}
    </div>
  );
}
