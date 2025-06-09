"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditProfileModal from "../components/EditProfileModal";
import EditPlantModal from "../components/EditPlantModal";
import { useUser } from "../context/UserContext";

export default function ProfilePage() {
  const { user } = useUser();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditPlant, setShowEditPlant] = useState(false);
  const [plantToEdit, setPlantToEdit] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadMyPlants = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/my-plants");
        const data = await res.json();
        setPlants(data || []);
      } catch {
        setPlants([]);
      } finally {
        setLoading(false);
      }
    };

    loadMyPlants();
  }, [user]);

  const deletePlant = async (id) => {
    try {
      const res = await fetch(`/api/plants/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPlants((prev) => prev.filter((p) => p.id !== id));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error();
      }
    } catch {
      alert("Не вдалося видалити рослину");
    }
  };

  const openEditPlant = (p) => {
    setPlantToEdit(p);
    setShowEditPlant(true);
  };

  const onPlantSaved = (updated) => {
    setPlants((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setShowEditPlant(false);
  };

  if (user === null) {
    return (
      <main className="p-6">
        <p>Будь ласка, увійдіть у систему.</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-6">
        <p>Завантаження профілю…</p>
      </main>
    );
  }

  return (
    <main className="p-6 bg-green-50 min-h-screen space-y-8">
      <section className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 relative">
          {user.avatar ? (
            <Image src={user.avatar} alt="Аватар" fill className="object-cover rounded-full" />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-xl">?</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-green-800">{user.name}</h1>
          <p className="text-gray-800">{user.email}</p>
          <p className="mt-2 text-gray-700">
            <strong>Опис:</strong> {user.bio || "—"}
          </p>
          <p className="text-gray-700">
            <strong>Досвід:</strong> {user.experience || "—"}
          </p>
          <p className="text-gray-700">
            <strong>Місто:</strong> {user.city || "—"}
          </p>
        </div>
        <button
          onClick={() => setShowEditProfile(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition"
        >
          Редагувати профіль
        </button>
      </section>

      <section>
        <h2 className="text-xl font-bold text-green-700 mb-4">Мої оголошення</h2>
        {loading ? (
          <p className="text-gray-600">Завантаження…</p>
        ) : plants.length === 0 ? (
          <p className="text-gray-600">У вас немає оголошень.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {plants.map((p) => (
              <div key={p.id} className="bg-white rounded-lg shadow p-4 transition hover:shadow-lg">
                <div className="relative w-full h-44 mb-3 rounded overflow-hidden">
                  <Image src={p.photo} alt={p.name} fill className="object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-green-800">{p.name}</h3>
                <p className="text-gray-800">{p.description}</p>
                <p className="mt-2 font-semibold text-green-700">{p.price} ₴</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => deletePlant(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => openEditPlant(p)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}

      {showEditPlant && plantToEdit && (
        <EditPlantModal
          plant={plantToEdit}
          onClose={() => setShowEditPlant(false)}
          onPlantSaved={onPlantSaved}
        />
      )}

      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-full shadow-lg animate-fadeInOut z-50">
          🌱 Оголошення успішно видалено!
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fadeInOut {
          animation: fadeInOut 3s ease-in-out;
        }
      `}</style>
    </main>
  );
}
