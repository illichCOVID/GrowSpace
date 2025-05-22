// app/components/SortSelect.jsx
"use client";

export default function SortSelect({ value, onChange, className = "" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        ${className}
        appearance-none
        bg-white/50 backdrop-blur-sm
        border border-green-300 rounded-full
        px-4 py-2
        text-green-700
        focus:outline-none focus:ring-2 focus:ring-green-400
        transition
      `}
    >
      <option value="" disabled className="text-green-500">
        Сортувати за
      </option>
      <option value="priceAsc">Ціна ↑</option>
      <option value="priceDesc">Ціна ↓</option>
      <option value="nameAsc">Назва A→Я</option>
      <option value="nameDesc">Назва Я→A</option>
    </select>
  );
}
