import { useState, useEffect } from "react";

function DatabasePage({ isDark }) {
  const [meals, setMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);

  const [filters, setFilters] = useState({
    region: "all",
    budget: "all",
    diet_type: "all",
    meal_time: "all",
    time_pref: "all",
  });

  async function loadMeals() {
    setLoadingMeals(true);

    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API}/api/all-meals`);
      const data = await res.json();
      setMeals(data.meals || []);
    } catch (err) {
      alert("Could not load meal database");
      console.log(err);
    }

    setLoadingMeals(false);
  }

  useEffect(() => {
    loadMeals();
  }, []);

  function handleFilterChange(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  }

  function resetFilters() {
    setFilters({
      region: "all",
      budget: "all",
      diet_type: "all",
      meal_time: "all",
      time_pref: "all",
    });
  }

  const filteredMeals = meals.filter((meal) => {
    return (
      (filters.region === "all" || meal.region === filters.region) &&
      (filters.budget === "all" || meal.budget === filters.budget) &&
      (filters.diet_type === "all" || meal.diet_type === filters.diet_type) &&
      (filters.meal_time === "all" || meal.meal_time === filters.meal_time) &&
      (filters.time_pref === "all" || meal.time_pref === filters.time_pref)
    );
  });

  const selectClass = `w-full p-3 rounded-xl border outline-none text-sm ${
    isDark
      ? "bg-[#0b1220] border-white/10 text-white"
      : "bg-white border-slate-200 text-slate-800"
  }`;

  return (
    <section className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 pt-40 md:pt-32 px-4 md:px-6 items-start">
      <div className="mb-8">
        <h2 className="text-4xl font-black">Meal Database</h2>
        <p className={isDark ? "text-gray-400" : "text-slate-500"}>
          View and filter meals saved in your database.
        </p>
      </div>

      <div
        className={`mb-8 rounded-2xl border p-4 ${
          isDark
            ? "bg-white/5 border-white/10"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Filters</h3>

          <button
            onClick={resetFilters}
            className={`text-sm font-semibold px-3 py-2 rounded-lg ${
              isDark
                ? "bg-white/10 hover:bg-white/15 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Reset
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            className={selectClass}
          >
            <option value="all">All Regions</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
          </select>

          <select
            name="budget"
            value={filters.budget}
            onChange={handleFilterChange}
            className={selectClass}
          >
            <option value="all">All Budgets</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            name="diet_type"
            value={filters.diet_type}
            onChange={handleFilterChange}
            className={selectClass}
          >
            <option value="all">All Diets</option>
            <option value="veg">Veg</option>
            <option value="nonveg">Non-Veg</option>
            <option value="vegan">Vegan</option>
          </select>

          <select
            name="meal_time"
            value={filters.meal_time}
            onChange={handleFilterChange}
            className={selectClass}
          >
            <option value="all">All Meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>

          <select
            name="time_pref"
            value={filters.time_pref}
            onChange={handleFilterChange}
            className={selectClass}
          >
            <option value="all">All Time</option>
            <option value="quick">Quick</option>
            <option value="medium">Medium</option>
          </select>
        </div>

        <p
          className={`mt-4 text-sm ${
            isDark ? "text-gray-400" : "text-slate-500"
          }`}
        >
          Showing {filteredMeals.length} of {meals.length} meals
        </p>
      </div>

      {loadingMeals ? (
        <p className="text-center py-10 font-bold">Loading meals...</p>
      ) : filteredMeals.length === 0 ? (
        <p className="text-center py-10 font-bold">No meals found.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className={`rounded-3xl p-5 border ${
                isDark
                  ? "bg-white/10 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <p className="text-emerald-400 font-bold">{meal.meal_time}</p>

              <h3 className="text-2xl font-black">{meal.name}</h3>

              <p
                className={
                  isDark ? "text-gray-300 mt-2" : "text-slate-600 mt-2"
                }
              >
                {meal.calories} kcal • {meal.protein}g protein
              </p>

              <div className="flex flex-wrap gap-2 mt-4 text-xs font-bold">
                <span className="bg-emerald-400 text-black px-3 py-1 rounded-full">
                  {meal.region}
                </span>

                <span className="bg-cyan-400 text-black px-3 py-1 rounded-full">
                  {meal.budget}
                </span>

                <span className="bg-yellow-300 text-black px-3 py-1 rounded-full">
                  {meal.diet_type}
                </span>

                <span className="bg-pink-300 text-black px-3 py-1 rounded-full">
                  {meal.time_pref}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default DatabasePage;