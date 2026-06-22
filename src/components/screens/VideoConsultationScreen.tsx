import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, MicOff, Video, VideoOff, FileText, PhoneOff, Send, 
  MessageSquare, Layout, Check, ShieldCheck, Download
} from 'lucide-react';

interface VideoConsultationScreenProps {
  doctorName?: string;
  specialty?: string;
  onEndCall: () => void;
}

export default function VideoConsultationScreen({ 
  doctorName = "Dr. Sarah Jameson, MD", 
  specialty = "Pulmonology Expert",
  onEndCall 
}: VideoConsultationScreenProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{sender: 'doc' | 'me', text: string, time: string}>>([
    { sender: 'doc', text: "Hello Alex, I am analyzing your seasonal breathing log. Can you breathe deeply for me?", time: "2:01 PM" },
    { sender: 'me', text: "Sure doctor. I feel slight wheezing today upon waking up.", time: "2:02 PM" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isReportShared, setIsReportShared] = useState(false);
  const [sharedReportTitle, setSharedReportTitle] = useState('');
  const [callDuration, setCallDuration] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Call timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Electrocardiogram Canvas Wave Generator effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const points: number[] = [];
    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw horizontal baseline grid
      ctx.strokeStyle = '#3b82f640';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Shift wave positions
      x += 1.5;
      if (x > width) x = 0;

      // Draw custom EKG line
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#10b981';
      ctx.beginPath();

      for (let i = 0; i < width; i++) {
        let y = height / 2;
        // Periodic heartbeat spikes
        const modifier = (i + x) % 90;
        if (modifier < 10) {
          // P-Wave
          y -= 4;
        } else if (modifier >= 15 && modifier < 20) {
          // QRS spike downward
          y += 8;
        } else if (modifier >= 20 && modifier < 24) {
          // QRS giant spike upward
          y -= 25;
        } else if (modifier >= 24 && modifier < 28) {
          // S-wave giant drop
          y += 18;
        } else if (modifier >= 32 && modifier < 45) {
          // T-wave round bump
          y -= 8;
        }
        
        if (i === 0) {
          ctx.moveTo(i, y);
        } else {
          ctx.lineTo(i, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'me', text: inputText, time: stamp }]);
    setInputText('');

    // Simulate quick reassuring doctor response after short delay
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'doc', 
        text: "I see. Let's inspect the Montelukast intake on your Medication reminder next.", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    }, 1200);
  };

  const sharePrescription = () => {
    setIsReportShared(true);
    setSharedReportTitle("Complete CBC & Lab Allergy report.pdf");
    setTimeout(() => {
      const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { 
        sender: 'me', 
        text: "📎 Shared File: 'CBC & Lab Allergy report.pdf'", 
        time: stamp 
      }]);
    }, 500);
  };

  return (
    <div id="screen_video_consultation" className="h-full w-full bg-slate-950 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top Banner overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 pointer-events-auto flex items-center gap-1.5 text-white">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Live HD</span>
          <span className="text-[10px] pb-0.5 text-slate-300 font-mono">| {formatDuration(callDuration)}</span>
        </div>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-slate-900/80 backdrop-blur-md p-2.5 rounded-full border border-slate-800 pointer-events-auto text-white hover:bg-slate-800 transition shadow"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

      {/* Main Video consultative screen contents */}
      <div className="flex-1 w-full relative flex flex-col justify-center items-center">
        
        {/* LARGE DOCTOR CAMERA CONTAINER */}
        <div className="absolute inset-0 bg-slate-900 flex justify-center items-center">
          <img 
            src="https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=400&auto=format&fit=crop" 
            alt="Doctor Full Telehealth view"
            className="w-full h-full object-cover opacity-90 transition-all duration-300"
            referrerPolicy="no-referrer"
            style={{ filter: isCamOff ? 'none' : 'contrast(1.03) saturate(1.05)' }}
          />

          {/* Clinician Watermark metadata overlaid */}
          <div className="absolute bottom-4 left-4 text-left p-3.5 bg-slate-900/75 border border-slate-800 rounded-2xl backdrop-blur">
            <h4 className="font-bold text-xs text-white">{doctorName}</h4>
            <p className="text-[10px] text-blue-400 font-medium">{specialty}</p>
          </div>
        </div>

        {/* SELF CORNER VIEW SHOWN FLOATING */}
        {!isCamOff && (
          <div className="absolute top-16 right-4 w-28 h-40 bg-slate-800 border-2 border-white/20 rounded-xl overflow-hidden shadow-xl z-10 transition">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
              alt="Self preview camera"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-1 right-2 text-[8px] text-white/90 bg-slate-900/60 px-1 py-0.5 rounded uppercase font-bold">
              Me
            </span>
          </div>
        )}

        {/* REUSE CANVAS FOR PHYSICAL BIOMETRIC WAVE OVERLAY */}
        <div className="absolute top-16 left-4 w-32 h-14 bg-slate-950/75 border border-slate-800 rounded-xl overflow-hidden shadow backdrop-blur z-10 p-1 flex flex-col justify-between">
          <span className="text-[8px] font-bold text-slate-300 tracking-wider text-left pl-1 uppercase">ECG Wave Vitals</span>
          <canvas ref={canvasRef} width={120} height={35} className="w-full h-[35px]" />
        </div>

        {/* FLOATING CHAT PANEL OVERLAY */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ x: 260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 260, opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-slate-950/95 border-l border-slate-800 z-30 flex flex-col p-4 shadow-2xl backdrop-blur-md"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs font-black text-white uppercase tracking-wider">Tele-Consult Chat</span>
                <span className="text-[9px] bg-slate-900 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase">Secured</span>
              </div>

              {/* Chat list */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3.5 flex flex-col justify-start">
                {messages.map((m, idx) => (
                  <div key={idx} className={`max-w-[85%] flex flex-col gap-0.5 ${m.sender === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
                    <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${m.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                      {m.text}
                    </div>
                    <span className="text-[8px] text-slate-501 font-mono">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Form */}
              <div className="flex gap-1.5 mt-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type message..."
                  className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-lg p-2 text-xs outline-none focus:border-blue-500 font-medium"
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons Panel */}
      <div className="bg-slate-900/80 border-t border-slate-800 p-5 backdrop-blur flex justify-around items-center z-10">
        
        {/* Toggle Mic */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3.5 rounded-full transition-all cursor-pointer ${isMuted ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-slate-800 text-white border border-slate-705/30'}`}
          title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Toggle Cam */}
        <button 
          onClick={() => setIsCamOff(!isCamOff)}
          className={`p-3.5 rounded-full transition-all cursor-pointer ${isCamOff ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-slate-800 text-white border border-slate-705/30'}`}
          title={isCamOff ? 'Turn webcam on' : 'Turn webcam off'}
        >
          {isCamOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        {/* Share Medical Records */}
        <button 
          onClick={sharePrescription}
          className={`p-3.5 rounded-full transition-all cursor-pointer ${isReportShared ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white border border-slate-705/30'}`}
          title="Share medical report with clinician"
        >
          {isReportShared ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
        </button>

        {/* End consultation Call */}
        <button 
          id="btn_end_consultation"
          onClick={onEndCall}
          className="p-3.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition duration-200 cursor-pointer shadow-lg shadow-rose-600/25"
          title="End consult call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
