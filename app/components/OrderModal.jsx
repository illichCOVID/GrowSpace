'use client';

import { useState } from 'react';
import { useCart }    from '../context/CartContext';

export default function OrderModal({ onClose, onOrderSaved }) {
  const { items, clearCart, total } = useCart();
  const [form,   setForm]   = useState({ fullName: '', phone: '', city: '', branch: '' });
  const [error,  setError]  = useState('');
  const [loading,setLoading]= useState(false);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, items, total })
      });
      if (!res.ok) throw new Error(await res.text());

      clearCart();
      onOrderSaved();
      alert('Дякуємо! Ваше замовлення збережено.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Помилка при збереженні замовлення');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-red-600 text-2xl"
        >✕</button>

        <h2 className="text-2xl font-bold mb-4 text-center">Оформити замовлення</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'fullName', label: 'ПІБ', type: 'text' },
            { name: 'phone',    label: 'Телефон', type: 'tel' },
            { name: 'city',     label: 'Місто', type: 'text' },
            { name: 'branch',   label: 'Відділення “Нова Пошта”', type: 'text' }
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium">{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          ))}

          <div className="text-right font-semibold">
            Сума: <span className="text-green-700">{total}₴</span>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Зберігаю…' : 'Зберегти замовлення'}
          </button>
        </form>
      </div>
    </div>
  );
}
