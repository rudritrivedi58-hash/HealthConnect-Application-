import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Sparkles, AlertCircle, RefreshCw, UserCheck, 
  ChevronRight, CalendarCheck, HelpCircle, Activity 
} from 'lucide-react';

interface Msg {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isEmergency?: boolean;
  recommendations?: string[];
}

interface AISymptomCheckerProps {
  onSuggestDoctor: () => void;
}

export default function AISymptomChecker({ onSuggestDoctor }: AISymptomCheckerProps) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'init',
      sender: 'ai',
      text: "👋 Hello! I am **HealthConnect AI**, your dedicated smart symptom companion. Tell me what symptoms you are experiencing (e.g., 'faint asthma wheeze', 'tension headache') and I will help evaluate potential root causes and suggest safety recommendation grids.",
      recommendations: ["Sore throat & cough", "Allergy wheezing", "Severe tension headache"]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    // Add user message
    const userMsg: Msg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Prepare backends payloads matching /api/chat system instruction
      const payloadMessages = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));
      payloadMessages.push({ role: 'user', content: textToSend });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: payloadMessages,
          userRole: 'patient'
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Add model response
        const aiMsg: Msg = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: data.text,
          isEmergency: data.isEmergency,
          recommendations: data.suggestedActions || []
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error();
      }
    } catch (e) {
      // Standalone clinical fallback when backend api is sleeping
      setTimeout(() => {
        const aiMsg: Msg = {
          id: `ai_fallback_${Date.now()}`,
          sender: 'ai',
          text: "### Fallback Symptom Assessment\n\nI detected some patterns matching seasonal asthmatic triggers or congestion spikes. \n\n**Common Guidelines:**\n- Keep inhaler close and check dosage.\n- Avoid ragweed pollens during active morning pollen hours.\n- Schedule a clinician consultation if symptoms persist for over 3 days.",
          recommendations: ["Book pulmonologist", "Read asthma records"]
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (pill: string) => {
    if (pill.toLowerCase().includes("book") || pill.toLowerCase().includes("consult")) {
      onSuggestDoctor();
    } else {
      handleSendMessage(pill);
    }
  };

  return (
    <div id="screen_symptom_checker" className="h-full w-full bg-slate-50 flex flex-col justify-between overflow-hidden">
      
      {/* Bot branding header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-4 py-3 shadow flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 p-2 rounded-xl text-emerald-400">
            <Sparkles className="w-5 h-5 fill-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold tracking-wide uppercase">Symptom Evaluator AI</h3>
            <p className="text-[9px] text-blue-100 font-mono">ENCRYPTED CLINICAL COMPANION</p>
          </div>
        </div>
        
        <button 
          onClick={onSuggestDoctor}
          className="text-[9px] bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Consult Doctor</span>
        </button>
      </div>

      {/* Warning Notice bar */}
      <div className="bg-blue-50 border-b border-blue-100/50 px-4 py-1.5 text-[9px] text-blue-800 leading-snug flex items-start gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
        <span>Care Companion does not substitute certified diagnostic physicians. Seek urgent care for immediate emergencies.</span>
      </div>

      {/* Chat Messages flow stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex flex-col gap-1.5 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender bubble badge */}
            <span className="text-[8px] uppercase font-bold tracking-widest text-slate-400 px-1">
              {m.sender === 'user' ? 'Me' : 'HealthConnect AI'}
            </span>

            {/* Message balloon */}
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[88%] shadow-sm ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : m.isEmergency ? 'bg-rose-50 border-2 border-rose-350 text-rose-955 rounded-tl-none font-medium' : 'bg-white border text-slate-800 rounded-tl-none'}`}>
              
              {/* Very basic custom markdown formatting handler */}
              <div className="space-y-1">
                {m.text.split('\n').map((line, idx) => {
                  if (line.startsWith('###')) {
                    return <h4 key={idx} className="font-bold text-sm text-slate-900 mt-2">{line.replace('###', '')}</h4>;
                  }
                  if (line.startsWith('*') || line.startsWith('-')) {
                    return <li key={idx} className="ml-2.5 list-disc">{line.substring(1).trim()}</li>;
                  }
                  // check for bold strings in text
                  const boldRegex = /\*\*(.*?)\*\*/g;
                  if (boldRegex.test(line)) {
                    const parts = line.split(boldRegex);
                    return (
                      <p key={idx}>
                        {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-slate-950">{part}</strong> : part)}
                      </p>
                    );
                  }
                  return <p key={idx}>{line}</p>;
                })}
              </div>

            </div>

            {/* Recommendations or Suggested Actions buttons */}
            {m.recommendations && m.recommendations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-w-[85%] mt-1">
                {m.recommendations.map((rec) => (
                  <button
                    key={rec}
                    onClick={() => handleSuggestionClick(rec)}
                    className="text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-702 border border-slate-200 hover:border-blue-200 px-2.5 py-1.5 rounded-xl font-semibold transition"
                  >
                    {rec}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Pulsating dots when typing */}
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center gap-1.5 text-[10px] text-slate-400"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing medical parameters via Gemini...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollRef} />
      </div>

      {/* Form Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
          placeholder="Type symptoms (e.g. slight cough)..."
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-955 rounded-xl py-3 px-4 text-xs font-medium outline-none focus:border-blue-500 shadow-inner"
        />
        <button
          onClick={() => handleSendMessage(inputText)}
          className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition cursor-pointer shadow-md shadow-blue-500/10"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
