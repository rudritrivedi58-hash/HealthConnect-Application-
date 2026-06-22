import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  Heart, Activity, TrendingUp, ShieldCheck, 
  Moon, Zap, ArrowLeftRight, Check, RefreshCw 
} from 'lucide-react';
import { HealthMetric } from '../../types';

interface HealthAnalyticsDashboardProps {
  metrics: HealthMetric[];
}

export default function HealthAnalyticsDashboard({ metrics }: HealthAnalyticsDashboardProps) {
  const [activeMetricTab, setActiveMetricTab] = useState<'cardio' | 'sleep' | 'steps'>('cardio');
  const [deviceSynced, setDeviceSynced] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);

  // Format date readable for charts
  const chartData = metrics.slice(-7).map(m => {
    const parts = m.date.split('-');
    const label = parts.length === 3 ? `${parts[1]}/${parts[2]}` : m.date;
    return {
      ...m,
      label,
      sys_bp: m.bloodPressureSys,
      dia_bp: m.bloodPressureDia
    };
  });

  const handleSyncClick = () => {
    setSyncLoading(true);
    setTimeout(() => {
      setSyncLoading(false);
      setDeviceSynced(true);
    }, 1500);
  };

  return (
    <div id="screen_analytics" className="h-full w-full bg-slate-50 flex flex-col justify-between overflow-hidden">
      
      {/* Upper header */}
      <div className="p-4 bg-white border-b border-slate-100 space-y-3 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Vitals & Analytics</h2>
            <p className="text-[10px] text-slate-505">Continuous biometric tracking</p>
          </div>

          <button
            onClick={handleSyncClick}
            className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${deviceSynced ? 'bg-[emerald-50]/50 border-emerald-100 text-emerald-700 font-extrabold' : 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'}`}
          >
            {syncLoading ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
                <span>Syncing Wearable...</span>
              </>
            ) : deviceSynced ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Fitbit Connected</span>
              </>
            ) : (
              <span>Wearable Synced (Offline)</span>
            )}
          </button>
        </div>

        {/* Analytic Tab switcher pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveMetricTab('cardio')}
            className={`flex-1 text-center py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex justify-center items-center gap-1 cursor-pointer ${activeMetricTab === 'cardio' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Cardio Index</span>
          </button>
          
          <button
            onClick={() => setActiveMetricTab('sleep')}
            className={`flex-1 text-center py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex justify-center items-center gap-1 cursor-pointer ${activeMetricTab === 'sleep' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <Moon className="w-3.5 h-3.5 text-blue-500" />
            <span>Sleep cycles</span>
          </button>

          <button
            onClick={() => setActiveMetricTab('steps')}
            className={`flex-1 text-center py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex justify-center items-center gap-1 cursor-pointer ${activeMetricTab === 'steps' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Steps Sync</span>
          </button>
        </div>
      </div>

      {/* Main Charts content list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Dynamic Recharts container based on tabs */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-400 uppercase tracking-widest text-[9px]">
              {activeMetricTab === 'cardio' ? 'Resting Heart Rate & BPSys' : activeMetricTab === 'sleep' ? 'Sleep Duration Schedule' : 'Steps Count History'}
            </span>
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
              Past 7 Days
            </span>
          </div>

          <div className="w-full h-44 mt-2">
            {activeMetricTab === 'cardio' ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis domain={[60, 150]} stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={2.5} name="Pulse bpm" activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="sys_bp" stroke="#3b82f6" strokeWidth={1.5} name="BP Sys" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            ) : activeMetricTab === 'sleep' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                  <Bar dataKey="sleepHours" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Hours Sleep" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis domain={[0, 12000]} stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                  <Bar dataKey="steps" fill="#10b981" radius={[4, 4, 0, 0]} name="Steps log" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Detailed index summary card */}
        {activeMetricTab === 'cardio' ? (
          <div className="bg-white border rounded-2xl p-4 gap-3 grid grid-cols-2 shadow-sm text-left">
            <div className="space-y-0.5 border-r pr-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">BP Average</span>
              <h4 className="text-sm font-extrabold text-slate-905">120 / 80 mmHg</h4>
              <p className="text-[10px] text-emerald-600 font-bold">⭐ Optimal index range</p>
            </div>
            
            <div className="space-y-0.5 pl-2 text-left">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Pulse Average</span>
              <h4 className="text-sm font-extrabold text-slate-905">72 bpm</h4>
              <p className="text-[10px] text-slate-400">Rest state normal limits</p>
            </div>
          </div>
        ) : activeMetricTab === 'sleep' ? (
          <div className="bg-white border rounded-2xl p-4 gap-3 grid grid-cols-2 shadow-sm text-left">
            <div className="space-y-0.5 border-r pr-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Weekly Sleep</span>
              <h4 className="text-sm font-extrabold text-slate-905">6.8 Hours Avg</h4>
              <p className="text-[10px] text-blue-600 font-medium">💤 Needs slightly more</p>
            </div>
            
            <div className="space-y-0.5 pl-2 text-left">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Rem schedule</span>
              <h4 className="text-sm font-extrabold text-slate-905">48 Mins Avg</h4>
              <p className="text-[10px] text-emerald-600 font-medium">Sleep efficiency 84%</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border rounded-2xl p-4 gap-3 grid grid-cols-2 shadow-sm text-left">
            <div className="space-y-0.5 border-r pr-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Steps Today</span>
              <h4 className="text-sm font-extrabold text-slate-905">8,420 steps</h4>
              <p className="text-[10px] text-emerald-600 font-bold animate-pulse">🎯 84% of your goal</p>
            </div>
            
            <div className="space-y-0.5 pl-2 text-left">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Active calories</span>
              <h4 className="text-sm font-extrabold text-slate-905">342 kcal</h4>
              <p className="text-[10px] text-slate-400">2.4 miles travelled</p>
            </div>
          </div>
        )}

        {/* AI Insight summary recommendation card */}
        <div className="bg-gradient-to-tr from-blue-700 to-indigo-700 text-white rounded-2xl p-4 shadow flex gap-3 text-left">
          <div className="p-2.5 bg-white/10 text-emerald-400 rounded-xl flex-shrink-0 my-auto">
            <TrendingUp className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-xs">AI Smart Vitals Insight</h4>
            <p className="text-[10.5px] text-blue-100 leading-relaxed font-normal">
              Comparing metrics suggests that on nights you sleep under **6 hours**, your systolic Blood Pressure increases slightly by **12%** the following morning. Consider taking your nightly **Montelukast (Singulair)** at **21:30** as a sleep wind-down reminder.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
