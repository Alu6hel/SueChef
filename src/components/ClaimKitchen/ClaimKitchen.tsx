import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Scale, 
  HelpCircle, 
  ShieldAlert, 
  ArrowRight,
  Calculator,
  Gavel,
  DollarSign,
  Sparkles,
  RefreshCw,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { DisputeCategory, DamageItem, ClaimElement } from '../../types';
import { STATE_JURISDICTIONS, getJurisdiction } from '../../services/jurisdictions';
import { generateElementsForCategory } from '../../services/disputeTemplates';
import { sound } from '../../services/soundEngine';

export const ClaimKitchen: React.FC = () => {
  const { activeCase, updateActiveCase, recalculateMeritScore, totalDamages, setActiveWorkstation } = useSueChef();
  const [newDamageDesc, setNewDamageDesc] = useState('');
  const [newDamageAmount, setNewDamageAmount] = useState('');
  const [newDamageCategory, setNewDamageCategory] = useState<DamageItem['category']>('direct_actual');

  // Custom Element Form State
  const [showAddElementModal, setShowAddElementModal] = useState(false);
  const [newElemTitle, setNewElemTitle] = useState('');
  const [newElemStandard, setNewElemStandard] = useState('');
  const [newElemDesc, setNewElemDesc] = useState('');
  const [newElemNotes, setNewElemNotes] = useState('');
  const [editingElemId, setEditingElemId] = useState<string | null>(null);
  const [editingNotesText, setEditingNotesText] = useState('');

  const currJurisdiction = getJurisdiction(activeCase.state);

  // Live Calculator Interactive State
  const initialPrincipal = activeCase.claimEvaluation.damages.find(d => d.category === 'direct_actual')?.amount || 2500;
  const [calcPrincipal, setCalcPrincipal] = useState<number>(initialPrincipal);
  const [calcDaysElapsed, setCalcDaysElapsed] = useState<number>(60);
  const [calcMultiplier, setCalcMultiplier] = useState<number>(currJurisdiction.securityDepositBadFaithPenaltyMultiplier || 2);

  const categories: { id: DisputeCategory; label: string; desc: string }[] = [
    { id: 'security_deposit', label: 'Security Deposit Bad Faith', desc: 'Failure to return or itemize deductions within statutory window' },
    { id: 'breach_of_contract', label: 'Breach of Contract', desc: 'Failure to perform terms, unpaid invoices, or unfulfilled deliverables' },
    { id: 'consumer_fraud', label: 'Consumer Protection / Fraud', desc: 'Misrepresentation, unfair deceptive trade practices' },
    { id: 'property_damage', label: 'Property Damage & Trespass', desc: 'Destruction of vehicle, real property, or personal assets' },
    { id: 'wage_theft', label: 'Wage Theft & Unpaid Wages', desc: 'Overtime violations, withheld final paycheck, expense non-reimbursement' },
    { id: 'negligence', label: 'Tort & Negligence', desc: 'Duty of care violation causing monetary or physical damage' },
    { id: 'hoa_neighbor', label: 'HOA & Neighbor Dispute', desc: 'Nuisance, boundary encroachment, illegal fines' },
  ];

  const meritScore = recalculateMeritScore();

  const handleToggleElement = (elementId: string) => {
    sound.playClick();
    updateActiveCase(prev => {
      const updatedElements = prev.claimEvaluation.elements.map(elem => 
        elem.id === elementId ? { ...elem, isSatisfied: !elem.isSatisfied } : elem
      );
      return {
        ...prev,
        claimEvaluation: {
          ...prev.claimEvaluation,
          elements: updatedElements,
          meritScore: recalculateMeritScore()
        }
      };
    });
  };

  const handleReloadStatutoryElements = () => {
    sound.playDocketStamp();
    const opponentName = activeCase.parties.find(p => p.role === 'defendant')?.name || 'Defendant';
    const standardElements = generateElementsForCategory(activeCase.claimEvaluation.category, currJurisdiction, opponentName);
    updateActiveCase(prev => ({
      ...prev,
      claimEvaluation: {
        ...prev.claimEvaluation,
        elements: standardElements
      }
    }));
  };

  const handleAddCustomElement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newElemTitle.trim()) return;
    sound.playDocketStamp();

    const newElem: ClaimElement = {
      id: `elem_cust_${Date.now()}`,
      title: newElemTitle.trim(),
      legalStandard: newElemStandard.trim() || 'Custom Legal Standard',
      description: newElemDesc.trim() || 'Plaintiff asserts this required element of proof.',
      isSatisfied: true,
      userEvidenceNotes: newElemNotes.trim() || 'Documentary evidence supporting this element.',
      linkedEvidenceIds: []
    };

    updateActiveCase(prev => ({
      ...prev,
      claimEvaluation: {
        ...prev.claimEvaluation,
        elements: [...prev.claimEvaluation.elements, newElem]
      }
    }));

    setShowAddElementModal(false);
    setNewElemTitle('');
    setNewElemStandard('');
    setNewElemDesc('');
    setNewElemNotes('');
  };

  const handleDeleteElement = (id: string) => {
    sound.playClick();
    updateActiveCase(prev => ({
      ...prev,
      claimEvaluation: {
        ...prev.claimEvaluation,
        elements: prev.claimEvaluation.elements.filter(e => e.id !== id)
      }
    }));
  };

  const handleSaveElemNotes = (id: string) => {
    sound.playClick();
    updateActiveCase(prev => ({
      ...prev,
      claimEvaluation: {
        ...prev.claimEvaluation,
        elements: prev.claimEvaluation.elements.map(e => 
          e.id === id ? { ...e, userEvidenceNotes: editingNotesText } : e
        )
      }
    }));
    setEditingElemId(null);
  };

  const handleAddDamageItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDamageDesc || !newDamageAmount) return;
    const amount = parseFloat(newDamageAmount);
    if (isNaN(amount) || amount <= 0) return;

    sound.playDocketStamp();
    const newItem: DamageItem = {
      id: `dmg_${Date.now()}`,
      description: newDamageDesc,
      amount,
      category: newDamageCategory
    };

    updateActiveCase(prev => ({
      ...prev,
      claimEvaluation: {
        ...prev.claimEvaluation,
        damages: [...prev.claimEvaluation.damages, newItem]
      }
    }));

    setNewDamageDesc('');
    setNewDamageAmount('');
  };

  const handleDeleteDamageItem = (id: string) => {
    sound.playClick();
    updateActiveCase(prev => ({
      ...prev,
      claimEvaluation: {
        ...prev.claimEvaluation,
        damages: prev.claimEvaluation.damages.filter(d => d.id !== id)
      }
    }));
  };

  const isOverSmallClaims = totalDamages > currJurisdiction.smallClaimsLimitIndividual;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-fadeIn">
      {/* Workstation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 card-geom bg-amber-500/10 border border-amber-500/30 text-amber-500">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-[var(--text-main)]">
                The Claim Kitchen
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Dispute Evaluator, Prima Facie Element Matrix & Damages Viability Calculator
              </p>
            </div>
          </div>
        </div>

        {/* Live Merit Score Card */}
        <div className="flex items-center gap-4 card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] font-semibold">
              Merit Strength Score
            </span>
            <div className="text-2xl font-bold font-mono text-[var(--accent-gold)] flex items-center justify-end gap-1">
              <span>{meritScore}</span>
              <span className="text-sm font-normal text-[var(--text-muted)]">/ 100</span>
            </div>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                className={meritScore >= 80 ? 'text-emerald-500' : meritScore >= 50 ? 'text-amber-500' : 'text-rose-500'}
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * meritScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-[var(--text-main)]">
              {meritScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Left (Intake & Elements), Right (Damages & Jurisdiction) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Dispute Category Selector */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-3">
            <label className="text-xs uppercase font-mono font-bold text-[var(--text-muted)] flex items-center gap-1.5">
              <Gavel className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              Primary Cause of Action
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClick();
                    const opponentName = activeCase.parties.find(p => p.role === 'defendant')?.name || 'Defendant';
                    const newElements = activeCase.claimEvaluation.elements.length === 0 
                      ? generateElementsForCategory(cat.id, currJurisdiction, opponentName)
                      : activeCase.claimEvaluation.elements;
                    updateActiveCase(prev => ({
                      ...prev,
                      claimEvaluation: {
                        ...prev.claimEvaluation,
                        category: cat.id,
                        elements: newElements
                      }
                    }));
                  }}
                  className={`card-geom p-3 text-left border transition-all ${
                    activeCase.claimEvaluation.category === cat.id
                      ? 'bg-[var(--badge-bg)] border-[var(--accent-gold)] text-[var(--text-main)]'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="font-semibold text-xs text-[var(--text-main)]">{cat.label}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1 line-clamp-2">{cat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prima Facie Elements Matrix */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
                  Prima Facie Element Checklist
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Every civil cause of action requires satisfying each mandatory legal element.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[var(--accent-gold)] mr-1">
                  {activeCase.claimEvaluation.elements.filter(e => e.isSatisfied).length} / {activeCase.claimEvaluation.elements.length} Proven
                </span>
                <button
                  type="button"
                  onClick={handleReloadStatutoryElements}
                  className="px-2.5 py-1 text-[10px] font-mono font-semibold bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] card-geom flex items-center gap-1 transition-all"
                  title="Reload default statutory elements for this cause of action"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reload Standards</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowAddElementModal(true);
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 card-geom flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Element</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {activeCase.claimEvaluation.elements.map((elem, idx) => (
                <div
                  key={elem.id}
                  className={`card-geom p-3.5 border transition-all ${
                    elem.isSatisfied 
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-100' 
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-grow">
                      <button
                        onClick={() => handleToggleElement(elem.id)}
                        className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                          elem.isSatisfied 
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                            : 'bg-transparent border-slate-600 hover:border-slate-400'
                        }`}
                        title="Toggle proven / not proven"
                      >
                        {elem.isSatisfied && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-[var(--text-main)]">
                              Element {idx + 1}: {elem.title}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-[var(--accent-gold)] border border-[var(--border-color)]">
                              {elem.legalStandard}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => {
                                sound.playClick();
                                setEditingElemId(elem.id);
                                setEditingNotesText(elem.userEvidenceNotes || '');
                              }}
                              className="text-slate-400 hover:text-[var(--accent-gold)] p-1"
                              title="Edit Evidence Notes"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteElement(elem.id)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                              title="Remove Element"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          {elem.description}
                        </p>

                        {/* Evidence Notes / Editor */}
                        {editingElemId === elem.id ? (
                          <div className="space-y-1.5 pt-2">
                            <textarea
                              value={editingNotesText}
                              onChange={e => setEditingNotesText(e.target.value)}
                              rows={2}
                              className="input-geom w-full p-2 text-xs bg-black/60 border border-[var(--accent-gold)] text-slate-200 font-mono"
                              placeholder="Enter corroborating facts and exhibit links..."
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingElemId(null)}
                                className="px-2 py-1 text-[10px] bg-slate-800 text-slate-400 card-geom"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveElemNotes(elem.id)}
                                className="px-2.5 py-1 text-[10px] bg-emerald-500 text-slate-950 font-bold card-geom flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Save Notes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] font-mono text-slate-300 bg-black/30 p-2 card-geom border border-white/5 mt-2 flex justify-between items-start">
                            <div>
                              <span className="text-emerald-400 font-semibold">Corroborating Evidence: </span>
                              {elem.userEvidenceNotes || 'No notes attached yet.'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations & Defect Warnings */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Strategic Case Health & Recommendations
            </h4>
            <div className="space-y-2">
              {activeCase.claimEvaluation.defectWarnings.map((warn, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-amber-300/90 bg-amber-950/30 border border-amber-500/20 p-2.5 card-geom">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}
              {activeCase.claimEvaluation.remediationSuggestions.map((sug, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-emerald-300/90 bg-emerald-950/30 border border-emerald-500/20 p-2.5 card-geom">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 5 Cols (Jurisdiction & Damages Calculator) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Jurisdiction & Small Claims Ceiling */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
              <h3 className="font-serif font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[var(--accent-gold)]" />
                Jurisdiction & Venue Ceiling
              </h3>
              <select
                value={activeCase.state}
                onChange={e => {
                  sound.playClick();
                  const newState = e.target.value;
                  const j = getJurisdiction(newState);
                  updateActiveCase(prev => ({
                    ...prev,
                    state: newState,
                    courtName: j.courtName
                  }));
                }}
                className="input-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)] px-2 py-1"
              >
                {Object.keys(STATE_JURISDICTIONS).map(st => (
                  <option key={st} value={st}>
                    {STATE_JURISDICTIONS[st].stateName} ({st})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--text-muted)]">Small Claims Dollar Limit:</span>
                <span className="font-mono font-bold text-[var(--text-main)]">
                  ${currJurisdiction.smallClaimsLimitIndividual.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--text-muted)]">Statutory Return Window:</span>
                <span className="font-mono font-bold text-amber-400">
                  {currJurisdiction.securityDepositReturnDays} Days
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[var(--text-muted)]">Bad-Faith Penalty Multiplier:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {currJurisdiction.securityDepositBadFaithPenaltyMultiplier}x Withheld
                </span>
              </div>
              <div className="pt-2 text-[11px] font-mono text-[var(--text-muted)]">
                <span className="text-[var(--accent-gold)]">Statutory Citation:</span> {currJurisdiction.securityDepositStatuteCitation}
              </div>
            </div>

            {/* Threshold Warning Banner */}
            <div className={`p-3 card-geom border text-xs font-mono ${
              isOverSmallClaims 
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' 
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}>
              {isOverSmallClaims ? (
                <div>
                  <strong>⚠️ EXCEEDS SMALL CLAIMS:</strong> Total claimed damages (${totalDamages.toLocaleString()}) exceed the {currJurisdiction.stateName} small claims ceiling (${currJurisdiction.smallClaimsLimitIndividual.toLocaleString()}). Must file in Superior / District Court (Limited Civil).
                </div>
              ) : (
                <div>
                  <strong>✓ SMALL CLAIMS ELIGIBLE:</strong> Total damages (${totalDamages.toLocaleString()}) fit comfortably within the {currJurisdiction.stateName} small claims limit (${currJurisdiction.smallClaimsLimitIndividual.toLocaleString()}).
                </div>
              )}
            </div>
          </div>

          {/* Itemized Damages Calculator */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
              <h3 className="font-serif font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                Itemized Damages Calculator
              </h3>
              <span className="text-base font-mono font-bold text-emerald-400">
                ${totalDamages.toLocaleString()}
              </span>
            </div>

            {/* List of current damages */}
            <div className="space-y-2">
              {activeCase.claimEvaluation.damages.map(dmg => (
                <div
                  key={dmg.id}
                  className="flex items-center justify-between p-2.5 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[var(--text-main)]">{dmg.description}</div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                      {dmg.category.replace('_', ' ')} {dmg.statutoryBasis && `• ${dmg.statutoryBasis}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[var(--text-main)]">
                      ${dmg.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteDamageItem(dmg.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Damage Form */}
            <form onSubmit={handleAddDamageItem} className="pt-2 border-t border-[var(--border-color)] space-y-2">
              <input
                type="text"
                placeholder="Damage description (e.g. Unreturned deposit)"
                value={newDamageDesc}
                onChange={e => setNewDamageDesc(e.target.value)}
                className="input-geom w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Amount ($)"
                  value={newDamageAmount}
                  onChange={e => setNewDamageAmount(e.target.value)}
                  className="input-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-3 py-2 font-mono"
                />
                <select
                  value={newDamageCategory}
                  onChange={e => setNewDamageCategory(e.target.value as DamageItem['category'])}
                  className="input-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] px-2 py-2"
                >
                  <option value="direct_actual">Direct Actual</option>
                  <option value="consequential">Consequential</option>
                  <option value="statutory_penalty">Statutory Penalty</option>
                  <option value="punitive">Punitive</option>
                  <option value="interest">Prejudgment Interest</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn-geom w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Itemized Damage
              </button>
            </form>
          </div>

          {/* Statutory Multiplier & Prejudgment Interest Calculator Card */}
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
              <h3 className="font-serif font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Live Statutory Penalties &amp; Interest Calculator
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {currJurisdiction.stateCode} Law
              </span>
            </div>

            {/* Configurable Base Principal */}
            <div className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] custom-geometry space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--text-muted)] font-mono">Base Principal Sum for Calculation:</span>
                <span className="font-mono font-bold text-[var(--text-main)]">${calcPrincipal.toLocaleString()}</span>
              </div>
              <input
                type="number"
                min="1"
                step="any"
                value={calcPrincipal}
                onChange={e => setCalcPrincipal(parseFloat(e.target.value) || 0)}
                className="input-geom w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono px-2.5 py-1.5 focus:border-[var(--accent-gold)]"
                placeholder="2500"
              />
            </div>

            <div className="space-y-3 text-xs">
              {/* Bad Faith Multiplier */}
              <div className="p-3 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[var(--text-main)]">Bad-Faith Statutory Penalty</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    +${(calcPrincipal * calcMultiplier).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-[var(--text-muted)]">Penalty Multiplier:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setCalcMultiplier(m);
                        }}
                        className={`px-2 py-0.5 text-xs font-mono font-bold custom-geometry border ${
                          calcMultiplier === m 
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                            : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {m}x
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-[var(--text-muted)]">
                  Under <strong className="text-slate-200">{currJurisdiction.securityDepositStatuteCitation}</strong>, bad-faith retention authorizes statutory damages up to {calcMultiplier}x the withheld principal.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    sound.playDocketStamp();
                    const penaltyAmt = calcPrincipal * calcMultiplier;
                    const newItem: DamageItem = {
                      id: `dmg_stat_${Date.now()}`,
                      description: `Statutory Bad-Faith Penalty (${calcMultiplier}x under ${currJurisdiction.securityDepositStatuteCitation})`,
                      amount: penaltyAmt,
                      category: 'statutory_penalty',
                      statutoryBasis: currJurisdiction.securityDepositStatuteCitation
                    };
                    updateActiveCase(prev => ({
                      ...prev,
                      claimEvaluation: {
                        ...prev.claimEvaluation,
                        damages: [...prev.claimEvaluation.damages, newItem]
                      }
                    }));
                  }}
                  className="w-full py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs card-geom transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Apply ${ (calcPrincipal * calcMultiplier).toLocaleString() } ({calcMultiplier}x Penalty) to Ledger
                </button>
              </div>

              {/* Prejudgment Interest with Live Elapsed Days */}
              <div className="p-3 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[var(--text-main)]">Daily Prejudgment Interest</span>
                  <span className="font-mono text-amber-400 font-bold">
                    +${(Math.round(((calcPrincipal * ((currJurisdiction.statutoryInterestRatePercent || 10) / 100) * (calcDaysElapsed / 365.25))) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-[var(--text-muted)]">Days Elapsed Since Breach:</span>
                    <span className="text-[var(--accent-gold)] font-bold">{calcDaysElapsed} Days (${((calcPrincipal * ((currJurisdiction.statutoryInterestRatePercent || 10) / 100)) / 365.25).toFixed(2)}/day)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="365"
                    value={calcDaysElapsed}
                    onChange={e => setCalcDaysElapsed(parseInt(e.target.value) || 1)}
                    className="w-full accent-amber-400"
                  />
                </div>

                <p className="text-[11px] text-[var(--text-muted)]">
                  Under <strong className="text-slate-200">{currJurisdiction.interestStatuteCitation || 'State Law'}</strong>, interest accrues at <strong className="text-amber-400">{currJurisdiction.statutoryInterestRatePercent || 10.0}%/year</strong> from breach date to judgment entry.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    sound.playDocketStamp();
                    const rate = (currJurisdiction.statutoryInterestRatePercent || 10.0) / 100;
                    const accruedInterest = Math.round((calcPrincipal * rate * (calcDaysElapsed / 365.25)) * 100) / 100;
                    const newItem: DamageItem = {
                      id: `dmg_int_${Date.now()}`,
                      description: `Accrued Prejudgment Interest (${currJurisdiction.statutoryInterestRatePercent || 10}% for ${calcDaysElapsed} days under ${currJurisdiction.interestStatuteCitation || 'Code'})`,
                      amount: accruedInterest > 0 ? accruedInterest : 125,
                      category: 'interest',
                      statutoryBasis: currJurisdiction.interestStatuteCitation
                    };
                    updateActiveCase(prev => ({
                      ...prev,
                      claimEvaluation: {
                        ...prev.claimEvaluation,
                        damages: [...prev.claimEvaluation.damages, newItem]
                      }
                    }));
                  }}
                  className="w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold text-xs card-geom transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add ${Math.round(((calcPrincipal * ((currJurisdiction.statutoryInterestRatePercent || 10) / 100) * (calcDaysElapsed / 365.25))) * 100) / 100} Interest to Ledger
                </button>
              </div>

              {/* Court Filing Fee Schedule */}
              <div className="p-3 card-geom bg-black/20 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[var(--text-muted)]">Estimated Court Filing Fee:</span>
                  <span className="font-mono font-bold text-slate-200">
                    ${currJurisdiction.filingFeeEstimate ? `${currJurisdiction.filingFeeEstimate.min} - $${currJurisdiction.filingFeeEstimate.max}` : '$30 - $75'}
                  </span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)]">
                  <span className="text-sky-400 font-semibold">Fee Waiver Available: </span>
                  {currJurisdiction.filingFeeEstimate?.feeWaiverForm || 'Form FW-001 (Indigent Waiver)'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Nav to Pleading Builder */}
          <button
            onClick={() => setActiveWorkstation('pleading-builder')}
            className="card-geom w-full p-4 bg-gradient-to-r from-emerald-950/40 to-[var(--bg-card)] border border-emerald-500/30 flex items-center justify-between text-left group hover:border-emerald-500/60 transition-all"
          >
            <div>
              <div className="font-bold text-xs text-emerald-400">Claims Verified & Computed</div>
              <div className="text-[11px] text-[var(--text-muted)]">Proceed to generate 28-Line Court Pleading & Demand Letter</div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Add Custom Prima Facie Element Modal */}
      {showAddElementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-[var(--accent-gold)]" />
                <h3 className="font-serif font-bold text-lg text-[var(--text-main)]">Add Prima Facie Legal Element</h3>
              </div>
              <button
                onClick={() => setShowAddElementModal(false)}
                className="text-[var(--text-muted)] hover:text-white text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddCustomElement} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                  Element Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Failure to Mitigate / Unlawful Deduction"
                  value={newElemTitle}
                  onChange={e => setNewElemTitle(e.target.value)}
                  className="input-geom w-full p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                  Statutory Basis / Legal Standard
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cal. Civ. Code § 1950.5(e) / UCC § 2-714"
                  value={newElemStandard}
                  onChange={e => setNewElemStandard(e.target.value)}
                  className="input-geom w-full p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                  Legal Requirement Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the mandatory legal condition that Defendant breached..."
                  value={newElemDesc}
                  onChange={e => setNewElemDesc(e.target.value)}
                  className="input-geom w-full p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
                  Plaintiff Corroborating Evidence / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Reference specific photos, canceled checks, or emails..."
                  value={newElemNotes}
                  onChange={e => setNewElemNotes(e.target.value)}
                  className="input-geom w-full p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddElementModal(false)}
                  className="btn-geom px-4 py-2 text-xs text-[var(--text-muted)] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-geom px-5 py-2 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Element to Checklist</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
