import React, { useState } from 'react';
import { PRICING_DETAILS } from '../data/capabilitiesData';
import { Check, HelpCircle, Calculator, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface PricingExplainerProps {
  lang: 'fa' | 'en';
}

export const PricingExplainer: React.FC<PricingExplainerProps> = ({ lang }) => {
  const isFa = lang === 'fa';

  // Calculator State
  const [dailyRequests, setDailyRequests] = useState<number>(300);
  const [selectedModel, setSelectedModel] = useState<'flash' | 'pro'>('flash');
  const [needsDatabase, setNeedsDatabase] = useState<boolean>(true);

  // Calculations
  // Flash free quota: ~1500 requests/day, 15 RPM
  // Pro free quota: ~50 requests/day, 2 RPM
  const freeDailyLimit = selectedModel === 'flash' ? 1500 : 50;
  const isWithinFreeTier = dailyRequests <= freeDailyLimit;

  // Rough pricing if exceeding:
  // Flash is approx $0.075 per 1M input tokens, Pro is approx $1.25 per 1M tokens
  // Assume ~1000 tokens per request
  const paidRequests = Math.max(0, dailyRequests - freeDailyLimit);
  const estimatedTokensPerMonth = paidRequests * 1000 * 30;
  const tokenCostPerMillion = selectedModel === 'flash' ? 0.15 : 2.5; // average blended
  const estimatedCostUsd = ((estimatedTokensPerMonth / 1_000_000) * tokenCostPerMillion).toFixed(2);

  return (
    <section id="pricing" className="py-20 lg:py-28 border-b border-neutral-900 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>{isFa ? 'شفافیت کامل در هزینه‌ها' : 'Transparent Pricing Guide'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-400">{isFa ? 'سهمیه رایگان روزانه' : 'Generous Free Tier'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 text-balance">
            {isFa ? 'آیا استفاده از من رایگان است؟' : 'Is It Free To Use?'}
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            {isFa ? PRICING_DETAILS.summaryFa : PRICING_DETAILS.summaryEn}
          </p>
        </div>

        {/* Two Tier Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {PRICING_DETAILS.tiers.map((tier, idx) => {
            const isFree = idx === 0;
            return (
              <div
                key={idx}
                className={`p-8 rounded-2xl border transition-all ${
                  isFree
                    ? 'bg-neutral-900/80 border-indigo-500/40 shadow-xl shadow-indigo-950/20 relative'
                    : 'bg-neutral-900/40 border-neutral-800'
                }`}
              >
                {/* Badge */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    isFree ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {isFa ? tier.badgeFa : tier.badgeEn}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">
                    {isFree ? 'NO CREDIT CARD REQUIRED' : 'ON-DEMAND BILLING'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {isFa ? tier.nameFa : tier.nameEn}
                </h3>

                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-4">
                  {isFa ? tier.priceFa : tier.priceEn}
                </div>

                <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
                  {isFa ? tier.descriptionFa : tier.descriptionEn}
                </p>

                <div className="pt-6 border-t border-neutral-800/80">
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                    {isFa ? 'امکانات این پلن:' : 'Plan Inclusions:'}
                  </h4>
                  <ul className="space-y-3">
                    {(isFa ? tier.highlightsFa : tier.highlightsEn).map((hl, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isFree ? 'text-indigo-400' : 'text-neutral-400'}`} />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Quota & Cost Estimator */}
        <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 lg:p-10">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-2">
            <Calculator className="w-4 h-4" />
            <span>{isFa ? 'ماشین‌حساب تعاملی سهمیه و برآورد هزینه' : 'Interactive Quota & Cost Estimator'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {isFa ? 'پروژه شما چقدر هزینه خواهد داشت؟' : 'Estimate Your Project Usage & Cost'}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mb-8">
            {isFa
              ? 'تعداد درخواست‌های روزانه و مدل هوش مصنوعی مد نظرتان را مشخص کنید تا ببینید آیا در پلن رایگان قرار می‌گیرید یا خیر.'
              : 'Select your expected daily traffic and model to see whether it comfortably fits within the 100% Free Tier.'}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Daily Requests Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-neutral-300 font-medium">
                    {isFa ? 'تعداد درخواست هوش مصنوعی در روز:' : 'Daily AI Requests:'}
                  </span>
                  <span className="font-mono text-indigo-400 font-bold text-sm tabular-nums">
                    {dailyRequests.toLocaleString()} {isFa ? 'درخواست / روز' : 'requests / day'}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="5000"
                  step="20"
                  value={dailyRequests}
                  onChange={(e) => setDailyRequests(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-neutral-500 mt-1 font-mono">
                  <span>۲۰ ({isFa ? 'تست اولیه' : 'Quick test'})</span>
                  <span>۱,۵۰۰ ({isFa ? 'سقف رایگان Flash' : 'Free limit'})</span>
                  <span>۵,۰۰۰ ({isFa ? 'ترافیک سنگین' : 'Heavy scale'})</span>
                </div>
              </div>

              {/* Model Choice Segmented */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  {isFa ? 'مدل هوش مصنوعی انتخابی:' : 'Selected Gemini Model:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedModel('flash')}
                    className={`p-3 rounded-xl border text-start transition-colors cursor-pointer ${
                      selectedModel === 'flash'
                        ? 'bg-neutral-800 border-indigo-500 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold mb-1 flex items-center justify-between">
                      <span>Gemini 2.5 Flash</span>
                      <span className="text-[10px] text-emerald-400 font-mono">۱۵۰۰ req/day free</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      {isFa ? 'سریع، فوق‌العاده هوشمند، سهمیه رایگان بالا' : 'Ultra-fast, high quota, ideal for 95% of apps'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedModel('pro')}
                    className={`p-3 rounded-xl border text-start transition-colors cursor-pointer ${
                      selectedModel === 'pro'
                        ? 'bg-neutral-800 border-indigo-500 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold mb-1 flex items-center justify-between">
                      <span>Gemini 2.5 Pro</span>
                      <span className="text-[10px] text-amber-400 font-mono">۵۰ req/day free</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      {isFa ? 'استدلال عمیق و تخصصی، کارهای بسیار سنگین' : 'Deep reasoning, coding benchmarks, heavy research'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Database toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div>
                  <div className="text-xs font-semibold text-white">
                    {isFa ? 'پایگاه داده ابری (PostgreSQL / Firestore)' : 'Cloud Database Storage'}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {isFa ? 'حالت توسعه رایگان (Developer Edition / Firebase Spark)' : 'Free development tier for rapid prototyping'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNeedsDatabase(!needsDatabase)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    needsDatabase ? 'bg-indigo-600' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      needsDatabase ? (isFa ? '-translate-x-6' : 'translate-x-6') : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Results Box (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-950 border border-neutral-800/90 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-neutral-400 mb-3 uppercase tracking-wider">
                  {isFa ? 'وضعیت هزینه تخمینی' : 'Cost Estimation Result'}
                </div>

                {isWithinFreeTier ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-base mb-1">
                      <Sparkles className="w-5 h-5" />
                      <span>{isFa ? 'کاملاً رایگان (Free Tier)' : '100% Free Tier Covered'}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-normal">
                      {isFa ? (
                        <>
                          حجم استفاده شما ({dailyRequests.toLocaleString()} درخواست در روز) کاملاً زیر سقف رایگان ({freeDailyLimit} در روز) است. هیچ هزینه‌ای برای شما ایجاد نخواهد شد.
                        </>
                      ) : (
                        <>
                          Your traffic ({dailyRequests.toLocaleString()} req/day) fits comfortably within the daily free tier limit ({freeDailyLimit}/day). Zero billing required.
                        </>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-4">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-base mb-1">
                      <Zap className="w-5 h-5" />
                      <span>{isFa ? 'ترافیک بالاتر از سهمیه رایگان' : 'Exceeds Free Quota'}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-normal">
                      {isFa ? (
                        <>
                          سهمیه روزانه رایگان شما {freeDailyLimit} درخواست است و مازاد آن به صورت پرداختی به ازای مصرف با نرخ ارزان کلود محاسبه می‌شود.
                        </>
                      ) : (
                        <>
                          The free quota covers {freeDailyLimit} daily requests. Additional traffic is billed via Pay-As-You-Go at low cloud rates.
                        </>
                      )}
                    </p>
                  </div>
                )}

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>{isFa ? 'محیط ساخت AI Studio Build:' : 'Build & Coding Engine:'}</span>
                    <span className="text-white font-mono">{isFa ? 'رایگان' : 'Free'}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>{isFa ? 'سهمیه رایگان روزانه:' : 'Daily Free Allowance:'}</span>
                    <span className="text-white font-mono">{freeDailyLimit.toLocaleString()} req/day</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>{isFa ? 'هزینه ماهانه تخمینی:' : 'Estimated Monthly Cost:'}</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">
                      {isWithinFreeTier ? '$0.00' : `~$${estimatedCostUsd} / mo`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-900 text-[11px] text-neutral-500 leading-relaxed">
                {isFa
                  ? 'نکته: ساخت، کدنویسی، پیش‌نمایش در مرورگر، دانلود سورس کد و تست همه ویژگی‌ها در این محیط همیشه بدون هزینه است.'
                  : 'Note: Full-stack coding, in-browser previews, code export, and prototyping inside AI Studio Build are always free.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
