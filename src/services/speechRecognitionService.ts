import { SupportedLanguage } from '../types';

export interface SpeechRecognitionOptions {
  language?: SupportedLanguage | string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscript: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
  onStateChange?: (isListening: boolean) => void;
}

export class SpeechRecognitionService {
  private static recognitionInstance: any = null;
  private static isCurrentlyListening: boolean = false;

  public static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public static getBcp47Language(lang: SupportedLanguage | string): string {
    switch (lang) {
      case 'hi':
        return 'hi-IN';
      case 'es':
        return 'es-ES';
      case 'de':
        return 'de-DE';
      case 'fr':
        return 'fr-FR';
      case 'ja':
        return 'ja-JP';
      case 'zh':
        return 'zh-CN';
      case 'en':
      default:
        return 'en-US';
    }
  }

  /**
   * Start listening using Web Speech API
   * Returns a stop function
   */
  public static startListening(options: SpeechRecognitionOptions): () => void {
    if (!this.isSupported()) {
      options.onError?.('Speech recognition is not supported in this browser environment.');
      return () => {};
    }

    // Stop any existing instance
    this.stopListening();

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    try {
      const recognition = new SpeechRecognitionClass();
      this.recognitionInstance = recognition;

      recognition.continuous = options.continuous !== false;
      recognition.interimResults = options.interimResults !== false;
      recognition.lang = this.getBcp47Language(options.language || 'en');

      recognition.onstart = () => {
        this.isCurrentlyListening = true;
        options.onStateChange?.(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const combined = (finalTranscript || interimTranscript).trim();
        if (combined) {
          options.onTranscript(combined, !!finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        options.onError?.(event.error || 'Speech recognition encountered an error.');
      };

      recognition.onend = () => {
        this.isCurrentlyListening = false;
        options.onStateChange?.(false);
      };

      recognition.start();

      return () => {
        this.stopListening();
      };
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      options.onError?.(err?.message || 'Failed to initialize microphone.');
      return () => {};
    }
  }

  public static stopListening(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.abort();
      } catch {
        // ignore
      }
      this.recognitionInstance = null;
    }
    this.isCurrentlyListening = false;
  }

  public static isListening(): boolean {
    return this.isCurrentlyListening;
  }

  /**
   * Free Client-Side Speech Synthesis (Read Out Courtroom Scripts / Objections)
   */
  public static speakText(text: string, language: SupportedLanguage = 'en', onEnd?: () => void): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.getBcp47Language(language);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  public static stopSpeaking(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}
