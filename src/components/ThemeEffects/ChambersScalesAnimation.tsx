import React, { useEffect, useRef, useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { 
  Scale, 
  Sparkles, 
  Plus, 
  Minus,
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  HelpCircle,
  Check,
  X,
  ExternalLink
} from 'lucide-react';

export const ChambersScalesAnimation: React.FC = () => {
  const { 
    theme, 
    activeCase, 
    updateActiveCase, 
    setActiveWorkstation, 
    totalDamages 
  } = useSueChef();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation weight offsets (in addition to real case counts)
  const [plaintiffSimOffset, setPlaintiffSimOffset] = useState(0);
  const [defendantSimOffset, setDefendantSimOffset] = useState(0);

  // UI state
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'plaintiff' | 'defendant'>('plaintiff');

  // Real Case Evidence items & satisfied claims
  const realExhibits = activeCase.evidenceList;
  const satisfiedElements = activeCase.claimEvaluation.elements.filter(e => e.isSatisfied);
  const realDefects = activeCase.claimEvaluation.defectWarnings;
  const unsatisfiedElements = activeCase.claimEvaluation.elements.filter(e => !e.isSatisfied);

  // Computed total weights (minimum 1 on plaintiff so scale has substance)
  const basePlaintiffWeight = Math.max(1, realExhibits.length + satisfiedElements.length);
  const baseDefendantWeight = Math.max(1, realDefects.length + unsatisfiedElements.length);

  const plaintiffWeight = Math.max(1, basePlaintiffWeight + plaintiffSimOffset);
  const defendantWeight = Math.max(1, baseDefendantWeight + defendantSimOffset);

  const totalWeight = plaintiffWeight + defendantWeight;
  const plaintiffPercent = Math.round((plaintiffWeight / totalWeight) * 100);
  const weightDiff = plaintiffWeight - defendantWeight;

  // Only render on dark themes
  if (theme === 'parchment-ink') return null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isMinimized) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;

    const setupDimensions = () => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : null;
      const w = Math.max(300, Math.floor(rect?.width || parent?.clientWidth || 340));
      const h = Math.max(190, Math.floor(rect?.height || parent?.clientHeight || 220));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      return { w, h };
    };

    let { w: width, h: height } = setupDimensions();

    const handleResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const dims = setupDimensions();
      width = dims.w;
      height = dims.h;
    };
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (canvas.parentElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(canvas.parentElement);
    }

    // Stardust Particles
    interface DustParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      pulseSpeed: number;
    }

    const dustParticles: DustParticle[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.15 - Math.random() * 0.25,
      size: 1 + Math.random() * 2,
      alpha: 0.15 + Math.random() * 0.5,
      pulseSpeed: 0.02 + Math.random() * 0.03
    }));

    // Physics State
    let currentTilt = 0;
    let tiltVelocity = 0;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.025;

      // Draw subtle atmospheric background glow
      const radial = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width * 0.6);
      if (theme === 'cyber-tribunal') {
        radial.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        radial.addColorStop(0, 'rgba(212, 175, 55, 0.09)');
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Floating Stardust Particles
      dustParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulse = (Math.sin(time * 2 + p.x) + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'cyber-tribunal'
          ? `rgba(52, 211, 153, ${p.alpha * pulse})`
          : `rgba(245, 208, 107, ${p.alpha * pulse})`;
        ctx.fill();
      });

      // Target Tilt: positive tilts left pan down (clockwise / counter-clockwise convention)
      // Left Pan = Plaintiff. When plaintiffWeight > defendantWeight, left pan sinks (tilt counter-clockwise)
      const weightDiff = plaintiffWeight - defendantWeight;
      const targetTilt = -Math.min(0.28, Math.max(-0.28, (weightDiff / Math.max(4, totalWeight)) * 0.32)) + Math.sin(time * 0.8) * 0.015;
      const spring = 0.055;
      const damping = 0.86;
      const force = (targetTilt - currentTilt) * spring;
      tiltVelocity = (tiltVelocity + force) * damping;
      currentTilt += tiltVelocity;

      const cx = width / 2;
      // Center scale comfortably in canvas without clipping the top finial
      const cy = height * 0.44;
      const beamLength = Math.min(240, Math.max(160, width * 0.68));

      const isCyber = theme === 'cyber-tribunal';
      const brassDark = isCyber ? '#065F46' : '#854D0E';
      const brassMid = isCyber ? '#059669' : '#B45309';
      const brassGold = isCyber ? '#10B981' : '#D4AF37';
      const brassBright = isCyber ? '#34D399' : '#FDE047';

      ctx.save();
      ctx.translate(cx, cy);

      // --- STAND PEDESTAL & CENTRAL COLUMN ---
      // Pedestal Base (tiered 3D ellipse)
      const baseGrad = ctx.createLinearGradient(-40, 75, 40, 75);
      baseGrad.addColorStop(0, brassDark);
      baseGrad.addColorStop(0.5, brassBright);
      baseGrad.addColorStop(1, brassDark);

      // Base shadow
      ctx.beginPath();
      ctx.ellipse(0, 78, 48, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fill();

      // Lower tiered pedestal
      ctx.beginPath();
      ctx.ellipse(0, 75, 42, 9, 0, 0, Math.PI * 2);
      ctx.fillStyle = baseGrad;
      ctx.fill();
      ctx.strokeStyle = brassBright;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Upper tier
      ctx.beginPath();
      ctx.ellipse(0, 70, 28, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = baseGrad;
      ctx.fill();

      // Central Pillar Column
      const pillarGrad = ctx.createLinearGradient(-6, 0, 6, 0);
      pillarGrad.addColorStop(0, brassDark);
      pillarGrad.addColorStop(0.3, brassBright);
      pillarGrad.addColorStop(0.7, brassGold);
      pillarGrad.addColorStop(1, brassDark);

      ctx.fillStyle = pillarGrad;
      ctx.fillRect(-5, -6, 10, 76);
      ctx.strokeStyle = brassGold;
      ctx.lineWidth = 1;
      ctx.strokeRect(-5, -6, 10, 76);

      // Column decorative rings
      [15, 45].forEach(ry => {
        ctx.beginPath();
        ctx.ellipse(0, ry, 9, 3.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = brassBright;
        ctx.fill();
      });

      // Central Calibrated Protractor Arc (-25° to +25°)
      ctx.beginPath();
      ctx.arc(0, -6, 20, -Math.PI * 0.75, -Math.PI * 0.25);
      ctx.strokeStyle = isCyber ? 'rgba(52, 211, 153, 0.4)' : 'rgba(212, 175, 55, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Degree Graduation Marks
      [-0.35, -0.18, 0, 0.18, 0.35].forEach(ang => {
        const a = -Math.PI / 2 + ang;
        const x1 = Math.cos(a) * 17;
        const y1 = -6 + Math.sin(a) * 17;
        const x2 = Math.cos(a) * (ang === 0 ? 22 : 20);
        const y2 = -6 + Math.sin(a) * (ang === 0 ? 22 : 20);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = ang === 0 ? brassBright : brassGold;
        ctx.lineWidth = ang === 0 ? 1.5 : 0.8;
        ctx.stroke();
      });

      // Central Pivot Dial / Gauge (Degree Pointer)
      ctx.beginPath();
      ctx.arc(0, -6, 13, 0, Math.PI * 2);
      ctx.fillStyle = isCyber ? '#022C22' : '#2A1805';
      ctx.fill();
      ctx.strokeStyle = brassGold;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pivot Pointer Needle (shows plumb-line angle)
      ctx.save();
      ctx.rotate(currentTilt * 1.5);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -14);
      ctx.strokeStyle = isCyber ? '#6EE7B7' : '#FEF08A';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Central Pivot Nut
      ctx.beginPath();
      ctx.arc(0, -6, 4, 0, Math.PI * 2);
      ctx.fillStyle = brassBright;
      ctx.fill();

      // Top Ornamental Finial (Spire on top of column)
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(-3, -22);
      ctx.lineTo(0, -28);
      ctx.lineTo(3, -22);
      ctx.closePath();
      ctx.fillStyle = brassGold;
      ctx.fill();
      ctx.strokeStyle = brassBright;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, -28, 3, 0, Math.PI * 2);
      ctx.fillStyle = brassBright;
      ctx.fill();

      // --- ROTATING HORIZONTAL BALANCE BEAM ---
      ctx.save();
      ctx.rotate(currentTilt);

      // Beam body with tapered ends
      const beamGrad = ctx.createLinearGradient(-beamLength / 2, 0, beamLength / 2, 0);
      beamGrad.addColorStop(0, brassMid);
      beamGrad.addColorStop(0.5, brassBright);
      beamGrad.addColorStop(1, brassMid);

      ctx.beginPath();
      ctx.moveTo(-beamLength / 2, -1.5);
      ctx.lineTo(beamLength / 2, -1.5);
      ctx.lineTo(beamLength / 2, 2.5);
      ctx.lineTo(-beamLength / 2, 2.5);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();
      ctx.strokeStyle = brassGold;
      ctx.lineWidth = 1;
      ctx.stroke();

      // End Hooks
      [-beamLength / 2, beamLength / 2].forEach(hx => {
        ctx.beginPath();
        ctx.arc(hx, 0, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = brassBright;
        ctx.fill();
        ctx.strokeStyle = brassDark;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      ctx.restore(); // Restore beam rotation

      // --- SUSPENDED WEIGH-PANS ---
      const chainLen = 52;

      // Coordinates of left hook (Plaintiff)
      const leftHookX = -Math.cos(currentTilt) * (beamLength / 2);
      const leftHookY = -Math.sin(currentTilt) * (beamLength / 2);

      // Coordinates of right hook (Defendant)
      const rightHookX = Math.cos(currentTilt) * (beamLength / 2);
      const rightHookY = Math.sin(currentTilt) * (beamLength / 2);

      // 1. LEFT PAN: PLAINTIFF'S EVIDENCE
      ctx.save();
      ctx.translate(leftHookX, leftHookY);

      // Dual Chains
      ctx.strokeStyle = brassGold;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-20, chainLen);
      ctx.moveTo(0, 0);
      ctx.lineTo(20, chainLen);
      ctx.stroke();

      // Chain decorative links
      [-10, 10].forEach(dx => {
        ctx.beginPath();
        ctx.arc(dx * 0.5, chainLen * 0.5, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = brassBright;
        ctx.fill();
      });

      // Pan Shadow
      ctx.beginPath();
      ctx.ellipse(0, chainLen + 10, 24, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fill();

      // Curved Brass Weighing Bowl
      const panGradP = ctx.createRadialGradient(0, chainLen + 6, 2, 0, chainLen + 6, 26);
      panGradP.addColorStop(0, isCyber ? 'rgba(52, 211, 153, 0.45)' : 'rgba(253, 224, 71, 0.45)');
      panGradP.addColorStop(0.7, isCyber ? 'rgba(5, 150, 105, 0.35)' : 'rgba(180, 83, 9, 0.35)');
      panGradP.addColorStop(1, isCyber ? 'rgba(6, 95, 70, 0.55)' : 'rgba(133, 77, 14, 0.55)');

      ctx.beginPath();
      ctx.ellipse(0, chainLen, 24, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = panGradP;
      ctx.fill();
      ctx.strokeStyle = brassBright;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Lower curved bowl hull
      ctx.beginPath();
      ctx.arc(0, chainLen, 24, 0, Math.PI);
      ctx.fillStyle = isCyber ? 'rgba(4, 120, 87, 0.4)' : 'rgba(161, 98, 7, 0.4)';
      ctx.fill();
      ctx.strokeStyle = brassGold;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Evidentiary Bullion Weights Stacked inside Left Pan
      const pCount = Math.min(plaintiffWeight, 8);
      for (let i = 0; i < pCount; i++) {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const bx = -14 + col * 14;
        const by = chainLen - 4 - row * 7;

        // Gold Bullion Ingot
        const ingotGrad = ctx.createLinearGradient(bx - 5, by - 3, bx + 5, by + 3);
        ingotGrad.addColorStop(0, isCyber ? '#6EE7B7' : '#FEF08A');
        ingotGrad.addColorStop(0.5, isCyber ? '#10B981' : '#EAB308');
        ingotGrad.addColorStop(1, isCyber ? '#047857' : '#A16207');

        ctx.fillStyle = ingotGrad;
        ctx.fillRect(bx - 5.5, by - 3, 11, 6);
        ctx.strokeStyle = isCyber ? '#A7F3D0' : '#FEF9C3';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(bx - 5.5, by - 3, 11, 6);
      }

      ctx.restore(); // Restore Left Pan

      // 2. RIGHT PAN: DEFENDANT'S EVIDENCE / REBUTTAL
      ctx.save();
      ctx.translate(rightHookX, rightHookY);

      // Dual Chains
      ctx.strokeStyle = isCyber ? '#64748B' : '#94A3B8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-20, chainLen);
      ctx.moveTo(0, 0);
      ctx.lineTo(20, chainLen);
      ctx.stroke();

      // Chain decorative links
      [-10, 10].forEach(dx => {
        ctx.beginPath();
        ctx.arc(dx * 0.5, chainLen * 0.5, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#CBD5E1';
        ctx.fill();
      });

      // Pan Shadow
      ctx.beginPath();
      ctx.ellipse(0, chainLen + 10, 24, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fill();

      // Darkened Iron / Pewter Weighing Bowl
      const panGradD = ctx.createRadialGradient(0, chainLen + 6, 2, 0, chainLen + 6, 26);
      panGradD.addColorStop(0, 'rgba(148, 163, 184, 0.45)');
      panGradD.addColorStop(0.7, 'rgba(71, 85, 105, 0.35)');
      panGradD.addColorStop(1, 'rgba(30, 41, 59, 0.6)');

      ctx.beginPath();
      ctx.ellipse(0, chainLen, 24, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = panGradD;
      ctx.fill();
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Lower curved bowl hull
      ctx.beginPath();
      ctx.arc(0, chainLen, 24, 0, Math.PI);
      ctx.fillStyle = 'rgba(51, 65, 85, 0.45)';
      ctx.fill();
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Defense Weights Stacked inside Right Pan (Iron/Silver ingots)
      const dCount = Math.min(defendantWeight, 8);
      for (let i = 0; i < dCount; i++) {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const bx = -14 + col * 14;
        const by = chainLen - 4 - row * 7;

        const silverGrad = ctx.createLinearGradient(bx - 5, by - 3, bx + 5, by + 3);
        silverGrad.addColorStop(0, '#E2E8F0');
        silverGrad.addColorStop(0.5, '#94A3B8');
        silverGrad.addColorStop(1, '#475569');

        ctx.fillStyle = silverGrad;
        ctx.fillRect(bx - 5.5, by - 3, 11, 6);
        ctx.strokeStyle = '#F1F5F9';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(bx - 5.5, by - 3, 11, 6);
      }

      ctx.restore(); // Restore Right Pan

      ctx.restore(); // Restore root translation

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [theme, plaintiffWeight, defendantWeight, isMinimized]);

  // Handlers for weight simulation (Add and Remove)
  const addPlaintiffWeight = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playDocketStamp();
    setPlaintiffSimOffset(prev => Math.min(prev + 1, 10));
  };

  const removePlaintiffWeight = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setPlaintiffSimOffset(prev => Math.max(prev - 1, -basePlaintiffWeight + 1));
  };

  const addDefendantWeight = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setDefendantSimOffset(prev => Math.min(prev + 1, 10));
  };

  const removeDefendantWeight = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setDefendantSimOffset(prev => Math.max(prev - 1, -baseDefendantWeight + 1));
  };

  const resetWeights = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setPlaintiffSimOffset(0);
    setDefendantSimOffset(0);
  };

  const openDrawer = (side: 'plaintiff' | 'defendant') => {
    sound.playClick();
    setActiveDrawerTab(side);
    setShowDrawer(true);
  };

  return (
    <div className="relative border-2 border-[var(--border-color)] bg-[var(--bg-card)] p-3 shadow-lg custom-geometry overflow-hidden">
      {/* Header Bar with Legal Preponderance Gauge */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-color)] gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded bg-[var(--badge-bg)] text-[var(--accent-gold)] shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-serif font-bold text-xs sm:text-sm text-[var(--text-main)] truncate">
                Burden of Proof &amp; Evidentiary Equilibrium
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider custom-geometry shadow-sm"
                style={{
                  backgroundColor: plaintiffPercent > 50 ? 'rgba(16, 185, 129, 0.15)' : plaintiffPercent === 50 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: plaintiffPercent > 50 ? '#34D399' : plaintiffPercent === 50 ? '#FBBF24' : '#F87171',
                  border: `1px solid ${plaintiffPercent > 50 ? 'rgba(16, 185, 129, 0.3)' : plaintiffPercent === 50 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}
              >
                {plaintiffPercent > 50 
                  ? `⚖️ Preponderance Met (${plaintiffPercent}%)` 
                  : plaintiffPercent === 50 
                  ? '⚖️ Tie Equilibrium (50%)' 
                  : `⚠️ Rebuttal Needed (${plaintiffPercent}%)`}
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-mono hidden sm:block">
              Civil legal standard: 51%+ preponderance of credible evidence establishes claim viability
            </p>
          </div>
        </div>

        {/* Action Controls: Drawer, Reset, Minimize */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => openDrawer('plaintiff')}
            className="btn-geom px-2 sm:px-2.5 py-1 text-[11px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--accent-gold)] hover:border-[var(--accent-gold)] flex items-center gap-1 font-semibold"
            title="Inspect all evidence items on the scale"
          >
            <Info className="w-3 h-3" />
            <span className="hidden xs:inline">Evidence Details</span>
          </button>

          {(plaintiffSimOffset !== 0 || defendantSimOffset !== 0) && (
            <button
              type="button"
              onClick={resetWeights}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded hover:bg-white/5 transition-colors"
              title="Reset Simulation to Real Case Baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMinimized(prev => !prev)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded hover:bg-white/5 transition-colors"
            title={isMinimized ? "Expand Scale Animation" : "Collapse Scale"}
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsed State Quick-Bar */}
      {isMinimized ? (
        <div className="py-2 px-1 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold">
              Plaintiff: {plaintiffWeight} Exhibits &amp; Proofs
            </span>
            <span className="text-[var(--text-muted)]">vs.</span>
            <span className="text-amber-400 font-bold">
              Defense: {defendantWeight} Defect Warnings
            </span>
          </div>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-[10px] text-[var(--accent-gold)] underline hover:opacity-80"
          >
            Show Animated Scales
          </button>
        </div>
      ) : (
        /* Full Animated Canvas Container */
        <div className="w-full relative flex flex-col items-center justify-center">
          {/* Canvas Area with Responsive Height */}
          <div 
            className="w-full h-48 sm:h-52 md:h-56 relative flex items-center justify-center cursor-pointer"
            onClick={() => openDrawer('plaintiff')}
            title="Click to view itemized evidence on scales"
          >
            <canvas ref={canvasRef} className="w-full h-full block select-none" />
          </div>

          {/* Interactive Weight Stepper Controls & Status Footer */}
          <div className="w-full pt-2 pb-1 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--border-color)]">
            {/* Left Stepper: Plaintiff Proof */}
            <div className="flex items-center gap-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-1 custom-geometry shadow-sm">
              <button
                type="button"
                onClick={removePlaintiffWeight}
                disabled={plaintiffWeight <= 1}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 text-[var(--text-muted)] hover:text-rose-400 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                title="Remove simulated evidence weight (-1)"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => openDrawer('plaintiff')}
                className="px-3 py-1 text-xs font-mono font-bold text-[var(--accent-gold)] hover:underline flex items-center gap-1.5"
                title="Click to inspect all evidence items"
              >
                <span>Proof:</span>
                <span className="text-emerald-400 font-bold text-sm">{plaintiffWeight}</span>
              </button>

              <button
                type="button"
                onClick={addPlaintiffWeight}
                className="w-8 h-8 flex items-center justify-center rounded bg-[var(--accent-gold)] text-slate-950 hover:opacity-90 font-bold transition-all shadow-sm"
                title="Add simulated evidence weight (+1)"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Center Status & Preponderance Ratio */}
            <div className="text-center font-mono">
              <div className="flex items-center justify-center gap-2">
                <span className={`text-xs font-bold ${plaintiffPercent >= 51 ? 'text-emerald-400' : plaintiffPercent === 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {plaintiffPercent}% Civil Scale Advantage
                </span>
                {(plaintiffSimOffset !== 0 || defendantSimOffset !== 0) && (
                  <button
                    type="button"
                    onClick={resetWeights}
                    className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-gold)] underline"
                    title="Reset to baseline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block">
                {weightDiff > 0 ? `+${weightDiff} advantage over defense` : weightDiff === 0 ? 'Exact 50/50 deadlock' : `${weightDiff} deficit`}
              </span>
            </div>

            {/* Right Stepper: Defense Rebuttal */}
            <div className="flex items-center gap-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-1 custom-geometry shadow-sm">
              <button
                type="button"
                onClick={removeDefendantWeight}
                disabled={defendantWeight <= 1}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 text-[var(--text-muted)] hover:text-emerald-400 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                title="Remove simulated defense rebuttal weight (-1)"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => openDrawer('defendant')}
                className="px-3 py-1 text-xs font-mono font-bold text-[var(--text-main)] hover:underline flex items-center gap-1.5"
                title="Click to inspect defense defects"
              >
                <span>Defense:</span>
                <span className="text-amber-400 font-bold text-sm">{defendantWeight}</span>
              </button>

              <button
                type="button"
                onClick={addDefendantWeight}
                className="w-8 h-8 flex items-center justify-center rounded bg-slate-800 border border-slate-600 text-slate-100 hover:bg-slate-700 font-bold transition-all shadow-sm"
                title="Add simulated defense rebuttal weight (+1)"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Consumer-First Plain-English Explainer */}
          <div className="w-full mt-2 p-2 bg-emerald-950/20 border border-emerald-500/20 rounded text-[11px] text-emerald-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong>Plain English Rule:</strong> You only need <strong>51%+ proof</strong> (Preponderance of the Evidence) to win in civil court. Each contract, receipt, or message adds weight to your pan.
              </span>
            </div>
            <button
              type="button"
              onClick={() => openDrawer('plaintiff')}
              className="text-[10px] font-mono text-[var(--accent-gold)] underline hover:opacity-80 shrink-0"
            >
              View Evidence Breakdown &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Evidentiary Drawer Modal (Inspect exact proofs tipping the scale) */}
      {showDrawer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowDrawer(false)}
        >
          <div 
            className="bg-[var(--bg-card)] border-2 border-[var(--accent-gold)] custom-geometry w-full max-w-xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[var(--accent-gold)]" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--text-main)]">
                  Evidentiary Weights Resting on the Scales
                </h3>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Tab Selector */}
            <div className="grid grid-cols-2 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-xs font-bold font-mono">
              <button
                onClick={() => { sound.playClick(); setActiveDrawerTab('plaintiff'); }}
                className={`py-2.5 px-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  activeDrawerTab === 'plaintiff'
                    ? 'border-emerald-400 text-emerald-400 bg-[var(--bg-card)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Plaintiff Side ({plaintiffWeight})</span>
              </button>
              <button
                onClick={() => { sound.playClick(); setActiveDrawerTab('defendant'); }}
                className={`py-2.5 px-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  activeDrawerTab === 'defendant'
                    ? 'border-amber-400 text-amber-400 bg-[var(--bg-card)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Defense Side ({defendantWeight})</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
              {activeDrawerTab === 'plaintiff' ? (
                <div className="space-y-3">
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                    <span>Verified documentary evidence &amp; satisfied statutory elements:</span>
                    <span className="text-emerald-400 font-bold font-mono">+{plaintiffWeight} Total Mass</span>
                  </div>

                  {/* Exhibits List */}
                  {realExhibits.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-[var(--accent-gold)] font-bold">
                        Exhibit Locker Items:
                      </span>
                      {realExhibits.map((ev, idx) => (
                        <div 
                          key={ev.id || idx} 
                          className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded custom-geometry flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)] rounded font-bold">
                                {ev.exhibitTag || `EXHIBIT ${String.fromCharCode(65 + idx)}`}
                              </span>
                              <span className="font-bold text-[var(--text-main)] truncate">
                                {ev.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-[var(--text-muted)] block font-mono mt-0.5">
                              Custodian: {ev.custodian} • {ev.category.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                            SHA-256 ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Satisfied Legal Elements */}
                  {satisfiedElements.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">
                        Satisfied Legal Elements (Burden Met):
                      </span>
                      {satisfiedElements.map(el => (
                        <div 
                          key={el.id} 
                          className="p-2 bg-emerald-950/20 border border-emerald-500/20 rounded text-[11px] flex items-start gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-200">{el.title}</span>
                            <span className="text-[10px] text-[var(--text-muted)] block font-mono">
                              Statute: {el.legalStandard}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Simulation notes if offset > 0 */}
                  {plaintiffSimOffset > 0 && (
                    <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] text-[var(--accent-gold)] font-mono">
                      + {plaintiffSimOffset} simulated evidentiary exhibit(s) added via live weight controls.
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDrawer(false);
                        setActiveWorkstation('evidence-locker');
                      }}
                      className="btn-geom px-3 py-1.5 bg-[var(--accent-gold)] text-slate-950 font-bold text-xs flex items-center gap-1 hover:opacity-90"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Upload Real Exhibits in Evidence Locker</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                    <span>Potential defense arguments, notice defects, or statutory offsets:</span>
                    <span className="text-amber-400 font-bold font-mono">+{defendantWeight} Total Mass</span>
                  </div>

                  {/* Defect Warnings List */}
                  {realDefects.length > 0 ? (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-amber-400 font-bold">
                        Notice Defect Warnings (Opponent Challenges):
                      </span>
                      {realDefects.map((defect, idx) => (
                        <div 
                          key={idx} 
                          className="p-2.5 bg-amber-950/20 border border-amber-500/20 rounded custom-geometry flex items-start gap-2"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div className="text-slate-300 leading-relaxed">
                            {defect}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded text-emerald-400">
                      No procedural defects or missing notice elements identified for this dispute.
                    </div>
                  )}

                  {/* Unsatisfied Elements */}
                  {unsatisfiedElements.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-mono text-rose-400 font-bold">
                        Unsatisfied Claim Elements (Defendant Rebuttal Vector):
                      </span>
                      {unsatisfiedElements.map(el => (
                        <div 
                          key={el.id} 
                          className="p-2 bg-rose-950/20 border border-rose-500/20 rounded text-[11px] flex items-start gap-2"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-200">{el.title}</span>
                            <span className="text-[10px] text-rose-300 block font-mono">
                              Required: {el.legalStandard}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {defendantSimOffset > 0 && (
                    <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] text-[var(--accent-gold)] font-mono">
                      + {defendantSimOffset} simulated defense counter-claim(s) added via live weight controls.
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDrawer(false);
                        setActiveWorkstation('claim-kitchen');
                      }}
                      className="btn-geom px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] font-bold text-xs flex items-center gap-1 hover:border-[var(--accent-gold)]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Review Statutory Elements in Claim Kitchen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] px-4 py-2.5 flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] font-mono text-[10px]">
                Preponderance: {plaintiffPercent}% vs {100 - plaintiffPercent}%
              </span>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="btn-geom px-3 py-1 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
