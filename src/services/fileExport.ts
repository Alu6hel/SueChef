/**
 * File Export & Native Android Bridge Service
 * Handles downloads, share intents, printing, and haptic feedback
 * seamlessly across both desktop browsers and Android WebViews.
 */

export function isNativeAndroid(): boolean {
  return typeof (window as any).SueChefNative !== 'undefined' || typeof (window as any).AndroidBridge !== 'undefined';
}

function getNativeBridge(): any {
  return (window as any).SueChefNative || (window as any).AndroidBridge || null;
}

/**
 * Convert string or Blob to Base64
 */
async function toBase64(content: string | Blob): Promise<string> {
  if (typeof content === 'string') {
    return btoa(unescape(encodeURIComponent(content)));
  }
  const buffer = await content.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return btoa(binary);
}

/**
 * Save file locally (Scoped Storage on Android, a.download on Web)
 */
export async function exportFile(
  filename: string, 
  mimeType: string, 
  content: string | Blob
): Promise<boolean> {
  const native = getNativeBridge();
  if (native && typeof native.saveFile === 'function') {
    try {
      const base64 = await toBase64(content);
      const res = native.saveFile(filename, base64, mimeType);
      return res !== false;
    } catch (err) {
      console.error('Failed to save file via native bridge:', err);
    }
  }

  // Browser Fallback
  try {
    const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch (err) {
    console.error('Browser download failed:', err);
    return false;
  }
}

/**
 * Share file via Android Share Intent or Web Share API
 */
export async function shareFile(
  filename: string, 
  mimeType: string, 
  content: string | Blob
): Promise<boolean> {
  const native = getNativeBridge();
  if (native && typeof native.shareFile === 'function') {
    try {
      const base64 = await toBase64(content);
      const res = native.shareFile(filename, base64, mimeType);
      return res !== false;
    } catch (err) {
      console.error('Failed to share via native bridge:', err);
    }
  }

  // Web Share API fallback
  if (typeof navigator !== 'undefined' && navigator.share && typeof content !== 'string') {
    try {
      const file = new File([content], filename, { type: mimeType });
      await navigator.share({
        title: filename,
        files: [file]
      });
      return true;
    } catch (e) {
      // User cancelled or unsupported, fallback to standard download
    }
  }

  return exportFile(filename, mimeType, content);
}

/**
 * Trigger system printing
 */
export function triggerPrint(): void {
  const native = getNativeBridge();
  if (native && typeof native.printDocument === 'function') {
    native.printDocument();
  } else {
    window.print();
  }
}

/**
 * Trigger tactile haptic feedback
 */
export function triggerHaptic(ms = 35): void {
  const native = getNativeBridge();
  if (native && typeof native.vibrate === 'function') {
    native.vibrate(ms);
  } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(ms);
  }
}
