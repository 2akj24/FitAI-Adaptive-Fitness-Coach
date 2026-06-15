function MealCard({ meal, isDark, compact = false }) {
  return (
    <div className={`rounded-2xl p-4 border ${isDark ? "bg-black/30 border-white/10" : "bg-slate-50 border-slate-200"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={isDark ? "text-sm text-gray-400" : "text-sm text-slate-500"}>{meal.time}</p>
          <h5 className={compact ? "text-lg font-black" : "text-xl font-black"}>{meal.name}</h5>
        </div>
        <span className="rounded-full bg-emerald-400 text-black text-xs font-black px-3 py-1">
          {meal.protein}g P
        </span>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        <span className={isDark ? "rounded-full bg-white/10 px-3 py-1 text-sm" : "rounded-full bg-white px-3 py-1 text-sm border border-slate-200"}>
          {meal.calories} kcal
        </span>

        {meal.reason && (
          <span className={isDark ? "text-xs text-emerald-300 mt-1" : "text-xs text-emerald-700 mt-1"}>
            {meal.reason}
          </span>
        )}
      </div>
    </div>
  );
}

export default MealCard;