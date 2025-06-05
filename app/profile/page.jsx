// app/profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import EditProfileModal from "../components/EditProfileModal";
import Link from "next/link";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [plants, setPlants] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loadingPlants, setLoadingPlants] = useState(true);

  // 1) Підвантаження даних користувача
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error("GET /api/me failed:", err));
  }, []);

  // 2) Як тільки маємо user, підвантажуємо рослини, які створив саме цей користувач
  useEffect(() => {
    if (!user) return;

    setLoadingPlants(true);
    fetch("/api/my-plants") // Має бути ваш API-роут, який повертає лише ті рослини, де sellerId === поточний user.id
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPlants(data);
        } else {
          setPlants([]);
        }
      })
      .catch((err) => {
        console.error("GET /api/my-plants failed:", err);
        setPlants([]);
      })
      .finally(() => setLoadingPlants(false));
  }, [user]);

  // 3) Колбек після успішного редагування профілю, щоб оновити user-стейт
  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
  };

  // 4) Видалити рослину за id
  const handleDeletePlant = async (plantId) => {
    if (!confirm("Ви дійсно хочете видалити цю рослину?")) return;

    try {
      const res = await fetch(`/api/plants/${plantId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Не вдалося видалити рослину");
      }
      // Після успіху просто прибираємо її з масиву в стані
      setPlants((prev) => prev.filter((p) => p.id !== plantId));
    } catch (err) {
      console.error("DELETE /api/plants/[id] failed:", err);
      alert("Помилка при видаленні рослини");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Завантаження профілю…</p>
      </div>
    );
  }

  return (
    <main className="p-6 bg-green-50 min-h-screen space-y-6">
      {/* ─── БЛОК: Інформація про користувача ────────────────────────────────── */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 flex items-center gap-6">
        {/* Аватар */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="Аватар користувача"
              width={96}
              height={96}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5zm0 2c-3.86 0-7 3.14-7 7v1h14v-1c0-3.86-3.14-7-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Дані: ім’я, email, місто, опис, досвід */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-green-800">{user.name}</h2>
          <p className="text-gray-700">{user.email}</p>

          <p className="mt-4 text-gray-800">
            <strong>Місто: </strong>
            {user.city || "Не вказано"}
          </p>

          <p className="mt-2 text-gray-800">
            <strong>Опис: </strong>
            {user.bio || "Відсутній"}
          </p>

          <p className="mt-2 text-gray-800 flex items-center">
            <span className="mr-2">🌱</span>
            <strong>Досвід: </strong>
            {user.experience || "Не вказано"}
          </p>

          <div className="mt-4">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-2xl font-medium transition"
            >
              ✏️ Редагувати
            </button>
          </div>
        </div>
      </div>

      {/* ─── БЛОК: «Мої рослини» ───────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Мої оголошення
        </h3>

        {loadingPlants ? (
          <p className="text-gray-600">Завантаження рослин…</p>
        ) : plants.length === 0 ? (
          <p className="text-gray-600">У вас немає доданих рослин</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
              >
                {/* Фото рослини */}
                <div className="relative w-full h-40 bg-gray-100">
                  <Image
                    src={plant.photo}
                    alt={plant.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-green-700">
                      {plant.name}
                    </h4>
                    <p className="text-gray-700 mt-1">{plant.description}</p>
                    <p className="text-sm italic mt-1 text-gray-600">
                      Догляд: {plant.care}
                    </p>
                    <p className="mt-2 font-bold text-green-800">
                      {plant.price} ₴
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    {/* Кнопка «Редагувати» (перейти на сторінку редагування) */}
                    <Link
                      href={`/plants/edit/${plant.id}`}
                      className="flex items-center gap-2 text-blue-700 hover:underline"
                    >
                      <FaEdit /> Редагувати
                    </Link>

                    {/* Кнопка «Видалити» */}
                    <button
                      onClick={() => handleDeletePlant(plant.id)}
                      className="flex items-center gap-2 text-red-600 hover:underline"
                    >
                      <FaTrash /> Видалити
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── МОДАЛКА: Редагування профілю ───────────────────────────────────── */}
      {isEditingProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditingProfile(false)}
          onSave={handleProfileUpdated}
        />
      )}
    </main>
  );
}
