import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { DISPUTE_BLUEPRINTS } from '../../services/disputeTemplates';
import { sound } from '../../services/soundEngine';
import { 
  Briefcase, 
  Plus, 
  FolderCheck, 
  Sparkles, 
  X, 
  Scale, 
  MapPin, 
  DollarSign,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const CaseManagerModal: React.FC = () => {
  const { 
    isCaseManagerOpen, 
    setIsCaseManagerOpen, 
    activeCase, 
    loadBlueprint, 
    createNewCase 
  } = useSueChef();

  const [activeTab, setActiveTab] = useState<'blueprints' | 'new'>('blueprints');
  const [newTitle, setNewTitle] = useState('');
  const [newState, setNewState] = useState('CA');
  const [newCategory, setNewCategory] = useState('security_deposit');

  if (!isCaseManagerOpen) return null;

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    sound.playGavelStrike();
    createNewCase(newTitle.trim(), newState, newCategory);
    setNewTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card border-2 border-border custom-geometry max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary custom-geometry">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-foreground">Dispute Matter Switcher &amp; Blueprint Vault</h2>
              <p className="text-xs text-muted-foreground font-mono">
                Active Matter: <span className="text-primary font-semibold">{activeCase.title}</span> ({activeCase.caseNumber})
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); setIsCaseManagerOpen(false); }}
            className="p-1.5 text-muted-foreground hover:text-foreground custom-geometry hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-border px-5 pt-3 gap-2 bg-muted/20">
          <button
            onClick={() => { sound.playClick(); setActiveTab('blueprints'); }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold custom-geometry transition-all ${
              activeTab === 'blueprints'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>6 Real-World Dispute Blueprints</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('new'); }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold custom-geometry transition-all ${
              activeTab === 'new'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Matter from Scratch</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'blueprints' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DISPUTE_BLUEPRINTS.map((bp) => {
                const isActive = activeCase.id === bp.caseData.id;
                return (
                  <div
                    key={bp.id}
                    className={`p-4 border custom-geometry transition-all flex flex-col justify-between space-y-3 ${
                      isActive
                        ? 'bg-primary/10 border-primary shadow-md'
                        : 'bg-card/70 border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-primary/20 text-primary border border-primary/30 custom-geometry">
                          {bp.state} JURISDICTION
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {bp.damagesSummary}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-foreground font-serif leading-snug">
                        {bp.title}
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {bp.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Estimated Claim: ${bp.estimatedTotal.toLocaleString()}
                      </span>

                      <button
                        onClick={() => loadBlueprint(bp.id)}
                        disabled={isActive}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold custom-geometry transition-all ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        <span>{isActive ? 'Active Workspace' : 'Load Blueprint'}</span>
                        {!isActive && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'new' && (
            <form onSubmit={handleCreateCustom} className="max-w-xl mx-auto space-y-4 py-4">
              <div>
                <label className="text-xs font-mono uppercase text-muted-foreground">Dispute Matter Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Johnson v. Bayview Realty LLC"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-input/50 border border-border p-2.5 text-xs focus:outline-none focus:border-primary mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground">Jurisdiction State</label>
                  <select
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full bg-input/50 border border-border p-2.5 text-xs focus:outline-none focus:border-primary mt-1"
                  >
                    <option value="CA">California (CA)</option>
                    <option value="NY">New York (NY)</option>
                    <option value="TX">Texas (TX)</option>
                    <option value="FL">Florida (FL)</option>
                    <option value="IL">Illinois (IL)</option>
                    <option value="WA">Washington (WA)</option>
                    <option value="NV">Nevada (NV)</option>
                    <option value="MA">Massachusetts (MA)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-muted-foreground">Dispute Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-input/50 border border-border p-2.5 text-xs focus:outline-none focus:border-primary mt-1"
                  >
                    <option value="security_deposit">Security Deposit Withheld</option>
                    <option value="contractor_dispute">Contractor Breach / Defects</option>
                    <option value="freelance_unpaid">Freelance Unpaid Invoices</option>
                    <option value="auto_accident">Auto Collision / Property Damage</option>
                    <option value="consumer_fraud">Consumer Fraud / FDUTPA</option>
                    <option value="wage_theft">Wage Theft / Unpaid Overtime</option>
                    <option value="breach_of_contract">General Breach of Contract</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-muted/40 border border-border text-xs text-muted-foreground custom-geometry">
                Creating a new matter initializes a clean case bundle with custom pleading templates, evidence locker, statute of limitations docket, and discovery studio.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all custom-geometry"
              >
                Initialize New Case Matter
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
