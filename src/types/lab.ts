export type DepartmentId =
  | 'biochemistry'
  | 'hematology'
  | 'coagulation'
  | 'hormonology'
  | 'immunology'
  | 'molecular'
  | 'microbiology'
  | 'urinalysis'
  | 'cardiac';

export interface DepartmentInfo {
  id: DepartmentId;
  nameFa: string;
  nameEn: string;
  icon: string;
  color: string;
  accentBg: string;
  descriptionFa: string;
  testCount: number;
}

export type Gender = 'male' | 'female' | 'both' | 'pediatric';

export interface ReferenceRange {
  gender: Gender;
  minAgeYears?: number;
  maxAgeYears?: number;
  low: number;
  high: number;
  unit: string;
  textualRange?: string;
  specimen?: string; // e.g. CSF, urine
}

export interface LabTestDefinition {
  id: string;
  code: string;
  nameEn: string;
  nameFa: string;
  department: DepartmentId;
  defaultUnit: string;
  availableUnits: string[];
  referenceRanges: ReferenceRange[];
  panicLow?: number;
  panicHigh?: number;
  specimen: string;
  tubeType: string; // e.g. "لوله کلات قرمز/زرد", "لوله هپارین", "لوله EDTA بنفش", "لوله سیترات آبی"
  fastingRequired: boolean;
  fastingHours?: number;
  clinicalSignificanceHighFa: string;
  clinicalSignificanceLowFa: string;
  interferenceFactorsFa: string[]; // e.g. "همولیز کاذب", "ایکتریک", "لیپمی", "تداخل EDTA"
  referenceSources: string[]; // e.g. "Tietz Clinical Chemistry 7th Ed", "CLSI C28-A3c"
  analyticalNotes?: string; // CV%, Bias, method notes
}

export interface TestInputEntry {
  testId: string;
  value: number | string;
  unit: string;
}

export type AnomalySeverity = 'critical_error' | 'high_discrepancy' | 'warning' | 'normal' | 'panic_value';

export interface ConcordanceAnomaly {
  ruleId: string;
  ruleTitleFa: string;
  involvedTests: string[];
  severity: AnomalySeverity;
  descriptionFa: string;
  pathophysiologicalReasonFa: string;
  suggestedActionFa: string;
  errorRiskPercent: number;
  referenceSource: string;
}

export interface EvaluationResult {
  id?: string;
  patientId: string;
  patientAge?: number;
  patientGender: 'male' | 'female';
  clinicalHistory?: string;
  department: DepartmentId;
  testValues: Record<string, number>;
  calculatedIndices: Record<string, { labelFa: string; value: number | string; unit?: string; status: 'normal' | 'abnormal' | 'critical' }>;
  anomalies: ConcordanceAnomaly[];
  totalErrorRiskScore: number; // 0 - 100 %
  overallStatus: 'valid' | 'likely_error' | 'definite_error' | 'critical_action';
  summaryFa: string;
  operatorDecision?: 'approved' | 'repeat_sample' | 'check_qc_blank' | 'request_redraw' | 'contact_physician';
  operatorNotes?: string;
  createdAt: string;
  operatorUid?: string;
}

export interface WestgardViolation {
  rule: '1:2s' | '1:3s' | '2:2s' | 'R:4s' | '4:1s' | '10:x';
  type: 'warning' | 'rejection';
  errorType: 'random' | 'systematic';
  descriptionFa: string;
  actionFa: string;
}

export interface QCDataPoint {
  runNumber: number;
  date: string;
  measuredValue: number;
  zScore: number;
  violation?: WestgardViolation;
}

export interface ReagentLotInfo {
  id: string;
  name: string;
  testCode: string;
  lotNumber: string;
  catalogNumber: string;
  department: 'biochemistry' | 'immunology';
  packaging: string;
  methodology: string;
  wavelengthNm: string;
  targetMean: number;
  targetSD: number;
  unit: string;
  linearityLimit: number;
  onBoardStabilityDays: number;
  unopenedExpDate: string;
  storageTemp: string;
  qcPoints: QCDataPoint[];
  technicalNotesFa: string;
}

export interface ScientificArticle {
  id: string;
  titleEn: string;
  titleFa: string;
  journal: string;
  year: number;
  category: 'biochemistry' | 'immunology' | 'qc_methodology' | 'molecular';
  authors: string;
  doi?: string;
  url?: string;
  abstractFa: string;
  clinicalImpactFa: string;
  keyFindingsFa: string[];
}

export interface InternationalEvent {
  id: string;
  titleEn: string;
  titleFa: string;
  category: 'expo' | 'congress' | 'symposium';
  startDate: string;
  endDate: string;
  locationEn: string;
  locationFa: string;
  country: string;
  websiteUrl: string;
  descriptionFa: string;
  targetAudienceFa: string;
  badgeText: string;
}
