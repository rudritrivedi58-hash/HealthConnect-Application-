import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Calendar, Heart, ShieldAlert, FileText, Pill, 
  ChevronRight, ArrowRight, Video, Sparkles
} from 'lucide-react';
import { Appointment } from '../../types';

interface HomeScreenProps {
  user: { name: string; age: number; bloodType: string };
  upcomingAppointments: Appointment[];
  activeMedicationsCount: number;
  onNavigate: (screen: string) => void;
  onSelectAppointment: (appointment: Appointment) => void;
}

export default function HomeScreen({ 
  user, 
  upcomingAppointments, 
  activeMedicationsCount,
  onNavigate,
  onSelectAppointment
}: HomeScreenProps) {
  
  // Custom list of modern Health Tips
  const healthTips = [
    {
      id: 1,
      tag: "Seasonal Advice",
      title: "Managing Ragweed Allergy Spikes",
      desc: "Local pollen levels are extremely elevated this week. Wash hair before bedtime to avoid pollen transference to bed sheets.",
      color: "blue"
    },
    {
      id: 2,
      tag: "Cardio Health",
      title: "Aerobic Heart Intervals",
      desc: "30 minutes of light cycling keeps heart vessels pliable. Track sleep schedules alongside exertion trends to check stress indices.",
      color: "emerald"
    }
  ];

  const activeAppts = upcomingAppointments.filter(a => a.status === 'upcoming');

  return (
    <div id="screen_home" className="h-full w-full overflow-y-auto bg-slate-950 text-slate-100 scrollbar-none">
      
      {/* Upper User Greeting Panel */}
      <div className="bg-gradient-to-b from-blue-950/80 to-slate-950 text-white px-5 pt-5 pb-9 rounded-b-[32px] border-b border-slate-900">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Authorized Patient Session</span>
            <h2 className="text-xl font-extrabold tracking-tight mt-0.5">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-350 bg-slate-900/80 px-2.5 py-1 rounded-full w-fit border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Bio-Telemetry Synced (100%)</span>
            </div>
          </div>
          
          <div 
            onClick={() => onNavigate('profile')} 
            className="w-10 h-10 rounded-full border border-slate-800 bg-slate-900 text-blue-400 flex items-center justify-center font-bold text-sm shadow-sm hover:scale-105 transition-transform cursor-pointer"
          >
            AR
          </div>
        </div>

        {/* Dynamic Interactive Health Summary Card */}
        <div className="bg-slate-900/80 text-white rounded-2xl p-4 shadow-xl border border-slate-800/80 backdrop-blur-md flex flex-col gap-3">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-800/60">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Health Indices</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              Safe Baseline
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 divide-x divide-slate-800/60">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-medium block">Heart Rate</span>
              <span className="text-base font-extrabold text-slate-100 block mt-0.5 flex items-center justify-center gap-0.5">
                72 <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse inline" />
              </span>
              <span className="text-[9px] text-slate-500">Resting Avg</span>
            </div>
            
            <div className="text-center pl-1">
              <span className="text-[10px] text-slate-400 font-medium block">Blood Pressure</span>
              <span className="text-base font-extrabold text-slate-100 block mt-0.5">
                120/80
              </span>
              <span className="text-[9px] text-slate-500">SYS/DIA mmHg</span>
            </div>

            <div className="text-center pl-1">
              <span className="text-[10px] text-slate-400 font-medium block">Active Sleep</span>
              <span className="text-base font-extrabold text-cyan-400 block mt-0.5 animate-pulse">
                7.2h
              </span>
              <span className="text-[9px] text-emerald-400 font-medium">82% Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main flow items container */}
      <div className="px-5 -mt-5 pb-6 space-y-4">
        
        {/* Quick Action Navigation Grid */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 backdrop-blur-md">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Triage Express Shortcuts</h3>
          <div className="grid grid-cols-5 gap-1 shadow-inner justify-items-center">
            
            <button 
              id="btn_quick_doctor"
              onClick={() => onNavigate('doctors')}
              className="flex flex-col items-center gap-1.5 cursor-pointer group hover:scale-105 transition-transform"
            >
              <div className="w-11 h-11 bg-slate-950 text-blue-400 rounded-xl flex items-center justify-center border border-slate-850 group-hover:border-blue-500/45 transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-350 text-center leading-tight">Book MD</span>
            </button>

            <button 
              id="btn_quick_checker"
              onClick={() => onNavigate('symptom_checker')}
              className="flex flex-col items-center gap-1.5 cursor-pointer group hover:scale-105 transition-transform"
            >
              <div className="w-11 h-11 bg-slate-950 text-emerald-400 rounded-xl flex items-center justify-center border border-slate-850 group-hover:border-emerald-500/45 transition-colors relative">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[7px] px-1 font-extrabold rounded-full">AI</span>
              </div>
              <span className="text-[10px] font-bold text-slate-350 text-center leading-tight">Symptom AI</span>
            </button>

            <button 
              id="btn_quick_records"
              onClick={() => onNavigate('records')}
              className="flex flex-col items-center gap-1.5 cursor-pointer group hover:scale-105 transition-transform"
            >
              <div className="w-11 h-11 bg-slate-950 text-purple-400 rounded-xl flex items-center justify-center border border-slate-850 group-hover:border-purple-500/45 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-350 text-center leading-tight">Records</span>
            </button>

            <button 
              id="btn_quick_meds"
              onClick={() => onNavigate('medications')}
              className="flex flex-col items-center gap-1.5 cursor-pointer group hover:scale-105 transition-transform"
            >
              <div className="w-11 h-11 bg-slate-950 text-amber-400 rounded-xl flex items-center justify-center border border-slate-850 group-hover:border-amber-500/45 transition-colors relative">
                <Pill className="w-5 h-5" />
                {activeMedicationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {activeMedicationsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-350 text-center leading-tight">Meds</span>
            </button>

            <button 
              id="btn_quick_sos"
              onClick={() => onNavigate('sos')}
              className="flex flex-col items-center gap-1.5 cursor-pointer group hover:scale-105 transition-transform"
            >
              <div className="w-11 h-11 bg-slate-950 text-rose-500 rounded-xl flex items-center justify-center border border-slate-850 group-hover:border-rose-500/45 transition-colors">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-rose-500 text-center leading-tight">SOS ER</span>
            </button>

          </div>
        </div>

        {/* Dynamic Upcoming Appointment Alert Panel */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/85">
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Consultations</h3>
            <button 
              onClick={() => onNavigate('appointments')}
              className="text-[10px] text-blue-400 font-bold flex items-center hover:underline"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeAppts.length === 0 ? (
            <div className="py-4 text-center text-slate-500 bg-slate-950 rounded-xl border border-dashed border-slate-800 animate-pulse">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-1" />
              <p className="text-xs">No upcoming booked consultations.</p>
              <button 
                onClick={() => onNavigate('doctors')}
                className="text-xs text-blue-400 font-bold mt-1 hover:underline"
              >
                Schedule appointment
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {activeAppts.slice(0, 1).map((appt) => (
                <div 
                  key={appt.id} 
                  className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex flex-col gap-2 cursor-pointer hover:border-slate-700 transition-colors"
                  onClick={() => onSelectAppointment(appt)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{appt.doctorName}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">{appt.specialty} • Telehealth</p>
                    </div>
                    <span className="text-[10px] bg-slate-900 text-cyan-400 font-bold border border-slate-800 px-2 py-0.5 rounded-full font-mono">
                      {appt.time}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-slate-900 text-[11px]">
                    <span className="text-slate-450 font-mono">
                      📅 {appt.date}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('video_consultation');
                      }}
                      className="bg-blue-600 text-white font-bold px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-blue-500 transition"
                    >
                      <Video className="w-3 h-3" />
                      <span>Join HD Call</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Curated Health Tips Slider view */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Health Feed</h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/10">Daily Update</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-none snap-x">
            {healthTips.map((tip) => (
              <div 
                key={tip.id} 
                className="snap-center min-w-[245px] max-w-[245px] bg-slate-900 rounded-xl p-3.5 border border-slate-800 flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[8px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md ${tip.color === 'blue' ? 'bg-blue-950/40 text-blue-400 border border-blue-900/30' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'}`}>
                    {tip.tag}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">June 2026</span>
                </div>
                <h4 className="font-bold text-xs text-slate-100">{tip.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Quick Navigation Shortcut Banner */}
        <div 
          onClick={() => onNavigate('analytics')}
          className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-4 rounded-2xl flex items-center justify-between border border-emerald-900/30 shadow-sm cursor-pointer hover:border-emerald-500/40 transition-all"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-emerald-400">Wearable Sync Active</h4>
            <p className="text-[10px] text-slate-400">Compare your real-time Fitbit heart indices and sleep trend graphs.</p>
          </div>
          <div className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-lg border border-emerald-500/20">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </div>
    </div>
  );
}
