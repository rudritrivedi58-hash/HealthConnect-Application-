import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, MapPin, Phone, MessageSquare, AlertTriangle, 
  X, RefreshCw, Send, ShieldCheck, Heart 
} from 'lucide-react';

export default function EmergencySOSScreen() {
  const [sosState, setSosState] = useState<'idle' | 'countdown' | 'engaged'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [coordinates, setCoordinates] = useState({ lat: '41.8781° N', lng: '87.6298° W' });
  const [locationTimer, setLocationTimer] = useState<any>(null);

  // Countdown timer trigger
  useEffect(() => {
    let timer: any;
    if (sosState === 'countdown') {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSosState('engaged');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sosState]);

  // Simulate GPS coordinate updates
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate micro fluctuation in location coordinates
      const randomDec = (Math.random() * 0.0009).toFixed(4);
      setCoordinates({
        lat: `41.87${Math.floor(80 + Math.random() * 3)}° N`,
        lng: `87.62${Math.floor(90 + Math.random() * 5)}° W`
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const triggerSOS = () => {
    setSosState('countdown');
  };

  const cancelSOS = () => {
    setSosState('idle');
  };

  // Nearby clinical assets
  const closestHospitals = [
    { name: "Northwestern Memorial ER", distance: "0.6 Miles", phone: "+1 (312) 555-0192", time: "4 mins" },
    { name: "Mercy Hospital Critical Care", distance: "1.4 Miles", phone: "+1 (312) 555-0144", time: "9 mins" }
  ];

  return (
    <div id="screen_sos" className="h-full w-full bg-slate-900 text-white flex flex-col justify-between overflow-y-auto">
      
      {sosState === 'idle' ? (
        // IDLE STATE: READY FOR SOS
        <div className="p-5 flex-1 flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="inline-block bg-rose-500/10 border border-rose-500/30 text-rose-500 p-2 rounded-2xl">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-base font-extrabold tracking-tight">Emergency SOS Guardian</h2>
              <p className="text-[10px] text-slate-400">One-tap triggers immediate dispatch to medical allies</p>
            </div>

            {/* GPS Telemetry share box */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-500/15 text-rose-500 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[8px] uppercase tracking-widest text-slate-500 block font-bold">Live GPS Telemetry (Sharing)</span>
                  <span className="text-xs font-mono font-bold text-slate-300">Lat: {coordinates.lat} | Lng: {coordinates.lng}</span>
                </div>
              </div>

              <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">
                Active
              </span>
            </div>

            {/* Emergency Contacts columns */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left pl-1">Primary Contacts</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between text-left gap-2.5">
                  <div>
                    <h5 className="font-bold text-xs">Julia Rivera</h5>
                    <span className="text-[9px] text-slate-500">Spouse • Primary Ally</span>
                  </div>
                  <a href="tel:5550190" className="bg-slate-850 p-2 rounded-xl text-center text-rose-500 font-bold hover:bg-slate-800 transition text-[10px] flex items-center justify-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Call Spouse
                  </a>
                </div>

                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between text-left gap-2.5">
                  <div>
                    <h5 className="font-bold text-xs">Dr. Sarah Jameson</h5>
                    <span className="text-[9px] text-slate-500">Cardio Clinician Doctor</span>
                  </div>
                  <a href="tel:5550189" className="bg-slate-850 p-2 rounded-xl text-center text-blue-400 font-bold hover:bg-slate-800 transition text-[10px] flex items-center justify-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Call Clinic Doctor
                  </a>
                </div>
              </div>
            </div>

            {/* Nearby Hospital Assets list */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left pl-1">Nearby Emergency Rooms</h3>
              
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl divide-y divide-slate-850/60 p-1 flex flex-col">
                {closestHospitals.map((h, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 text-xs">
                    <div className="text-left space-y-0.5">
                      <h5 className="font-bold text-slate-200">{h.name}</h5>
                      <p className="text-[9.5px] text-slate-501">{h.distance} away • {h.time} dispatch trip</p>
                    </div>

                    <a href={`tel:${h.phone}`} className="p-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition">
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* GIANT SOS BUTTON CAROUSEL */}
          <div className="flex flex-col items-center py-4 space-y-4">
            <div className="relative">
              {/* Spinning alert circles */}
              <motion.div 
                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="absolute inset-x-0 -inset-y-0 border-4 border-rose-600 rounded-full w-36 h-36 -m-4 opacity-50 pointer-events-none"
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-x-0 -inset-y-0 border-2 border-emerald-500 rounded-full w-36 h-36 -m-4 opacity-30 pointer-events-none"
              />

              <button
                id="btn_trigger_sos"
                onClick={triggerSOS}
                className="relative bg-gradient-to-tr from-rose-600 to-red-600 w-28 h-28 rounded-full border-4 border-rose-400 shadow-2xl flex flex-col justify-center items-center gap-1 active:scale-95 transition cursor-pointer"
              >
                <ShieldAlert className="w-10 h-10 text-white animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest text-shadow">SOS</span>
              </button>
            </div>

            <p className="text-[9.5px] text-slate-400 italic">
              🚨 Long-press or single tap triggers immediate medical dispatch
            </p>
          </div>

        </div>
      ) : sosState === 'countdown' ? (
        // COUNTDOWN STATE
        <div className="p-6 flex-1 flex flex-col justify-between items-center text-center bg-rose-950/90">
          <div />

          <div className="space-y-6">
            <div className="bg-white/10 p-5 rounded-full inline-block animate-spin duration-3000">
              <RefreshCw className="w-12 h-12 text-rose-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-rose-200 uppercase tracking-widest">Calling responders...</h2>
              <p className="text-xs text-slate-300">Sending medical history to closest critical care team</p>
            </div>

            {/* Huge dynamic counter */}
            <motion.div 
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              className="text-7xl font-black text-white pr-2.5 font-mono"
            >
              {countdown}
            </motion.div>
          </div>

          {/* Cancel SOS */}
          <button
            onClick={cancelSOS}
            className="w-full bg-white text-rose-950 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-1"
          >
            <X className="w-4 h-4" /> Cancel Dispatch Request
          </button>
        </div>
      ) : (
        // ENGAGED ACTIVE EMERGENCY STATE
        <div className="p-6 flex-1 flex flex-col justify-between items-center text-center bg-rose-950">
          <div />

          <div className="space-y-5">
            <motion.div
              animate={{ scale: [0.9, 1.2, 0.9] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="bg-rose-600 p-5 rounded-full inline-block text-white shadow-2xl"
            >
              <AlertTriangle className="w-14 h-14" />
            </motion.div>

            <div className="space-y-1.5 px-3">
              <h2 className="text-xl font-black text-white uppercase tracking-widest">SOS ENGAGED!</h2>
              <p className="text-xs text-rose-300">An emergency call and GPS telemetry link has been opened with Northwestern Memorial ER.</p>
            </div>

            {/* GPS Link summary receipt info */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-rose-900/40 text-left font-mono text-[10.5px] text-rose-200 space-y-1.5 shadow-inner">
              <p>🏥 Primary Target: Northwestern Memorial ER</p>
              <p>📍 Location Grid: {coordinates.lat}, {coordinates.lng}</p>
              <p>📋 Linked Medical Records: Mild Asthma, Allergies: Penicillin</p>
              <p>📞 Notified Family: Julia Rivera (SMS active)</p>
            </div>
          </div>

          {/* False Alarm Dismiss button */}
          <button
            onClick={cancelSOS}
            className="w-full bg-white text-rose-950 font-black py-3.5 rounded-xl text-xs tracking-wider uppercase"
          >
            Dismiss SOS • False Alarm
          </button>
        </div>
      )}

    </div>
  );
}
