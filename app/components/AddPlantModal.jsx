// app/components/AddPlantModal.jsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { inputStyle } from '@/utils/tailwindStyles';

export default function AddPlantModal({ onClose, onPlantAdded }) {
  const [formData, setFormData] = useState({
    name:        '',
    description: '',
    care:        '',
    price:       ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Завантажуємо поточного користувача
  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(d => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  // Автозакриття повідомлення про помилку
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(''), 3000);
    return () => clearTimeout(t);
  }, [error]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = e => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Оберіть фото для рослини');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('name',        formData.name);
      payload.append('description', formData.description);
      payload.append('care',        formData.care);
      payload.append('price',       formData.price);
      payload.append('photo',       selectedFile);
      // Для простоти використовуємо email як “контакт”
      payload.append('phone', user?.email || 'Невідомо');

      const res = await fetch('/api/plants', {
        method: 'POST',
        body: payload
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Помилка додавання');

      onPlantAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-3xl animate-fadeInScale relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Банер */}
          <div className="hidden md:block md:w-1/2">
            <Image
              src="/plant-banner.jpg"
              alt="Додати рослину"
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Форма */}
          <div className="w-full md:w-1/2 p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
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
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-2xl file:border-0
                           file:text-sm file:font-semibold
                           file:bg-green-100 file:text-green-700
                           hover:file:bg-green-200 cursor-pointer"
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
                className="w-full bg-gradient-to-r from-green-500 to-green-600
                           hover:from-green-600 hover:to-green-700
                           text-white py-2 rounded-2xl font-semibold
                           transition disabled:opacity-50"
              >
                {loading ? 'Додаємо...' : 'Додати рослину'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
