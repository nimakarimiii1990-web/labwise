import React, { useState } from 'react';
import {
  Globe2,
  BookOpen,
  Calendar,
  MapPin,
  ExternalLink,
  Tag,
  Search,
  Sparkles,
  Building2,
  CheckCircle2,
  FileText,
  Bookmark,
  Share2,
} from 'lucide-react';
import { SCIENTIFIC_ARTICLES } from '../data/scientificArticlesData';
import { INTERNATIONAL_EVENTS } from '../data/internationalEventsData';
import { ScientificArticle, InternationalEvent } from '../types/lab';

export const ScientificKnowledgeHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'articles' | 'events'>('articles');
  const [articleCategory, setArticleCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredArticles = SCIENTIFIC_ARTICLES.filter((art) => {
    const matchCat = articleCategory === 'all' || art.category === articleCategory;
    const q = searchTerm.toLowerCase().trim();
    const matchSearch =
      !q ||
      art.titleEn.toLowerCase().includes(q) ||
      art.titleFa.includes(q) ||
      art.abstractFa.includes(q) ||
      art.journal.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const filteredEvents = INTERNATIONAL_EVENTS.filter((ev) => {
    const q = searchTerm.toLowerCase().trim();
    return (
      !q ||
      ev.titleEn.toLowerCase().includes(q) ||
      ev.titleFa.includes(q) ||
      ev.locationEn.toLowerCase().includes(q) ||
      ev.locationFa.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Globe2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">مرکز دانش علمی روز، مقالات و رویدادهای بین‌المللی</h2>
              <p className="text-xs text-slate-400">
                پایش آخرین مقالات معتبر بیوشیمی و ایمونولوژی، استانداردهای CLSI/IFCC و تقویم نمایشگاه‌های جهانی تجهیزات آزمایشگاهی
              </p>
            </div>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSubTab('articles')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                subTab === 'articles'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              مقالات علمی و رفرنس‌ها ({SCIENTIFIC_ARTICLES.length})
            </button>
            <button
              onClick={() => setSubTab('events')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                subTab === 'events'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              نمایشگاه‌ها و کنگره‌های بین‌المللی ({INTERNATIONAL_EVENTS.length})
            </button>
          </div>
        </div>

        {/* Search bar & Category filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {subTab === 'articles' ? (
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'همه مقالات' },
                { id: 'biochemistry', label: 'بیوشیمی بالینی' },
                { id: 'immunology', label: 'ایمونولوژی و کیت‌ها' },
                { id: 'qc_methodology', label: 'کنترل کیفی و استانداردها' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setArticleCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    articleCategory === c.id
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-400">
              تقویم تاریخ، محل برگزاری و لینک رسمی ثبت‌نام کنگره‌های معتبر دنیا
            </span>
          )}

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در مقالات و رویدادها..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Articles View */}
      {subTab === 'articles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                        {article.category === 'biochemistry'
                          ? 'بیوشیمی بالینی'
                          : article.category === 'immunology'
                          ? 'ایمونولوژی'
                          : 'کنترل کیفی و استاندارد'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-medium">{article.journal}</span>
                      <span className="text-xs text-slate-500 font-mono">({article.year})</span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{article.titleFa}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">{article.titleEn}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">نویسندگان: {article.authors}</p>
                  </div>

                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      مشاهده رفرنس و مقاله کامل
                    </a>
                  )}
                </div>

                {/* Abstract In Persian */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                  <p className="text-slate-300 leading-relaxed font-sans">
                    <strong className="text-white">خلاصه تخصصی و متدولوژی: </strong>
                    {article.abstractFa}
                  </p>

                  <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-indigo-200">
                    <strong>کاربرد بالینی و تاثیر در کیفیت محلول‌ها: </strong>
                    {article.clinicalImpactFa}
                  </div>
                </div>

                {/* Key takeaways */}
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-400 text-[11px]">یافته‌های کلیدی پژوهش:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                    {article.keyFindingsFa.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                {article.doi && (
                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                    DOI: {article.doi}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* International Events & Congresses View */}
      {subTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    {ev.badgeText}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {ev.category === 'expo' ? 'نمایشگاه تجاری و بازرگانی' : 'کنگره بین‌المللی علمی'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">{ev.titleFa}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{ev.titleEn}</p>
                </div>

                {/* Dates & Location Card */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-semibold">تاریخ برگزاری:</span>
                    <span className="font-mono text-cyan-300 dir-ltr">
                      {ev.startDate} الی {ev.endDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="font-semibold">مکان و مرکز همایش:</span>
                    <span className="text-slate-300">{ev.locationFa}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{ev.descriptionFa}</p>

                <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-300">مخاطبین هدف: </strong>
                  {ev.targetAudienceFa}
                </div>
              </div>

              {/* Direct Official Link */}
              <div className="pt-3 border-t border-slate-800">
                <a
                  href={ev.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Globe2 className="w-4 h-4" />
                  ورود به وب‌سایت رسمی رویداد ({new URL(ev.websiteUrl).hostname})
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
