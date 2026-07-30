import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import api from '../api/client';
import * as Icons from './Icons';

export default function SettingsModal({ isOpen, onClose, initialTab }) {
  const currentUser = useAuthStore(state => state.user);
  const login = useAuthStore(state => state.login);
  const { theme, setTheme, addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState('profile');

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  
  // Profile Form States
  const [name, setName] = useState(currentUser?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility Toggle
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast("Name cannot be empty.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.put("/auth/me", { name: name.trim() });
      login(localStorage.getItem("access_token"), localStorage.getItem("refresh_token"), res.data);
      addToast("Profile details updated successfully!", "success");
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to update profile.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast("Both current and new passwords are required.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("Passwords do not match.", "warning");
      return;
    }
    if (newPassword.length < 8) {
      addToast("New password must be at least 8 characters.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.put("/auth/me", { 
        current_password: currentPassword, 
        new_password: newPassword 
      });
      login(localStorage.getItem("access_token"), localStorage.getItem("refresh_token"), res.data);
      addToast("Password changed successfully!", "success");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to update password.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      {/* Modal Shell — always light */}
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:h-[500px]">
        
        {/* Left Tab Navigation */}
        <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50 p-5 flex flex-row md:flex-col gap-1.5 select-none">
          <div className="hidden md:block mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Settings</h3>
          </div>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 md:flex-initial flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === 'profile' 
                ? 'bg-[#D97745]/10 text-[#D97745]' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <span className="text-base">👤</span>
            <span>Profile & Security</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`flex-1 md:flex-initial flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
              activeTab === 'appearance' 
                ? 'bg-[#D97745]/10 text-[#D97745]' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <span className="text-base">🎨</span>
            <span>Appearance</span>
          </button>
        </div>

        {/* Right Content Panels */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-hide bg-white">
          
          {/* Header Row */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-black uppercase text-slate-800 tracking-wider">
              {activeTab === 'profile' ? 'Profile Details' : 'Appearance Settings'}
            </h4>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Details Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Form 1: Edit profile details */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[12px] font-bold text-slate-400 tracking-wider uppercase ml-0.5">Full Name</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#D97745] focus:ring-[#D97745]/20"
                    placeholder="Enter your name"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[12px] font-bold text-slate-400 tracking-wider uppercase ml-0.5">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email"
                      value={currentUser?.email || ''}
                      className="input-field bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed select-none"
                      disabled
                    />
                    {currentUser?.auth_provider === 'google' && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider select-none border border-slate-200">
                        Google SSO
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting || name.trim() === currentUser?.name}
                    className="btn-primary py-2 px-5 text-xs rounded-xl disabled:opacity-40"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>

              {/* Form 2: Change Password */}
              {currentUser?.auth_provider === 'password' ? (
                <div className="border-t border-slate-100 pt-6">
                  <h5 className="text-xs font-black text-slate-700 uppercase tracking-wide mb-4">Change Password</h5>
                  
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[12px] font-bold text-slate-400 tracking-wider uppercase ml-0.5">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showCurrent ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="input-field bg-white border-slate-200 text-slate-800 pr-10"
                          placeholder="••••••••"
                          disabled={isSubmitting}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        >
                          {showCurrent ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[12px] font-bold text-slate-400 tracking-wider uppercase ml-0.5">New Password</label>
                      <div className="relative">
                        <input 
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="input-field bg-white border-slate-200 text-slate-800 pr-10"
                          placeholder="••••••••"
                          disabled={isSubmitting}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        >
                          {showNew ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[12px] font-bold text-slate-400 tracking-wider uppercase ml-0.5">Confirm New Password</label>
                      <div className="relative">
                        <input 
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input-field bg-white border-slate-200 text-slate-800 pr-10"
                          placeholder="••••••••"
                          disabled={isSubmitting}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        >
                          {showConfirm ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit" 
                        disabled={isSubmitting || !currentPassword || !newPassword}
                        className="btn-primary py-2 px-5 text-xs rounded-xl disabled:opacity-40"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="border-t border-slate-100 pt-6">
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <p className="text-xs text-slate-500 font-semibold">
                      Your account is managed via <strong>Google SSO Login</strong>. Local password change is disabled.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-3.5">
                <label className="block text-[12px] font-bold text-slate-400 tracking-wider uppercase ml-0.5">App Theme</label>
                
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'system'].map((t) => {
                    const isActive = theme === t;
                    let label = "System Theme";
                    let icon = "🌓";
                    if (t === "light") {
                      label = "Light Mode";
                      icon = "☀️";
                    } else if (t === "dark") {
                      label = "Dark Mode";
                      icon = "🌙";
                    }

                    return (
                      <button
                        key={t}
                        onClick={() => {
                          setTheme(t);
                          addToast(`Switched to ${label}!`, "success");
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center gap-2 transition-all cursor-pointer select-none ${
                          isActive 
                            ? 'bg-[#D97745]/5 border-[#D97745] text-[#D97745] font-bold' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-lg">{icon}</span>
                        <span className="text-[13px] font-semibold tracking-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
