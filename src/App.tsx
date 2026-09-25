import React, { useState } from 'react';
import { SueChefProvider, useSueChef } from './context/SueChefContext';
import { Header } from './components/Header/Header';
import { HomeDashboard } from './components/Home/HomeDashboard';
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
import { EnforcementSuite } from './components/Enforcement/EnforcementSuite';
import { SecondOpinionConsultant } from './components/SecondOpinion/SecondOpinionConsultant';
import { LegalServicesHub } from './components/LegalServices/LegalServicesHub';
import { CaseManagerModal } from './components/CaseManager/CaseManagerModal';
import { CasePartiesModal } from './components/CaseManager/CasePartiesModal';
import { BottomNavBar } from './components/Navigation/BottomNavBar';
import { QuickSearchModal } from './components/QuickSearch/QuickSearchModal';
import { WalkthroughTour } from './components/WalkthroughTour/WalkthroughTour';
import { SettingsModal } from './components/Settings/SettingsModal';
import { PersonalizedOnboardingModal } from './components/Onboarding/PersonalizedOnboardingModal';
import { ParchmentBookAnimation } from './components/ThemeEffects/ParchmentBookAnimation';
import { ChambersScalesAnimation } from './components/ThemeEffects/ChambersScalesAnimation';
import { getCountryInfo } from './services/countries';
import { 
  ShieldCheck, 
  Scale, 
  DollarSign, 
  Clock, 
  Award,
  Sparkles,
  Eye,
  EyeOff,
  Building,
  Settings
} from 'lucide-react';

const WorkstationRouter: React.FC = () => {
  const { 
    activeWorkstation, 
    totalDamages, 
    estimatedParalegalSavings, 
    activeCase, 
    theme,
    country,
    setIsSettingsOpen
  } = useSueChef();
  const [showLiveTheme, setShowLiveTheme] = useState(true);

  const countryInfo = getCountryInfo(country);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors">
      <Header />
      
      <main className="flex-1 pb-32 sm:pb-36 p-3 sm:p-4 md:p-6 max-w-7xl w-full mx-auto space-y-5">
        {/* Interactive Live Theme Animation Banner */}
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
          {activeWorkstation === 'home' && <HomeDashboard />}
          {activeWorkstation === 'claim-kitchen' && <ClaimKitchen />}
          {activeWorkstation === 'evidence-locker' && <EvidenceLocker />}
          {activeWorkstation === 'pleading-builder' && <PleadingBuilder />}
          {activeWorkstation === 'settlement-matrix' && <SettlementMatrix />}
          {activeWorkstation === 'second-opinion' && <SecondOpinionConsultant />}
          {activeWorkstation === 'legal-services' && <LegalServicesHub />}
          {activeWorkstation === 'discovery-studio' && <DiscoveryStudio />}
          {activeWorkstation === 'trial-prep' && <TrialPrep />}
          {activeWorkstation === 'sol-watcher' && <SolWatcher />}
          {activeWorkstation === 'service-tracker' && <ServiceTracker />}
          {activeWorkstation === 'legalese-decoder' && <LegaleseDecoder />}
          {activeWorkstation === 'attorney-dossier' && <AttorneyDossier />}
          {activeWorkstation === 'enforcement' && <EnforcementSuite />}
          {activeWorkstation === 'security-vault' && <SecurityVault />}
        </div>
      </main>

      {/* Global Modals & Overlay Services */}
      <CaseManagerModal />
      <CasePartiesModal />
      <QuickSearchModal />
      <WalkthroughTour />
      <SettingsModal />
      <PersonalizedOnboardingModal />

      {/* Status Bar (Clean Desktop bar above navigation) */}
      <footer className="hidden lg:block fixed bottom-14 left-0 right-0 z-30 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] px-4 py-1.5 text-xs shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Client-Side Privacy</span>
            </span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[var(--text-muted)] truncate max-w-xs">
              {countryInfo.flag} {activeCase.state} Jurisdiction
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLiveTheme(prev => !prev)}
              className="text-xs text-[var(--accent-gold)] hover:underline flex items-center gap-1 font-sans"
              title="Toggle Live Animated Stage"
            >
              {showLiveTheme ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showLiveTheme ? 'Hide Stage' : 'Show Stage'}</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 font-sans"
              title="Change country & location"
            >
              <Settings className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Country: {countryInfo.name}</span>
            </button>

            <div className="flex items-center gap-1">
              <span className="text-[var(--text-muted)]">Claimed:</span>
              <span className="font-bold text-emerald-400">
                {countryInfo.currencySymbol}{totalDamages.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[var(--text-muted)]">Legal Savings:</span>
              <span className="font-bold text-[var(--accent-gold)]">{countryInfo.currencySymbol}{estimatedParalegalSavings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Audiomack-Inspired Bottom Navigation Bar */}
      <BottomNavBar />
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
