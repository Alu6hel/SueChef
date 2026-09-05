import React from 'react';
import { SueChefProvider, useSueChef } from './context/SueChefContext';
import { Header } from './components/Header/Header';
import { ClaimKitchen } from './components/ClaimKitchen/ClaimKitchen';
import { SolWatcher } from './components/SolWatcher/SolWatcher';
import { PleadingBuilder } from './components/PleadingBuilder/PleadingBuilder';
import { EvidenceLocker } from './components/EvidenceLocker/EvidenceLocker';
import { LegaleseDecoder } from './components/LegaleseDecoder/LegaleseDecoder';
import { ServiceTracker } from './components/ServiceTracker/ServiceTracker';
import { AttorneyDossier } from './components/AttorneyDossier/AttorneyDossier';
import { SecurityVault } from './components/SecurityVault/SecurityVault';
import { 
  ShieldCheck, 
  Scale, 
  DollarSign, 
  Clock, 
  Award,
  Sparkles
} from 'lucide-react';

const WorkstationRouter: React.FC = () => {
  const { activeWorkstation, totalDamages, estimatedParalegalSavings, activeCase } = useSueChef();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors">
      <Header />
      
      <main className="flex-1 pb-16">
        {activeWorkstation === 'claim-kitchen' && <ClaimKitchen />}
        {activeWorkstation === 'sol-watcher' && <SolWatcher />}
        {activeWorkstation === 'pleading-builder' && <PleadingBuilder />}
        {activeWorkstation === 'evidence-locker' && <EvidenceLocker />}
        {activeWorkstation === 'legalese-decoder' && <LegaleseDecoder />}
        {activeWorkstation === 'service-tracker' && <ServiceTracker />}
        {activeWorkstation === 'attorney-dossier' && <AttorneyDossier />}
        {activeWorkstation === 'security-vault' && <SecurityVault />}
      </main>

      {/* Fixed Bottom Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] px-4 py-1.5 text-xs">
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
            <div className="flex items-center gap-1">
              <span className="text-[var(--text-muted)]">Damages Claimed:</span>
              <span className="font-bold text-emerald-400">${totalDamages.toLocaleString()}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-[var(--text-muted)]">Legal Fees Saved:</span>
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
