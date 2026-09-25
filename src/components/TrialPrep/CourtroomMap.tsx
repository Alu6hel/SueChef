import React, { useState } from 'react';
import { Landmark, User, Gavel, FileText, AlertOctagon, CheckCircle2, Copy, Sparkles, Shield } from 'lucide-react';
import { COURTROOM_STATIONS, CourtroomStation } from '../../services/mockHearingEngine';
import { sound } from '../../services/soundEngine';

export const CourtroomMap: React.FC = () => {
  const [selectedStationId, setSelectedStationId] = useState<string>('bench');
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);

  const activeStation: CourtroomStation = COURTROOM_STATIONS.find(s => s.id === selectedStationId) || COURTROOM_STATIONS[0];

  const handleCopyPhrase = (phrase: string) => {
    sound.playClick();
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
    setTimeout(() => setCopiedPhrase(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-1 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 card-geom bg-amber-500/10 border border-amber-500/30 text-[var(--accent-gold)]">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-[var(--text-main)]">
              Courtroom Spatial Map &amp; Protocol Architecture
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Navigate the physical courtroom layout, master spatial etiquette, and avoid contempt sanctions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive 2D Spatial Layout (7 Cols) */}
        <div className="lg:col-span-7 card-geom bg-slate-950 border-2 border-[var(--border-color)] p-6 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="text-center pb-2 border-b border-white/10 font-mono text-[11px] uppercase tracking-widest text-[var(--accent-gold)]">
            COURTROOM SPATIAL TOPOLOGY • CLICK STATION TO INSPECT
          </div>

          {/* Spatial Grid */}
          <div className="space-y-3 pt-2">
            {/* Row 1: The Bench Area */}
            <div className="grid grid-cols-12 gap-3">
              <button
                onClick={() => { sound.playClick(); setSelectedStationId('clerk_reporter'); }}
                className={`col-span-3 p-3 card-geom border text-center transition-all ${
                  selectedStationId === 'clerk_reporter'
                    ? 'border-indigo-400 bg-indigo-950/50 shadow-lg scale-[1.02]'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/30 text-slate-300'
                }`}
              >
                <div className="text-lg">📋</div>
                <div className="text-[11px] font-bold mt-1">Clerk &amp; Reporter</div>
                <div className="text-[9px] font-mono text-slate-400">Official Docket</div>
              </button>

              <button
                onClick={() => { sound.playGavelStrike(); setSelectedStationId('bench'); }}
                className={`col-span-6 p-4 card-geom border-2 text-center transition-all ${
                  selectedStationId === 'bench'
                    ? 'border-[var(--accent-gold)] bg-amber-950/50 shadow-xl scale-[1.02]'
                    : 'border-amber-500/30 bg-slate-900/90 hover:border-[var(--accent-gold)] text-amber-200'
                }`}
              >
                <Gavel className="w-6 h-6 mx-auto text-[var(--accent-gold)]" />
                <div className="font-serif font-bold text-sm text-[var(--accent-gold)] mt-1">
                  JUDGE'S BENCH
                </div>
                <div className="text-[10px] font-mono text-slate-300">Presiding Judicial Officer</div>
              </button>

              <button
                onClick={() => { sound.playClick(); setSelectedStationId('witness_box'); }}
                className={`col-span-3 p-3 card-geom border text-center transition-all ${
                  selectedStationId === 'witness_box'
                    ? 'border-purple-400 bg-purple-950/50 shadow-lg scale-[1.02]'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/30 text-slate-300'
                }`}
              >
                <div className="text-lg">🪑</div>
                <div className="text-[11px] font-bold mt-1">Witness Box</div>
                <div className="text-[9px] font-mono text-slate-400">Testimony Under Oath</div>
              </button>
            </div>

            {/* Row 2: Center Well & Podium */}
            <div className="py-2 flex justify-center">
              <button
                onClick={() => { sound.playClick(); setSelectedStationId('gallery'); }}
                className={`px-6 py-2.5 card-geom border text-center transition-all ${
                  selectedStationId === 'gallery'
                    ? 'border-sky-400 bg-sky-950/50 shadow-lg scale-[1.02]'
                    : 'border-white/10 bg-slate-900/80 hover:border-white/30 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-sky-300">Center Podium / Lectern</div>
                <div className="text-[9px] font-mono text-slate-400">The Well of the Court</div>
              </button>
            </div>

            {/* Row 3: Counsel Tables */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { sound.playClick(); setSelectedStationId('plaintiff_table'); }}
                className={`p-4 card-geom border-2 text-center transition-all ${
                  selectedStationId === 'plaintiff_table'
                    ? 'border-emerald-400 bg-emerald-950/50 shadow-xl scale-[1.02]'
                    : 'border-emerald-500/30 bg-slate-900/80 hover:border-emerald-400 text-emerald-200'
                }`}
              >
                <div className="text-xl">🧑‍💼</div>
                <div className="font-bold text-xs text-emerald-300 mt-1">Plaintiff Table (Pro Se)</div>
                <div className="text-[10px] font-mono text-slate-400">Your Designated Station</div>
                <div className="mt-2 text-[9px] font-mono bg-emerald-500/20 text-emerald-300 py-0.5 px-2 rounded-full inline-block">
                  Tabbed Evidence Binders Ready
                </div>
              </button>

              <button
                onClick={() => { sound.playClick(); setSelectedStationId('defense_table'); }}
                className={`p-4 card-geom border-2 text-center transition-all ${
                  selectedStationId === 'defense_table'
                    ? 'border-rose-400 bg-rose-950/50 shadow-xl scale-[1.02]'
                    : 'border-rose-500/30 bg-slate-900/80 hover:border-rose-400 text-rose-200'
                }`}
              >
                <div className="text-xl">💼</div>
                <div className="font-bold text-xs text-rose-300 mt-1">Defendant Table</div>
                <div className="text-[10px] font-mono text-slate-400">Opposing Party &amp; Attorney</div>
                <div className="mt-2 text-[9px] font-mono bg-rose-500/20 text-rose-300 py-0.5 px-2 rounded-full inline-block">
                  Never Face or Address Directly
                </div>
              </button>
            </div>

            {/* Row 4: The Bar & Public Gallery */}
            <div className="pt-3 border-t-2 border-dashed border-amber-500/40 text-center space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                ——— The Bar of the Court (Do Not Cross Until Called) ———
              </div>
              <div className="p-3 bg-slate-900/50 border border-white/5 card-geom text-[11px] text-slate-400 font-mono">
                Spectator Gallery &bull; Silence All Cellular Devices &bull; No Recording Without Written Order
              </div>
            </div>
          </div>
        </div>

        {/* Station Protocols Inspector (5 Cols) */}
        <div className="lg:col-span-5 card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-5 shadow-xl">
          <div className="border-b border-[var(--border-color)] pb-3">
            <div className="text-[10px] font-mono uppercase text-[var(--accent-gold)] font-bold">
              Station Etiquette Protocol
            </div>
            <h3 className="font-serif font-bold text-xl text-[var(--text-main)] mt-0.5">
              {activeStation.title}
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {activeStation.subtitle}
            </p>
          </div>

          {/* Mandatory Protocols */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mandatory Etiquette Rules:</span>
            </div>
            <ul className="space-y-2 text-xs text-[var(--text-main)]">
              {activeStation.rules.map((r, i) => (
                <li key={i} className="flex items-start gap-2 bg-[var(--bg-secondary)] p-2.5 card-geom border border-[var(--border-color)]">
                  <span className="text-emerald-400 font-bold shrink-0">&bull;</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cardinal Sins (Forbidden) */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase font-bold text-rose-400 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Cardinal Sins (Do NOT Do This):</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-300">
              {activeStation.forbidden.map((f, i) => (
                <li key={i} className="flex items-start gap-2 bg-rose-950/20 p-2.5 card-geom border border-rose-500/30">
                  <span className="text-rose-400 font-bold shrink-0">&times;</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Power Phrases */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase font-bold text-[var(--accent-gold)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>Courtroom Power Phrases (Click to Copy):</span>
            </div>
            <div className="space-y-1.5">
              {activeStation.powerPhrases.map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => handleCopyPhrase(phrase)}
                  className="w-full text-left p-2.5 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-gold)] text-xs font-mono text-[var(--text-main)] flex items-center justify-between gap-2 group transition-all"
                >
                  <span className="italic">{phrase}</span>
                  <span className="shrink-0 text-[10px] text-[var(--accent-gold)] font-bold">
                    {copiedPhrase === phrase ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
