import React, { useState } from 'react';
import {
  LineChart as ChartIcon,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Plus,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Thermometer,
} from 'lucide-react';
import { REAGENT_CATALOG } from '../data/reagentsData';
import { ReagentLotInfo, QCDataPoint, WestgardViolation } from '../types/lab';
import { saveQCLogToFirestore } from '../services/firebaseService';

export const QualityControlDesk: React.FC = () => {
  const [selectedReagentId, setSelectedReagentId] = useState<string>(REAGENT_CATALOG[0].id);
  const [newRunValue, setNewRunValue] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Active reagent object
  const activeReagent = REAGENT_CATALOG.find((r) => r.id === selectedReagentId) || REAGENT_CATALOG[0];
  const [qcPoints, setQcPoints] = useState<QCDataPoint[]>(activeReagent.qcPoints);

  // Re-sync points when reagent selection changes
  const handleSelectReagent = (reagentId: string) => {
    setSelectedReagentId(reagentId);
    const target = REAGENT_CATALOG.find((r) => r.id === reagentId);
    if (target) {
      setQcPoints(target.qcPoints);
      setNewRunValue('');
      setSaveSuccessMsg(null);
    }
  };

  // Evaluate Westgard Rules for a new point against history
  const evaluateWestgard = (val: number, history: QCDataPoint[], mean: number, sd: number): WestgardViolation | undefined => {
    const zScore = (val - mean) / sd;

    // 1:3s rule (Random error)
    if (Math.abs(zScore) >= 3.0) {
      return {
        rule: '1:3s',
        type: 'rejection',
        errorType: 'random',
        descriptionFa: `نقض قانون 1:3s وستگارد: مقدار کنترل (${val}) از مرز ±3SD فراتر رفته است (Z-Score: ${zScore.toFixed(2)}).`,
        actionFa: 'ران کاری فوراً متوقف و رد شود (Reject Run). خطای رندوم بررسی شود (حباب در لوله نمونه، اختلاط ناقص کنترل، کثیفی پروب پیپتینگ یا کووت).',
      };
    }

    // 2:2s rule (Systematic error: 2 consecutive > 2SD on same side)
    const lastPoint = history[history.length - 1];
    if (lastPoint && Math.abs(zScore) >= 2.0 && Math.abs(lastPoint.zScore) >= 2.0 && Math.sign(zScore) === Math.sign(lastPoint.zScore)) {
      return {
        rule: '2:2s',
        type: 'rejection',
        errorType: 'systematic',
        descriptionFa: `نقض قانون 2:2s وستگارد: دو ران کاری متوالی از مرز ${zScore > 0 ? '+2SD' : '-2SD'} عبور کرده‌اند.`,
        actionFa: 'رد ران کاری (Reject Run). خطای سیستماتیک کالیبراسیون، تاریخ مصرف معرف یا تغییر دمای انکوباتور رخ داده است. کالیبراسیون مجدد الزامی است.',
      };
    }

    // R:4s rule (Random error: 1 exceeds +2SD and another exceeds -2SD in same pair)
    if (lastPoint && ((zScore >= 2.0 && lastPoint.zScore <= -2.0) || (zScore <= -2.0 && lastPoint.zScore >= 2.0))) {
      return {
        rule: 'R:4s',
        type: 'rejection',
        errorType: 'random',
        descriptionFa: 'نقض قانون R:4s وستگارد: اختلاف ۴ برابری انحراف معیار بین دو نقطه کنترل مشاهده شد.',
        actionFa: 'رد ران کاری (Reject Run). خطای شدید ناپایداری ولتاژ فتومتر، شستشوی نامناسب یا خرابی مکانیکی.',
      };
    }

    // 4:1s rule (Systematic trend: 4 consecutive > 1SD on same side)
    if (history.length >= 3) {
      const prev3 = history.slice(-3);
      const allPrev1s = prev3.every((p) => Math.abs(p.zScore) >= 1.0 && Math.sign(p.zScore) === Math.sign(zScore));
      if (Math.abs(zScore) >= 1.0 && allPrev1s) {
        return {
          rule: '4:1s',
          type: 'warning',
          errorType: 'systematic',
          descriptionFa: 'هشدار قانون 4:1s: چهار نتیجه متوالی بالاتر از ۱ انحراف معیار در یک جهت قرار گرفته‌اند.',
          actionFa: 'هشدار روند (Trend Alert). نیاز به سرویس و چک مسیر شستشو یا آماده‌سازی کالیبراتور تازه.',
        };
      }
    }

    // 1:2s warning rule
    if (Math.abs(zScore) >= 2.0) {
      return {
        rule: '1:2s',
        type: 'warning',
        errorType: 'random',
        descriptionFa: `هشدار قانون 1:2s: مقدار (${val}) از مرز ±2SD عبور کرده است.`,
        actionFa: 'قانون هشدار (Warning Rule). ران کار هنوز پذیرفته است، سایر قوانین وستگارد را دقیقاً زیر نظر داشته باشید.',
      };
    }

    return undefined;
  };

  // Add a new measurement
  const handleAddMeasurement = async () => {
    const val = parseFloat(newRunValue);
    if (isNaN(val)) return;

    const zScore = (val - activeReagent.targetMean) / activeReagent.targetSD;
    const violation = evaluateWestgard(val, qcPoints, activeReagent.targetMean, activeReagent.targetSD);

    const newPoint: QCDataPoint = {
      runNumber: qcPoints.length + 1,
      date: new Date().toISOString().split('T')[0],
      measuredValue: val,
      zScore: Number(zScore.toFixed(2)),
      violation,
    };

    const updated = [...qcPoints, newPoint];
    setQcPoints(updated);
    setNewRunValue('');

    // Save to Firestore
    setIsSaving(true);
    try {
      await saveQCLogToFirestore({
        reagentName: activeReagent.name,
        testCode: activeReagent.testCode,
        lotNumber: activeReagent.lotNumber,
        targetMean: activeReagent.targetMean,
        targetSD: activeReagent.targetSD,
        measuredValue: val,
        ruleViolation: violation ? `${violation.rule} (${violation.type})` : 'Passed (Normal)',
      });
      setSaveSuccessMsg('ران کنترل کیفی با موفقیت در پایگاه داده ثبت و در چارت لِوی-جنینگز رسم شد.');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Render SVG Levey-Jennings Chart
  const svgWidth = 720;
  const svgHeight = 280;
  const paddingX = 50;
  const paddingY = 30;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Mean & SD
  const mean = activeReagent.targetMean;
  const sd = activeReagent.targetSD;
  const minVal = mean - 3.5 * sd;
  const maxVal = mean + 3.5 * sd;

  const getY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    return paddingY + chartHeight * (1 - ratio);
  };

  const getX = (index: number, total: number) => {
    if (total <= 1) return paddingX + chartWidth / 2;
    return paddingX + (index / (total - 1)) * chartWidth;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Reagent Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-cyan-400" />
              مدیریت کنترل کیفی (QC) و پایش خطاهای وستگارد (Levey-Jennings)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              رسم همزمان نمودار انحراف معیار، کشف خطاهای رندوم و سیستماتیک و ردیابی کیفیت سری‌های ساخت کیت
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 whitespace-nowrap">انتخاب محلول / کیت:</label>
            <select
              value={selectedReagentId}
              onChange={(e) => handleSelectReagent(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-bold focus:border-cyan-500 focus:outline-none"
            >
              {REAGENT_CATALOG.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} - لات: {r.lotNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Technical Specs for Selected Reagent */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">شماره لات (Lot Number):</span>
            <span className="font-mono font-bold text-white">{activeReagent.lotNumber}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">میانگین هدف (Target Mean):</span>
            <span className="font-mono font-bold text-cyan-400">
              {activeReagent.targetMean} {activeReagent.unit}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">انحراف معیار (Target SD):</span>
            <span className="font-mono font-bold text-amber-400">
              ±{activeReagent.targetSD} {activeReagent.unit}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">طول موج خوانش:</span>
            <span className="font-mono font-bold text-slate-200">{activeReagent.wavelengthNm}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">حد خطی بودن (Linearity):</span>
            <span className="font-mono font-bold text-emerald-400">
              {activeReagent.linearityLimit} {activeReagent.unit}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">پایداری آنبورد دستگاه:</span>
            <span className="font-mono font-bold text-purple-300">{activeReagent.onBoardStabilityDays} روز</span>
          </div>
        </div>
      </div>

      {/* Levey-Jennings Chart Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">چارت رسمی لِوی-جنینگز (Levey-Jennings Chart)</h3>
            <span className="text-xs text-slate-400 font-mono">تعداد ران‌ها: {qcPoints.length}</span>
          </div>

          {/* Westgard legend */}
          <div className="flex items-center gap-3 text-[11px] flex-wrap">
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> نرمال (In-Control)
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> هشدار 1:2s / 4:1s
            </span>
            <span className="flex items-center gap-1 text-rose-400 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> رد ران (1:3s / 2:2s)
            </span>
          </div>
        </div>

        {/* SVG Visualization Container */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full min-w-[620px] h-[280px] font-mono text-[10px]"
          >
            {/* Background Grid Lines for SD levels */}
            {[
              { val: mean + 3 * sd, label: '+3 SD', color: 'rgba(239, 68, 68, 0.4)' },
              { val: mean + 2 * sd, label: '+2 SD', color: 'rgba(245, 158, 11, 0.4)' },
              { val: mean + 1 * sd, label: '+1 SD', color: 'rgba(148, 163, 184, 0.2)' },
              { val: mean, label: 'Mean', color: 'rgba(6, 182, 212, 0.8)', isCenter: true },
              { val: mean - 1 * sd, label: '-1 SD', color: 'rgba(148, 163, 184, 0.2)' },
              { val: mean - 2 * sd, label: '-2 SD', color: 'rgba(245, 158, 11, 0.4)' },
              { val: mean - 3 * sd, label: '-3 SD', color: 'rgba(239, 68, 68, 0.4)' },
            ].map((line, idx) => {
              const y = getY(line.val);
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke={line.color}
                    strokeWidth={line.isCenter ? 1.5 : 1}
                    strokeDasharray={line.isCenter ? undefined : '4 4'}
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill={line.isCenter ? '#22d3ee' : '#94a3b8'}
                    fontSize="9"
                  >
                    {line.label} ({line.val.toFixed(1)})
                  </text>
                </g>
              );
            })}

            {/* Connecting line between points */}
            {qcPoints.length > 1 && (
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.8"
                points={qcPoints
                  .map((p, i) => `${getX(i, qcPoints.length)},${getY(p.measuredValue)}`)
                  .join(' ')}
              />
            )}

            {/* Plotted QC Dots */}
            {qcPoints.map((p, i) => {
              const cx = getX(i, qcPoints.length);
              const cy = getY(p.measuredValue);
              const isReject = p.violation?.type === 'rejection';
              const isWarning = p.violation?.type === 'warning';
              const dotColor = isReject ? '#f43f5e' : isWarning ? '#fbbf24' : '#10b981';

              return (
                <g key={i} className="cursor-pointer group">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isReject ? 6 : isWarning ? 5 : 4}
                    fill={dotColor}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                  {/* Point Tooltip Label */}
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill={dotColor}
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {p.measuredValue}
                  </text>
                  {/* X Axis Run number */}
                  <text x={cx} y={svgHeight - 10} textAnchor="middle" fill="#64748b" fontSize="9">
                    R{p.runNumber}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Add New Run Entry & Westgard Instant Check */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs text-slate-300 font-medium whitespace-nowrap">
              ثبت خوانش جدید کنترل (Control Run {qcPoints.length + 1}):
            </label>
            <div className="relative flex-1 sm:w-44">
              <input
                type="number"
                step="any"
                value={newRunValue}
                onChange={(e) => setNewRunValue(e.target.value)}
                placeholder={`میانگین: ${activeReagent.targetMean}`}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">{activeReagent.unit}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAddMeasurement}
              disabled={isSaving || !newRunValue}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              افزودن نقطه و اعتبارسنجی وستگارد
            </button>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Westgard Violations History */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            سابقه ران‌های دارای نقض قوانین وستگارد در این لات:
          </h4>

          {qcPoints.filter((p) => p.violation).length === 0 ? (
            <p className="text-xs text-slate-500 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              هیچ نقض قوانینی در ران‌های ثبت‌شده این لات مشاهده نشد (فرایند کاملاً تحت کنترل است - In Control).
            </p>
          ) : (
            <div className="space-y-2">
              {qcPoints
                .filter((p) => p.violation)
                .map((p, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      p.violation?.type === 'rejection'
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : 'bg-amber-950/20 border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-white">
                        {p.violation?.type === 'rejection' ? (
                          <AlertOctagon className="w-4 h-4 text-rose-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                        ران شماره {p.runNumber} ({p.date}) - مقدار: {p.measuredValue} (Z-Score: {p.zScore})
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                          p.violation?.type === 'rejection'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        قانون {p.violation?.rule}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px]">{p.violation?.descriptionFa}</p>
                    <p className="text-cyan-300 text-[11px]">
                      <strong>اقدام کنترل کیفی: </strong> {p.violation?.actionFa}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
