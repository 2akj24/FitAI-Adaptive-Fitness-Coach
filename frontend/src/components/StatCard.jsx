function StatCard({ isDark, icon, title, value }) {
  return (
    <div className={`rounded-[1.5rem] p-5 border ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="text-emerald-400 mb-3">{icon}</div>
      <p className={isDark ? "text-gray-400 text-sm" : "text-slate-500 text-sm"}>{title}</p>
      <h3 className="text-2xl font-black mt-1">{value}</h3>
    </div>
  );
}

export default StatCard;