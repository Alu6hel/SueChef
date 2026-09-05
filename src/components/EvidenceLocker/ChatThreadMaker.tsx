import React, { useState } from 'react';
import { useSueChef } from '../../context/SueChefContext';
import { ChatThread, ChatMessage } from '../../types';
import { sound } from '../../services/soundEngine';
import { 
  MessageSquare, 
  Smartphone, 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  FileCheck, 
  Sparkles, 
  AlertTriangle,
  User,
  Clock
} from 'lucide-react';

export const ChatThreadMaker: React.FC = () => {
  const { activeCase, updateActiveCase } = useSueChef();
  const [activeThreadIdx, setActiveThreadIdx] = useState(0);
  const [copiedExhibit, setCopiedExhibit] = useState(false);

  // New message state
  const [senderName, setSenderName] = useState('Jordan Smith');
  const [isMe, setIsMe] = useState(true);
  const [timestamp, setTimestamp] = useState('August 25, 2025 • 11:30 AM');
  const [content, setContent] = useState('');
  const [isAdmission, setIsAdmission] = useState(false);
  const [highlightNote, setHighlightNote] = useState('');

  const threads = activeCase.chatThreads || [];
  const currentThread = threads[activeThreadIdx] || {
    id: 'chat_default',
    title: 'Dispute SMS Communications',
    platform: 'iMessage',
    participantA: activeCase.parties.find(p => p.role === 'plaintiff')?.name || 'Plaintiff',
    participantB: activeCase.parties.find(p => p.role === 'defendant')?.name || 'Defendant',
    messages: []
  };

  const handleAddMessage = () => {
    if (!content.trim()) return;
    sound.playGavelStrike();

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderName: senderName.trim(),
      isMe,
      timestamp: timestamp.trim() || new Date().toLocaleString(),
      content: content.trim(),
      isAdmission,
      highlightNote: isAdmission ? (highlightNote.trim() || 'Opposing Party Admission (FRE 801(d)(2))') : undefined
    };

    const updatedThreads = [...threads];
    if (!updatedThreads[activeThreadIdx]) {
      updatedThreads[activeThreadIdx] = { ...currentThread, messages: [newMsg] };
    } else {
      updatedThreads[activeThreadIdx] = {
        ...updatedThreads[activeThreadIdx],
        messages: [...updatedThreads[activeThreadIdx].messages, newMsg]
      };
    }

    updateActiveCase(prev => ({
      ...prev,
      chatThreads: updatedThreads
    }));

    setContent('');
    setIsAdmission(false);
    setHighlightNote('');
  };

  const handleDeleteMessage = (msgId: string) => {
    sound.playClick();
    const updatedThreads = [...threads];
    if (updatedThreads[activeThreadIdx]) {
      updatedThreads[activeThreadIdx] = {
        ...updatedThreads[activeThreadIdx],
        messages: updatedThreads[activeThreadIdx].messages.filter(m => m.id !== msgId)
      };
      updateActiveCase(prev => ({
        ...prev,
        chatThreads: updatedThreads
      }));
    }
  };

  const handleCopyExhibitTranscript = () => {
    sound.playDocketStamp();
    let transcript = `TRIAL EXHIBIT TRANSCRIPT — ELECTRONIC EVIDENCE\n`;
    transcript += `CASE NUMBER: ${activeCase.caseNumber}\n`;
    transcript += `MATTER: ${activeCase.title}\n`;
    transcript += `PLATFORM / SOURCE: ${currentThread.platform} Verified Export\n`;
    transcript += `PARTICIPANTS: ${currentThread.participantA} (Plaintiff) & ${currentThread.participantB} (Defendant)\n`;
    transcript += `AUTHENTICATION STATUTORY BASIS: FRE 901(b)(4) Distinctive Characteristics & FRE 801(d)(2) Party Admission\n`;
    transcript += `================================================================================\n\n`;

    currentThread.messages.forEach((msg, idx) => {
      transcript += `[${msg.timestamp}] ${msg.senderName}:\n`;
      transcript += `"${msg.content}"\n`;
      if (msg.isAdmission) {
        transcript += `>>> [EVIDENTIARY CALLOUT / ADMISSION]: ${msg.highlightNote || 'Admitted by opposing party under FRE 801(d)(2)'}\n`;
      }
      transcript += `\n`;
    });

    transcript += `================================================================================\n`;
    transcript += `CERTIFICATION OF ACCURACY: I declare under penalty of perjury under the laws of the State of ${activeCase.state} that the foregoing is a true and correct transcription of electronic communications.\n`;

    navigator.clipboard.writeText(transcript);
    setCopiedExhibit(true);
    setTimeout(() => setCopiedExhibit(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-card/60 border border-border custom-geometry">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center text-primary custom-geometry">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-serif text-foreground">Chat &amp; SMS Evidence Reconstructor</h2>
            <p className="text-xs text-muted-foreground">
              Turn messy screenshot threads into certified court exhibits with evidentiary admission callouts.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyExhibitTranscript}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-xs font-semibold custom-geometry hover:bg-primary/90 transition-all shadow-sm"
        >
          {copiedExhibit ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>Export Certified Exhibit Transcript</span>
        </button>
      </div>

      {/* Main View: Simulator on Left, Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chat Simulator Bubble Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-black/80 border border-border custom-geometry p-4 sm:p-6 space-y-4 shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-foreground">
                {currentThread.title} ({currentThread.platform})
              </span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {currentThread.messages.length} Messages Logged
            </span>
          </div>

          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {currentThread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1">
                  <span className="font-semibold">{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] p-3.5 custom-geometry text-xs leading-relaxed relative group ${
                    msg.isMe
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground border border-border/80'
                  }`}
                >
                  <p>{msg.content}</p>
                  
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-destructive text-destructive-foreground rounded-full text-[10px]"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {msg.isAdmission && (
                  <div className="max-w-[85%] p-2 bg-amber-500/15 border-l-2 border-amber-500 text-[11px] text-amber-200 custom-geometry flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">FRE 801(d)(2) Admission: </strong>
                      <span>{msg.highlightNote}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {currentThread.messages.length === 0 && (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No messages recorded in this thread yet. Add a message using the form.
              </div>
            )}
          </div>
        </div>

        {/* Right: Message Injection Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-card border border-border custom-geometry space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-primary" />
              <span>Add Message to Thread</span>
            </h3>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted-foreground">Sender Role</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setIsMe(true); setSenderName(activeCase.parties.find(p => p.role === 'plaintiff')?.name || 'Plaintiff'); }}
                  className={`py-1.5 text-xs font-semibold custom-geometry border ${
                    isMe ? 'bg-primary text-primary-foreground border-primary' : 'bg-input/30 text-muted-foreground border-border'
                  }`}
                >
                  Plaintiff (Me)
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setIsMe(false); setSenderName(activeCase.parties.find(p => p.role === 'defendant')?.name || 'Defendant'); }}
                  className={`py-1.5 text-xs font-semibold custom-geometry border ${
                    !isMe ? 'bg-primary text-primary-foreground border-primary' : 'bg-input/30 text-muted-foreground border-border'
                  }`}
                >
                  Defendant
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted-foreground">Sender Display Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted-foreground">Date / Time Timestamp</label>
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted-foreground">Message Content Text</label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type exact text transcript from SMS or chat app..."
                className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
              />
            </div>

            <div className="p-3 bg-muted/40 border border-border custom-geometry space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={isAdmission}
                  onChange={(e) => setIsAdmission(e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
                <span>Tag as Opposing Party Admission (FRE 801(d)(2))</span>
              </label>

              {isAdmission && (
                <div>
                  <label className="text-[10px] font-mono uppercase text-muted-foreground">Legal Admission Note</label>
                  <input
                    type="text"
                    value={highlightNote}
                    onChange={(e) => setHighlightNote(e.target.value)}
                    placeholder="e.g., Defendant admits unit was clean and acknowledges $3,200 deposit."
                    className="w-full bg-input/50 border border-border p-2 text-xs focus:outline-none focus:border-primary mt-1"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleAddMessage}
              className="w-full py-2.5 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all custom-geometry"
            >
              Insert Message into Exhibit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
