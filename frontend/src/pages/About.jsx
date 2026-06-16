import React, { useState } from "react";
import {
  FileText,
  HeartPulse,
  Database,
  Brain,
  Target,
  Code2,
  ArrowUpRight,
  Sparkles,
  X,
} from "lucide-react";

export default function About({ isDark }) {
  const [showDeveloperCard, setShowDeveloperCard] = useState(true);

  const resumeLink =
    "https://drive.google.com/file/d/18aHJeVgQmfhflYpok9tKT46PWj8Jg6AP/view?usp=sharing";

  const cardClass = isDark
    ? "bg-white/5 border-white/10 text-slate-300"
    : "bg-white/80 border-slate-200 text-slate-600 shadow-lg";

  return (
    <section className="relative w-full overflow-hidden pb-44">
      {/* Background Glow */}
      <div className="relative max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-500">
            <Sparkles size={16} />
            Smart fitness planning made simple
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            About FitAI
          </h1>

          <p
            className={`max-w-4xl mx-auto text-lg md:text-xl leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            FitAI is a personalized diet and fitness planning application built
            to make healthy living easier, practical, and less confusing. It
            brings diet planning, workout guidance, meal filtering, progress
            tracking, and smart recommendations into one simple dashboard.
          </p>
        </section>

        {/* Our Story */}
        <section
          className={`mt-12 rounded-[2rem] border p-7 md:p-10 ${cardClass}`}
        >
          <h2 className="text-3xl font-black mb-5">Our Story</h2>

          <div className="space-y-5 text-lg leading-8">
            <p>
              Most people want to improve their health, but the starting point
              is often confusing. Some people do not know how many calories they
              need. Some struggle to choose meals that match their budget. Some
              follow random workout plans from the internet without knowing
              whether they are suitable for their body or activity level.
            </p>

            <p>
              FitAI was created to solve this exact problem. Instead of giving a
              generic diet chart, the app asks for basic details like age,
              weight, height, goal, activity level, budget, diet type, region,
              and time preference. Based on this information, it creates a plan
              that feels more personal and useful.
            </p>

            <p>
              The main idea behind FitAI is simple: fitness advice should be
              easy to understand and easy to follow. A good plan should not feel
              like a punishment. It should match a person’s lifestyle, food
              habits, daily schedule, and comfort level.
            </p>

            <p>
              This project also focuses strongly on Indian food preferences.
              Many diet apps show meals that are not common in regular Indian
              homes. FitAI uses a wider Indian meal database with different
              regions, budgets, diet types, and meal categories so the
              recommendations feel more familiar and realistic.
            </p>
          </div>
        </section>

        {/* Vision */}
        <section className="grid lg:grid-cols-3 gap-6 mt-10">
          <div
            className={`lg:col-span-2 rounded-[2rem] border p-7 md:p-10 ${cardClass}`}
          >
            <h2 className="text-3xl font-black mb-5">Our Vision</h2>

            <div className="space-y-5 text-lg leading-8">
              <p>
                The vision of FitAI is to become a practical health companion
                for people who want better guidance without making fitness
                complicated. The app is not just about generating a one-time
                plan. The bigger goal is to help users build better habits over
                time.
              </p>

              <p>
                In future versions, FitAI can become smarter by learning from
                user progress, food choices, skipped meals, workout completion,
                and personal preferences. The aim is to make recommendations
                more adaptive, more accurate, and more useful with time.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-300/40 bg-emerald-500/10 p-7 md:p-8">
            <h3 className="text-2xl font-black mb-4">
              What makes it different?
            </h3>

            <p
              className={`leading-7 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              FitAI is built around practical Indian meal choices, budget-aware
              filtering, region-based recommendations, activity-level workout
              planning, and a clean dashboard that users can actually
              understand.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="mt-10">
          <h2 className="text-3xl font-black mb-8">Key Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              isDark={isDark}
              icon={<Target />}
              title="Personalized Diet Plans"
              text="FitAI creates meal plans based on user goals, diet type, activity level, region, budget, and time preference."
            />

            <FeatureCard
              isDark={isDark}
              icon={<HeartPulse />}
              title="Workout Recommendations"
              text="The app provides structured workout suggestions according to the user's current activity level."
            />

            <FeatureCard
              isDark={isDark}
              icon={<Database />}
              title="Large Meal Database"
              text="The meal database contains hundreds of Indian meals across multiple regions, budgets, and categories."
            />

            <FeatureCard
              isDark={isDark}
              icon={<Brain />}
              title="Smart Filtering"
              text="Meals are filtered using budget hierarchy, region grouping, diet type, meal timing, calories, and protein."
            />

            <FeatureCard
              isDark={isDark}
              icon={<FileText />}
              title="Progress Tracking"
              text="Users can update their diet and workout completion so the app can track their consistency."
            />

            <FeatureCard
              isDark={isDark}
              icon={<Code2 />}
              title="Scalable Architecture"
              text="The project is structured with a React frontend, Flask backend, and PostgreSQL database for future expansion."
            />
          </div>
        </section>

        {/* Technology Stack */}
        <section
          className={`mt-10 rounded-[2rem] border p-7 md:p-10 ${cardClass}`}
        >
          <h2 className="text-3xl font-black mb-6">Technology Stack</h2>

          <div className="grid md:grid-cols-2 gap-5 text-lg">
            <TechItem
              title="Frontend"
              text="React.js, Tailwind CSS, JavaScript, responsive UI design"
            />
            <TechItem
              title="Backend"
              text="Python, Flask, REST APIs, backend business logic"
            />
            <TechItem
              title="Database"
              text="PostgreSQL for users, meals, and progress data"
            />
            <TechItem
              title="AI / Logic"
              text="Plan generation, meal filtering, scoring, and recommendation workflow"
            />
          </div>
        </section>

        {/* Why FitAI Matters */}
        <section
          className={`mt-10 rounded-[2rem] border p-7 md:p-10 ${cardClass}`}
        >
          <h2 className="text-3xl font-black mb-5">Why FitAI Matters</h2>

          <div className="space-y-5 text-lg leading-8">
            <p>
              A healthy lifestyle becomes easier when the plan feels realistic.
              FitAI focuses on recommendations that match the user's actual
              lifestyle instead of forcing them into a strict routine that is
              difficult to maintain.
            </p>

            <p>
              The app is especially useful for beginners who do not know where
              to start. It gives them a clear structure: what to eat, how much
              nutrition they are getting, what workout routine to follow, and
              how to track progress.
            </p>

            <p>
              The long-term purpose of FitAI is to make fitness planning more
              personal, simple, and accessible. It is not about extreme dieting.
              It is about helping users make better daily choices consistently.
            </p>
          </div>
        </section>

        {/* Floating Developer Card */}
        {showDeveloperCard && (
          <div
            className={`fixed bottom-6 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] rounded-[1.7rem] border p-5 shadow-2xl backdrop-blur-xl float-card ${
              isDark
                ? "bg-slate-950/90 border-white/10"
                : "bg-white/90 border-emerald-100"
            }`}
          >
            <button
              type="button"
              onClick={() => setShowDeveloperCard(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-red-500/20 transition"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black mb-3 pr-8">
              About Developer
            </h3>

            <p
              className={`text-sm leading-6 mb-5 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Hi, I’m Abhinav Kumar, the developer behind FitAI. I enjoy
              building practical software solutions and I’m currently focused
              on backend development, APIs, databases, and full-stack project
              building.
            </p>

            <a
              href={resumeLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-white hover:bg-emerald-600 transition"
            >
              View Resume
              <ArrowUpRight size={18} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function FeatureCard({ isDark, icon, title, text }) {
  return (
    <div
      className={`rounded-[1.7rem] border p-6 transition hover:-translate-y-1 hover:shadow-xl ${
        isDark
          ? "bg-white/5 border-white/10 text-slate-300"
          : "bg-white/80 border-slate-200 text-slate-600"
      }`}
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
        {React.cloneElement(icon, { size: 28 })}
      </div>

      <h3
        className={`text-xl font-black mb-3 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h3>

      <p className="leading-7">{text}</p>
    </div>
  );
}

function TechItem({ title, text }) {
  return (
    <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-5">
      <h3 className="font-black text-lg mb-2">{title}</h3>
      <p className="leading-7">{text}</p>
    </div>
  );
}