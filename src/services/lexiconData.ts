import { LegalTerm } from '../types';

export const LEGAL_LEXICON: LegalTerm[] = [
  {
    term: 'Demurrer',
    phonetic: 'dih-MUR-er',
    category: 'procedural',
    plainEnglish: 'A formal objection saying: "Even if everything the plaintiff says in their complaint is 100% true, it still does not amount to a legal violation that a court can fix."',
    courtContext: 'Used in states like California instead of a Motion to Dismiss. It attacks defects appearing on the face of the complaint without introducing outside evidence.',
    proSeTip: 'If hit with a demurrer, you usually get "leave to amend," meaning 10–30 days to rewrite your complaint to fix the missing legal elements.',
    exampleSentence: 'The landlord filed a demurrer arguing that the tenant failed to state a valid cause of action for breach of the implied warranty of habitability.'
  },
  {
    term: 'Motion to Dismiss (FRCP Rule 12(b)(6))',
    phonetic: 'MOH-shun too dis-MIS',
    category: 'procedural',
    plainEnglish: 'A formal request asking the judge to throw out the lawsuit immediately because the paperwork fails to state a plausible legal claim or is filed in the wrong court.',
    courtContext: 'The standard federal procedural defense filed before answering the complaint.',
    proSeTip: 'Ensure your complaint contains specific facts establishing each element of your claim rather than vague conclusory accusations.',
    exampleSentence: 'Defendant filed a Rule 12(b)(6) Motion to Dismiss asserting the claim was barred by the two-year statute of limitations.'
  },
  {
    term: 'Summary Judgment (FRCP Rule 56)',
    phonetic: 'SUM-uh-ree JUHJ-munt',
    category: 'procedural',
    plainEnglish: 'A decision by the judge deciding the lawsuit before a trial happens because the key facts are completely undisputed, leaving only a question of law to apply.',
    courtContext: 'Brought after discovery when evidence (contracts, receipts, admissions) shows one side must win as a matter of law.',
    proSeTip: 'To defeat a motion for summary judgment, you must produce admissible evidence showing a "genuine dispute of material fact."',
    exampleSentence: 'Plaintiff moved for summary judgment on the unpaid invoice, showing signed receipts and zero payment records.'
  },
  {
    term: 'Subpoena Duces Tecum',
    phonetic: 'suh-PEE-nuh DOO-ses TEE-kum',
    category: 'evidence',
    plainEnglish: 'A formal court order commanding a third party or witness to deliver physical documents, files, bank records, or electronic evidence to the court or deposition.',
    courtContext: 'Essential for obtaining records from banks, employers, phone companies, or uninterested third parties.',
    proSeTip: 'Always allow at least 15–20 days notice before the compliance date, and serve formal notice on all parties.',
    exampleSentence: 'Plaintiff served a Subpoena Duces Tecum on Chase Bank demanding Defendant’s wire transfer logs from March 2025.'
  },
  {
    term: 'Res Judicata',
    phonetic: 'reez joo-dih-KAY-tuh',
    category: 'latin',
    plainEnglish: '"A matter already judged." You cannot sue someone twice over the exact same dispute once a final judgment on the merits has been entered.',
    courtContext: 'Prevents harassment and endless litigation of claims arising out of the same underlying transaction.',
    proSeTip: 'Make sure you include all related claims in your original lawsuit, because you cannot split them into separate future lawsuits.',
    exampleSentence: 'The court dismissed the new property damage lawsuit on grounds of res judicata since the small claims court had already ruled on it.'
  },
  {
    term: 'Prima Facie Case',
    phonetic: 'PRY-muh FAY-shee',
    category: 'latin',
    plainEnglish: '"At first sight." Presenting sufficient initial evidence to establish all mandatory legal elements of your claim, which stands as proven unless the defendant refutes it.',
    courtContext: 'The threshold test every plaintiff must pass to avoid immediate dismissal.',
    proSeTip: 'SueChef’s Claim Kitchen checks your facts against the exact prima facie requirements for your specific cause of action.',
    exampleSentence: 'Plaintiff established a prima facie case for breach of contract by showing a valid agreement, full performance, defendant’s non-payment, and exact damages.'
  },
  {
    term: 'Motion in Limine',
    phonetic: 'MOH-shun in LIH-mih-nee',
    category: 'evidence',
    plainEnglish: 'A pre-trial motion asking the judge to forbid the other party from mentioning certain prejudicial, irrelevant, or inadmissible evidence in front of the jury.',
    courtContext: 'Heard right before trial begins to prevent toxic evidence from spoiling the proceedings.',
    proSeTip: 'Use this to block the opposing side from bringing up unrelated personal issues, prior unrelated lawsuits, or unverified hearsay.',
    exampleSentence: 'Plaintiff filed a motion in limine to exclude evidence of an unrelated parking ticket from three years ago.'
  },
  {
    term: 'Interrogatories',
    phonetic: 'in-ter-ROG-uh-tor-eez',
    category: 'procedural',
    plainEnglish: 'Written questions that one party sends to the other during pre-trial discovery, which must be answered truthfully in writing under oath within 30 days.',
    courtContext: 'Standard civil discovery tool used to uncover dates, witnesses, facts, and contentions.',
    proSeTip: 'Most jurisdictions cap interrogatories at 25–35 questions without court permission. Keep each question focused.',
    exampleSentence: 'In Interrogatory No. 4, Plaintiff requested the exact date Defendant inspected the premises before withholding the deposit.'
  },
  {
    term: 'Requests for Production of Documents (RFP)',
    phonetic: 'rih-KWESTS for proh-DUK-shun',
    category: 'evidence',
    plainEnglish: 'A formal discovery demand requiring the opposing party to produce original copies of emails, contracts, text messages, receipts, and electronic records.',
    courtContext: 'Governed by FRCP Rule 34 or state civil discovery acts.',
    proSeTip: 'Be specific in what you ask for (e.g. "All email correspondence between Party A and Party B between Jan 1 and March 1, 2025").',
    exampleSentence: 'Defendant failed to respond to RFP No. 12, which sought the repair invoices for the alleged drywall damage.'
  },
  {
    term: 'Requests for Admission (RFA)',
    phonetic: 'rih-KWESTS for ad-MISH-un',
    category: 'procedural',
    plainEnglish: 'Written statements sent to the other party asking them to admit or deny specific facts or verify the authenticity of key documents under oath.',
    courtContext: 'If the opposing party fails to answer within 30 days, the statements are automatically deemed ADMITTED as true for the entire case!',
    proSeTip: 'RFAs are one of the most devastating procedural weapons in civil litigation. Missing the 30-day deadline is fatal to a defendant.',
    exampleSentence: 'By failing to answer Plaintiff’s RFA No. 1 within 30 days, Defendant admitted under law that they signed the lease agreement.'
  },
  {
    term: 'Hearsay (FRE Rule 801/802)',
    phonetic: 'HEER-say',
    category: 'evidence',
    plainEnglish: 'An out-of-court statement offered in court to prove the truth of the matter asserted. Generally NOT admissible unless a specific legal exception applies.',
    courtContext: 'Testifying "Bob told me that Sarah took the money" is inadmissible hearsay to prove Sarah took it.',
    proSeTip: 'Key exceptions you can use: (1) Admissions by the opposing party; (2) Business records kept in regular course of business; (3) Present sense impression.',
    exampleSentence: 'The landlord’s letter claiming a plumber said the pipes were old was inadmissible hearsay without an affidavit from the plumber.'
  },
  {
    term: 'Spoliation of Evidence',
    phonetic: 'spoh-lee-AY-shun',
    category: 'evidence',
    plainEnglish: 'The intentional, reckless, or negligent destruction, alteration, or hiding of evidence relevant to an ongoing or anticipated legal dispute.',
    courtContext: 'Courts impose severe sanctions, including striking defenses or instructing the jury to assume the destroyed evidence would have proved guilt.',
    proSeTip: 'Send a formal "Litigation Hold / Evidence Preservation Letter" immediately upon a dispute to lock in spoliation penalties if they delete text messages.',
    exampleSentence: 'Because Defendant deleted all company emails after receiving the Demand Letter, the judge entered a spoliation sanction.'
  },
  {
    term: 'Quantum Meruit',
    phonetic: 'KWAN-tum MAIR-oo-it',
    category: 'latin',
    plainEnglish: '"As much as he has deserved." A legal claim for reasonable payment for services rendered or goods delivered when no formal written contract exists.',
    courtContext: 'Equitable doctrine preventing one party from receiving valuable labor or materials for free.',
    proSeTip: 'Document market rates, hours worked, and invoices to prove the reasonable value of your services.',
    exampleSentence: 'Even though the homeowner refused to sign the written contract, the contractor recovered $4,500 under quantum meruit for completed plumbing.'
  },
  {
    term: 'Lis Pendens',
    phonetic: 'lis PEN-denz',
    category: 'latin',
    plainEnglish: '"Litigation pending." A formal written notice recorded on the public land title records warning everyone that title or ownership of real property is in litigation.',
    courtContext: 'Effectively freezes the property because banks will not issue mortgages and buyers will not purchase tainted title.',
    proSeTip: 'Only use if your lawsuit directly affects real property title or possession, not for simple money debt disputes.',
    exampleSentence: 'Plaintiff recorded a Lis Pendens on the condominium upon filing the specific performance lawsuit to enforce the purchase contract.'
  },
  {
    term: 'Prayer for Relief',
    phonetic: 'PRAY-er for rih-LEEF',
    category: 'procedural',
    plainEnglish: 'The concluding section of a legal complaint explicitly listing the exact money damages, court costs, interest, and court orders the plaintiff asks the judge to award.',
    courtContext: 'A court generally cannot award relief you never asked for in your prayer.',
    proSeTip: 'Always include: (1) Direct damages; (2) Pre- and post-judgment statutory interest; (3) Court filing and service costs; and (4) "Such other and further relief as the Court deems just and proper."',
    exampleSentence: 'In the Prayer for Relief, Plaintiff requested $3,200 in return of deposit, $6,400 in statutory bad faith penalties, and $185 in court filing fees.'
  },
  {
    term: 'Verification',
    phonetic: 'vair-ih-fih-KAY-shun',
    category: 'procedural',
    plainEnglish: 'A formal sworn declaration signed under penalty of perjury certifying that the facts stated in the complaint or pleading are true and correct.',
    courtContext: 'Required in certain civil actions (like unlawful detainer, injunctions, or quiet title).',
    proSeTip: 'A verified complaint forces the defendant to file a verified answer with specific admissions and denials under penalty of perjury.',
    exampleSentence: 'Plaintiff attached a sworn Verification to the complaint, subjecting all allegations to the penalties of perjury.'
  },
  {
    term: 'Default Judgment (FRCP Rule 55)',
    phonetic: 'dih-FAWLT JUHJ-munt',
    category: 'procedural',
    plainEnglish: 'A binding judgment granted to the plaintiff when the defendant has been properly served with the summons and complaint but fails to respond within the deadline (usually 21–30 days).',
    courtContext: 'Two-step process: (1) Entry of Default by clerk; (2) Entry of Default Judgment by judge or clerk with proof of damages.',
    proSeTip: 'Keep strict proof of service and itemized receipts ready to submit with your default prove-up package.',
    exampleSentence: 'After Defendant failed to answer for 45 days after personal service, the clerk entered default judgment for $8,500.'
  },
  {
    term: 'Motion to Compel',
    phonetic: 'MOH-shun too kum-PEL',
    category: 'procedural',
    plainEnglish: 'A motion asking the judge to order the other party to answer ignored discovery questions, produce hidden documents, or show up for a deposition.',
    courtContext: 'Requires a prior "meet and confer" in good faith to resolve the dispute before running to the judge.',
    proSeTip: 'Document all emails where you asked them to comply; judges frequently award monetary sanctions against stubborn parties.',
    exampleSentence: 'Plaintiff filed a Motion to Compel after Defendant repeatedly refused to produce their bank account statements.'
  },
  {
    term: 'Ex Parte Application',
    phonetic: 'eks PAR-tay',
    category: 'procedural',
    plainEnglish: 'An emergency court application heard with minimal or zero advance notice to prevent immediate, irreparable harm before a formal noticed hearing can take place.',
    courtContext: 'Used for temporary restraining orders, asset freezing, or emergency preservation of evidence.',
    proSeTip: 'You must prove true emergency and show you made reasonable efforts to notify the other side by phone or email.',
    exampleSentence: 'Plaintiff filed an ex parte application for a temporary restraining order to prevent the bank from auctioning the vehicle.'
  },
  {
    term: 'Mitigation of Damages',
    phonetic: 'mit-ih-GAY-shun',
    category: 'contracts',
    plainEnglish: 'The legal duty of an injured party to take reasonable steps to minimize and avoid unnecessary financial losses after a breach or injury.',
    courtContext: 'A plaintiff cannot sit back and let damages pile up if they could have easily prevented them.',
    proSeTip: 'If a landlord sues a tenant for breaking a lease, the landlord must make reasonable efforts to find a replacement tenant.',
    exampleSentence: 'Defendant argued that Plaintiff failed to mitigate damages by waiting four months before looking for a replacement vehicle.'
  }
];
