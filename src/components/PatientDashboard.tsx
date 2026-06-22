import React, { useState, useEffect } from 'react';
import { 
  Heart, Calendar, FileText, Pill, Activity, TrendingDown,
  Clock, ShieldAlert, Plus, Search, ChevronRight, CheckCircle2,
  XCircle, ArrowRight, Download, RefreshCw, Star, MapPin, 
  Sparkles, Coffee, Smile, Thermometer
} from 'lucide-react';
import { Appointment, Medication, MedicalRecord, HealthMetric, ConsultationSummary } from '../types';

interface PatientDashboardProps {
  userProfile: any;
  appointments: Appointment[];
  medications: Medication[];
  records: MedicalRecord[];
  healthMetrics: HealthMetric[];
  onBookAppointment: (appt: Partial<Appointment>) => void;
  onModifyAppointment: (id: string, status: 'upcoming' | 'completed' | 'cancelled', date?: string, time?: string) => void;
  onRefillMedication: (id: string) => void;
  onTriggerChatSession: (prompt: string) => void;
}

export default function PatientDashboard({
  userProfile,
  appointments,
  medications,
  records,
  healthMetrics,
  onBookAppointment,
  onModifyAppointment,
  onRefillMedication,
  onTriggerChatSession
}: PatientDashboardProps) {
  // Tabs for subparts
  const [activeTab, setActiveTab3] = useState<'overview' | 'booking' | 'medications' | 'records' | 'trends'>('overview');
  
  // States for Appointment form
  const [searchSpecialist, setSearchSpecialist] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingReason, setBookingReason] = useState('Routine Respiratory Consult');
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);

  // Filter lists
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [filterRecordType, setFilterRecordType] = useState<string>('all');

  const [refillStatus, setRefillStatus] = useState<Record<string, string>>({});

  // Doctor database lists
  const mockDoctors = [
    { name: "Dr. Sarah Jameson", specialty: "Primary Care & Allergy", rating: 4.9, location: "Thoracic Wing, Suite #408", availability: "Today 15:30, Tomorrow 10:00" },
    { name: "Dr. Robert Chen", specialty: "Cardiology", rating: 4.8, location: "North Tower, Suite #102", availability: "Tomorrow 14:00, Thursday 11:30" },
    { name: "Dr. Amanda White", specialty: "Dermatological Specialist", rating: 4.7, location: "Annex Suite B, Level 1", availability: "Wednesday 09:00" },
    { name: "Dr. Gregory House", specialty: "Pulmonary & Diagnostics", rating: 4.6, location: "Intensive Wing, Room 321", availability: "Friday 16:30" }
  ];

  const handleRefillClick = (id: string) => {
    setRefillStatus(prev => ({ ...prev, [id]: 'submitting' }));
    setTimeout(() => {
      onRefillMedication(id);
      setRefillStatus(prev => ({ ...prev, [id]: 'sent' }));
      setTimeout(() => {
        setRefillStatus(prev => ({ ...prev, [id]: '' }));
      }, 3000);
    }, 1200);
  };

  const handleTriggerBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !bookingDate || !bookingTime) return;

    onBookAppointment({
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: bookingDate,
      time: bookingTime,
      reason: bookingReason,
      status: 'upcoming'
    });

    setIsBookedSuccess(true);
    setTimeout(() => {
      setIsBookedSuccess(false);
      setActiveTab3('overview');
    }, 2500);
  };

  // Extract selected record
  const currentRecord = records.find(r => r.id === selectedRecordId) || records[0];

  useEffect(() => {
    if (records.length > 0 && !selectedRecordId) {
      setSelectedRecordId(records[0].id);
    }
  }, [records]);

  // Vitals summary calculation
  const latestMetric = healthMetrics[healthMetrics.length - 1] || {
    heartRate: 74,
    bloodPressureSys: 122,
    bloodPressureDia: 80,
    steps: 7100,
    sleepHours: 5.6
  };

  // SVG dimensions for trend chart
  const paddingX = 40;
  const paddingY = 20;

  return (
    <div id="patient_dashboard_container" className="space-y-6 text-slate-100 font-sans pb-16">
      
      {/* Dynamic Header Welcome row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-5 rounded-3xl border border-slate-700/35 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">Patient Dashboard</span>
            <span className="text-slate-400 text-xs">• ID: PAT-AR-928</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1">Hello, {userProfile?.name}!</h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
            You are securely logged in. Take a look at your customized treatment workflows, allergy alarms, or launch clinical symptom triage via the floating assistant widget.
          </p>
        </div>

        {/* Quick Triage status badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="bg-slate-900/60 py-2 px-3.5 rounded-2xl border border-slate-700/50">
            <span className="text-slate-500 block text-[9px] uppercase font-mono tracking-wider">Asthma Status</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Well Controlled
            </span>
          </div>
          <div className="bg-slate-900/60 py-2 px-3.5 rounded-2xl border border-slate-700/50">
            <span className="text-slate-500 block text-[9px] uppercase font-mono tracking-wider">Critical Trigger</span>
            <span className="text-rose-400 font-semibold font-mono mt-0.5 block">Penicillin (Severe Hives)</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-tab Hub */}
      <div id="dashboard_tabs_hub" className="flex overflow-x-auto gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 scrollbar-none sticky top-0 z-20 backdrop-blur-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'booking', label: 'Appointment Hub', icon: Calendar },
          { id: 'medications', label: 'My Medications', icon: Pill },
          { id: 'records', label: 'Medical Files', icon: FileText },
          { id: 'trends', label: 'Metrics & Trends', icon: TrendingDown },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              id={`nav_btn_${item.id}`}
              key={item.id}
              onClick={() => setActiveTab3(item.id as any)}
              className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-cyan-950 to-slate-800 text-cyan-400 shadow border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* ========================================================
          1. OVERVIEW SCREEN
         ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Critical Alarm Alert banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-slate-900 rounded-3xl p-5 border border-amber-500/25 flex items-start gap-4 shadow-xl">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-500 shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono">Personalized AI Health Insights</span>
              <h3 className="text-sm font-bold text-white">Critical Alert: Sleep Deficit detected over the trailing Month</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Your average sleep duration decreased by **20%** compared to your spring physiological baselines. This matches a temporary rise in systolic Blood Pressure (resting mean **132 mmHg**). We highly recommend launching **CareAI** to check options for sleep hygiene.
              </p>
              <div className="flex gap-2.5 pt-1.5">
                <button 
                  id="btn_ai_sleep_chat"
                  onClick={() => onTriggerChatSession("What sleep hygiene tips correspond to my 20% sleep reduction issue?")}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] tracking-wide font-bold uppercase py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Analyze with CareAI
                </button>
                <button 
                  onClick={() => setActiveTab3('trends')}
                  className="text-slate-400 hover:text-white text-[10px] font-semibold flex items-center gap-0.5 transition-colors"
                >
                  View Trends Chart <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Core Vitals KPI Bento grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Vitals KPI 1 */}
            <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800/80 text-left space-y-2 hover:border-slate-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-medium">Heart Rate</span>
                <span className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg"><Heart className="w-4 h-4 animate-pulse" /></span>
              </div>
              <div>
                <span className="text-2xl font-black text-white">{latestMetric.heartRate}</span>
                <span className="text-slate-400 text-[11px] font-mono ml-1">BPM</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 block bg-amber-500/5 p-1 rounded-md text-center">Borderline Sympathetic High</span>
            </div>

            {/* Vitals KPI 2 */}
            <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800/80 text-left space-y-2 hover:border-slate-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-medium">Blood Pressure</span>
                <span className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg"><Activity className="w-4 h-4" /></span>
              </div>
              <div>
                <span className="text-2xl font-black text-white">{latestMetric.bloodPressureSys}/{latestMetric.bloodPressureDia}</span>
                <span className="text-slate-400 text-[11px] font-mono ml-1">mmHg</span>
              </div>
              <span className="text-[10px] font-mono text-amber-500 block bg-amber-500/5 p-1 rounded-md text-center">Stage 1 Pre-Hypertension</span>
            </div>

            {/* Vitals KPI 3 */}
            <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800/80 text-left space-y-2 hover:border-slate-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-medium">Sleep Hours</span>
                <span className="p-1.5 bg-slate-800 border border-slate-700 text-amber-400 rounded-lg"><Coffee className="w-4 h-4" /></span>
              </div>
              <div>
                <span className="text-2xl font-black text-white">{latestMetric.sleepHours}</span>
                <span className="text-slate-400 text-[11px] font-mono ml-1">Hrs</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400 block bg-rose-500/5 p-1 rounded-md text-center">-20% over modern cycles</span>
            </div>

            {/* Vitals KPI 4 */}
            <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800/80 text-left space-y-2 hover:border-slate-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-medium">Daily Steps</span>
                <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg"><Smile className="w-4 h-4" /></span>
              </div>
              <div>
                <span className="text-2xl font-black text-white">{(latestMetric.steps / 1000).toFixed(1)}k</span>
                <span className="text-slate-400 text-[11px] font-mono ml-1">Steps</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 block bg-emerald-500/5 p-1 rounded-md text-center">Good aerobic baseline</span>
            </div>

          </div>

          {/* Split Appointments & Medication Previews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Upcoming Appointments list */}
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-sm text-slate-100">Upcoming Consultations</h3>
                </div>
                <button 
                  onClick={() => setActiveTab3('booking')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Book New
                </button>
              </div>

              <div className="space-y-3.5">
                {appointments.filter(a => a.status === 'upcoming').map((appt) => (
                  <div key={appt.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm">{appt.doctorName}</h4>
                        <p className="text-xs text-cyan-500 font-medium font-mono">{appt.specialty}</p>
                      </div>
                      <span className="bg-slate-900 text-cyan-400 border border-cyan-500/30 text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-full">
                        Confirmed
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400 font-mono border-t border-slate-900 pt-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> {appt.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> {appt.time}
                      </span>
                    </div>

                    {appt.symptoms && (
                      <p className="text-[11px] text-slate-300 mt-2.5 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                        <span className="font-bold text-slate-500">Stated symptoms:</span> &ldquo;{appt.symptoms}&rdquo;
                      </p>
                    )}

                    {/* Pre-Appointment summary check */}
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => onTriggerChatSession(`Prepare a pre-visit consultation report summary for my upcoming appointment with ${appt.doctorName} regarding respiratory tightness.`)}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 py-1.5 px-3 rounded-xl text-[10px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Generate Visit Prep Notes
                      </button>
                      
                      <button 
                        onClick={() => onModifyAppointment(appt.id, 'cancelled')}
                        className="text-slate-500 hover:text-rose-400 py-1 px-2.5 rounded text-[10px] font-mono transition-colors border border-transparent hover:border-rose-500/20"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Active Medications with dosage actions */}
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-slate-100">Active Prescriptions</h3>
                </div>
                <button 
                  onClick={() => setActiveTab3('medications')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Manage Refills
                </button>
              </div>

              <div className="space-y-3">
                {medications.map((med) => (
                  <div key={med.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-slate-200">{med.name}</h4>
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold px-1.5 py-0.2 rounded font-mono uppercase">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Dosage: {med.dosage}</p>
                      <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Times: {med.reminderTimes.join(' & ')}
                      </p>
                      
                      {med.alerts && med.alerts.length > 0 && (
                        <p className="text-[10px] text-amber-500/90 font-mono mt-2 bg-amber-500/5 p-1.5 rounded-lg border border-amber-500/10">
                          ⚠️ {med.alerts[0]}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col justify-between items-end shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block font-mono">REFILLS LEFT:</span>
                        <span className="text-sm font-bold font-mono text-emerald-400">{med.remainingRefills}</span>
                      </div>

                      <button
                        id={`btn_refill_shortcut_${med.id}`}
                        onClick={() => handleRefillClick(med.id)}
                        disabled={refillStatus[med.id] === 'submitting'}
                        className={`text-[10px] py-1.5 px-3.5 rounded-xl cursor-pointer transition-all font-bold ${
                          refillStatus[med.id] === 'sent'
                            ? 'bg-emerald-400 text-slate-950'
                            : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        {refillStatus[med.id] === 'submitting' && 'Connecting...'}
                        {refillStatus[med.id] === 'sent' && 'CVS Refill Approved!'}
                        {!refillStatus[med.id] && 'Quick Refill'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Consultation Summarizer Box pre-appointment preparation notes */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-sm text-slate-100">Personalized Telemedicine Preparation Notes</h3>
            </div>
            
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">Subject: Asthma & Allergic Bronchospasm management summary</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">Ready to present to clinician</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Before speaking to Dr. Jameson, we have compiled a standardized report of symptoms to expedite clinical workflow. We logged your Albuterol inhaler usage and pollen trigger variables:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-amber-500 block mb-1">Visit Prep Checklist:</span>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-300 leading-relaxed font-sans">
                    <li>Confirm Albuterol compliance (averaging 1 puff as-needed weekly).</li>
                    <li>State daily bedtime compliance regarding Montelukast.</li>
                    <li>Note the Penicillin allergy to make sure it remains highlighted in the chart.</li>
                  </ul>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-cyan-400 block mb-1">Recommend Specialists:</span>
                  <p className="text-slate-300 font-sans leading-relaxed mb-1.5">Based on seasonal triggers and mild expiratory wheezing, we recommend consults with:</p>
                  <span className="inline-block bg-slate-950 text-[10px] font-semibold text-cyan-400 px-2.5 py-1 rounded border border-slate-800">
                    Pulmonary Medicine & Immunology
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          2. APPOINTMENT HUB TAB
         ======================================================== */}
      {activeTab === 'booking' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 space-y-4 text-left">
            <div>
              <h3 className="font-bold text-base text-white">Find Specialists & Book Instantly</h3>
              <p className="text-xs text-slate-400 mt-1">
                Schedule consultations directly into CareAI. Choose from certified practitioners who have secure access to your clinical background context.
              </p>
            </div>

            {/* Success screen after booking */}
            {isBookedSuccess ? (
              <div id="booking_success_box" className="bg-emerald-950/40 p-10 rounded-2xl border border-emerald-500/30 text-center space-y-3.5">
                <div className="w-14 h-14 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                <h4 className="font-bold text-lg text-white">Appointment Scheduled Successfully!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your appointment with {selectedDoctor?.name} has been synchronized into the electronic medical suite. Reminders will generate before slot time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Search & Doctor list */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3.5 text-slate-500 w-4 h-4" />
                    <input 
                      type="text"
                      placeholder="Search specialties (e.g. Cardiology, Asthma, Dermatologist)..."
                      value={searchSpecialist}
                      onChange={(e) => setSearchSpecialist(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-200 focus:outline-none placeholder-slate-500"
                    />
                  </div>

                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                    {mockDoctors
                      .filter(d => d.specialty.toLowerCase().includes(searchSpecialist.toLowerCase()) || d.name.toLowerCase().includes(searchSpecialist.toLowerCase()))
                      .map((doc, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedDoctor(doc)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-left ${
                            selectedDoctor?.name === doc.name 
                              ? 'bg-cyan-950/20 border-cyan-500/60 shadow-lg shadow-cyan-950/20' 
                              : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-slate-100">{doc.name}</h4>
                              <p className="text-xs text-cyan-400 font-medium font-mono">{doc.specialty}</p>
                            </div>
                            <span className="bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {doc.rating}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-col gap-1 text-[11px] text-slate-400 font-sans border-t border-slate-900 pt-2.5">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {doc.location}</span>
                            <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold mt-0.5">📅 Slots: {doc.availability}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                {/* Booking scheduling form */}
                <div className="bg-slate-950 p-5 rounded-3xl border border-slate-850 space-y-4">
                  <h4 className="font-bold text-sm text-slate-200">Confirm Booking Details</h4>
                  
                  {selectedDoctor ? (
                    <form onSubmit={handleTriggerBooking} className="space-y-4">
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-500 block">Selected Practitioner:</span>
                        <p className="text-sm font-bold text-white mt-0.5">{selectedDoctor.name}</p>
                        <p className="text-xs text-cyan-400 font-mono font-medium">{selectedDoctor.specialty}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 font-mono font-bold block mb-1">DATE</label>
                          <input 
                            type="date"
                            required
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-mono font-bold block mb-1">TIME</label>
                          <input 
                            type="time"
                            required
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-mono font-bold block mb-1">REASON FOR VISIT / CLINICAL SYMPTOMS</label>
                        <textarea
                          rows={2}
                          value={bookingReason}
                          onChange={(e) => setBookingReason(e.target.value)}
                          placeholder="e.g. Asthma control review, chest stiffness follow-up..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                        />
                      </div>

                      <button
                        id="btn_submit_booking"
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:bg-gradient-to-l font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-cyan-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Book Appontment
                      </button>
                    </form>
                  ) : (
                    <div className="h-[220px] flex flex-col justify-center items-center text-center p-6 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
                      <Calendar className="w-10 h-10 text-slate-600 mb-2" />
                      <p className="text-xs text-slate-400 font-medium">Please select a doctor from the Left panel first</p>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">We will pre-load your history for the clinic visit.</p>
                    </div>
                  )}

                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          3. MEDICATIONS TAB
         ======================================================== */}
      {activeTab === 'medications' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-base text-white">Medication & Refill Gateways</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connected to <strong className="text-emerald-400 font-sans">CVS Pharmacy Suite #12</strong>. Manage daily asthma timers or demand instant digital refills with Dr. Sarah Jameson.
                </p>
              </div>
              <button 
                onClick={() => onTriggerChatSession("When should I take my asthma inhaler or my singulair tablet daily?")}
                className="bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/20 px-3.5 py-1.5 rounded-xl text-[10px] font-mono tracking-wider uppercase font-semibold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" /> Pill Advice
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medications.map((med) => (
                <div key={med.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all text-left">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{med.name}</h4>
                      <p className="text-xs text-emerald-400 font-mono font-medium">{med.dosage}</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase font-mono px-2.5 py-0.5 rounded-full">
                      Active RX
                    </span>
                  </div>

                  <div className="space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-850 text-xs">
                    <p className="text-slate-300 font-sans"><span className="text-slate-500 font-bold">Frequency:</span> {med.frequency}</p>
                    <p className="text-slate-300 font-sans"><span className="text-slate-500 font-bold">Dosage instruction:</span> {med.instructions}</p>
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] pt-1">
                      <Clock className="w-3.5 h-3.5" /> Reminder times: {med.reminderTimes.join(' & ')}
                    </div>
                  </div>

                  {med.sideEffects && (
                    <div className="text-[10px] text-slate-400">
                      <span className="font-bold text-slate-500 uppercase block mb-1">Possible Clinical Side Effects:</span>
                      <p className="font-sans leading-relaxed">{med.sideEffects.join(', ')}</p>
                    </div>
                  )}

                  <div className="pt-2.5 border-t border-slate-900 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-mono">REFILL STATUS:</span>
                      <span className="font-bold font-mono text-white">{med.remainingRefills} Refills remaining</span>
                    </div>

                    <button
                      id={`btn_refill_manager_${med.id}`}
                      onClick={() => handleRefillClick(med.id)}
                      disabled={refillStatus[med.id] === 'submitting'}
                      className={`py-2 px-4 rounded-xl cursor-pointer font-extrabold text-xs transition-colors ${
                        refillStatus[med.id] === 'sent'
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      {refillStatus[med.id] === 'submitting' && 'Connecting...'}
                      {refillStatus[med.id] === 'sent' && 'Sent to CVS!'}
                      {!refillStatus[med.id] && 'Order Refill'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. MEDICAL RECORDS TAB
         ======================================================== */}
      {activeTab === 'records' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Records list */}
            <div className="space-y-3 lg:col-span-1">
              <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-4 space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-100">Electronic Files Log</h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">HIPAA Secure</span>
                </div>

                <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900">
                  <button 
                    onClick={() => setFilterRecordType('all')} 
                    className={`flex-1 py-1.5 text-[10px] rounded font-medium transition-colors cursor-pointer ${filterRecordType === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilterRecordType('lab_report')} 
                    className={`flex-1 py-1.5 text-[10px] rounded font-medium transition-colors cursor-pointer ${filterRecordType === 'lab_report' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Labs
                  </button>
                  <button 
                    onClick={() => setFilterRecordType('prescription')} 
                    className={`flex-1 py-1.5 text-[10px] rounded font-medium transition-colors cursor-pointer ${filterRecordType === 'prescription' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Prescriptions
                  </button>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {records
                    .filter(r => filterRecordType === 'all' || r.type === filterRecordType)
                    .map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => setSelectedRecordId(rec.id)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          selectedRecordId === rec.id 
                            ? 'bg-slate-950 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/20' 
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-800'
                        }`}
                      >
                        <h4 className="font-bold text-xs truncate text-slate-200">{rec.title}</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">{rec.date} | {rec.doctorName}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Right details content details */}
            <div className="lg:col-span-2">
              {currentRecord ? (
                <div id="medical_record_detail_view" className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 space-y-4 text-left">
                  
                  <div className="flex justify-between items-start gap-3 flex-wrap border-b border-slate-900 pb-4">
                    <div>
                      <span className="text-[10px] bg-cyan-950/40 border border-cyan-550/20 text-cyan-400 px-2.5 py-0.5 rounded-full font-mono uppercase font-semibold">
                        {currentRecord.type.split('_').join(' ')}
                      </span>
                      <h3 className="font-bold text-base text-white mt-2">{currentRecord.title}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Authoring MD: {currentRecord.doctorName} | Date Issue: {currentRecord.date}</p>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => onTriggerChatSession(`Explain my records: ${currentRecord.title}`)}
                        className="bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/20 py-2 px-3 rounded-xl text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Explain file
                      </button>
                      
                      <button 
                        onClick={() => alert("Digital copy saved and exported to system vault.")}
                        className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 p-2 rounded-xl text-xs transition-all cursor-pointer"
                        title="Export PDF file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider font-mono">Clinical Summary Notes</h4>
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-850 font-sans">
                      {currentRecord.summary}
                    </p>
                  </div>

                  {/* Scientific detail fields table */}
                  {currentRecord.details && (
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider font-mono">Detailed Telemetry Fields</h4>
                      
                      <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-xs text-slate-350 border-collapse">
                          <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-850 font-mono text-[10px] text-slate-500">
                              <th className="py-2.5 px-4 font-bold text-left">Clinical Field Parameter</th>
                              <th className="py-2.5 px-4 font-bold text-right">Value / Interpretation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(currentRecord.details).map(([key, val]) => (
                              <tr key={key} className="border-b border-slate-850/60 hover:bg-slate-900/30">
                                <td className="py-2.5 px-4 font-medium text-slate-350">{key}</td>
                                <td className={`py-2.5 px-4 text-right font-mono font-bold ${val.toString().includes('High') ? 'text-rose-400' : 'text-slate-100'}`}>{val}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                <div className="h-[200px] bg-slate-900/60 rounded-3xl border border-dotted border-slate-800 flex flex-col items-center justify-center">
                  <FileText className="w-12 h-12 text-slate-650" />
                  <p className="text-xs text-slate-400 mt-2">No EHR/Lab reports found.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          5. HEALTH ANALYTICS TRENDS
         ======================================================== */}
      {activeTab === 'trends' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Custom SVG Data Visualization Trends chart without recharts install dependencies */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-mono font-bold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 animate-bounce" /> Attention required
              </div>
              <h3 className="font-bold text-base text-white mt-1">20% Sleep Reduction & Compensatory BP Elevation</h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing clinical sensor logs collected over the trailing 15 days. Note how sleep duration declines as resting systolic BP compensatory curves rise.
              </p>
            </div>

            {/* Custom SVG Multi-line Double Axis Graph */}
            <div id="analytics_trends_canvas" className="bg-slate-950 p-4 rounded-3xl border border-slate-850">
              
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-3 border-b border-slate-900 pb-2.5">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <span className="w-2.5 h-1 bg-cyan-400 inline-block rounded"></span> Sleep Duration (Hrs)
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <span className="w-2.5 h-1 bg-rose-450 inline-block rounded"></span> Systolic BP (mmHg)
                  </span>
                </div>
                <span>Interval: Trailing 15 Days</span>
              </div>

              {/* Precise SVG Path layout */}
              <div className="relative">
                <svg viewBox="0 0 500 200" className="w-full h-[240px]">
                  
                  {/* Grid lines horizontal */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="40" y1="65" x2="480" y2="65" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="40" y1="110" x2="480" y2="110" stroke="#1e293b" strokeDasharray="3,3" />
                  <line x1="40" y1="155" x2="480" y2="155" stroke="#1e293b" strokeDasharray="3,3" />
                  
                  {/* Left Axis label sleep scale */}
                  <text x="12" y="24" className="text-[9px] fill-cyan-400 font-mono">8.0h</text>
                  <text x="12" y="68" className="text-[9px] fill-cyan-400 font-mono">6.5h</text>
                  <text x="12" y="113" className="text-[9px] fill-cyan-400 font-mono">5.0h</text>
                  <text x="12" y="158" className="text-[9px] fill-cyan-400 font-mono">3.5h</text>

                  {/* Right Axis label systolic BP scale */}
                  <text x="485" y="24" className="text-[9px] fill-rose-400 font-mono">140</text>
                  <text x="485" y="68" className="text-[9px] fill-rose-400 font-mono">130</text>
                  <text x="485" y="113" className="text-[9px] fill-rose-400 font-mono">120</text>
                  <text x="485" y="158" className="text-[9px] fill-rose-400 font-mono">110</text>

                  {/* LINE 1 PATH: Sleep hours (Declining steadily from left to right) */}
                  <path 
                    d="M 40 40 L 70 38 L 100 42 L 130 50 L 160 48 L 190 62 L 220 70 L 250 82 L 280 90 L 310 95 L 340 102 L 370 114 L 400 110 L 430 116 L 460 118"
                    fill="none" 
                    stroke="#22d3ee" 
                    strokeWidth="3.2" 
                    strokeLinecap="round"
                  />

                  {/* LINE 2 PATH: Systolic BP (Rising steadily compensating from left to right) */}
                  <path 
                    d="M 40 110 L 70 106 L 100 112 L 130 108 L 160 104 L 190 98 L 220 92 L 250 80 L 280 72 L 310 65 L 340 54 L 370 42 L 400 44 L 430 38 L 460 36"
                    fill="none" 
                    stroke="#f43f5e" 
                    strokeWidth="3.2" 
                    strokeLinecap="round"
                    strokeDasharray="1"
                  />

                  {/* Scatter dots for Sleep */}
                  <circle cx="40" cy="40" r="4" className="fill-slate-900 stroke-cyan-400 stroke-2" />
                  <circle cx="160" cy="48" r="4" className="fill-slate-900 stroke-cyan-400 stroke-2" />
                  <circle cx="280" cy="90" r="4" className="fill-slate-900 stroke-cyan-400 stroke-2" />
                  <circle cx="460" cy="118" r="4" className="fill-slate-900 stroke-cyan-400 stroke-2" />

                  {/* Scatter dots for Systolic BP */}
                  <circle cx="40" cy="110" r="4" className="fill-slate-900 stroke-rose-400 stroke-2" />
                  <circle cx="160" cy="104" r="4" className="fill-slate-900 stroke-rose-400 stroke-2" />
                  <circle cx="280" cy="72" r="4" className="fill-slate-900 stroke-rose-400 stroke-2" />
                  <circle cx="460" cy="36" r="4" className="fill-slate-900 stroke-rose-400 stroke-2" />

                  {/* Axis dates at very bottom */}
                  <text x="35" y="190" className="text-[8px] fill-slate-500 font-mono">June 07</text>
                  <text x="145" y="190" className="text-[8px] fill-slate-500 font-mono">June 10</text>
                  <text x="255" y="190" className="text-[8px] fill-slate-500 font-mono">June 13</text>
                  <text x="365" y="190" className="text-[8px] fill-slate-500 font-mono">June 17</text>
                  <text x="445" y="190" className="text-[8px] fill-slate-500 font-mono">June 21</text>

                </svg>

                {/* Overlaid highlight annotations cards */}
                <div className="absolute right-4 bottom-14 bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl max-w-[150px] text-left">
                  <span className="text-[9px] font-bold text-rose-400 font-mono uppercase block">CRITICAL SPIKE</span>
                  <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">BP reached 132/84 when sleep dropped below 5.6h.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-left">
                <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">Sleep Deficit Severity</span>
                <p className="font-bold text-white text-base mt-1">High (Grade 2)</p>
                <p className="text-[11px] text-slate-400 mt-1">Consistently below ideal 7.2h wellness target.</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-left">
                <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-widest block">Potential Health Risks</span>
                <p className="font-bold text-white text-base mt-1">Cardiovascular strain / Asthma aggravation</p>
                <p className="text-[11px] text-slate-400 mt-1">Decreased pulmonary repair cycles can cause trace airways hyperresponsiveness.</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-left">
                <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Recommended Action Plan</span>
                <p className="font-bold text-white text-base mt-1">Cognitive sleep mapping</p>
                <p className="text-[11px] text-slate-400 mt-1">Avoid blue emissions post 21:30. Take Montelukast precisely at bedtime reminder.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
