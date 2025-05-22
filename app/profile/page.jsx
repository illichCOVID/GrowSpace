// app/profile/page.jsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import EditProfileModal from '../components/EditProfileModal';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [plants, setPlants] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Завантажити інформацію про користувача
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error('Не вдалося отримати профіль');
        const { user: dataUser } = await res.json();
        setUser(dataUser);
      } catch (err) {
        console.error('fetchUser error:', err);
        setError('Не вдалося завантажити дані користувача');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Після успішного завантаження користувача — завантажити тільки його рослини
  useEffect(() => {
    if (!user) return;
    const fetchUserPlants = async () => {
      try {
        const res = await fetch('/api/my-plants');
        if (!res.ok) throw new Error('Не вдалося отримати ваші рослини');
        const data = await res.json();
        setPlants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('fetchUserPlants error:', err);
        setError('Не вдалося завантажити ваші рослини');
      }
    };
    fetchUserPlants();
  }, [user]);

  const deletePlant = async (id) => {
    const confirmed = confirm('Ви впевнені, що хочете видалити цю рослину?');
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/plants/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося видалити рослину');
      setPlants(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('deletePlant error:', err);
      setError('Помилка при видаленні');
    }
  };

  if (loading) {
    return <p className="p-6">Завантаження...</p>;
  }

  return (
    <main className="p-6 bg-green-50 min-h-screen">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border">
            <Image
              src={user?.avatar || '/default-avatar.png'}
              alt="Аватар"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800">{user?.name}</h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-700">{user?.bio || 'Опис відсутній'}</p>
            <p className="text-sm text-gray-700">🌱 Досвід: {user?.experience || 'Не вказано'}</p>
          </div>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex items-center gap-2"
        >
          ✏️ Редагувати
        </button>
      </div>

      <h2 className="text-xl font-bold text-green-700 mb-4">Ваші рослини</h2>

      {plants.length === 0 ? (
        <p className="text-gray-600">У вас ще немає рослин</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {plants.map(plant => (
            <div key={plant.id} className="bg-white rounded-xl shadow p-4 relative">
              <div className="relative w-full aspect-[16/10] mb-3 rounded overflow-hidden">
                <Image src={plant.photo} alt={plant.name} fill className="object-cover" />
              </div>
              <h3 className="text-green-700 font-semibold text-lg">{plant.name}</h3>
              <p className="text-sm text-gray-600">{plant.description}</p>
              <p className="text-sm mt-1 text-gray-800 font-medium">Ціна: {plant.price} грн</p>

              <div className="absolute right-3 bottom-3 flex gap-2">
                <button
                  onClick={() => deletePlant(plant.id)}
                  className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                >
                  Видалити
                </button>
                <button className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600">
                  Редагувати
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
    </main>
  );
}
