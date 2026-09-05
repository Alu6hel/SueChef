import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ThemeId, 
  CornerGeometry, 
  WorkstationId, 
  CaseFile, 
  EvidenceItem, 
  PleadingParagraph,
  DamageItem
} from '../types';
import { createDefaultCase } from '../services/defaultCase';
import { CryptoDbService } from '../services/cryptoDb';
import { sound } from '../services/soundEngine';

interface SueChefContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  cornerGeometry: CornerGeometry;
  setCornerGeometry: (geometry: CornerGeometry) => void;
  activeWorkstation: WorkstationId;
  setActiveWorkstation: (id: WorkstationId) => void;
  activeCase: CaseFile;
  updateActiveCase: (updater: (prev: CaseFile) => CaseFile) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  panicWipe: () => Promise<void>;
  exportCaseBundle: () => string;
  importCaseBundle: (jsonString: string) => Promise<void>;
  totalDamages: number;
  estimatedParalegalSavings: number;
  recalculateMeritScore: () => number;
  addEvidence: (evidence: Omit<EvidenceItem, 'id' | 'sha256Hash'>) => Promise<void>;
  updateParagraph: (id: string, newContent: string) => void;
}

const SueChefContext = createContext<SueChefContextType | undefined>(undefined);

export const SueChefProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    return (localStorage.getItem('suechef_theme') as ThemeId) || 'chambers-onyx';
  });

  const [cornerGeometry, setCornerGeometryState] = useState<CornerGeometry>(() => {
    return (localStorage.getItem('suechef_geometry') as CornerGeometry) || 'sharp';
  });

  const [activeWorkstation, setActiveWorkstationState] = useState<WorkstationId>('claim-kitchen');
  const [activeCase, setActiveCase] = useState<CaseFile>(() => createDefaultCase());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

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

  // Total Damages
  const totalDamages = activeCase.claimEvaluation.damages.reduce((acc, d) => acc + (d.amount || 0), 0);

  // Estimated Paralegal & Attorney Intake Billable Hours Saved
  // Based on standard $350/hr associate rate and $175/hr paralegal intake (avg 18 billable hours for full complaint, exhibits, and timeline)
  const estimatedParalegalSavings = 18 * 275; // $4,950 estimated savings

  const recalculateMeritScore = (): number => {
    const totalElements = activeCase.claimEvaluation.elements.length;
    if (totalElements === 0) return 0;
    const satisfied = activeCase.claimEvaluation.elements.filter(e => e.isSatisfied).length;
    const baseRatio = satisfied / totalElements;
    
    // Check if damages are documented
    const hasDamages = activeCase.claimEvaluation.damages.length > 0;
    const hasEvidence = activeCase.evidenceList.length > 0;
    
    let score = Math.round(baseRatio * 75);
    if (hasDamages) score += 15;
    if (hasEvidence) score += 10;
    return Math.min(100, Math.max(0, score));
  };

  const addEvidence = async (evidence: Omit<EvidenceItem, 'id' | 'sha256Hash'>) => {
    const id = `ev_${Date.now()}`;
    const hash = await CryptoDbService.computeSha256(evidence.title + evidence.originalFileName + Date.now());
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
        activeWorkstation,
        setActiveWorkstation,
        activeCase,
        updateActiveCase,
        soundEnabled,
        toggleSound,
        panicWipe,
        exportCaseBundle,
        importCaseBundle,
        totalDamages,
        estimatedParalegalSavings,
        recalculateMeritScore,
        addEvidence,
        updateParagraph
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
