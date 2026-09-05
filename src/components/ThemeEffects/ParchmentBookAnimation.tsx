import React, { useEffect, useRef, useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { BookOpen, Sparkles, Volume2, Eye } from 'lucide-react';

export const ParchmentBookAnimation: React.FC = () => {
  const { theme } = useSueChef();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [isMinimized, setIsMinimized] = useState(false);

  // Only render for parchment-ink theme
  if (theme !== 'parchment-ink') return null;

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

    // Particle system for floating ink & parchment dust
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      symbol: string;
      color: string;
    }

    const latinMaxims = ['§', '¶', 'LEX', 'JUS', 'ACTA', 'VERITAS', 'EQUITY', 'PRO SE'];
    const particles: Particle[] = Array.from({ length: 24 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.5,
      size: 9 + Math.random() * 8,
      alpha: 0.15 + Math.random() * 0.4,
      symbol: latinMaxims[Math.floor(Math.random() * latinMaxims.length)],
      color: '#854D0E'
    }));

    let pageAngle = 0;
    let targetAngle = 0;
    let isFlipping = false;
    let flipTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle ambient glow
      const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width / 2);
      grad.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
      grad.addColorStop(1, 'rgba(212, 175, 55, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw floating ink particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.font = `${p.size}px "Century Schoolbook", Georgia, serif`;
        ctx.fillStyle = `rgba(133, 77, 14, ${p.alpha})`;
        ctx.fillText(p.symbol, p.x, p.y);
        ctx.restore();
      });

      // Draw 3D Leatherbound Law Book
      const cx = width / 2;
      const cy = height / 2 + 10;
      const bw = 160;
      const bh = 105;

      ctx.save();
      ctx.translate(cx, cy);

      // Book Drop Shadow
      ctx.beginPath();
      ctx.ellipse(0, bh / 2 + 15, bw * 0.7, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(60, 40, 10, 0.15)';
      ctx.fill();

      // Leather Spine / Cover
      ctx.fillStyle = '#451a03'; // Deep vintage brown leather
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-bw / 2 - 6, -bh / 2 - 4, bw + 12, bh + 8, 4);
      ctx.fill();
      ctx.stroke();

      // Gold Foil Corner Filigree
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.5;
      [-1, 1].forEach(dirX => {
        [-1, 1].forEach(dirY => {
          const ox = dirX * (bw / 2);
          const oy = dirY * (bh / 2);
          ctx.beginPath();
          ctx.moveTo(ox, oy - dirY * 12);
          ctx.lineTo(ox - dirX * 12, oy);
          ctx.stroke();
        });
      });

      // Left Open Page Stack
      ctx.fillStyle = '#fbf7ee';
      ctx.strokeStyle = '#d6cab4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-bw / 2, -bh / 2, bw / 2 - 2, bh, [4, 0, 0, 4]);
      ctx.fill();
      ctx.stroke();

      // Right Open Page Stack
      ctx.beginPath();
      ctx.roundRect(2, -bh / 2, bw / 2 - 2, bh, [0, 4, 4, 0]);
      ctx.fill();
      ctx.stroke();

      // Book Spine Center Crease & Gold Ribbon Bookmark
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -bh / 2);
      ctx.lineTo(0, bh / 2);
      ctx.stroke();

      // Red Silk Bookmark Ribbon
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, -bh / 2);
      ctx.bezierCurveTo(12, 0, -8, bh / 2, 6, bh / 2 + 18);
      ctx.stroke();

      // Page Text Lines on Left Page
      ctx.fillStyle = '#78716c';
      for (let i = 0; i < 6; i++) {
        const yOff = -bh / 2 + 18 + i * 14;
        ctx.fillRect(-bw / 2 + 12, yOff, bw / 2 - 24, 2);
      }

      // Page Text Lines on Right Page
      for (let i = 0; i < 6; i++) {
        const yOff = -bh / 2 + 18 + i * 14;
        ctx.fillRect(12, yOff, bw / 2 - 24, 2);
      }

      // Section Symbol § on Left Page Header
      ctx.font = 'bold 12px "Century Schoolbook", serif';
      ctx.fillStyle = '#854d0e';
      ctx.fillText('§ IV. JURISPRUDENCE', -bw / 2 + 12, -bh / 2 + 12);
      ctx.fillText(`PAGE ${pageIndex * 2 - 1}`, -bw / 2 + 12, bh / 2 - 6);

      ctx.fillText('EVIDENCE ADMISSIBILITY', 12, -bh / 2 + 12);
      ctx.fillText(`PAGE ${pageIndex * 2}`, bw / 2 - 45, bh / 2 - 6);

      // Animated Turning Page Leaf (Sine Wave Flutter)
      flipTime += 0.04;
      const flutter = Math.sin(flipTime) * 12;
      ctx.save();
      ctx.fillStyle = '#fffdf7';
      ctx.strokeStyle = '#bfa15f';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -bh / 2);
      ctx.quadraticCurveTo(bw / 4 + flutter, -bh / 2 - flutter * 0.4, bw / 2 - 4 + flutter * 0.6, -bh / 2 + 4);
      ctx.lineTo(bw / 2 - 4 + flutter * 0.6, bh / 2 - 4);
      ctx.quadraticCurveTo(bw / 4 + flutter, bh / 2 - flutter * 0.4, 0, bh / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, pageIndex]);

  const handleFlipPage = () => {
    sound.playPaperFlutter();
    setPageIndex(prev => (prev % 12) + 1);
  };

  return (
    <div className="relative border border-[var(--border-color)] bg-[var(--bg-card)] p-3 shadow-md custom-geometry overflow-hidden">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--accent-gold)] animate-pulse" />
          <span className="font-serif font-bold text-xs text-[var(--text-main)]">
            Live Law Tome & Codex
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFlipPage}
            className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)] custom-geometry hover:bg-[var(--accent-gold)] hover:text-white transition-all flex items-center gap-1"
            title="Turn Manuscript Page"
          >
            <Sparkles className="w-3 h-3" />
            <span>Turn Page (Folio {pageIndex})</span>
          </button>
        </div>
      </div>

      <div 
        onClick={handleFlipPage}
        className="w-full h-44 cursor-pointer relative flex items-center justify-center group"
        title="Click to flip pages of the Legal Tome"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute bottom-2 text-[10px] font-mono text-[var(--accent-gold)] bg-[var(--bg-card)]/90 px-2 py-0.5 border border-[var(--badge-border)] rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
          ✦ Interactive Live Legal Codex • Click to Flip
        </div>
      </div>
    </div>
  );
};
