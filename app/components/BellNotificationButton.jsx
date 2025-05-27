"use client";

import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import OrderNotificationsModal from "./OrderNotificationsModal";

export default function BellNotificationButton() {
  const [orders, setOrders]       = useState([]);       // завжди масив
  const [modalOpen, setModalOpen] = useState(false);

  // Завантажуємо “нові” замовлення
  const fetchOrders = async () => {
    try {
      const res  = await fetch("/api/orders?seller=new");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Помилка завантаження сповіщень", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Закриваємо модалку та оновлюємо лічильник
  const handleClose = () => {
    setModalOpen(false);
    fetchOrders();
  };

  const count = orders.length;

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="relative text-green-700 hover:text-green-800"
        title="Нові замовлення"
      >
        <FaBell size={22} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {count}
          </span>
        )}
      </button>

      {modalOpen && <OrderNotificationsModal onClose={handleClose} />}
    </>
  );
}
