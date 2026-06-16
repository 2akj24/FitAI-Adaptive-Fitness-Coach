import { useState } from "react";
import {
  Apple,
  Beef,
  Dumbbell,
  Flame,
  HeartPulse,
  Loader2,
  Sparkles,
  Target,
  Trophy,
  Utensils,
  Wallet,
} from "lucide-react";

import StatCard from "../components/StatCard";
import MiniFeature from "../components/MiniFeature";
import { Input, Select } from "../components/FormControls";
import DashboardPage from "./DashboardPage";

function PlannerPage({
  isDark,
  form,
  setForm,
  plan,
  setPlan,
  rawPlan,
  setRawPlan,
  setUserId,
  bmi,
  activeDay,
  setActiveDay,
}) {
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setPlan(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/get_plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        setPlan(data.plan);
        setRawPlan(data.raw_plan);
        setUserId(data.user_id);
        setActiveDay(0);
      }
    } catch (err) {
      alert("Backend connection failed");
      console.log(err);
    }

    setLoading(false);
  }

  return (
    <>
      <section className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 pt-15 items-start">
        <div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 ${
            isDark ? "bg-white/8 text-white" : "bg-slate-900 text-white"
            }`}>
            <Sparkles size={15} />
            Personalised Diet Plans
        </div>

          <h2 className="text-4xl md:text-6xl font-black leading-[1.03]">
            Your personal diet dashboard,<span className="text-gradient"> built instantly</span>
        </h2>

          <p className={`mt-5 text-lg max-w-xl leading-8 font-normal ${
            isDark ? "text-gray-400" : "text-slate-600"
            }`}>
            Generate your 7-Day meal and workout plan with your personalised Fitness Coach
            using your goal, budget, region and saved meal database.
  </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl">
            <StatCard isDark={isDark} icon={<Flame />} title="Calories" value={rawPlan?.calories || "--"} />
            <StatCard isDark={isDark} icon={<Beef />} title="Protein" value={rawPlan?.protein ? `${rawPlan.protein}g` : "--"} />
            <StatCard isDark={isDark} icon={<Trophy />} title="Level" value={rawPlan?.level || "--"} />
            <StatCard isDark={isDark} icon={<HeartPulse />} title="BMI" value={plan?.summary?.bmi || bmi} />
          </div>

          <div className={`mt-6 rounded-3xl p-6 border ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
            <h3 className="text-xl font-bold mb-3">Why this version is better</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <MiniFeature isDark={isDark} icon={<Utensils />} title="Database Meals" text="Meals come from your saved database." />
              <MiniFeature isDark={isDark} icon={<Wallet />} title="Budget Aware" text="Filters by your selected budget." />
              <MiniFeature isDark={isDark} icon={<Target />} title="Goal Based" text="Personalized for fat loss, gain or maintain." />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={`rounded-[1.75rem] p-6 md:p-7 border shadow-2xl ${isDark ? "bg-white/10 border-white/10" : "bg-white border-slate-200 shadow-slate-200"}`}>
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-3xl font-black">Generate Plan</h3>
              <p className={isDark ? "text-gray-400" : "text-slate-500"}>
                Fill your body and food preferences
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-400 flex items-center justify-center">
              <Apple className="text-black" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input isDark={isDark} name="age" placeholder="Age" value={form.age} onChange={handleChange} />
            <Input isDark={isDark} name="weight" placeholder="Weight kg" value={form.weight} onChange={handleChange} />
            <Input isDark={isDark} name="height" placeholder="Height cm" value={form.height} onChange={handleChange} />

            <Select isDark={isDark} name="goal" value={form.goal} onChange={handleChange}>
              <option value="fat_loss">Fat Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintain">Maintain</option>
            </Select>

            <Select isDark={isDark} name="diet_type" value={form.diet_type} onChange={handleChange}>
              <option value="veg">Veg</option>
              <option value="nonveg">Non Veg</option>
            </Select>

            <Select isDark={isDark} name="activity_level" value={form.activity_level} onChange={handleChange}>
              <option value="low">Low Activity</option>
              <option value="moderate">Moderate Activity</option>
              <option value="high">High Activity</option>
            </Select>

            <Select isDark={isDark} name="budget" value={form.budget} onChange={handleChange}>
              <option value="low">Low Budget</option>
              <option value="medium">Medium Budget</option>
              <option value="high">High Budget</option>
            </Select>

            <Select isDark={isDark} name="region" value={form.region} onChange={handleChange}>
              <option value="north">North Indian</option>
              <option value="south">South Indian</option>
              <option value="all">All</option>
            </Select>

            <Select isDark={isDark} name="time_pref" value={form.time_pref} onChange={handleChange}>
              <option value="quick">Quick</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </Select>
          </div>

          <button disabled={loading} className="mt-6 w-full bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl flex justify-center gap-2 hover:bg-emerald-300 transition disabled:opacity-70">
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Dumbbell /> Generate Smart Plan
              </>
            )}
          </button>
        </form>
      </section>

      {plan && (
        <DashboardPage
          plan={plan}
          rawPlan={rawPlan}
          isDark={isDark}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          showFullPlan
        />
      )}
    </>
  );
}

export default PlannerPage;