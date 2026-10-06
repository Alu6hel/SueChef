import { get, set, del, clear, keys } from 'idb-keyval';
import { CaseFile } from '../types';

const STORAGE_KEY_PREFIX = 'suechef_case_';

export interface EncryptedVaultPayload {
  format: 'suechef-aes-gcm-v1';
  saltHex: string;
  ivHex: string;
  ciphertextHex: string;
  caseId: string;
  timestamp: string;
  sha256: string;
}

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

  // Export plaintext JSON package
  public static exportBundle(caseFile: CaseFile): string {
    return JSON.stringify(caseFile, null, 2);
  }

  // Import plaintext JSON package
  public static importBundle(jsonString: string): CaseFile {
    const parsed = JSON.parse(jsonString) as CaseFile;
    if (!parsed.id || !parsed.claimEvaluation || !parsed.pleadings) {
      throw new Error('Invalid SueChef case archive format');
    }
    return parsed;
  }

  /**
   * Zero-Knowledge AES-GCM Encrypted Vault Export (PBKDF2 100,000 iterations + AES-256-GCM)
   */
  public static async exportEncryptedVault(caseFile: CaseFile, passphrase: string): Promise<string> {
    const plainJson = JSON.stringify(caseFile);
    const sha256 = await this.computeSha256(plainJson);

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const aesKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const ciphertextBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      aesKey,
      enc.encode(plainJson)
    );

    const toHex = (buf: Uint8Array) => Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const payload: EncryptedVaultPayload = {
      format: 'suechef-aes-gcm-v1',
      saltHex: toHex(salt),
      ivHex: toHex(iv),
      ciphertextHex: toHex(new Uint8Array(ciphertextBuffer)),
      caseId: caseFile.id,
      timestamp: new Date().toISOString(),
      sha256: sha256
    };

    return JSON.stringify(payload, null, 2);
  }

  /**
   * Zero-Knowledge AES-GCM Encrypted Vault Import
   */
  public static async importEncryptedVault(payloadJson: string, passphrase: string): Promise<CaseFile> {
    const parsed: EncryptedVaultPayload = JSON.parse(payloadJson);
    if (parsed.format !== 'suechef-aes-gcm-v1') {
      throw new Error('Unsupported vault archive format. Expected suechef-aes-gcm-v1');
    }

    const fromHex = (hex: string) => {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
      }
      return bytes;
    };

    const salt = fromHex(parsed.saltHex);
    const iv = fromHex(parsed.ivHex);
    const ciphertext = fromHex(parsed.ciphertextHex);

    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const aesKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    try {
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        aesKey,
        ciphertext
      );
      const dec = new TextDecoder();
      const plainJson = dec.decode(decryptedBuffer);
      const caseFile = JSON.parse(plainJson) as CaseFile;
      if (!caseFile.id || !caseFile.claimEvaluation) {
        throw new Error('Corrupted or invalid decrypted case data');
      }
      return caseFile;
    } catch {
      throw new Error('Decryption failed. Incorrect passphrase or corrupted vault file.');
    }
  }
}
