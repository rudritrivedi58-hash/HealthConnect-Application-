import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill, Clock, AlertTriangle, RefreshCw, Plus, 
  Check, ChevronRight, X, Sparkles, Smile 
} from 'lucide-react';
import { Medication } from '../../types';

interface MedicationReminderScreenProps {
  medicationsList: Medication[];
  onRefillRequest: (id: string) => void;
  onAddMedication: (newMed: Medication) => void;
}

export default function MedicationReminderScreen({ 
  medicationsList, 
  onRefillRequest,
  onAddMedication
}: MedicationReminderScreenProps) {
  const [takenStatus, setTakenStatus] = useState<Record<string, boolean>>({
    'med_1_morning': true,
    'med_1_evening': false,
    'med_2_evening': true
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFrequency, setNewFrequency] = useState('Once daily');
  const [newReminderTime, setNewReminderTime] = useState('08:00');
  const [newInstructions, setNewInstructions] = useState('');

  // Refill processing state
  const [refillLoadingId, setRefillLoadingId] = useState<string | null>(null);
  const [refillMessage, setRefillMessage] = useState<string | null>(null);

  // Quick taken progress counter
  const totalSlots = Object.keys(takenStatus).length;
  const takenSlots = Object.values(takenStatus).filter(Boolean).length;
  const percentage = totalSlots > 0 ? Math.round((takenSlots / totalSlots) * 100) : 0;

  const toggleTakenState = (key: string) => {
    setTakenStatus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleRefillClick = (id: string, name: string) => {
    setRefillLoadingId(id);
    setTimeout(() => {
      onRefillRequest(id);
      setRefillLoadingId(null);
      setRefillMessage(`Refill ordered for ${name}! Sent to CVS Pharmacy.`);
      setTimeout(() => setRefillMessage(null), 3050);
    }, 1200);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const freshMed: Medication = {
      id: `med_dyn_${Date.now()}`,
      name: newName,
      dosage: newDosage || '1 tablet',
      frequency: newFrequency,
      reminderTimes: [newReminderTime],
      remainingRefills: 4,
      nextRefillDate: '2026-08-12',
      alerts: ['Take consistently around identical schedules.'],
      sideEffects: [],
      instructions: newInstructions || 'Take with clean water after food.',
      status: 'active'
    };

    onAddMedication(freshMed);
    
    // Add custom status item
    const customKey = `${freshMed.id}_0`;
    setTakenStatus(prev => ({
      ...prev,
      [customKey]: false
    }));

    // Reset Form
    setNewName('');
    setNewDosage('');
    setNewInstructions('');
    setShowAddForm(false);
  };

  return (
    <div id="screen_medications" className="h-full w-full bg-slate-50 flex flex-col justify-between overflow-hidden relative">
      
      {/* Upper Progress Panel */}
      <div className="bg-white p-4 border-b border-slate-100 space-y-3 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Active Prescriptions</h2>
            <p className="text-[10px] text-slate-505">Track compliance & dosage logs</p>
          </div>
          
          <button 
            id="btn_open_add_med"
            onClick={() => setShowAddForm(true)}
            className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition cursor-pointer"
            title="Register new medication plan"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Circular tracker simulated with bars */}
        <div className="bg-slate-100/70 p-3 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Today's Progress</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-slate-900">{takenSlots}</span>
              <span className="text-xs text-slate-400">of {totalSlots} doses taken</span>
            </div>
          </div>

          <div className="w-24 text-right">
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
            </div>
            <span className="text-[10px] font-bold text-blue-600 block mt-1">{percentage}% Compliance</span>
          </div>
        </div>
      </div>

      {/* Alarms and meds streams */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Alerts or notifications */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 flex gap-2.5 items-start">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs">Pollen Shield Alert</h4>
            <p className="text-[10px] text-slate-502 leading-snug">
              Keep your Albuterol rescue inhaler at hand. Local ragweed allergen scores have shifted to critical levels today.
            </p>
          </div>
        </div>

        {/* Pill list container */}
        <div className="space-y-3">
          {medicationsList.map((med) => {
            return (
              <div 
                key={med.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3.5"
              >
                {/* Upper description row */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-2.5">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0 my-auto">
                      <Pill className="w-5 h-5" />
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-slate-900">{med.name}</h4>
                      <p className="text-[10px] text-slate-505 font-medium">{med.dosage} • {med.frequency}</p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${med.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {med.status}
                  </span>
                </div>

                {/* Alarm schedules inside card */}
                <div className="bg-slate-50/70 p-2.5 rounded-xl space-y-2">
                  <span className="text-[8px] font-extrabold uppercase text-slate-400 tracking-wider block">Reminder Clocks</span>
                  
                  <div className="flex flex-col gap-1.5">
                    {med.reminderTimes.map((time, tIdx) => {
                      const alarmKey = `${med.id}_${tIdx}`;
                      const isTaken = takenStatus[alarmKey] || false;
                      
                      return (
                        <div key={tIdx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100 gap-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{time}</span>
                          </div>
                          
                          <button
                            onClick={() => toggleTakenState(alarmKey)}
                            className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase cursor-pointer transition flex items-center gap-1 ${isTaken ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-600 text-white'}`}
                          >
                            {isTaken ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Checked</span>
                              </>
                            ) : (
                              <span>Take Dose</span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Refill trigger option */}
                <div className="flex justify-between items-center text-xs pt-2.5 border-t border-slate-50 text-[10.5px]">
                  <div className="text-slate-400">
                    Remaining refills: <span className="font-bold text-slate-800">{med.remainingRefills}</span>
                  </div>

                  <button
                    disabled={med.remainingRefills === 0 || refillLoadingId === med.id}
                    onClick={() => handleRefillClick(med.id, med.name)}
                    className="text-[9px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg transition border border-blue-100 flex items-center gap-1 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    {refillLoadingId === med.id ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Ordering...</span>
                      </>
                    ) : (
                      <span>Request Refill</span>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* SCHEDULE NEW MEDICINE DRAWER FORM */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ y: 350 }}
            animate={{ y: 0 }}
            exit={{ y: 350 }}
            className="absolute inset-x-0 bottom-0 bg-white border-t border-slate-200 p-5 rounded-t-[32px] shadow-2xl z-40 space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center gap-1.5 text-blue-600">
                <Sparkles className="w-4 h-4 fill-blue-500/20 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Schedule Medicine Alarm</span>
              </div>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-left">
              <div>
                <label className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider mb-1">Medicine Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Advil 200mg, Claritin, etc."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider mb-1">Dosage size</label>
                  <input 
                    type="text"
                    required
                    placeholder="1 tablet, 2 puffs, etc."
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider mb-1">Reminder Alarm Clock</label>
                  <input 
                    type="time"
                    required
                    value={newReminderTime}
                    onChange={(e) => setNewReminderTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider mb-1">Instructions / Advisory</label>
                <input 
                  type="text"
                  placeholder="e.g. Take with warm food, avoid grapefruits, etc."
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Register schedule
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refill Success notification toast */}
      <AnimatePresence>
        {refillMessage && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-5 right-5 bg-slate-900 border border-slate-800 text-white p-3 rounded-xl text-xs shadow-2xl z-50 text-left flex items-start gap-2.5"
          >
            <div className="bg-emerald-500 text-slate-900 p-1 rounded-lg">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold">Dispatch Successful</h5>
              <p className="text-[10px] text-slate-350">{refillMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
