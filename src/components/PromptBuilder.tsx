import React, { useState } from 'react';
import { PROMPT_TEMPLATES } from '../data/capabilitiesData';
import { PromptTemplate } from '../types';
import { Sparkles, Copy, Check, Terminal, Sliders, Send } from 'lucide-react';

interface PromptBuilderProps {
  lang: 'fa' | 'en';
  initialPrompt?: string;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({ lang, initialPrompt }) => {
  const isFa = lang === 'fa';
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(PROMPT_TEMPLATES[0]);
  const [appType, setAppType] = useState<string>('dashboard');
  const [useDatabase, setUseDatabase] = useState<'postgresql' | 'firestore' | 'local'>('firestore');
  const [useAI, setUseAI] = useState<boolean>(true);
  const [customGoal, setCustomGoal] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate customized prompt dynamically
  const generateDynamicPrompt = (): string => {
    if (customGoal.trim().length > 0) {
      if (isFa) {
        return `یک وب‌اپلیکیشن کامل با React 19، تایپ‌اسکریپت و Tailwind بساز با هدف: "${customGoal}". ${
          useDatabase === 'postgresql'
            ? 'از پایگاه داده رابطه‌ای PostgreSQL استفاده کن.'
            : useDatabase === 'firestore'
            ? 'از دیتابیس Firebase Firestore برای ذخیره هم‌زمان داده‌ها استفاده کن.'
            : 'داده‌ها را در حافظه کلاینت مدیریت کن.'
        } ${
          useAI
            ? 'مدل هوش مصنوعی Gemini را برای تحلیل هوشمند و پاسخ‌گویی به کاربر ادغام کن.'
            : ''
        } ظاهر برنامه مدرن، ریسپانسیو و با بهترین استانداردهای طراحی باشد.`;
      } else {
        return `Build a production-grade web application using React 19, TypeScript, and Tailwind CSS for: "${customGoal}". ${
          useDatabase === 'postgresql'
            ? 'Integrate a relational PostgreSQL database.'
            : useDatabase === 'firestore'
            ? 'Integrate Firebase Firestore for realtime data synchronization.'
            : 'Manage state client-side.'
        } ${
          useAI
            ? 'Integrate Google Gemini AI for smart analysis and reasoning.'
            : ''
        } Ensure responsive UI and clean architecture.`;
      }
    }

    if (selectedTemplate) {
      return isFa ? selectedTemplate.promptFa : selectedTemplate.promptEn;
    }

    return isFa
      ? 'یک وب‌اپلیکیشن مدرن با رابط کاربری تمیز و تعاملی بساز.'
      : 'Build a modern web application with a clean, interactive user interface.';
  };

  const currentPrompt = generateDynamicPrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="prompt-builder" className="py-20 lg:py-28 border-b border-neutral-900 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>{isFa ? 'مولد پرامپت مهندسی' : 'Interactive Prompt Studio'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-400">{isFa ? 'آماده برای ارسال در چت' : 'Ready to Run'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {isFa ? 'پرامپت پروژه دلخواهتان را بسازید و به من بدهید' : 'Generate A Custom Project Prompt'}
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            {isFa
              ? 'یکی از سناریوهای آماده را انتخاب کنید یا هدف خود را بنویسید تا دستور دقیق مهندسی ایجاد شود. آن را کپی کنید و در چت بفرستید تا فوراً بسازم!'
              : 'Pick a template or describe your idea to generate an optimal architectural prompt. Copy and submit it to me in chat to start building!'}
          </p>
        </div>

        {/* Builder Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls & Templates Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Templates Picker */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                {isFa ? 'سناریوهای از پیش آماده (کلیک کنید):' : 'Pre-Engineered Templates:'}
              </label>
              <div className="space-y-2.5">
                {PROMPT_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplate?.id === tmpl.id && customGoal === '';
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplate(tmpl);
                        setCustomGoal('');
                      }}
                      className={`w-full text-start p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-900 border-indigo-500 shadow-sm'
                          : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-white">{isFa ? tmpl.titleFa : tmpl.titleEn}</span>
                        <span className="text-[11px] font-mono text-neutral-400">{tmpl.complexity}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                        <span>{tmpl.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-indigo-400 font-mono">{tmpl.estimatedTimeFa}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input */}
            <div className="pt-4 border-t border-neutral-900">
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                {isFa ? 'یا ایده دلخواه خود را در یک خط بنویسید:' : 'Or Describe Your Custom App Idea:'}
              </label>
              <input
                type="text"
                placeholder={isFa ? 'مثال: سامانه نوبت‌دهی مشاوره آنلاین با تقویم و یادآور' : 'e.g. Online consultation booking with calendar and notes'}
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Feature Options */}
            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-4">
              <div className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isFa ? 'پیکربندی فنی:' : 'Technical Preferences:'}</span>
              </div>

              {/* Database Choice */}
              <div>
                <span className="block text-[11px] text-neutral-400 mb-1.5">
                  {isFa ? 'پایگاه داده:' : 'Database:'}
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setUseDatabase('firestore')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer ${
                      useDatabase === 'firestore'
                        ? 'bg-neutral-800 border-indigo-500 text-white'
                        : 'border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Firestore
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseDatabase('postgresql')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer ${
                      useDatabase === 'postgresql'
                        ? 'bg-neutral-800 border-indigo-500 text-white'
                        : 'border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    PostgreSQL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseDatabase('local')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-colors cursor-pointer ${
                      useDatabase === 'local'
                        ? 'bg-neutral-800 border-indigo-500 text-white'
                        : 'border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {isFa ? 'لوکال' : 'Local'}
                  </button>
                </div>
              </div>

              {/* AI Gemini Toggle */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800/80">
                <span className="text-neutral-300">{isFa ? 'ادغام هوش مصنوعی Gemini:' : 'Gemini AI Integration:'}</span>
                <button
                  type="button"
                  onClick={() => setUseAI(!useAI)}
                  className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    useAI ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {useAI ? (isFa ? 'فعال' : 'Enabled') : (isFa ? 'غیرفعال' : 'Disabled')}
                </button>
              </div>
            </div>
          </div>

          {/* Generated Prompt Output Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span>{isFa ? 'پرامپت نهایی تولید شده برای استودیو' : 'Generated AI Studio Prompt'}</span>
                </div>
                <span className="text-xs text-emerald-400 font-medium">
                  {isFa ? '۱۰۰٪ آماده اجرا' : 'Ready to Copy & Run'}
                </span>
              </div>

              {/* Prompt Box */}
              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm leading-relaxed font-sans min-h-[220px] whitespace-pre-wrap select-all">
                {currentPrompt}
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs text-neutral-400">
                <span className="font-mono text-indigo-400">Stack:</span>
                <span>React 19 · TypeScript · Tailwind CSS · Express · {useDatabase.toUpperCase()}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-neutral-400">
                {isFa
                  ? 'این پرامپت را کپی کرده و در کادر چت بفرستید تا فوراً شروع به ساخت کنم.'
                  : 'Copy this prompt and submit it in the conversation to start coding immediately.'}
              </span>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>{isFa ? 'کپی شد! در چت بفرستید' : 'Copied! Send in chat'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{isFa ? 'کپی این پرامپت' : 'Copy This Prompt'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
