import { useState, useEffect } from "react";
import { fetchNews, initialNews, NewsItem } from "@/lib/data";
import { Newspaper, ArrowRight, Calendar, Tag } from "lucide-react";

export type { NewsItem };

const categoryColors: Record<string, { bg: string; text: string }> = {
  Announcement: { bg: "bg-blue-100", text: "text-blue-800" },
  Notice: { bg: "bg-amber-100", text: "text-amber-800" },
  Achievement: { bg: "bg-emerald-100", text: "text-emerald-800" },
  Program: { bg: "bg-purple-100", text: "text-purple-800" },
  Update: { bg: "bg-cyan-100", text: "text-cyan-800" },
};

interface Props {
  onSelect: (news: NewsItem) => void;
}

export default function News({ onSelect }: Props) {
  // Initialize with initialNews so it is NEVER blank on first render
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews);

  useEffect(() => {
    fetchNews().then((data) => {
      if (data && data.length > 0) {
        setNewsList(data);
      }
    });
  }, []);

  const [featured, ...rest] = newsList;

  return (
    <section id="news" className="py-20 bg-slate-50 reveal-init">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Newspaper className="w-3.5 h-3.5 text-blue-600" />
            Official Advisories
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            News & Service Advisories
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Stay updated with pipeline maintenance advisories, water quality reports, and community announcements.
          </p>
        </div>

        {/* Featured Card */}
        {featured && (
          <button
            onClick={() => onSelect(featured)}
            className="w-full text-left group mb-8 block cursor-pointer"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 grid md:grid-cols-12">
              <div className="md:col-span-6 overflow-hidden h-64 md:h-80 bg-slate-100">
                <img
                  src={featured.img}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      categoryColors[featured.category]?.bg || "bg-blue-100"
                    } ${categoryColors[featured.category]?.text || "text-blue-800"}`}
                  >
                    {featured.category}
                  </span>
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {featured.date}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 group-hover:text-blue-700 transition-colors leading-snug">
                  {featured.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="inline-flex items-center gap-1.5 text-blue-700 text-xs font-bold group-hover:gap-2.5 transition-all">
                  <span>Read Full Advisory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Other News Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="text-left group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="overflow-hidden h-44 bg-slate-100">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        categoryColors[item.category]?.bg || "bg-blue-100"
                      } ${categoryColors[item.category]?.text || "text-blue-800"}`}
                    >
                      {item.category}
                    </span>
                    <span className="text-slate-400 text-[11px]">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1.5 text-xs sm:text-sm leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-1 flex items-center gap-1 text-[11px] font-bold text-blue-600 group-hover:text-blue-800">
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
