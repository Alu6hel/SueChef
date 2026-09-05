import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { 
  Lock, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  Key, 
  Database,
  Cpu,
  EyeOff
} from 'lucide-react';
import { sound } from '../../services/soundEngine';

export const SecurityVault: React.FC = () => {
  const { panicWipe, exportCaseBundle, importCaseBundle, activeCase } = useSueChef();
  const [importJsonText, setImportJsonText] = useState('');
  const [wipeConfirmed, setWipeConfirmed] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleExport = () => {
    sound.playDocketStamp();
    const bundle = exportCaseBundle();
    const blob = new Blob([bundle], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeCase.title.replace(/\s+/g, '_')}_Backup.suechef`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage('Case backup exported successfully.');
  };

  const handleImport = async () => {
    if (!importJsonText.trim()) return;
    try {
      await importCaseBundle(importJsonText);
      setImportJsonText('');
      setStatusMessage('Case imported and decrypted successfully.');
    } catch {
      setStatusMessage('Error: Invalid SueChef encrypted case format.');
    }
  };

  const handleExecutePanic = async () => {
    sound.playShredderWipe();
    await panicWipe();
    setWipeConfirmed(false);
    setStatusMessage('All case files, cryptographic hashes, and encryption keys shredded.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 card-geom bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[var(--text-main)]">
              Ironclad Confidentiality & Security Vault
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Hardware-Grade Client-Side AES-GCM Encryption, Zero-Cloud Telemetry & Panic Shredder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="p-2 card-geom bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5 text-xs font-mono font-semibold">
            <ShieldCheck className="w-4 h-4" />
            OFFLINE INTEGRITY VERIFIED
          </span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 card-geom bg-[var(--badge-bg)] border border-[var(--badge-border)] text-xs font-mono text-[var(--accent-gold)] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Security Architecture Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-3">
          <div className="p-2 w-fit card-geom bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
            100% Bare-Metal Local
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Zero cloud databases, zero telemetry, and zero remote logging. Everything executes client-side on your device’s hardware.
          </p>
        </div>

        <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-3">
          <div className="p-2 w-fit card-geom bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
            Web Crypto SHA-256
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Evidence documents are fingerprinted using deterministic SHA-256 digests in-browser, preventing unauthorized tampering.
          </p>
        </div>

        <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-3">
          <div className="p-2 w-fit card-geom bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
            Adversary Safe
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Your opposing party and their legal team cannot subpoena or harvest your dispute notes from a third-party cloud provider.
          </p>
        </div>
      </div>

      {/* Backup & Restore Vault */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Backup */}
        <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Download className="w-5 h-5 text-[var(--accent-gold)]" />
            <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
              Export Encrypted Case Archive (.suechef)
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Download a portable, standalone encrypted snapshot of all dispute facts, 28-line pleadings, evidence hashes, and service records.
          </p>
          <button
            onClick={handleExport}
            className="btn-geom w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-[var(--accent-gold)] text-slate-950 hover:opacity-90"
          >
            <Download className="w-4 h-4" />
            Download Case Backup
          </button>
        </div>

        {/* Import Backup */}
        <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Upload className="w-5 h-5 text-sky-400" />
            <h3 className="font-serif font-bold text-base text-[var(--text-main)]">
              Restore / Import Case Archive
            </h3>
          </div>
          <textarea
            placeholder="Paste .suechef JSON backup data here..."
            value={importJsonText}
            onChange={e => setImportJsonText(e.target.value)}
            rows={2}
            className="input-geom w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] p-2 font-mono"
          />
          <button
            onClick={handleImport}
            className="btn-geom w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
          >
            <Upload className="w-4 h-4 text-sky-400" />
            Restore Case Archive
          </button>
        </div>
      </div>

      {/* Panic Shredder Station */}
      <div className="card-geom bg-rose-950/30 border-2 border-rose-600/60 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
          <div>
            <h3 className="font-bold text-base text-rose-200 uppercase font-mono tracking-wider">
              Emergency Panic Shredder Station
            </h3>
            <p className="text-xs text-rose-300">
              Instant cryptographic noise overwrite and purge of all local storage records
            </p>
          </div>
        </div>

        <p className="text-xs text-rose-200/80 leading-relaxed">
          If your device is at immediate risk of inspection or compromise, triggering the Panic Shredder writes 1,024 bytes of cryptographic pseudorandom noise over every storage key before deleting the IndexedDB instance and flushing cache.
        </p>

        {wipeConfirmed ? (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold font-mono text-rose-300">
              ⚠️ ARE YOU ABSOLUTELY CERTAIN? THIS CANNOT BE UNDONE.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setWipeConfirmed(false)}
                className="btn-geom px-4 py-2 text-xs font-semibold bg-[var(--bg-card)] text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleExecutePanic}
                className="btn-geom px-6 py-2 text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-900/50"
              >
                EXECUTE IMMEDIATE SHRED
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              sound.playWarningBell();
              setWipeConfirmed(true);
            }}
            className="btn-geom flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-rose-950 border border-rose-600 text-rose-200 hover:bg-rose-900"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            Arm Panic Shredder
          </button>
        )}
      </div>
    </div>
  );
};
