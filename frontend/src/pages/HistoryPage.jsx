import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, LogIn, XCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

function HistoryPage({ auth, isLoggedIn, isDark, setPage }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadHistory() {
    if (!auth?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/progress`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      alert("Could not load history");
      console.log(err);
    }
    setLoading(false);
  }

  useEffect(() => { loadHistory(); }, [auth?.token]);

  if (!isLoggedIn) {
    return (
      <section className="max-w-7xl mx-auto flex justify-center">
        <div className={`rounded-[2rem] border p-10 ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200 shadow-xl"}`}>
          <LogIn size={46} className="mx-auto text-emerald-400 mb-5" />
          <h2 className="text-4xl font-black mb-4">Login to view history</h2>
          <p className={isDark ? "text-slate-300 mb-6" : "text-slate-600 mb-6"}>Your calendar-wise diet and workout history is personal, so it is available only after login.</p>
          <button onClick={() => setPage("login")} className="bg-emerald-400 text-slate-950 font-black px-7 py-3 rounded-2xl">Login / Register</button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-4xl font-black flex items-center gap-3"><CalendarDays className="text-emerald-400" /> Progress History</h2>
          <p className={isDark ? "text-gray-400" : "text-slate-500"}>Calendar-wise tracking for your diet and workout completion.</p>
        </div>
        <button onClick={loadHistory} className="bg-emerald-400 text-black font-black px-5 py-3 rounded-2xl">Refresh</button>
      </div>

      {loading ? (
        <p className={isDark ? "text-slate-300" : "text-slate-600"}>Loading history...</p>
      ) : logs.length === 0 ? (
        <div className={`rounded-[2rem] border p-10 text-center ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200"}`}>
          <h3 className="text-3xl font-black mb-3">No progress saved yet</h3>
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>Go to Dashboard and mark your first day.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {logs.map((log) => (
            <div key={log.id} className={`rounded-2xl p-5 border ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200"}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-black text-xl">{log.tracked_date}</h3>
                  <p className={isDark ? "text-gray-400" : "text-slate-500"}>Score: {log.score}%</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-400 font-black text-sm">{log.score}%</span>
              </div>
              <div className="space-y-2">
                <Status label="Diet" value={log.followed_diet} />
                <Status label="Workout" value={log.workout_done} />
              </div>
              {log.notes && <p className={isDark ? "mt-4 text-slate-300 leading-7" : "mt-4 text-slate-600 leading-7"}>{log.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Status({ label, value }) {
  return <p className="flex items-center gap-2 font-bold">{value ? <CheckCircle2 size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-red-400" />} {label}: {value ? "Done" : "Missed"}</p>;
}

export default HistoryPage;
