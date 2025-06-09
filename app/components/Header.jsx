"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

import LoginModal from "./LoginModal";
import AddPlantModal from "./AddPlantModal";
import CartModal from "./CartModal";
import BellNotificationButton from "./BellNotificationButton";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { user, setUser } = useUser();
  const { items, changeQuantity, total } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-green-100 shadow relative">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-green-800">GrowSpace</h1>
          <Link
            href="/"
            className="text-green-800 border border-green-300 rounded-xl px-3 py-1 hover:bg-green-200 transition"
          >
            Home
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl px-4 py-2 font-semibold shadow-md transition"
            >
              + Sell your plant
            </button>
          )}

          {user && <BellNotificationButton />}

          <button
            onClick={() => setCartOpen(true)}
            className="relative text-green-700 hover:text-green-800"
          >
            <FaShoppingCart size={22} />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center space-x-2 text-green-800 border border-green-300 rounded-full px-3 py-1 hover:bg-green-200 transition"
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-6 h-6 rounded-full object-cover border"
                />
                <span className="font-medium">{user.name}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg py-2 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-green-800 hover:bg-green-100"
                  >
                    Профіль
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Вийти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsRegistering(false);
                  setShowAuthModal(true);
                }}
                className="text-green-800 border border-green-300 rounded-xl px-3 py-1 hover:bg-green-200 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsRegistering(true);
                  setShowAuthModal(true);
                }}
                className="text-green-800 border border-green-300 rounded-xl px-3 py-1 hover:bg-green-200 transition"
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {showAuthModal && (
        <LoginModal
          onClose={() => setShowAuthModal(false)}
          isRegistering={isRegistering}
          switchMode={() => setIsRegistering((prev) => !prev)}
          onLoginSuccess={() => {
            setShowAuthModal(false);
            fetch("/api/me")
              .then((res) => res.json())
              .then((d) => setUser(d.user));
          }}
        />
      )}

      {showAddModal && (
        <AddPlantModal
          onClose={() => setShowAddModal(false)}
          onPlantAdded={() => window.location.reload()}
        />
      )}

      {cartOpen && (
        <CartModal
          items={items}
          onQuantityChange={changeQuantity}
          total={total}
          onClose={() => setCartOpen(false)}
        />
      )}
    </>
  );
}
