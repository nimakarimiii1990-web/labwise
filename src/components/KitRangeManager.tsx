import React, { useState, useMemo } from 'react';
import { User } from 'firebase/auth';
import {
  SlidersHorizontal,
  Lock,
  Unlock,
  ShieldCheck,
  Save,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Smartphone,
  Server,
  Layers,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Info,
  Building2,
} from 'lucide-react';
import { CLINICAL_TESTS } from '../data/testsCatalog';
import { DEPARTMENTS } from '../data/departmentsData';
import { DepartmentId } from '../types/lab';
import {
  CustomKitRange,
  saveCustomKitRangeToFirestore,
  deleteCustomKitRangeFromFirestore,
  checkIsAdmin,
  ADMIN_MASTER_EMAIL,
  DEFAULT_SUPERVISOR_PIN,
} from '../services/firebaseService';

interface KitRangeManagerProps {
  user: User | null;
  customRanges: Record<string, CustomKitRange>;
  onRefreshRanges?: () => void;
  onOpenDeviceModal?: () => void;
}

const COMMON_KIT_BRANDS = [
  'پارس آزمون (Pars Azmun)',
  'بایوسیستمز اسپانیا (BioSystems)',
  'روک کوباس (Roche Cobas)',
  'زیست شیمی (ZistChem)',
  'پیشتاز طب (Pishtaz Teb)',
  'زیمنس (Siemens Atellica / Dimension)',
  'بکمن کولتر (Beckman Coulter)',
  'مایندری (Mindray)',
  'سیس‌مکس (Sysmex)',
  'دیاسیس آلمان (DiaSys)',
  'کیت تحقیقاتی / استاندارد اختصاصی آزمایشگاه',
];

export const KitRangeManager: React.FC<KitRangeManagerProps> = ({
  user,
  customRanges,
  onOpenDeviceModal,
}) => {
  // Supervisor authorization state
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Filter state
  const [selectedDept, setSelectedDept] = useState<DepartmentId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected test for editing
  const [selectedTestId, setSelectedTestId] = useState<string>('cpk_total');

  // Form edit state for selected test
  const activeCustom = customRanges[selectedTestId];
  const defaultTestDef = useMemo(
    () => CLINICAL_TESTS.find((t) => t.id === selectedTestId) || CLINICAL_TESTS[0],
    [selectedTestId]
  );

  // Form fields
  const [kitBrand, setKitBrand] = useState<string>(activeCustom?.kitBrand || 'پارس آزمون (Pars Azmun)');
  const [unit, setUnit] = useState<string>(activeCustom?.unit || defaultTestDef.defaultUnit);
  const [maleMin, setMaleMin] = useState<number>(
    activeCustom?.maleMin ?? (defaultTestDef.referenceRanges.find((r) => r.gender === 'male' || r.gender === 'both')?.low ?? 0)
  );
  const [maleMax, setMaleMax] = useState<number>(
    activeCustom?.maleMax ?? (defaultTestDef.referenceRanges.find((r) => r.gender === 'male' || r.gender === 'both')?.high ?? 100)
  );
  const [femaleMin, setFemaleMin] = useState<number>(
    activeCustom?.femaleMin ?? (defaultTestDef.referenceRanges.find((r) => r.gender === 'female' || r.gender === 'both')?.low ?? 0)
  );
  const [femaleMax, setFemaleMax] = useState<number>(
    activeCustom?.femaleMax ?? (defaultTestDef.referenceRanges.find((r) => r.gender === 'female' || r.gender === 'both')?.high ?? 100)
  );
  const [panicLow, setPanicLow] = useState<string>(
    activeCustom?.panicLow !== undefined
      ? String(activeCustom.panicLow)
      : defaultTestDef.panicLow !== undefined
      ? String(defaultTestDef.panicLow)
      : ''
  );
  const [panicHigh, setPanicHigh] = useState<string>(
    activeCustom?.panicHigh !== undefined
      ? String(activeCustom.panicHigh)
      : defaultTestDef.panicHigh !== undefined
      ? String(defaultTestDef.panicHigh)
      : ''
  );
  const [notes, setNotes] = useState<string>(
    activeCustom?.notes || 'کالیبراسیون تأییدشده با سرم کنترل بیوشیمی دو سطحی'
  );

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'manager' | 'networkGuide'>('manager');

  // Admin access check: either logged in with master email or unlocked via supervisor PIN
  const isAdminAuthorized = useMemo(() => {
    return checkIsAdmin(user, isPinUnlocked ? DEFAULT_SUPERVISOR_PIN : undefined);
  }, [user, isPinUnlocked]);

  // When selected test changes, sync form
  const handleSelectTest = (testId: string) => {
    setSelectedTestId(testId);
    setSaveSuccess(null);
    const custom = customRanges[testId];
    const def = CLINICAL_TESTS.find((t) => t.id === testId);
    if (!def) return;

    if (custom) {
      setKitBrand(custom.kitBrand);
      setUnit(custom.unit);
      setMaleMin(custom.maleMin);
      setMaleMax(custom.maleMax);
      setFemaleMin(custom.femaleMin);
      setFemaleMax(custom.femaleMax);
      setPanicLow(custom.panicLow !== undefined ? String(custom.panicLow) : '');
      setPanicHigh(custom.panicHigh !== undefined ? String(custom.panicHigh) : '');
      setNotes(custom.notes || '');
    } else {
      const maleRef = def.referenceRanges.find((r) => r.gender === 'male' || r.gender === 'both');
      const femaleRef = def.referenceRanges.find((r) => r.gender === 'female' || r.gender === 'both');
      setKitBrand('پارس آزمون (Pars Azmun)');
      setUnit(def.defaultUnit);
      setMaleMin(maleRef?.low ?? 0);
      setMaleMax(maleRef?.high ?? 100);
      setFemaleMin(femaleRef?.low ?? 0);
      setFemaleMax(femaleRef?.high ?? 100);
      setPanicLow(def.panicLow !== undefined ? String(def.panicLow) : '');
      setPanicHigh(def.panicHigh !== undefined ? String(def.panicHigh) : '');
      setNotes('مطابق با بروشور تجاری کیت و استاندارد کالیبراسیون IFCC');
    }
  };

  // Handle PIN unlock
  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === DEFAULT_SUPERVISOR_PIN || enteredPin === '1990') {
      setIsPinUnlocked(true);
      setPinError(null);
    } else {
      setPinError('رمز سرپرست نادرست است (رمز پیش‌فرض: 1990)');
    }
  };

  // Save changes
  const handleSaveRange = async () => {
    if (!isAdminAuthorized) {
      alert('تنها مسئول فنی و مدیر سیستم مجاز به تغییر رنج‌های مرجع است.');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(null);

    const payload: CustomKitRange = {
      id: selectedTestId,
      testId: selectedTestId,
      kitBrand,
      unit,
      maleMin: Number(maleMin),
      maleMax: Number(maleMax),
      femaleMin: Number(femaleMin),
      femaleMax: Number(femaleMax),
      panicLow: panicLow.trim() !== '' ? Number(panicLow) : undefined,
      panicHigh: panicHigh.trim() !== '' ? Number(panicHigh) : undefined,
      notes,
      updatedBy: user?.email || 'Admin_Supervisor_Workstation',
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveCustomKitRangeToFirestore(payload);
      setSaveSuccess(`رنج کیت ${defaultTestDef.nameFa} با موفقیت در دیتابیس مرکزی ذخیره شد و روی گوشی تمام همکاران اعمال گردید.`);
      setTimeout(() => setSaveSuccess(null), 5000);
    } catch (err: any) {
      alert('خطا در ذخیره اطلاعات: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to textbook default
  const handleResetToDefault = async () => {
    if (!isAdminAuthorized) return;
    if (!confirm(`آیا مایلید رنج اختصاصی تست ${defaultTestDef.nameFa} را حذف کرده و به مقادیر استاندارد جهانی بازگردانید؟`)) {
      return;
    }

    try {
      await deleteCustomKitRangeFromFirestore(selectedTestId);
      handleSelectTest(selectedTestId);
      setSaveSuccess(`رنج تست به مقادیر پیش‌فرض مرجع بازنشانی شد.`);
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      alert('خطا در بازنشانی: ' + err.message);
    }
  };

  // Filtered test catalog
  const filteredTests = useMemo(() => {
    return CLINICAL_TESTS.filter((t) => {
      const matchDept = selectedDept === 'all' || t.department === selectedDept;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.code.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.nameFa.includes(q);
      return matchDept && matchSearch;
    });
  }, [selectedDept, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner / Access Control Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">
                مدیریت اختصاصی رنج کیت‌ها و کنترل دسترسی سرور
              </h2>
              {isAdminAuthorized ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  دسترسی مدیریت ارشد (Admin)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  حالت پرسنل آزمایشگاه (فقط خواندنی)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              تنظیم رنج نرمال و مقادیر بحرانی کیت‌های تجاری (پارس آزمون، بایوسیستمز، پیشتاز طب و...). تغییرات در دیتابیس Firestore ذخیره شده و هم‌زمان روی گوشی تمام همکاران اعمال می‌شود.
            </p>
          </div>
        </div>

        {/* Action Toggle & Pin Unlock */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewTab('manager')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewTab === 'manager'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              کالیبراسیون کیت‌ها
            </button>
            <button
              onClick={() => setViewTab('networkGuide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewTab === 'networkGuide'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              راهنمای راه‌اندازی سرور
            </button>
          </div>

          {!isAdminAuthorized && (
            <div className="flex items-center gap-2">
              <form onSubmit={handleUnlockPin} className="flex items-center gap-1.5">
                <input
                  type="password"
                  placeholder="رمز مدیر (1990)"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  className="w-28 px-2.5 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono text-center"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  بازگشایی
                </button>
              </form>
            </div>
          )}

          {isAdminAuthorized && (
            <button
              onClick={() => setIsPinUnlocked(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="قفل کردن پنل مدیریت"
            >
              <Lock className="w-3.5 h-3.5" />
              قفل دسترسی
            </button>
          )}
        </div>
      </div>

      {pinError && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{pinError}</span>
        </div>
      )}

      {/* Main Tabs */}
      {viewTab === 'manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Test Selector (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  انتخاب تست جهت تنظیم کیت
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {filteredTests.length} تست
                </span>
              </div>

              {/* Department Filter */}
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value as DepartmentId | 'all')}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="all">همه بخش‌های آزمایشگاهی</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nameFa}
                  </option>
                ))}
              </select>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="جستجوی کد یا نام تست..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pr-9 pl-3 py-2 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Tests Scroll List */}
              <div className="max-h-[500px] overflow-y-auto space-y-1.5 pr-1">
                {filteredTests.map((test) => {
                  const isCustomized = !!customRanges[test.id];
                  const isSelected = test.id === selectedTestId;

                  return (
                    <button
                      key={test.id}
                      onClick={() => handleSelectTest(test.id)}
                      className={`w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-lg shadow-cyan-500/5'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">
                            {test.code}
                          </span>
                          <span className="text-xs font-semibold line-clamp-1">
                            {test.nameFa}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>واحد: {test.defaultUnit}</span>
                          {isCustomized && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              کیت سفارشی
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? 'rotate-180 text-cyan-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Kit Range Editor & Calibration Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              {/* Test Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-extrabold text-cyan-400">
                        {defaultTestDef.code}
                      </span>
                      <h3 className="text-base font-bold text-white">
                        {defaultTestDef.nameFa}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">
                        ({defaultTestDef.nameEn})
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      نمونه: {defaultTestDef.specimen} | {defaultTestDef.tubeType}
                    </p>
                  </div>
                </div>

                {customRanges[selectedTestId] && (
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold inline-block">
                      کیت فعال: {customRanges[selectedTestId].kitBrand}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      آخرین ویرایش: {new Date(customRanges[selectedTestId].updatedAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                )}
              </div>

              {/* Notification Message */}
              {saveSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {/* Editor Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Kit Commercial Brand */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      برند تجاری و شرکت سازنده کیت
                    </label>
                    {isAdminAuthorized ? (
                      <div className="space-y-2">
                        <select
                          value={kitBrand}
                          onChange={(e) => setKitBrand(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500 cursor-pointer"
                        >
                          {COMMON_KIT_BRANDS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="یا نام برند کیت مورد نظر خود را بنویسید..."
                          value={kitBrand}
                          onChange={(e) => setKitBrand(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-semibold">
                        {kitBrand}
                      </div>
                    )}
                  </div>

                  {/* Measurement Unit */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      واحد اندازه‌گیری (Unit)
                    </label>
                    {isAdminAuthorized ? (
                      <input
                        type="text"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    ) : (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
                        {unit}
                      </div>
                    )}
                  </div>
                </div>

                {/* Normal Range: Male and Female */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                    محدوده رفرنس نرمال کیت (Reference Interval)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Adult Male Range */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-blue-400">
                        👨 رنج نرمال آقایان (Adult Male)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">حداقل (Min)</span>
                          <input
                            type="number"
                            step="any"
                            disabled={!isAdminAuthorized}
                            value={maleMin}
                            onChange={(e) => setMaleMin(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-60 text-center"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">حداکثر (Max)</span>
                          <input
                            type="number"
                            step="any"
                            disabled={!isAdminAuthorized}
                            value={maleMax}
                            onChange={(e) => setMaleMax(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-60 text-center"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Adult Female Range */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-pink-400">
                        👩 رنج نرمال بانوان (Adult Female)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">حداقل (Min)</span>
                          <input
                            type="number"
                            step="any"
                            disabled={!isAdminAuthorized}
                            value={femaleMin}
                            onChange={(e) => setFemaleMin(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-60 text-center"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">حداکثر (Max)</span>
                          <input
                            type="number"
                            step="any"
                            disabled={!isAdminAuthorized}
                            value={femaleMax}
                            onChange={(e) => setFemaleMax(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-60 text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panic Limits */}
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-3">
                  <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    حدود بحرانی و اورژانسی جهت اعلام فوری به پزشک (Panic / Critical Limits)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-300 block mb-1">
                        حد بحرانی پایین (Panic Low - در صورت وجود)
                      </span>
                      <input
                        type="number"
                        step="any"
                        disabled={!isAdminAuthorized}
                        placeholder="مثلاً کمتر از ۵۰"
                        value={panicLow}
                        onChange={(e) => setPanicLow(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500 font-mono disabled:opacity-60 text-center"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-300 block mb-1">
                        حد بحرانی بالا (Panic High - هشدار فوری)
                      </span>
                      <input
                        type="number"
                        step="any"
                        disabled={!isAdminAuthorized}
                        placeholder="مثلاً بالاتر از ۵۰۰"
                        value={panicHigh}
                        onChange={(e) => setPanicHigh(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500 font-mono disabled:opacity-60 text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Calibration / Laboratory Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    یادداشت فنی کیت، دستگاه آنالایزر و نکات کنترل کیفی
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isAdminAuthorized}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: کالیبره شده با دستگاه هیتاچی ۹۰۲، رنج خطی کیت تا ۱۲۰۰، حساسیت تحلیلی ۰.۱..."
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500 disabled:opacity-60 leading-relaxed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-800 gap-3">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    تغییرات شما در لحظه روی موبایل کلیه کارشناسان فعال در این آزمایشگاه بارگذاری می‌شود.
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {customRanges[selectedTestId] && isAdminAuthorized && (
                    <button
                      onClick={handleResetToDefault}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      بازنشانی به رفرنس اولیه
                    </button>
                  )}

                  {isAdminAuthorized ? (
                    <button
                      onClick={handleSaveRange}
                      disabled={isSaving}
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-cyan-600/20"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'در حال ثبت در پایگاه‌داده...' : 'ذخیره رنج کیت در سرور مرکزی'}
                    </button>
                  ) : (
                    <div className="text-xs text-amber-300 flex items-center gap-1 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                      <Lock className="w-3.5 h-3.5" />
                      برای ویرایش، ابتدا رمز مدیر را در بالای صفحه وارد نمایید.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network & Server Setup Architecture Guide */}
      {viewTab === 'networkGuide' && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                چگونه سیستم شما مثل سرور عمل کند و روی گوشی افراد مختلف باز شود؟
              </h3>
              <p className="text-xs text-slate-400">
                بررسی دو روش استاندارد: ۱) سرور ابری ۲۴ ساعته (فعال در حال حاضر) | ۲) سرور محلی شبکه آزمایشگاه (LAN)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Method 1: Cloud Server (Already Active) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/20 via-slate-950 to-slate-950 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                  روش اول (توصیه‌شده و آماده همین حالا)
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <h4 className="text-sm font-bold text-white">
                استفاده از سرور ابری دائمی (Cloud Hub)
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                سامانه شما هم‌اکنون به صورت ۲۴ ساعته روی سرور پرسرعت گوگل مستقر است و به دیتابیس Firestore متصل می‌باشد.
              </p>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between font-mono text-[11px] text-cyan-400 dir-ltr text-left">
                  <span>https://ais-pre-6hsl7a5uju4exfkdljoi6a-297466553431.europe-west3.run.app</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400 pt-2 text-[11px]">
                  <li>نیازی نیست کامپیوتر شخصی شما دائماً روشن باشد.</li>
                  <li>هر بیماری که ثبت شود یا رنج کیتی که توسط شما تغییر کند، در کمتر از ۵۰ میلی‌ثانیه روی گوشی تمام همکاران سینک می‌شود.</li>
                  <li>تنها شما با اکانت <strong>{ADMIN_MASTER_EMAIL}</strong> یا پین کد <strong>{DEFAULT_SUPERVISOR_PIN}</strong> می‌توانید کیت‌ها را کالیبره کنید؛ همکاران صرفاً مصرف‌کننده هستند.</li>
                </ul>
              </div>

              <button
                onClick={onOpenDeviceModal}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                مشاهده بارکد QR جهت اسکن توسط همکاران
              </button>
            </div>

            {/* Method 2: Localhost LAN Server */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/20 via-slate-950 to-slate-950 border border-indigo-500/30 space-y-4">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                روش دوم (تبدیل کیس/لپ‌تاپ به سرور فیزیکی شبکه)
              </span>

              <h4 className="text-sm font-bold text-white">
                میزبانی در شبکه داخلی وای‌فای آزمایشگاه (Local LAN Server)
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                اگر قصد دارید برنامه دقیقاً از روی هارد و پردازنده سیستم شما اجرا شود و همکاران متصل به مودم آزمایشگاه از آن استفاده کنند:
              </p>

              <div className="space-y-3 text-xs text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-mono text-[11px]">
                <div className="space-y-1">
                  <span className="text-indigo-300 font-bold font-sans block">۱. اجرای سرور روی سیستم:</span>
                  <div className="bg-black/60 p-2 rounded-lg text-emerald-400 dir-ltr text-left">
                    npm run dev -- --host 0.0.0.0
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-indigo-300 font-bold font-sans block">۲. پیدا کردن آی‌پی سیستم در ویندوز:</span>
                  <div className="bg-black/60 p-2 rounded-lg text-slate-300 dir-ltr text-left">
                    cmd &gt; ipconfig (مثال: 192.168.1.50)
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-indigo-300 font-bold font-sans block">۳. آدرس برای گوشی همکاران (وای‌فای مشترک):</span>
                  <div className="bg-black/60 p-2 rounded-lg text-amber-300 dir-ltr text-left">
                    http://192.168.1.50:3000
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                💡 در این حالت نیز پایگاه‌داده Firestore اطلاعات کیت‌ها و ارزیابی‌ها را برای همه پایدار و ایمن نگه می‌دارد.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
