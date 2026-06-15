import { useState } from "react";
import { Activity, Lock, Mail, User, AtSign } from "lucide-react";

const API = "http://127.0.0.1:5000";

function LoginPage({ isDark, setAuth, setIsLoggedIn, setPage }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    height: "",
    goal: "fat_loss",
    diet_type: "veg",
    activity_level: "low",
    budget: "low",
    region: "north",
    time_pref: "quick",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login"
        ? { username_or_email: form.username || form.email, password: form.password }
        : form;

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Authentication failed");
        return;
      }

      const authData = { token: data.token, user: data.user };
      localStorage.setItem("fitai_auth", JSON.stringify(authData));
      localStorage.setItem("fitai_user", data.user.email || data.user.username);
      setAuth(authData);
      setIsLoggedIn(true);
      setPage("dashboard");
    } catch (err) {
      alert("Backend not reachable. Check Flask server.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-5 pt-28 pb-12">
      <div className={`w-full max-w-5xl rounded-[2rem] border overflow-hidden grid lg:grid-cols-[0.9fr_1.1fr] ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200 shadow-xl"}`}>
        <div className="bg-gradient-to-br from-emerald-400 to-cyan-400 p-8 md:p-10 text-slate-950">
          <div className="h-16 w-16 rounded-2xl bg-black/10 flex items-center justify-center mb-8">
            <Activity size={34} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">Track your Fitness journey with FitAI.</h1>
          <p className="text-lg leading-8 font-medium text-slate-900/80">
            Create your account to save profile data, track progress and view day-wise history, and build consistency to improve .
          </p>
        </div>

        <div className="p-7 md:p-10">
          <div className="flex gap-3 mb-7">
            <button onClick={() => setMode("login")} className={`flex-1 py-3 rounded-2xl font-black ${mode === "login" ? "bg-emerald-400 text-slate-950" : isDark ? "bg-white/10" : "bg-slate-100"}`}>Login</button>
            <button onClick={() => setMode("register")} className={`flex-1 py-3 rounded-2xl font-black ${mode === "register" ? "bg-emerald-400 text-slate-950" : isDark ? "bg-white/10" : "bg-slate-100"}`}>Register</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <Input isDark={isDark} icon={<User />} placeholder="Full name" value={form.name} onChange={(v) => update("name", v)} />
                <Input isDark={isDark} icon={<AtSign />} placeholder="Unique username" value={form.username} onChange={(v) => update("username", v.toLowerCase().replace(/\s/g, ""))} />
              </>
            )}

            {mode === "login" ? (
              <Input isDark={isDark} icon={<AtSign />} placeholder="Username or email" value={form.username} onChange={(v) => update("username", v)} />
            ) : (
              <Input isDark={isDark} icon={<Mail />} type="email" placeholder="Email address" value={form.email} onChange={(v) => update("email", v)} />
            )}

            <Input isDark={isDark} icon={<Lock />} type="password" placeholder="Password" value={form.password} onChange={(v) => update("password", v)} />

            {mode === "register" && (
              <>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input isDark={isDark} type="number" placeholder="Age" value={form.age} onChange={(v) => update("age", v)} />
                  <Input isDark={isDark} type="number" placeholder="Weight kg" value={form.weight} onChange={(v) => update("weight", v)} />
                  <Input isDark={isDark} type="number" placeholder="Height cm" value={form.height} onChange={(v) => update("height", v)} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Select isDark={isDark} value={form.goal} onChange={(v) => update("goal", v)} options={[['fat_loss','Fat Loss'],['muscle_gain','Muscle Gain'],['maintain','Maintain']]} />
                  <Select isDark={isDark} value={form.diet_type} onChange={(v) => update("diet_type", v)} options={[['veg','Veg'],['nonveg','Non-Veg']]} />
                  <Select isDark={isDark} value={form.activity_level} onChange={(v) => update("activity_level", v)} options={[['low','Low Activity'],['moderate','Moderate Activity'],['high','High Activity']]} />
                  <Select isDark={isDark} value={form.budget} onChange={(v) => update("budget", v)} options={[['low','Low Budget'],['medium','Medium Budget'],['high','High Budget']]} />
                  <Select isDark={isDark} value={form.region} onChange={(v) => update("region", v)} options={[['north','North'],['south','South'],['east','East'],['west','West'],['central','Central'],['all','All India']]} />
                  <Select isDark={isDark} value={form.time_pref} onChange={(v) => update("time_pref", v)} options={[['quick','Quick'],['medium','Medium'],['long','Long']]} />
                </div>
              </>
            )}

            <button disabled={loading} className="w-full bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl hover:bg-emerald-300 transition disabled:opacity-60">
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Input({ isDark, icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 border ${isDark ? "bg-black/30 border-white/10" : "bg-slate-50 border-slate-200"}`}>
      {icon && <span className="text-emerald-400">{icon}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent outline-none py-4" />
    </div>
  );
}

function Select({ isDark, value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`w-full rounded-2xl px-4 py-4 outline-none border ${isDark ? "bg-black/30 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-950"}`}>
      {options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
    </select>
  );
}

export default LoginPage;
