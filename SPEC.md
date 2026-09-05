# SueChef — Technical Architectural Specification

**Version:** 1.0.0-PROD  
**Platform Target:** Modern Web (PWA) + Standalone Native Android APK (AAPT2/D8/Java11)  
**Security & Privacy Tier:** Zero-Cloud Telemetry / 100% Local Encrypted SQLite & IndexedDB  
**Repository:** `https://github.com/Alu6hel/SueChef.git`

---

## 1. Executive Summary & Vision

**SueChef** is a high-precision, privacy-first legal preparation and dispute management studio. Designed to bridge the gap between complex civil procedure and everyday litigants, SueChef transforms messy real-world disputes into structured, court-compliant legal dossiers.

The platform operates on a fundamental principle: **Ironclad Confidentiality**. High-stakes legal disputes cannot afford third-party data harvesting or cloud breaches. SueChef executes 100% client-side with hardware-grade AES-GCM encryption, local IndexedDB persistence, in-browser cryptographic evidence hashing (SHA-256), and zero remote tracking.

---

## 2. Core Architectural Tenets

### 2.1 100% Client-Side Bare-Metal Execution
- **Zero Cloud Leakage:** All dispute intake, complaint drafting, evidence storage, and financial damages calculations remain on the user's device.
- **Offline First:** Fully functional without internet connectivity.
- **Instant Panic Shredder:** Cryptographic overwrite and purge of all local storage in one click.

### 2.2 Formal Legal Procedure Rules Engine
- **Jurisdiction & Venue Matrix:** Covers all 50 US States + District of Columbia + Federal Rules of Civil Procedure (FRCP).
- **Small Claims vs. General Civil Thresholds:** Real-time monetary ceiling validation across jurisdictions (e.g., California $12,500, New York $10,000, Texas $20,000).
- **Cause of Action Element Matrix:** Pre-programmed statutory and common-law elements for Breach of Contract, Fraud, Landlord/Tenant Security Deposits, Property Damage, Wage Theft, Consumer Protection, and Negligence.

### 2.3 Cryptographic Evidence Vault & Chain of Custody
- **SHA-256 Hashing:** Web Crypto API calculates cryptographic fingerprints for every uploaded document, photo, text export, and email.
- **Admissibility Checklist:** Rule-based checks for relevance, authentication (FRE 901), hearsay exceptions (FRE 803), and best evidence rules (FRE 1002).
- **Automated Exhibit Stamping:** Generates formatted `EXHIBIT [A-Z]` badges and master exhibit indices cross-referenced with complaint paragraphs.

### 2.4 Dynamic Pleading & Document Engine
- **California & Federal 28-Line Pleading Paper:** True-to-scale vertical margin line numbering (1 to 28), formal captions, bracketed case titles, cause-of-action headers, and prayer for relief.
- **Demand Letter Generator:** 10/14/30-day pre-litigation formal demand letters with statutory interest calculation and certified mail tracking fields.
- **Verification Affidavits & Proof of Service:** Sworn statement templates with integrated digital signature canvas.

### 2.5 Attorney Hand-Off Dossier & Cost Saver
- **Master Dossier Generator:** Compiles an executive summary, chronological fact timeline, table of damages with verified receipts, draft complaint, and stamped exhibit index.
- **Billable Hour Savings Counter:** Benchmarks user time against standard paralegal ($150–$250/hr) and associate attorney ($350–$650/hr) billing rates, quantifying estimated thousands saved in initial case intake.

### 2.6 Web Audio Procedural Sound Synthesis
- **Zero Audio Files:** All acoustic feedback (gavel strikes, docket stamps, filing alerts, critical deadline warning bells, UI clicks) synthesized in real-time via Web Audio API oscillators and gain envelopes.

### 2.7 Multi-Theme & Corner Geometry System
- **5 Bespoke Themes:**
  1. *Chambers Onyx / Midnight Justice* (Obsidian dark mode with brass & champagne gold accents).
  2. *Parchment & Ink* (Editorial warm ivory, antique paper texture, crisp legal typography).
  3. *Legal Slate & Cobalt* (Modern corporate slate navy with electric cyan highlights).
  4. *Emerald Chancery* (Rich British racing green, deep velvet darks, antique gold trim).
  5. *Cyber Tribunal* (High-contrast tactical dark mode with lime accents).
- **Corner Edge Geometry:** Sharp (0px), Chamfer (45° beveled corners), Smooth (Rounded 8px/12px).

---

## 3. System Architecture & Component Hierarchy

```
SueChef Architecture
 ├── ui/
 │    ├── WorkstationTabs (8 Dedicated Legal Studios)
 │    ├── ThemeProvider (5 Distinct Palette Schemes)
 │    ├── GeometryProvider (Sharp / Chamfer / Smooth)
 │    └── SoundEngine (Web Audio Synthesizer)
 ├── engine/
 │    ├── ClaimEvaluator (Elements, Merits, Jurisdictions)
 │    ├── SolEngine (Statute of Limitations & Tolling)
 │    ├── PleadingFormatter (28-Line Pleading & Demand Letters)
 │    ├── CryptoEvidence (SHA-256 Hasher & Chain of Custody)
 │    ├── LegaleseDecoder (300+ Term Dictionary & Clause Analyzer)
 │    ├── ServiceTracker (FRCP Rule 4 & Proof of Service)
 │    └── DossierCompiler (Master Attorney Brief & Savings Calc)
 ├── storage/
 │    ├── EncryptedDB (IndexedDB + Web Crypto AES-GCM)
 │    ├── PanicShredder (Cryptographic Zero-Fill Purge)
 │    └── FileExporter (PDF, Markdown, JSON, iCal)
 └── android_build/
      ├── MainActivity.java (Native Webview + File Chooser)
      ├── AndroidManifest.xml (Storage, Camera, Audio permissions)
      └── build_apk.sh (AAPT2 + D8 + Java 11 Bare-Metal Toolchain)
```

---

## 4. Security & Admissibility Protocols

1. **Local Encryption:** Master key derived via PBKDF2 with SHA-256 and 100,000 iterations, encrypting all stored case records with AES-GCM 256-bit.
2. **Deterministic Hashing:** Uploaded evidence files are fingerprinted via `crypto.subtle.digest('SHA-256', arrayBuffer)` to maintain court evidentiary integrity.
3. **Data Portability:** Full case export and import as `.suechef` encrypted JSON archive or standard PDF/Markdown dossiers.
