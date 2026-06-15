import { Moon, Sun, UserCircle } from "lucide-react";
import logo from "../assets/logo.png";

function Navbar({ isDark, theme, setTheme, page, setPage, isLoggedIn, setIsLoggedIn, auth, setAuth }) {
  function handleLogout() {
    localStorage.removeItem("fitai_auth");
    localStorage.removeItem("fitai_user");
    setAuth?.(null);
    setIsLoggedIn(false);
    setPage("planner");
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${isDark ? "bg-[#050816]/65 border-white/10" : "bg-white/65 border-slate-200"}`}>
      <div className="w-full px-8 py-2 flex items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center overflow-hidden">
            <img src={logo} alt="FitAI Logo" className="w-12 h-12 object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">FitAI</h1>
            <p className={isDark ? "text-gray-400 text-sm" : "text-slate-500 text-sm"}>Smart Diet & Fitness Planner</p>
          </div>
        </div>

        <div className={`hidden md:flex items-center gap-2 rounded-full p-1 border ${isDark ? "bg-white/10 border-white/10" : "bg-slate-100 border-slate-200"}`}>
          <NavTab page={page} setPage={setPage} value="planner" label="Planner" />
          <NavTab page={page} setPage={setPage} value="dashboard" label="Dashboard" />
          <NavTab page={page} setPage={setPage} value="blogs" label="Blogs" />
          <NavTab page={page} setPage={setPage} value="database" label="Database" />
          <NavTab page={page} setPage={setPage} value="history" label="History" />
          <NavTab page={page} setPage={setPage} value="about" label="About" />
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn && (
            <div className={isDark ? "flex items-center gap-2 text-sm text-slate-300" : "flex items-center gap-2 text-sm text-slate-600"}>
              <UserCircle size={18} />
              <span className="font-bold">{auth?.user?.username}</span>
            </div>
          )}

          {!isLoggedIn ? (
            <button type="button" onClick={() => setPage("login")} className="bg-emerald-400 text-slate-950 font-black px-5 py-2 rounded-full hover:bg-emerald-300 transition">Login</button>
          ) : (
            <button type="button" onClick={handleLogout} className="bg-red-500/20 text-red-300 font-bold px-5 py-2 rounded-full">Logout</button>
          )}
          <ThemeSwitch isDark={isDark} theme={theme} setTheme={setTheme} />
        </div>
      </div>

      <div className="md:hidden px-5 pb-4">
        <div className={`grid grid-cols-4 gap-2 rounded-2xl p-1 ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
          <NavTab page={page} setPage={setPage} value="planner" label="Plan" />
          <NavTab page={page} setPage={setPage} value="dashboard" label="Dash" />
          <NavTab page={page} setPage={setPage} value="blogs" label="Blog" />
          <NavTab page={page} setPage={setPage} value="history" label="Log" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {!isLoggedIn ? (
            <button type="button" onClick={() => setPage("login")} className="bg-emerald-400 text-slate-950 font-black py-2 rounded-2xl">Login</button>
          ) : (
            <button type="button" onClick={handleLogout} className="bg-red-500/20 text-red-300 font-bold py-2 rounded-2xl">Logout</button>
          )}
          <ThemeSwitch isDark={isDark} theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </nav>
  );
}

function NavTab({ page, setPage, value, label }) {
  const active = page === value;
  return <button type="button" onClick={() => setPage(value)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${active ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20" : "text-gray-400 hover:text-emerald-300"}`}>{label}</button>;
}

function ThemeSwitch({ isDark, theme, setTheme }) {
  return (
    <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`relative h-10 w-24 rounded-full border transition ${isDark ? "bg-white/10 border-white/10" : "bg-slate-200 border-slate-300"}`}>
      <span className={`absolute top-1 h-8 w-8 rounded-full bg-emerald-400 transition-all duration-300 flex items-center justify-center ${isDark ? "left-1" : "left-[58px]"}`}>
        {isDark ? <Moon size={16} className="text-slate-950" /> : <Sun size={16} className="text-slate-950" />}
      </span>
      <span className={`absolute text-sm font-bold top-2.5 ${isDark ? "right-4" : "left-4"}`}>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

export default Navbar;
