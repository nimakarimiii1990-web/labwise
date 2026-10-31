import React, { useState } from 'react';
import { CAPABILITIES } from '../data/capabilitiesData';
import { CapabilityItem } from '../types';
import { Layers, Copy, Check, Terminal, ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';

interface CapabilitiesGridProps {
  lang: 'fa' | 'en';
  onSelectPrompt: (prompt: string) => void;
}

export const CapabilitiesGrid: React.FC<CapabilitiesGridProps> = ({ lang, onSelectPrompt }) => {
  const isFa = lang === 'fa';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<CapabilityItem | null>(null);

  const categories = [
    { id: 'all', labelFa: 'همه قابلیت‌ها (۶ حوزه اصلی)', labelEn: 'All Capabilities (6 Areas)' },
    { id: 'frontend', labelFa: 'فرانت‌اند و UI', labelEn: 'Frontend & UI' },
    { id: 'backend', labelFa: 'بک‌اند و API', labelEn: 'Backend & APIs' },
    { id: 'database', labelFa: 'پایگاه‌های داده', labelEn: 'Databases' },
    { id: 'ai', labelFa: 'هوش مصنوعی Gemini', labelEn: 'Gemini AI' },
    { id: 'integrations', labelFa: 'گوگل مپس و ورک‌اسپیس', labelEn: 'Google Ecosystem' },
    { id: 'transformation', labelFa: 'فیگما و گیت‌هاب', labelEn: 'Figma & Migration' },
  ];

  const filteredCapabilities = selectedCategory === 'all'
    ? CAPABILITIES
    : CAPABILITIES.filter((item) => item.category === selectedCategory);

  const handleCopyPrompt = (item: CapabilityItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const promptText = isFa ? item.examplePromptFa : item.examplePromptEn;
    navigator.clipboard.writeText(promptText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="capabilities" className="py-20 lg:py-28 border-b border-neutral-900 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>{isFa ? 'کاوشگر مهارت‌ها' : 'Engineering Capabilities'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-400">{isFa ? 'صفر تا صد توسعه' : 'End-to-End Build'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {isFa ? 'دقیقاً چه کارهایی می‌توانم برای شما انجام دهم؟' : 'What Exactly Can I Build For You?'}
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            {isFa
              ? 'از طراحی فرانت‌اند با انیمیشن‌های روان تا پیکربندی سرور، دیتابیس و مدل‌های هوش مصنوعی؛ همگی در قالب کدهای تمیز و قابل دانلود.'
              : 'From high-polish animated frontends to cloud databases, server APIs and multimodal Gemini pipelines — all in exportable code.'}
          </p>
        </div>

        {/* Category Filter Tabs (Functional segmented buttons) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-x-auto mb-10 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
                }`}
              >
                {isFa ? cat.labelFa : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapabilities.map((item, index) => {
            const isMarquee = index === 0 || item.id === 'multimodal-ai-gemini';
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`group relative p-6 sm:p-7 rounded-2xl bg-neutral-900/50 hover:bg-neutral-900/80 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isMarquee && selectedCategory === 'all' ? 'lg:col-span-2' : 'col-span-1'
                }`}
              >
                <div>
                  {/* Top metadata line: Unboxed text with typographic separators (Zero-Pill rule) */}
                  <div className="flex items-center justify-between gap-2 text-xs text-neutral-400 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-indigo-400 font-medium">0{index + 1}.</span>
                      <span className="text-neutral-300 uppercase tracking-wider text-[11px]">{item.category}</span>
                      {item.isPopular && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-medium">{isFa ? 'پراستفاده' : 'Popular'}</span>
                        </>
                      )}
                    </div>
                    <span className="text-neutral-500 text-[11px] font-mono">Real Codebase</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-3">
                    {isFa ? item.titleFa : item.titleEn}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {isFa ? item.descriptionFa : item.descriptionEn}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="space-y-2 mb-6">
                    {(isFa ? item.featuresFa : item.featuresEn).slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-neutral-400 leading-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80 mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {/* Tech stack metadata (unboxed, separated by bullet) */}
                  <div className="pt-4 border-t border-neutral-800/70 mb-4 flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-400 font-mono">
                    {item.techStack.map((tech, tIdx) => (
                      <React.Fragment key={tech}>
                        <span>{tech}</span>
                        {tIdx < item.techStack.length - 1 && <span className="text-neutral-600">/</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => handleCopyPrompt(item, e)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-750 border border-neutral-700/80 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                      title={isFa ? 'کپی پرامپت نمونه برای اجرا در چت' : 'Copy sample prompt to run in chat'}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">{isFa ? 'کپی شد!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isFa ? 'کپی پرامپت نمونه' : 'Copy Sample Prompt'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPrompt(isFa ? item.examplePromptFa : item.examplePromptEn);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>{isFa ? 'شروع با این قابلیت' : 'Build with this'}</span>
                      {isFa ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Spotlight Banner: Cloud & Multimodal AI Architecture */}
        <div className="mt-12 rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-neutral-800 aspect-[4/3] bg-neutral-950">
            <img
              src="/src/assets/images/cloud_data_architecture_1793168388126.jpg"
              alt={isFa ? 'معماری ابری و پایگاه داده' : 'Cloud and AI Architecture'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-7">
            <div className="text-xs font-mono text-indigo-400 mb-2">FULL-STACK CLOUD ARCHITECTURE</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {isFa ? 'پایگاه‌های داده واقعی و پردازش هوش مصنوعی در چند ثانیه' : 'Real Databases & Multimodal AI in Seconds'}
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              {isFa
                ? 'برخلاف ابزارهایی که صرفاً ظاهر شبیه‌سازی شده می‌سازند، من پایگاه داده‌های واقعی PostgreSQL با ساختار Drizzle ORM، دیتابیس هم‌زمان Firestore، ثبت‌نام و ورود با Firebase Auth و روت‌های امن Express را ایجاد و راه‌اندازی می‌کنم.'
                : 'Unlike tools that only generate mock prototypes, I provision genuine PostgreSQL relational databases, Firestore realtime collections, user authentication flows, and protected Express backend routes.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFa ? 'ایجاد خودکار جداول و کلیدهای خارجی' : 'Automated tables & foreign key schemas'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFa ? 'امنیت دسترسی کاربر و قوانین Firestore' : 'Role-based access & Firestore rules'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFa ? 'بدون افشای API Key در کلاینت' : 'Zero client-side API key leakage'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFa ? 'قابلیت دانلود و هاست مستقل' : 'Fully self-hostable repository'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Item Modal */}
        {activeItem && (
          <div 
            className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveItem(null)}
          >
            <div 
              className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-indigo-400 uppercase">{activeItem.category}</span>
                <button
                  onClick={() => setActiveItem(null)}
                  className="text-neutral-400 hover:text-white text-xs px-2 py-1 rounded bg-neutral-800"
                >
                  {isFa ? 'بستن ✕' : 'Close ✕'}
                </button>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                {isFa ? activeItem.titleFa : activeItem.titleEn}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                {isFa ? activeItem.descriptionFa : activeItem.descriptionEn}
              </p>

              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                {isFa ? 'امکانات و ویژگی‌های تحت پوشش' : 'Detailed Specifications'}
              </h4>
              <ul className="space-y-2 mb-6">
                {(isFa ? activeItem.featuresFa : activeItem.featuresEn).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 mb-6">
                <div className="text-xs text-neutral-400 mb-1 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isFa ? 'پرامپت پیشنهادی برای شروع:' : 'Recommended starter prompt:'}</span>
                </div>
                <p className="text-xs sm:text-sm font-mono text-neutral-200">
                  {isFa ? activeItem.examplePromptFa : activeItem.examplePromptEn}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={(e) => handleCopyPrompt(activeItem, e)}
                  className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 rounded-lg border border-neutral-700 cursor-pointer"
                >
                  {copiedId === activeItem.id ? (isFa ? 'کپی شد!' : 'Copied!') : (isFa ? 'کپی پرامپت' : 'Copy Prompt')}
                </button>
                <button
                  onClick={() => {
                    onSelectPrompt(isFa ? activeItem.examplePromptFa : activeItem.examplePromptEn);
                    setActiveItem(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer"
                >
                  {isFa ? 'بارگذاری در پرامپت‌ساز' : 'Load in Prompt Builder'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
