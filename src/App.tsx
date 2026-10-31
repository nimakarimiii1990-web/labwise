import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Header, ActiveTab } from './components/Header';
import { EvaluationWorkbench } from './components/EvaluationWorkbench';
import { TestDirectory } from './components/TestDirectory';
import { KitRangeManager } from './components/KitRangeManager';
import { QualityControlDesk } from './components/QualityControlDesk';
import { ReagentTechnicalPortal } from './components/ReagentTechnicalPortal';
import { ScientificKnowledgeHub } from './components/ScientificKnowledgeHub';
import { GeminiLabAssistant } from './components/GeminiLabAssistant';
import { Inventory } from './components/Inventory';
import { NavigationTabs } from './components/NavigationTabs';
import { DeviceConnectModal } from './components/DeviceConnectModal';
import { DeviceParametersPortal } from './components/DeviceParametersPortal';
import {
  subscribeToAuth,
  loginWithGoogle,
  logoutUser,
  subscribeToCustomKitRanges,
  CustomKitRange,
  checkIsAdmin,
} from './services/firebaseService';

import {
  FlaskConical,
  ShieldCheck,
  BookOpen,
  Sparkles,
  ExternalLink,
  Layers,
  HeartHandshake,
  Activity,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workbench');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirestoreOnline, setIsFirestoreOnline] = useState<boolean>(true);
  const [targetTestId, setTargetTestId] = useState<string | undefined>(undefined);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState<boolean>(false);
  const [customRanges, setCustomRanges] = useState<Record<string, CustomKitRange>>({});

  const sharedUrl =
    typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null'
      ? window.location.origin
      : 'https://ais-dev-6hsl7a5uju4exfkdljoi6a-297466553431.europe-west3.run.app';


  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to Realtime Custom Kit Ranges from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToCustomKitRanges((ranges) => {
      setCustomRanges(ranges);
    });
    return () => unsubscribe();
  }, []);


  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.warn('Google sign in canceled or unavailable:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Logout error:', err);
    }
  };

  const handleOpenDirectoryTest = (testId: string) => {
    setTargetTestId(testId);
    setActiveTab('directory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTestForWorkbench = (testId: string) => {
    setActiveTab('workbench');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-cyan-200/60 selection:text-cyan-900 antialiased relative">
      {/* Decorative laboratory background shapes */}
      <div className="lab-bg-decor" aria-hidden="true" />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={currentUser}
        isAdmin={checkIsAdmin(currentUser)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isFirestoreOnline={isFirestoreOnline}
        onOpenDeviceModal={() => setIsDeviceModalOpen(true)}
      />

      {/* Scrollable Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Device & Export Modal */}
      <DeviceConnectModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        sharedUrl={sharedUrl}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTab === 'workbench' && (
          <EvaluationWorkbench
            onOpenDirectoryTest={handleOpenDirectoryTest}
            customRanges={customRanges}
            onOpenKitManager={() => setActiveTab('kit_ranges')}
          />
        )}

        {activeTab === 'directory' && (
          <TestDirectory
            initialSelectedTestId={targetTestId}
            onSelectTestForWorkbench={handleSelectTestForWorkbench}
          />
        )}

        {activeTab === 'kit_ranges' && (
          <KitRangeManager
            user={currentUser}
            customRanges={customRanges}
            onOpenDeviceModal={() => setIsDeviceModalOpen(true)}
          />
        )}

        {activeTab === 'qc' && <QualityControlDesk />}

        {activeTab === 'reagents' && <ReagentTechnicalPortal />}

        {activeTab === 'devices' && <DeviceParametersPortal />}

        {activeTab === 'articles' && <ScientificKnowledgeHub />}

        {activeTab === 'ai_chat' && <GeminiLabAssistant />}

        {activeTab === 'inventory' && <Inventory />}
      </main>


      {/* Footer - Light laboratory style */}
      <footer className="mt-12 relative z-10 bg-white/85 backdrop-blur-md border-t border-sky-100 text-slate-600 py-8 text-xs shadow-[0_-4px_24px_-8px_rgba(14,165,233,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/25">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">
                سامانه جامع هوشمند پشتیبانی تصمیم بالینی و کنترل کیفی آزمایشگاه (LabWise)
              </p>
              <p className="text-[11px] text-slate-500">
                تطبیق استانداردهای CLSI EP05/C28، راهنماهای فدراسیون بین‌المللی IFCC و کتاب مرجع بیوشیمی بالینی Tietz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              ذخیره‌سازی ابری Firebase Firestore
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              هوش مصنوعی Gemini 3.8 Flash
            </span>
            <span className="font-mono">© 2026 LabWise Clinical Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
