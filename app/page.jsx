"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import SearchBar      from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import SortSelect     from "./components/SortSelect";
import { useCart }    from "./context/CartContext";

export default function Home() {
  // дані
  const [plants, setPlants] = useState([]);
  const [user,   setUser]   = useState(null);

  // кошик
  const { addToCart } = useCart();

  // фільтри / сортування
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [category,   setCategory]   = useState("");

  const categories = [
    { value: "",           label: "Усі" },
    { value: "кімнатні",   label: "🌼 Кімнатні" },
    { value: "декоративні",label: "🌸 Декоративні" },
    { value: "дерева",     label: "🌳 Дерева" },
    { value: "овочі",      label: "🥬 Овочеві" },
  ];

  // завантаження первинних даних
  useEffect(() => {
    fetch("/api/plants")
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setPlants(data) : setPlants([]));

    fetch("/api/me")
      .then(r => r.json())
      .then(d => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  // фільтрація + сортування
  const filtered = plants
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => !category || p.category === category);

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === "priceAsc")  return a.price - b.price;
    if (sortOption === "priceDesc") return b.price - a.price;
    if (sortOption === "nameAsc")   return a.name.localeCompare(b.name, "uk");
    if (sortOption === "nameDesc")  return b.name.localeCompare(a.name, "uk");
    return 0;
  });

  return (
    <main className="p-6 bg-green-50 min-h-screen space-y-6">
      {/* Toolbar з пошуком, фільтром та сортуванням */}
      <div className="flex items-center gap-4">
        {/* Пошук */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          className="w-1/4"
        />

        {/* Фільтр категорій */}
        <CategoryFilter
          categories={categories}
          selected={category}
          onChange={setCategory}
          className="flex-auto flex justify-center"
        />

        {/* Сортування */}
        <SortSelect
          value={sortOption}
          onChange={setSortOption}
          className="w-32"
        />
      </div>

      {/* Сітка карток рослин */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {sorted.map(plant => (
          <div
            key={plant.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="relative w-full aspect-[16/10] mb-4 overflow-hidden rounded">
              <Image
                src={plant.photo}
                alt={plant.name}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-xl font-bold text-green-700">{plant.name}</h3>
            <p className="text-gray-800">{plant.description}</p>
            <p className="text-sm italic mt-1 text-gray-600">
              Догляд: {plant.care}
            </p>

            {/* Продавець */}
            <div className="mt-2 text-sm text-gray-800">
              Продавець: <span className="font-medium">{plant.seller?.name || "—"}</span>
            </div>
            {/* Контакт */}
            <div className="text-sm text-gray-800 mb-2">
              Контакт: <span className="font-medium">{plant.seller?.email || plant.phone}</span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() =>
                  addToCart({
                    id:        plant.id,
                    name:      plant.name,
                    price:     plant.price,
                    quantity:  1,
                    sellerId:  plant.sellerId,
                  })
                }
                className="bg-green-600 text-white rounded-full px-4 py-2 hover:bg-green-700 transition"
              >
                Купити
              </button>
              <span className="font-semibold text-green-800">
                {plant.price} грн
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
