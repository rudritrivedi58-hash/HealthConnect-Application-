import { useState } from 'react';
import { User, Activity, ShieldCheck, HeartPulse, Sparkles, LogIn } from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: 'patient' | 'doctor') => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');

  return (
    <div id="login_screen" className="min-h-screen bg-slate-900 flex flex-col justify-between p-6 text-white relative overflow-hidden font-sans">
      {/* Decorative ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center gap-3 justify-center pt-8 z-10">
        <div className="bg-cyan-500/20 p-2.5 rounded-xl border border-cyan-500/30">
          <HeartPulse className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">CareAI</h1>
          <p className="text-xs text-slate-400 tracking-wider uppercase font-mono">Virtual Health Systems</p>
        </div>
      </div>

      {/* Core card layout */}
      <div className="w-full max-w-md mx-auto my-auto bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl z-10">
        
        {/* Welcome assistant box */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700/40 mb-6 flex gap-3.5 relative">
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-slate-950 shrink-0 shadow-lg shadow-cyan-500/20 text-sm">
            AI
          </div>
          <div>
            <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1 font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Welcome Assistant
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Hello! I am your CareAI companion. Choose your profile to explore. 
              Under <strong>Patient</strong>, you can assess symptoms, manage prescriptions, and review real labs. 
              Under <strong>Doctor</strong>, you can auto-generate clinical EHR notes and ICD-10 suggestions.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-900/60 p-1 rounded-xl border border-slate-700/60 flex mb-6">
          <button
            id="tab_patient"
            onClick={() => setActiveTab('patient')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'patient'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Patient Portal
          </button>
          <button
            id="tab_doctor"
            onClick={() => setActiveTab('doctor')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'doctor'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" /> Doctor Console
          </button>
        </div>

        {/* Role overview details */}
        {activeTab === 'patient' ? (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-semibold text-slate-200">Patient Profile Details</h3>
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/20 text-xs text-slate-300 space-y-2">
              <div className="flex justify-between"><span className="text-slate-500 font-mono">Full Name:</span> <span className="text-slate-100 font-semibold">Alex Rivera</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-mono">Age / Gender:</span> <span>34 yrs / Non-binary</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-mono">Conditions:</span> <span className="text-cyan-400 font-mono">Mild Asthma, Allergies</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-mono">Allergies:</span> <span className="text-rose-400 font-mono">Penicillin</span></div>
            </div>
            
            <button
              id="btn_login_patient"
              onClick={() => onLogin('patient')}
              className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 transition-all text-slate-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-sm shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 mt-4"
            >
              <LogIn className="w-4 h-4" /> Enter Patient Portal (Alex)
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-semibold text-slate-200">Physician Profile Details</h3>
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/20 text-xs text-slate-300 space-y-2">
              <div className="flex justify-between"><span className="text-slate-500 font-mono">Physician:</span> <span className="text-slate-100 font-semibold font-mono">Dr. Elizabeth Sarah, MD</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-mono">Specialty:</span> <span>Primary Care & Pulmonary Medicine</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-mono">Office Suite:</span> <span>Thoracic Wing, Suite #408</span></div>
              <div className="flex justify-between"><span className="text-slate-500 font-mono">Authority:</span> <span className="text-emerald-400 border border-emerald-500/30 px-1.5 rounded text-[10px] font-mono leading-none inline-block">Licensed prescriber</span></div>
            </div>

            <button
              id="btn_login_doctor"
              onClick={() => onLogin('doctor')}
              className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 transition-all text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-sm shadow-xl shadow-cyan-500/10 hover:shadow-blue-500/20 mt-4"
            >
              <LogIn className="w-4 h-4" /> Enter Doctor Console
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-500 flex flex-col items-center gap-2 z-10 bg-slate-950/20 py-3 rounded-xl border border-slate-800/40">
        <span className="flex items-center gap-1.5 text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fully HIPAA Compliant Security Protocol Verified
        </span>
        <p className="max-w-xs text-[10px] text-slate-500">
          All synthetic physical health information has been robustly encrypted end-to-end to protect patient safety.
        </p>
      </div>
    </div>
  );
}
