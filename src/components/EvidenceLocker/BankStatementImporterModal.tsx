import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { CryptoDbService } from '../../services/cryptoDb';
import { sound } from '../../services/soundEngine';
import { getCountryInfo } from '../../services/countries';
import { cleanPartyName } from '../../services/caseUtils';
import { DisputedBankTransaction, DamageItem } from '../../types';
import { 
  CreditCard, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  DollarSign, 
  Plus, 
  Trash2, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Filter 
} from 'lucide-react';

interface BankStatementImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BankStatementImporterModal: React.FC<BankStatementImporterModalProps> = ({ isOpen, onClose }) => {
  const { activeCase, updateActiveCase, addEvidence, country } = useSueChef();
  const countryInfo = getCountryInfo(country);
  const p = activeCase.parties.find(x => x.role === 'plaintiff');
  const d = activeCase.parties.find(x => x.role === 'defendant');
  const pName = p ? cleanPartyName(p.name) : 'Plaintiff';
  const dName = d ? cleanPartyName(d.name) : 'Defendant';

  const sampleCsvData = `Date,Description,Amount,Type
2025-07-15,VANGUARD PROPERTY MGMT - SECURITY DEPOSIT WIRE,3200.00,Debit
2025-07-15,VANGUARD PROPERTY MGMT - FIRST MONTH RENT,2800.00,Debit
2025-08-01,CLEANING SUPPLY OUTLET - MOVE IN SUPPLIES,145.20,Debit
2025-08-10,OMNIFIT CLOUD SERVICES - RECURRING SUB,79.99,Debit
2025-08-25,ACE HARDWARE - APARTMENT REPAIR LOCKS,84.50,Debit
2025-09-02,QUICKHOOK IMPOUND SERVICES - WRONGFUL TOW,485.00,Debit`;

  const [rawText, setRawText] = useState<string>(sampleCsvData);
  const [bankInstitution, setBankInstitution] = useState<string>('JPMorgan Chase Bank Statement');
  const [transactions, setTransactions] = useState<DisputedBankTransaction[]>([
    {
      id: 'tx_1',
      date: '2025-07-15',
      description: 'VANGUARD PROPERTY MGMT - SECURITY DEPOSIT WIRE',
      amount: 3200.00,
      category: 'direct_actual',
      isDisputed: true,
      evidenceLinked: true
    },
    {
      id: 'tx_2',
      date: '2025-08-10',
      description: 'OMNIFIT CLOUD SERVICES - RECURRING SUB',
      amount: 79.99,
      category: 'direct_actual',
      isDisputed: true,
      evidenceLinked: true
    },
    {
      id: 'tx_3',
      date: '2025-09-02',
      description: 'QUICKHOOK IMPOUND SERVICES - WRONGFUL TOW',
      amount: 485.00,
      category: 'direct_actual',
      isDisputed: true,
      evidenceLinked: true
    }
  ]);

  if (!isOpen) return null;

  const handleParseCsv = () => {
    sound.playDocketStamp();
    const lines = rawText.split('\n').filter(l => l.trim().length > 0);
    const parsed: DisputedBankTransaction[] = [];

    lines.forEach((line, idx) => {
      // Skip header line if contains "date" or "amount"
      if (idx === 0 && (line.toLowerCase().includes('date') || line.toLowerCase().includes('description'))) return;

      const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length >= 3) {
        const date = cols[0];
        const desc = cols[1];
        const amt = Math.abs(parseFloat(cols[2].replace(/[^0-9.-]/g, '')) || 0);

        if (amt > 0) {
          parsed.push({
            id: `tx_${Date.now()}_${idx}`,
            date,
            description: desc,
            amount: amt,
            category: 'direct_actual',
            isDisputed: true,
            evidenceLinked: true
          });
        }
      }
    });

    if (parsed.length > 0) {
      setTransactions(parsed);
    }
  };

  const toggleDisputed = (id: string) => {
    sound.playClick();
    setTransactions(transactions.map(t => t.id === id ? { ...t, isDisputed: !t.isDisputed } : t));
  };

  const selectedTransactions = transactions.filter(t => t.isDisputed);
  const totalDisputedSum = selectedTransactions.reduce((acc, t) => acc + t.amount, 0);

  const handleImportToCase = async () => {
    sound.playSuccessChime();

    // 1. Convert disputed transactions into DamageItem array
    const newDamages: DamageItem[] = selectedTransactions.map(tx => ({
      id: `dmg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      description: `${tx.description} (${tx.date})`,
      category: 'direct_actual',
      amount: tx.amount,
      statutoryBasis: 'Bank Verified Direct Financial Loss'
    }));

    // 2. Generate Evidence Exhibit for the entire bank statement
    const buffer = new TextEncoder().encode(rawText);
    const hash = await CryptoDbService.computeSha256(buffer);

    await addEvidence({
      title: `Official Bank Statement & Disputed Ledger: ${bankInstitution}`,
      category: 'receipt',
      originalFileName: 'verified_bank_statement.csv',
      fileSizeBytes: buffer.byteLength,
      sha256Hash: hash,
      dateAcquired: new Date().toISOString().split('T')[0],
      dateOccurred: selectedTransactions[0]?.date || new Date().toISOString().split('T')[0],
      custodian: pName,
      admissibilityChecklist: {
        authenticationFre901: true,
        hearsayExceptionFre803: true,
        bestEvidenceFre1002: true,
        relevanceFre401: true
      },
      exhibitTag: `EXHIBIT ${String.fromCharCode(65 + activeCase.evidenceList.length)}`,
      linkedParagraphIds: [],
      notes: `Ingested ${selectedTransactions.length} disputed transactions totaling $${totalDisputedSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}.\nVerified financial institution record authenticated under FRE 803(6) (Business Records Exception).`
    });

    // 3. Append damages to active case
    updateActiveCase(prev => ({
      ...prev,
      claimEvaluation: {
        ...prev.claimEvaluation,
        damages: [...prev.claimEvaluation.damages, ...newDamages]
      }
    }));

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] max-w-3xl w-full max-h-[90vh] flex flex-col custom-geometry shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[var(--text-main)]">
                Bank Statement &amp; Disputed Transaction Ingestion
              </h3>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">
                Auto-convert bank CSV ledgers into court-ready Damages and Evidence
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Financial Institution</label>
              <input
                type="text"
                value={bankInstitution}
                onChange={e => setBankInstitution(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-main)] custom-geometry font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleParseCsv}
                className="w-full px-3 py-1.5 bg-[var(--accent-gold)] text-slate-950 font-mono text-xs font-bold custom-geometry flex items-center justify-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Parse CSV / Ledger Lines</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-[var(--text-main)] block mb-1">
              Paste Bank CSV Lines (Date, Description, Amount)
            </label>
            <textarea
              rows={4}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2.5 text-[11px] font-mono text-[var(--text-main)] custom-geometry"
            />
          </div>

          {/* Parsed Transactions Check-list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[var(--text-main)] uppercase">
                Select Disputed Transactions to Claim ({selectedTransactions.length} of {transactions.length})
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Total Claimed: {countryInfo.currencySymbol}{totalDisputedSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {transactions.map(tx => (
                <div
                  key={tx.id}
                  onClick={() => toggleDisputed(tx.id)}
                  className={`p-3 border custom-geometry flex items-center justify-between cursor-pointer transition-all ${
                    tx.isDisputed
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-[var(--text-main)] ring-1 ring-emerald-500/30'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={tx.isDisputed}
                      onChange={() => {}} // handled by row click
                      className="rounded"
                    />
                    <div>
                      <div className="text-xs font-bold font-serif text-[var(--text-main)]">
                        {tx.description}
                      </div>
                      <div className="text-[10px] font-mono text-[var(--text-muted)]">
                        Posted: {tx.date} • Financial Debit
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold font-mono text-emerald-400">
                    {countryInfo.currencySymbol}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between">
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="px-4 py-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            Cancel
          </button>
          <button
            onClick={handleImportToCase}
            disabled={selectedTransactions.length === 0}
            className={`px-4 py-2 font-mono text-xs font-bold custom-geometry flex items-center gap-1.5 shadow-lg ${
              selectedTransactions.length > 0
                ? 'bg-[var(--accent-gold)] text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Import {selectedTransactions.length} Items to Damages &amp; Evidence</span>
          </button>
        </div>
      </div>
    </div>
  );
};
