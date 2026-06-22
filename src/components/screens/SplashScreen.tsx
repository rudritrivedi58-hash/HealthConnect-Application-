import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      id="screen_splash" 
      className="h-full w-full flex flex-col justify-between p-8 bg-gradient-to-b from-[#f0f9ff] via-white to-[#f0fdf4] text-slate-800"
    >
      {/* Top Spacer */}
      <div />

      {/* Main Branding Block */}
      <div className="flex flex-col items-center text-center">
        {/* Glowing animated medical logo */}
        <div className="relative mb-6">
          <motion.div 
            className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full"
            animate={{ 
              scale: [1, 1.25, 1],
              opacity: [0.5, 0.8, 0.5] 
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          
          <motion.div 
            className="relative bg-gradient-to-tr from-blue-600 to-emerald-500 text-white p-5 rounded-3xl shadow-lg shadow-blue-500/20"
            animate={{ 
              y: [-6, 6, -6],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <HeartPulse className="w-14 h-14" />
          </motion.div>

          <motion.div 
            className="absolute -bottom-1 -right-1 bg-white text-emerald-600 p-1.5 rounded-full border border-emerald-100 shadow-md"
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldCheck className="w-5 h-5 fill-emerald-50" />
          </motion.div>
        </div>

        {/* Brand Names */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Health<span className="text-blue-600">Connect</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm tracking-wide mt-2">
          Your Health, Connected
        </p>

        {/* Pulsing tagline graphic */}
        <div className="flex items-center gap-1.5 mt-5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Material UI 3 Prototype v2.5</span>
        </div>
      </div>

      {/* Loading Bar and Footnotes */}
      <div className="w-full flex flex-col items-center gap-4">
        {/* Loading progress slider bar */}
        <div className="w-full max-w-[220px]">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 font-mono">
            <span>Securing encrypted handshake...</span>
            <span>{progress}%</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 font-medium">
          🔒 HIPAA Compliant TLS Guard
        </p>
      </div>
    </div>
  );
}
