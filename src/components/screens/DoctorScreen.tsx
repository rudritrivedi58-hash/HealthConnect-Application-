import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Star, Clock, Heart, Award, ChevronLeft, 
  MapPin, Shield, CalendarCheck, Check
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewsCount: number;
  fee: number;
  imageUrl: string;
  about: string;
  qualifications: string[];
  slots: string[];
  location: string;
}

interface DoctorScreenProps {
  onSelectDoctorForBooking: (doctor: Doctor, chosenSlot: string) => void;
  onNavigate: (screen: string) => void;
}

export default function DoctorScreen({ onSelectDoctorForBooking, onNavigate }: DoctorScreenProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const specialties = ['All', 'Primary Care', 'Cardiology', 'Pulmonology', 'Dermatology', 'Neurology'];

  const doctors: Doctor[] = [
    {
      id: 'doc_1',
      name: 'Dr. Robert Chen, MD',
      specialty: 'Cardiology',
      experience: 12,
      rating: 4.8,
      reviewsCount: 142,
      fee: 120,
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop',
      about: 'Dr. Robert Chen is a board-certified cardiologist specializing in preventive cardiovascular wellness, heart stress evaluations, and cardiovascular rehabilitation. He completed his clinical cardiac fellowship at Stanford Medical.',
      qualifications: ['MD - Stanford University School of Medicine', 'Cardiovascular Disease Fellowship - UCLA Medical Center', 'Board Certified in Adult Cardiology'],
      slots: ['09:30 AM', '11:00 AM', '02:00 PM', '04:30 PM'],
      location: 'Metropolitan Heart Clinic, Floor 4, Suite B'
    },
    {
      id: 'doc_2',
      name: 'Dr. Sarah Jameson, MD',
      specialty: 'Pulmonology',
      experience: 15,
      rating: 4.9,
      reviewsCount: 208,
      fee: 95,
      imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=200&auto=format&fit=crop',
      about: 'Dr. Sarah Jameson is a nationally acclaimed pulmonary disease specialist and pulmonary provider with extensive experience managing seasonal asthmas, chronic allergies, and airway optimization.',
      qualifications: ['MD - Johns Hopkins University School of Medicine', 'Residency in Pulmonary Medicine - Johns Hopkins Hospital', 'Chairperson of Regional Asthma Coalition'],
      slots: ['08:00 AM', '10:30 AM', '01:15 PM', '03:45 PM'],
      location: 'Lakefront Wellness Group, Suite 102'
    },
    {
      id: 'doc_3',
      name: 'Dr. Amanda White, MD',
      specialty: 'Dermatology',
      experience: 8,
      rating: 4.7,
      reviewsCount: 89,
      fee: 110,
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop',
      about: 'Dr. Amanda White is a highly qualified double board-certified dermatologist focusing on corrective dermatology, preventative skin checks, and allergen contact skin evaluations.',
      qualifications: ['MD - Harvard Medical School', 'Dermatology Residency - Massachusetts General Hospital', 'Fellow of American Academy of Dermatology'],
      slots: ['09:00 AM', '11:30 AM', '02:45 PM', '05:00 PM'],
      location: 'Skinsafe Specialist Center, Suite 404'
    },
    {
      id: 'doc_4',
      name: 'Dr. Marcus Brody, MD',
      specialty: 'Neurology',
      experience: 14,
      rating: 4.9,
      reviewsCount: 167,
      fee: 135,
      imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop',
      about: 'Dr. Marcus Brody specializes in cognitive neuroscience, migraine triggers, and complex autonomic peripheral neuropathies. He is an associate professor in clinical neural science.',
      qualifications: ['MD - Columbia University Vagelos College of Physicians and Surgeons', 'Neurology Fellowship - NewYork-Presbyterian Hospital'],
      slots: ['10:00 AM', '11:15 AM', '03:00 PM', '04:15 PM'],
      location: 'NeuroScience Associates, Suite A'
    }
  ];

  // Filters logic
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const backToSearch = () => {
    setSelectedDoctor(null);
    setSelectedSlot('');
  };

  const selectSlot = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleBookConsultation = () => {
    if (!selectedDoctor || !selectedSlot) return;
    onSelectDoctorForBooking(selectedDoctor, selectedSlot);
  };

  return (
    <div id="screen_doctors" className="h-full w-full overflow-y-auto bg-slate-950 text-slate-100 scrollbar-none">
      
      {!selectedDoctor ? (
        // SCREEN 4: SEARCH & FILTER VIEW
        <div className="p-5 space-y-4">
          
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">Clinical Advisors</h2>
              <p className="text-xs text-slate-400">Search secure listings & book video slots</p>
            </div>
            <div className="text-[10px] bg-blue-950 border border-blue-900/30 text-blue-400 px-2.5 py-1 rounded-full font-mono font-bold">
              {filteredDoctors.length} Providers
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4.5 h-4.5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specialty, practitioner etc..."
              className="w-full bg-slate-900 text-white border border-slate-800 focus:border-cyan-500/50 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium outline-none shadow-inner"
            />
          </div>

          {/* Specialities horizontal scroller */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${selectedSpecialty === spec ? 'bg-blue-600 text-white border border-blue-500' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Doctors cards list */}
          <div className="space-y-3.5">
            {filteredDoctors.length === 0 ? (
              <div className="py-12 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-center text-slate-500">
                <p className="text-xs font-medium">No specialties found matching filters.</p>
              </div>
            ) : (
              filteredDoctors.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 hover:border-slate-700 flex gap-3.5 hover:shadow-lg transition-all cursor-pointer duration-300"
                >
                  {/* Doctor picture */}
                  <div className="relative flex-shrink-0">
                    <img 
                      src={doc.imageUrl} 
                      alt={doc.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 bg-slate-900"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-slate-950 border border-slate-800 p-0.5 rounded-full text-amber-500 flex items-center justify-center">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    </div>
                  </div>

                  {/* Doctor Info details card */}
                  <div className="flex-1 min-w-0 space-y-1 text-left">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-200 text-xs truncate pr-1">{doc.name}</h4>
                      <span className="text-[10px] text-emerald-400 font-extrabold whitespace-nowrap bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded-md font-mono">
                        ${doc.fee}
                      </span>
                    </div>

                    <p className="text-[10px] text-blue-400 font-bold tracking-wide uppercase font-mono">{doc.specialty}</p>
                    
                    <div className="flex gap-3 text-[10px] text-slate-400 font-medium">
                      <span>🩺 {doc.experience} Yrs Exp</span>
                      <span className="text-slate-500 font-mono">⭐ {doc.rating} ({doc.reviewsCount})</span>
                    </div>

                    {/* Book Appointment CTA Inline */}
                    <div className="pt-2.5 flex justify-between items-center border-t border-slate-800/60 mt-1.5">
                      <span className="text-[10px] text-slate-550 font-mono">Slots: {doc.slots.length} today</span>
                      <button 
                        className="text-[10px] bg-slate-950 text-blue-400 border border-slate-800 hover:border-blue-500/35 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctor(doc);
                        }}
                      >
                        Book Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      ) : (
        // SCREEN 5: DOCTOR IMMERSIVE FULL DETAIL PROFILE SCREEN
        <div className="p-0">
          
          {/* Top navigation header banner */}
          <div className="relative h-44 bg-gradient-to-b from-blue-950/70 to-slate-950/20 border-b border-slate-900">
            <button 
              onClick={backToSearch}
              className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 pl-1.5 pr-2.5 py-1.5 rounded-full text-slate-200 hover:text-white transition flex items-center gap-1 cursor-pointer z-10 text-[10px] font-bold font-mono uppercase tracking-wider"
            >
              <ChevronLeft className="w-4 h-4 text-blue-400" />
              <span>Catalog</span>
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          <div className="px-5 pb-6 -mt-16 relative z-10 space-y-4">
            
            {/* Main Info Card */}
            <div className="bg-slate-905 bg-slate-900 border border-slate-800 p-4 shadow-xl rounded-2xl flex gap-4">
              <img 
                src={selectedDoctor.imageUrl} 
                alt={selectedDoctor.name} 
                className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-950 shadow-md"
                referrerPolicy="no-referrer"
              />
              
              <div className="flex-1 min-w-0 space-y-1 my-auto text-left">
                <span className="text-[9px] bg-blue-950 border border-blue-900/30 text-blue-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                  {selectedDoctor.specialty}
                </span>
                <h3 className="text-sm font-extrabold text-white tracking-tight mt-1">{selectedDoctor.name}</h3>
                
                <div className="flex gap-2.5 text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">⭐ {selectedDoctor.rating}</span>
                  <span>({selectedDoctor.reviewsCount} Reviews)</span>
                </div>
              </div>
            </div>

            {/* Micro Stats Columns Block */}
            <div className="grid grid-cols-3 gap-2 bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-2xl">
              <div className="text-center">
                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider font-mono">Experience</span>
                <span className="text-xs font-bold text-slate-200 mt-1 block font-sans">{selectedDoctor.experience} Years</span>
              </div>
              <div className="text-center border-x border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider font-mono">Consult Fee</span>
                <span className="text-xs font-bold text-emerald-450 mt-1 block font-mono">${selectedDoctor.fee}</span>
              </div>
              <div className="text-center">
                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider font-mono">Credentials</span>
                <span className="text-xs font-bold text-blue-450 mt-1 block font-sans">Board Cert</span>
              </div>
            </div>

            {/* About Clinical Bio Section */}
            <div className="space-y-1.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-left">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Clinical Bio</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {selectedDoctor.about}
              </p>
            </div>

            {/* Education and Credentials */}
            <div className="space-y-1.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-left">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Credentials & Education</h4>
              <ul className="space-y-2">
                {selectedDoctor.qualifications.map((qual, idx) => (
                  <li key={idx} className="flex gap-2 text-xs text-slate-300">
                    <Award className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinic Facility Address */}
            <div className="space-y-1.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-left">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Facility Address</h4>
              <div className="flex gap-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-450 flex-shrink-0 mt-0.5" />
                <span>{selectedDoctor.location}</span>
              </div>
            </div>

            {/* Calendar slots choices */}
            <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex justify-between items-center">
                <h4 className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Available Slots</h4>
                <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Today</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {selectedDoctor.slots.map((sl) => (
                  <button
                    key={sl}
                    onClick={() => selectSlot(sl)}
                    className={`text-[9.5px] py-2 rounded-xl border font-bold uppercase transition-all duration-200 cursor-pointer ${selectedSlot === sl ? 'border-blue-500 bg-blue-900/40 text-blue-300 font-extrabold shadow-sm' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'}`}
                  >
                    {sl}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Consultation button CTA */}
            <button 
              id="btn_book_consultation"
              onClick={handleBookConsultation}
              disabled={!selectedSlot}
              className={`w-full py-3.5 rounded-2xl font-bold shadow-md flex items-center justify-center gap-2 transition cursor-pointer text-xs uppercase tracking-wider ${selectedSlot ? 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-slate-950' : 'bg-slate-800 text-slate-550 border border-slate-850 cursor-not-allowed'}`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{selectedSlot ? `Confirm Slot ${selectedSlot}` : 'Choose slot above to book'}</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
