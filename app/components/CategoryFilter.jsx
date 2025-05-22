// app/components/CategoryFilter.jsx
"use client";

export default function CategoryFilter({
  categories,
  selected,
  onChange,
  className = "",
}) {
  return (
    <div className={`flex items-center justify-center space-x-2 overflow-x-auto ${className}`}>
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`
            flex-shrink-0 px-3 py-1 rounded-full transition
            ${selected === cat.value
              ? "bg-green-600 text-white"
              : "bg-white text-gray-900 border border-green-300 hover:bg-green-100"}
          `}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
