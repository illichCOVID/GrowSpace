// app/components/CartModal.jsx
'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import OrderModal from './OrderModal';

export default function CartModal({ onClose }) {
  const { items, changeQuantity, clearCart, total } = useCart();
  const [showOrder, setShowOrder] = useState(false);

  const handleOrderSaved = () => {
    // після збереження замовлення: закриваємо обидві модалки й очищаємо кошик
    setShowOrder(false);
    onClose();
    clearCart();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg relative">
          {/* Закрити кошик */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-700 hover:text-red-600 text-2xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-4 text-green-800 text-center">
            🛒 Ваш кошик
          </h2>

          {items.length === 0 ? (
            <p className="text-center text-gray-600">Кошик порожній</p>
          ) : (
            <>
              {/* Список товарів */}
              <ul className="space-y-4 max-h-80 overflow-y-auto">
                {items.map(item => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium text-green-800">{item.name}</p>
                      <p className="text-sm text-gray-800">
                        {item.price}₴ × {item.quantity} ={' '}
                        {item.price * item.quantity}₴
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => changeQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center border rounded text-gray-800"
                      >
                        –
                      </button>
                      <span className="w-5 text-center text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => changeQuantity(item.id, +1)}
                        className="w-6 h-6 flex items-center justify-center border rounded text-gray-800"
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Підсумок */}
              <div className="mt-4 flex justify-between text-lg font-semibold text-gray-800">
                <span>Всього:</span>
                <span>{total}₴</span>
              </div>

              {/* Кнопки */}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={clearCart}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
                >
                  Очистити
                </button>
                <button
                  onClick={() => setShowOrder(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Оформити замовлення
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Модалка оформлення */}
      {showOrder && (
        <OrderModal
          onClose={() => setShowOrder(false)}
          onOrderSaved={handleOrderSaved}
        />
      )}
    </>
  );
}
