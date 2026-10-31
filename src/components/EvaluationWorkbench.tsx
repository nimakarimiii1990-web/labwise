import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Save,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Stethoscope,
  Info,
  FileCheck,
  Activity,
  Layers,
  FlaskConical,
  Flame,
  Search,
  Zap,
  ShieldCheck,
  HeartPulse,
  HeartCrack,
} from 'lucide-react';
import { CLINICAL_TESTS } from '../data/testsCatalog';
import { DEPARTMENTS } from '../data/departmentsData';
import { DepartmentId, EvaluationResult, ConcordanceAnomaly } from '../types/lab';
import { evaluateLabResults } from '../services/concordanceEngine';
import { saveLabEvaluationToFirestore } from '../services/firebaseService';

interface EvaluationWorkbenchProps {
  onOpenDirectoryTest?: (testId: string) => void;
  customRanges?: Record<string, any>;
  onOpenKitManager?: () => void;
}

export const EvaluationWorkbench: React.FC<EvaluationWorkbenchProps> = ({
  onOpenDirectoryTest,
  customRanges,
  onOpenKitManager,
}) => {
  // Patient accession state
  const [patientId, setPatientId] = useState<string>('P-8942');
  const [patientAge, setPatientAge] = useState<number>(54);
  const [patientGender, setPatientGender] = useState<'male' | 'female'>('male');
  const [clinicalHistory, setClinicalHistory] = useState<string>('درد قفسه سینه ناگهانی، بدون سابقه قبلی');
  const [selectedDept, setSelectedDept] = useState<DepartmentId | 'all'>('all');
  const [testSearch, setTestSearch] = useState<string>('');

  // Entered test values: testId -> numeric value
  const [testValues, setTestValues] = useState<Record<string, number>>({
    cpk_total: 180,
    ck_mb: 215, // Intentional impossible test value to demonstrate CK-MB > CPK
    card_trop_i: 45,
  });

  // Gemini AI Analysis state
  const [geminiAnalysis, setGeminiAnalysis] = useState<string | null>(null);
  const [isAnalyzingWithAI, setIsAnalyzingWithAI] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Firestore save state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Operator Action selection
  const [operatorDecision, setOperatorDecision] = useState<string>('repeat_sample');
  const [operatorNotes, setOperatorNotes] = useState<string>('');

  // Run Realtime Concordance Engine
  const evaluation: EvaluationResult = useMemo(() => {
    const deptToEval: DepartmentId = selectedDept === 'all' ? 'biochemistry' : selectedDept;
    return evaluateLabResults(
      patientId,
      deptToEval,
      testValues,
      patientGender,
      patientAge,
      clinicalHistory,
      customRanges
    );
  }, [patientId, selectedDept, testValues, patientGender, patientAge, clinicalHistory, customRanges]);


  // Filtered available tests for entry
  const availableTests = useMemo(() => {
    return CLINICAL_TESTS.filter((t) => {
      const matchDept = selectedDept === 'all' || t.department === selectedDept;
      const q = testSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.code.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.nameFa.includes(q);
      return matchDept && matchSearch;
    });
  }, [selectedDept, testSearch]);

  // Handle single test change
  const handleTestValueChange = (testId: string, rawVal: string) => {
    if (rawVal.trim() === '') {
      const copy = { ...testValues };
      delete copy[testId];
      setTestValues(copy);
    } else {
      const num = parseFloat(rawVal);
      setTestValues((prev) => ({
        ...prev,
        [testId]: isNaN(num) ? 0 : num,
      }));
    }
    setGeminiAnalysis(null);
  };

  // Quick Clinical Panel Prefills
  const loadQuickPanel = (panelName: string) => {
    setGeminiAnalysis(null);
    setSaveSuccessMsg(null);

    switch (panelName) {
      case 'cardiac':
        setSelectedDept('cardiac');
        setTestValues({
          cpk_total: 210,
          ck_mb: 38,
          card_trop_i: 120.0,
          card_myoglobin: 95,
          card_bnp: 450,
          ldh: 340,
          coag_d_dimer: 320,
        });
        break;

      case 'thyroid':
        setSelectedDept('hormonology');
        setTestValues({
          horm_tsh: 7.2,
          horm_ft4: 2.4, // Paradoxical high FT4 + high TSH
          horm_ft3: 4.8,
          horm_anti_tpo: 180,
        });
        break;

      case 'lipid':
        setSelectedDept('biochemistry');
        setTestValues({
          chol_total: 240,
          hdl_chol: 45,
          triglycerides: 180,
          ldl_chol: 159,
          glucose_fbs: 104,
        });
        break;

      case 'liver_biliary':
        setSelectedDept('biochemistry');
        setTestValues({
          ast_sgot: 185,
          alt_sgpt: 74,
          alp: 280,
          ggt: 140,
          bili_total: 3.8,
          bili_direct: 2.4,
          total_protein: 6.9,
          albumin: 3.2,
        });
        break;

      case 'iron_anemia':
        setSelectedDept('biochemistry');
        setTestValues({
          serum_iron: 28,
          serum_tibc: 460,
          cbc_hgb: 8.9,
          cbc_rbc: 3.6,
          cbc_hct: 27.2,
          cbc_mcv: 71,
          cbc_mchc: 32.5,
        });
        break;

      case 'adrenal_cortisol':
        setSelectedDept('hormonology');
        setTestValues({
          horm_cortisol_8am: 3.2,
          horm_acth: 110,
          sodium: 131,
          potassium: 5.6,
          glucose_fbs: 68,
        });
        break;

      case 'autoimmune_rheum':
        setSelectedDept('immunology');
        setTestValues({
          imm_rf: 68,
          imm_anti_ccp: 85,
          imm_ana: 1,
          imm_crp: 38,
          imm_c3: 110,
          imm_c4: 22,
        });
        break;

      case 'insulin_hypoglycemia':
        setSelectedDept('hormonology');
        setTestValues({
          glucose_fbs: 42,
          horm_insulin: 54,
          horm_c_peptide: 0.3, // Factitious Hypoglycemia!
        });
        break;

      case 'parathyroid_bone':
        setSelectedDept('hormonology');
        setTestValues({
          calcium_total: 11.8,
          phosphorus: 2.1,
          horm_pth: 125,
          horm_vit_d: 32,
          alp: 190,
        });
        break;

      case 'hepatitis_serology':
        setSelectedDept('immunology');
        setTestValues({
          imm_hbsag: 4.5,
          imm_anti_hbs: 35, // Paradoxical positive HBsAg + Anti-HBs!
          imm_anti_hcv: 0.2,
          imm_hiv_combo: 0.1,
          alt_sgpt: 120,
        });
        break;

      default:
        break;
    }
  };

  // Load Preset Case Scenarios
  const loadPresetCase = (scenario: string) => {
    setGeminiAnalysis(null);
    setSaveSuccessMsg(null);

    switch (scenario) {
      case 'ckmb_macro_ck':
        setPatientId('P-1044');
        setPatientAge(58);
        setPatientGender('male');
        setClinicalHistory('بیمار با احساس سنگینی قفسه سینه به اورژانس مراجعه کرده است.');
        setSelectedDept('biochemistry');
        setTestValues({
          cpk_total: 190,
          ck_mb: 230, // Impossible: CK-MB > Total CPK!
          card_trop_i: 8.5,
          ast_sgot: 28,
          alt_sgpt: 24,
        });
        setOperatorDecision('repeat_sample');
        break;

      case 'edta_tube_contamination':
        setPatientId('P-9201');
        setPatientAge(42);
        setPatientGender('female');
        setClinicalHistory('چکاپ روتین درمانگاه. بیمار کاملاً هوشیار و فاقد هرگونه علامت بالینی هایپرکالمی.');
        setSelectedDept('biochemistry');
        setTestValues({
          potassium: 8.9, // Extremely High!
          calcium_total: 3.8, // Collapsed!
          sodium: 139,
          alp: 8, // Near zero due to EDTA chelation
          urea_bun: 24,
          creatinine: 0.9,
        });
        setOperatorDecision('request_redraw');
        break;

      case 'bilirubin_photometry_shift':
        setPatientId('P-7819');
        setPatientAge(35);
        setPatientGender('male');
        setClinicalHistory('مشاهده سرم به شدت کدر و لیپمیک (Lipemic Index +3).');
        setSelectedDept('biochemistry');
        setTestValues({
          bili_total: 1.4,
          bili_direct: 1.9, // Direct > Total!
          ast_sgot: 32,
          alt_sgpt: 29,
        });
        setOperatorDecision('check_qc_blank');
        break;

      case 'thyroid_discordance':
        setPatientId('P-5520');
        setPatientAge(38);
        setPatientGender('female');
        setClinicalHistory('بیمار مصرف‌کننده دوز بالای مکمل بیوتین برای تقویت مو.');
        setSelectedDept('hormonology');
        setTestValues({
          horm_tsh: 8.5,
          horm_ft4: 2.8, // TSH and FT4 both high!
          horm_ft3: 5.2,
          horm_anti_tpo: 14,
        });
        setOperatorDecision('repeat_sample');
        break;

      case 'factitious_hypoglycemia':
        setPatientId('P-3109');
        setPatientAge(45);
        setPatientGender('female');
        setClinicalHistory('حملات مکرر کاهش هوشیاری و تعریق سرد در منزل بدون سابقه دیابت.');
        setSelectedDept('hormonology');
        setTestValues({
          glucose_fbs: 38,
          horm_insulin: 85,
          horm_c_peptide: 0.2, // Low C-Peptide confirms exogenous insulin!
        });
        setOperatorDecision('contact_physician');
        break;

      case 'primary_hyperparathyroid':
        setPatientId('P-7721');
        setPatientAge(61);
        setPatientGender('female');
        setClinicalHistory('درد مبهم استخوانی و سنگ‌های مکرر کلیوی.');
        setSelectedDept('hormonology');
        setTestValues({
          calcium_total: 11.9,
          phosphorus: 2.0,
          horm_pth: 145,
          horm_vit_d: 35,
          alp: 180,
        });
        setOperatorDecision('approved');
        break;

      case 'all_normal':
        setPatientId('P-1001');
        setPatientAge(30);
        setPatientGender('male');
        setClinicalHistory('معاینات دوره‌ای طب کار، فرد کاملاً سالم و بدون علامت.');
        setSelectedDept('biochemistry');
        setTestValues({
          glucose_fbs: 88,
          urea_bun: 26,
          creatinine: 0.95,
          ast_sgot: 22,
          alt_sgpt: 19,
          sodium: 141,
          potassium: 4.2,
          calcium_total: 9.4,
          albumin: 4.4,
          total_protein: 7.2,
          chol_total: 175,
          hdl_chol: 52,
          triglycerides: 110,
        });
        setOperatorDecision('approved');
        break;

      default:
        break;
    }
  };

  // Trigger Gemini AI Deep Clinical Pathology Analysis
  const runGeminiAnalysis = async () => {
    setIsAnalyzingWithAI(true);
    setAiError(null);
    try {
      const payload = {
        patientInfo: {
          id: patientId,
          age: patientAge,
          gender: patientGender,
          department: selectedDept,
          clinicalHistory,
        },
        testResults: testValues,
        systemFlags: {
          calculatedIndices: evaluation.calculatedIndices,
          anomalies: evaluation.anomalies,
          errorRiskScore: evaluation.totalErrorRiskScore,
          overallStatus: evaluation.overallStatus,
        },
      };

      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`خطای سرور: ${res.statusText}`);
      }

      const data = await res.json();
      setGeminiAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'خطا در ارتباط با مدل Gemini');
    } finally {
      setIsAnalyzingWithAI(false);
    }
  };

  // Save to Firestore
  const handleSaveToFirestore = async () => {
    setIsSaving(true);
    setSaveSuccessMsg(null);
    try {
      const evalToSave: EvaluationResult = {
        ...evaluation,
        operatorDecision: operatorDecision as any,
        operatorNotes,
      };
      const id = await saveLabEvaluationToFirestore(evalToSave);
      setSaveSuccessMsg(`ارزیابی با شناسه ${id} با موفقیت در پایگاه داده Firestore ذخیره شد.`);
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (e: any) {
      console.error(e);
      alert('خطا در ذخیره داده در Firestore: ' + (e.message || String(e)));
    } finally {
      setIsSaving(false);
    }
  };

  // Reset current tests
  const handleReset = () => {
    setTestValues({});
    setGeminiAnalysis(null);
    setSaveSuccessMsg(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Preset Cases */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">کارتابل جامع اعتبارسنجی متقاطع، تطبیق نتایج و سنجش خطا</h2>
              <p className="text-xs text-slate-400">
                پوشش کامل بیوشیمی، هورمون‌شناسی، ایمونولوژی، سرولوژی و مارکرهای قلبی با الگوریتم‌های اعتبارسنجی چندوجهی
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            پاکسازی فرم و مقادیر
          </button>
        </div>

        {/* Role & Access Mode Notice for Colleagues & Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-300">
              <strong className="text-cyan-300 font-bold">حالت فعال کارشناس آزمایشگاه:</strong> ورود مقادیر آزمایش، ارزیابی بیمار و محاسبه بلادرنگ درصد خطا برای همه همکاران فعال است.
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px] shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>تنظیمات مرجع کیت‌ها فقط توسط مدیر قابل ویرایش است</span>
            {onOpenKitManager && (
              <button
                onClick={onOpenKitManager}
                className="text-cyan-400 hover:text-cyan-300 underline font-semibold mr-1 cursor-pointer"
              >
                مشاهده رنج کیت‌ها
              </button>
            )}
          </div>
        </div>

        {/* Quick Clinical Test Panels Buttons */}
        <div className="space-y-2">

          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            انتخاب سریع پنل‌های آزمایشگاهی (Batch Test Panels):
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'cardiac', label: '🫀 پنل مارکرهای قلبی', desc: 'CPK, CK-MB, hs-cTnI, Myoglobin, NT-proBNP' },
              { id: 'thyroid', label: '🦋 پنل کامل تیروئید', desc: 'TSH, FT4, FT3, Anti-TPO' },
              { id: 'lipid', label: '🩸 پروفایل لیپید و فرمول فریدوالد', desc: 'Chol, HDL, LDL, TG, Glucose' },
              { id: 'liver_biliary', label: '🧪 آنزیم‌های کبد و صفرا', desc: 'AST, ALT, ALP, GGT, TBil, DBil' },
              { id: 'iron_anemia', label: '🔬 پنل فقر آهن و CBC', desc: 'Fe, TIBC, Hgb, RBC, Hct, MCV' },
              { id: 'parathyroid_bone', label: '🦴 کلسیم، فسفر و پاراتورمون', desc: 'Ca, Phos, PTH, Vit-D3, ALP' },
              { id: 'autoimmune_rheum', label: '🛡️ خودایمنی و روماتولوژی', desc: 'RF, Anti-CCP, ANA, C3, C4, CRP' },
              { id: 'insulin_hypoglycemia', label: '💉 قند و انسولین/سی-پپتید', desc: 'FBS, Insulin, C-Peptide' },
              { id: 'adrenal_cortisol', label: '⚡ آدرنال و کورتیزول', desc: 'Cortisol 8AM, ACTH, Na, K' },
              { id: 'hepatitis_serology', label: '🦠 سرولوژی هپاتیت B', desc: 'HBsAg, Anti-HBs, HCV, HIV' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => loadQuickPanel(p.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
                title={p.desc}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Discrepancy & Diagnostic Scenarios */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            کیس‌های واقعی آزمایشگاهی جهت تست سیستم خطایابی:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <button
              onClick={() => loadPresetCase('ckmb_macro_ck')}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-right text-xs transition-all cursor-pointer"
            >
              <div className="font-bold">CK-MB &gt; CPK</div>
              <p className="text-[10px] text-slate-400 mt-0.5">ماکرو سی‌کی / خطای ۹۸٪</p>
            </button>

            <button
              onClick={() => loadPresetCase('edta_tube_contamination')}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-right text-xs transition-all cursor-pointer"
            >
              <div className="font-bold">آلودگی لوله EDTA</div>
              <p className="text-[10px] text-slate-400 mt-0.5">پتاسیم ۸.۹ + کلسیم ۳.۸</p>
            </button>

            <button
              onClick={() => loadPresetCase('bilirubin_photometry_shift')}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-right text-xs transition-all cursor-pointer"
            >
              <div className="font-bold">DBil &gt; TBil</div>
              <p className="text-[10px] text-slate-400 mt-0.5">شیفت بلانک فتومتر</p>
            </button>

            <button
              onClick={() => loadPresetCase('thyroid_discordance')}
              className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-right text-xs transition-all cursor-pointer"
            >
              <div className="font-bold">High TSH + High FT4</div>
              <p className="text-[10px] text-slate-400 mt-0.5">تداخل بیوتین / TSH-oma</p>
            </button>

            <button
              onClick={() => loadPresetCase('factitious_hypoglycemia')}
              className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-right text-xs transition-all cursor-pointer"
            >
              <div className="font-bold">تزریق انسولین خارجی</div>
              <p className="text-[10px] text-slate-400 mt-0.5">C-Peptide صفر با انسولین بالا</p>
            </button>

            <button
              onClick={() => loadPresetCase('all_normal')}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-right text-xs transition-all cursor-pointer"
            >
              <div className="font-bold">کیس کاملاً نرمال</div>
              <p className="text-[10px] text-slate-400 mt-0.5">نتایج تاییدشده (۰٪ خطا)</p>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Realtime Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Patient Details & Comprehensive Test Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Patient Details */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              اطلاعات پذیرش و مشخصات بالینی بیمار
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">شماره پذیرش / کد بیمار:</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  placeholder="P-1234"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">سن (سال):</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  min={0}
                  max={120}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">جنسیت:</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="male">مرد (Male)</option>
                  <option value="female">زن (Female)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">فیلتر بخش:</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-cyan-300 focus:border-cyan-500 focus:outline-none font-medium"
                >
                  <option value="all">همه بخش‌ها ({CLINICAL_TESTS.length})</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameFa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-slate-400 mb-1">شرح حال بالینی یا مشاهدات ظاهری نمونه (HIL):</label>
                <input
                  type="text"
                  value={clinicalHistory}
                  onChange={(e) => setClinicalHistory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  placeholder="مثال: سرم لیپمیک، همولیز، مصرف استاتین یا مکمل بیوتین..."
                />
              </div>
            </div>
          </div>

          {/* Test Input Directory Grid with Instant Search */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">ثبت و بررسی نتایج تست‌ها</h3>
                <span className="text-xs text-slate-400 font-mono">({Object.keys(testValues).length} تست ثبت‌شده)</span>
              </div>

              {/* Fast Test Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  placeholder="جستجوی تست (TSH, Cortisol, Fe)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-8 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[580px] overflow-y-auto pr-1">
              {availableTests.map((test) => {
                const currentVal = testValues[test.id];
                const hasValue = currentVal !== undefined;

                const ref =
                  test.referenceRanges.find((r) => r.gender === patientGender) ||
                  test.referenceRanges.find((r) => r.gender === 'both') ||
                  test.referenceRanges[0];

                const isPanicHigh = hasValue && test.panicHigh !== undefined && currentVal >= test.panicHigh;
                const isPanicLow = hasValue && test.panicLow !== undefined && currentVal <= test.panicLow;
                const isHigh = hasValue && ref && currentVal > ref.high;
                const isLow = hasValue && ref && currentVal < ref.low;
                const isNormal = hasValue && ref && currentVal >= ref.low && currentVal <= ref.high;

                return (
                  <div
                    key={test.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isPanicHigh || isPanicLow
                        ? 'bg-red-950/30 border-red-500/50 shadow-md shadow-red-900/20'
                        : isHigh || isLow
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : hasValue
                        ? 'bg-slate-800/60 border-cyan-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white">{test.code}</span>
                          <span className="text-[11px] text-slate-300 font-sans">{test.nameFa}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono truncate">{test.nameEn}</p>
                      </div>

                      {ref && (
                        <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 whitespace-nowrap">
                          {ref.low} - {ref.high} {test.defaultUnit}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          step="any"
                          value={hasValue ? currentVal : ''}
                          onChange={(e) => handleTestValueChange(test.id, e.target.value)}
                          placeholder="مقدار تست..."
                          className={`w-full bg-slate-900 border rounded-lg px-3 py-1.5 text-xs font-mono text-left focus:outline-none transition-colors ${
                            isPanicHigh || isPanicLow
                              ? 'border-red-500 text-red-300 font-bold'
                              : isHigh || isLow
                              ? 'border-amber-500 text-amber-300 font-semibold'
                              : hasValue
                              ? 'border-cyan-500/60 text-cyan-200'
                              : 'border-slate-800 text-slate-200'
                          }`}
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-mono w-14 shrink-0 text-left">
                        {test.defaultUnit}
                      </span>
                    </div>

                    {/* Status feedback & reference causes */}
                    {hasValue && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        {isPanicHigh && (
                          <span className="flex items-center gap-1 text-red-400 font-bold">
                            <AlertOctagon className="w-3.5 h-3.5" /> بحرانی بالا (Panic!)
                          </span>
                        )}
                        {isPanicLow && (
                          <span className="flex items-center gap-1 text-red-400 font-bold">
                            <AlertOctagon className="w-3.5 h-3.5" /> بحرانی پایین (Panic!)
                          </span>
                        )}
                        {!isPanicHigh && isHigh && (
                          <span className="flex items-center gap-1 text-amber-400 font-medium">
                            <AlertTriangle className="w-3 h-3" /> بالاتر از رنج
                          </span>
                        )}
                        {!isPanicLow && isLow && (
                          <span className="flex items-center gap-1 text-amber-400 font-medium">
                            <AlertTriangle className="w-3 h-3" /> پایین‌تر از رنج
                          </span>
                        )}
                        {isNormal && (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> نرمال
                          </span>
                        )}

                        {onOpenDirectoryTest && (
                          <button
                            type="button"
                            onClick={() => onOpenDirectoryTest(test.id)}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
                          >
                            <Info className="w-3 h-3" />
                            علل و تداخلات
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Realtime Concordance Output & Operator Protocol */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Error Risk & Concordance Verdict Card */}
          <div
            className={`border rounded-2xl p-5 shadow-xl transition-all ${
              evaluation.overallStatus === 'definite_error'
                ? 'bg-rose-950/40 border-rose-500/50'
                : evaluation.overallStatus === 'likely_error'
                ? 'bg-amber-950/40 border-amber-500/50'
                : evaluation.overallStatus === 'critical_action'
                ? 'bg-red-950/40 border-red-500/60 animate-pulse'
                : 'bg-emerald-950/30 border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-bold text-slate-300">نتیجه اعتبارسنجی متقاطع سیستم:</span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  evaluation.overallStatus === 'definite_error'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : evaluation.overallStatus === 'likely_error'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : evaluation.overallStatus === 'critical_action'
                    ? 'bg-red-500/30 text-red-200 border border-red-500'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {evaluation.overallStatus === 'definite_error' && '❌ خطای قطعی آزمایشگاه'}
                {evaluation.overallStatus === 'likely_error' && '⚠️ عدم همخوانی مشکوک'}
                {evaluation.overallStatus === 'critical_action' && '🚨 مقدار بحرانی (Panic)'}
                {evaluation.overallStatus === 'valid' && '✅ نتایج همخوان و تاییدشده'}
              </span>
            </div>

            {/* Error Probability Meter */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 my-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">درصد تخمینی احتمال خطای آزمایشگاهی:</span>
                <span
                  className={`text-2xl font-extrabold font-mono ${
                    evaluation.totalErrorRiskScore >= 80
                      ? 'text-rose-400'
                      : evaluation.totalErrorRiskScore >= 50
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {evaluation.totalErrorRiskScore}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    evaluation.totalErrorRiskScore >= 80
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : evaluation.totalErrorRiskScore >= 40
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${Math.max(5, evaluation.totalErrorRiskScore)}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">{evaluation.summaryFa}</p>
            </div>

            {/* Calculated Biological Indices */}
            {Object.keys(evaluation.calculatedIndices).length > 0 && (
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  نسبت‌ها و شاخص‌های بیوشیمیایی و هورمونی محاسبه‌شده:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(evaluation.calculatedIndices).map(([key, idx]) => (
                    <div
                      key={key}
                      className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between"
                    >
                      <span className="text-slate-400">{idx.labelFa}:</span>
                      <span
                        className={`font-mono font-bold ${
                          idx.status === 'critical'
                            ? 'text-rose-400'
                            : idx.status === 'abnormal'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {idx.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Identified Discrepancies & Pathophysiological Anomalies */}
          {evaluation.anomalies.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                مغایرت‌ها و عدم‌همخوانی‌های بیولوژیکی کشف‌شده ({evaluation.anomalies.length} مورد):
              </h4>

              {evaluation.anomalies.map((anom) => (
                <div
                  key={anom.ruleId}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 text-xs shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {anom.severity === 'critical_error' ? (
                        <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      {anom.ruleTitleFa}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      ریسک خطا: {anom.errorRiskPercent}%
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{anom.descriptionFa}</p>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                    <p className="text-slate-400 text-[11px]">
                      <strong className="text-cyan-300">منطق فیزیوپاتولوژیک: </strong>
                      {anom.pathophysiologicalReasonFa}
                    </p>
                    <p className="text-emerald-300 text-[11px] font-medium pt-1 border-t border-slate-900">
                      <strong>دستور اقدام اپراتور: </strong>
                      {anom.suggestedActionFa}
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    <span>مرجع معتبر: {anom.referenceSource}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Operator Decision Protocol */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              تصمیم نهایی و اقدام کارشناس آزمایشگاه (Operator Protocol)
            </h4>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-400">اقدام اجرایی قبل از تایید نهایی:</label>
              <select
                value={operatorDecision}
                onChange={(e) => setOperatorDecision(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-medium focus:border-cyan-500 focus:outline-none"
              >
                <option value="repeat_sample">تکرار آزمایش با همان نمونه / رقیق‌سازی (Re-assay)</option>
                <option value="check_qc_blank">بررسی بلانک، کالیبراسیون و کنترل کیفی دستگاه (QC Check)</option>
                <option value="request_redraw">ابطال نمونه و درخواست خون‌گیری مجدد در لوله صحیح (Redraw)</option>
                <option value="contact_physician">تماس با پزشک معالج / بخش بالینی (اعلام Panic Value)</option>
                <option value="approved">تأیید نهایی و ارسال به سیستم LIS (نتیجه همخوان است)</option>
              </select>

              <textarea
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                placeholder="یادداشت تکمیلی اپراتور (مثال: سرم بدون همولیز، با رقت ۱:۲ تکرار شد و نتیجه تایید گردید)..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons: AI Analyze & Save to Firestore */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={runGeminiAnalysis}
                disabled={isAnalyzingWithAI || Object.keys(testValues).length === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                {isAnalyzingWithAI ? 'در حال تحلیل عمیق با هوش مصنوعی...' : 'تحلیل پاتولوژی با Gemini AI'}
              </button>

              <button
                onClick={handleSaveToFirestore}
                disabled={isSaving || Object.keys(testValues).length === 0}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'ذخیره...' : 'ذخیره در Firestore'}
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Gemini AI Detailed Consultation Box */}
          {aiError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {aiError}
            </div>
          )}

          {geminiAnalysis && (
            <div className="bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-500/30">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">گزارش مشاوره تخصصی هوش مصنوعی Gemini</h4>
                    <span className="text-[10px] text-indigo-300">تحلیل ارشد بیوشیمی، هورمون و ایمونولوژی بالینی</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Gemini 3.8 Flash</span>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-indigo-950">
                {geminiAnalysis}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
