import { CaseFile } from '../types';

/**
 * Strips bracketed placeholders and sample tags from party names
 * e.g., "Jordan Wilder [Sample — Tap to Put Your Name]" -> "Jordan Wilder"
 * e.g., "[e.g., Apex Property Management LLC]" -> "Apex Property Management LLC"
 */
export function cleanPartyName(rawName: string): string {
  if (!rawName) return '';
  let cleaned = rawName.replace(/\[(?:e\.g\.,?\s*|Sample\s*—\s*[^\]]*|[^\]]*)\]/gi, '').trim();
  // Remove leading/trailing stray punctuation or brackets
  cleaned = cleaned.replace(/^[\[\(\s]+|[\]\)\s]+$/g, '').trim();
  return cleaned || rawName.trim();
}

/**
 * Derives a standard legal case caption from Plaintiff and Defendant names
 * e.g. "Wilder v. Vanguard Property Management LLC" or "You (Claimant) v. Apex Property Holdings LLC"
 */
export function deriveCaseTitle(plaintiffName: string, defendantName: string): string {
  const cleanP = cleanPartyName(plaintiffName) || 'Claimant';
  const cleanD = cleanPartyName(defendantName) || 'Opposing Party';

  // For individual human names, standard legal convention uses the last name:
  // "Jordan Wilder" -> "Wilder", "Jane Doe" -> "Doe"
  // If it's "You (Claimant)", "John Doe & Co", or a corporate entity, keep the full readable name
  const pParts = cleanP.split(/\s+/);
  let pSurname = cleanP;
  if (
    pParts.length >= 2 &&
    !cleanP.includes('(') &&
    !cleanP.includes('/') &&
    !cleanP.toLowerCase().includes('llc') &&
    !cleanP.toLowerCase().includes('inc') &&
    !cleanP.toLowerCase().includes('corp') &&
    !cleanP.toLowerCase().includes('ltd')
  ) {
    pSurname = pParts[pParts.length - 1]; // e.g. "Wilder"
  }

  return `${pSurname} v. ${cleanD}`;
}

/**
 * Formats a concise mobile-friendly caption for the top bar header pill
 * e.g. "Wilder v. Vanguard" instead of getting cut off mid-word
 */
export function formatDisplayCaption(title: string, plaintiffName?: string, defendantName?: string): {
  shortTitle: string;
  fullTitle: string;
} {
  const fullTitle = title.trim() || (plaintiffName && defendantName ? deriveCaseTitle(plaintiffName, defendantName) : 'Active Dispute Matter');
  
  if (fullTitle.includes(' v. ') || fullTitle.includes(' vs. ')) {
    const delimiter = fullTitle.includes(' v. ') ? ' v. ' : ' vs. ';
    const [left, right] = fullTitle.split(delimiter);
    const cleanLeft = left.trim();
    let cleanRight = right.trim();

    // Shorten long corporate suffixes on mobile
    cleanRight = cleanRight
      .replace(/Property Management/gi, 'Properties')
      .replace(/Construction/gi, 'Constr.')
      .replace(/Development/gi, 'Dev.')
      .replace(/\s+LLC\.?/gi, ' LLC')
      .replace(/\s+Inc\.?/gi, ' Inc')
      .replace(/\s+Corp\.?/gi, ' Corp');

    // For corporate entities with multiple descriptors (e.g. "Apex Property Holdings LLC" or "Vanguard Property Management LLC"),
    // compact to "Apex LLC" or "Vanguard LLC" on mobile
    const entityMatch = cleanRight.match(/\b(LLC|Inc\.?|Corp\.?|Ltd\.?)\b/i);
    const rightWords = cleanRight.split(/\s+/);
    if (entityMatch && rightWords.length > 2) {
      cleanRight = `${rightWords[0]} ${entityMatch[0]}`;
    } else if (rightWords.length > 2) {
      // Individual or general: if 2+ words, use last name or first 2 words
      cleanRight = rightWords.length === 2 ? rightWords[1] : `${rightWords[0]} ${rightWords[1]}`;
    }

    return {
      shortTitle: `${cleanLeft} v. ${cleanRight}`,
      fullTitle
    };
  }

  return {
    shortTitle: fullTitle.length > 24 ? fullTitle.slice(0, 22) + '...' : fullTitle,
    fullTitle
  };
}

/**
 * Synchronizes new party names across the entire CaseFile structure:
 * - Updates parties list
 * - Updates case title (unless user specified an explicit custom title)
 * - Updates pleading caption, complaint paragraphs, demand letter, trial script, and evidence custodians
 */
export function syncCaseWithParties(
  caseFile: CaseFile,
  newPlaintiffName: string,
  newDefendantName: string,
  customTitle?: string
): CaseFile {
  const oldPlaintiff = caseFile.parties.find(p => p.role === 'plaintiff');
  const oldDefendant = caseFile.parties.find(p => p.role === 'defendant');

  const oldPName = oldPlaintiff ? cleanPartyName(oldPlaintiff.name) : '';
  const oldDName = oldDefendant ? cleanPartyName(oldDefendant.name) : '';

  const cleanP = cleanPartyName(newPlaintiffName) || 'Plaintiff';
  const cleanD = cleanPartyName(newDefendantName) || 'Defendant';

  const newTitle = customTitle?.trim() ? customTitle.trim() : deriveCaseTitle(cleanP, cleanD);

  // Update parties array
  const updatedParties = caseFile.parties.map(p => {
    if (p.role === 'plaintiff') {
      return {
        ...p,
        name: newPlaintiffName.trim() || 'Plaintiff (You)',
        isPlaceholder: false
      };
    }
    if (p.role === 'defendant') {
      return {
        ...p,
        name: newDefendantName.trim() || 'Defendant (Opposing Party)',
        isPlaceholder: false
      };
    }
    return p;
  });

  // Replace text helper
  const replaceNames = (text: string): string => {
    if (!text) return text;
    let result = text;
    // Replace old plaintiff name variants
    if (oldPName && oldPName !== cleanP) {
      result = result.split(oldPName).join(cleanP);
    }
    // Replace default template name "Jordan Smith" if present
    result = result.split('Jordan Smith').join(cleanP);
    result = result.split('Plaintiff Jordan Smith').join(`Plaintiff ${cleanP}`);

    // Replace old defendant name variants
    if (oldDName && oldDName !== cleanD) {
      result = result.split(oldDName).join(cleanD);
    }
    // Replace default template name "Vanguard Property Management LLC" if present
    result = result.split('Vanguard Property Management LLC').join(cleanD);
    result = result.split('Vanguard Property Management').join(cleanD);
    return result;
  };

  // Update pleading paragraphs
  const updatedParagraphs = caseFile.pleadings.paragraphs.map(p => ({
    ...p,
    content: replaceNames(p.content)
  }));

  // Update demand letter
  const updatedDemandLetter = {
    ...caseFile.pleadings.demandLetter,
    settlementOfferText: replaceNames(caseFile.pleadings.demandLetter.settlementOfferText)
  };

  // Update trial prep opening statement & witness examination
  const updatedTrialPrep = {
    ...caseFile.trialPrep,
    openingStatementDraft: replaceNames(caseFile.trialPrep.openingStatementDraft),
    witnessOutlines: (caseFile.trialPrep.witnessOutlines || []).map(w => ({
      ...w,
      witnessName: replaceNames(w.witnessName),
      directQuestions: (w.directQuestions || []).map(q => replaceNames(q)),
      crossExamTraps: (w.crossExamTraps || []).map(q => replaceNames(q))
    }))
  };

  // Update evidence custodians
  const updatedEvidenceList = caseFile.evidenceList.map(ev => ({
    ...ev,
    custodian: ev.custodian === 'Jordan Smith' || (oldPName && ev.custodian.includes(oldPName))
      ? cleanP
      : ev.custodian
  }));

  // Update chat thread maker participants
  const updatedChatThreads = (caseFile.chatThreads || []).map(t => ({
    ...t,
    participantA: cleanP,
    participantB: cleanD,
    messages: t.messages.map(m => ({
      ...m,
      senderName: m.isMe ? cleanP : cleanD
    }))
  }));

  return {
    ...caseFile,
    title: newTitle,
    parties: updatedParties,
    pleadings: {
      ...caseFile.pleadings,
      paragraphs: updatedParagraphs,
      demandLetter: updatedDemandLetter
    },
    trialPrep: updatedTrialPrep,
    evidenceList: updatedEvidenceList,
    chatThreads: updatedChatThreads,
    updatedAt: new Date().toISOString().split('T')[0]
  };
}
