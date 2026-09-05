import React, { useEffect, useRef, useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { Scale, Sparkles, Plus, Minus, RotateCcw } from 'lucide-react';

export const ChambersScalesAnimation: React.FC = () => {
  const { theme, activeCase } = useSueChef();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [plaintiffWeight, setPlaintiffWeight] = useState(3);
  const [defendantWeight, setDefendantWeight] = useState(1);

  // Active for dark themes
  if (theme === 'parchment-ink') return null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 240);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

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

    const dustParticles: DustParticle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.6,
      pulseSpeed: 0.02 + Math.random() * 0.04
    }));

    // Scale Physics State
    let currentTilt = 0;
    let tiltVelocity = 0;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.03;

      // Draw subtle grid & stardust
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
          ? `rgba(16, 185, 129, ${p.alpha * pulse})` 
          : `rgba(212, 175, 55, ${p.alpha * pulse})`;
        ctx.fill();
      });

      // Harmonic Physics Calculation for Scale Tilt
      const targetTilt = ((plaintiffWeight - defendantWeight) / 10) * 0.35 + Math.sin(time * 1.2) * 0.03;
      const spring = 0.06;
      const damping = 0.88;
      const force = (targetTilt - currentTilt) * spring;
      tiltVelocity = (tiltVelocity + force) * damping;
      currentTilt += tiltVelocity;

      const cx = width / 2;
      const cy = height / 2 - 10;
      const beamLength = Math.min(180, width * 0.75);

      const primaryColor = theme === 'cyber-tribunal' ? '#10B981' : '#D4AF37';
      const secondaryColor = theme === 'cyber-tribunal' ? '#34D399' : '#E5C158';

      ctx.save();
      ctx.translate(cx, cy);

      // Fulcrum Base & Stand Pillar
      ctx.strokeStyle = primaryColor;
      ctx.fillStyle = primaryColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(0, 70);
      ctx.stroke();

      // Pedestal Base
      ctx.beginPath();
      ctx.ellipse(0, 70, 35, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Central Ornate Top Sphere
      ctx.beginPath();
      ctx.arc(0, -10, 6, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Balance Beam
      ctx.save();
      ctx.rotate(currentTilt);

      // Beam Line
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-beamLength / 2, 0);
      ctx.lineTo(beamLength / 2, 0);
      ctx.stroke();

      // Beam End Hooks
      [-beamLength / 2, beamLength / 2].forEach(hx => {
        ctx.beginPath();
        ctx.arc(hx, 0, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore(); // restore beam rotation

      // Calculate Pan Positions based on tilted beam ends
      const leftPanX = -Math.cos(currentTilt) * (beamLength / 2);
      const leftPanY = -Math.sin(currentTilt) * (beamLength / 2);

      const rightPanX = Math.cos(currentTilt) * (beamLength / 2);
      const rightPanY = Math.sin(currentTilt) * (beamLength / 2);

      const chainHeight = 45;

      // Draw Left Pan (Plaintiff Evidence)
      ctx.save();
      ctx.translate(leftPanX, leftPanY);
      
      // Chains
      ctx.lineWidth = 1;
      ctx.strokeStyle = secondaryColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-18, chainHeight);
      ctx.moveTo(0, 0);
      ctx.lineTo(18, chainHeight);
      ctx.stroke();

      // Brass Bowl
      ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, chainHeight, 20, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Evidence Weights inside Left Pan
      for (let i = 0; i < Math.min(plaintiffWeight, 6); i++) {
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(-10 + (i % 3) * 10, chainHeight - 2 - Math.floor(i / 3) * 6, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Draw Right Pan (Defense Evidence)
      ctx.save();
      ctx.translate(rightPanX, rightPanY);
      
      // Chains
      ctx.lineWidth = 1;
      ctx.strokeStyle = secondaryColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-18, chainHeight);
      ctx.moveTo(0, 0);
      ctx.lineTo(18, chainHeight);
      ctx.stroke();

      // Brass Bowl
      ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, chainHeight, 20, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Evidence Weights inside Right Pan
      for (let i = 0; i < Math.min(defendantWeight, 6); i++) {
        ctx.fillStyle = secondaryColor;
        ctx.beginPath();
        ctx.arc(-10 + (i % 3) * 10, chainHeight - 2 - Math.floor(i / 3) * 6, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      ctx.restore(); // restore center translation

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, plaintiffWeight, defendantWeight]);

  const addPlaintiffWeight = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setPlaintiffWeight(prev => Math.min(prev + 1, 8));
  };

  const addDefendantWeight = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setDefendantWeight(prev => Math.min(prev + 1, 8));
  };

  const resetWeights = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setPlaintiffWeight(3);
    setDefendantWeight(1);
  };

  return (
    <div className="relative border border-[var(--border-color)] bg-[var(--bg-card)] p-3 shadow-md custom-geometry overflow-hidden">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-[var(--accent-gold)] animate-pulse" />
          <span className="font-serif font-bold text-xs text-[var(--text-main)]">
            Live Equilibrium Scales of Justice
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={resetWeights}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] custom-geometry"
            title="Reset Equilibrium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="w-full h-44 relative flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Interactive Evidence Weight Controls */}
        <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-2 text-[10px] font-mono">
          <button
            onClick={addPlaintiffWeight}
            className="px-2 py-0.5 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--accent-gold)] custom-geometry font-bold hover:bg-[var(--accent-gold)] hover:text-black transition-all flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Plaintiff Evidence ({plaintiffWeight})</span>
          </button>

          <span className="text-[9px] text-[var(--text-muted)] hidden sm:inline">
            {plaintiffWeight > defendantWeight ? '✦ Preponderance Established' : plaintiffWeight === defendantWeight ? '✦ Equilibrium' : '✦ Rebuttal Required'}
          </span>

          <button
            onClick={addDefendantWeight}
            className="px-2 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] custom-geometry font-bold hover:bg-[var(--bg-hover)] transition-all flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Defense Proof ({defendantWeight})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
