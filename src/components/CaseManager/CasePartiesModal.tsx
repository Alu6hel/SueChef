import React, { useState, useEffect } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { sound } from '../../services/soundEngine';
import { Party } from '../../types';
import { 
  X, 
  User, 
  Building2, 
  Scale, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  Check, 
  Trash2, 
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Briefcase
} from 'lucide-react';

import { deriveCaseTitle, cleanPartyName } from '../../services/caseUtils';

export const CasePartiesModal: React.FC = () => {
  const { 
    isPartiesModalOpen, 
    setIsPartiesModalOpen, 
    activeCase, 
    updatePartiesAndTitle 
  } = useSueChef();

  // Extract plaintiff and defendant from activeCase
  const plaintiff = activeCase.parties.find(p => p.role === 'plaintiff') || {
    id: 'p_1',
    name: '[e.g., Jane Doe (Your Name)]',
    entityType: 'individual',
    role: 'plaintiff',
    address: '[e.g., 742 Evergreen Terrace]',
    city: '[e.g., Springfield]',
    state: activeCase.state || 'CA',
    zip: '[e.g., 62704]',
    phone: '[e.g., (555) 019-2834]',
    email: '[e.g., jane.doe@example.com]',
    isPlaceholder: true
  };

  const defendant = activeCase.parties.find(p => p.role === 'defendant') || {
    id: 'd_1',
    name: '[e.g., Apex Property Management LLC]',
    entityType: 'llc',
    role: 'defendant',
    address: '[e.g., 100 Commercial Blvd, Suite 200]',
    city: '[e.g., Los Angeles]',
    state: activeCase.state || 'CA',
    zip: '[e.g., 90001]',
    phone: '[e.g., (555) 321-7654]',
    email: '[e.g., notices@apexpm.com]',
    registeredAgent: '[e.g., Legal Department / CT Corporation]',
    isPlaceholder: true
  };

  const [caseTitle, setCaseTitle] = useState(activeCase.title);
  const [isCustomTitle, setIsCustomTitle] = useState(false);

  const [pName, setPName] = useState(plaintiff.name);
  const [pType, setPType] = useState(plaintiff.entityType);
  const [pAddress, setPAddress] = useState(plaintiff.address);
  const [pCity, setPCity] = useState(plaintiff.city);
  const [pState, setPState] = useState(plaintiff.state);
  const [pZip, setPZip] = useState(plaintiff.zip);
  const [pPhone, setPPhone] = useState(plaintiff.phone || '');
  const [pEmail, setPEmail] = useState(plaintiff.email || '');

  const [dName, setDName] = useState(defendant.name);
  const [dType, setDType] = useState(defendant.entityType);
  const [dAddress, setDAddress] = useState(defendant.address);
  const [dCity, setDCity] = useState(defendant.city);
  const [dState, setDState] = useState(defendant.state);
  const [dZip, setDZip] = useState(defendant.zip);
  const [dPhone, setDPhone] = useState(defendant.phone || '');
  const [dEmail, setDEmail] = useState(defendant.email || '');
  const [dRegisteredAgent, setDRegisteredAgent] = useState(defendant.registeredAgent || '');

  const [activeTab, setActiveTab] = useState<'plaintiff' | 'defendant' | 'title'>('plaintiff');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync state whenever modal opens or activeCase changes
  useEffect(() => {
    if (isPartiesModalOpen) {
      const p = activeCase.parties.find(pt => pt.role === 'plaintiff');
      const d = activeCase.parties.find(pt => pt.role === 'defendant');
      if (p) {
        setPName(p.name);
        setPType(p.entityType);
        setPAddress(p.address || '');
        setPCity(p.city || '');
        setPState(p.state || activeCase.state || 'CA');
        setPZip(p.zip || '');
        setPPhone(p.phone || '');
        setPEmail(p.email || '');
      }
      if (d) {
        setDName(d.name);
        setDType(d.entityType);
        setDAddress(d.address || '');
        setDCity(d.city || '');
        setDState(d.state || activeCase.state || 'CA');
        setDZip(d.zip || '');
        setDPhone(d.phone || '');
        setDEmail(d.email || '');
        setDRegisteredAgent(d.registeredAgent || '');
      }
      setCaseTitle(activeCase.title);
      setIsCustomTitle(false);
    }
  }, [isPartiesModalOpen, activeCase]);

  // When Plaintiff name changes, auto-update title if not custom
  const handlePNameChange = (val: string) => {
    setPName(val);
    if (!isCustomTitle) {
      setCaseTitle(deriveCaseTitle(val, dName));
    }
  };

  // When Defendant name changes, auto-update title if not custom
  const handleDNameChange = (val: string) => {
    setDName(val);
    if (!isCustomTitle) {
      setCaseTitle(deriveCaseTitle(pName, val));
    }
  };

  // Auto update title when names change if title is standard format
  const handleAutoTitle = () => {
    sound.playClick();
    setIsCustomTitle(false);
    setCaseTitle(deriveCaseTitle(pName, dName));
  };

  // Clear placeholders helper to give user a clean slate
  const handleClearPlaceholders = () => {
    sound.playClick();
    const clean = (val: string) => (val.startsWith('[') && val.endsWith(']') ? '' : val);
    const newP = clean(pName);
    const newD = clean(dName);
    setPName(newP);
    setPAddress(clean(pAddress));
    setPCity(clean(pCity));
    setPZip(clean(pZip));
    setPPhone(clean(pPhone));
    setPEmail(clean(pEmail));

    setDName(newD);
    setDAddress(clean(dAddress));
    setDCity(clean(dCity));
    setDZip(clean(dZip));
    setDPhone(clean(dPhone));
    setDEmail(clean(dEmail));
    setDRegisteredAgent(clean(dRegisteredAgent));

    if (!isCustomTitle && (newP || newD)) {
      setCaseTitle(deriveCaseTitle(newP, newD));
    }
  };

  const handleSave = () => {
    const finalPName = pName.trim() || 'Plaintiff (You)';
    const finalDName = dName.trim() || 'Defendant (Opposing Party)';
    const finalTitle = isCustomTitle && caseTitle.trim() ? caseTitle.trim() : deriveCaseTitle(finalPName, finalDName);

    // Atomically commit both parties, all addresses, and title
    updatePartiesAndTitle(
      {
        name: finalPName,
        entityType: pType,
        address: pAddress.trim(),
        city: pCity.trim(),
        state: pState.trim(),
        zip: pZip.trim(),
        phone: pPhone.trim(),
        email: pEmail.trim(),
      },
      {
        name: finalDName,
        entityType: dType,
        address: dAddress.trim(),
        city: dCity.trim(),
        state: dState.trim(),
        zip: dZip.trim(),
        phone: dPhone.trim(),
        email: dEmail.trim(),
        registeredAgent: dRegisteredAgent.trim(),
      },
      finalTitle
    );

    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      setIsPartiesModalOpen(false);
    }, 450);
  };

  if (!isPartiesModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-[var(--bg-card)] border-2 border-[var(--accent-gold)] custom-geometry w-full max-w-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--accent-gold)]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[var(--text-main)] leading-tight">
                Dispute Parties & Case Details
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Edit the real names and addresses for your court papers
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); setIsPartiesModalOpen(false); }}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1.5 rounded-md hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Notice & Clean Slate Button */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[var(--accent-gold)]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="font-medium">
              Every field has clear <span className="font-mono bg-black/40 px-1 py-0.5 rounded text-[11px]">[e.g., example]</span> placeholders.
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearPlaceholders}
            className="text-[11px] font-mono font-bold text-[var(--text-main)] hover:text-[var(--accent-gold)] underline flex items-center gap-1"
            title="Clear all example bracketed text"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Example Placeholders</span>
          </button>
        </div>

        {/* Tab Switcher (Plaintiff / Defendant / Case Title) */}
        <div className="grid grid-cols-3 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-xs font-bold">
          <button
            onClick={() => { sound.playClick(); setActiveTab('plaintiff'); }}
            className={`py-3 px-2 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'plaintiff'
                ? 'border-[var(--accent-gold)] text-[var(--accent-gold)] bg-[var(--bg-card)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. You (Plaintiff)</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('defendant'); }}
            className={`py-3 px-2 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'defendant'
                ? 'border-[var(--accent-gold)] text-[var(--accent-gold)] bg-[var(--bg-card)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>2. Opponent (Defendant)</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('title'); }}
            className={`py-3 px-2 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'title'
                ? 'border-[var(--accent-gold)] text-[var(--accent-gold)] bg-[var(--bg-card)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>3. Case Title</span>
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* TAB 1: PLAINTIFF */}
          {activeTab === 'plaintiff' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Live Caption Pill */}
              <div className="p-2.5 bg-black/40 border border-emerald-500/20 rounded-lg flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold shrink-0">Matter Caption:</span>
                  <span className="font-bold text-[var(--text-main)] font-serif truncate">{caseTitle}</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] shrink-0 hidden xs:inline">Auto-syncs live</span>
              </div>

              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-muted)] flex items-start gap-2">
                <User className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-main)]">Plaintiff / Claimant Information:</strong> This is you (the person or business bringing the claim). This information will appear on the header of all court filings, demand letters, and declarations.
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                    Your Full Legal Name or Registered Business Name *
                  </label>
                  <input
                    type="text"
                    value={pName}
                    onChange={e => handlePNameChange(e.target.value)}
                    placeholder="[e.g., Jordan Smith or Jane Doe]"
                    className="w-full input-geom p-2.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-gold)] text-[var(--text-main)]"
                  />
                  <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                    Use your exact name as shown on government ID or lease.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      Entity Type
                    </label>
                    <select
                      value={pType}
                      onChange={e => setPType(e.target.value as Party['entityType'])}
                      className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                    >
                      <option value="individual">Individual (Human Person)</option>
                      <option value="sole_proprietorship">Sole Proprietorship / DBA</option>
                      <option value="llc">Limited Liability Company (LLC)</option>
                      <option value="corporation">Corporation (Inc / Corp)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={pPhone}
                      onChange={e => setPPhone(e.target.value)}
                      placeholder="[e.g., (555) 019-2834]"
                      className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                    Street Address (Mailing Address for Court Notices)
                  </label>
                  <input
                    type="text"
                    value={pAddress}
                    onChange={e => setPAddress(e.target.value)}
                    placeholder="[e.g., 450 University Avenue, Apt 3B]"
                    className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={pCity}
                      onChange={e => setPCity(e.target.value)}
                      placeholder="[e.g., Palo Alto]"
                      className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={pState}
                      onChange={e => setPState(e.target.value)}
                      placeholder="CA"
                      className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      Zip / Postal Code
                    </label>
                    <input
                      type="text"
                      value={pZip}
                      onChange={e => setPZip(e.target.value)}
                      placeholder="[e.g., 94301]"
                      className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={pEmail}
                    onChange={e => setPEmail(e.target.value)}
                    placeholder="[e.g., your.email@example.com]"
                    className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEFENDANT */}
          {activeTab === 'defendant' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Live Caption Pill */}
              <div className="p-2.5 bg-black/40 border border-amber-500/20 rounded-lg flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-amber-400 uppercase font-bold shrink-0">Matter Caption:</span>
                  <span className="font-bold text-[var(--text-main)] font-serif truncate">{caseTitle}</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] shrink-0 hidden xs:inline">Auto-syncs live</span>
              </div>

              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-muted)] flex items-start gap-2">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-main)]">Defendant / Opposing Party Information:</strong> This is the party who caused you damages or withheld your money (e.g. landlord, contractor, auto mechanic, or merchant).
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                    Defendant Name (Person or Corporate Legal Entity) *
                  </label>
                  <input
                    type="text"
                    value={dName}
                    onChange={e => handleDNameChange(e.target.value)}
                    placeholder="[e.g., Vanguard Property Management LLC or Apex Property Holdings]"
                    className="w-full input-geom p-2.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-gold)] text-[var(--text-main)]"
                  />
                  <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                    For businesses, search your state Secretary of State registry for the exact legal corporate entity name.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      Entity Type
                    </label>
                    <select
                      value={dType}
                      onChange={e => setDType(e.target.value as Party['entityType'])}
                      className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                    >
                      <option value="llc">Limited Liability Company (LLC)</option>
                      <option value="corporation">Corporation (Inc / Corp)</option>
                      <option value="individual">Individual (Landlord / Person)</option>
                      <option value="sole_proprietorship">Sole Proprietorship / DBA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={dPhone}
                      onChange={e => setDPhone(e.target.value)}
                      placeholder="[e.g., (408) 555-8840]"
                      className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                    Service of Process Address (Business Office or Registered Agent)
                  </label>
                  <input
                    type="text"
                    value={dAddress}
                    onChange={e => setDAddress(e.target.value)}
                    placeholder="[e.g., 1200 Silicon Valley Blvd, Suite 400]"
                    className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={dCity}
                      onChange={e => setDCity(e.target.value)}
                      placeholder="[e.g., San Jose]"
                      className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={dState}
                      onChange={e => setDState(e.target.value)}
                      placeholder="CA"
                      className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={dZip}
                      onChange={e => setDZip(e.target.value)}
                      placeholder="[e.g., 95110]"
                      className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                    Registered Agent for Service of Process (If Corporation or LLC)
                  </label>
                  <input
                    type="text"
                    value={dRegisteredAgent}
                    onChange={e => setDRegisteredAgent(e.target.value)}
                    placeholder="[e.g., CT Corporation System or Corporate Officer]"
                    className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                    Email Address (For pre-litigation demand letters)
                  </label>
                  <input
                    type="email"
                    value={dEmail}
                    onChange={e => setDEmail(e.target.value)}
                    placeholder="[e.g., manager@propertyco.com]"
                    className="w-full input-geom p-2.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CASE TITLE */}
          {activeTab === 'title' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-muted)] flex items-start gap-2">
                <Scale className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-main)]">Case Matter Caption:</strong> The standard legal dispute title displayed at the top of pleadings, docket listings, and demand correspondence.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                  Matter Title / Case Caption
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={caseTitle}
                    onChange={e => {
                      setCaseTitle(e.target.value);
                      setIsCustomTitle(true);
                    }}
                    placeholder="[e.g., Wilder v. Apex Property Holdings LLC]"
                    className="flex-1 input-geom p-2.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-gold)] text-[var(--text-main)] font-serif"
                  />
                  <button
                    type="button"
                    onClick={handleAutoTitle}
                    className="btn-geom px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--accent-gold)] hover:border-[var(--accent-gold)] whitespace-nowrap"
                    title="Generate title from Plaintiff and Defendant names"
                  >
                    Auto Generate
                  </button>
                </div>
              </div>

              <div className="p-3 bg-black/40 border border-white/5 rounded-lg text-xs font-mono space-y-1">
                <div className="text-[var(--text-muted)] uppercase text-[10px]">Preview on Legal Documents:</div>
                <div className="font-bold text-sm text-[var(--accent-gold)] font-serif">
                  {caseTitle || 'Smith v. Vanguard Property Management LLC'}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  Court: {activeCase.courtName || `${activeCase.state} Small Claims Court`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Save & Navigation */}
        <div className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="text-xs text-[var(--text-muted)] hidden sm:block">
            {showSavedToast ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Changes Saved!
              </span>
            ) : (
              <span>100% Offline &amp; Private</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => { sound.playClick(); setIsPartiesModalOpen(false); }}
              className="btn-geom px-4 py-2 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              Cancel
            </button>

            {activeTab === 'plaintiff' && (
              <button
                type="button"
                onClick={() => { sound.playClick(); setActiveTab('defendant'); }}
                className="btn-geom px-4 py-2 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--accent-gold)] hover:border-[var(--accent-gold)] flex items-center gap-1 font-bold"
              >
                <span>Next: Opponent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {activeTab === 'defendant' && (
              <button
                type="button"
                onClick={() => { sound.playClick(); setActiveTab('title'); }}
                className="btn-geom px-4 py-2 text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--accent-gold)] hover:border-[var(--accent-gold)] flex items-center gap-1 font-bold"
              >
                <span>Next: Title</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="btn-geom px-5 py-2 text-xs bg-[var(--accent-gold)] text-slate-950 font-extrabold hover:opacity-90 shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-slate-950" />
              <span>Save Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
