function BmiMeter({ bmi = "--", category = "Not calculated", isDark }) {
  const numericBmi = Number(bmi);
  const safeBmi = Number.isFinite(numericBmi) ? numericBmi : 0;

  const percentage = Math.min(Math.max(((safeBmi - 10) / 30) * 100, 0), 100);

  return (
    <div className={`rounded-[1.75rem] p-6 border ${
      isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-black">BMI Meter</h3>
          <p className={isDark ? "text-gray-400" : "text-slate-500"}>
            Body mass index estimate
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-black">{bmi}</p>
          <p className="text-emerald-400 font-bold">{category}</p>
        </div>
      </div>

      <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-cyan-400 via-emerald-400 via-yellow-300 to-red-400">
        <div
          className="absolute -top-1 h-6 w-2 rounded-full bg-white shadow-lg transition-all"
          style={{ left: `calc(${percentage}% - 4px)` }}
        />
      </div>

      <div className={`flex justify-between text-xs mt-3 ${
        isDark ? "text-gray-400" : "text-slate-500"
      }`}>
        <span>Under</span>
        <span>Healthy</span>
        <span>Over</span>
        <span>Obese</span>
      </div>
    </div>
  );
}

export default BmiMeter;