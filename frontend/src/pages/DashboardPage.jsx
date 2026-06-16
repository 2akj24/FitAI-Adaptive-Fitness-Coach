import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Dumbbell,
  Flame,
  HeartPulse,
  Save,
  Sparkles,
  UserCircle,
} from "lucide-react";
import StatCard from "../components/StatCard";
import MealCard from "../components/MealCard";
import { formatText } from "../utils/helpers";
import BmiMeter from "../components/BmiMeter";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

function DashboardPage({
  auth,
  isLoggedIn,
  setPage,
  plan,
  isDark,
  activeDay = 0,
  setActiveDay = () => {},
}) {
  const [savedPlan, setSavedPlan] = useState(plan || null);
  const [dashboard, setDashboard] = useState(null);
  const [localAuth, setLocalAuth] = useState({ token: null, user: null });

  const [progress, setProgress] = useState({
    tracked_date: new Date().toISOString().slice(0, 10),
    followed_diet: false,
    workout_done: false,
    notes: "",
  });

  useEffect(() => {
    const token =
      localStorage.getItem("fitai_token") || localStorage.getItem("token");

    const userRaw =
      localStorage.getItem("fitai_user") || localStorage.getItem("user");

    let user = null;

    try {
      user = userRaw ? JSON.parse(userRaw) : null;
    } catch {
      user = null;
    }

    setLocalAuth({ token, user });
  }, []);

  const token = auth?.token || localAuth.token;
  const loggedUser = auth?.user || localAuth.user;
  const canSave = Boolean(token);

  useEffect(() => {
    if (plan) {
      setSavedPlan(plan);
    }
  }, [plan]);

  useEffect(() => {
    async function loadSavedPlan() {
      const userId = loggedUser?.id;

      if (!userId) return;

      try {
        const res = await fetch(`${API}/api/user-plan/${userId}`);
        const data = await res.json();

        if (data.plan) {
          setSavedPlan(data.plan);
        }
      } catch (err) {
        console.log("Could not load saved plan", err);
      }
    }

    loadSavedPlan();
  }, [loggedUser?.id]);

  async function loadDashboard() {
    if (!token) return;

    try {
      const res = await fetch(`${API}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setDashboard(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [token]);

  async function saveTodayProgress(e) {
    e.preventDefault();

    if (!canSave) {
      setPage("login");
      return;
    }

    try {
      const res = await fetch(`${API}/api/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(progress),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not save progress");
        return;
      }

      alert("Progress saved");
      loadDashboard();
    } catch (err) {
      alert("Backend not reachable");
      console.log(err);
    }
  }

  const user = dashboard?.user || loggedUser || {};
  const stats = dashboard?.stats || {};
  const selectedDay = savedPlan?.diet_plan?.[activeDay];

  return (
    <section className="max-w-7xl mx-auto space-y-8">
      {!canSave && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-400/30 p-4 text-amber-300 font-semibold">
          You are using guest mode. You can view your dashboard and plan, but
          login is required to save daily progress.
        </div>
      )}

      <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-black rounded-[2rem] p-8 shadow-2xl shadow-emerald-400/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="font-bold flex items-center gap-2">
              <Sparkles size={18} />
              Welcome, @{user.username || "guest"}
            </p>

            <h2 className="text-4xl font-black mt-2">
              Your Profile Dashboard
            </h2>

            <p className="mt-3 text-lg max-w-3xl">
              View your personalized diet and workout plan. Login to save your
              calendar-wise diet and workout progress.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <SummaryPill label="Goal" value={formatText(user.goal || savedPlan?.summary?.goal)} />
            <SummaryPill label="BMI" value={stats.bmi || savedPlan?.summary?.bmi || "--"} />
            <SummaryPill label="Streak" value={`${stats.streak || 0} days`} />
            <SummaryPill label="Avg Score" value={`${stats.average_score || 0}%`} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard isDark={isDark} icon={<CalendarCheck />} title="Tracked Days" value={stats.total_days || 0} />
        <StatCard isDark={isDark} icon={<Flame />} title="Diet Done" value={`${stats.diet_percent || 0}%`} />
        <StatCard isDark={isDark} icon={<Dumbbell />} title="Workout Done" value={`${stats.workout_percent || 0}%`} />
        <StatCard
          isDark={isDark}
          icon={<HeartPulse />}
          title="BMI Category"
          value={stats.bmi_category || savedPlan?.summary?.bmi_category || "--"}
        />
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className={`rounded-[2rem] p-6 border ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200"}`}>
          <div className="flex items-center gap-3 mb-5">
            <UserCircle className="text-emerald-400" />
            <h3 className="text-3xl font-black">User Profile</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ProfileItem label="Name" value={user.name || "Guest User"} isDark={isDark} />
            <ProfileItem label="Username" value={user.username ? `@${user.username}` : "@guest"} isDark={isDark} />
            <ProfileItem label="Email" value={user.email || "Not logged in"} isDark={isDark} />
            <ProfileItem label="Diet" value={formatText(user.diet_type || savedPlan?.summary?.diet_type)} isDark={isDark} />
            <ProfileItem label="Budget" value={formatText(user.budget || savedPlan?.summary?.budget)} isDark={isDark} />
            <ProfileItem label="Region" value={formatText(user.region || savedPlan?.summary?.region)} isDark={isDark} />
          </div>
        </div>

        <form onSubmit={saveTodayProgress} className={`rounded-[2rem] p-6 border ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200"}`}>
          <h3 className="text-3xl font-black mb-2">Mark Daily Progress</h3>

          <p className={isDark ? "text-slate-400 mb-5" : "text-slate-500 mb-5"}>
            Select date and save whether you followed your diet and workout.
          </p>

          <input
            type="date"
            value={progress.tracked_date}
            onChange={(e) => setProgress({ ...progress, tracked_date: e.target.value })}
            className={inputClass(isDark)}
          />

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <ToggleBox
              isDark={isDark}
              label="Followed diet today"
              checked={progress.followed_diet}
              onChange={(v) => setProgress({ ...progress, followed_diet: v })}
            />

            <ToggleBox
              isDark={isDark}
              label="Workout completed"
              checked={progress.workout_done}
              onChange={(v) => setProgress({ ...progress, workout_done: v })}
            />
          </div>

          <textarea
            value={progress.notes}
            onChange={(e) => setProgress({ ...progress, notes: e.target.value })}
            placeholder="Optional notes"
            rows={3}
            className={`${inputClass(isDark)} mt-4 resize-none`}
          />

          <button
            type="submit"
            className={`mt-4 inline-flex items-center gap-2 font-black px-6 py-3 rounded-2xl transition ${
              canSave
                ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                : "bg-gray-500/30 text-gray-400 cursor-pointer"
            }`}
          >
            <Save size={18} />
            {canSave ? "Save Progress" : "Login to Save Progress"}
          </button>
        </form>
      </div>

      {(stats.bmi || savedPlan?.summary?.bmi) && (
        <BmiMeter
          bmi={stats.bmi || savedPlan?.summary?.bmi}
          category={stats.bmi_category || savedPlan?.summary?.bmi_category || "Not calculated"}
          isDark={isDark}
        />
      )}

      {savedPlan ? (
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <div className={`rounded-[2rem] p-6 border ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200"}`}>
            <h3 className="text-3xl font-black mb-2">Weekly Meal Calendar</h3>

            <p className={isDark ? "text-gray-400 mb-5" : "text-slate-500 mb-5"}>
              Select a day to view meals in detail.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {(savedPlan?.diet_plan || []).map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveDay(index)}
                  className={`text-left rounded-2xl p-4 border transition ${
                    activeDay === index
                      ? "bg-emerald-400 text-black border-emerald-400"
                      : isDark
                      ? "bg-black/20 border-white/10 hover:bg-white/10"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <p className="font-black">{day.day}</p>
                  <p className={activeDay === index ? "text-black/70 text-sm" : isDark ? "text-gray-400 text-sm" : "text-slate-500 text-sm"}>
                    {day.total_calories || 0} kcal • {day.total_protein || 0}g
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] p-6 border ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200"}`}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-3xl font-black">
                  {selectedDay?.day || "Select Day"}
                </h3>

                <p className={isDark ? "text-emerald-300 mt-1" : "text-emerald-700 mt-1"}>
                  {selectedDay?.motivation || "Your daily meal plan will appear here."}
                </p>
              </div>

              <div className="text-right">
                <p className="font-black">{selectedDay?.total_calories || 0} kcal</p>
                <p className="font-black">{selectedDay?.total_protein || 0}g protein</p>
              </div>
            </div>

            <div className="space-y-3">
              {(selectedDay?.meals || []).map((meal, i) => (
                <MealCard key={i} meal={meal} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={`rounded-[2rem] p-8 border text-center ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200"}`}>
          <h3 className="text-3xl font-black mb-3">No current plan generated</h3>

          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            Go to Planner and generate your personalized plan. Dashboard works
            in guest mode too, but saving progress requires login.
          </p>

          <button
            onClick={() => setPage("planner")}
            className="mt-6 bg-emerald-400 text-slate-950 font-black px-7 py-3 rounded-2xl"
          >
            Generate Plan
          </button>
        </div>
      )}
    </section>
  );
}

function SummaryPill({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/10 p-3">
      <p className="text-xs font-bold opacity-70">{label}</p>
      <p className="font-black">{value || "--"}</p>
    </div>
  );
}

function ProfileItem({ label, value, isDark }) {
  return (
    <div className={`rounded-2xl p-4 ${isDark ? "bg-black/30" : "bg-slate-100"}`}>
      <p className={isDark ? "text-slate-400 text-sm" : "text-slate-500 text-sm"}>
        {label}
      </p>
      <p className="font-black break-words">{value || "--"}</p>
    </div>
  );
}

function ToggleBox({ isDark, label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-2xl border p-4 text-left font-black ${
        checked
          ? "bg-emerald-400 text-slate-950 border-emerald-400"
          : isDark
          ? "bg-black/30 border-white/10"
          : "bg-slate-50 border-slate-200"
      }`}
    >
      {checked ? "✓ " : "○ "}
      {label}
    </button>
  );
}

function inputClass(isDark) {
  return `w-full rounded-2xl border px-5 py-3 outline-none ${
    isDark
      ? "bg-black/30 border-white/10 text-white"
      : "bg-slate-50 border-slate-200 text-slate-950"
  }`;
}

export default DashboardPage;