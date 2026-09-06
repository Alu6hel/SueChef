import React, { useRef, useState, useEffect } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { 
  ShieldAlert, 
  RotateCcw, 
  Download, 
  Plus, 
  Image as ImageIcon, 
  Check, 
  FileCheck,
  Scissors
} from 'lucide-react';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const RedactionCanvas: React.FC = () => {
  const { addEvidence, activeCase } = useSueChef();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [redactions, setRedactions] = useState<Rect[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<Rect | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Draw default legal document sample on canvas
  const drawBaseDocument = (ctx: CanvasRenderingContext2D) => {
    // White document background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 700, 500);

    // Document header
    ctx.fillStyle = '#1A202C';
    ctx.font = 'bold 16px "Times New Roman", serif';
    ctx.fillText('CONFIDENTIAL FINANCIAL STATEMENT & LEASE SUMMARY', 40, 45);

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 55);
    ctx.lineTo(660, 55);
    ctx.stroke();

    // Document Body Text
    ctx.font = '13px "Times New Roman", serif';
    ctx.fillStyle = '#2D3748';
    
    ctx.fillText(`Account Holder: ${activeCase.parties.find(p => p.role === 'plaintiff')?.name || 'Jordan Smith'}`, 40, 85);
    ctx.fillText('Social Security Number: 123-45-6789  [SENSITIVE PII - REDACT]', 40, 115);
    ctx.fillText('JPMorgan Chase Bank Checking: #4912-0883-9912  [REDACT]', 40, 145);
    ctx.fillText('Routing Number: 121000358', 40, 175);
    ctx.fillText('Lease Term: August 1, 2024 to July 31, 2025', 40, 205);
    ctx.fillText('Security Deposit Escrow Amount: $3,200.00 Paid In Full', 40, 235);
    ctx.fillText('Authorized Manager Signature: Maria Gomez', 40, 265);
    ctx.fillText('Personal Date of Birth: 04/12/1988  [SENSITIVE PII - REDACT]', 40, 295);
    ctx.fillText('Emergency Contact Phone: (415) 555-9201', 40, 325);

    // Draw grid lines
    ctx.strokeStyle = '#E2E8F0';
    ctx.strokeRect(40, 350, 620, 80);
    ctx.font = 'italic 11px sans-serif';
    ctx.fillStyle = '#718096';
    ctx.fillText('Click and drag black boxes over SSN, bank account numbers, and personal info.', 50, 395);
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw document
    drawBaseDocument(ctx);

    // Draw committed redactions
    ctx.fillStyle = '#000000';
    redactions.forEach(r => {
      ctx.fillRect(r.x, r.y, r.w, r.h);
      
      // Label text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('REDACTED', r.x + 4, r.y + Math.min(r.h - 4, 12));
      ctx.fillStyle = '#000000';
    });

    // Draw current active dragging box
    if (currentRect) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(currentRect.x, currentRect.y, currentRect.w, currentRect.h);
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [redactions, currentRect]);

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    setIsDrawing(true);
    setStartPos(coords);
    setCurrentRect({ x: coords.x, y: coords.y, w: 0, h: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const coords = getCanvasCoords(touch.clientX, touch.clientY);
    setIsDrawing(true);
    setStartPos(coords);
    setCurrentRect({ x: coords.x, y: coords.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const x = Math.min(startPos.x, coords.x);
    const y = Math.min(startPos.y, coords.y);
    const w = Math.abs(coords.x - startPos.x);
    const h = Math.abs(coords.y - startPos.y);
    setCurrentRect({ x, y, w, h });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos || e.touches.length === 0) return;
    const touch = e.touches[0];
    const coords = getCanvasCoords(touch.clientX, touch.clientY);
    const x = Math.min(startPos.x, coords.x);
    const y = Math.min(startPos.y, coords.y);
    const w = Math.abs(coords.x - startPos.x);
    const h = Math.abs(coords.y - startPos.y);
    setCurrentRect({ x, y, w, h });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentRect && currentRect.w > 10 && currentRect.h > 8) {
      sound.playDocketStamp();
      setRedactions(prev => [...prev, currentRect]);
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentRect(null);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const handleUndo = () => {
    sound.playClick();
    setRedactions(prev => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    sound.playClick();
    setRedactions([]);
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sound.playDocketStamp();
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Exhibit_Redacted_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSaveToEvidenceLocker = async () => {
    sound.playGavelStrike();
    await addEvidence({
      title: 'Sanitized Financial & Lease Document (PII Redacted)',
      category: 'contract',
      originalFileName: 'Sanitized_Financial_Statement_Redacted.pdf',
      fileSizeBytes: 284000,
      dateAcquired: new Date().toISOString().split('T')[0],
      dateOccurred: '2024-08-01',
      custodian: activeCase.parties.find(p => p.role === 'plaintiff')?.name || 'Plaintiff',
      admissibilityChecklist: {
        authenticationFre901: true,
        hearsayExceptionFre803: true,
        bestEvidenceFre1002: true,
        relevanceFre401: true
      },
      exhibitTag: `EXHIBIT ${String.fromCharCode(65 + activeCase.evidenceList.length)}`,
      linkedParagraphIds: ['p_para_4'],
      notes: `Sanitized document with ${redactions.length} black box PII redactions applied pursuant to local court rules.`
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-card/60 border border-border custom-geometry">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary custom-geometry">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-foreground">Evidence PII Redaction Canvas</h2>
            <p className="text-xs text-muted-foreground">
              Permanently burn black redaction boxes over sensitive Social Security numbers, bank accounts, and personal data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPng}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs custom-geometry font-semibold hover:bg-primary/90 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Redacted PNG</span>
          </button>
          <button
            onClick={handleUndo}
            disabled={redactions.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground text-xs custom-geometry disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            onClick={handleClearAll}
            disabled={redactions.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground text-xs custom-geometry disabled:opacity-40"
          >
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-black/90 p-4 border border-border custom-geometry flex flex-col items-center justify-center">
          <canvas
            ref={canvasRef}
            width={700}
            height={460}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full max-w-[700px] border border-border shadow-2xl cursor-crosshair bg-white touch-none"
          />
          <div className="text-[11px] font-mono text-muted-foreground mt-3 flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Click, drag, or touch over sensitive lines to burn permanent black redactions.</span>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-card border border-border custom-geometry space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Redaction Audit Log ({redactions.length} Boxes Applied)
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto text-xs font-mono">
              {redactions.map((r, idx) => (
                <div key={idx} className="p-2 bg-muted/40 border border-border/50 custom-geometry flex justify-between">
                  <span className="text-primary font-bold">Box #{idx + 1}</span>
                  <span className="text-muted-foreground">X:{Math.round(r.x)} Y:{Math.round(r.y)} ({Math.round(r.w)}x{Math.round(r.h)})</span>
                </div>
              ))}
              {redactions.length === 0 && (
                <div className="py-6 text-center text-muted-foreground text-xs">
                  No redactions drawn yet. Drag your cursor across the document on the left.
                </div>
              )}
            </div>

            <button
              onClick={handleSaveToEvidenceLocker}
              className="w-full py-2.5 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry flex items-center justify-center gap-2 shadow-sm"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <FileCheck className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved to Evidence Locker!' : 'Save Sanitized Evidence to Locker'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
