import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/navbar";
import PlannerPage from "./pages/PlannerPage";
import DashboardPage from "./pages/DashboardPage";
import DatabasePage from "./pages/DatabasePage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import BlogsPage from "./pages/BlogsPage";
import About from "./pages/About";
import Footer from "./components/Footer";
import "./index.css";

function App() {
  const [theme, setTheme] = useState("dark");
  const [page, setPage] = useState("planner");
  const [activeDay, setActiveDay] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fitai_auth")) || null;
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(auth?.token));
  const [plan, setPlan] = useState(null);
  const [rawPlan, setRawPlan] = useState(null);
  const [userId, setUserId] = useState(auth?.user?.id || null);

  const [form, setForm] = useState({
    age: auth?.user?.age || "",
    weight: auth?.user?.weight || "",
    height: auth?.user?.height || "",
    goal: auth?.user?.goal || "fat_loss",
    diet_type: auth?.user?.diet_type || "veg",
    activity_level: auth?.user?.activity_level || "low",
    budget: auth?.user?.budget || "low",
    region: auth?.user?.region || "north",
    time_pref: auth?.user?.time_pref || "quick",
  });

  const isDark = theme === "dark";

  useEffect(() => {
    setIsLoggedIn(Boolean(auth?.token));
    setUserId(auth?.user?.id || null);

    if (auth?.token) {
      setShowLoginPrompt(false);
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.token) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [auth?.token]);

  const bmi = useMemo(() => {
    if (!form.weight || !form.height) return "--";
    const h = Number(form.height) / 100;
    return (Number(form.weight) / (h * h)).toFixed(1);
  }, [form.weight, form.height]);

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-[#050816] text-white"
          : "min-h-screen bg-[#f5f7fb] text-slate-950"
      }
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <Navbar
        isDark={isDark}
        theme={theme}
        setTheme={setTheme}
        page={page}
        setPage={setPage}
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
        auth={auth}
        setAuth={setAuth}
      />

      {showLoginPrompt && !isLoggedIn && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-5">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLoginPrompt(false)}
          />

          <div
            className={`relative w-full max-w-md rounded-[2rem] border p-7 shadow-2xl ${
              isDark
                ? "bg-[#0b1020]/95 border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-950"
            }`}
          >
            <button
              type="button"
              onClick={() => setShowLoginPrompt(false)}
              className={`absolute right-5 top-5 h-10 w-10 rounded-full flex items-center justify-center font-black transition ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              ✕
            </button>

            <div className="mb-5">
              
              <h2 className="text-3xl font-black mb-3">
                Login to track your progress
              </h2>

              <p
                className={`leading-7 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Register/login to save your diet progress, workout
                completion, calendar history, and access personalized dashboard data.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowLoginPrompt(false);
                setPage("login");
              }}
              className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-black text-slate-950 hover:bg-emerald-300 transition"
            >
              Register / Login
            </button>
          </div>
        </div>
      )}

      <main className="relative z-10 px-5 md:px-8 py-10">
        {page === "planner" && (
          <PlannerPage
            isDark={isDark}
            form={form}
            setForm={setForm}
            plan={plan}
            setPlan={setPlan}
            rawPlan={rawPlan}
            setRawPlan={setRawPlan}
            setUserId={setUserId}
            bmi={bmi}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
          />
        )}

        {page === "dashboard" && (
          <DashboardPage
            auth={auth}
            isLoggedIn={Boolean(auth?.token)}
            setPage={setPage}
            plan={plan}
            rawPlan={rawPlan}
            isDark={isDark}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
          />
        )}

        {page === "database" && <DatabasePage isDark={isDark} />}

        {page === "blogs" && <BlogsPage isDark={isDark} />}

        {page === "about" && <About isDark={isDark} />}

        {page === "history" && (
          <HistoryPage
            auth={auth}
            isLoggedIn={isLoggedIn}
            setPage={setPage}
            isDark={isDark}
          />
        )}

        {page === "login" && (
          <LoginPage
            isDark={isDark}
            setAuth={setAuth}
            setIsLoggedIn={setIsLoggedIn}
            setPage={setPage}
          />
        )}
      </main>

      <Footer isDark={isDark} setPage={setPage} />
    </div>
  );
}

export default App;