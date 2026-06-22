import { useState, useEffect } from 'react';
import { 
  Smartphone, Monitor, Sparkles, Volume2, Power, RotateCcw,
  Check, Play, Bell, ShieldAlert, Award, Star, Activity, Heart,
  SmartphoneIcon, Home, Compass, Calendar, FolderHeart, UserRound, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Screens imports
import SplashScreen from './components/screens/SplashScreen';
import LoginSignupScreen from './components/screens/LoginSignupScreen';
import HomeScreen from './components/screens/HomeScreen';
import DoctorScreen from './components/screens/DoctorScreen';
import AppointmentBookingScreen from './components/screens/AppointmentBookingScreen';
import VideoConsultationScreen from './components/screens/VideoConsultationScreen';
import AISymptomChecker from './components/screens/AISymptomChecker';
import MedicalRecordsScreen from './components/screens/MedicalRecordsScreen';
import MedicationReminderScreen from './components/screens/MedicationReminderScreen';
import HealthAnalyticsDashboard from './components/screens/HealthAnalyticsDashboard';
import PaymentScreen from './components/screens/PaymentScreen';
import EmergencySOSScreen from './components/screens/EmergencySOSScreen';
import ProfileSettingsScreen from './components/screens/ProfileSettingsScreen';

// Full EHR Desktop Portal layouts
import LoginView from './components/LoginView';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import FloatingChat from './components/FloatingChat';

import { User, Appointment, MedicalRecord, Medication, HealthMetric } from './types';

export default function App() {
  // App navigation logic (Splash screen starts, then Login/Signup, then main Home)
  const [activeScreen, setActiveScreen] = useState<string>('splash');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // New Global ViewMode Switcher (Default to desktop for complete medical EHR control)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [desktopLoggedIn, setDesktopLoggedIn] = useState(true);
  const [desktopRole, setDesktopRole] = useState<'patient' | 'doctor'>('patient');
  
  // Custom Simulator state
  const [osStyle, setOsStyle] = useState<'ios' | 'android'>('ios');
  const [deviceColor, setDeviceColor] = useState<'slate' | 'gold' | 'blue'>('slate');
  const [phoneLocked, setPhoneLocked] = useState(false);
  const [pushNotification, setPushNotification] = useState<{ title: string; body: string } | null>(null);
  
  // Simulator aspect ratio state
  const [aspectRatio, setAspectRatio] = useState<'9.5:9' | '19.5:9' | '9:18'>('9.5:9');

  // Core Data models
  const [currentUser, setCurrentUser] = useState<any>({
    name: "Alex Rivera",
    email: "alex.rivera@healthy.com",
    age: 34,
    gender: "Non-binary",
    bloodType: "O-Positive",
    weight: "74 kg",
    height: "178 cm",
    chronicConditions: ["Mild Asthma", "Seasonal Allergies"],
    allergies: ["Penicillin", "Ragweed Pollen"]
  });

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "appt_1",
      doctorName: "Dr. Robert Chen, MD",
      specialty: "Cardiology",
      date: "2026-06-23",
      time: "02:00 PM",
      status: "upcoming",
      reason: "Post-stress cardiovascular test follow-up",
      symptoms: "Minor tightness under chest upon waking up."
    },
    {
      id: "appt_2",
      doctorName: "Dr. Sarah Jameson, MD",
      specialty: "Pulmonology",
      date: "2026-05-15",
      time: "10:30 AM",
      status: "completed",
      reason: "Asthma inhaler re-evaluation and allergy analysis",
      notes: "Asthma is well-controlled. Advised Montelukast qHS compliance."
    }
  ]);

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "med_1",
      name: "Albuterol HFA Inhaler",
      dosage: "90 mcg (2 puffs)",
      frequency: "Every 4 to 6 hours as needed for wheezing",
      reminderTimes: ["08:00 AM", "08:00 PM"],
      remainingRefills: 2,
      nextRefillDate: "2026-07-25",
      alerts: ["May cause minor hand shaking or brief tachycardia."],
      sideEffects: ["Mild tremor", "Throat irritation"],
      instructions: "Shake well before inhaling. Rinse throat with warm water.",
      status: "active"
    },
    {
      id: "med_2",
      name: "Montelukast (Singulair)",
      dosage: "10 mg tablet",
      frequency: "Once daily in the evening",
      reminderTimes: ["09:30 PM"],
      remainingRefills: 5,
      nextRefillDate: "2026-07-05",
      alerts: ["Avoid grapefruit seed interactions."],
      sideEffects: ["Mood shifts", "Headaches"],
      instructions: "Take consistently before bed. Best taken before 22:00.",
      status: "active"
    }
  ]);

  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: "rec_1",
      type: "lab_report",
      title: "Complete Blood Count & Basic Metabolic Panel",
      date: "2026-06-12",
      doctorName: "Dr. Sarah Jameson",
      summary: "Blood indices within healthy physiological benchmarks. White Blood Cell count is slightly high (11.2 K/uL), suggesting pollen allergy defense reactions.",
      details: {
        "WBC (Leukocytes)": "11.2 K/uL (High)",
        "RBC (Erythrocytes)": "4.8 M/uL (Normal)",
        "Hemoglobin": "14.5 g/dL (Normal)",
        "Serum Glucose": "92 mg/dL (Normal)",
        "Total Cholesterol": "195 mg/dL (Borderline Optimal)"
      }
    },
    {
      id: "rec_2",
      type: "prescription",
      title: "Pulmonary & Asthma Management Plan RX",
      date: "2026-05-15",
      doctorName: "Dr. Sarah Jameson",
      summary: "Approved prescriptions issued for Albuterol rescue bronchodilator inhaler and daily Montelukast preventative tablet.",
      details: {
        "Prescribed Inhaler": "Albuterol 90mcg, 1 Inhaler, Refills: 2",
        "Prescribed Daily Tablet": "Montelukast 10mg blocks, Dispense 30, Refills: 5"
      }
    }
  ]);

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);

  // Selected state for booking
  const [bookingDoctor, setBookingDoctor] = useState<any>(null);
  const [bookingSlot, setBookingSlot] = useState<any>('');

  // Bootstrap health stats
  useEffect(() => {
    const historical: HealthMetric[] = [];
    for (let i = 14; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      historical.push({
        date: dateStr,
        heartRate: i < 3 ? 84 : 72,
        bloodPressureSys: i < 3 ? 132 : 120,
        bloodPressureDia: i < 3 ? 84 : 78,
        sleepHours: i < 3 ? 5.6 : 7.2,
        steps: i < 3 ? 5800 : 9200
      });
    }
    setHealthMetrics(historical);
  }, []);

  // Simulator notification alerts
  const showPushNotification = (title: string, body: string) => {
    setPushNotification({ title, body });
    // Auto timeout dismiss
    setTimeout(() => {
      setPushNotification(null);
    }, 4500);
  };

  // Nav managers
  const handleNav = (screen: string) => {
    setActiveScreen(screen);
  };

  // Login Complete handler
  const handleLoginSuccess = (name: string, email: string) => {
    setCurrentUser((prev: any) => ({ ...prev, name, email }));
    setIsLoggedIn(true);
    showPushNotification("Welcome to HealthConnect!", "Securely synchronized HIPAA clinical data vault.");
    setActiveScreen('home');
  };

  // Registering fresh bookings
  const handleBookingComplete = (newAppt: Partial<Appointment>) => {
    setAppointments(prev => [{
      id: `appt_dyn_${Date.now()}`,
      doctorName: newAppt.doctorName || "Dr. Staff Provider",
      specialty: newAppt.specialty || "Specialist",
      date: newAppt.date || "",
      time: newAppt.time || "",
      status: 'upcoming',
      reason: newAppt.reason || ""
    }, ...prev]);
    
    showPushNotification("Appointment Confirmed!", `Successfully scheduled with ${newAppt.doctorName}.`);
    setActiveScreen('home');
  };

  const handleRefillRequest = (id: string) => {
    setMedications(prev => prev.map(m => m.id === id ? {
      ...m,
      remainingRefills: Math.max(0, m.remainingRefills - 1)
    } : m));
  };

  const handleAddMedication = (newMed: Medication) => {
    setMedications(prev => [...prev, newMed]);
    showPushNotification("Reminder Scheduled!", `${newMed.name} added to your daily compliance clocks.`);
  };

  const handleUpdateUserProfile = (updatedUser: any) => {
    setCurrentUser(updatedUser);
    showPushNotification("Profile Updated!", "Secured clinical vitals updated in master records.");
  };

  const currentActiveTab = () => {
    if (['home', 'splash', 'login'].includes(activeScreen)) return 'home';
    if (['doctors', 'doctor_profile'].includes(activeScreen)) return 'doctors';
    if (['booking', 'video_consultation'].includes(activeScreen)) return 'appointments';
    if (activeScreen === 'records') return 'records';
    if (activeScreen === 'profile') return 'profile';
    return '';
  };

  return (
    <div id="playground_root" className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      
      {/* Dynamic top hero panel */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur px-8 py-4 flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-emerald-500 p-2 text-white rounded-xl shadow-md shadow-blue-500/10">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5">
              <span>HealthConnect</span>
              <span className="text-[9px] bg-blue-950 text-blue-400 border border-blue-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                Interactive Studio
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">HIPAA SECURE PROTOTYPING PLAYGROUND</p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${viewMode === 'desktop' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full EHR Portal</span>
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${viewMode === 'mobile' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Simulator</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/45 p-1 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setOsStyle('ios')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${osStyle === 'ios' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Apple iOS</span>
            </button>
            
            <button
              onClick={() => setOsStyle('android')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${osStyle === 'android' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'}`}
            >
              <SmartphoneIcon className="w-3.5 h-3.5" />
              <span>Android MD3</span>
            </button>
          </div>

          {viewMode === 'mobile' && (
            <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 border border-slate-800 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-bold px-2 uppercase tracking-wide">Ratio</span>
              <button
                onClick={() => setAspectRatio('9.5:9')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${aspectRatio === '9.5:9' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                9.5:9
              </button>
              <button
                onClick={() => setAspectRatio('19.5:9')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${aspectRatio === '19.5:9' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                19.5:9
              </button>
              <button
                onClick={() => setAspectRatio('9:18')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${aspectRatio === '9:18' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                9:18
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Sandbox Layout Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 items-start">
        
        {viewMode === 'desktop' ? (
          // DESKTOP SYSTEM EHR CLOUD MASTER PORTAL
          <div className="w-full relative space-y-6 text-left">
            {!desktopLoggedIn ? (
              <div className="max-w-md mx-auto py-12">
                <LoginView onLogin={(role) => {
                  setDesktopLoggedIn(true);
                  setDesktopRole(role);
                  showPushNotification("Secured Handshake Established", `Authorized into EHR Cloud Gateway as ${role === 'patient' ? 'Alex Rivera' : 'Dr. Elizabeth Chen'}.`);
                }} />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header controls inside desktop mode */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900/60 border border-slate-800 p-4 rounded-2xl gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-slate-300 tracking-wider">
                      Authorizing EHR Gateway: {desktopRole === 'patient' ? 'Alex Rivera (Patient)' : 'Dr. Elizabeth Chen (MD Practitioner)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setDesktopRole(desktopRole === 'patient' ? 'doctor' : 'patient')}
                      className="bg-slate-950 border border-slate-850 hover:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 transition cursor-pointer"
                    >
                      Switch to {desktopRole === 'patient' ? 'Practitioner (MD)' : 'Patient (Alex)'} View
                    </button>

                    <button 
                      onClick={() => {
                        setDesktopLoggedIn(false);
                      }}
                      className="bg-red-950/40 border border-red-900/40 hover:border-red-700 px-3 py-1.5 rounded-xl text-xs font-bold text-red-400 transition cursor-pointer flex items-center gap-1"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                </div>

                {desktopRole === 'patient' ? (
                  <PatientDashboard 
                    userProfile={currentUser}
                    appointments={appointments}
                    medications={medications}
                    records={records}
                    healthMetrics={healthMetrics}
                    onBookAppointment={(appt) => {
                      handleBookingComplete(appt);
                    }}
                    onModifyAppointment={(id, status, date, time) => {
                      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status, ...(date && { date }), ...(time && { time }) } : a));
                      showPushNotification("Slot Modified", "Appointment schedule updated successfully.");
                    }}
                    onRefillMedication={handleRefillRequest}
                    onTriggerChatSession={(prompt) => {
                      showPushNotification("AI Copilot Summoned", `Analyzing: "${prompt}"`);
                    }}
                  />
                ) : (
                  <DoctorDashboard 
                    userProfile={currentUser}
                    appointments={appointments}
                    medications={medications}
                    records={records}
                    healthMetrics={healthMetrics}
                    onAddRecord={(rec) => {
                      setRecords(prev => [rec, ...prev]);
                      showPushNotification("Record Lodged", `Appended medical entry: ${rec.title}`);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          // MOBILE SMARTPHONE SIMULATOR WORKFLOW
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            {/* LEFT COLUMN: INTERACTIVE DOCS, SPECS & TOKENS VIEW */}
            <section className="lg:col-span-4 space-y-5 self-stretch flex flex-col justify-between">
              <div className="space-y-5">
                <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <Sparkles className="w-4 h-4 fill-blue-500/10 animate-pulse" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">Sandbox Interactive controller</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Live Prototype Control Panel</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    Normally in Figma, you click hot-spots; here, we built a fully functional client/server clinical simulator. Use these buttons below to trigger simulated system events directly inside the smartphone!
                  </p>
                </div>

                {/* Simulated webhook notification widgets */}
                <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trigger Simulated Push Alerts</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => showPushNotification("⏰ Dose reminder: Albuterol", "Shake inhaler, complete 2 puffs. Compliance averages 84% today.")}
                      className="bg-slate-950 text-slate-300 font-semibold p-3 rounded-xl border border-slate-800 hover:border-slate-700 hover:text-white transition flex items-center gap-2.5 text-xs text-left cursor-pointer"
                    >
                      <Bell className="w-4 h-4 text-amber-500 animate-bounce" />
                      <div>
                        <h5 className="font-bold">Simulate Medication Alarm</h5>
                        <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">Dispatches dosage push reminder</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleNav('sos');
                        showPushNotification("📍 Emergency SOS Activated!", "Dispatched current coordinates to Westside Emergency ward.");
                      }}
                      className="bg-slate-950 text-slate-300 font-semibold p-3 rounded-xl border border-slate-800 hover:border-rose-900/40 hover:text-white transition flex items-center gap-2.5 text-xs text-left cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                      <div>
                        <h5 className="font-bold text-red-400">Simulate Emergency Trigger</h5>
                        <p className="text-[10px] text-slate-550 font-medium leading-none mt-0.5">Navigates straight to active SOS Screen</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Layout screen selection grid checklists */}
                <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-5 space-y-3.5">
                  <div className="flex justify-between items-center pr-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prototype Screens Index</h4>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-900/25 px-2 py-0.5 rounded-full">14 / 14 Complete</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
                    {[
                      { id: 'splash', name: '1. Splash Screen', codeName: 'splash' },
                      { id: 'login', name: '2. Login & Sign Up', codeName: 'login' },
                      { id: 'home', name: '3. Home Dashboard', codeName: 'home' },
                      { id: 'doctors', name: '4. Doctor Search', codeName: 'doctors' },
                      { id: 'doctor_profile', name: '5. Doctor Profile', codeName: 'doctors' },
                      { id: 'booking', name: '6. Booking Form', codeName: 'booking' },
                      { id: 'video_consultation', name: '7. HD Telehealth Call', codeName: 'video_consultation' },
                      { id: 'symptom_checker', name: '8. AI Chat Checker', codeName: 'symptom_checker' },
                      { id: 'records', name: '9. Digital Records', codeName: 'records' },
                      { id: 'medications', name: '10. Medication Logs', codeName: 'medications' },
                      { id: 'analytics', name: '11. Health Graphs', codeName: 'analytics' },
                      { id: 'payment', name: '12. Pay Consultation', codeName: 'payment' },
                      { id: 'sos', name: '13. Emergency SOS', codeName: 'sos' },
                      { id: 'profile', name: '14. Profile Settings', codeName: 'profile' }
                    ].map((s) => {
                      const isCurrent = activeScreen === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            if (s.id === 'login') setIsLoggedIn(false);
                            else setIsLoggedIn(true);
                            setActiveScreen(s.id);
                          }}
                          className={`text-left text-xs py-2 px-3 rounded-xl border transition-all ${isCurrent ? 'bg-blue-600 border-blue-600 text-white font-black' : 'bg-slate-950/50 border-slate-900 hover:border-slate-800 text-slate-400'}`}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Design tokens details */}
              <div className="bg-slate-900/20 border border-slate-900/60 p-4 rounded-3xl text-[11px] text-slate-500 space-y-1 mt-6">
                <p>🎨 Design System Tokens:</p>
                <p>• Primary Accent: #2563eb (Blue-600)</p>
                <p>• Secondary Accent: #10b981 (Emerald-500)</p>
                <p>• Base canvas: #020617 (Slate-Dark)</p>
              </div>
            </section>

            {/* CENTER COLUMN: LIVE CORE MOBILE SIMULATOR VIEW (COVERS 8 COLUMNS) */}
            <section className="lg:col-span-8 flex flex-col items-center justify-center">
              
              {/* Luxurious Smartphone Frame wrapping active screen viewports */}
              <div className="relative mx-auto select-none">
                
                {/* Dynamic Apple/Android frame */}
                <div 
                  className={`rounded-[50px] border-[14px] bg-slate-950 shadow-2xl transition-all duration-300 relative flex flex-col justify-between overflow-hidden ${osStyle === 'ios' ? 'border-slate-900 shadow-blue-500/5' : 'border-slate-800 shadow-emerald-500/5'}`}
                  style={{
                    width: aspectRatio === '9.5:9' ? '380px' : aspectRatio === '19.5:9' ? '360px' : '365px',
                    height: aspectRatio === '9.5:9' ? '360px' : aspectRatio === '19.5:9' ? '780px' : '730px',
                  }}
                >
                  {/* UPPER Notch status overlay */}
                  <div className="absolute top-0 inset-x-0 h-10 bg-slate-950 pointer-events-none z-30 flex justify-between items-center px-6 text-[10px] text-slate-400 font-sans tracking-wide">
                    <span className="font-semibold text-slate-300">09:41</span>
                    
                    {osStyle === 'ios' ? (
                      // iOS Dynamic Island / Notch Mockup
                      <div className="w-[120px] h-6 bg-slate-950 rounded-full flex items-center justify-center border border-slate-900 text-slate-305">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
                        <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-emerald-400">Healthy Match</span>
                      </div>
                    ) : (
                      // Android Punch Hole Camera
                      <div className="w-3.5 h-3.5 bg-slate-950 rounded-full animate-pulse" />
                    )}

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-slate-300">5G</span>
                      <div className="w-5 h-2.5 border border-slate-700/80 rounded-sm p-0.5 flex">
                        <div className="bg-slate-350 h-full w-4/5 rounded-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Apple Notch simulated Push alarm notifications */}
                  <AnimatePresence>
                    {pushNotification && (
                      <motion.div 
                        initial={{ y: -70, scale: 0.9, opacity: 0 }}
                        animate={{ y: 50, scale: 1, opacity: 1 }}
                        exit={{ y: -70, scale: 0.9, opacity: 0 }}
                        className="absolute inset-x-3 bg-slate-900/95 border border-slate-800 text-white p-3.5 rounded-2xl shadow-2xl z-40 text-left flex gap-2.5 backdrop-blur-md"
                      >
                        <div className="p-2 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl my-auto text-white flex-shrink-0 animate-pulse">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-[11px] leading-tight text-white mb-0.5">{pushNotification.title}</h4>
                          <p className="text-[10px] text-slate-300 leading-snug">{pushNotification.body}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* MAIN FLOW ROUTER RENDER AREA */}
                  <div className="flex-1 w-full bg-slate-950 pt-10 pb-16 relative overflow-y-auto text-slate-100 scrollbar-none">
                    {phoneLocked ? (
                      // LOCKED STATE SCREEN
                      <div className="absolute inset-0 bg-slate-950 flex flex-col justify-center items-center text-center p-6 text-white z-50">
                        <Power className="w-10 h-10 text-slate-650 animate-pulse mb-3" />
                        <h4 className="font-bold text-sm">HealthConnect Protected</h4>
                        <p className="text-[10px] text-slate-550 mt-1">Press Simulator Power button on the controller to unlock</p>
                      </div>
                    ) : (
                      // CORE SCREENS CONDITIONAL ROUTER
                      <>
                        {activeScreen === 'splash' && (
                          <SplashScreen onComplete={() => setActiveScreen('login')} />
                        )}

                        {activeScreen === 'login' && (
                          <LoginSignupScreen onLoginSuccess={handleLoginSuccess} />
                        )}

                        {activeScreen === 'home' && (
                          <HomeScreen 
                            user={currentUser} 
                            upcomingAppointments={appointments}
                            activeMedicationsCount={medications.length}
                            onNavigate={handleNav}
                            onSelectAppointment={(appt) => {
                              setBookingDoctor({ name: appt.doctorName, specialty: appt.specialty, fee: 95, slots: [appt.time] });
                              setActiveScreen('video_consultation');
                            }}
                          />
                        )}

                        {activeScreen === 'doctors' && (
                          <DoctorScreen 
                            onSelectDoctorForBooking={(doc, slot) => {
                              setBookingDoctor(doc);
                              setBookingSlot(slot);
                              setActiveScreen('booking');
                            }}
                            onNavigate={handleNav}
                          />
                        )}

                        {activeScreen === 'booking' && (
                          <AppointmentBookingScreen 
                            preselectedDoctor={bookingDoctor}
                            chosenSlot={bookingSlot}
                            onBookingComplete={handleBookingComplete}
                            onCancel={() => setActiveScreen('doctors')}
                          />
                        )}

                        {activeScreen === 'video_consultation' && (
                          <VideoConsultationScreen 
                            doctorName={bookingDoctor?.name}
                            specialty={bookingDoctor?.specialty}
                            onEndCall={() => {
                              showPushNotification("Consult Completed!", "Your consultation notes draft has been successfully synthesized secure on HIPAA file records.");
                              setActiveScreen('home');
                            }}
                          />
                        )}

                        {activeScreen === 'symptom_checker' && (
                          <AISymptomChecker onSuggestDoctor={() => setActiveScreen('doctors')} />
                        )}

                        {activeScreen === 'records' && (
                          <MedicalRecordsScreen recordsList={records} />
                        )}

                        {activeScreen === 'medications' && (
                          <MedicationReminderScreen 
                            medicationsList={medications}
                            onRefillRequest={handleRefillRequest}
                            onAddMedication={handleAddMedication}
                          />
                        )}

                        {activeScreen === 'analytics' && (
                          <HealthAnalyticsDashboard metrics={healthMetrics} />
                        )}

                        {activeScreen === 'payment' && (
                          <PaymentScreen 
                            doctorName={bookingDoctor?.name}
                            specialty={bookingDoctor?.specialty}
                            fee={bookingDoctor?.fee}
                            onPaymentSuccess={() => {
                              showPushNotification("Invoice Paid", "A cryptocurrency transaction token has been created for your records.");
                              setActiveScreen('home');
                            }}
                          />
                        )}

                        {activeScreen === 'sos' && (
                          <EmergencySOSScreen />
                        )}

                        {activeScreen === 'profile' && (
                          <ProfileSettingsScreen 
                            userProfile={currentUser}
                            onLogOut={() => {
                              setIsLoggedIn(false);
                              setActiveScreen('login');
                              showPushNotification("Signed Out", "Closed current secure biometric handshake session.");
                            }}
                            onUpdateUser={handleUpdateUserProfile}
                          />
                        )}
                      </>
                    )}
                  </div>

                  {/* BOTTOM NAVIGATION BAR */}
                  {isLoggedIn && !phoneLocked && (
                    <div className="absolute bottom-0 inset-x-0 h-16 bg-slate-900 border-t border-slate-800 flex justify-around items-center z-20 shadow-xl">
                      
                      {/* Tab 1: Home Dashboard */}
                      <button 
                        onClick={() => handleNav('home')}
                        className={`flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-all ${currentActiveTab() === 'home' ? 'text-blue-400' : 'text-slate-500'}`}
                      >
                        <Home className="w-[19px] h-[19px]" />
                        <span className="text-[9px] font-bold">Home</span>
                      </button>

                      {/* Tab 2: Clinicians */}
                      <button 
                        onClick={() => handleNav('doctors')}
                        className={`flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-all ${currentActiveTab() === 'doctors' ? 'text-blue-400' : 'text-slate-500'}`}
                      >
                        <Compass className="w-[19px] h-[19px]" />
                        <span className="text-[9px] font-bold">Doctors</span>
                      </button>

                      {/* Tab 3: Appointments */}
                      <button 
                        onClick={() => {
                          if (appointments.length > 0) {
                            setBookingDoctor({ name: appointments[0].doctorName, specialty: appointments[0].specialty, fee: 95, slots: [appointments[0].time] });
                            setActiveScreen('video_consultation');
                          } else {
                            setActiveScreen('doctors');
                          }
                        }}
                        className={`flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-all ${currentActiveTab() === 'appointments' ? 'text-blue-400' : 'text-slate-500'}`}
                      >
                        <Calendar className="w-[19px] h-[19px]" />
                        <span className="text-[9px] font-bold">Consults</span>
                      </button>

                      {/* Tab 4: Records */}
                      <button 
                        onClick={() => handleNav('records')}
                        className={`flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-all ${currentActiveTab() === 'records' ? 'text-blue-400' : 'text-slate-500'}`}
                      >
                        <FolderHeart className="w-[19px] h-[19px]" />
                        <span className="text-[9px] font-bold">Records</span>
                      </button>

                      {/* Tab 5: Profile & Settings */}
                      <button 
                        onClick={() => handleNav('profile')}
                        className={`flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-all ${currentActiveTab() === 'profile' ? 'text-blue-400' : 'text-slate-500'}`}
                      >
                        <UserRound className="w-[19px] h-[19px]" />
                        <span className="text-[9px] font-bold">Profile</span>
                      </button>

                    </div>
                  )}

                  {/* Physical iOS home indicator mockup */}
                  {osStyle === 'ios' && (
                    <div className="absolute bottom-1 right-24 left-24 h-1 bg-slate-800 rounded-full z-30 pointer-events-none" />
                  )}
                </div>

                {/* EXTERNAL PHYSICAL POWER BUTTON MOCK ON THE SIDE */}
                <button
                  onClick={() => setPhoneLocked(!phoneLocked)}
                  className="absolute -right-[18px] top-28 bg-gradient-to-l from-slate-705 to-slate-800 border-l border-white/20 hover:from-slate-600 hover:to-slate-705 w-[5px] h-12 rounded-r-md cursor-pointer flex transition active:translate-x-[-1px]"
                  title="Simulator Physical Power Toggle"
                />
              </div>

              <div className="mt-4 text-xs font-mono text-slate-500 flex items-center gap-1">
                <span>Click the black physical power button</span>
                <span className="font-extrabold text-blue-500 text-xs">➔</span>
                <span>on the right rim of the device mock to lock the screen.</span>
              </div>

            </section>
          </div>
        )}

      </main>

      {/* Dynamic Floating Clinical Chat Copilot AI with customizable triggers */}
      <FloatingChat 
        currentRole={viewMode === 'desktop' ? desktopRole : 'patient'} 
        userProfile={currentUser}
        onRefreshData={() => {
          showPushNotification("Context Analyzed", "Re-synthesized clinical vector graph successfully.");
        }}
        onBookAppointmentShortcut={(doc, specialty, date, time) => {
          handleBookingComplete({ doctorName: doc, specialty, date, time, reason: "Virtual Assistant Rapid Booked Slot" });
        }}
        onRefillMedicationShortcut={handleRefillRequest}
      />

      {/* HIPAA Compliance Certification visual badge footer */}
      <footer id="global_licensing" className="p-6 border-t border-slate-900 text-center text-[10px] text-slate-500 font-mono tracking-wide">
        <p>© 2026 HealthConnect Secure Care Systems, Inc. All rights reserved.</p>
        <p className="mt-1 text-slate-600">
          This system uses End-of-Life TLS certified military cryptographic protocols to process synthetic records complying strictly with HIPAA criteria.
        </p>
      </footer>

    </div>
  );
}
