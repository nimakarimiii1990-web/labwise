import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Header, ActiveTab } from './components/Header';
import { Hero } from './components/Hero';
import { NavigationTabs } from './components/NavigationTabs';
import { EvaluationWorkbench } from './components/EvaluationWorkbench';
import { TestDirectory } from './components/TestDirectory';
import { KitRangeManager } from './components/KitRangeManager';
import { QualityControlDesk } from './components/QualityControlDesk';
import { ReagentTechnicalPortal } from './components/ReagentTechnicalPortal';
import { ScientificKnowledgeHub } from './components/ScientificKnowledgeHub';
import { GeminiLabAssistant } from './components/GeminiLabAssistant';
import { DeviceConnectModal } from './components/DeviceConnectModal';
import { DeviceParametersPortal } from './components/DeviceParametersPortal';
import { Inventory } from './components/Inventory';
import {
  subscribeToAuth,
  loginWithGoogle,
  logoutUser,
  subscribeToCustomKitRanges,
  CustomKitRange,
  checkIsAdmin,
} from './services/firebaseService';

export default function App() {
  const [showHero, setShowHero] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('workbench');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirestoreOnline, setIsFirestoreOnline] = useState<boolean>(true);
  const [targetTestId, setTargetTestId] = useState<string | undefined>(undefined);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState<boolean>(false);
  const [customRanges, setCustomRanges] = useState<Record<string, CustomKitRange>>({});

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

  const handleEnterPlatform = () => {
    setShowHero(false);
  };

  // Landing page with background image
  if (showHero) {
    return (
      <div className="min-h-screen">
        <Hero
          lang="fa"
          onExploreCapabilities={handleEnterPlatform}
          onExplorePricing={handleEnterPlatform}
        />
      </div>
    );
  }

  // Main app with tabs
  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-cyan-200/60 selection:text-cyan-900 antialiased relative">
      <div className="lab-bg-decor" aria-hidden="true" />

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

      <DeviceConnectModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />

      {/* Scrollable Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as ActiveTab)} />

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

      <footer className="mt-12 relative z-10 bg-white/85 backdrop-blur-md border-t border-sky-100 text-slate-600 py-8 text-xs shadow-[0_-4px_24px_-8px_rgba(14,165,233,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/25">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 3L7 17H17L15 3H9Z"/></svg>
            </div>
            <div>
              <p className="font-bold text-slate-800">LabWise - سامانه مدیریت آزمایشگاه</p>
              <p className="text-[11px] text-slate-500">سیستم یکپارچه آزمایشگاهی</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
            <span>Firebase Firestore</span>
            <span>Gemini AI</span>
            <span className="font-mono">© 2026 LabWise</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
