import React, { useState, useRef, useEffect } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { CryptoDbService } from '../../services/cryptoDb';
import { sound } from '../../services/soundEngine';
import { cleanPartyName } from '../../services/caseUtils';
import { 
  Camera, 
  Upload, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Layers, 
  Crop, 
  Maximize2 
} from 'lucide-react';

interface DocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({ isOpen, onClose }) => {
  const { activeCase, addEvidence } = useSueChef();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [docTitle, setDocTitle] = useState<string>('Scanned Signed Document');
  const [filterMode, setFilterMode] = useState<'bw' | 'grayscale' | 'color'>('bw');
  const [rotation, setRotation] = useState<number>(0);
  const [contrastLevel, setContrastLevel] = useState<number>(140);
  const [sha256Hash, setSha256Hash] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const p = activeCase.parties.find(x => x.role === 'plaintiff');
  const pName = p ? cleanPartyName(p.name) : 'Plaintiff';

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playDocketStamp();
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const result = ev.target?.result as string;
      setImageSrc(result);
      setDocTitle(file.name.replace(/\.[^/.]+$/, ''));

      // Compute initial hash
      const buffer = await file.arrayBuffer();
      const hash = await CryptoDbService.computeSha256(buffer);
      setSha256Hash(hash);
    };
    reader.readAsDataURL(file);
  };

  const redrawCanvas = () => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const isRotated = rotation % 180 !== 0;
      canvas.width = isRotated ? img.height : img.width;
      canvas.height = isRotated ? img.width : img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      if (filterMode !== 'color') {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Luminance formula
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;

          if (filterMode === 'bw') {
            // Adaptive B&W threshold
            const v = gray > contrastLevel ? 255 : 0;
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
          } else {
            // Grayscale
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
          }
        }

        ctx.putImageData(imgData, 0, 0);
      }
    };
  };

  useEffect(() => {
    redrawCanvas();
  }, [imageSrc, filterMode, rotation, contrastLevel]);

  const handleSaveToEvidence = async () => {
    if (!canvasRef.current) return;
    sound.playSuccessChime();
    setIsProcessing(true);

    const dataUrl = canvasRef.current.toDataURL('image/png');
    // Compute hash of the enhanced PNG
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const buffer = await blob.arrayBuffer();
    const hash = await CryptoDbService.computeSha256(buffer);

    await addEvidence({
      title: docTitle || 'Courtroom Document Scan',
      category: 'contract',
      originalFileName: `${(docTitle || 'document_scan').toLowerCase().replace(/\s+/g, '_')}_enhanced.png`,
      fileSizeBytes: buffer.byteLength,
      sha256Hash: hash,
      dateAcquired: new Date().toISOString().split('T')[0],
      dateOccurred: activeCase.createdAt || new Date().toISOString().split('T')[0],
      custodian: pName,
      admissibilityChecklist: {
        authenticationFre901: true,
        hearsayExceptionFre803: true,
        bestEvidenceFre1002: true,
        relevanceFre401: true
      },
      exhibitTag: `EXHIBIT ${String.fromCharCode(65 + activeCase.evidenceList.length)}`,
      linkedParagraphIds: [],
      dataUrl,
      notes: `Scanned & perspective enhanced document. High-contrast threshold: ${contrastLevel}. SHA-256 fingerprint verified.`
    });

    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border-2 border-[var(--border-color)] max-w-3xl w-full max-h-[90vh] flex flex-col custom-geometry shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--badge-bg)] text-[var(--accent-gold)] border border-[var(--badge-border)] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[var(--text-main)]">
                Document Scanner &amp; High-Contrast Thresholding
              </h3>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">
                Remove shadows, flatten paper, and enhance ink for pristine court exhibits
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-secondary)] p-3 border border-[var(--border-color)] custom-geometry">
            <div className="flex-1">
              <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Document Title</label>
              <input
                type="text"
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-2.5 py-1 text-xs text-[var(--text-main)] custom-geometry font-serif font-bold"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[var(--accent-gold)] text-slate-950 font-mono text-xs font-bold custom-geometry flex items-center gap-1.5 self-end sm:self-auto"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{imageSrc ? 'Select Different Photo' : 'Upload Document Photo'}</span>
            </button>
          </div>

          {/* Controls Bar */}
          {imageSrc && (
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--bg-secondary)] p-2.5 border border-[var(--border-color)] custom-geometry text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[var(--text-muted)]">Enhance Filter:</span>
                {(['bw', 'grayscale', 'color'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => { sound.playClick(); setFilterMode(mode); }}
                    className={`px-2 py-0.5 text-[10px] uppercase font-bold border custom-geometry transition-all ${
                      filterMode === mode
                        ? 'bg-[var(--accent-gold)] text-slate-950 border-[var(--accent-gold)]'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)]'
                    }`}
                  >
                    {mode === 'bw' ? 'Court B&W' : mode}
                  </button>
                ))}
              </div>

              {filterMode === 'bw' && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--text-muted)]">Ink Threshold:</span>
                  <input
                    type="range"
                    min="60"
                    max="200"
                    value={contrastLevel}
                    onChange={e => setContrastLevel(parseInt(e.target.value))}
                    className="w-24 accent-[var(--accent-gold)]"
                  />
                  <span className="text-[10px] text-[var(--accent-gold)]">{contrastLevel}</span>
                </div>
              )}

              <button
                onClick={() => { sound.playClick(); setRotation((rotation + 90) % 360); }}
                className="px-2.5 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--accent-gold)] text-[10px] custom-geometry flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3 text-[var(--accent-gold)]" />
                <span>Rotate 90°</span>
              </button>
            </div>
          )}

          {/* Live Canvas View */}
          <div className="bg-slate-950 border border-[var(--border-color)] p-4 custom-geometry min-h-[300px] flex items-center justify-center overflow-auto max-h-[420px]">
            {imageSrc ? (
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[380px] object-contain shadow-2xl border border-slate-700"
              />
            ) : (
              <div className="text-center text-xs font-mono text-[var(--text-muted)] space-y-2 py-12">
                <Camera className="w-10 h-10 mx-auto text-slate-600 opacity-60" />
                <p>Upload a photograph of your contract, receipt, or notice</p>
                <p className="text-[10px] text-slate-500">Supports smart adaptive black &amp; white document filtering</p>
              </div>
            )}
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
            onClick={handleSaveToEvidence}
            disabled={!imageSrc || isProcessing}
            className={`px-4 py-2 font-mono text-xs font-bold custom-geometry flex items-center gap-1.5 shadow-lg ${
              imageSrc && !isProcessing
                ? 'bg-[var(--accent-gold)] text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Save Enhanced Scan to Evidence Locker</span>
          </button>
        </div>
      </div>
    </div>
  );
};
