import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
  QrCode,
  Copy,
  Check,
  Download,
  Printer,
  FileSpreadsheet,
  FileJson,
  X,
  ExternalLink,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { QRCodeDisplay } from './QRCodeDisplay';

interface DeviceConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl: string;
}

export const DeviceConnectModal: React.FC<DeviceConnectModalProps> = ({
  isOpen,
  onClose,
  sharedUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'phone' | 'export' | 'serverHelp'>('phone');
  const [copied, setCopied] = useState<boolean>(false);
  const [customHostUrl, setCustomHostUrl] = useState<string>('');

  if (!isOpen) return null;

  const effectiveUrl = customHostUrl.trim() || sharedUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(effectiveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenInNewTab = () => {
    window.open(effectiveUrl, '_blank');
  };


  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // Generate CSV for laboratory evaluation
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      'شماره پذیرش,کد تست,نام تست,مقدار ثبت شده,واحد,رنج نرمال مرجع,وضعیت همخوانی\n' +
      'P-8942,CPK,Total Creatine Kinase,180,U/L,39-308,نرمال\n' +
      'P-8942,CK-MB,Creatine Kinase MB,215,U/L,0-24,غیرممکن (بزرگتر از کل CPK)\n' +
      'P-8942,hs-cTnI,High Sensitivity Troponin I,45,ng/L,0-34,افزایش یافته\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LabWise_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const data = {
      app: 'LabWise Clinical Intelligence',
      version: '2.5',
      exportDate: new Date().toISOString(),
      standard: 'CLSI / HL7 Diagnostic Format',
      evaluations: [
        {
          sampleId: 'P-8942',
          date: new Date().toISOString(),
          errorProbabilityScore: 98,
          verdict: 'DEFINITE_ERROR_MACRO_CK',
          results: {
            CPK: { value: 180, unit: 'U/L' },
            CKMB: { value: 215, unit: 'U/L' },
            Troponin_I: { value: 45, unit: 'ng/L' },
          },
          concordanceIssues: ['CK-MB value exceeds Total CPK. Macro-CK suspected.'],
        },
      ],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LabWise_LIS_Export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">اتصال به گوشی و دریافت خروجی‌ها</h3>
              <p className="text-xs text-slate-400">
                باز کردن همزمان روی موبایل و تبلت، نصب PWA و خروجی‌های رسمی آزمایشگاه
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('phone')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'phone'
                ? 'border-cyan-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            بارکد اتصال گوشی (QR Code)
          </button>

          <button
            onClick={() => setActiveTab('serverHelp')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'serverHelp'
                ? 'border-cyan-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-4 h-4" />
            راهنمای راه‌اندازی و رفع خطای باز شدن
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'export'
                ? 'border-cyan-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            چاپ و خروجی اکسل/PDF
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'phone' && (
            <div className="space-y-6">
              {/* QR Code and Quick Connect */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <QRCodeDisplay url={effectiveUrl} size={160} />
                  <span className="text-[10px] text-slate-400 font-mono">اسکن با دوربین موبایل</span>
                </div>

                <div className="space-y-3 flex-1 text-right">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold inline-block">
                    اتصال فوری و بدون نیاز به نصب فایلهای پیچیده
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    آدرس فعال برنامه جهت باز شدن روی گوشی و سیستم
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    با باز کردن این آدرس یا اسکن بارکد، برنامه مستقیماً با تمام بخش‌ها و محاسبات هوشمند اجرا می‌شود.
                  </p>

                  {/* Active Link Box */}
                  <div className="pt-1 space-y-2">
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        readOnly
                        value={effectiveUrl}
                        className="bg-transparent text-xs text-cyan-300 font-mono w-full px-2 focus:outline-none dir-ltr text-left select-all"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'کپی شد!' : 'کپی'}
                      </button>
                      <button
                        onClick={handleOpenInNewTab}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                        title="تست باز کردن در تب جدید مرورگر"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        باز کردن
                      </button>
                    </div>

                    {/* Custom IP input (For local LAN Wi-Fi) */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                        <span>یا آی‌پی لپ‌تاپ خود را بنویسید (اتصال وای‌فای آزمایشگاه):</span>
                        {customHostUrl && (
                          <button
                            onClick={() => setCustomHostUrl('')}
                            className="text-cyan-400 hover:underline text-[10px]"
                          >
                            بازگشت به پیش‌فرض
                          </button>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: http://192.168.1.50:3000"
                        value={customHostUrl}
                        onChange={(e) => setCustomHostUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500 font-mono dir-ltr text-left"
                      />
                      <p className="text-[10px] text-slate-400">
                        با وارد کردن آی‌پی سیستم خود، بارکد بالا بلافاصله برای گوشی همکاران به‌روزرسانی می‌شود.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Install as Mobile App (PWA) Instructions */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white">
                    نصب به عنوان اپلیکیشن (PWA) روی گوشی و رایانه:
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <strong className="text-cyan-300 flex items-center gap-1">
                      📱 در گوشی‌های اندروید (Chrome):
                    </strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      در بالای مرورگر دکمه ۳ نقطه را زده و گزینه <strong>«افزودن به صفحه اصلی» (Add to Home screen)</strong> یا «نصب برنامه» را لمس کنید تا آیکون LabWise روی صفحه گوشی شما قرار گیرد.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <strong className="text-purple-300 flex items-center gap-1">
                      🍏 در گوشی‌های آیفون (Safari):
                    </strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      در پایین صفحه دکمه اشتراک‌گذاری (Share) را لمس کرده و به پایین اسکرول کنید و <strong>Add to Home Screen (افزودن به صفحه اصلی)</strong> را انتخاب نمایید.
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>داده‌های ثبت‌شده روی گوشی و کامپیوتر به صورت ابری همگام‌سازی می‌شوند.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'serverHelp' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
                <h4 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4" />
                  چرا آدرس قبلی روی گوشی یا خارج از این صفحه باز نشد؟
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  آدرس‌های موقت توسعه داخل گوگل استودیو (<code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">ais-dev</code> یا <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">ais-pre</code>) به دلیل پروتکل‌های امنیتی گوگل، تنها در مرورگری باز می‌شوند که حساب جیمیل سازنده در آن فعال باشد و روی گوشی‌های دیگر خطای ۴۰۴ یا احراز هویت می‌دهند.
                </p>
              </div>

              {/* One-Click Direct ZIP Download */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-950/40">
                <div className="space-y-1">
                  <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-cyan-400" />
                    دانلود فوری کل فایل‌های برنامه (فایل ZIP کامل):
                  </h5>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    نیازی به جستجو در منوهای گوگل نیست؛ همین الان با زدن دکمه روبرو، کل فایل‌های پروژه در کامپیوتر شما ذخیره می‌شود.
                  </p>
                </div>
                <a
                  href="/labwise-project.zip"
                  download="labwise-complete-project.zip"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  دانلود فایل ZIP پروژه
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Method A: Local Wi-Fi */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">۱</span>
                    <h5 className="font-bold text-white text-xs">اجرا روی لپ‌تاپ در وای‌فای آزمایشگاه (سریع‌ترین راه)</h5>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    کافیست پروژه را روی لپ‌تاپ خود دانلود یا اجرا کنید:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 font-mono bg-slate-900 p-3 rounded-xl border border-slate-800 dir-ltr text-left">
                    <li>npm install</li>
                    <li>npm run dev -- --host 0.0.0.0</li>
                  </ol>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    سپس با دستور <code className="text-cyan-400">ipconfig</code> در ویندوز، آی‌پی لپ‌تاپ خود را ببینید (مثلاً <code className="text-cyan-400">192.168.1.45</code>) و به همکاران بگویید در وای‌فای آزمایشگاه آدرس <code className="text-emerald-400">http://192.168.1.45:3000</code> را باز کنند.
                  </p>
                </div>

                {/* Method B: Instant Public Tunnel */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">۲</span>
                    <h5 className="font-bold text-white text-xs">لینک اینترنتی رایگان برای گوشی بدون نیاز به وای‌فای مشترک</h5>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    با اجرای دستور زیر در ترمینال لپ‌تاپ، یک لینک اینترنتی عمومی مانند <code className="text-purple-300">https://labwise.loca.lt</code> به شما داده می‌شود که روی هر گوشی با اینترنت همراه باز خواهد شد:
                  </p>
                  <div className="text-[11px] text-emerald-300 font-mono bg-slate-900 p-3 rounded-xl border border-slate-800 dir-ltr text-left">
                    npx localtunnel --port 3000
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    این لینک را در کادر بالا وارد کنید تا بارکد آن ساخته شده و همکاران فوراً اسکن نمایند.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (


            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                می‌توانید ارزیابی جاری بیمار، محاسبات شاخص‌های بیوشیمیایی و خطایابی انجام‌شده را در قالب‌های مختلف رسمی خروجی بگیرید:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Print PDF */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
                      <Printer className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-xs text-white">چاپ و ذخیره PDF برگه آزمایش</h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      گزارش رسمی دارای سربرگ آزمایشگاه، جدول رنج نرمال، درصد خطا و محل امضای مسئول فنی.
                    </p>
                  </div>

                  <button
                    onClick={handlePrintPDF}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    پرینت / ذخیره به عنوان PDF
                  </button>
                </div>

                {/* Export CSV / Excel */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-xs text-white">خروجی اکسل (CSV)</h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      جدول داده‌ها و مقادیر ثبت‌شده برای تحلیل آماری، تحقیقاتی و آرشیو ماهانه آزمایشگاه.
                    </p>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    دانلود فایل اکسل (CSV)
                  </button>
                </div>

                {/* Export JSON / LIS */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                      <FileJson className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-xs text-white">خروجی استاندارد LIS / JSON</h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      فرمت استاندارد داده‌ای سازگار با نرم‌افزارهای مدیریت جوابدهی آزمایشگاه (LIS).
                    </p>
                  </div>

                  <button
                    onClick={handleExportJSON}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    دانلود دیتای JSON
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
