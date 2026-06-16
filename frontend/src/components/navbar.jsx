import { Moon, Sun, UserCircle } from "lucide-react";
import logo from "../assets/logo.png";

function Navbar({
  isDark,
  theme,
  setTheme,
  page,
  setPage,
  isLoggedIn,
  setIsLoggedIn,
  auth,
  setAuth,
}) {
  function handleLogout() {
    localStorage.removeItem("fitai_auth");
    localStorage.removeItem("fitai_user");
    setAuth?.(null);
    setIsLoggedIn(false);
    setPage("planner");
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${
        isDark
          ? "bg-[#050816]/90 border-white/10"
          : "bg-white/90 border-slate-200"
      }`}
    >
      <div className="w-full px-4 md:px-8 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="h-11 w-11 md:h-14 md:w-14 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={logo}
              alt="FitAI Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none">
              FitAI
            </h1>
            <p
              className={`text-xs md:text-sm truncate ${
                isDark ? "text-gray-400" : "text-slate-500"
              }`}
            >
              Smart Diet & Fitness Planner
            </p>
          </div>
        </div>

        <div
          className={`hidden lg:flex items-center gap-2 rounded-full p-1 border ${
            isDark
              ? "bg-white/10 border-white/10"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          <NavTab page={page} setPage={setPage} value="planner" label="Planner" />
          <NavTab page={page} setPage={setPage} value="dashboard" label="Dashboard" />
          <NavTab page={page} setPage={setPage} value="blogs" label="Blogs" />
          <NavTab page={page} setPage={setPage} value="database" label="Database" />
          <NavTab page={page} setPage={setPage} value="history" label="History" />
          <NavTab page={page} setPage={setPage} value="about" label="About" />
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn && (
            <div
              className={`flex items-center gap-2 text-sm ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              <UserCircle size={18} />
              <span className="font-bold">{auth?.user?.username}</span>
            </div>
          )}

          {!isLoggedIn ? (
            <button
              type="button"
              onClick={() => setPage("login")}
              className="bg-emerald-400 text-slate-950 font-black px-5 py-2 rounded-full hover:bg-emerald-300 transition"
            >
              Login
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500/20 text-red-300 font-bold px-5 py-2 rounded-full"
            >
              Logout
            </button>
          )}

          <ThemeSwitch isDark={isDark} theme={theme} setTheme={setTheme} />
        </div>
      </div>

      <div className="lg:hidden px-4 pb-3">
        <div
          className={`flex gap-2 overflow-x-auto rounded-2xl p-1 no-scrollbar ${
            isDark ? "bg-white/10" : "bg-slate-100"
          }`}
        >
          <NavTab page={page} setPage={setPage} value="planner" label="Plan" />
          <NavTab page={page} setPage={setPage} value="dashboard" label="Dash" />
          <NavTab page={page} setPage={setPage} value="blogs" label="Blog" />
          <NavTab page={page} setPage={setPage} value="database" label="Data" />
          <NavTab page={page} setPage={setPage} value="history" label="Log" />
          <NavTab page={page} setPage={setPage} value="about" label="About" />
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
          {!isLoggedIn ? (
            <button
              type="button"
              onClick={() => setPage("login")}
              className="bg-emerald-400 text-slate-950 font-black py-2.5 rounded-2xl text-sm"
            >
              Login
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500/20 text-red-300 font-bold py-2.5 rounded-2xl text-sm"
            >
              Logout
            </button>
          )}

          <ThemeSwitch isDark={isDark} theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </nav>
  );
}

function NavTab({ page, setPage, value, label }) {
  const active = page === value;

  return (
    <button
      type="button"
      onClick={() => setPage(value)}
      className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
        active
          ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20"
          : "text-gray-400 hover:text-emerald-300"
      }`}
    >
      {label}
    </button>
  );
}

function ThemeSwitch({ isDark, theme, setTheme }) {
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`relative h-10 w-24 rounded-full border transition shrink-0 ${
        isDark ? "bg-white/10 border-white/10" : "bg-slate-200 border-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-8 w-8 rounded-full bg-emerald-400 transition-all duration-300 flex items-center justify-center ${
          isDark ? "left-1" : "left-[58px]"
        }`}
      >
        {isDark ? (
          <Moon size={16} className="text-slate-950" />
        ) : (
          <Sun size={16} className="text-slate-950" />
        )}
      </span>

      <span
        className={`absolute text-sm font-bold top-2.5 ${
          isDark ? "right-4" : "left-4"
        }`}
      >
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}

export default Navbar;