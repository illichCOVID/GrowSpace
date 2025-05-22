'use client';

import { useEffect, useState } from 'react';
import { useCart }          from '../../context/CartContext'; // або хук /api/me
import Link                 from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser]     = useState(null);

  useEffect(() => {
    // 1) Отримати поточного користувача
    fetch('/api/me')
      .then(r => r.json())
      .then(d => {
        setUser(d.user);
        return d.user?.id;
      })
      .then(id => {
        // 2) Завантажити його замовлення
        if (id) {
          fetch(`/api/orders?sellerId=${id}`)
            .then(r => r.json())
            .then(setOrders);
        }
      });
  }, []);

  if (!user) return <p>Завантаження...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Мої замовлення</h1>
      {orders.length === 0 ? (
        <p>Немає нових замовлень</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(o => (
            <li key={o.id} className="border rounded-lg p-4 shadow">
              <p><strong>Замовник:</strong> {o.buyerName}, {o.buyerPhone}</p>
              <p><strong>Адреса:</strong> {o.city}, відділення {o.branch}</p>
              <p className="mt-2"><strong>Товари:</strong></p>
              <ul className="list-disc list-inside">
                {o.items.map((it, i) => (
                  <li key={i}>{`${it.name} × ${it.quantity} = ${it.price*it.quantity}₴`}</li>
                ))}
              </ul>
              <p className="mt-2"><strong>Сума:</strong> {o.total}₴</p>
              <p className="text-sm text-gray-500">Дата: {new Date(o.createdAt).toLocaleString('uk-UA')}</p>
            </li>
          ))}
        </ul>
      )}
      <Link href="/" className="mt-6 inline-block text-green-600 hover:underline">
        ← Повернутися на головну
      </Link>
    </main>
  );
}
