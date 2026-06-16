import { useEffect, useState } from "react";
import { BookOpen, Calendar, User } from "lucide-react";
import { API } from "../config";

function BlogsPage({ isDark }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch(`${API}/api/blogs`);
        const data = await res.json();

        setBlogs(data.blogs || []);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    }

    loadBlogs();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-32 pb-20">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full font-bold mb-5">
          <BookOpen size={18} />
          FitAI Blog Hub
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5">
          Health, Fitness & Nutrition Blogs
        </h1>

        <p
          className={`max-w-3xl mx-auto text-lg leading-relaxed ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          Articles, guides, nutrition tips, fitness knowledge,
          and project updates written for the FitAI community.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="h-14 w-14 mx-auto rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>

          <p
            className={`mt-5 ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Loading blogs...
          </p>
        </div>
      ) : blogs.length === 0 ? (
        <div
          className={`rounded-[2rem] border p-10 text-center ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-white border-slate-200 shadow-lg"
          }`}
        >
          <h2 className="text-3xl font-black mb-4">
            No Blogs Available
          </h2>

        </div>
      ) : (
        <div className="grid gap-10">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className={`overflow-hidden rounded-[2rem] border transition hover:-translate-y-1 hover:shadow-2xl ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              {blog.image ? (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-[320px] object-cover"
                />
              ) : (
                <div className="h-[220px] bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
                  <span className="text-white text-5xl font-black">
                    FitAI
                  </span>
                </div>
              )}

              <div className="p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="bg-emerald-500/10 text-emerald-500 font-black px-4 py-2 rounded-full text-sm">
                    {blog.category}
                  </span>

                  <span
                    className={`flex items-center gap-2 text-sm ${
                      isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    <User size={15} />
                    {blog.author}
                  </span>

                  {blog.created_at && (
                    <span
                      className={`flex items-center gap-2 text-sm ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      <Calendar size={15} />
                      {blog.created_at}
                    </span>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-black mb-6">
                  {blog.title}
                </h2>

                <div
                  className={`leading-8 text-lg whitespace-pre-line ${
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  {blog.content}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default BlogsPage;