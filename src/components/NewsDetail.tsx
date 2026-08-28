import type { NewsItem } from "@/lib/data";
import { ArrowLeft, Calendar, Tag, Building2 } from "lucide-react";

interface Props {
  news: NewsItem;
  onBack: () => void;
}

export default function NewsDetail({ news, onBack }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-blue-700 font-bold text-xs sm:text-sm mb-6 hover:text-blue-900 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to News & Announcements</span>
        </button>

        <article className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="h-64 sm:h-96 w-full bg-slate-100 relative">
            <img
              src={news.img}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                {news.category}
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {news.date}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              {news.title}
            </h1>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-6">
              {news.content.split("\n\n").map((para, i) => (
                <p key={i} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">Cordova Water System Inc.</p>
                <p className="text-slate-500 text-[11px]">Official Communication & Press Release Desk</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
