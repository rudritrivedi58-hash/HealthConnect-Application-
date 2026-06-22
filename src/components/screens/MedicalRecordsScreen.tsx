import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Check, Download, Share2, Search, 
  ChevronDown, ChevronUp, AlertCircle, Award 
} from 'lucide-react';
import { MedicalRecord } from '../../types';

interface MedicalRecordsScreenProps {
  recordsList: MedicalRecord[];
}

export default function MedicalRecordsScreen({ recordsList }: MedicalRecordsScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'lab_report' | 'prescription' | 'vaccination_record'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filtered = recordsList.filter(rec => {
    const matchesTab = activeTab === 'all' || rec.type === activeTab;
    const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rec.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div id="screen_records" className="h-full w-full bg-slate-50 flex flex-col justify-between overflow-hidden">
      
      {/* Search Header Area */}
      <div className="p-4 bg-white border-b border-slate-100 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Electronic Records</h2>
            <p className="text-[10px] text-slate-505">Tap record card to expand full lab insights</p>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-full">
            {filtered.length} Available
          </span>
        </div>

        {/* Search input bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents or doctors..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-950 rounded-xl py-2 pl-9 pr-4 text-xs font-medium outline-none focus:border-blue-500 shadow-inner"
          />
        </div>

        {/* Segmented Filter Pills */}
        <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-none">
          {([
            { id: 'all', title: 'All' },
            { id: 'lab_report', title: 'Labs' },
            { id: 'prescription', title: 'Prescriptions' },
            { id: 'vaccination_record', title: 'Vaccines' }
          ] as const).map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition ${activeTab === tb.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-800'}`}
            >
              {tb.title}
            </button>
          ))}
        </div>
      </div>

      {/* Structured documents stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {filtered.map((rec) => {
            const isExpanded = expandedId === rec.id;
            return (
              <motion.div 
                key={rec.id}
                layout
                className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
              >
                
                {/* Header overview trigger row */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                  className="p-4 flex justify-between items-start gap-3 cursor-pointer select-none"
                >
                  <div className="flex gap-3">
                    {/* Icon matching Type */}
                    <div className={`p-2.5 rounded-xl ${rec.type === 'lab_report' ? 'bg-blue-50 text-blue-600' : rec.type === 'prescription' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'} flex-shrink-0 my-auto`}>
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">
                        {rec.type.replace('_', ' ')} • {rec.date}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{rec.title}</h4>
                      <p className="text-[10px] text-slate-501">Prescribed by {rec.doctorName}</p>
                    </div>
                  </div>

                  {/* Expand-Collapse caret Chevron design */}
                  <div className="text-slate-400 my-auto pl-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Details panel with animations */}
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-50 bg-slate-50/50 p-4 space-y-3"
                  >
                    
                    {/* Document summary */}
                    <div className="text-[11px] text-slate-650 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                      <span className="text-[8px] uppercase tracking-wide px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-bold mr-1 inline-block">Diagnostic Summary</span>
                      {rec.summary}
                    </div>

                    {/* Technical details listed */}
                    <div className="space-y-1 bg-white border border-slate-100 rounded-xl shadow-sm p-3">
                      <h5 className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-2">Detailed Metrics Values</h5>
                      <div className="divide-y divide-slate-100">
                        {Object.entries(rec.details).map(([key, val]) => (
                          <div key={key} className="flex justify-between py-1.5 text-xs">
                            <span className="text-slate-505 font-medium">{key}</span>
                            <span className={`font-bold ${val.toString().toLowerCase().includes('high') ? 'text-red-500' : val.toString().toLowerCase().includes('normal') ? 'text-emerald-500' : 'text-slate-800'}`}>
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card action triggers (Download & Share) */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => triggerToast(`Downloaded ${rec.title}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>

                      <button 
                        onClick={() => triggerToast(`Secure URL dispatched to clinic contacts`)}
                        className="flex-1 bg-white text-slate-705 border border-slate-200 py-2 rounded-xl text-[10px] uppercase font-bold tracking-wider flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition"
                      >
                        <Share2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Share Report</span>
                      </button>
                    </div>

                  </motion.div>
                )}

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating global dynamic toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-md z-30 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
