import React, { useState } from 'react';
import {
  Boxes,
  Cpu,
  Wrench,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  FileCheck2,
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingDown,
  Layers,
  ThermometerSnowflake,
  FlaskRound,
} from 'lucide-react';
import { REAGENT_CATALOG } from '../data/reagentsData';

export const ReagentTechnicalPortal: React.FC = () => {
  // AI Troubleshooting state
  const [reagentName, setReagentName] = useState<string>('کیت بیوشیمی تشخیصی CK-MB (ایمونواینهیبیشن)');
  const [testCode, setTestCode] = useState<string>('CK-MB');
  const [lotNumber, setLotNumber] = useState<string>('CKMB-2026-B14');
  const [targetMean, setTargetMean] = useState<number>(45.2);
  const [targetSD, setTargetSD] = useState<number>(3.1);
  const [currentValues, setCurrentValues] = useState<string>('52.0, 52.4');
  const [issueDescription, setIssueDescription] = useState<string>(
    'دو روز است که کنترل نرمال بالاتر از +2SD می‌افتد (نقض قانون 2:2s وستگارد). جذب نوری اولیه بلانک معرف در ۳۴۰ نانومتر از ۱.۲۰۰ به ۱.۰۲۰ افت کرده است.'
  );

  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [activeTroubleTopic, setActiveTroubleTopic] = useState<string>('blank_drift');

  // Call Gemini Reagent Troubleshoot API
  const handleConsultAI = async () => {
    setIsLoadingAI(true);
    setAiError(null);
    try {
      const parsedValues = currentValues
        .split(',')
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));

      const payload = {
        reagentName,
        testCode,
        lotNumber,
        targetMean,
        targetSD,
        currentValues: parsedValues,
        issueDescription,
      };

      const res = await fetch('/api/gemini/reagent-troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`خطای سرور: ${res.statusText}`);
      }

      const data = await res.json();
      setAiAdvice(data.advice);
    } catch (e: any) {
      console.error(e);
      setAiError(e.message || 'خطا در ارتباط با مشاور هوش مصنوعی');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Boxes className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                پورتال مهندسی، کنترل کیفی و پشتیبانی فنی محلول‌های بیوشیمی و ایمونولوژی
              </h2>
              <p className="text-xs text-slate-400">
                ویژه تولید، واردات، صحه‌گذاری تجاری، حل چالش‌های فرمولاسیون و عیب‌یابی آنالایزرها
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono">
              ISO 13485 &amp; CE-IVD Standard
            </span>
          </div>
        </div>
      </div>

      {/* Catalog & Specifications Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-cyan-400" />
          کاتالوگ فنی محلول‌های آماده تحویل و وارداتی (Liquid-Stable &amp; Turbidimetric)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REAGENT_CATALOG.map((reagent) => (
            <div
              key={reagent.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono font-bold text-xs">
                    {reagent.testCode}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    {reagent.catalogNumber}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm leading-snug">{reagent.name}</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">{reagent.methodology}</p>

                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">بسته‌بندی (Packaging):</span>
                    <span className="text-slate-200 font-mono text-[11px]">{reagent.packaging}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">حد سنجش خطی (Linearity):</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {reagent.linearityLimit} {reagent.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">پایداری آنبورد دستگاه:</span>
                    <span className="text-purple-300 font-mono">{reagent.onBoardStabilityDays} روز</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">دمای نگهداری:</span>
                    <span className="text-cyan-300 font-mono">{reagent.storageTemp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">شماره لات جاری:</span>
                    <span className="text-amber-400 font-mono">{reagent.lotNumber}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                  {reagent.technicalNotesFa}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setReagentName(reagent.name);
                    setTestCode(reagent.testCode);
                    setLotNumber(reagent.lotNumber);
                    setTargetMean(reagent.targetMean);
                    setTargetSD(reagent.targetSD);
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer text-center"
                >
                  انتقال به میز عیب‌یابی فنی هوشمند
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting Guide & AI Support Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Fast Troubleshooting Tree */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">راهنمای فوری عیب‌یابی کیت‌ها و آنالایزرها</h3>
          </div>

          <div className="flex flex-col gap-2">
            {[
              {
                id: 'blank_drift',
                title: '۱. افزایش یا افت شدید جذب نوری بلانک معرف (Reagent Blank)',
                solutionFa:
                  'در تست‌های کینتیک آنزیمی مانند AST/ALT در ۳۴۰ نانومتر، افت جذب اولیه به زیر ۱.۱۰۰ نشان‌دهنده اکسیداسیون خودبه‌خودی NADH بر اثر گرما یا نور است. در تست‌های کالریمتری مانند بیلی‌روبین یا کراتینین، افزایش جذب بلانک نشان‌دهنده آلودگی با آب مقطر یا شستشوی ناقص کووت است. آب مقطر دستگاه را با هدایت‌سنج (Conductivity < 1 µS/cm) چک کنید.',
              },
              {
                id: 'calib_failure',
                title: '۲. خطای عدم تطابق منحنی کالیبراسیون (Calibration Curve Failure)',
                solutionFa:
                  'بررسی فاکتور K محاسبه‌شده نسبت به مقدار استاندارد. علل: بازسازی نادرست کالیبراتور لیوفیلیزه (حجم پیپت نامناسب)، کهنگی بیش از ۳ روز کالیبراتور حل‌شده، یا تشکیل رسوب در معرف دوم R2. توصیه: یک ویال کالیبراتور نو با پیپت کالیبره‌شده حل شود.',
              },
              {
                id: 'prozone_effect',
                title: '۳. پدیده پروزون یا هوک در کیت‌های لاتکس ایمونولوژی (Hook Effect)',
                solutionFa:
                  'در کیت‌های توربیدیمتری مانند CRP یا Ferritin، در مقادیر بسیار نجومی آنالیت، تمامی جایگاه‌های آنتی‌بادی اشباع شده و شبکه آگلوتیناسیون تشکیل نمی‌شود و نتیجه کاذب پایین گزارش می‌شود! نمونه باید با سالین ۱:۵ یا ۱:۱۰ رقیق شده و عدد حاصل در ضریب رقت ضرب گردد.',
              },
              {
                id: 'onboard_degrade',
                title: '۴. افت کیفیت کیت قبل از پایان انقضا در محفظه آنبورد دستگاه',
                solutionFa:
                  'دمای یخچال آنبورد دستگاه باید پیوسته با دماسنج کالیبره کنترل شود (بین ۴ تا ۸ درجه). عدم وجود درب ضدتبخیر باعث تغلیظ حلال در طول هفته می‌شود. درب‌های معرف را شب‌ها بسته نگه دارید.',
              },
            ].map((topic) => (
              <div
                key={topic.id}
                onClick={() => setActiveTroubleTopic(topic.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeTroubleTopic === topic.id
                    ? 'bg-slate-800/90 border-cyan-500/50'
                    : 'bg-slate-950/70 border-slate-800/70 hover:border-slate-700'
                }`}
              >
                <h4 className="text-xs font-bold text-slate-200">{topic.title}</h4>
                {activeTroubleTopic === topic.id && (
                  <p className="text-[11px] text-slate-300 mt-2 pt-2 border-t border-slate-800 leading-relaxed">
                    {topic.solutionFa}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Reagent Expert Desk */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">میز مشاوره و ریشه‌یابی فنی هوش مصنوعی Gemini</h3>
            </div>
            <span className="text-[10px] text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              QC &amp; Chemistry Specialist
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">نام محصول / محلول:</label>
              <input
                type="text"
                value={reagentName}
                onChange={(e) => setReagentName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">کد تست و شماره لات ساخت:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  placeholder="CK-MB"
                />
                <input
                  type="text"
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  placeholder="LOT-2026-X"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">میانگین هدف کنترل (Mean) و انحراف معیار (SD):</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  value={targetMean}
                  onChange={(e) => setTargetMean(Number(e.target.value))}
                  className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  placeholder="Target Mean"
                />
                <input
                  type="number"
                  step="any"
                  value={targetSD}
                  onChange={(e) => setTargetSD(Number(e.target.value))}
                  className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  placeholder="Target SD"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">آخرین مقادیر خوانده‌شده کنترل (با کاما):</label>
              <input
                type="text"
                value={currentValues}
                onChange={(e) => setCurrentValues(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                placeholder="مثال: 51.5, 52.8"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1">شرح مشکل، رفتار بلانک یا پیام خطای آنالایزر:</label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none leading-relaxed"
                placeholder="توضیح مشکل فنی..."
              />
            </div>
          </div>

          <button
            onClick={handleConsultAI}
            disabled={isLoadingAI}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            {isLoadingAI ? 'در حال ریشه‌یابی و تولید راهکار فنی...' : 'درخواست تحلیل و ریشه‌یابی فنی از Gemini AI'}
          </button>

          {aiError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {aiError}
            </div>
          )}

          {aiAdvice && (
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <CheckCircle2 className="w-4 h-4" />
                پاسخ فنی و دستورالعمل اجرایی هوش مصنوعی:
              </div>
              <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                {aiAdvice}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
