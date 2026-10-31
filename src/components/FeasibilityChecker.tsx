import React, { useState } from 'react';
import { Search, CheckCircle2, Cpu, Database, Clock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface FeasibilityCheckerProps {
  lang: 'fa' | 'en';
  onSendToChat: (idea: string) => void;
}

export const FeasibilityChecker: React.FC<FeasibilityCheckerProps> = ({ lang, onSendToChat }) => {
  const isFa = lang === 'fa';
  const [ideaText, setIdeaText] = useState<string>('');
  const [analysis, setAnalysis] = useState<{
    feasible: boolean;
    frontend: string;
    backend: string;
    database: string;
    aiModel: string;
    estimatedTime: string;
    freeTierStatus: string;
    recommendationFa: string;
    recommendationEn: string;
  } | null>(null);

  const sampleIdeas = [
    {
      fa: 'سامانه نوبت‌دهی پزشکی آنلاین با پیامک و تقویم',
      en: 'Online medical appointment booking with SMS & calendar'
    },
    {
      fa: 'داشبورد تحلیل فایل‌های اکسل و رسم نمودارهای مالی',
      en: 'Excel spreadsheet analytics dashboard with financial charts'
    },
    {
      fa: 'چت‌بات تخصصی حقوقی با آپلود قراردادهای پی‌دی‌اف',
      en: 'Legal contract AI assistant with PDF document upload'
    },
    {
      fa: 'بازی کارتی دونفره با رابط کاربری انیمیشنی مدرن',
      en: 'Two-player web card game with modern animated UI'
    }
  ];

  const handleAnalyze = () => {
    if (!ideaText.trim()) return;

    const lower = ideaText.toLowerCase();

    // Determine tech requirements heuristically
    const hasAI = lower.includes('هوش مصنوعی') || lower.includes('چت') || lower.includes('تحلیل') || lower.includes('ai') || lower.includes('gpt') || lower.includes('gemini') || lower.includes('pdf');
    const hasDB = lower.includes('کاربر') || lower.includes('ثبت') || lower.includes('رزرو') || lower.includes('دیتابیس') || lower.includes('فروش') || lower.includes('نوبت');
    const hasMaps = lower.includes('نقشه') || lower.includes('مسیریابی') || lower.includes('map') || lower.includes('مکان');

    setAnalysis({
      feasible: true,
      frontend: 'React 19 + Tailwind CSS + Motion (کاملاً واکنش‌گرا)',
      backend: 'Node.js Express REST API (پورت ۳۰۰۰)',
      database: hasDB ? 'Cloud SQL PostgreSQL یا Firebase Firestore' : 'حافظه محلی مرورگر (Local State)',
      aiModel: hasAI ? 'Google Gemini 2.5 Flash با جستجوی وب' : 'بدون نیاز اولیه به هوش مصنوعی',
      estimatedTime: '۳ الی ۵ دقیقه ساخت نسخه کامل',
      freeTierStatus: '۱۰۰٪ قابل اجرا تحت سهمیه رایگان استودیو',
      recommendationFa: `ایده شما بسیار کاربردی است. پیشنهاد می‌شود ساختار داده‌ها را به صورت ماژولار پیاده‌سازی کنیم تا به راحتی قابل توسعه و دانلود باشد.`,
      recommendationEn: `Your idea is fully feasible. We recommend a modular component architecture with clean state management for easy future scaling and export.`
    });
  };

  return (
    <section id="feasibility" className="py-20 lg:py-28 border-b border-neutral-900 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-400 mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>{isFa ? 'امکان‌سنجی معمار نرم‌افزار' : 'Architectural Feasibility Engine'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-400">{isFa ? 'تحلیل آنی پروژه' : 'Instant Idea Breakdown'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3 text-balance">
            {isFa ? 'آیا ایده شما قابل پیاده‌سازی است؟' : 'Can Your Custom Project Be Built?'}
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {isFa
              ? 'ایده خود را بنویسید تا آن را به عنوان یک معمار ارشد تحلیل کنم و استک فنی، نحوه ذخیره داده‌ها و وضعیت رایگان بودن را مشخص نمایم.'
              : 'Enter your project brief below to evaluate technical feasibility, recommended database architecture, AI integration, and free quota availability.'}
          </p>
        </div>

        {/* Input Card */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-neutral-900/70 border border-neutral-800 p-6 sm:p-8 mb-8">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            {isFa ? 'ایده یا نیازمندی مد نظرتان را شرح دهید:' : 'Describe your project idea:'}
          </label>
          <div className="relative mb-4">
            <textarea
              rows={3}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder={isFa ? 'مثال: یک سامانه برای ارزیابی رژیم غذایی با آپلود عکس غذا و گزارش کالری' : 'e.g. A nutrition assistant that analyzes food photos and calculates calories'}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Sample quick chips */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-neutral-500">{isFa ? 'ایده‌های نمونه:' : 'Quick samples:'}</span>
            {sampleIdeas.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIdeaText(isFa ? s.fa : s.en)}
                className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer"
              >
                {isFa ? s.fa : s.en}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!ideaText.trim()}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {isFa ? 'تحلیل فنی و معماری' : 'Analyze Architecture'}
            </button>
          </div>
        </div>

        {/* Analysis Output Box */}
        {analysis && (
          <div className="max-w-3xl mx-auto rounded-2xl bg-neutral-900 border border-indigo-500/30 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-800 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">
                  {isFa ? 'نتیجه امکان‌سنجی: کاملاً قابل ساخت و اجرا' : 'Feasibility: 100% Achievable & Deployable'}
                </h3>
                <span className="text-xs text-emerald-400">{analysis.freeTierStatus}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-500 block mb-1">{isFa ? 'بخش فرانت‌اند:' : 'Frontend:'}</span>
                <span className="text-neutral-200 font-mono">{analysis.frontend}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-500 block mb-1">{isFa ? 'بخش سرور و بک‌اند:' : 'Backend API:'}</span>
                <span className="text-neutral-200 font-mono">{analysis.backend}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-500 block mb-1">{isFa ? 'پایگاه داده پیشنهادی:' : 'Database Layer:'}</span>
                <span className="text-neutral-200 font-mono">{analysis.database}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850">
                <span className="text-neutral-500 block mb-1">{isFa ? 'موتور هوش مصنوعی:' : 'AI Pipeline:'}</span>
                <span className="text-neutral-200 font-mono">{analysis.aiModel}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-6 p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-850">
              {isFa ? analysis.recommendationFa : analysis.recommendationEn}
            </p>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{analysis.estimatedTime}</span>
              </div>

              <button
                type="button"
                onClick={() => onSendToChat(ideaText)}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>{isFa ? 'سفارش ساخت این ایده در چت' : 'Request Build in Chat'}</span>
                {isFa ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
