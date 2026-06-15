import { ChevronDown } from "lucide-react";

export function Input({ isDark, ...props }) {
  return (
    <input
      required
      {...props}
      className={`h-12 rounded-2xl px-4 py-3 outline-none border text-[15px] ${
        isDark
          ? "bg-black/25 border-white/10 focus:border-emerald-400"
          : "bg-slate-50 border-slate-200 focus:border-emerald-400"
      }`}
    />
  );
}

export function Select({ children, isDark, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`h-12 w-full appearance-none rounded-2xl px-4 pr-10 py-3 outline-none border text-[15px] ${
          isDark
            ? "bg-black/25 border-white/10 focus:border-emerald-400"
            : "bg-slate-50 border-slate-200 focus:border-emerald-400"
        }`}
      >
        {children}
      </select>

      <ChevronDown
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-45"
        size={16}
        strokeWidth={2}
      />
    </div>
  );
}