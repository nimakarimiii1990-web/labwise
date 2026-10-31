import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Code2, ShieldCheck, Zap, Database } from 'lucide-react';

interface HeroProps {
  lang: 'fa' | 'en';
  onExploreCapabilities: () => void;
  onExplorePricing: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onExploreCapabilities, onExplorePricing }) => {
  const isFa = lang === 'fa';
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-neutral-900 overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-start">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-400 mb-4">
              <span>{isFa ? 'مهندس ارشد نرم‌افزار و موتور ساخت اختصاصی' : 'Senior Software Engineer & AI Studio Build Engine'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-400">{isFa ? 'توسعه کدهای استاندارد و بی‌نقص' : 'Production-Ready Codebases'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.25] text-balance mb-6">
              {isFa ? (
                <>
                  هر ایده‌ای را به یک <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-300">وب‌اپلیکیشن کامل و واقعی</span> تبدیل می‌کنم.
                </>
              ) : (
                <>
                  Transforming your ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-300">production-grade web apps</span> from scratch.
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl mb-8">
              {isFa ? (
                <>
                  من موتور برنامه‌نویسی شما در استودیو هوش مصنوعی هستم. شما نیازمندی‌های خود را به زبان طبیعی (فارسی یا انگلیسی) بیان می‌کنید، و من فرانت‌اند مدرن، بک‌اند Express، پایگاه‌داده PostgreSQL یا Firestore، هوش مصنوعی Gemini و ابزارهای ابری را مستقیماً می‌سازم، تست می‌کنم و تحویل می‌دهم.
                </>
              ) : (
                <>
                  I am your dedicated senior software engineer in AI Studio. Describe your requirements in natural language, and I architect, code, test, and deploy complete React frontends, Express backends, cloud databases, and multimodal Gemini AI integrations.
                </>
              )}
            </p>

            {/* Answer banner to "Is it free?" directly in Hero */}
            <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 mb-8 max-w-2xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400 mb-1">
                    {isFa ? 'پاسخ مستقیم: آیا رایگان هستم؟' : 'Direct Answer: Am I free to use?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-normal">
                    {isFa ? (
                      <>
                        <strong className="text-white font-medium">بله! کاملاً رایگان می‌توانید شروع کنید.</strong> محیط توسعه، کدنویسی، پیش‌نمایش در مرورگر و سهمیه‌های روزانه مدل‌های جمنای (تا ۱۵۰۰ درخواست در روز در پلن Free Tier) بدون هزینه و بدون نیاز به کارت بانکی در اختیارتان قرار دارد.
                      </>
                    ) : (
                      <>
                        <strong className="text-white font-medium">Yes! You can build completely for free.</strong> The coding workspace, live preview sandbox, and daily Gemini API quotas (up to 1,500 free requests/day) require zero upfront cost and no credit card.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreCapabilities}
                className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <span>{isFa ? 'مشاهده کارهای قابل انجام' : 'Explore All Capabilities'}</span>
                {isFa ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
              <button
                onClick={onExplorePricing}
                className="px-6 py-3 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{isFa ? 'بررسی شرایط و جزئیات هزینه' : 'Pricing & Free Tier Breakdown'}</span>
              </button>
            </div>
          </div>

          {/* Visual Column (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
              {!imgError ? (
                <img
                  src="/src/assets/images/hero_engineering_studio_1793168388183.jpg"
                  alt={isFa ? 'محیط کار مهندسی نرم‌افزار' : 'Software Engineering Studio Workspace'}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-indigo-950/40 p-8 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 font-mono">WORKSPACE SANDBOX</span>
                    <h3 className="text-xl font-bold text-white mt-1">Full-Stack Production Architecture</h3>
                  </div>
                </div>
              )}
              {/* Overlay caption */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-neutral-950/95 via-neutral-950/70 to-transparent flex items-center justify-between text-xs text-neutral-300">
                <span className="font-mono text-neutral-400">Vite · React 19 · Express · Gemini</span>
                <span className="text-emerald-400 font-medium">{isFa ? 'آماده توسعه آنی' : 'Ready to Build'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Quantitative Metric Strip (placed full-width below the hero split) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-neutral-900">
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-2xl font-bold font-mono tabular-nums text-white">۰ تومان</span>
            </div>
            <p className="text-xs text-neutral-400">
              {isFa ? 'شروع رایگان با سهمیه روزانه Free Tier' : 'Free tier prototyping with 0 upfront cost'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Code2 className="w-4 h-4" />
              <span className="text-2xl font-bold font-mono tabular-nums text-white">۱۰۰٪</span>
            </div>
            <p className="text-xs text-neutral-400">
              {isFa ? 'کدهای اجرایی واقعی و استاندارد بدون ماک' : 'Real, deployable full-stack codebases'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Database className="w-4 h-4" />
              <span className="text-2xl font-bold font-mono tabular-nums text-white">SQL + NoSQL</span>
            </div>
            <p className="text-xs text-neutral-400">
              {isFa ? 'پایگاه داده ابری PostgreSQL و Firestore' : 'Cloud SQL PostgreSQL & Firestore ready'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-2xl font-bold font-mono tabular-nums text-white">&lt; 3 Min</span>
            </div>
            <p className="text-xs text-neutral-400">
              {isFa ? 'سرعت ساخت نمونه اولیه تا استقرار زنده' : 'Prototype generation to live preview'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
