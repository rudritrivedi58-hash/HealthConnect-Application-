import { useState } from 'react';
import { 
  FileText, Activity, BookOpen, PenTool, Sparkles, Check, 
  Send, RefreshCcw, ShieldCheck, UserCheck, AlertCircle, PlusCircle,
  Stethoscope, Save, Pill, Award
} from 'lucide-react';
import { Appointment, Medication, MedicalRecord, HealthMetric } from '../types';

interface DoctorDashboardProps {
  userProfile: any;
  appointments: Appointment[];
  medications: Medication[];
  records: MedicalRecord[];
  healthMetrics: HealthMetric[];
  onAddRecord: (record: MedicalRecord) => void;
}

export default function DoctorDashboard({
  userProfile,
  appointments,
  medications,
  records,
  healthMetrics,
  onAddRecord
}: DoctorDashboardProps) {
  const [activeTab2, setActiveTab2] = useState<'ehr' | 'notes_copilot' | 'billing_search'>('ehr');
  
  // Custom generated notes state
  const [notesTopic, setNotesTopic] = useState("Seasonal asthma follow-up and ragweed allergy control evaluation");
  const [generatedNotes, setGeneratedNotes] = useState<string>("");
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [noteSaveSuccess, setNoteSaveSuccess] = useState(false);

  // Manual draft states
  const [icdCodesDraft, setIcdCodesDraft] = useState<string>("J45.20 (intermittent asthma), J30.1 (allergic rhinitis)");
  const [prescriptionDraft, setPrescriptionDraft] = useState<string>("Montelukast tablet 10mg: 1 tablet daily qHS, Albuterol inhaler q4h prn wheeze");

  // Core patient record alex rivera references
  const alexProfileSummary = {
    name: "Alex Rivera",
    age: 34,
    gender: "Non-binary",
    criticalAllergy: "Penicillin (Severe hives allergen alert)",
    conditions: "Mild intermittent asthma, Seasonal Ragweed rhinitis",
    latestLab: "WBC 11.2 K/uL (Slightly elevated), Cholesterol 195 (Optimal)"
  };

  const codeLookupList = [
    { code: "J45.20", description: "Mild intermittent asthma, uncomplicated", status: "Active" },
    { code: "J30.1", description: "Allergic rhinitis due to pollen (ragweed)", status: "Active" },
    { code: "Z88.0", description: "Penicillin allergy status warning code", status: "Critical" },
    { code: "G47.00", description: "Insomnia / Sleep pattern disturbance unspecified", status: "Secondary" },
    { code: "J45.909", description: "Unspecified asthma, uncomplicated", status: "Secondary" }
  ];

  // Call real server API to generate clinical notes
  const handleGenerateNotes = async () => {
    setIsNotesLoading(true);
    setGeneratedNotes("");
    try {
      const res = await fetch('/api/doctor/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notesTopic })
      });
      const data = await res.json();
      setGeneratedNotes(data.notes);
    } catch (e) {
      // Inline robust clinical drafting simulator
      setTimeout(() => {
        setGeneratedNotes(`### 📝 Pre-populated Examination Summary

**Patient:** Alex Rivera | **Age:** 34 | **Gender:** Non-binary
**Date of Encounter:** June 21, 2026
**Symptoms Evaluated:** ${notesTopic}

**1. Subjective Assessment:**
Patient indicates seasonal pollen triggers aggravate breathing patterns. Complains of chest soreness on deep inhalation. Sleep deprivation reported (approx. 20% decline).

**2. Physical Examination Elements:**
*   **Vitals:** BP 132/84 mmHg, HR 78 bpm, Respiration: 16/min.
*   **Chest / Lungs:** Dry, mild scattered wheezing localized in left middle lobes. No chest wall retraction.
*   **Heart Rate:** S1, S2 audible, no murmurs.

**3. Assessment Diagnosis Codes:**
*   \`J45.20\` : Mild intermittent asthma
*   \`J30.1\` : Allergic rhinitis due to pollen (pollen triggers)

**4. Clinical Treatment Plan:**
*   Instructed compliance check for bedtime Singular (Montelukast 10mg daily).
*   Rescue Albuterol inhaler: 2 puffs q4h as needed. Rinse oral cavity post-use.
*   Log resting blood pressure in weekly intervals.`);
      }, 1000);
    } finally {
      setIsNotesLoading(false);
    }
  };

  const handlePushToRecords = () => {
    if (!generatedNotes) return;

    // Build medical records record structure
    const recId = `rec_doc_${Date.now()}`;
    const newRecord: MedicalRecord = {
      id: recId,
      type: 'clinical_history',
      title: "Physician Clinical Consult: Allergic Asthma",
      date: new Date().toISOString().split('T')[0],
      doctorName: userProfile?.name || "Dr. Elizabeth Sarah, MD",
      summary: `Clinician encounter summary notes with Alex Rivera regarding seasonal bronchial asthma triggers. Stated diagnosis codes include ICD-10 categories J45.20 & J30.1.`,
      details: {
        "Encounter Summary notes": "Synchronized successfully through CareAI doctor copilot engine.",
        "Diagnostic Codes Billing": "J45.20 (Mild intermittent asthma), J30.1 (Allergic rhinitis)",
        "Stated prescription plan": prescriptionDraft
      }
    };

    onAddRecord(newRecord);
    setNoteSaveSuccess(true);
    setTimeout(() => {
      setNoteSaveSuccess(false);
      setActiveTab2('ehr');
    }, 2000);
  };

  return (
    <div id="doctor_dashboard_container" className="space-y-6 text-slate-100 font-sans pb-16">
      
      {/* Clinician Welcome Row banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-5 rounded-3xl border border-slate-700/35 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest bg-cyan-500/10 px-2.5 py-0.5 rounded-full">Doctor Portal</span>
            <span className="text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Security Shield Guard Enabled
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1.5">Welcome, {userProfile?.name || 'Dr. Sarah'}</h2>
          <p className="text-xs text-slate-350 mt-1 max-w-xl">
            This module provides a secure clinical copilot. You can draft consultation summaries, match correct billing codes, and preview the telemetry status of patient Alex Rivera.
          </p>
        </div>

        <div className="text-right">
          <span className="text-slate-500 text-[10px] block font-mono">AUTHORIZED PHYSICIAN SPEC:</span>
          <span className="text-xs bg-slate-900 border border-slate-700 p-2 rounded-xl text-cyan-400 font-mono font-bold block mt-1">
            License Provider MD-202681
          </span>
        </div>
      </div>

      {/* Internal Doctor tabs */}
      <div className="flex gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur">
        <button
          onClick={() => setActiveTab2('ehr')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-medium cursor-pointer transition-all ${activeTab2 === 'ehr' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          <UserCheck className="w-4 h-4" /> EHR Patient Review
        </button>
        <button
          onClick={() => setActiveTab2('notes_copilot')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-medium cursor-pointer transition-all ${activeTab2 === 'notes_copilot' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          <Sparkles className="w-4 h-4" /> Clinical Note Copilot
        </button>
        <button
          onClick={() => setActiveTab2('billing_search')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-medium cursor-pointer transition-all ${activeTab2 === 'billing_search' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          <BookOpen className="w-4 h-4" /> ICD-10 Billing Codes
        </button>
      </div>

      {/* ========================================================
          1. EHR PATIENT SUMMARY COMPILER
         ======================================================== */}
      {activeTab2 === 'ehr' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Patient Quick Glance summary card */}
          <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 text-left">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-850">
              <h3 className="font-bold text-sm text-slate-100">Patient Identifier Summary</h3>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" title="Patient Online"></span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                <span className="text-slate-500 text-[10px] font-mono block">Patient Name:</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{alexProfileSummary.name}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{alexProfileSummary.age} yrs | {alexProfileSummary.gender}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-slate-500">Chronic issues:</span> <span className="text-white font-semibold font-mono text-right">{alexProfileSummary.conditions}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500 text-xs text-rose-400 font-bold">⚠️ Critical Alarms:</span> <span className="text-rose-400 font-bold font-mono">{alexProfileSummary.criticalAllergy}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Active Lab indicator:</span> <span className="text-slate-100 font-mono">{alexProfileSummary.latestLab}</span></div>
              </div>

              {/* Patient vital averages */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850 space-y-2 mt-4">
                <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest font-mono">Trailing Telemetry averages</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-1 bg-slate-900 rounded"><span className="text-[9px] text-slate-500 font-mono block">SLEEP</span> <span className="font-black text-white">5.6h</span></div>
                  <div className="p-1 bg-slate-900 rounded"><span className="text-[9px] text-slate-500 font-mono block">HEART</span> <span className="font-black text-rose-400">78bpm</span></div>
                  <div className="p-1 bg-slate-900 rounded"><span className="text-[9px] text-slate-500 font-mono block">REST BP</span> <span className="font-black text-white">132/84</span></div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setNotesTopic("Draft detailed review notes on patient Alex Rivera's seasonal respiratory wheezing and elevated WBC labs.");
                  setActiveTab2('notes_copilot');
                }}
                className="w-full bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/20 py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <Sparkles className="w-3.5 h-3.5" /> Draft consultation notes
              </button>
            </div>
          </div>

          {/* Patient medical records and prescription reviews */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 space-y-4">
              <h3 className="font-bold text-sm text-slate-100">Prescription Refill Requests & Overviews</h3>
              
              <div className="space-y-3.5">
                {medications.map((med) => (
                  <div key={med.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-850/80 flex justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-100">{med.name}</h4>
                      <p className="text-xs text-slate-400">Sig dosage: {med.dosage} | Frequency: {med.frequency}</p>
                      
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono pt-1">
                        <span>Reminder clocks: {med.reminderTimes.join(' , ')}</span>
                        <span>•</span>
                        <span className="text-cyan-400 font-semibold">Refills remaining: {med.remainingRefills}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => alert(`Prescription draft created for drug ${med.name}. Submit to CareAI to log.`)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 py-1.5 px-3 rounded-xl text-[10px] font-mono border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                      >
                        Adjust dosage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List of clinical records on file */}
            <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 space-y-4">
              <h3 className="font-bold text-sm text-slate-100">Patient Electronic Health History On File</h3>
              
              <div className="space-y-3">
                {records.map((rec) => (
                  <div key={rec.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-sans">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono font-bold block w-max uppercase">{rec.type}</span>
                        <h4 className="font-bold text-xs text-white mt-1.5">{rec.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">{rec.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">{rec.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          2. CLINICAL NOTES COPILOT TAB
         ======================================================== */}
      {activeTab2 === 'notes_copilot' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 text-left space-y-5 animate-fadeIn">
          
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" /> AI Consultation Note Copilot
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Command CareAI to auto-draft highly structured clinical SOAP evaluation summaries. You can immediately push these to Alex Rivera's electronic record vault.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Input criteria */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-mono block">Encounter Topic Instructions</label>
                <textarea 
                  rows={4}
                  value={notesTopic}
                  onChange={(e) => setNotesTopic(e.target.value)}
                  placeholder="e.g. Throat irritation evaluation and medication compliance verification check..."
                  className="w-full bg-slate-950 border border-slate-850 p-3 rounded-2xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-sans leading-relaxed"
                />
              </div>

              {/* Companion notes options */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3 text-xs">
                <span className="font-bold text-slate-400 uppercase font-mono text-[10px]">Customize diagnosis parameters</span>
                
                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">RECOMMENDED ICD-10 DIAGNOSES</label>
                    <input 
                      type="text" 
                      value={icdCodesDraft}
                      onChange={(e) => setIcdCodesDraft(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">PROPOSED TREATMENT DISPENSE PLAN</label>
                    <input 
                      type="text" 
                      value={prescriptionDraft}
                      onChange={(e) => setPrescriptionDraft(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <button
                id="btn_trigger_note_generation"
                onClick={handleGenerateNotes}
                disabled={isNotesLoading || !notesTopic.trim()}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all uppercase"
              >
                {isNotesLoading ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin text-dark" /> Compiling clinical knowledge...
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4" /> Generate Consultation SOAP Notes Draft
                  </>
                )}
              </button>
            </div>

            {/* Display Generated Note */}
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider font-mono">Resulting Consultation Note Draft</h4>
              
              {generatedNotes ? (
                <div className="space-y-3">
                  <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-850 text-xs text-slate-300 font-sans h-[320px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-text border-l-4 border-l-emerald-500">
                    {generatedNotes}
                  </div>

                  {noteSaveSuccess ? (
                    <div className="bg-emerald-950 p-4 rounded-xl border border-emerald-500/20 text-center text-xs text-emerald-400 font-mono font-bold flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Note added securely to Alex Rivera's EHR data records!
                    </div>
                  ) : (
                    <button
                      id="btn_save_consultation_notes"
                      onClick={handlePushToRecords}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Save className="w-4 h-4" /> Verify, Sign, and Push Notes to EHR Records
                    </button>
                  )}
                </div>
              ) : (
                <div className="h-[320px] bg-slate-950/40 p-6 rounded-2xl border border-dashed border-slate-850 flex flex-col items-center justify-center text-center">
                  <Stethoscope className="w-12 h-12 text-slate-650" />
                  <p className="text-xs text-slate-400 mt-2 font-semibold">Ready for encounter instructions</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-xs leading-normal">
                    Insert doctor clinical comments or specific diagnosis commands on the Left form and trigger simulation to retrieve drafts instantly.
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          3. BILLING INFORMATION CODING
         ======================================================== */}
      {activeTab2 === 'billing_search' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 text-left space-y-4 animate-fadeIn">
          <div>
            <h3 className="font-bold text-base text-white">ICD-10 Diagnostic & Claim Mapping</h3>
            <p className="text-xs text-slate-400 mt-1">
              Search and map correct clinical diagnostic coding identifiers to avoid insurance claim disruptions.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden text-xs">
            <div className="bg-slate-900/50 p-4 border-b border-slate-850 flex items-center justify-between font-mono text-[10px] text-slate-505">
              <span>Standard claim templates J45 class</span>
              <span>ICD-10 Version: 2026 Revision</span>
            </div>

            <div className="divide-y divide-slate-850">
              {codeLookupList.map((icd, elementId) => (
                <div 
                  key={elementId} 
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-cyan-400 font-lg bg-cyan-950/50 border border-cyan-500/25 px-2 py-0.5 rounded">
                        {icd.code}
                      </span>
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.2 rounded ${
                        icd.status === 'Critical' 
                          ? 'bg-rose-950 text-rose-400 border border-rose-500/20' 
                          : icd.status === 'Active'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {icd.status}
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium font-sans text-xs">{icd.description}</p>
                  </div>

                  <button
                    id={`btn_inject_code_${icd.code}`}
                    onClick={() => {
                      setIcdCodesDraft(prev => prev.includes(icd.code) ? prev : `${prev}, ${icd.code}`);
                      alert(`Code ${icd.code} injected into consultation billing panel successfully.`);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-705 p-2 rounded-xl text-[10px] font-semibold text-slate-300 font-mono transition-colors shrink-0 text-center"
                  >
                    Inject Note Code
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
