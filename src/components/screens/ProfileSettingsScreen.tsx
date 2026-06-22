import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, ShieldCheck, Bell, Globe, Lock, LogOut, 
  ChevronRight, Edit2, ShieldAlert, Heart, RefreshCw 
} from 'lucide-react';

interface ProfileSettingsScreenProps {
  userProfile: {
    name: string;
    email: string;
    age: number;
    gender: string;
    bloodType: string;
    weight: string;
    height: string;
    chronicConditions: string[];
    allergies: string[];
  };
  onLogOut: () => void;
  onUpdateUser: (updatedUser: any) => void;
}

export default function ProfileSettingsScreen({ 
  userProfile, 
  onLogOut,
  onUpdateUser 
}: ProfileSettingsScreenProps) {
  const [shareLabsWithDoc, setShareLabsWithDoc] = useState(true);
  const [biometricSecState, setBiometricSecState] = useState(true);
  const [pushReminders, setPushReminders] = useState(true);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [isEditing, setIsEditing] = useState(false);

  // Form edit states
  const [editAge, setEditAge] = useState(userProfile.age);
  const [editWeight, setEditWeight] = useState(userProfile.weight);
  const [editHeight, setEditHeight] = useState(userProfile.height);

  const handleSaveProfile = () => {
    setIsEditing(false);
    onUpdateUser({
      ...userProfile,
      age: Number(editAge),
      weight: editWeight,
      height: editHeight
    });
  };

  return (
    <div id="screen_profile_settings" className="h-full w-full bg-slate-50 flex flex-col justify-between overflow-y-auto">
      
      <div className="p-5 space-y-4 text-left">
        
        {/* Profile Card Summary Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl p-4 flex gap-4 shadow-md">
          <div className="w-14 h-14 rounded-full border-2 border-white/20 bg-white text-blue-700 flex items-center justify-center font-black text-xl shadow-inner">
            AR
          </div>
          
          <div className="flex-1 my-auto">
            <h3 className="font-extrabold text-sm">{userProfile.name}</h3>
            <p className="text-[10px] text-blue-100">{userProfile.email}</p>
            <span className="text-[9px] bg-emerald-500/25 text-white font-extrabold px-2 py-0.5 rounded-full mt-1.5 inline-block">
              ✓ Verified Patient profile
            </span>
          </div>
        </div>

        {/* Dynamic Vitals edit grid */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3.5">
          <div className="flex justify-between items-center pb-2 border-b">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Vitals Metadata</h4>
            <button 
              onClick={() => {
                if (isEditing) handleSaveProfile();
                else setIsEditing(true);
              }}
              className="text-xs text-blue-600 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isEditing ? 'Save details' : (
                <>
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Update</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Age</span>
              {isEditing ? (
                <input 
                  type="number" 
                  value={editAge}
                  onChange={(e) => setEditAge(Number(e.target.value))}
                  className="w-full text-center font-bold text-slate-800 text-xs border rounded p-1"
                />
              ) : (
                <span className="text-xs font-bold text-slate-800 mt-1 block">{userProfile.age} yrs</span>
              )}
            </div>
            
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Weight</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                  className="w-full text-center font-bold text-slate-800 text-xs border rounded p-1"
                />
              ) : (
                <span className="text-xs font-bold text-slate-800 mt-1 block">{userProfile.weight}</span>
              )}
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Height</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editHeight}
                  onChange={(e) => setEditHeight(e.target.value)}
                  className="w-full text-center font-bold text-slate-800 text-xs border rounded p-1"
                />
              ) : (
                <span className="text-xs font-bold text-slate-800 mt-1 block">{userProfile.height}</span>
              )}
            </div>
          </div>

          {/* Chronic issues listed */}
          <div className="space-y-1 mt-2 text-xs">
            <p className="text-slate-400 font-medium text-[10px]">Allergies registered:</p>
            <div className="flex flex-wrap gap-1">
              {userProfile.allergies.map((all, id) => (
                <span key={id} className="text-[9px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-md border border-red-100">
                  ⚠️ {all}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SEC COMPLIANCE PRIVACY CONTROLS */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3.5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b">Security & HIPAA Controls</h4>
          
          <div className="space-y-3">
            {/* Share labs toggle */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 my-auto" />
                <div className="text-left">
                  <span className="font-bold text-slate-905 block">Auto share lab results</span>
                  <span className="text-[9.5px] text-slate-405 block">Toggles clinic doctor access</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={shareLabsWithDoc} 
                onChange={() => setShareLabsWithDoc(!shareLabsWithDoc)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Biometric toggle */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex gap-2">
                <Lock className="w-5 h-5 text-purple-600 my-auto" />
                <div className="text-left">
                  <span className="font-bold text-slate-905 block">Secure Fingerprint Lock</span>
                  <span className="text-[9.5px] text-slate-405 block">Requires biometrics to sign in</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={biometricSecState} 
                onChange={() => setBiometricSecState(!biometricSecState)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Notification settings toggle */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex gap-2">
                <Bell className="w-5 h-5 text-amber-500 my-auto" />
                <div className="text-left">
                  <span className="font-bold text-slate-905 block">Push alarm alerts</span>
                  <span className="text-[9.5px] text-slate-405 block">Dose compliance alarms</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={pushReminders} 
                onChange={() => setPushReminders(!pushReminders)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Language settings */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex gap-2">
                <Globe className="w-5 h-5 text-emerald-600 my-auto" />
                <div className="text-left">
                  <span className="font-bold text-slate-905 block">System Language</span>
                  <span className="text-[9.5px] text-slate-405 block">Translates screen tags</span>
                </div>
              </div>
              
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                className="bg-slate-50 border border-slate-250 text-slate-705 p-1 px-1.5 rounded-lg text-[10px] outline-none"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
              </select>
            </div>
          </div>
        </div>

        {/* LOGOUT SECURE ACTION */}
        <button
          onClick={onLogOut}
          className="w-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition border border-dashed flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Secure Handshake (Logout)</span>
        </button>

      </div>
    </div>
  );
}
