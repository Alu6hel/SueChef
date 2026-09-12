import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { SOS_PORTALS, RegisteredAgentService, SosPortalInfo } from '../../services/registeredAgents';
import { sound } from '../../services/soundEngine';
import { 
  Building2, 
  ExternalLink, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  Info,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface RegisteredAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgent?: (agentName: string, agentAddress: string) => void;
}

export const RegisteredAgentModal: React.FC<RegisteredAgentModalProps> = ({
  isOpen,
  onClose,
  onSelectAgent
}) => {
  const { activeCase, updateParty } = useSueChef();
  const [selectedState, setSelectedState] = useState<string>(activeCase.state || 'CA');
  const [agentNameInput, setAgentNameInput] = useState<string>('');
  const [agentAddressInput, setAgentAddressInput] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const defendant = activeCase.parties.find(p => p.role === 'defendant') || activeCase.parties[1] || {
    id: 'd_1',
    name: 'Apex Property Holdings LLC'
  };

  const portalInfo: SosPortalInfo = RegisteredAgentService.getPortalForState(selectedState);
  const isCorporate = RegisteredAgentService.isCorporateEntity(defendant.name);

  const handleApplyAgent = (name: string, address: string) => {
    sound.playDocketStamp();
    if (onSelectAgent) {
      onSelectAgent(name, address);
    } else {
      updateParty(defendant.id, {
        registeredAgent: `${name} (${address})`
      });
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleCopyUrl = (url: string) => {
    sound.playClick();
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--bg-primary)] border-2 border-[var(--accent-gold)] w-full max-w-2xl max-h-[90vh] flex flex-col custom-geometry shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
                <span>Secretary of State Entity Directory</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/40 rounded uppercase font-bold">
                  Official 50-State
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Verify Registered Agent for Service of Process &bull; Prevent Dismissal for Bad Service
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Why this matters alert */}
          <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded custom-geometry space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono uppercase">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Mandatory Service Rule for Corporate Defendants</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If your opponent is an <strong>LLC, Corporation, or Management Company</strong> (such as <em>"{defendant.name}"</em>), serving a property manager, leasing office worker, or receptionist is <strong>legally invalid</strong>. The court will dismiss your case or vacate your default judgment upon appeal unless you serve the designated <strong>Registered Agent on file with the Secretary of State</strong>.
            </p>
          </div>

          {/* State Selector & Official Portal */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold">
                Select State Business Registry:
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] rounded font-mono outline-none focus:border-[var(--accent-gold)]"
              >
                {Object.keys(SOS_PORTALS).map((st) => (
                  <option key={st} value={st}>
                    {SOS_PORTALS[st].stateName} ({st})
                  </option>
                ))}
              </select>
            </div>

            {/* Portal Card */}
            <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded custom-geometry space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)]/60 pb-2.5">
                <div>
                  <div className="font-bold text-sm text-[var(--text-main)]">
                    {portalInfo.portalName}
                  </div>
                  <div className="text-xs text-[var(--accent-gold)] font-mono">
                    Statute: {portalInfo.statuteCitation}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(portalInfo.searchUrl)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded transition-all"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </button>
                  <a
                    href={portalInfo.searchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold font-mono bg-[var(--accent-gold)] text-slate-950 rounded hover:opacity-90 shadow-sm transition-all"
                  >
                    <span>Open State Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="text-xs text-[var(--text-muted)] leading-relaxed space-y-1">
                <span className="font-bold text-slate-300 font-mono uppercase text-[10px] block">
                  Search Instructions:
                </span>
                <p>{portalInfo.searchTips}</p>
              </div>

              {/* Common Commercial Registered Agents in this State */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-color)]/60">
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold block">
                  Common Commercial Registered Agents in {portalInfo.stateName} (1-Tap Auto-Fill):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {portalInfo.commonAgents.map((agent, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyAgent(agent.split('(')[0].trim(), agent.includes('(') ? agent.replace(/.*\((.*)\).*/, '$1') : `${portalInfo.stateName} Registered Office`)}
                      className="p-2.5 text-left bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] hover:bg-[var(--bg-hover)] rounded transition-all group"
                    >
                      <div className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--accent-gold)] flex items-center justify-between">
                        <span>{agent}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Manual Input Form */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono uppercase text-[var(--text-muted)] font-bold block">
              Or Enter Exact Registered Agent Name &amp; Address from State Search:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Agent Name (e.g., CT Corporation System / John Doe)"
                value={agentNameInput}
                onChange={(e) => setAgentNameInput(e.target.value)}
                className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-gold)] text-xs text-[var(--text-main)] rounded outline-none"
              />
              <input
                type="text"
                placeholder="Registered Office Address (e.g., 818 W 7th St, Los Angeles, CA)"
                value={agentAddressInput}
                onChange={(e) => setAgentAddressInput(e.target.value)}
                className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-gold)] text-xs text-[var(--text-main)] rounded outline-none"
              />
            </div>
            <button
              type="button"
              disabled={!agentNameInput.trim()}
              onClick={() => handleApplyAgent(agentNameInput.trim(), agentAddressInput.trim())}
              className="w-full py-2.5 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs font-mono uppercase rounded hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Registered Agent to Defendant File</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono text-center rounded animate-in fade-in">
              ✓ Registered Agent saved directly to {defendant.name}'s court file!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] rounded transition-all"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
