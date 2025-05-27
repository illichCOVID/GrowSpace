// app/components/BellNotificationButton.jsx
"use client";

import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import OrderNotificationsModal from "./OrderNotificationsModal";

export default function BellNotificationButton() {
  const [showModal, setShowModal]     = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Завантажуємо тільки нові замовлення для лічильника
  const fetchCount = async () => {
    try {
      const res  = await fetch("/api/orders?status=new");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUnreadCount(data.length);
      } else {
        setUnreadCount(0);
      }
    } catch {
      setUnreadCount(0);
    }
  };

  // Підтягуємо кількість при монтуванні та щоразу, коли закриваємо модалку
  useEffect(() => {
    fetchCount();
  }, [showModal]);

  // Закриття модалки — скидаємо лічильник
  const handleClose = () => {
    setShowModal(false);
    setUnreadCount(0);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="relative text-green-700 hover:text-green-800"
      >
        <FaBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showModal && <OrderNotificationsModal onClose={handleClose} />}
    </>
  );
}
