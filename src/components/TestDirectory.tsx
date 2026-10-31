import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  AlertOctagon,
  TestTube2,
  Clock,
  ShieldAlert,
  FileText,
  ChevronDown,
  ChevronUp,
  Tag,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { CLINICAL_TESTS } from '../data/testsCatalog';
import { DEPARTMENTS } from '../data/departmentsData';
import { DepartmentId, LabTestDefinition } from '../types/lab';

interface TestDirectoryProps {
  onSelectTestForWorkbench?: (testId: string) => void;
  initialSelectedTestId?: string;
}

export const TestDirectory: React.FC<TestDirectoryProps> = ({
  onSelectTestForWorkbench,
  initialSelectedTestId,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<DepartmentId | 'all'>('all');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(initialSelectedTestId || 'cpk_total');

  const filteredTests = useMemo(() => {
    return CLINICAL_TESTS.filter((t) => {
      const matchDept = selectedDept === 'all' || t.department === selectedDept;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.code.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.nameFa.includes(q) ||
        t.clinicalSignificanceHighFa.includes(q);
      return matchDept && matchSearch;
    });
  }, [searchTerm, selectedDept]);

  return (
    <div className="space-y-6">
      {/* Search & Department Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              دایرةالمعارف تخصصی تست‌ها، رنج‌های نرمال و مقادیر بحرانی
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              استانداردهای مرجع بالینی، شرایط نمونه‌گیری، تداخلات لیپمی/همولیز و راهنمای تصمیم‌گیری اپراتور
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی نام تست، کد (CKMB, AST, TSH)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedDept === 'all'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            همه بخش‌ها ({CLINICAL_TESTS.length})
          </button>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedDept === dept.id
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {dept.nameFa}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map((test) => {
          const isExpanded = expandedTestId === test.id;
          const dept = DEPARTMENTS.find((d) => d.id === test.department);

          return (
            <div
              key={test.id}
              className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg transition-all ${
                isExpanded ? 'border-cyan-500/40 shadow-cyan-900/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                      {test.code}
                    </span>
                    <h3 className="font-bold text-sm text-white">{test.nameFa}</h3>
                    {dept && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {dept.nameFa}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{test.nameEn}</p>
                </div>

                <button
                  onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Reference Ranges Summary */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    محدوده رفرنس نرمال (Reference Interval):
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">واحد: {test.defaultUnit}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {test.referenceRanges.map((r, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <span className="text-slate-400 text-[11px]">
                        {r.gender === 'male'
                          ? 'آقایان'
                          : r.gender === 'female'
                          ? 'بانوان'
                          : r.gender === 'pediatric'
                          ? 'نوزادان/اطفال'
                          : 'عمومی (هر دو)'}
                        :
                      </span>
                      <span className="font-mono font-bold text-emerald-400">
                        {r.low} - {r.high} {r.unit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Panic Values Indicator */}
                {(test.panicHigh !== undefined || test.panicLow !== undefined) && (
                  <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="flex items-center gap-1 text-red-400 font-semibold">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      مقادیر بحرانی (Panic):
                    </span>
                    {test.panicHigh !== undefined && (
                      <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20 font-mono">
                        بالای {test.panicHigh} {test.defaultUnit}
                      </span>
                    )}
                    {test.panicLow !== undefined && (
                      <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20 font-mono">
                        پایین‌تر از {test.panicLow} {test.defaultUnit}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Specimen and Sample collection requirement */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <TestTube2 className="w-3.5 h-3.5 text-cyan-400" />
                  لوله: <strong className="text-slate-300 font-normal">{test.tubeType}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  ناشتایی:
                  <strong className="text-slate-300 font-normal">
                    {test.fastingRequired ? `بله (${test.fastingHours} ساعت)` : 'خیر'}
                  </strong>
                </span>
              </div>

              {/* Detailed Pathophysiology Accordion */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-xs animate-fadeIn">
                  {/* High significance */}
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1">
                    <strong className="text-amber-400 flex items-center gap-1">
                      علل افزایش و پاتولوژی مقادیر بالاتر از رنج (Elevated):
                    </strong>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {test.clinicalSignificanceHighFa}
                    </p>
                  </div>

                  {/* Low significance */}
                  <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-1">
                    <strong className="text-blue-400 flex items-center gap-1">
                      علل کاهش و پاتولوژی مقادیر پایین‌تر از رنج (Decreased):
                    </strong>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {test.clinicalSignificanceLowFa}
                    </p>
                  </div>

                  {/* Interferences (HIL & Tube) */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <strong className="text-rose-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      تداخلات پیش‌تحلیلی و خطاهای کاذب (Pre-analytical Interferences):
                    </strong>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                      {test.interferenceFactorsFa.map((factor, idx) => (
                        <li key={idx}>{factor}</li>
                      ))}
                    </ul>
                  </div>

                  {/* References */}
                  <div className="text-[10px] text-slate-500 space-y-0.5 pt-1">
                    <span className="font-semibold text-slate-400">منابع و مقالات رفرنس معتبر:</span>
                    {test.referenceSources.map((source, idx) => (
                      <p key={idx} className="font-mono text-slate-400">
                        • {source}
                      </p>
                    ))}
                  </div>

                  {/* Add to workbench action */}
                  {onSelectTestForWorkbench && (
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectTestForWorkbench(test.id)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors cursor-pointer"
                      >
                        ورود به کارتابل اعتبارسنجی متقاطع با این تست
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
