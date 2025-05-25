// app/components/CategoryFilter.jsx
"use client";

export default function CategoryFilter({
  categories,
  selected,
  onChange,
  className = "",
}) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={
            (selected === cat.value
              ? "bg-green-600 text-white"
              : "bg-white text-green-600 border border-green-600") +
            " rounded-full px-3 py-1 text-sm transition"
          }
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
