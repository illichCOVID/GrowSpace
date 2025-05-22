// app/components/SearchBar.jsx
"use client";

export default function SearchBar({ value, onChange, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Пошук рослини..."
        className="
          w-full pl-10 pr-4 py-2
          bg-white border border-green-300 rounded-full
          text-gray-900 placeholder-gray-600
          focus:outline-none focus:border-green-500
          transition
        "
      />
    </div>
  );
}
