import React from 'react';
import {
  FlaskConical,
  Activity,
  BookOpen,
  LineChart,
  Boxes,
  Globe2,
  Bot,
  User as UserIcon,
  LogIn,
  LogOut,
  ShieldCheck,
  Database,
  Sparkles,
  QrCode,
  SlidersHorizontal,
  Download,
  Cpu,
} from 'lucide-react';

import { User } from 'firebase/auth';

export type ActiveTab = 'workbench' | 'directory' | 'kit_ranges' | 'qc' | 'reagents' | 'devices' | 'articles' | 'ai_chat';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: User | null;
  isAdmin?: boolean;
  onLogin: () => void;
  onLogout: () => void;
  isFirestoreOnline: boolean;
  onOpenDeviceModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  isAdmin = false,
  onLogin,
  onLogout,
  isFirestoreOnline,
  onOpenDeviceModal,
}) => {

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'workbench', label: 'کارتابل اعتبارسنجی و سنجش خطا', icon: Activity },
    { id: 'directory', label: 'دایرةالمعارف تست‌ها و رنج نرمال', icon: BookOpen },
    { id: 'kit_ranges', label: '⚙️ تنظیم رنج کیت‌ها (مدیریت)', icon: SlidersHorizontal },
    { id: 'qc', label: 'کنترل کیفی و چارت وستگارد', icon: LineChart },
    { id: 'reagents', label: 'پورتال فنی و بازرگانی محلول‌ها', icon: Boxes },
    { id: 'devices', label: 'پارامتر دستگاه‌های بیوشیمی', icon: Cpu },
    { id: 'articles', label: 'مقالات علمی و رویدادهای بین‌المللی', icon: Globe2 },
    { id: 'ai_chat', label: 'مشاور هوش مصنوعی Gemini', icon: Bot },
  ];


  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-sky-100 text-slate-800 shadow-sm shadow-sky-100/50">
      {/* Top Banner & Quick Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 p-2 shadow-lg shadow-cyan-500/25 flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1.5 font-sans">
                LabWise
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-mono">
                  Clinical Intelligence v2.5
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              سامانه هوشمند اعتبارسنجی متقاطع، کنترل کیفی محلول‌ها و تصمیم‌یار بالینی آزمایشگاه
            </p>
          </div>
        </div>

        {/* Status Indicators & Auth */}
        <div className="flex items-center gap-3">
          {/* Firestore status */}
          <div
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
              isFirestoreOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
            title="پایگاه داده همگام Firestore برای ذخیره ارزیابی‌ها و ران‌های کنترل کیفی"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Firestore:</span>
            <span className="font-mono text-[11px] font-semibold">{isFirestoreOnline ? 'همگام و آنلاین' : 'آفلاین / کش محلی'}</span>
          </div>

          {/* Gemini AI Status */}
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Gemini AI:</span>
            <span className="font-mono text-[11px] font-semibold">آماده تحلیل</span>
          </div>

          {/* Role Status Badge */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold" title="شما به عنوان مدیر کل و مسئول فنی احراز هویت شده‌اید">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>مدیر ارشد (Admin)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200" title="دسترسی کارشناس آزمایشگاه: ثبت جواب بیماران و خطایابی فعال است">
              <UserIcon className="w-3.5 h-3.5 text-cyan-600" />
              <span>کارشناس آزمایشگاه</span>
            </div>
          )}

          {/* Direct Project ZIP Download Button */}
          <a
            href="/labwise-project.zip"
            download="labwise-complete-project.zip"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            title="دانلود کل سورس‌کد و فایل‌های پروژه در یک فایل ZIP کامل برای اجرا روی لپ‌تاپ"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">📦 دانلود کامل پروژه (ZIP)</span>
            <span className="md:hidden">📦 دانلود ZIP</span>
          </a>

          {/* Connect Mobile & Export Button */}
          <button
            onClick={onOpenDeviceModal}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            title="نمایش QR Code، باز کردن روی گوشی و خروجی‌های PDF و اکسل"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">📱 باز کردن روی گوشی و خروجی</span>
            <span className="sm:hidden">📱 گوشی / خروجی</span>
          </button>


          {/* User Auth Profile */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full py-1 px-3 text-xs">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-[11px]">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="max-w-[120px] truncate text-slate-700">
                {user.displayName || user.email || 'کارشناس آزمایشگاه'}
              </span>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-500 transition-colors mr-1 p-0.5"
                title="خروج از حساب"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              ورود با گوگل / حساب کاربری
            </button>
          )}
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm shadow-cyan-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-sky-50/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

