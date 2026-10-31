import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errorHandling';
import { EvaluationResult } from '../types/lab';


const LOCAL_STORAGE_EVALS_KEY = 'labwise_saved_evaluations';
const LOCAL_STORAGE_QC_KEY = 'labwise_saved_qc_logs';

export interface SavedQCRecord {
  id: string;
  reagentName: string;
  testCode: string;
  lotNumber: string;
  targetMean: number;
  targetSD: number;
  measuredValue: number;
  ruleViolation?: string;
  operatorUid: string;
  createdAt: string;
}

export interface CustomKitRange {
  id: string; // testId
  testId: string;
  kitBrand: string; // e.g. 'پارس آزمون (Pars Azmun)', 'بایوسیستمز (BioSystems)', etc.
  unit: string;
  maleMin: number;
  maleMax: number;
  femaleMin: number;
  femaleMax: number;
  panicLow?: number;
  panicHigh?: number;
  notes?: string;
  updatedBy: string;
  updatedAt: string;
}

const LOCAL_STORAGE_CUSTOM_RANGES_KEY = 'labwise_custom_kit_ranges';
export const ADMIN_MASTER_EMAIL = 'nimakarimiii1990@gmail.com';
export const DEFAULT_SUPERVISOR_PIN = '1990';


// Auth Helpers
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  try {
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function loginAsGuest(): Promise<User> {
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (error) {
    console.warn('Anonymous auth not enabled in Firebase Console, using mock UID for session', error);
    throw error;
  }
}

export async function logoutUser() {
  await signOut(auth);
}

// Save Lab Evaluation
export async function saveLabEvaluationToFirestore(evalResult: EvaluationResult): Promise<string> {
  const evalId = evalResult.id || `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const currentUser = auth.currentUser;
  const operatorUid = currentUser?.uid || 'local_operator';

  const docPayload = {
    id: evalId,
    patientId: evalResult.patientId,
    patientAge: evalResult.patientAge || 0,
    patientGender: evalResult.patientGender,
    department: evalResult.department,
    testValues: evalResult.testValues,
    calculatedIndices: evalResult.calculatedIndices,
    anomalies: evalResult.anomalies,
    errorRiskPercent: evalResult.totalErrorRiskScore,
    operatorDecision: evalResult.operatorDecision || 'pending',
    operatorNotes: evalResult.operatorNotes || '',
    operatorUid,
    createdAt: new Date().toISOString(),
  };

  // Always save locally as backup
  try {
    const existingRaw = localStorage.getItem(LOCAL_STORAGE_EVALS_KEY);
    const existingList = existingRaw ? JSON.parse(existingRaw) : [];
    const updatedList = [docPayload, ...existingList.filter((x: any) => x.id !== evalId)].slice(0, 50);
    localStorage.setItem(LOCAL_STORAGE_EVALS_KEY, JSON.stringify(updatedList));
  } catch (e) {
    console.warn('Failed to cache locally', e);
  }

  // If user is authenticated with Firebase, sync to Firestore
  if (currentUser) {
    const path = `evaluations/${evalId}`;
    try {
      await setDoc(doc(db, 'evaluations', evalId), {
        id: evalId,
        patientId: evalResult.patientId,
        patientAge: evalResult.patientAge || 0,
        patientGender: evalResult.patientGender,
        department: evalResult.department,
        errorRiskPercent: evalResult.totalErrorRiskScore,
        operatorDecision: evalResult.operatorDecision || 'approved',
        operatorUid,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  return evalId;
}

// Fetch Past Evaluations
export async function fetchEvaluationsFromFirestore(): Promise<any[]> {
  const currentUser = auth.currentUser;

  // Read local cache first
  let localList: any[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EVALS_KEY);
    if (raw) localList = JSON.parse(raw);
  } catch (e) {
    console.warn('Local read error', e);
  }

  if (!currentUser) {
    return localList;
  }

  const collectionPath = 'evaluations';
  try {
    const q = query(
      collection(db, collectionPath),
      where('operatorUid', '==', currentUser.uid),
      limit(20)
    );
    const snapshot = await getDocs(q);
    const remoteList: any[] = [];
    snapshot.forEach((docSnap) => {
      remoteList.push(docSnap.data());
    });

    if (remoteList.length > 0) {
      return remoteList;
    }
    return localList;
  } catch (error) {
    console.warn('Firestore fetch fallback to local cache:', error);
    return localList;
  }
}

// Save QC Log
export async function saveQCLogToFirestore(record: Omit<SavedQCRecord, 'id' | 'operatorUid' | 'createdAt'>): Promise<string> {
  const logId = `qc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const currentUser = auth.currentUser;
  const operatorUid = currentUser?.uid || 'local_operator';

  const fullRecord: SavedQCRecord = {
    ...record,
    id: logId,
    operatorUid,
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_QC_KEY);
    const list = raw ? JSON.parse(raw) : [];
    localStorage.setItem(LOCAL_STORAGE_QC_KEY, JSON.stringify([fullRecord, ...list].slice(0, 100)));
  } catch (e) {
    console.warn('Local QC save error', e);
  }

  if (currentUser) {
    const path = `qc_logs/${logId}`;
    try {
      await setDoc(doc(db, 'qc_logs', logId), fullRecord);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  return logId;
}

// Fetch QC Logs
export async function fetchQCLogsFromFirestore(): Promise<SavedQCRecord[]> {
  const currentUser = auth.currentUser;
  let localList: SavedQCRecord[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_QC_KEY);
    if (raw) localList = JSON.parse(raw);
  } catch (e) {
    console.warn('Local QC read error', e);
  }

  if (!currentUser) return localList;

  try {
    const q = query(
      collection(db, 'qc_logs'),
      where('operatorUid', '==', currentUser.uid),
      limit(50)
    );
    const snapshot = await getDocs(q);
    const remoteList: SavedQCRecord[] = [];
    snapshot.forEach((d) => remoteList.push(d.data() as SavedQCRecord));
    return remoteList.length > 0 ? remoteList : localList;
  } catch (error) {
    console.warn('Firestore QC fetch fallback to local:', error);
    return localList;
  }
}

// -----------------------------------------------------------------------------
// Master Kit Normal Ranges Management (Admin-only write, all users read-only)
// -----------------------------------------------------------------------------

export function checkIsAdmin(user: User | null, supervisorPin?: string): boolean {
  if (user && user.email === ADMIN_MASTER_EMAIL) {
    return true;
  }
  if (supervisorPin && supervisorPin === DEFAULT_SUPERVISOR_PIN) {
    return true;
  }
  return false;
}

export function subscribeToCustomKitRanges(callback: (ranges: Record<string, CustomKitRange>) => void) {
  const collectionPath = 'custom_kit_ranges';

  // Read local cache immediately
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_RANGES_KEY);
    if (raw) {
      callback(JSON.parse(raw));
    }
  } catch (e) {
    console.warn('Failed to parse cached kit ranges', e);
  }

  // Subscribe to real-time changes from Firestore
  try {
    const unsubscribe = onSnapshot(
      collection(db, collectionPath),
      (snapshot) => {
        const rangesMap: Record<string, CustomKitRange> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as CustomKitRange;
          if (data && data.testId) {
            rangesMap[data.testId] = data;
          }
        });

        // Update local storage cache
        try {
          localStorage.setItem(LOCAL_STORAGE_CUSTOM_RANGES_KEY, JSON.stringify(rangesMap));
        } catch (e) {
          console.warn('Failed to update local kit cache', e);
        }

        callback(rangesMap);
      },
      (error) => {
        console.warn('Kit ranges onSnapshot notice:', error.message);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Could not establish real-time kit listener:', err);
    return () => {};
  }
}

export async function fetchCustomKitRangesFromFirestore(): Promise<Record<string, CustomKitRange>> {
  let localMap: Record<string, CustomKitRange> = {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_RANGES_KEY);
    if (raw) localMap = JSON.parse(raw);
  } catch (e) {
    console.warn('Local read kit error', e);
  }

  try {
    const snapshot = await getDocs(collection(db, 'custom_kit_ranges'));
    const remoteMap: Record<string, CustomKitRange> = {};
    snapshot.forEach((d) => {
      const data = d.data() as CustomKitRange;
      if (data && data.testId) {
        remoteMap[data.testId] = data;
      }
    });

    if (Object.keys(remoteMap).length > 0) {
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_RANGES_KEY, JSON.stringify(remoteMap));
      return remoteMap;
    }
    return localMap;
  } catch (error) {
    console.warn('Firestore fetch kit ranges fallback to local cache:', error);
    return localMap;
  }
}

export async function saveCustomKitRangeToFirestore(range: CustomKitRange): Promise<void> {
  const rangeId = range.testId;
  const path = `custom_kit_ranges/${rangeId}`;

  // Update local cache first
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_RANGES_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[range.testId] = range;
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_RANGES_KEY, JSON.stringify(map));
  } catch (e) {
    console.warn('Local save kit error', e);
  }

  try {
    await setDoc(doc(db, 'custom_kit_ranges', rangeId), range);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCustomKitRangeFromFirestore(testId: string): Promise<void> {
  const path = `custom_kit_ranges/${testId}`;

  // Update local cache
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_RANGES_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      delete map[testId];
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_RANGES_KEY, JSON.stringify(map));
    }
  } catch (e) {
    console.warn('Local delete kit error', e);
  }

  try {
    await deleteDoc(doc(db, 'custom_kit_ranges', testId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

