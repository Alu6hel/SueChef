import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ThemeId, 
  CornerGeometry, 
  WorkstationId, 
  CountryCode,
  FontSizeScale,
  CaseFile, 
  EvidenceItem, 
  PleadingParagraph,
  DamageItem
} from '../types';
import { createDefaultCase } from '../services/defaultCase';
import { DISPUTE_BLUEPRINTS, createCustomDispute, CustomDisputeInput, generateElementsForCategory } from '../services/disputeTemplates';
import { getJurisdiction } from '../services/jurisdictions';
import { CryptoDbService } from '../services/cryptoDb';
import { sound } from '../services/soundEngine';

interface SueChefContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  cornerGeometry: CornerGeometry;
  setCornerGeometry: (geometry: CornerGeometry) => void;
  country: CountryCode;
  setCountry: (country: CountryCode) => void;
  fontSizeScale: FontSizeScale;
  setFontSizeScale: (scale: FontSizeScale) => void;
  activeWorkstation: WorkstationId;
  setActiveWorkstation: (id: WorkstationId) => void;
  activeCase: CaseFile;
  updateActiveCase: (updater: (prev: CaseFile) => CaseFile) => void;
  loadBlueprint: (blueprintId: string) => void;
  createNewCase: (title: string, state: string, category: string) => void;
  createCustomCase: (input: CustomDisputeInput) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  panicWipe: () => Promise<void>;
  exportCaseBundle: () => string;
  importCaseBundle: (jsonString: string) => Promise<void>;
  totalDamages: number;
  estimatedParalegalSavings: number;
  recalculateMeritScore: () => number;
  addEvidence: (evidence: Omit<EvidenceItem, 'id' | 'sha256Hash'> & { sha256Hash?: string }) => Promise<void>;
  updateParagraph: (id: string, newContent: string) => void;
  isCaseManagerOpen: boolean;
  setIsCaseManagerOpen: (open: boolean) => void;
  isQuickSearchOpen: boolean;
  setIsQuickSearchOpen: (open: boolean) => void;
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const SueChefContext = createContext<SueChefContextType | undefined>(undefined);

export const SueChefProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    return (localStorage.getItem('suechef_theme') as ThemeId) || 'chambers-onyx';
  });

  const [cornerGeometry, setCornerGeometryState] = useState<CornerGeometry>(() => {
    return (localStorage.getItem('suechef_geometry') as CornerGeometry) || 'sharp';
  });

  const [country, setCountryState] = useState<CountryCode>(() => {
    return (localStorage.getItem('suechef_country') as CountryCode) || 'US';
  });

  const [fontSizeScale, setFontSizeScaleState] = useState<FontSizeScale>(() => {
    return (localStorage.getItem('suechef_font_scale') as FontSizeScale) || 'normal';
  });

  const [activeWorkstation, setActiveWorkstationState] = useState<WorkstationId>('home');
  const [activeCase, setActiveCase] = useState<CaseFile>(() => createDefaultCase());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Modals
  const [isCaseManagerOpen, setIsCaseManagerOpen] = useState<boolean>(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Apply theme classes to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(
      'theme-chambers-onyx', 
      'theme-parchment-ink', 
      'theme-legal-slate', 
      'theme-emerald-chancery', 
      'theme-cyber-tribunal',
      'dark',
      'light'
    );
    root.classList.add(`theme-${theme}`);
    if (theme === 'parchment-ink') {
      root.classList.add('light');
    } else {
      root.classList.add('dark');
    }
    localStorage.setItem('suechef_theme', theme);
  }, [theme]);

  // Apply corner geometry class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('geom-sharp', 'geom-chamfer', 'geom-smooth');
    root.classList.add(`geom-${cornerGeometry}`);
    localStorage.setItem('suechef_geometry', cornerGeometry);
  }, [cornerGeometry]);

  // Apply font size scale class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('scale-normal', 'scale-large', 'scale-xlarge');
    root.classList.add(`scale-${fontSizeScale}`);
    localStorage.setItem('suechef_font_scale', fontSizeScale);
  }, [fontSizeScale]);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-save active case to encrypted IndexedDB on changes
  useEffect(() => {
    CryptoDbService.saveCase(activeCase).catch(err => {
      console.error('Failed to auto-save case to IndexedDB:', err);
    });
  }, [activeCase]);

  const setTheme = (newTheme: ThemeId) => {
    sound.playClick();
    setThemeState(newTheme);
  };

  const setCornerGeometry = (newGeom: CornerGeometry) => {
    sound.playClick();
    setCornerGeometryState(newGeom);
  };

  const setCountry = (newCountry: CountryCode) => {
    sound.playClick();
    setCountryState(newCountry);
    localStorage.setItem('suechef_country', newCountry);
  };

  const setFontSizeScale = (newScale: FontSizeScale) => {
    sound.playClick();
    setFontSizeScaleState(newScale);
    localStorage.setItem('suechef_font_scale', newScale);
  };

  const setActiveWorkstation = (id: WorkstationId) => {
    sound.playClick();
    setActiveWorkstationState(id);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    sound.enabled = next;
    setSoundEnabled(next);
    if (next) sound.playSuccessChime();
  };

  const updateActiveCase = (updater: (prev: CaseFile) => CaseFile) => {
    setActiveCase(prev => {
      const updated = updater(prev);
      updated.updatedAt = new Date().toISOString().split('T')[0];
      return updated;
    });
  };

  const loadBlueprint = (blueprintId: string) => {
    const found = DISPUTE_BLUEPRINTS.find(b => b.id === blueprintId);
    if (found) {
      setActiveCase(found.caseData);
      setIsCaseManagerOpen(false);
      sound.playGavelStrike();
    }
  };

  const createNewCase = (title: string, state: string, category: string) => {
    const base = createDefaultCase();
    const caseState = state || 'CA';
    const cat = (category || 'security_deposit') as any;
    const jurisdiction = getJurisdiction(caseState);
    const initialElements = generateElementsForCategory(cat, jurisdiction, 'Defendant');

    const newCase: CaseFile = {
      ...base,
      id: `case_${Date.now()}`,
      title: title || 'New Dispute Matter',
      country: country,
      state: caseState,
      courtName: jurisdiction.courtName,
      claimEvaluation: {
        ...base.claimEvaluation,
        category: cat,
        smallClaimsLimit: jurisdiction.smallClaimsLimitIndividual,
        damages: [],
        elements: initialElements
      },
      evidenceList: [],
      serviceRecords: [],
      solDocket: []
    };
    setActiveCase(newCase);
    setIsCaseManagerOpen(false);
    sound.playGavelStrike();
  };

  const createCustomCase = (input: CustomDisputeInput) => {
    const customCase = createCustomDispute(input);
    setActiveCase(customCase);
    setIsCaseManagerOpen(false);
    sound.playGavelStrike();
  };

  // Total Damages
  const totalDamages = activeCase.claimEvaluation.damages.reduce((acc, d) => acc + (d.amount || 0), 0);

  // Estimated Paralegal & Attorney Intake Billable Hours Saved
  const estimatedParalegalSavings = 18 * 275; // $4,950 estimated savings

  const recalculateMeritScore = (): number => {
    const totalElements = activeCase.claimEvaluation.elements.length;
    if (totalElements === 0) return 0;
    const satisfied = activeCase.claimEvaluation.elements.filter(e => e.isSatisfied).length;
    const baseRatio = satisfied / totalElements;
    
    const hasDamages = activeCase.claimEvaluation.damages.length > 0;
    const hasEvidence = activeCase.evidenceList.length > 0;
    
    let score = Math.round(baseRatio * 75);
    if (hasDamages) score += 15;
    if (hasEvidence) score += 10;
    return Math.min(100, Math.max(0, score));
  };

  const addEvidence = async (evidence: Omit<EvidenceItem, 'id' | 'sha256Hash'> & { sha256Hash?: string }) => {
    const id = `ev_${Date.now()}`;
    const hash = evidence.sha256Hash || await CryptoDbService.computeSha256(evidence.title + evidence.originalFileName + Date.now());
    const newExTag = `EXHIBIT ${String.fromCharCode(65 + activeCase.evidenceList.length)}`;
    
    const newItem: EvidenceItem = {
      ...evidence,
      id,
      sha256Hash: hash,
      exhibitTag: newExTag
    };

    updateActiveCase(prev => ({
      ...prev,
      evidenceList: [...prev.evidenceList, newItem]
    }));
    sound.playDocketStamp();
  };

  const updateParagraph = (id: string, newContent: string) => {
    updateActiveCase(prev => ({
      ...prev,
      pleadings: {
        ...prev.pleadings,
        paragraphs: prev.pleadings.paragraphs.map(p => 
          p.id === id ? { ...p, content: newContent } : p
        )
      }
    }));
  };

  const panicWipe = async () => {
    sound.playShredderWipe();
    await CryptoDbService.panicWipeAll();
    setActiveCase(createDefaultCase());
  };

  const exportCaseBundle = (): string => {
    sound.playDocketStamp();
    return CryptoDbService.exportBundle(activeCase);
  };

  const importCaseBundle = async (jsonString: string) => {
    try {
      const imported = CryptoDbService.importBundle(jsonString);
      setActiveCase(imported);
      await CryptoDbService.saveCase(imported);
      sound.playSuccessChime();
    } catch (e) {
      alert('Failed to import case bundle: invalid JSON schema.');
    }
  };

  return (
    <SueChefContext.Provider
      value={{
        theme,
        setTheme,
        cornerGeometry,
        setCornerGeometry,
        country,
        setCountry,
        fontSizeScale,
        setFontSizeScale,
        activeWorkstation,
        setActiveWorkstation,
        activeCase,
        updateActiveCase,
        loadBlueprint,
        createNewCase,
        createCustomCase,
        soundEnabled,
        toggleSound,
        panicWipe,
        exportCaseBundle,
        importCaseBundle,
        totalDamages,
        estimatedParalegalSavings,
        recalculateMeritScore,
        addEvidence,
        updateParagraph,
        isCaseManagerOpen,
        setIsCaseManagerOpen,
        isQuickSearchOpen,
        setIsQuickSearchOpen,
        isTourOpen,
        setIsTourOpen,
        isSettingsOpen,
        setIsSettingsOpen
      }}
    >
      {children}
    </SueChefContext.Provider>
  );
};

export const useSueChef = (): SueChefContextType => {
  const context = useContext(SueChefContext);
  if (!context) {
    throw new Error('useSueChef must be used within a SueChefProvider');
  }
  return context;
};
