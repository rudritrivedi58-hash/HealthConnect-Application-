import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Calendar, CheckCircle2, ShieldAlert, Award, 
  Clock, ArrowLeft, ChevronRight, Stethoscope
} from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentBookingScreenProps {
  preselectedDoctor?: { id: string; name: string; specialty: string; fee: number; slots: string[] } | null;
  chosenSlot?: string;
  onBookingComplete: (newAppt: Partial<Appointment>) => void;
  onCancel: () => void;
}

export default function AppointmentBookingScreen({ 
  preselectedDoctor, 
  chosenSlot = '', 
  onBookingComplete,
  onCancel 
}: AppointmentBookingScreenProps) {
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-25');
  const [selectedSlot, setSelectedSlot] = useState<string>(chosenSlot || '11:00 AM');
  const [symptoms, setSymptoms] = useState('');
  const [reason, setReason] = useState('Routine checkup & allergy consult');
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [bookedReceipt, setBookedReceipt] = useState<any>(null);

  // Fallback doctor object if someone triggers screen without picking one
  const doctor = preselectedDoctor || {
    id: 'doc_2',
    name: 'Dr. Sarah Jameson, MD',
    specialty: 'Pulmonology & Allergy Care',
    fee: 95,
    slots: ['08:00 AM', '10:30 AM', '01:15 PM', '03:45 PM']
  };

  const datesList = [
    { dayName: 'Mon', dayNum: '22', fullDate: '2026-06-22' },
    { dayName: 'Tue', dayNum: '23', fullDate: '2026-06-23' },
    { dayName: 'Wed', dayNum: '24', fullDate: '2026-06-24' },
    { dayName: 'Thu', dayNum: '25', fullDate: '2026-06-25' },
    { dayName: 'Fri', dayNum: '26', fullDate: '2026-06-26' },
    { dayName: 'Sat', dayNum: '27', fullDate: '2026-06-27' },
  ];

  const handleBook = () => {
    const freshAppt: Partial<Appointment> = {
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedSlot,
      status: 'upcoming',
      symptoms: symptoms || 'None reported',
      reason: reason || 'Consultation'
    };
    
    setBookedReceipt({
      ...freshAppt,
      id: `appt_sim_${Date.now()}`
    });
    setStep('success');
  };

  const fireParentCallback = () => {
    if (bookedReceipt) {
      onBookingComplete(bookedReceipt);
    }
  };

  return (
    <div id="screen_appointment_booking" className="h-full w-full overflow-y-auto bg-slate-50 text-slate-800">
      
      {step === 'details' ? (
        // DETAILS EDITING STEP
        <div className="p-5 space-y-4">
          
          {/* Header */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onCancel}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </button>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Confirm Reservation</h2>
              <p className="text-[10px] text-slate-500">Review schedule metrics & clinical notes</p>
            </div>
          </div>

          {/* Doctor Brief Info */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
            <div className="space-y-1">
              <span className="text-[9px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded uppercase">
                {doctor.specialty}
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1">{doctor.name}</h4>
              <p className="text-[10px] text-slate-400">CoPay insurance: fully covered</p>
            </div>
            
            <div className="text-right">
              <span className="text-xs font-black text-emerald-600 block">${doctor.fee}</span>
              <span className="text-[9px] text-slate-400 block">Consult Fee</span>
            </div>
          </div>

          {/* Date Selector (Interactive Calendar Horizontal Bar) */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Consultation Date</label>
            <div className="flex gap-2 justify-between">
              {datesList.map((dt) => (
                <button
                  key={dt.fullDate}
                  onClick={() => setSelectedDate(dt.fullDate)}
                  className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border transition-all duration-250 cursor-pointer ${selectedDate === dt.fullDate ? 'border-blue-600 bg-blue-600 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-501 hover:text-slate-800'}`}
                >
                  <span className={`text-[9px] uppercase tracking-wider ${selectedDate === dt.fullDate ? 'text-blue-100' : 'text-slate-400'}`}>
                    {dt.dayName}
                  </span>
                  <span className="text-xs font-black mt-1">
                    {dt.dayNum}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Slot Selector */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Confirmed Time Slot</label>
            <div className="grid grid-cols-4 gap-2">
              {doctor.slots.map((sl) => (
                <button
                  key={sl}
                  onClick={() => setSelectedSlot(sl)}
                  className={`text-[9px] py-2.5 rounded-xl border font-bold uppercase cursor-pointer transition-all ${selectedSlot === sl ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-501 hover:text-slate-800'}`}
                >
                  {sl}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Symptoms */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Describe symptoms (Optional)</label>
            <textarea
              rows={2}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Mild shortness of breath in morning, chest congestion allergen spike..."
              className="w-full bg-white text-slate-900 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs outline-none resize-none shadow-sm font-medium"
            />
          </div>

          {/* Booking Reason Selector choices */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consultation Objective</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Routine checkup & allergy consult',
                'Acute symptom evaluation',
                'Medication compliance review',
                'Diagnostic lab report analysis'
              ].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`p-2.5 rounded-xl border text-left text-[10px] leading-snug font-medium transition-all cursor-pointer ${reason === r ? 'border-blue-500 bg-blue-50/50 text-blue-700 font-bold' : 'border-slate-200 bg-white text-slate-505'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Block CTA */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-3.5 px-1">
              <span>Platform Service Tax (synthetic):</span>
              <span className="font-bold text-slate-600">Free Sandbox Session</span>
            </div>
            
            <button
              onClick={handleBook}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl shadow-md cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Verify & Reserve Appointment</span>
            </button>
          </div>

        </div>
      ) : (
        // SUCCESS STEP DESIGNED AS SCREEN CONFIRMATION
        <div className="h-full flex flex-col justify-between p-6 bg-gradient-to-b from-emerald-50 to-white text-center">
          
          <div />

          {/* Celebration center */}
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="bg-emerald-500 text-white p-4.5 rounded-full shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Appointment Secured!</h2>
              <p className="text-xs text-emerald-600 font-bold">Encrypted HIPAA token created successfully</p>
            </div>

            {/* Custom Receipt Box */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-left w-full space-y-3 shadow-inner">
              <div className="flex justify-between border-b pb-2 border-slate-200 text-xs">
                <span className="text-slate-400">Doctor Reference:</span>
                <span className="font-bold text-slate-800">{bookedReceipt?.doctorName}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2 border-slate-200 text-xs">
                <span className="text-slate-400">Time & Slot:</span>
                <span className="font-bold text-blue-700 uppercase">{bookedReceipt?.time} ({bookedReceipt?.date})</span>
              </div>

              <div className="flex justify-between border-b pb-2 border-slate-200 text-xs">
                <span className="text-slate-400">Purpose:</span>
                <span className="font-bold text-slate-800 truncate max-w-[150px]">{bookedReceipt?.reason}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Encrypted Patient QR ID:</span>
                <span className="font-mono text-[10px] text-slate-500">HC-TX-84920</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              A secure webhook and calendar link have been dispatched to your verified Google Account.
            </p>
          </div>

          {/* Bottom Button to close flow */}
          <button
            onClick={fireParentCallback}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md"
          >
            Go Back to Home Panel
          </button>
        </div>
      )}

    </div>
  );
}
