import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, Lock, Fingerprint, ShieldCheck, ArrowRight, Chrome } from 'lucide-react';

interface LoginSignupScreenProps {
  onLoginSuccess: (name: string, email: string) => void;
}

export default function LoginSignupScreen({ onLoginSuccess }: LoginSignupScreenProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('alex.rivera@healthy.com');
  const [phone, setPhone] = useState('+1 (555) 489-3920');
  const [password, setPassword] = useState('savedpass123');
  const [isSignMode, setIsSignMode] = useState(false); // toggle Login / Signup
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('Hold fingerprint to login');
  const [scanningCompleted, setScanningCompleted] = useState(false);

  // For visual illustration
  const scanTimerRef = useRef<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(isSignMode ? "Guest Patient" : "Alex Rivera", email);
  };

  const startFingerprintScan = () => {
    if (scanningCompleted) return;
    setIsScanning(true);
    setScanMessage('Scanning fingerprint sensor...');
    
    scanTimerRef.current = setTimeout(() => {
      setIsScanning(false);
      setScanMessage('Biometrics fully matched!');
      setScanningCompleted(true);
      setTimeout(() => {
        onLoginSuccess("Alex Rivera", "alex.rivera@healthy.com");
      }, 800);
    }, 1800);
  };

  const cancelFingerprintScan = () => {
    if (scanningCompleted) return;
    setIsScanning(false);
    setScanMessage('Hold fingerprint to login');
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
    }
  };

  return (
    <div 
      id="screen_login_signup" 
      className="h-full w-full flex flex-col justify-between overflow-y-auto px-6 py-6 bg-white text-slate-800"
    >
      {/* Upper Branded header */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5">
            <div className="bg-blue-600 text-white p-1 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">HealthConnect</span>
          </div>
          <button 
            id="btn_skip_auth"
            onClick={() => onLoginSuccess("Alex Rivera", "alex.rivera@healthy.com")}
            className="text-xs text-blue-600 font-semibold hover:opacity-85"
          >
            Quick Sandbox Log In
          </button>
        </div>

        {/* Custom Healthcare Vector Illustration */}
        <div className="w-full flex justify-center py-2 relative overflow-hidden">
          <svg className="w-48 h-32 text-blue-600" viewBox="0 0 200 120" fill="none">
            {/* Background floating nodes */}
            <motion.circle 
              cx="160" cy="30" r="10" fill="#e0f2fe" 
              animate={{ y: [0, -6, 0] }} 
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle 
              cx="40" cy="90" r="12" fill="#dcfce7" 
              animate={{ y: [0, 8, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Animated medical lines */}
            <path d="M 30,60 L 60,60 L 70,40 L 80,80 L 90,60 L 120,60" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3"/>
            <motion.path 
              d="M 30,60 L 60,60 L 70,40 L 80,80 L 90,60 L 170,60" 
              stroke="url(#gradient_line)" 
              strokeWidth="3" 
              strokeLinecap="round"
              animate={{ strokeDashoffset: [400, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              style={{ strokeDasharray: '40 20' }}
            />
            {/* Heart Core with pulses */}
            <g transform="translate(100, 50)">
              <motion.circle 
                cx="0" cy="0" r="24" fill="#3b82f6" fillOpacity="0.08"
                animate={{ scale: [0.9, 1.4, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.circle 
                cx="0" cy="0" r="14" fill="#10b981" fillOpacity="0.15"
                animate={{ scale: [0.9, 1.25, 0.9] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <circle cx="0" cy="0" r="8" fill="#3b82f6" />
            </g>
            <defs>
              <linearGradient id="gradient_line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Header content */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {isSignMode ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isSignMode ? "Let's kickstart your healthy connections" : "Access your secure HIPAA encrypted records"}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
          <button
            type="button"
            className={`flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-905'}`}
            onClick={() => setActiveTab('email')}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            type="button"
            className={`flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === 'phone' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-905'}`}
            onClick={() => setActiveTab('phone')}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {activeTab === 'email' ? (
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-colors"
                  placeholder="name@healthcare.com"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-colors"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</label>
              {!isSignMode && (
                <a href="#forgot" className="text-[10px] text-blue-600 font-bold hover:underline">Forgot?</a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-colors"
                placeholder="••••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <span>{isSignMode ? "Create Free Account" : "Access Secure Account"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {/* Divider text */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-[1px] bg-slate-100" />
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Or login with</span>
          <div className="flex-1 h-[1px] bg-slate-100" />
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={() => onLoginSuccess("Alex Rivera (Google)", "alex.rivera@google.com")}
          className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer text-xs"
        >
          <Chrome className="w-4 h-4 text-red-500" />
          <span>Continue with Google Single Sign-On</span>
        </button>
      </div>

      {/* Biometric Integration and bottom toggler */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center">
        {/* Rounded interactive Fingerprint Panel */}
        <div 
          className="flex flex-col items-center gap-1.5 p-3 bg-blue-50/50 rounded-2xl w-full max-w-[200px] text-center border border-blue-105/20"
          onMouseDown={startFingerprintScan}
          onMouseUp={cancelFingerprintScan}
          onMouseLeave={cancelFingerprintScan}
          onTouchStart={startFingerprintScan}
          onTouchEnd={cancelFingerprintScan}
        >
          <div className="relative">
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  className="absolute inset-0 bg-emerald-400 rounded-full"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
            </AnimatePresence>
            <div className={`p-3 bg-white border rounded-full shadow-sm cursor-pointer transition-colors ${isScanning ? 'border-emerald-500 text-emerald-600' : scanningCompleted ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-blue-100 text-blue-600'}`}>
              <Fingerprint className={`w-8 h-8 ${isScanning ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <span className={`text-[10px] font-bold ${scanningCompleted ? 'text-emerald-600' : isScanning ? 'text-blue-600' : 'text-slate-500'}`}>
            {scanMessage}
          </span>
        </div>

        {/* Account Swap Link */}
        <button
          onClick={() => setIsSignMode(!isSignMode)}
          className="text-xs text-slate-500 transition-colors hover:text-blue-600 font-medium mt-4 cursor-pointer"
        >
          {isSignMode ? (
            <>Already have an account? <span className="font-bold text-blue-600">Log In</span></>
          ) : (
            <>New to HealthConnect? <span className="font-bold text-blue-600">Sign Up Now</span></>
          )}
        </button>
      </div>
    </div>
  );
}
