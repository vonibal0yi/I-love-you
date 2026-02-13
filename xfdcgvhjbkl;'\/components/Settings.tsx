
import React, { useState, useRef } from 'react';
import { Moon, Sun, Bell, Shield, User, Globe, ChevronRight, Edit2, Mail, Check, Camera, Trash2 } from 'lucide-react';

interface SettingsProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  username: string;
  email: string;
  profilePic: string | null;
  onUpdateProfile: (username: string, email: string, profilePic: string | null) => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, onToggleTheme, username, email, profilePic, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempProfilePic, setTempProfilePic] = useState(profilePic);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateProfile(tempUsername, tempEmail, tempProfilePic);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePic = () => {
    setTempProfilePic(null);
  };

  const SettingItem = ({ icon: Icon, label, value, onClick, isToggle = false }: any) => (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${onClick ? '' : 'pointer-events-none'}`}
    >
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-white">{label}</p>
          {value && <p className="text-xs text-slate-500 dark:text-slate-400">{value}</p>}
        </div>
      </div>
      {isToggle ? (
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleTheme(); }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      ) : (
        <ChevronRight className="w-5 h-5 text-slate-300" />
      )}
    </div>
  );

  const currentAvatar = (isEditing ? tempProfilePic : profilePic) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`p-3 rounded-2xl transition-all shadow-lg flex items-center space-x-2 ${isEditing ? 'bg-emerald-600 text-white' : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100'}`}
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            <span className="text-sm font-semibold">{isEditing ? 'Save' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl shadow-xl border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
               <img 
                 src={currentAvatar} 
                 alt="Profile" 
                 className="w-full h-full object-cover" 
               />
               
               {isEditing && (
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                 >
                   <Camera className="w-8 h-8 text-white" />
                 </div>
               )}
            </div>
            
            {isEditing && tempProfilePic && (
              <button 
                onClick={handleRemovePic}
                className="absolute -bottom-2 -right-2 p-2 bg-rose-500 text-white rounded-xl shadow-lg border-2 border-white dark:border-slate-800 hover:bg-rose-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          
          <div className="flex-grow space-y-4 pt-2">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{username}</h2>
                <div className="flex items-center justify-center sm:justify-start mt-1 text-slate-500 dark:text-slate-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{email}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-100 dark:border-emerald-800">Verified Member</span>
                  <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full border border-primary-100 dark:border-primary-800">Elite Tier</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-4">Appearance</h3>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <SettingItem 
              icon={theme === 'dark' ? Moon : Sun} 
              label="Dark Mode" 
              value={theme === 'dark' ? "Deep night aesthetic" : "Clear bright vision"} 
              isToggle 
              onClick={onToggleTheme}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-4">Preferences</h3>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <SettingItem icon={Bell} label="Notifications" value="Push, Email, and SMS" />
            <div className="border-t border-slate-100 dark:border-slate-700" />
            <SettingItem icon={Globe} label="Language & Region" value="English (US)" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 ml-4">Security</h3>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <SettingItem icon={Shield} label="Privacy & Security" value="2FA, Biometrics enabled" />
          </div>
        </div>
      </div>

      <div className="pt-8 pb-12 text-center">
        <button className="text-rose-500 font-semibold hover:text-rose-600 transition-colors">Log Out from Device</button>
        <p className="text-slate-400 text-xs mt-4">Focus Finance v1.2.0 • Build 2024.05</p>
      </div>
    </div>
  );
};

export default Settings;
