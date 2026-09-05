import React, { useState } from 'react';
import { SueChefProvider, useSueChef } from './context/SueChefContext';
import { Header } from './components/Header/Header';
import { ClaimKitchen } from './components/ClaimKitchen/ClaimKitchen';
import { DiscoveryStudio } from './components/DiscoveryStudio/DiscoveryStudio';
import { TrialPrep } from './components/TrialPrep/TrialPrep';
import { SettlementMatrix } from './components/SettlementMatrix/SettlementMatrix';
import { SolWatcher } from './components/SolWatcher/SolWatcher';
import { PleadingBuilder } from './components/PleadingBuilder/PleadingBuilder';
import { EvidenceLocker } from './components/EvidenceLocker/EvidenceLocker';
import { LegaleseDecoder } from './components/LegaleseDecoder/LegaleseDecoder';
import { ServiceTracker } from './components/ServiceTracker/ServiceTracker';
import { AttorneyDossier } from './components/AttorneyDossier/AttorneyDossier';
import { SecurityVault } from './components/SecurityVault/SecurityVault';
import { CaseManagerModal } from './components/CaseManager/CaseManagerModal';
import { QuickSearchModal } from './components/QuickSearch/QuickSearchModal';
import { WalkthroughTour } from './components/WalkthroughTour/WalkthroughTour';
import { ParchmentBookAnimation } from './components/ThemeEffects/ParchmentBookAnimation';
import { ChambersScalesAnimation } from './components/ThemeEffects/ChambersScalesAnimation';
import { 
  ShieldCheck, 
  Scale, 
  DollarSign, 
  Clock, 
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';

const WorkstationRouter: React.FC = () => {
  const { activeWorkstation, totalDamages, estimatedParalegalSavings, activeCase, theme } = useSueChef();
  const [showLiveTheme, setShowLiveTheme] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors">
      <Header />
      
      <main className="flex-1 pb-20 p-3 sm:p-4 md:p-6 max-w-7xl w-full mx-auto space-y-4">
        {/* Interactive Live Theme Animation Stage */}
        {showLiveTheme && (
          <div className="animate-in fade-in duration-300">
            {theme === 'parchment-ink' ? (
              <ParchmentBookAnimation />
            ) : (
              <ChambersScalesAnimation />
            )}
          </div>
        )}

        {/* Workstation View Routing */}
        <div className="transition-all duration-200">
          {activeWorkstation === 'claim-kitchen' && <ClaimKitchen />}
          {activeWorkstation === 'discovery-studio' && <DiscoveryStudio />}
          {activeWorkstation === 'trial-prep' && <TrialPrep />}
          {activeWorkstation === 'settlement-matrix' && <SettlementMatrix />}
          {activeWorkstation === 'sol-watcher' && <SolWatcher />}
          {activeWorkstation === 'pleading-builder' && <PleadingBuilder />}
          {activeWorkstation === 'evidence-locker' && <EvidenceLocker />}
          {activeWorkstation === 'legalese-decoder' && <LegaleseDecoder />}
          {activeWorkstation === 'service-tracker' && <ServiceTracker />}
          {activeWorkstation === 'attorney-dossier' && <AttorneyDossier />}
          {activeWorkstation === 'security-vault' && <SecurityVault />}
        </div>
      </main>

      {/* Global Modals & Overlay Tour */}
      <CaseManagerModal />
      <QuickSearchModal />
      <WalkthroughTour />

      {/* Fixed Bottom Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] px-4 py-2 text-xs shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">100% Client Encrypted</span>
            </span>
            <span className="text-[var(--text-muted)] hidden md:inline">•</span>
            <span className="text-[var(--text-muted)] hidden md:inline truncate max-w-xs">
              {activeCase.courtName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLiveTheme(prev => !prev)}
              className="text-[10px] text-[var(--accent-gold)] hover:underline flex items-center gap-1 font-sans"
              title="Toggle Live Animated Stage"
            >
              {showLiveTheme ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span className="hidden sm:inline">{showLiveTheme ? 'Hide Live Stage' : 'Show Live Stage'}</span>
            </button>

            <div className="flex items-center gap-1">
              <span className="text-[var(--text-muted)]">Damages:</span>
              <span className="font-bold text-emerald-400">${totalDamages.toLocaleString()}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-[var(--text-muted)]">Legal Savings:</span>
              <span className="font-bold text-[var(--accent-gold)]">${estimatedParalegalSavings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SueChefProvider>
      <WorkstationRouter />
    </SueChefProvider>
  );
};

export default App;
