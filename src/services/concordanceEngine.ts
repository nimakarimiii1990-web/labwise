import { CLINICAL_TESTS } from '../data/testsCatalog';
import { ConcordanceAnomaly, EvaluationResult, DepartmentId } from '../types/lab';

export function evaluateLabResults(
  patientId: string,
  department: DepartmentId,
  testValues: Record<string, number>,
  patientGender: 'male' | 'female' = 'male',
  patientAge: number = 40,
  clinicalHistory?: string,
  customRanges?: Record<string, any>
): EvaluationResult {
  const anomalies: ConcordanceAnomaly[] = [];
  const calculatedIndices: Record<string, { labelFa: string; value: number | string; unit?: string; status: 'normal' | 'abnormal' | 'critical' }> = {};

  // Check Panic Values for all entered tests
  for (const [testId, rawVal] of Object.entries(testValues)) {
    const val = Number(rawVal);
    if (isNaN(val)) continue;

    const testDef = CLINICAL_TESTS.find((t) => t.id === testId);
    if (!testDef) continue;

    const custom = customRanges?.[testId];
    const panicHighLimit = custom?.panicHigh !== undefined ? custom.panicHigh : testDef.panicHigh;
    const panicLowLimit = custom?.panicLow !== undefined ? custom.panicLow : testDef.panicLow;

    if (panicHighLimit !== undefined && val >= panicHighLimit) {
      anomalies.push({
        ruleId: `panic_high_${testId}`,
        ruleTitleFa: `مقدار بحرانی (Panic Value) در ${testDef.nameFa}${custom ? ` (${custom.kitBrand})` : ''}`,
        involvedTests: [testDef.nameFa],
        severity: 'panic_value',
        descriptionFa: `مقدار ثبت‌شده (${val} ${custom?.unit || testDef.defaultUnit}) در محدوده بحرانی و تهدیدکننده حیات قرار دارد (حد بحرانی بالا: ${panicHighLimit}).`,
        pathophysiologicalReasonFa: `نیازمند اقدام و اعلام اورژانسی. علل پاتولوژیک: ${testDef.clinicalSignificanceHighFa}`,
        suggestedActionFa: 'تکرار بلادرنگ ران، ثبت شماره تماس بخش و گزارش تلفنی ظرف کمتر از ۱۵ دقیقه به پزشک معالج.',
        errorRiskPercent: 15,
        referenceSource: custom ? `تنظیمات سفارشی کیت ${custom.kitBrand} در آزمایشگاه` : 'CLSI GP47 Management of Critical- and Significant-Risk Results',
      });
    } else if (panicLowLimit !== undefined && val <= panicLowLimit) {
      anomalies.push({
        ruleId: `panic_low_${testId}`,
        ruleTitleFa: `مقدار بحرانی پایین (Panic Low) در ${testDef.nameFa}${custom ? ` (${custom.kitBrand})` : ''}`,
        involvedTests: [testDef.nameFa],
        severity: 'panic_value',
        descriptionFa: `مقدار ثبت‌شده (${val} ${custom?.unit || testDef.defaultUnit}) کمتر از حد بحرانی پایین (${panicLowLimit}) است.`,
        pathophysiologicalReasonFa: testDef.clinicalSignificanceLowFa,
        suggestedActionFa: 'کنترل فوری تشکیل لخته یا رقت با مایعات وریدی و اعلام فوری به پزشک.',
        errorRiskPercent: 15,
        referenceSource: custom ? `تنظیمات سفارشی کیت ${custom.kitBrand}` : 'CLSI GP47 Guidelines',
      });
    }
  }


  // =========================================================================
  // 1. CARDIAC & ENZYME CONCORDANCE (CK-MB vs Total CPK vs Troponin vs Myoglobin)
  // =========================================================================
  if (testValues['ck_mb'] !== undefined && testValues['cpk_total'] !== undefined) {
    const ckmb = testValues['ck_mb'];
    const cpk = testValues['cpk_total'];
    const ckmbIndex = cpk > 0 ? (ckmb / cpk) * 100 : 0;

    calculatedIndices['ckmb_index'] = {
      labelFa: 'شاخص نسبی CK-MB (CK-MB/CPK %)',
      value: `${ckmbIndex.toFixed(1)}%`,
      status: ckmb > cpk ? 'critical' : ckmbIndex > 5.0 ? 'abnormal' : 'normal',
    };

    if (ckmb > cpk) {
      anomalies.push({
        ruleId: 'ckmb_greater_than_total_cpk',
        ruleTitleFa: 'تناقض فیزیولوژیک غیرممکن: CK-MB بالاتر از Total CPK',
        involvedTests: ['CK-MB', 'Total CPK'],
        severity: 'critical_error',
        descriptionFa: `مقدار ایزوآنزیم CK-MB (${ckmb} U/L) بیشتر از کل آنزیم کراتین کیناز CPK (${cpk} U/L) ثبت شده است که از نظر بیولوژیکی غیرممکن است.`,
        pathophysiologicalReasonFa: 'حضور ماکرو سی‌کی (Macro-CK نوع ۱: کمپلکس آنتی‌بادی با CK، یا نوع ۲: الیگومر میتوکندریال)، یا تداخل آدنیلات کیناز در کیت‌های مهار ایمونواینهیبیشن ناشی از همولیز.',
        suggestedActionFa: 'نمونه مطلقاً گزارش نشود! بررسی بصری همولیز، گرم کردن در ۴۵ درجه به مدت ۲۰ دقیقه (غیرفعال‌سازی ماکرو CK) و تایید با Troponin I/T.',
        errorRiskPercent: 98,
        referenceSource: 'Henry’s Clinical Diagnosis 24th Ed / Tietz Clinical Chemistry p. 544',
      });
    } else if (ckmbIndex > 25) {
      anomalies.push({
        ruleId: 'ckmb_index_abnormally_high',
        ruleTitleFa: 'شاخص CK-MB به صورت غیرمعمول بالا (> 25%)',
        involvedTests: ['CK-MB', 'Total CPK'],
        severity: 'high_discrepancy',
        descriptionFa: `شاخص نسبی CK-MB برابر ${ckmbIndex.toFixed(1)}٪ است. در آسیب‌های خالص میوکارد نیز این نسبت به ندرت از ۲۰٪ فراتر می‌رود.`,
        pathophysiologicalReasonFa: 'احتمال بالای حضور Macro-CK یا خطای متد ایمونواینهیبیشن.',
        suggestedActionFa: 'تست تروپونین قلبی (hs-cTnI) انجام شود و آزمون با رقت ۱:۲ تکرار گردد.',
        errorRiskPercent: 82,
        referenceSource: 'IFCC Committee on Standardization of Markers of Cardiac Damage',
      });
    } else if (cpk > 600 && ckmbIndex < 2.5) {
      anomalies.push({
        ruleId: 'rhabdomyolysis_pattern',
        ruleTitleFa: 'الگوی تطبیقی رابدومیولیز (آسیب عضله اسکلتی به جای قلبی)',
        involvedTests: ['CK-MB', 'Total CPK'],
        severity: 'normal',
        descriptionFa: `افزایش بسیار شدید CPK (${cpk} U/L) با شاخص نسبی پایین CK-MB (${ckmbIndex.toFixed(1)}٪).`,
        pathophysiologicalReasonFa: 'تطابق کامل با آسیب عضلات اسکلتی (رابدومیولیز، کراش، ورزش شدید، تشنج). سهم ایزوآنزیم CK-MM بسیار غالب است و منشأ قلبی رد می‌شود.',
        suggestedActionFa: 'نتیجه از نظر بیوشیمیایی همخوان است. پایش عملکرد کلیه (کراتینین و اوره) توصیه می‌شود.',
        errorRiskPercent: 10,
        referenceSource: 'Tietz Textbook of Clinical Chemistry',
      });
    }
  }

  // Troponin vs CK-MB Timeline Concordance
  if (testValues['card_trop_i'] !== undefined && testValues['ck_mb'] !== undefined) {
    const trop = testValues['card_trop_i'];
    const ckmb = testValues['ck_mb'];

    if (ckmb > 50 && trop < 15.0) {
      anomalies.push({
        ruleId: 'ckmb_high_troponin_negative',
        ruleTitleFa: 'عدم همخوانی قلبی: CK-MB بالا با تروپونین فوق‌حساس منفی',
        involvedTests: ['hs-cTnI', 'CK-MB'],
        severity: 'warning',
        descriptionFa: `آنزیم CK-MB برابر ${ckmb} U/L بوده اما تروپونین I با حساسیت بالا (${trop} ng/L) منفی است.`,
        pathophysiologicalReasonFa: 'تروپونین قلبی استاندارد طلایی و بسیار اختصاصی‌تر از CK-MB است؛ منفی بودن تروپونین آسیب میوکارد را رد می‌کند و افزایش CK-MB منشأ غیرقلبی (رابدومیولیز یا ماکروآنزیم) دارد.',
        suggestedActionFa: 'اطلاع منفی بودن تروپونین به پزشک جهت پیشگیری از کاتتریزاسیون غیرضروری.',
        errorRiskPercent: 40,
        referenceSource: 'Fourth Universal Definition of Myocardial Infarction',
      });
    } else if (trop > 100.0 && ckmb < 20) {
      anomalies.push({
        ruleId: 'troponin_delayed_presentation',
        ruleTitleFa: 'الگوی مراجعه با تاخیر (Late Presentation AMI)',
        involvedTests: ['hs-cTnI', 'CK-MB'],
        severity: 'normal',
        descriptionFa: `تروپونین بسیار بالا (${trop} ng/L) همراه با CK-MB نرمال (${ckmb} U/L).`,
        pathophysiologicalReasonFa: 'تطابق کامل با مراجعه با تاخیر (> ۴۸ تا ۷۲ ساعت پس از شروع درد قلبی). نیمه‌عمر CK-MB کوتاه بوده و ظرف ۴۸ ساعت به پایه بازمی‌گردد اما تروپونین تا ۱۰ الی ۱۴ روز بالا می‌ماند.',
        suggestedActionFa: 'نتیجه کاملاً معتبر و نشان‌دهنده انفارکتوس ساب‌حادتری است.',
        errorRiskPercent: 5,
        referenceSource: 'ACC/AHA NSTE-ACS Guidelines',
      });
    }
  }

  // =========================================================================
  // 2. LIVER & BILIARY CONCORDANCE (Bilirubin, AST, ALT, ALP, GGT)
  // =========================================================================
  if (testValues['bili_direct'] !== undefined && testValues['bili_total'] !== undefined) {
    const dbil = testValues['bili_direct'];
    const tbil = testValues['bili_total'];
    const ratio = tbil > 0 ? (dbil / tbil) * 100 : 0;

    calculatedIndices['bili_ratio'] = {
      labelFa: 'نسبت بیلی‌روبین مستقیم به کل',
      value: `${ratio.toFixed(1)}%`,
      status: dbil > tbil ? 'critical' : 'normal',
    };

    if (dbil > tbil) {
      anomalies.push({
        ruleId: 'direct_greater_than_total_bili',
        ruleTitleFa: 'خطای تحلیلی قطعی: بیلی‌روبین دایرکت بیشتر از توتال',
        involvedTests: ['Direct Bilirubin', 'Total Bilirubin'],
        severity: 'critical_error',
        descriptionFa: `بیلی‌روبین مستقیم (${dbil} mg/dL) بیشتر از بیلی‌روبین کل (${tbil} mg/dL) است!`,
        pathophysiologicalReasonFa: 'شیفت بلانک فتومتر، کووت کثیف، یا اثر ماتریکس در سرم لیپمیک یا کدر.',
        suggestedActionFa: 'تکرار هر دو تست با بلانک نمونه (Sample Blank) و بررسی کالیبراسیون.',
        errorRiskPercent: 96,
        referenceSource: 'CLSI C28-A3c Reference Intervals / Jendrassik-Grof Principle',
      });
    } else if (tbil > 2.0) {
      if (ratio > 50) {
        anomalies.push({
          ruleId: 'conjugated_jaundice',
          ruleTitleFa: 'الگوی تطبیقی یرقان کلستاتیک (کونژوگه > 50%)',
          involvedTests: ['Direct Bilirubin', 'Total Bilirubin'],
          severity: 'normal',
          descriptionFa: `بیش از ۵۰٪ بیلی‌روبین از نوع کونژوگه/دایرکت است (${ratio.toFixed(1)}٪).`,
          pathophysiologicalReasonFa: 'همخوانی پاتولوژیک با کلستاز درون‌کبدی یا انسداد صفراوی (سنگ، تومور).',
          suggestedActionFa: 'ارزیابی آنزیم‌های ALP و GGT.',
          errorRiskPercent: 5,
          referenceSource: 'AASLD Guidelines on Jaundice',
        });
      } else if (ratio < 20) {
        anomalies.push({
          ruleId: 'unconjugated_jaundice',
          ruleTitleFa: 'الگوی تطبیقی یرقان غیرکونژوگه (< 20%)',
          involvedTests: ['Direct Bilirubin', 'Total Bilirubin'],
          severity: 'normal',
          descriptionFa: `سهم عمده بیلی‌روبین از نوع غیرکونژوگه است (دایرکت زیر ۲۰٪).`,
          pathophysiologicalReasonFa: 'همخوانی با همولیز حاد، سندرم ژیلبرت یا جذب هماتوم وسیع.',
          suggestedActionFa: 'بررسی رتیکولوسیت، LDH و هاپتوگلوبین.',
          errorRiskPercent: 8,
          referenceSource: 'Tietz Clinical Guide to Laboratory Tests',
        });
      }
    }
  }

  // AST vs ALT (De Ritis Ratio)
  if (testValues['ast_sgot'] !== undefined && testValues['alt_sgpt'] !== undefined) {
    const ast = testValues['ast_sgot'];
    const alt = testValues['alt_sgpt'];
    const deRitis = alt > 0 ? ast / alt : 0;

    calculatedIndices['de_ritis_ratio'] = {
      labelFa: 'نسبت دِ ریتیس (AST / ALT)',
      value: deRitis.toFixed(2),
      status: deRitis > 2.0 || deRitis < 0.8 ? 'abnormal' : 'normal',
    };

    if (ast > 70 && alt < 45) {
      anomalies.push({
        ruleId: 'isolated_ast_elevation',
        ruleTitleFa: 'افزایش ایزوله AST در مقایسه با ALT نرمال',
        involvedTests: ['AST', 'ALT'],
        severity: 'warning',
        descriptionFa: `آنزیم AST برابر ${ast} U/L بوده اما ALT کاملاً در محدوده نرمال (${alt} U/L) است.`,
        pathophysiologicalReasonFa: 'آنزیم ALT کبد-اختصاصی است؛ افزایش ایزوله AST عمدتاً ناشی از همولیز خفیف یا آسیب عضلات اسکلتی است نه کبد.',
        suggestedActionFa: 'بررسی شاخص همولیز (H-Index) و چک CPK.',
        errorRiskPercent: 45,
        referenceSource: 'AASLD Practice Guidance on Abnormal Liver Chemistries',
      });
    } else if (deRitis >= 2.0 && ast < 400 && alt < 400) {
      anomalies.push({
        ruleId: 'alcoholic_liver_pattern',
        ruleTitleFa: 'نسبت AST/ALT بزرگتر از ۲ (الگوی هپاتیت الکلی یا سیروز پیشرفته)',
        involvedTests: ['AST', 'ALT'],
        severity: 'normal',
        descriptionFa: `نسبت De Ritis برابر ${deRitis.toFixed(2)} است.`,
        pathophysiologicalReasonFa: 'کلاسیک در هپاتیت الکلی (کمبود ویتامین B6 مانع سنتز ALT در کبد می‌شود) یا سیروز فیبروتیک.',
        suggestedActionFa: 'بررسی همزمان GGT.',
        errorRiskPercent: 12,
        referenceSource: 'Tietz Clinical Chemistry 7th Ed',
      });
    }
  }

  // ALP vs GGT: Bone vs Hepatobiliary Origin
  if (testValues['alp'] !== undefined && testValues['ggt'] !== undefined) {
    const alp = testValues['alp'];
    const ggt = testValues['ggt'];

    if (alp > 160 && ggt < 45) {
      anomalies.push({
        ruleId: 'bone_origin_alp_elevation',
        ruleTitleFa: 'افزایش ALP با منشأ استخوانی (GGT نرمال)',
        involvedTests: ['ALP', 'GGT'],
        severity: 'normal',
        descriptionFa: `آلکالین فسفاتاز (${alp} U/L) بالا است اما GGT (${ggt} U/L) کاملاً نرمال است.`,
        pathophysiologicalReasonFa: 'آنزیم GGT در استخوان وجود ندارد؛ نرمال بودن آن منشأ کبدی و صفراوی را رد کرده و نشان‌دهنده منشأ استخوانی (رشد استخوانی، پاژه، ریکتس، التیام شکستگی یا بارداری) است.',
        suggestedActionFa: 'بررسی کلسیم، فسفر و ویتامین D به جای سونوگرافی کبد.',
        errorRiskPercent: 5,
        referenceSource: 'ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries',
      });
    } else if (alp > 160 && ggt > 80) {
      anomalies.push({
        ruleId: 'cholestatic_liver_alp_ggt',
        ruleTitleFa: 'تایید کلستاز کبدی و صفراوی (افزایش همزمان ALP و GGT)',
        involvedTests: ['ALP', 'GGT'],
        severity: 'normal',
        descriptionFa: `هر دو آنزیم ALP (${alp} U/L) و GGT (${ggt} U/L) همزمان افزایش یافته‌اند.`,
        pathophysiologicalReasonFa: 'تایید قطعی آسیب کلستاتیک مجاری صفراوی یا نفوذ کبدی.',
        suggestedActionFa: 'بررسی سونوگرافی کبد و مجاری صفراوی.',
        errorRiskPercent: 5,
        referenceSource: 'EASL Clinical Practice Guidelines',
      });
    }
  }

  // =========================================================================
  // 3. ELECTROLYTES, ACID-BASE & PRE-ANALYTICAL SENTINELS
  // =========================================================================
  // Potassium vs Calcium (K2-EDTA Contamination)
  if (testValues['potassium'] !== undefined && testValues['calcium_total'] !== undefined) {
    const k = testValues['potassium'];
    const ca = testValues['calcium_total'];

    if (k >= 6.5 && ca <= 6.0) {
      anomalies.push({
        ruleId: 'edta_tube_contamination_alert',
        ruleTitleFa: 'هشدار پرچم قرمز: آلودگی شدید به لوله EDTA (K2-EDTA)',
        involvedTests: ['Potassium', 'Calcium'],
        severity: 'critical_error',
        descriptionFa: `پتاسیم بسیار بالا (${k} mEq/L) همزمان با کلسیم بسیار پایین (${ca} mg/dL) مشاهده شد!`,
        pathophysiologicalReasonFa: 'خطای انتقال خون از لوله لَوِندر EDTA به لوله کلات قرمز/زرد؛ EDTA حاوی نمک پتاسیم است و کلسیم و منیزیم را کلات کرده و عدد کلسیم را به نزدیک صفر می‌کشاند.',
        suggestedActionFa: 'نمونه مطلقاً فاقد اعتبار است و نباید گزارش شود. خون‌گیری مجدد در لوله استاندارد الزامی است.',
        errorRiskPercent: 99,
        referenceSource: 'AACC/ADLM: Potassium EDTA Contamination in Serum Chemistry',
      });
    }
  }

  // Calcium vs Albumin (Corrected Calcium)
  if (testValues['calcium_total'] !== undefined && testValues['albumin'] !== undefined) {
    const ca = testValues['calcium_total'];
    const alb = testValues['albumin'];
    const correctedCa = ca + 0.8 * (4.0 - alb);

    calculatedIndices['corrected_calcium'] = {
      labelFa: 'کلسیم تصحیح‌شده با آلبومین',
      value: `${correctedCa.toFixed(2)} mg/dL`,
      status: correctedCa < 8.5 || correctedCa > 10.5 ? 'abnormal' : 'normal',
    };

    if (ca < 8.5 && alb < 3.5 && correctedCa >= 8.5 && correctedCa <= 10.5) {
      anomalies.push({
        ruleId: 'pseudohypocalcemia_hypoalbuminemia',
        ruleTitleFa: 'هیپوکلسمی کاذب ناشی از افت آلبومین سرم',
        involvedTests: ['Calcium', 'Albumin'],
        severity: 'warning',
        descriptionFa: `کلسیم تام (${ca} mg/dL) به دلیل کاهش آلبومین (${alb} g/dL) کاذب پایین است اما کلسیم یونیزه تصحیح‌شده (${correctedCa.toFixed(2)} mg/dL) کاملاً طبیعی است.`,
        pathophysiologicalReasonFa: 'کاهش پیوند کلسیم با پروتئین بدون افت کلسیم فعال فیزیولوژیک.',
        suggestedActionFa: 'درج کلسیم تصحیح‌شده در برگه آزمایش جهت پیشگیری از تزریق کلسیم وریدی اشتباه.',
        errorRiskPercent: 30,
        referenceSource: 'Payne’s Formula / Endocrine Society Clinical Guidelines',
      });
    }
  }

  // Corrected Sodium in Hyperglycemia
  if (testValues['sodium'] !== undefined && testValues['glucose_fbs'] !== undefined) {
    const na = testValues['sodium'];
    const glu = testValues['glucose_fbs'];

    if (glu > 200) {
      const correctedNa = na + 0.016 * (glu - 100);

      calculatedIndices['corrected_sodium'] = {
        labelFa: 'سدیم تصحیح‌شده در قند بالا',
        value: `${correctedNa.toFixed(1)} mEq/L`,
        status: correctedNa < 135 || correctedNa > 145 ? 'abnormal' : 'normal',
      };

      if (na < 135 && correctedNa >= 135) {
        anomalies.push({
          ruleId: 'pseudohyponatremia_hyperglycemia',
          ruleTitleFa: 'هیپوناترمی ترانسلوکیشنال در اثر هایپرگلیسمی شدید',
          involvedTests: ['Sodium', 'Glucose'],
          severity: 'warning',
          descriptionFa: `سدیم اندازه‌گیری شده (${na} mEq/L) کاذب پایین است؛ سدیم تصحیح‌شده بیمار (${correctedNa.toFixed(1)} mEq/L) طبیعی است.`,
          pathophysiologicalReasonFa: 'شیفت آب از سلول‌ها به فضای خارج‌سلولی به علت فشار اسمزی گلوکز.',
          suggestedActionFa: 'گزارش سدیم تصحیح‌شده به بخش بستری یا ICU.',
          errorRiskPercent: 25,
          referenceSource: 'Katz / Hillier Formula, New England Journal of Medicine',
        });
      }
    }
  }

  // Calcium vs Phosphorus vs PTH (Parathyroid Triad)
  if (testValues['calcium_total'] !== undefined && testValues['horm_pth'] !== undefined) {
    const ca = testValues['calcium_total'];
    const pth = testValues['horm_pth'];
    const phos = testValues['phosphorus'];

    if (ca > 10.5 && pth > 65) {
      anomalies.push({
        ruleId: 'primary_hyperparathyroidism_triad',
        ruleTitleFa: 'تشخیص قطعی هایپرپاراتیروئیدی اولیه (High Ca + High PTH)',
        involvedTests: ['Calcium', 'PTH'],
        severity: 'normal',
        descriptionFa: `کلسیم بالا (${ca} mg/dL) همراه با سطح بالای پاراتورمون PTH (${pth} pg/mL).`,
        pathophysiologicalReasonFa: 'در فرد سالم، کلسیم بالا باید ترشح PTH را کامل مهار و صفر کند؛ ترشح خودمختار پاراتورمون (آدنوم پاراتیروئید).',
        suggestedActionFa: 'توصیه به اسکن سستامیبی پاراتیروئید و سونوگرافی گردن.',
        errorRiskPercent: 5,
        referenceSource: 'The American Association of Endocrine Surgeons (AAES) Guidelines',
      });
    } else if (ca > 10.5 && pth < 15) {
      anomalies.push({
        ruleId: 'malignancy_hypercalcemia',
        ruleTitleFa: 'هایپرکلسمی ناشی از بدخیمی یا ویتامین D (PTH مهار شده)',
        involvedTests: ['Calcium', 'PTH'],
        severity: 'normal',
        descriptionFa: `کلسیم بالا (${ca} mg/dL) اما پاراتورمون به درستی مهار شده و پایین است (${pth} pg/mL).`,
        pathophysiologicalReasonFa: 'رد هایپرپاراتیروئیدی اولیه؛ شک به ترشح PTHrP توسط تومورها، متاستاز استخوانی، یا سمیت حاد با ویتامین D.',
        suggestedActionFa: 'بررسی PTHrP و سطح 25-OH Vitamin D.',
        errorRiskPercent: 10,
        referenceSource: 'Endocrine Society Guidelines on Hypercalcemia of Malignancy',
      });
    }
  }

  // =========================================================================
  // 4. LIPID PROFILE CONCORDANCE & FRIEDEWALD EQUATION
  // =========================================================================
  if (testValues['chol_total'] !== undefined && testValues['hdl_chol'] !== undefined && testValues['triglycerides'] !== undefined) {
    const chol = testValues['chol_total'];
    const hdl = testValues['hdl_chol'];
    const tg = testValues['triglycerides'];

    if (tg < 400) {
      const calculatedLdl = chol - hdl - (tg / 5);
      calculatedIndices['calculated_ldl'] = {
        labelFa: 'LDL محاسبه‌شده (فرمول فریدوالد)',
        value: `${calculatedLdl.toFixed(1)} mg/dL`,
        status: calculatedLdl > 100 ? 'abnormal' : 'normal',
      };

      if (testValues['ldl_chol'] !== undefined) {
        const directLdl = testValues['ldl_chol'];
        if (Math.abs(directLdl - calculatedLdl) > 35) {
          anomalies.push({
            ruleId: 'ldl_friedewald_discrepancy',
            ruleTitleFa: 'عدم تطابق چشمگیر LDL مستقیم با فرمول فریدوالد',
            involvedTests: ['Total Chol', 'HDL', 'LDL', 'Triglycerides'],
            severity: 'warning',
            descriptionFa: `LDL مستقیم (${directLdl}) با LDL محاسبه‌شده (${calculatedLdl.toFixed(1)}) بیش از ۳۵ واحد اختلاف دارد.`,
            pathophysiologicalReasonFa: 'حضور چیلومیکرون‌ها، دیس‌بتا‌لیپوپروتئینمی (نوع ۳)، یا خطای فتومتریک کیت دایرکت.',
            suggestedActionFa: 'بررسی مجدد ناشتایی ۱۲ ساعته و کالیبراسیون کیت HDL و LDL.',
            errorRiskPercent: 40,
            referenceSource: 'Friedewald WT et al. Clinical Chemistry / NCEP Guidelines',
          });
        }
      }
    } else {
      calculatedIndices['tg_warning'] = {
        labelFa: 'وضعیت فرمول فریدوالد',
        value: 'نامعتبر (TG > 400)',
        status: 'abnormal',
      };
      anomalies.push({
        ruleId: 'triglyceride_friedewald_invalid',
        ruleTitleFa: 'بی‌اعتباری فرمول فریدوالد در تری‌گلیسرید بالای ۴۰۰',
        involvedTests: ['Triglycerides', 'LDL'],
        severity: 'warning',
        descriptionFa: `تری‌گلیسرید بیمار (${tg} mg/dL) بالاتر از ۴۰۰ است و نسبت VLDL-C به TG دیگر ۱ به ۵ نیست.`,
        pathophysiologicalReasonFa: 'خطای ریاضی فرمول در هیپرتری‌گلیسریدمی شدید؛ سنجش مستقیم LDL الزامی است.',
        suggestedActionFa: 'اندازه‌گیری LDL با کیت مستقیم آنزیمی یا روش اولتراسانتریفیوژ.',
        errorRiskPercent: 20,
        referenceSource: 'AHA/ACC Multi-Society Guideline on Blood Cholesterol',
      });
    }

    if (chol < hdl) {
      anomalies.push({
        ruleId: 'cholesterol_less_than_hdl',
        ruleTitleFa: 'خطای غیرممکن تحلیلی: کلسترول تام کمتر از HDL',
        involvedTests: ['Total Chol', 'HDL'],
        severity: 'critical_error',
        descriptionFa: `کلسترول تام (${chol} mg/dL) کمتر از جزء HDL آن (${hdl} mg/dL) ثبت شده است!`,
        pathophysiologicalReasonFa: 'خطای فاحش کالیبراسیون یا جابجایی نمونه‌ها.',
        suggestedActionFa: 'تکرار بلادرنگ هر دو تست.',
        errorRiskPercent: 99,
        referenceSource: 'Tietz Textbook of Clinical Chemistry',
      });
    }
  }

  // =========================================================================
  // 5. IRON PROFILE CONCORDANCE (Serum Iron, TIBC, Transferrin, Ferritin)
  // =========================================================================
  if (testValues['serum_iron'] !== undefined && testValues['serum_tibc'] !== undefined) {
    const fe = testValues['serum_iron'];
    const tibc = testValues['serum_tibc'];
    const saturation = tibc > 0 ? (fe / tibc) * 100 : 0;

    calculatedIndices['transferrin_sat'] = {
      labelFa: 'درصد اشباع ترانسفرین (Transferrin Saturation %)',
      value: `${saturation.toFixed(1)}%`,
      status: fe > tibc ? 'critical' : saturation < 15 || saturation > 50 ? 'abnormal' : 'normal',
    };

    if (fe > tibc) {
      anomalies.push({
        ruleId: 'iron_greater_than_tibc',
        ruleTitleFa: 'خطای بیولوژیکی غیرممکن: آهن سرم بیشتر از TIBC',
        involvedTests: ['Serum Iron', 'TIBC'],
        severity: 'critical_error',
        descriptionFa: `آهن سرم (${fe} µg/dL) از کل ظرفیت اتصال آهن (${tibc} µg/dL) بیشتر ثبت شده است (اشباع ترانسفرین > ۱۰۰٪).`,
        pathophysiologicalReasonFa: 'خطای بازیابی آهن هِم ناشی از همولیز شدید در تست آهن، یا عدم اشباع کامل منیزیم کربنات در روش TIBC.',
        suggestedActionFa: 'تکرار هر دو تست در لوله عاری از فلزات سنگین بدون همولیز.',
        errorRiskPercent: 98,
        referenceSource: 'CLSI Standard for Iron and Total Iron Binding Capacity',
      });
    } else if (saturation < 12 && fe < 50) {
      anomalies.push({
        ruleId: 'iron_deficiency_pattern',
        ruleTitleFa: 'الگوی تطبیقی آنمی فقر آهن (Transferrin Saturation < 15%)',
        involvedTests: ['Serum Iron', 'TIBC'],
        severity: 'normal',
        descriptionFa: `درصد اشباع ترانسفرین برابر ${saturation.toFixed(1)}٪ است (نرمال: ۲۰ تا ۵۰٪).`,
        pathophysiologicalReasonFa: 'همخوانی کامل با فقر آهن واضح.',
        suggestedActionFa: 'بررسی همزمان فریتین سرم.',
        errorRiskPercent: 5,
        referenceSource: 'WHO Guidelines on Iron Deficiency Anemia',
      });
    } else if (saturation > 55 && fe > 170) {
      anomalies.push({
        ruleId: 'iron_overload_pattern',
        ruleTitleFa: 'الگوی بار آهن / هموکروماتوز (اشباع ترانسفرین بالا)',
        involvedTests: ['Serum Iron', 'TIBC'],
        severity: 'warning',
        descriptionFa: `اشباع ترانسفرین ${saturation.toFixed(1)}٪ و آهن سرم ${fe} µg/dL بالا است.`,
        pathophysiologicalReasonFa: 'هموکروماتوز ارثی، بار آهن ثانویه، یا تزریق مکرر خون.',
        suggestedActionFa: 'سنجش فریتین و در صورت تایید، بررسی ژنتیکی HFE.',
        errorRiskPercent: 10,
        referenceSource: 'AASLD / EASL Hemochromatosis Guidelines',
      });
    }
  }

  // Transferrin vs TIBC mathematical relationship (approx TIBC ≈ Transferrin × 1.25)
  if (testValues['transferrin'] !== undefined && testValues['serum_tibc'] !== undefined) {
    const trf = testValues['transferrin'];
    const tibc = testValues['serum_tibc'];
    const expectedTibc = trf * 1.25;
    const diffPercent = expectedTibc > 0 ? (Math.abs(tibc - expectedTibc) / expectedTibc) * 100 : 0;

    calculatedIndices['tibc_from_transferrin'] = {
      labelFa: 'TIBC محاسبه‌شده از ترانسفرین (×۱.۲۵)',
      value: `${expectedTibc.toFixed(0)} µg/dL`,
      status: diffPercent > 25 ? 'abnormal' : 'normal',
    };

    if (diffPercent > 30) {
      anomalies.push({
        ruleId: 'transferrin_tibc_discordance',
        ruleTitleFa: 'عدم همخوانی ترانسفرین و TIBC',
        involvedTests: ['Transferrin', 'TIBC'],
        severity: 'high_discrepancy',
        descriptionFa: `TIBC ثبت‌شده (${tibc} µg/dL) با مقدار مورد انتظار از ترانسفرین (${trf} mg/dL × 1.25 ≈ ${expectedTibc.toFixed(0)}) بیش از ۳۰٪ اختلاف دارد.`,
        pathophysiologicalReasonFa: 'خطای کالیبراسیون یکی از دو تست، یا استفاده از روش‌های اندازه‌گیری ناسازگار.',
        suggestedActionFa: 'تکرار هر دو تست در همان نمونه و بررسی کالیبراتورها.',
        errorRiskPercent: 75,
        referenceSource: 'Tietz Clinical Chemistry – Iron Studies Chapter',
      });
    }
  }

  // Ferritin + Iron panel clinical patterns
  if (testValues['ferritin'] !== undefined && testValues['serum_iron'] !== undefined) {
    const ferr = testValues['ferritin'];
    const fe = testValues['serum_iron'];
    const tibc = testValues['serum_tibc'];
    const saturation = tibc && tibc > 0 ? (fe / tibc) * 100 : undefined;

    if (ferr < 30 && fe < 50 && (saturation === undefined || saturation < 15)) {
      anomalies.push({
        ruleId: 'confirmed_iron_deficiency',
        ruleTitleFa: 'تایید فقر آهن (فریتین پایین + آهن پایین ± اشباع پایین)',
        involvedTests: ['Ferritin', 'Serum Iron', 'TIBC'],
        severity: 'normal',
        descriptionFa: `فریتین ${ferr} ng/mL و آهن سرم ${fe} µg/dL الگوی کلاسیک فقر آهن را نشان می‌دهد.`,
        pathophysiologicalReasonFa: 'کاهش ذخایر آهن بدن؛ شایع‌ترین علت آنمی در جهان.',
        suggestedActionFa: 'بررسی علت خونریزی مزمن (گوارشی/قاعدگی) و شروع درمان با آهن.',
        errorRiskPercent: 5,
        referenceSource: 'WHO / ASH Iron Deficiency Guidelines',
      });
    }

    if (ferr > 400 && fe < 50 && tibc !== undefined && tibc < 280) {
      anomalies.push({
        ruleId: 'anemia_of_chronic_disease_pattern',
        ruleTitleFa: 'الگوی آنمی بیماری‌های مزمن (فریتین بالا/نرمال + آهن پایین + TIBC پایین)',
        involvedTests: ['Ferritin', 'Serum Iron', 'TIBC'],
        severity: 'normal',
        descriptionFa: `فریتین ${ferr} ng/mL (بالا یا نرمال‌بالا) همراه با آهن پایین و TIBC پایین.`,
        pathophysiologicalReasonFa: 'احتباس آهن در ماکروفاژها توسط هپسیدین در التهاب مزمن؛ فقر آهن عملکردی.',
        suggestedActionFa: 'بررسی CRP و علت بیماری زمینه‌ای؛ درمان آهن خوراکی معمولاً بی‌اثر است.',
        errorRiskPercent: 8,
        referenceSource: 'ASH Clinical Practice Guidelines on Anemia of Inflammation',
      });
    }
  }

  // Protein & Immunoglobulin concordance (Total Protein, Albumin, IgG/A/M)
  if (testValues['total_protein'] !== undefined && testValues['albumin'] !== undefined) {
    const tp = testValues['total_protein'];
    const alb = testValues['albumin'];
    const globulin = tp - alb;
    const agRatio = alb > 0 && globulin !== 0 ? alb / globulin : 0;

    calculatedIndices['globulin'] = {
      labelFa: 'گلوبولین محاسبه‌شده (Total Protein − Albumin)',
      value: `${globulin.toFixed(1)} g/dL`,
      status: globulin < 2.0 || globulin > 3.5 ? 'abnormal' : 'normal',
    };
    calculatedIndices['ag_ratio'] = {
      labelFa: 'نسبت آلبومین به گلوبولین (A/G Ratio)',
      value: agRatio.toFixed(2),
      status: agRatio < 1.0 || agRatio > 2.5 ? 'abnormal' : 'normal',
    };

    if (globulin < 1.5) {
      anomalies.push({
        ruleId: 'hypoglobulinemia',
        ruleTitleFa: 'کاهش شدید گلوبولین',
        involvedTests: ['Total Protein', 'Albumin'],
        severity: 'warning',
        descriptionFa: `گلوبولین محاسبه‌شده ${globulin.toFixed(1)} g/dL بسیار پایین است.`,
        pathophysiologicalReasonFa: 'نقص ایمنی هومورال، سندرم نفروتیک شدید، یا سوءتغذیه پروتئینی.',
        suggestedActionFa: 'سنجش کمی ایمونوگلوبولین‌ها (IgG, IgA, IgM).',
        errorRiskPercent: 20,
        referenceSource: 'Tietz Clinical Chemistry – Plasma Proteins',
      });
    }
  }

  // Sum of immunoglobulins vs calculated globulin
  if (
    testValues['imm_igg'] !== undefined &&
    testValues['imm_iga'] !== undefined &&
    testValues['imm_igm'] !== undefined &&
    testValues['total_protein'] !== undefined &&
    testValues['albumin'] !== undefined
  ) {
    const igg = testValues['imm_igg'];
    const iga = testValues['imm_iga'];
    const igm = testValues['imm_igm'];
    const sumIg = (igg + iga + igm) / 100;
    const globulin = testValues['total_protein'] - testValues['albumin'];

    calculatedIndices['sum_immunoglobulins'] = {
      labelFa: 'مجموع IgG + IgA + IgM',
      value: `${sumIg.toFixed(2)} g/dL`,
      status: 'normal',
    };

    if (sumIg > globulin + 0.8) {
      anomalies.push({
        ruleId: 'ig_sum_exceeds_globulin',
        ruleTitleFa: 'مجموع ایمونوگلوبولین‌ها بیشتر از گلوبولین محاسبه‌شده',
        involvedTests: ['IgG', 'IgA', 'IgM', 'Total Protein', 'Albumin'],
        severity: 'high_discrepancy',
        descriptionFa: `مجموع Igها (${sumIg.toFixed(2)} g/dL) از گلوبولین (${globulin.toFixed(1)} g/dL) بیشتر است که از نظر بیوشیمیایی غیرممکن است.`,
        pathophysiologicalReasonFa: 'خطای اندازه‌گیری در یکی از تست‌های پروتئین یا ایمونوگلوبولین، یا واحد اشتباه.',
        suggestedActionFa: 'تکرار Total Protein، Albumin و پنل ایمونوگلوبولین در همان نمونه.',
        errorRiskPercent: 90,
        referenceSource: 'Tietz Textbook – Serum Protein Electrophoresis & Immunoglobulins',
      });
    }

    if (igg > 1800 && iga > 400 && igm > 200 && globulin > 3.8) {
      anomalies.push({
        ruleId: 'polyclonal_hypergammaglobulinemia',
        ruleTitleFa: 'الگوی هیپرگاماگلوبولینمی پلی‌کلونال',
        involvedTests: ['IgG', 'IgA', 'IgM'],
        severity: 'normal',
        descriptionFa: `افزایش همزمان چند کلاس ایمونوگلوبولین همراه با گلوبولین بالا.`,
        pathophysiologicalReasonFa: 'التهاب مزمن، بیماری‌های خودایمنی، سیروز کبدی، عفونت‌های مزمن.',
        suggestedActionFa: 'الکتروفورز پروتئین سرم (SPEP) برای رد گاموپاتی مونوکلونال.',
        errorRiskPercent: 8,
        referenceSource: 'Henry’s Clinical Diagnosis – Immunoglobulins',
      });
    }
  }

  // Isolated IgA deficiency alert
  if (testValues['imm_iga'] !== undefined && testValues['imm_igg'] !== undefined) {
    const iga = testValues['imm_iga'];
    const igg = testValues['imm_igg'];
    if (iga < 7 && igg >= 700) {
      anomalies.push({
        ruleId: 'selective_iga_deficiency',
        ruleTitleFa: 'احتمال نقص انتخابی IgA',
        involvedTests: ['IgA', 'IgG'],
        severity: 'warning',
        descriptionFa: `IgA بسیار پایین (${iga} mg/dL) در حالی که IgG نرمال است.`,
        pathophysiologicalReasonFa: 'شایع‌ترین نقص ایمنی اولیه؛ خطر واکنش به محصولات خونی حاوی IgA.',
        suggestedActionFa: 'ثبت در پرونده بیمار و احتیاط در تزریق خون/پلاسما؛ در صورت نیاز IgA-deficient products.',
        errorRiskPercent: 10,
        referenceSource: 'AAAAI / ESID Diagnostic Criteria for Selective IgA Deficiency',
      });
    }
  }

  // Indirect bilirubin check vs Total - Direct
  if (testValues['bili_indirect'] !== undefined && testValues['bili_total'] !== undefined && testValues['bili_direct'] !== undefined) {
    const ibil = testValues['bili_indirect'];
    const tbil = testValues['bili_total'];
    const dbil = testValues['bili_direct'];
    const expected = tbil - dbil;
    if (Math.abs(ibil - expected) > 0.4 && tbil > 0.5) {
      anomalies.push({
        ruleId: 'indirect_bili_math_error',
        ruleTitleFa: 'عدم تطابق ریاضی بیلی‌روبین غیرمستقیم با Total − Direct',
        involvedTests: ['Indirect Bilirubin', 'Total Bilirubin', 'Direct Bilirubin'],
        severity: 'high_discrepancy',
        descriptionFa: `بیلی‌روبین غیرمستقیم ثبت‌شده (${ibil}) با محاسبه Total−Direct (${expected.toFixed(2)}) همخوانی ندارد.`,
        pathophysiologicalReasonFa: 'خطای ورود داده یا اندازه‌گیری مستقل ناسازگار.',
        suggestedActionFa: 'استفاده از فرمول Indirect = Total − Direct و تکرار تست‌ها.',
        errorRiskPercent: 85,
        referenceSource: 'Jendrassik-Grof / CLSI Bilirubin Standards',
      });
    }
  }

  // =========================================================================
  // 6. THYROID PANEL CONCORDANCE (TSH vs FT4 vs FT3)
  // =========================================================================
  if (testValues['horm_tsh'] !== undefined && testValues['horm_ft4'] !== undefined) {
    const tsh = testValues['horm_tsh'];
    const ft4 = testValues['horm_ft4'];

    if (tsh > 6.0 && ft4 > 2.0) {
      anomalies.push({
        ruleId: 'thyroid_feedback_discordance_high_both',
        ruleTitleFa: 'عدم همخوانی فیدبک تیروئید: TSH بالا همزمان با FT4 بالا',
        involvedTests: ['TSH', 'Free T4'],
        severity: 'high_discrepancy',
        descriptionFa: `سطح TSH برابر ${tsh} µIU/mL و FT4 برابر ${ft4} ng/dL است؛ این الگو با محور خودتنظیمی هیپوفیز-تیروئید در تناقض است.`,
        pathophysiologicalReasonFa: 'تداخل بیوتین یا آنتی‌بادی‌های هتروفیل (HAMA)، آدنوم ترشح‌کننده TSH در هیپوفیز (TSH-oma)، یا سندرم مقاومت به هورمون تیروئید (RTH).',
        suggestedActionFa: 'تکرار آزمایش در پلتفرم کیت متفاوت و پرسش از بیمار در مورد مصرف بیوتین.',
        errorRiskPercent: 82,
        referenceSource: 'American Thyroid Association (ATA) / European Thyroid Association',
      });
    } else if (tsh < 0.1 && ft4 < 0.7) {
      anomalies.push({
        ruleId: 'central_hypothyroidism_pattern',
        ruleTitleFa: 'الگوی کم‌کاری تیروئید مرکزی / سندروم یوتیروئید بیمار (Low TSH + Low FT4)',
        involvedTests: ['TSH', 'Free T4'],
        severity: 'warning',
        descriptionFa: `هر دو هورمون TSH (${tsh}) و FT4 (${ft4}) همزمان کاهش یافته‌اند.`,
        pathophysiologicalReasonFa: 'کم‌کاری تیروئید ثانویه (نارسایی هیپوفیز) یا سندرم بیماری شدید غیرتیروئیدی (Sick Euthyroid).',
        suggestedActionFa: 'بررسی MRI زین ترکی یا پایش شرایط بالینی بستری.',
        errorRiskPercent: 35,
        referenceSource: 'Endocrine Society Guidelines on Hypothyroidism',
      });
    } else if (tsh > 5.5 && ft4 >= 0.8 && ft4 <= 1.8) {
      anomalies.push({
        ruleId: 'subclinical_hypothyroidism',
        ruleTitleFa: 'الگوی کم‌کاری تیروئید ساب‌کلینیکال (TSH بالا با FT4 نرمال)',
        involvedTests: ['TSH', 'Free T4'],
        severity: 'normal',
        descriptionFa: `سطح TSH (${tsh} µIU/mL) افزایش یافته اما FT4 (${ft4} ng/dL) هنوز در محدوده طبیعی است.`,
        pathophysiologicalReasonFa: 'مرحله اولیه افت عملکرد تیروئید با ترشح جبرانی هیپوفیز.',
        suggestedActionFa: 'سنجش Anti-TPO جهت بررسی زمینه خودایمنی هاشیموتو.',
        errorRiskPercent: 5,
        referenceSource: 'ATA/AACE Guidelines for Management of Subclinical Thyroid Disease',
      });
    }
  }

  // =========================================================================
  // 7. GLYCEMIC & INSULIN-C-PEPTIDE CONCORDANCE
  // =========================================================================
  if (testValues['horm_insulin'] !== undefined && testValues['horm_c_peptide'] !== undefined && testValues['glucose_fbs'] !== undefined) {
    const ins = testValues['horm_insulin'];
    const cp = testValues['horm_c_peptide'];
    const glu = testValues['glucose_fbs'];

    // HOMA-IR = (Glucose * Insulin) / 405
    const homaIr = (glu * ins) / 405;
    calculatedIndices['homa_ir'] = {
      labelFa: 'شاخص مقاومت به انسولین (HOMA-IR)',
      value: homaIr.toFixed(2),
      status: homaIr > 2.5 ? 'abnormal' : 'normal',
    };

    // Factitious Hypoglycemia Alert
    if (glu < 55 && ins > 30 && cp < 0.6) {
      anomalies.push({
        ruleId: 'factitious_hypoglycemia_alert',
        ruleTitleFa: 'هشدار پزشکی قانونی: هیپوگلیسمی ساختگی (تزریق انسولین خارجی)',
        involvedTests: ['Glucose', 'Insulin', 'C-Peptide'],
        severity: 'critical_error',
        descriptionFa: `قند خون بسیار پایین (${glu} mg/dL) با انسولین بسیار بالا (${ins} µIU/mL) همراه با C-Peptide سرکوب‌شده (${cp} ng/mL).`,
        pathophysiologicalReasonFa: 'انسولین‌های دارویی فاقد زنجیره C-Peptide هستند؛ در انسولینوما هر دو همزمان بالا می‌روند اما در تزریق خارجی انسولین، ترشح درون‌زاد مهار شده و C-Peptide صفر می‌شود!',
        suggestedActionFa: 'اعلام فوری به پزشک معالج و بررسی دارویی بیمار.',
        errorRiskPercent: 95,
        referenceSource: 'Endocrine Society Clinical Practice Guidelines on Hypoglycemia',
      });
    }
  }

  // =========================================================================
  // 8. ADRENAL CONCORDANCE (Cortisol vs ACTH)
  // =========================================================================
  if (testValues['horm_cortisol_8am'] !== undefined && testValues['horm_acth'] !== undefined) {
    const cort = testValues['horm_cortisol_8am'];
    const acth = testValues['horm_acth'];

    if (cort < 5.0 && acth > 80) {
      anomalies.push({
        ruleId: 'primary_adrenal_insufficiency_addison',
        ruleTitleFa: 'تشخیص قطعی نارسایی اولیه آدرنال (بیماری آدیسون)',
        involvedTests: ['Cortisol 8AM', 'ACTH'],
        severity: 'normal',
        descriptionFa: `کورتیزول پایین (${cort} µg/dL) همزمان با ACTH بسیار بالا (${acth} pg/mL).`,
        pathophysiologicalReasonFa: 'شکسته شدن فیدبک منفی به دلیل تخریب قشر آدرنال و تلاش هیپوفیز با ترشح بالای ACTH.',
        suggestedActionFa: 'بررسی الکترولیت‌ها (سدیم و پتاسیم) و تست تحریک با سیناکتن (ACTH Stimulation Test).',
        errorRiskPercent: 5,
        referenceSource: 'Endocrine Society Guidelines on Adrenal Insufficiency',
      });
    } else if (cort > 25.0 && acth < 5.0) {
      anomalies.push({
        ruleId: 'adrenal_cushing_syndrome',
        ruleTitleFa: 'سندرم کوشینگ با منشأ آدرنال (ACTH سرکوب‌شده)',
        involvedTests: ['Cortisol 8AM', 'ACTH'],
        severity: 'normal',
        descriptionFa: `کورتیزول بالا (${cort} µg/dL) همراه با مهار کامل ACTH (${acth} pg/mL).`,
        pathophysiologicalReasonFa: 'ترشح خودمختار کورتیزول توسط آدنوم قشر آدرنال بدون وابستگی به هیپوفیز.',
        suggestedActionFa: 'توصیه به سی‌تی‌اسکن آدرنال و تست سرکوب دگزامتازون شبانه.',
        errorRiskPercent: 8,
        referenceSource: 'Endocrine Society Guidelines on Cushing’s Syndrome',
      });
    }
  }

  // =========================================================================
  // 9. AUTOIMMUNE & SEROLOGY CONCORDANCE (RF vs Anti-CCP, ANA vs Anti-dsDNA, C3 vs C4)
  // =========================================================================
  if (testValues['imm_rf'] !== undefined && testValues['imm_anti_ccp'] !== undefined) {
    const rf = testValues['imm_rf'];
    const ccp = testValues['imm_anti_ccp'];

    if (rf > 30 && ccp > 25) {
      anomalies.push({
        ruleId: 'seropositive_rheumatoid_arthritis',
        ruleTitleFa: 'تایید سرولوژیک قطعی آرتریت روماتوئید (RF مثبت + Anti-CCP مثبت)',
        involvedTests: ['RF', 'Anti-CCP'],
        severity: 'normal',
        descriptionFa: `هر دو مارکر فاکتور روماتوئید (${rf} IU/mL) و Anti-CCP (${ccp} U/mL) به شدت مثبت هستند.`,
        pathophysiologicalReasonFa: 'اختصاصیت تشخیصی بالای ۹۸٪ برای آرتریت روماتوئید فرسایشی پیش‌رونده.',
        suggestedActionFa: 'ارجاع به متخصص روماتولوژی.',
        errorRiskPercent: 2,
        referenceSource: 'ACR/EULAR Classification Criteria for Rheumatoid Arthritis',
      });
    } else if (rf > 40 && ccp < 10) {
      anomalies.push({
        ruleId: 'isolated_rf_positivity',
        ruleTitleFa: 'مثبت بودن ایزوله RF با Anti-CCP منفی',
        involvedTests: ['RF', 'Anti-CCP'],
        severity: 'warning',
        descriptionFa: `فاکتور روماتوئید مثبت است اما Anti-CCP کاملاً منفی است.`,
        pathophysiologicalReasonFa: 'فاکتور روماتوئید غیراختصاصی است و در هپاتیت C، سندرم شوگرن، عفونت‌های ریوی و سالمندان نیز مثبت می‌شود؛ منفی بودن Anti-CCP آرتریت روماتوئید را کمتر محتمل می‌سازد.',
        suggestedActionFa: 'بررسی سرولوژی هپاتیت C و تست‌های کبدی.',
        errorRiskPercent: 25,
        referenceSource: 'Tietz Textbook of Clinical Chemistry',
      });
    }
  }

  // Complement C3 & C4 Consumption
  if (testValues['imm_c3'] !== undefined && testValues['imm_c4'] !== undefined) {
    const c3 = testValues['imm_c3'];
    const c4 = testValues['imm_c4'];

    if (c3 < 80 && c4 < 10) {
      anomalies.push({
        ruleId: 'hypocomplementemia_immune_complex',
        ruleTitleFa: 'سقوط همزمان C3 و C4 (مصرف کمپلمان در بیماری‌های کمپلکس ایمنی)',
        involvedTests: ['C3', 'C4'],
        severity: 'warning',
        descriptionFa: `هر دو جزء کمپلمان C3 (${c3} mg/dL) و C4 (${c4} mg/dL) شدیداً کاهش یافته‌اند.`,
        pathophysiologicalReasonFa: 'فعالیت شدید و مصرف مسیر کلاسیک کمپلمان در شعله‌وری فعال لوپوس (Lupus Flare)، نفریت لوپوسی، گلومرولونفریت ممبرانوپرولیفراتیو (MPGN)، یا سپسیس.',
        suggestedActionFa: 'بررسی فوری آنالیز ادرار از نظر پروتئینوری/هماچوری و چک Anti-dsDNA.',
        errorRiskPercent: 15,
        referenceSource: 'EULAR Recommendations on Systemic Lupus Erythematosus',
      });
    }
  }

  // Hepatitis B Serology Matrix
  if (testValues['imm_hbsag'] !== undefined && testValues['imm_anti_hbs'] !== undefined) {
    const hbsag = testValues['imm_hbsag'];
    const antihbs = testValues['imm_anti_hbs'];

    if (hbsag >= 1.0 && antihbs >= 10.0) {
      anomalies.push({
        ruleId: 'paradoxical_hep_b_serology',
        ruleTitleFa: 'ناهنجاری نادر سرولوژی هپاتیت B: مثبت بودن همزمان HBsAg و Anti-HBs',
        involvedTests: ['HBsAg', 'Anti-HBs'],
        severity: 'high_discrepancy',
        descriptionFa: `آنتی‌ژن HBsAg مثبت (شاخص ${hbsag}) و آنتی‌بادی محافظت‌کننده Anti-HBs نیز مثبت (${antihbs} mIU/mL) ثبت شده است!`,
        pathophysiologicalReasonFa: 'الگوی سرولوژیک متناقض؛ در موارد نادر در مرحله سِروکانورژن (انتقال حاد به بهبودی)، یا به دلیل ظهور ویروس فراری جهش‌یافته (Escape Mutant در ژن S) دیده می‌شود.',
        suggestedActionFa: 'تکرار آزمایش در لوله جدید و انجام آزمایش مولکولی HBV-DNA Real-Time PCR.',
        errorRiskPercent: 85,
        referenceSource: 'CDC Interpretation of Hepatitis B Serologic Test Results',
      });
    }
  }

  // =========================================================================
  // 10. HEMATOLOGY MCHC & RULE OF THREE
  // =========================================================================
  if (testValues['cbc_rbc'] !== undefined && testValues['cbc_hgb'] !== undefined && testValues['cbc_hct'] !== undefined) {
    const rbc = testValues['cbc_rbc'];
    const hgb = testValues['cbc_hgb'];
    const hct = testValues['cbc_hct'];

    const expectedHgb = rbc * 3.0;
    const expectedHct = hgb * 3.0;
    const calculatedMchc = hct > 0 ? (hgb / hct) * 100 : 0;

    calculatedIndices['calculated_mchc'] = {
      labelFa: 'MCHC محاسبه‌شده',
      value: `${calculatedMchc.toFixed(1)} g/dL`,
      status: calculatedMchc > 36.5 || calculatedMchc < 31 ? 'abnormal' : 'normal',
    };

    if (calculatedMchc > 36.5) {
      anomalies.push({
        ruleId: 'impossible_high_mchc',
        ruleTitleFa: 'خطای بارز کیفیت هماتولوژی: MCHC > 36.5 g/dL',
        involvedTests: ['Hgb', 'Hct', 'MCHC'],
        severity: 'critical_error',
        descriptionFa: `غلظت MCHC برابر ${calculatedMchc.toFixed(1)} g/dL است. گلبول قرمز توانایی فیزیکی پذیرش بیش از ۳۶.۵ گرم هموگلوبین را ندارد!`,
        pathophysiologicalReasonFa: '۱) آگلوتینین‌های سرد (Cold Agglutinins) که گلبول‌ها را کلامپ کرده و شمارش RBC را کاذب پایین می‌آورند، ۲) لیپمی شدید پلاسما یا بالا بودن پروتئین تام که جذب نوری هموگلوبین را بالا می‌برد، ۳) اسفروسیتوز ارثی.',
        suggestedActionFa: 'اقدام فوری اپراتور: لوله EDTA را در انکوباتور ۳۷ درجه به مدت ۱۵ تا ۲۰ دقیقه گرم کرده و دوباره ران کنید. در صورت پایداری خطا، پلاسما را بررسی و لام خون محیطی تهیه فرمایید.',
        errorRiskPercent: 90,
        referenceSource: 'CLSI H26-A2 Validation of Automated Hematology Analyzers',
      });
    }

    if (Math.abs(hgb - expectedHgb) > 2.0) {
      anomalies.push({
        ruleId: 'cbc_rule_of_three_broken_rbc_hgb',
        ruleTitleFa: 'نقض قانون سه‌تایی هماتولوژی (RBC × 3 ≈ Hgb)',
        involvedTests: ['RBC', 'Hemoglobin'],
        severity: 'warning',
        descriptionFa: `هموگلوبین واقعی (${hgb}) با هموگلوبین مورد انتظار (${expectedHgb.toFixed(1)}) بر اساس شمارش گلبول قرمز همخوانی ندارد (اختلاف > ۲ واحد).`,
        pathophysiologicalReasonFa: 'احتمال خطای شمارش سلولی، وجود گلبول‌های بسیار میکروسیتیک (تالاسمی)، یا خطای فتومتری هموگلوبین.',
        suggestedActionFa: 'بررسی مجدد اختلاط کامل نمونه و کنترل شاخص‌های RDW و لام خون محیطی.',
        errorRiskPercent: 40,
        referenceSource: 'Wintrobe’s Clinical Hematology',
      });
    }
  }

  // Calculate Overall Error Risk Score
  let maxRisk = 0;
  let errorCount = 0;
  let criticalCount = 0;

  for (const anom of anomalies) {
    if (anom.severity === 'critical_error') {
      criticalCount++;
      maxRisk = Math.max(maxRisk, anom.errorRiskPercent);
    } else if (anom.severity === 'high_discrepancy') {
      errorCount++;
      maxRisk = Math.max(maxRisk, anom.errorRiskPercent);
    } else if (anom.severity === 'warning') {
      maxRisk = Math.max(maxRisk, anom.errorRiskPercent);
    }
  }

  let overallStatus: 'valid' | 'likely_error' | 'definite_error' | 'critical_action' = 'valid';
  let summaryFa = 'نتایج تست‌ها همخوانی بیوشیمیایی، هورمونی و فیزیولوژیک معقولی را نشان می‌دهند.';

  if (criticalCount > 0 || maxRisk >= 90) {
    overallStatus = 'definite_error';
    summaryFa = 'هشدار جدی: تناقضات غیرممکن بیوشیمیایی و خطای قطعی تحلیلی یا پیش‌تحلیلی کشف شد. نمونه نباید تایید شود.';
  } else if (errorCount > 0 || maxRisk >= 60) {
    overallStatus = 'likely_error';
    summaryFa = 'عدم همخوانی فیزیولوژیک بالا در نتایج مشاهده شد؛ نیاز به رقیق‌سازی، کنترل سرم یا بررسی با متد مجدد دارد.';
  } else if (anomalies.some((a) => a.severity === 'panic_value')) {
    overallStatus = 'critical_action';
    summaryFa = 'نتایج دارای مقادیر بحرانی تهدیدکننده حیات (Panic Values) هستند؛ اقدام فوری و تماس با پزشک لازم است.';
  }

  return {
    patientId,
    patientAge,
    patientGender,
    clinicalHistory,
    department,
    testValues,
    calculatedIndices,
    anomalies,
    totalErrorRiskScore: maxRisk,
    overallStatus,
    summaryFa,
    createdAt: new Date().toISOString(),
  };
}
