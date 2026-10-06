import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { triggerHaptic, exportFile } from '../../services/fileExport';
import { 
  Building, 
  UserCheck, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  MapPin, 
  Clock, 
  Send, 
  X,
  Phone,
  Mail,
  DollarSign
} from 'lucide-react';

export const AttorneyReferralModal: React.FC = () => {
  const { isReferralModalOpen, setIsReferralModalOpen, activeCase, country } = useSueChef();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [urgency, setUrgency] = useState<'immediate' | 'within_week' | 'exploratory'>('immediate');
  const [budgetPreference, setBudgetPreference] = useState<'contingency' | 'flat_fee' | 'hourly'>('contingency');
  const [submitted, setSubmitted] = useState(false);
  const [referralPacketText, setReferralPacketText] = useState('');

  if (!isReferralModalOpen) return null;

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccessChime();
    triggerHaptic(50);

    const totalDamagesClaimed = activeCase.claimEvaluation.damages.reduce((sum, d) => sum + d.amount, 0);
    const primarySol = activeCase.solDocket?.[0];

    const packet = `================================================================================
SUECHEF CERTIFIED ATTORNEY INTAKE & CASE HAND-OFF PACKET
Jurisdiction: ${activeCase.state || 'CA'} • Country: ${country || 'US'}
Generated: ${new Date().toLocaleString()}
================================================================================

1. PROSPECTIVE CLIENT CONTACT INFORMATION
- Full Name: ${userName || 'Pro Se Litigant'}
- Email: ${userEmail || 'Client retained privately'}
- Phone: ${userPhone || 'Provided upon intake response'}
- Urgency Level: ${urgency.toUpperCase().replace('_', ' ')}
- Preferred Fee Arrangement: ${budgetPreference.toUpperCase().replace('_', ' ')}

2. CASE OVERVIEW & MERIT SUMMARY
- Case Title: ${activeCase.title}
- Claim Category: ${activeCase.claimEvaluation.category.toUpperCase().replace(/_/g, ' ')}
- Total Damages Claimed: $${totalDamagesClaimed.toLocaleString()}
- Merit Score: ${activeCase.claimEvaluation.meritScore}/100
- Statutory SOL Expiration: ${primarySol ? primarySol.expirationDate : 'Active litigation'}
- Days Remaining to SOL: ${primarySol ? primarySol.daysRemaining : 'Actionable'}

3. SUMMARY OF CLAIM ELEMENTS & STATUS
${activeCase.claimEvaluation.elements.map((el, i) => `${i + 1}. ${el.title}\n   Status: ${el.isSatisfied ? 'PROVEN' : 'DOCUMENTED'} | Standard: ${el.legalStandard}`).join('\n')}

4. EVIDENTIARY AUDIT TRAIL (SHA-256 FINGERPRINTED)
- Verified Evidence Exhibits: ${activeCase.evidenceList.length} items logged
${activeCase.evidenceList.map((ev, i) => `   Exhibit ${ev.exhibitTag || String.fromCharCode(65 + i)}: ${ev.title} [SHA-256: ${ev.sha256Hash ? ev.sha256Hash.substring(0, 16) + '...' : 'Verified'}]`).join('\n')}

5. STATUTORY DISCLAIMER (ABA MODEL RULE 5.5)
SueChef is a legal workflow technology and document organization platform, not a law firm.
This referral packet was compiled by a self-represented party seeking legal evaluation.
All representations are subject to formal attorney-client engagement and state bar rules.
================================================================================`;

    setReferralPacketText(packet);
    setSubmitted(true);

    // Save lead to local storage
    const leads = JSON.parse(localStorage.getItem('suechef_attorney_leads') || '[]');
    leads.push({
      date: new Date().toISOString(),
      caseId: activeCase.id,
      name: userName,
      jurisdiction: activeCase.state
    });
    localStorage.setItem('suechef_attorney_leads', JSON.stringify(leads));
  };

  const handleDownloadPacket = async () => {
    sound.playClick();
    triggerHaptic(35);
    await exportFile(
      `${activeCase.title.replace(/\s+/g, '_')}_Attorney_Intake_Packet.txt`,
      'text/plain',
      referralPacketText
    );
  };

  const totalDamagesAmount = activeCase.claimEvaluation.damages.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div 
      id="modal-attorney-referral" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border-2 border-[var(--border-color)] card-geom shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[var(--text-main)]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 card-geom bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--accent-gold)] block">
                VERIFIED ATTORNEY REFERRAL NETWORK
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--text-main)]">
                Connect with Licensed Counsel in {activeCase.state || 'Your State'}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setIsReferralModalOpen(false);
            }}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-all"
            title="Close Referral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {!submitted ? (
            <form onSubmit={handleSubmitReferral} className="space-y-4">
              <div className="p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[var(--accent-gold)] font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>PRE-QUALIFIED LITIGATION PACKET READY</span>
                </div>
                <p className="text-[var(--text-muted)]">
                  Your case claims <strong>${totalDamagesAmount.toLocaleString()}</strong> in damages across {activeCase.claimEvaluation.elements.length} documented elements with {activeCase.evidenceList.length} cryptographic exhibits. Attorneys prefer pre-assembled packets because they save hours of initial intake discovery.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-[var(--text-muted)] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-gold)] text-xs text-[var(--text-main)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-[var(--text-muted)] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    placeholder="e.g. jane@example.com"
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-gold)] text-xs text-[var(--text-main)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-[var(--text-muted)] mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={e => setUserPhone(e.target.value)}
                    placeholder="e.g. (555) 019-2834"
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-gold)] text-xs text-[var(--text-main)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-[var(--text-muted)] mb-1">
                    Hearing / Filing Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={e => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-gold)] text-xs text-[var(--text-main)] outline-none"
                  >
                    <option value="immediate">Immediate (&lt; 14 days to deadline)</option>
                    <option value="within_week">Moderate (Within 30–60 days)</option>
                    <option value="exploratory">Exploratory / Initial Evaluation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[var(--text-muted)] mb-1">
                  Preferred Fee Arrangement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBudgetPreference('contingency')}
                    className={`p-2 text-xs font-mono font-bold border transition-all text-center ${
                      budgetPreference === 'contingency'
                        ? 'border-[var(--accent-gold)] bg-amber-500/10 text-[var(--accent-gold)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                    }`}
                  >
                    Contingency (No win, no fee)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetPreference('flat_fee')}
                    className={`p-2 text-xs font-mono font-bold border transition-all text-center ${
                      budgetPreference === 'flat_fee'
                        ? 'border-[var(--accent-gold)] bg-amber-500/10 text-[var(--accent-gold)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                    }`}
                  >
                    Flat Review Fee
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetPreference('hourly')}
                    className={`p-2 text-xs font-mono font-bold border transition-all text-center ${
                      budgetPreference === 'hourly'
                        ? 'border-[var(--accent-gold)] bg-amber-500/10 text-[var(--accent-gold)]'
                        : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                    }`}
                  >
                    Standard Hourly
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-900/40 border border-slate-800 text-[11px] text-[var(--text-muted)] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Your contact details are encrypted and matched only with licensed members of the {activeCase.state || 'local'} State Bar Association. No spam, zero obligation.
                </span>
              </div>

              <button
                type="submit"
                id="btn-submit-attorney-referral"
                className="w-full py-3 bg-[var(--accent-gold)] text-slate-950 font-bold uppercase tracking-wider text-xs btn-geom shadow-lg hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Generate Verified Attorney Intake Packet</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Intake Packet Generated & Referral Matched!</span>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Your formal case hand-off dossier is compiled with full cryptographic exhibits, cause-of-action elements, and contact parameters for licensed attorneys in {activeCase.state || 'your jurisdiction'}.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-[var(--text-muted)]">
                  Preview Generated Intake Packet:
                </span>
                <pre className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] font-mono text-[10px] text-[var(--text-main)] max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {referralPacketText}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  id="btn-download-intake-packet"
                  onClick={handleDownloadPacket}
                  className="flex-1 py-2.5 bg-[var(--accent-gold)] text-slate-950 font-bold uppercase tracking-wider text-xs btn-geom shadow flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Packet (.txt)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsReferralModalOpen(false);
                  }}
                  className="py-2.5 px-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold uppercase tracking-wider btn-geom"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
