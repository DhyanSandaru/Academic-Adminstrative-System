// FlashCard.jsx — redesigned to match dashboard screenshot style.
// Shows: icon + title row, large value, optional green "+N" badge.
// The `active` prop adds a blue border (used for the highlighted "Courses" card).
import React from "react";

const THEMES = {
  blue: { icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  purple: { icon: "text-purple-600", badge: "bg-purple-100 text-purple-700" },
  green: { icon: "text-green-600", badge: "bg-green-100 text-green-700" },
  red: { icon: "text-red-600", badge: "bg-red-100 text-red-700" },
  yellow: { icon: "text-yellow-600", badge: "bg-yellow-100 text-yellow-700" },
};

export default function FlashCard({
  icon: Icon,
  title,
  value,
  theme = "blue",
  changedNo,     // e.g. "+2"
  active = false // highlighted blue-border state
}) {
  const t = THEMES[theme] || THEMES.blue;

  return (
    <div
      className={`
        bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm
        transition-all duration-200
        ${active ? "border-2 border-blue-500" : "border border-gray-100"}
      `}
    >
      {/* Icon + title */}
      <div className="flex items-center gap-2">
        <div className={`${t.icon}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>

      {/* Value + badge */}
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900 leading-none">
          {value}
        </span>
        {changedNo && (
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            {changedNo}
          </span>
        )}
      </div>
    </div>
  );
}
