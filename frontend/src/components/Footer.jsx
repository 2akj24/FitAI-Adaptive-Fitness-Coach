import logo from "../assets/logo.png";
import { Mail , ArrowUp , ExternalLink } from "lucide-react";


function Footer({ isDark }) {
  return (
    <footer
      className={`relative z-10 mt-20 border-t ${
        isDark
          ? "border-white/10 bg-[#050816]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-3 mb-4">
        <img
            src={logo}
            alt="FitAI Logo"
            className="w-12 h-12 object-contain"
        />

        <h2 className="text-4xl font-black">
            FitAI - Eat Smarter. Train Better.
        </h2>
        </div>
        </div>
        
        <div
            className={`mt-8 pt-5 border-t ${
                isDark
                ? "border-white/10 text-gray-400"
                : "border-slate-200 text-slate-500"
            }`}
            >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-5 text-sm">
                <p>
                © {new Date().getFullYear()} FitAI. All rights reserved.
                </p>

                <p>
                Made by <span className="font-bold text-white">Abhinav Kumar Jha</span>
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                <a
                    href="https://github.com/2akj24"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#24292e] text-white font-bold hover:scale-105 transition"
                >
                    GitHub
                </a>

                <a
                    href="https://www.linkedin.com/in/abhinavkumarjha08/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#0A66C2] text-white font-bold hover:scale-105 transition"
                >
                    LinkedIn
                </a>

                <a
                    href="mailto:abhinavkumarjha04@email.com"
                    className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold hover:scale-105 transition"
                >
                    Contact
                </a>
                </div>
            </div>
            </div>
        
      </div>
    </footer>
  );
}

export default Footer;