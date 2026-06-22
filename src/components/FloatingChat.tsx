import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Send, Sparkles, AlertTriangle, PhoneCall, 
  MapPin, Mic, MicOff, Volume2, VolumeX, Paperclip, Image as ImageIcon,
  Check, Calendar, Activity, ChevronRight, CornerDownRight, RefreshCcw
} from 'lucide-react';
import { Message, Appointment, Medication, MedicalRecord } from '../types';

interface FloatingChatProps {
  currentRole: 'patient' | 'doctor';
  userProfile: any;
  onRefreshData?: () => void;
  // Deep-link helpers to automatically handle operations in parent views
  onBookAppointmentShortcut?: (doctor: string, specialty: string, date: string, time: string) => void;
  onRefillMedicationShortcut?: (medId: string) => void;
}

export default function FloatingChat({ 
  currentRole, 
  userProfile, 
  onRefreshData,
  onBookAppointmentShortcut,
  onRefillMedicationShortcut
}: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null); // message id being read
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; size: string; previewUrl?: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversations with safe friendly greeting
  useEffect(() => {
    if (messages.length === 0) {
      if (currentRole === 'patient') {
        setMessages([
          {
            id: 'welcome_pat',
            role: 'assistant',
            content: `Hello **Alex Rivera**! I am **CareAI**, your virtual health companion. 👨‍⚕️\n\nI have securely integrated your health profile, chronic conditions (Mild Asthma, Seasonal Allergies) and historical stats.\n\n*How can I help you today?* You can ask me to **assess symptoms**, **review lab results**, **book appointments**, or **explain dosage notes**.\n\n*⚠️ Warning: This app is a Virtual Assistant for informational support and does not replace professional medical diagnosis.*`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: ["Check symptoms", "Explain lab reports", "When is my next refill?", "Book cardiology slot"]
          }
        ]);
      } else {
        setMessages([
          {
            id: 'welcome_doc',
            role: 'assistant',
            content: `Welcome **${userProfile?.name || 'Doctor'}**! I am your clinical copilot.\n\nI am connected to patient **Alex Rivera's** active EHR. You can ask me to:\n*   \`Summarize Patient History\`\n*   \`Draft Consultation Notes\`\n*   \`Match Diagnostic ICD-10 Codes\`\n*   \`Check for Penicillin interactions\`\n\nHow can I speed up your clinical workflow today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: ["Summarize Patient History", "Draft Consultation Notes", "Look up ICD-10 Codes"]
          }
        ]);
      }
    }
  }, [currentRole, userProfile]);

  // Autoscroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    
    // Simulate Speech-to-Text capturing phrases
    setTimeout(() => {
      setIsListening(false);
      const simulationPhrases = currentRole === 'patient' 
        ? [
            "I have chest pain and shortness of breath",
            "When should I take my antibiotics dosage?",
            "Book a cardiologist appointment for tomorrow afternoon",
            "Explain my latest blood test report indicators"
          ]
        : [
            "Summarize Alex Rivera's asthma and penicillin alerts",
            "Generate consultation diagnostic notes",
            "Suggest diagnosis codes for seasonal asthma"
          ];
      
      const randomPhrase = simulationPhrases[Math.floor(Math.random() * simulationPhrases.length)];
      setInputValue(randomPhrase);
    }, 2800);
  };

  const speakMessage = (text: string, msgId: string) => {
    if (!speechEnabled) return;
    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }
    
    window.speechSynthesis.cancel();
    // Strip markdown tags and emoji for cleaner synthesis output
    const cleanText = text
      .replace(/[\#\*\_`]/g, '')
      .replace(/🚨|⚠️|👨‍⚕️|🏥|📞/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => {
      setIsSpeaking(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(null);
    };

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const previewUrl = isImg ? URL.createObjectURL(file) : undefined;
    
    setSelectedFile({
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      previewUrl
    });
  };

  const testTriggerShortcuts = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Booking shortcuts trigger
    if (lowerText.includes("appointment") || lowerText.includes("book") || lowerText.includes("cardiologist")) {
      if (onBookAppointmentShortcut) {
        // Trigger simulation shortcut in mock DB
        setTimeout(() => {
          onBookAppointmentShortcut(
            "Dr. Robert Chen",
            "Cardiology",
            new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "14:00"
          );
        }, 1500);
      }
    }

    // Refill shortcuts trigger
    if (lowerText.includes("refill") || lowerText.includes("albuterol")) {
      if (onRefillMedicationShortcut) {
        setTimeout(() => {
          onRefillMedicationShortcut("med_1");
        }, 1500);
      }
    }
  };

  const triggerSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() && !selectedFile) return;

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: timestampStr,
      fileAttachment: selectedFile || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setSelectedFile(null);
    setIsLoading(true);

    // Call real backend endpoint proxy
    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          userRole: currentRole
        })
      });

      if (!res.ok) throw new Error("API Route failure");

      const data = await res.json();
      
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestedActions || [],
        isEmergency: data.isEmergency
      };

      setMessages(prev => [...prev, botMsg]);

      // Check shortcuts triggering actions
      testTriggerShortcuts(textToSend);

      // Auto TTS if user requested & speech enabled
      if (speechEnabled) {
        speakMessage(data.text, botMsg.id);
      }

      if (onRefreshData) {
        onRefreshData();
      }

    } catch (err) {
      console.warn("Using smart inline fallback mechanism standard:", err);
      // Simulate fallback gracefully if dev port disconnects
      setTimeout(() => {
        const fallbackText = `Let me support you under **${currentRole.toUpperCase()}** parameters.\n\n*   Your active logs indicate **Alex** is taking **Montelukast (10mg tablet)** daily at **21:30**.\n*   Your last CBC Lab showed normal values except White Blood Cell counts (**11.2 K/uL**), possibly related to seasonal ragweed sensitivity.\n\n*Would you like me to book a specialist appointment to check these asthmatic concerns?*`;
        const botMsg: Message = {
          id: `bot_fb_${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ["Schedule Asthma Clinic", "Show Active Reminders", "View Lab Panels"]
        };
        setMessages(prev => [...prev, botMsg]);
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="floating_care_widget" className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none md:bottom-8 md:right-8">
      
      {/* Expanded Chat Dialog (Glassmorphism design) */}
      {isOpen && (
        <div 
          id="chat_dialog_window"
          className="pointer-events-auto w-[92vw] sm:w-[420px] h-[580px] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 animate-fadeIn"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950/80 p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 p-[2px]">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-cyan-400 text-xs font-mono">
                    AI
                  </div>
                </div>
                {/* Active breath indicators */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping"></span>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-wide text-slate-100">CareAI Assistant</h3>
                  <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1.5 rounded-full font-mono uppercase font-semibold">
                    {currentRole}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  24/7 Virtual Medical Companion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                id="btn_toggle_speech"
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-2 rounded-lg transition-colors ${speechEnabled ? 'text-cyan-400 bg-cyan-950/30 hover:bg-cyan-950/50' : 'text-slate-500 hover:text-slate-300'}`}
                title={speechEnabled ? "Mute Voice Reading" : "Enable Voice Reading"}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button 
                id="btn_close_chat"
                onClick={handleOpenToggle}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream View */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans scrollbar-thin bg-slate-900/40">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
              >
                {/* Bot Avatar on Left */}
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center font-mono text-[10px] font-bold text-cyan-400 shrink-0 select-none">
                    CA
                  </div>
                )}

                {/* Bubble content */}
                <div className="max-w-[85%] flex flex-col gap-1">
                  <div 
                    id={`msg_bubble_${msg.id}`}
                    className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed border ${
                      msg.role === 'user' 
                        ? 'bg-cyan-600 text-slate-950 font-medium border-cyan-500/40 rounded-tr-none' 
                        : msg.isEmergency
                          ? 'bg-rose-950/80 border-rose-500/50 text-rose-100 rounded-tl-none ring-2 ring-rose-500/20'
                          : 'bg-slate-800/80 border-slate-700/60 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {/* Render attachment inline if exists */}
                    {msg.fileAttachment && (
                      <div className="mb-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                        {msg.fileAttachment.previewUrl ? (
                          <img src={msg.fileAttachment.previewUrl} className="w-10 h-10 object-cover rounded-md border border-slate-700" alt="Preview" />
                        ) : (
                          <div className="p-1.5 bg-slate-800 rounded text-cyan-400"><Paperclip className="w-4 h-4" /></div>
                        )}
                        <div className="overflow-hidden">
                          <p className="text-[11px] truncate font-medium text-slate-200">{msg.fileAttachment.name}</p>
                          <p className="text-[9px] text-slate-400">{msg.fileAttachment.size}</p>
                        </div>
                      </div>
                    )}

                    {/* Support rich spacing / linebreaks securely */}
                    <div className="whitespace-pre-wrap select-text markdown-styles text-slate-100 font-sans">
                      {msg.content.split('\n').map((para, i) => {
                        // Very simple markdown bold parser
                        let text = para;
                        text = text.replace(/\*\*(.*?)\*\*/g, '$1');
                        text = text.replace(/\*(.*?)\*/g, '$1');
                        return <p key={i} className={i > 0 ? "mt-2" : ""}>{text}</p>;
                      })}
                    </div>

                    {/* Audio read option for bots */}
                    {msg.role !== 'user' && (
                      <button 
                        onClick={() => speakMessage(msg.content, msg.id)}
                        className={`mt-2 flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider ${isSpeaking === msg.id ? 'text-amber-400 font-semibold animate-pulse' : 'text-slate-400 hover:text-white'}`}
                      >
                        <Volume2 className="w-3 h-3" /> {isSpeaking === msg.id ? "Speaking Active..." : "Read Aloud"}
                      </button>
                    )}
                  </div>

                  {/* Near Hospitals Module for Emergency Situation */}
                  {msg.isEmergency && (
                    <div id="emergency_actions_module" className="mt-2.5 bg-gradient-to-br from-red-950 to-slate-900 border border-red-500/40 rounded-2xl p-3 space-y-2.5">
                      <div className="flex items-center gap-2 text-rose-400 text-xs font-bold font-mono">
                        <AlertTriangle className="w-4 h-4 text-rose-500 animate-spin" /> CLOSEST TRAUMA CARE:
                      </div>
                      
                      <div className="space-y-1 text-[11px] text-slate-300">
                        <div className="flex items-start gap-1 justify-between">
                          <span className="font-semibold text-white">🏥 Mercy General Emergency</span>
                          <span className="text-emerald-400 font-mono text-[9px]">0.8 miles</span>
                        </div>
                        <p className="text-[10px] text-slate-400">2515 N Michigan Avenue, Open 24 Hours</p>
                      </div>

                      <div className="flex flex-col gap-1.5 pt-1">
                        <a 
                          href="tel:911"
                          className="w-full bg-rose-600 hover:bg-rose-500 text-white py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-600/20"
                        >
                          <PhoneCall className="w-3.5 h-3.5" /> Call Critical Emergency (911)
                        </a>
                        <button 
                          onClick={() => setInputValue("Show map of closest cardiology trauma hubs")}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-medium transition-all"
                        >
                          <MapPin className="w-3 h-3 text-cyan-400" /> Plot Route on Maps (GPS)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Suggestions Chips below bubble */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div id="quick_reply_chips" className="flex flex-wrap gap-1.5 mt-2 justify-start max-w-full">
                      {msg.suggestions.map((sug, id) => (
                        <button
                          key={id}
                          onClick={() => triggerSendMessage(sug)}
                          className="text-[10px] bg-slate-800 hover:bg-cyan-950/40 text-cyan-400 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/40 rounded-full px-2.5 py-1.5 transition-all text-left font-medium cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`text-[9px] text-slate-500 mt-1 capitalize ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Simulated Voice Activity waves */}
            {isListening && (
              <div id="voice_waves" className="p-3 bg-slate-800/40 border border-cyan-500/20 rounded-2xl flex items-center justify-between gap-3 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-cyan-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded bg-cyan-400 animate-bounce delay-100"></span>
                  <span className="w-2 h-2 rounded bg-cyan-400 animate-bounce delay-200"></span>
                  <p className="text-xs text-slate-300 font-mono">Listening to clinical speech...</p>
                </div>
                <button 
                  onClick={() => setIsListening(false)}
                  className="text-xs bg-rose-600 px-2 py-0.5 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Loader bubble */}
            {isLoading && (
              <div id="chat_loader" className="flex gap-2 items-center justify-start text-xs text-slate-400 animate-pulse mt-2 ml-3">
                <RefreshCcw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>CareAI is retrieving medical context...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Selected file attachment bar preview */}
          {selectedFile && (
            <div id="file_attachment_preview" className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                {selectedFile.previewUrl ? (
                  <img src={selectedFile.previewUrl} className="w-8 h-8 object-cover rounded border border-slate-700" alt="Preview" />
                ) : (
                  <Paperclip className="w-4 h-4 text-cyan-400 shrink-0" />
                )}
                <div className="overflow-hidden text-left">
                  <p className="text-[10px] text-slate-300 truncate font-mono">{selectedFile.name}</p>
                  <p className="text-[8px] text-slate-500">{selectedFile.size}</p>
                </div>
              </div>
              <button 
                id="btn_remove_attachment"
                onClick={() => setSelectedFile(null)}
                className="p-1 text-rose-400 hover:text-rose-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input control Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              
              {/* Image Input */}
              <button 
                id="btn_select_image"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*";
                    fileInputRef.current.click();
                  }
                }}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Upload Clinical Asset Image"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
              </button>

              {/* Document Input */}
              <button 
                id="btn_select_file"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "*/*";
                    fileInputRef.current.click();
                  }
                }}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Upload EHR/Lab Files"
              >
                <Paperclip className="w-4 h-4 text-cyan-400" />
              </button>

              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                onChange={handleFileUpload}
              />

              <div className="flex-1 relative">
                <input 
                  id="chat_input_field"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') triggerSendMessage(inputValue);
                  }}
                  placeholder={currentRole === 'patient' ? "Ask about symptoms, pills, booking..." : "Summarize patient, draft codes..."}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                
                {/* Voice Record Mic inside input */}
                <button 
                  id="btn_trigger_mic"
                  onClick={handleVoiceCommand}
                  className={`absolute right-1.5 top-1.5 p-1 rounded-md transition-colors ${isListening ? 'bg-red-600 text-white animate-pulse' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  title="Simulate Voice Command Dictation"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Send Button */}
              <button 
                id="btn_send_message"
                onClick={() => triggerSendMessage(inputValue)}
                disabled={!inputValue.trim() && !selectedFile}
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 font-bold" />
              </button>
            </div>

            {/* Disclaimer strip wrapper */}
            <div className="text-[9px] text-slate-500 text-center mt-2 flex justify-center items-center gap-1">
              <span>CareAI virtual triage protocol.</span>
              <span className="text-[8px] bg-slate-900 px-1 rounded border border-slate-800">API ACTIVE</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button Widget with Notification badge */}
      <button
        id="btn_floating_widget_trigger"
        onClick={handleOpenToggle}
        className="pointer-events-auto bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 p-4 rounded-full shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer relative"
      >
        {isOpen ? (
          <X className="w-6 h-6 font-bold" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 shrink-0" />
            
            {/* Unread dot indicator */}
            {unreadCount > 0 && (
              <span id="floating_unread_badge" className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

    </div>
  );
}
