function MiniFeature({ isDark, icon, title, text }) {
  return (
    <div className={isDark ? "bg-black/25 rounded-[1.5rem] p-4" : "bg-slate-100 rounded-[1.5rem] p-4"}>
      <div className="text-emerald-400 mb-2">{icon}</div>
      <h4 className="font-black">{title}</h4>
      <p className={isDark ? "text-sm text-gray-400" : "text-sm text-slate-500"}>{text}</p>
    </div>
  );
}

export default MiniFeature;