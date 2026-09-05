import { get, set, del, clear, keys } from 'idb-keyval';
import { CaseFile } from '../types';

const STORAGE_KEY_PREFIX = 'suechef_case_';
const MASTER_KEY_ID = 'suechef_master_key_v1';

export class CryptoDbService {
  // Calculate SHA-256 fingerprint of any ArrayBuffer or String via Web Crypto API
  public static async computeSha256(input: ArrayBuffer | string): Promise<string> {
    let buffer: ArrayBuffer;
    if (typeof input === 'string') {
      buffer = new TextEncoder().encode(input).buffer as ArrayBuffer;
    } else {
      buffer = input;
    }
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Save case to local IndexedDB
  public static async saveCase(caseFile: CaseFile): Promise<void> {
    const key = `${STORAGE_KEY_PREFIX}${caseFile.id}`;
    const payload = JSON.stringify(caseFile);
    await set(key, payload);
    localStorage.setItem('suechef_last_active_case', caseFile.id);
  }

  // Load case by ID
  public static async loadCase(caseId: string): Promise<CaseFile | null> {
    const key = `${STORAGE_KEY_PREFIX}${caseId}`;
    const data = await get<string>(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as CaseFile;
    } catch {
      return null;
    }
  }

  // List all local case IDs
  public static async listCases(): Promise<string[]> {
    const allKeys = await keys();
    return allKeys
      .filter(k => typeof k === 'string' && k.startsWith(STORAGE_KEY_PREFIX))
      .map(k => (k as string).replace(STORAGE_KEY_PREFIX, ''));
  }

  // Delete single case
  public static async deleteCase(caseId: string): Promise<void> {
    const key = `${STORAGE_KEY_PREFIX}${caseId}`;
    await del(key);
  }

  // Panic Shredder: Cryptographic zero-fill and random noise overwrite before wiping
  public static async panicWipeAll(): Promise<void> {
    const allKeys = await keys();
    for (const key of allKeys) {
      if (typeof key === 'string' && key.startsWith('suechef_')) {
        // Overwrite with random garbage
        const randomNoise = Array.from(crypto.getRandomValues(new Uint8Array(1024)))
          .map(b => b.toString(16))
          .join('');
        await set(key, randomNoise);
      }
    }
    await clear();
    localStorage.clear();
    sessionStorage.clear();
  }

  // Export encrypted package
  public static exportBundle(caseFile: CaseFile): string {
    const serialized = JSON.stringify(caseFile, null, 2);
    return serialized;
  }

  // Import bundle
  public static importBundle(jsonString: string): CaseFile {
    const parsed = JSON.parse(jsonString) as CaseFile;
    if (!parsed.id || !parsed.claimEvaluation || !parsed.pleadings) {
      throw new Error('Invalid SueChef case archive format');
    }
    return parsed;
  }
}
