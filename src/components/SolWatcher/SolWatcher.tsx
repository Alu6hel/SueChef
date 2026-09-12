import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { 
  Hourglass, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Download, 
  Bell, 
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SolDocketItem } from '../../types';
import { getJurisdiction } from '../../services/jurisdictions';
import { sound } from '../../services/soundEngine';
import { CalendarSyncService } from '../../services/calendarSync';

export const SolWatcher: React.FC = () => {
  const { activeCase, updateActiveCase } = useSueChef();
  const [newTitle, setNewTitle] = useState('');
  const [newTriggerDate, setNewTriggerDate] = useState('');
  const [newLimitYears, setNewLimitYears] = useState('4');
  const [calendarExported, setCalendarExported] = useState(false);

  const currJurisdiction = getJurisdiction(activeCase.state);

  const calculateDaysRemaining = (expirationDateStr: string): number => {
    const exp = new Date(expirationDateStr).getTime();
    const today = new Date().getTime();
    const diff = exp - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getUrgencyBadge = (days: number) => {
    if (days < 0) {
      return { label: 'EXPIRED', bg: 'bg-rose-950 border-rose-600 text-rose-300 animate-pulse' };
    }
    if (days < 30) {
      return { label: `CRITICAL: ${days} DAYS`, bg: 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse' };
    }
    if (days < 90) {
      return { label: `WARNING: ${days} DAYS`, bg: 'bg-amber-950/80 border-amber-500 text-amber-300' };
    }
    return { label: `SAFE: ${days} DAYS`, bg: 'bg-emerald-950/80 border-emerald-500 text-emerald-300' };
  };

  const handleToggleTolling = (itemId: string, reason: string, daysToAdd: number) => {
    sound.playClick();
    updateActiveCase(prev => {
      const updated: SolDocketItem[] = prev.solDocket.map(item => {
        if (item.id !== itemId) return item;
        const willBeTolled = !item.isTolled;
        const newTollingDays = willBeTolled ? daysToAdd : 0;
        
        // Recalculate expiration date
        const origDate = new Date(item.triggerDate);
        const totalDays = (item.statutoryLimitYears * 365) + newTollingDays;
        const newExpDate = new Date(origDate.getTime() + totalDays * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0];
        
        const daysRem = calculateDaysRemaining(newExpDate);
        const urgency: 'safe' | 'warning' | 'critical' | 'expired' = 
          daysRem < 0 ? 'expired' : daysRem < 30 ? 'critical' : daysRem < 90 ? 'warning' : 'safe';

        return {
          ...item,
          isTolled: willBeTolled,
          tollingDays: newTollingDays,
          expirationDate: newExpDate,
          daysRemaining: daysRem,
          urgencyLevel: urgency,
          tollingNotes: willBeTolled ? [reason] : ['No tolling factors applied.']
        };
      });
      return { ...prev, solDocket: updated };
    });
  };

  const handleExportIcs = (item: SolDocketItem) => {
    sound.playDocketStamp();
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SueChef//Legal SOL Watcher//EN',
      'BEGIN:VEVENT',
      `UID:${item.id}@suechef.local`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${item.expirationDate.replace(/-/g, '')}`,
      `SUMMARY:⚖️ LEGAL DEADLINE: ${item.title}`,
      `DESCRIPTION:Critical filing deadline under ${currJurisdiction.stateName} law. Days remaining: ${item.daysRemaining}. Managed via SueChef.`,
      'PRIORITY:1',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${item.title.replace(/\s+/g, '_')}_deadline.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 card-geom bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Hourglass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[var(--text-main)]">
              Statute of Limitations Watcher
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Multi-Jurisdictional Statutory Deadlines, Accrual Triggers & Tolling Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const res = CalendarSyncService.exportDocketToCalendar(activeCase);
              if (res.success) {
                setCalendarExported(true);
                setTimeout(() => setCalendarExported(false), 3000);
              }
            }}
            className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-emerald-500 text-emerald-400 hover:bg-[var(--bg-hover)] transition-all shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{calendarExported ? '✓ Added to Calendar (.ics)' : '📅 Add Deadlines (.ics)'}</span>
          </button>

          <button
            onClick={() => {
              sound.playWarningBell();
            }}
            className="btn-geom flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Audio Warning</span>
          </button>
        </div>
      </div>

      {/* Grid: Active Docket Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeCase.solDocket.map(item => {
          const badge = getUrgencyBadge(item.daysRemaining);
          return (
            <div
              key={item.id}
              className={`card-geom bg-[var(--bg-card)] border p-5 space-y-4 shadow-lg transition-all ${
                item.daysRemaining < 30 ? 'border-rose-500/60' : 'border-[var(--border-color)]'
              }`}
            >
              {/* Card Header & Urgency Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                    {currJurisdiction.stateName} Civil Procedure
                  </span>
                  <h3 className="font-serif font-bold text-base text-[var(--text-main)] mt-0.5">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-1 card-geom border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      updateActiveCase(prev => ({
                        ...prev,
                        solDocket: prev.solDocket.filter(d => d.id !== item.id)
                      }));
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Remove Deadline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2.5">
                  <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[var(--accent-gold)]" />
                    TRIGGER / ACCRUAL DATE
                  </div>
                  <div className="font-mono font-bold text-[var(--text-main)] mt-1">
                    {item.triggerDate}
                  </div>
                </div>

                <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2.5">
                  <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-rose-400" />
                    FINAL FILING EXPIRATION
                  </div>
                  <div className="font-mono font-bold text-rose-400 mt-1">
                    {item.expirationDate}
                  </div>
                </div>
              </div>

              {/* Tolling Factor Interactive Controls */}
              <div className="space-y-2 card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Statutory Tolling Factor
                  </span>
                  <span className="text-[10px] font-mono text-[var(--accent-gold)] font-semibold">
                    {item.isTolled ? `+${item.tollingDays} Days Tolled` : 'Standard Clock'}
                  </span>
                </div>

                <p className="text-[11px] text-[var(--text-muted)]">
                  {item.tollingNotes[0]}
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggleTolling(
                      item.id,
                      'Tolled under Cal. Code Civ. Proc. § 351: Defendant was outside the jurisdiction for 90 days.',
                      90
                    )}
                    className={`btn-geom px-2.5 py-1 text-[11px] font-mono border transition-all ${
                      item.isTolled
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {item.isTolled ? '✓ Tolling Active (90d)' : '+ Apply Defendant Out-of-State Tolling (90d)'}
                  </button>
                </div>
              </div>

              {/* Calendar Export & Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Statute Period: {item.statutoryLimitYears} Years
                </span>
                <button
                  onClick={() => handleExportIcs(item)}
                  className="btn-geom flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-slate-950 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export .iCal Docket
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom SOL Deadline Form */}
      <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-4">
        <h3 className="font-serif font-bold text-base text-[var(--text-main)] flex items-center gap-2">
          <Plus className="w-4 h-4 text-[var(--accent-gold)]" />
          Track New Statutory Deadline or Government Claim Notice
        </h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newTitle.trim() || !newTriggerDate) return;
            sound.playGavelStrike();

            const years = parseFloat(newLimitYears) || 3;
            const trigDate = new Date(newTriggerDate);
            const expDate = new Date(trigDate.getTime() + years * 365.25 * 24 * 60 * 60 * 1000)
              .toISOString().split('T')[0];
            const daysRem = calculateDaysRemaining(expDate);

            const newItem: SolDocketItem = {
              id: `sol_${Date.now()}`,
              title: newTitle.trim(),
              category: activeCase.claimEvaluation.category,
              triggerDate: newTriggerDate,
              statutoryLimitYears: years,
              expirationDate: expDate,
              tollingDays: 0,
              tollingNotes: ['Standard statutory computation.'],
              daysRemaining: daysRem,
              urgencyLevel: daysRem < 0 ? 'expired' : daysRem < 30 ? 'critical' : daysRem < 90 ? 'warning' : 'safe',
              isTolled: false
            };

            updateActiveCase(prev => ({
              ...prev,
              solDocket: [...prev.solDocket, newItem]
            }));

            setNewTitle('');
            setNewTriggerDate('');
          }}
          className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
        >
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Deadline Title / Cause</label>
            <input
              type="text"
              required
              placeholder="e.g. Breach of Written Contract or Government Tort Claim"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="input-geom w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs text-[var(--text-main)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Incident / Trigger Date</label>
            <input
              type="date"
              required
              value={newTriggerDate}
              onChange={e => setNewTriggerDate(e.target.value)}
              className="input-geom w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs text-[var(--text-main)] font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Statute Period (Years)</label>
            <select
              value={newLimitYears}
              onChange={e => setNewLimitYears(e.target.value)}
              className="input-geom w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 text-xs text-[var(--text-main)] font-mono"
            >
              <option value="0.5">6 Months (Gov Tort Claim)</option>
              <option value="1">1 Year (Defamation / Slander)</option>
              <option value="2">2 Years (Personal Injury / Oral K)</option>
              <option value="3">3 Years (Property Damage / Fraud)</option>
              <option value="4">4 Years (Written Contract)</option>
              <option value="6">6 Years (NY Contract)</option>
            </select>
          </div>

          <div className="sm:col-span-4 flex justify-end pt-1">
            <button
              type="submit"
              className="btn-geom px-4 py-2 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Deadline to Docket</span>
            </button>
          </div>
        </form>
      </div>

      {/* Educational Guide on Civil Limitation Traps */}
      <div className="card-geom bg-[var(--bg-card)] border border-[var(--border-color)] p-5 space-y-3">
        <h3 className="font-serif font-bold text-base text-[var(--text-main)] flex items-center gap-2">
          <Info className="w-4 h-4 text-[var(--accent-gold)]" />
          The Golden Rule of Civil Procedure: Time Kills Claims
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          The Statute of Limitations is an absolute bar to recovery. If you file even 1 day after the deadline passes, the judge is required by law to dismiss your lawsuit with prejudice upon the defendant's motion, regardless of how strong your underlying evidence is.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 space-y-1">
            <span className="font-bold text-[var(--text-main)]">1. Written Contracts</span>
            <p className="text-[11px] text-[var(--text-muted)]">
              {currJurisdiction.stateName} allows {currJurisdiction.solWrittenContractYears} years from the date of breach.
            </p>
          </div>
          <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 space-y-1">
            <span className="font-bold text-[var(--text-main)]">2. Oral Agreements</span>
            <p className="text-[11px] text-[var(--text-muted)]">
              {currJurisdiction.stateName} allows {currJurisdiction.solOralContractYears} years from the breach.
            </p>
          </div>
          <div className="card-geom bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 space-y-1">
            <span className="font-bold text-[var(--text-main)]">3. Property Damage</span>
            <p className="text-[11px] text-[var(--text-muted)]">
              {currJurisdiction.stateName} allows {currJurisdiction.solPropertyDamageYears} years from the incident.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
