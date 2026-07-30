import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';

// ─── SPRING PRESETS ──────────────────────────────────────────────────────────
const SPRING = { type: 'spring', stiffness: 100, damping: 20 };
const SPRING_SLOW = { type: 'spring', stiffness: 40, damping: 20 };

// ─── HANDCRAFTED SVGs ────────────────────────────────────────────────────────
const IconOwl = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3 L19 9 L19 20 L5 20 L5 9 Z" fill="#F8F5EF" stroke="#171717" strokeWidth="1.8" />
    <path d="M5 14 L12 20 L19 14" stroke="#171717" strokeWidth="1.8" />
    <path d="M5 9 L3 13 L5 17" stroke="#171717" strokeWidth="1.8" />
    <path d="M19 9 L21 13 L19 17" stroke="#171717" strokeWidth="1.8" />
    <circle cx="9" cy="10" r="2.2" fill="#F8F5EF" stroke="#171717" strokeWidth="1.8" />
    <circle cx="15" cy="10" r="2.2" fill="#F8F5EF" stroke="#171717" strokeWidth="1.8" />
    <circle cx="9" cy="10" r="0.85" fill="#171717" />
    <circle cx="15" cy="10" r="0.85" fill="#171717" />
    <line x1="11.2" y1="10" x2="12.8" y2="10" stroke="#171717" strokeWidth="1.2" />
    <polygon points="12,12 10.8,14.2 13.2,14.2" fill="#E8B44C" stroke="#171717" strokeWidth="1.5" />
  </svg>
);

const IconCrane = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 11 L21 4 L16 13 Z" fill="#F8F5EF" stroke="#171717" strokeWidth="1.8" />
    <path d="M12 11 L3 4 L8 13 Z" fill="#F0EEDE" stroke="#171717" strokeWidth="1.8" />
    <path d="M12 11 L12 21 L10 15 Z" fill="#7FB3D5" stroke="#171717" strokeWidth="1.8" />
    <path d="M12 11 L15.5 7.5 L12 6 Z" fill="#D97745" stroke="#171717" strokeWidth="1.8" />
    <circle cx="13.5" cy="8.2" r="0.55" fill="#171717" />
  </svg>
);

const IconSprout = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="7" y="16" width="10" height="5" rx="1" fill="#F8F5EF" stroke="#171717" strokeWidth="1.8" />
    <line x1="12" y1="16" x2="12" y2="9" stroke="#171717" strokeWidth="1.8" />
    <path d="M12 13 Q15 11 16 7 Q12.5 6.5 12 10" fill="#5D8A63" stroke="#171717" strokeWidth="1.8" />
    <path d="M12 12 Q9 10 8 12 Q9.5 14.5 12 12" fill="#5D8A63" stroke="#171717" strokeWidth="1.8" />
    <circle cx="10.2" cy="18.5" r="0.65" fill="#171717" />
    <circle cx="13.8" cy="18.5" r="0.65" fill="#171717" />
    <path d="M11 20 Q12 21 13 20" stroke="#171717" strokeWidth="1.3" />
  </svg>
);

const DoodleStar = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#D97745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l2.5 6.5L21 10.5l-5 4.5 1.5 7-6-3.5-6 3.5 1.5-7-5-4.5 6.5-1L12 3z" />
  </svg>
);

const DoodleArrow = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 40 20" fill="none" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 10 Q 15 2 25 10 T 38 10" />
    <path d="M30 4 L 38 10 L 30 16" />
  </svg>
);

const PaperClip = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

// ─── BACKGROUND TEXTURES ─────────────────────────────────────────────────────
const PaperBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Base subtle graph grid */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23171717'/%3E%3C/svg%3E")`,
        backgroundSize: '24px 24px'
      }}
    />
    {/* Soft paper fiber noise */}
    <div 
      className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }}
    />
    {/* Very soft warm radial glows */}
    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#D97745]/[0.02] to-transparent" />
    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#5D8A63]/[0.02] to-transparent" />
  </div>
);

// ─── LEFT PANEL SCENE ────────────────────────────────────────────────────────
function PaperWorldScene() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Abstract pencil path connecting elements */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <motion.path
          d="M 10% 20% C 30% 10%, 40% 50%, 60% 40% S 80% 80%, 90% 70%"
          fill="none"
          stroke="#171717"
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeOpacity="0.15"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
      </svg>

      {/* Floating Folders & Papers */}
      <motion.div 
        className="absolute top-[10%] left-[15%] w-16 h-20 bg-white border border-[#E8E5DF] rounded shadow-sm relative"
        animate={{ y: [-4, 4], rotate: [-2, 2] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      >
        <div className="absolute top-0 right-0 w-3 h-3 bg-[#F8F5EF] border-l border-b border-[#E8E5DF]" style={{ clipPath: 'polygon(100% 0, 0 0, 0 100%)' }} />
        <div className="p-3 space-y-2 mt-2">
          <div className="h-1 w-full bg-[#E8E5DF] rounded-full" />
          <div className="h-1 w-2/3 bg-[#E8E5DF] rounded-full" />
        </div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <PaperClip className="w-5 h-5 text-[#A0A09A]" />
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-[20%] left-[20%] w-[120px] h-[80px] bg-[#FEFCF9] border border-[#E8E5DF] rounded-md shadow-sm"
        animate={{ y: [4, -4], rotate: [1, -1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      >
        <div className="w-1/3 h-2 bg-[#E8E5DF] rounded-tl-md rounded-tr-md border-b border-[#E8E5DF] relative -top-2 left-0" />
        <div className="px-3 pt-2">
          <p className="text-[9px] font-bold text-[#171717] opacity-40">Projects</p>
        </div>
      </motion.div>

      {/* Characters */}
      <motion.div 
        className="absolute top-[30%] right-[25%] flex flex-col items-center gap-2"
        animate={{ y: [-3, 3] }}
        transition={{ duration: 4.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      >
        <div className="w-14 h-14 bg-white border border-[#E8E5DF] rounded-full flex items-center justify-center shadow-sm relative">
           <IconOwl className="w-7 h-7" />
           <motion.div className="absolute inset-0 bg-white opacity-0 rounded-full" animate={{ opacity: [0, 0, 1, 0, 0] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.45, 0.48, 0.5, 1] }} />
        </div>
        <div className="px-2 py-1 bg-[#F8F5EF] border border-[#E8E5DF] rounded shadow-[1px_1px_0px_rgba(0,0,0,0.05)] transform -rotate-2">
          <span className="text-[9px] font-mono font-bold text-[#171717] tracking-widest uppercase">AI Ready</span>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-[40%] right-[15%] flex flex-col items-center gap-2"
        animate={{ y: [-5, 5], x: [-2, 2] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      >
        <div className="w-12 h-12 bg-white border border-[#E8E5DF] rounded-full flex items-center justify-center shadow-sm">
           <IconCrane className="w-6 h-6" />
        </div>
      </motion.div>

      <motion.div 
        className="absolute top-[50%] left-[45%] flex flex-col items-center gap-2"
        animate={{ scale: [1, 1.05, 1], y: [-2, 2] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      >
        <div className="w-16 h-16 bg-white border border-[#E8E5DF] rounded-full flex items-center justify-center shadow-sm">
           <IconSprout className="w-8 h-8" />
        </div>
      </motion.div>

      {/* Doodles */}
      <motion.div className="absolute top-[15%] right-[40%]" animate={{ rotate: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <DoodleStar className="w-5 h-5 text-[#D97745]" />
      </motion.div>
      <motion.div className="absolute bottom-[25%] right-[45%]">
        <DoodleArrow className="w-8 h-8 text-[#171717] opacity-30" />
      </motion.div>
    </div>
  );
}

// ─── MAIN AUTH COMPONENT ─────────────────────────────────────────────────────
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const setAuth = useAuthStore(state => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Google Identity Services
    /* global google */
    if (typeof google !== 'undefined') {
      try {
        google.accounts.id.initialize({
          client_id: 'dummy-google-client-id-for-notely-development.apps.googleusercontent.com',
          callback: handleGoogleResponse,
        });
        google.accounts.id.renderButton(document.getElementById('googleSignInDiv'), {
          theme: 'outline',
          size: 'large',
          width: '320',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'center'
        });
      } catch (err) {
        console.error('Google Identity initialization error:', err);
      }
    }
  }, []);

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/register', { email, password, name });
      setAuth(res.data.access_token, res.data.refresh_token, res.data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/google', { credential: response.credential });
      setAuth(res.data.access_token, res.data.refresh_token, res.data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Authentication failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col md:flex-row bg-[#F8F5EF] font-sans antialiased text-[#171717] selection:bg-[#D97745]/10 selection:text-[#D97745] relative">
      <PaperBackground />

      {/* ── LEFT PANEL (55%) — Editorial Landing ────────────────────────────── */}
      <div className="hidden md:flex md:w-[55%] relative flex-col pt-12 px-12 lg:px-20 pb-8 z-10 h-full">
        
        {/* Header content */}
        <div className="flex flex-col justify-center max-w-[500px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-[12px] font-black uppercase tracking-[0.2em] text-[#D97745] mb-4"
          >
            Knowledge begins here
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SLOW, delay: 0.28 }}
            className="text-[clamp(2.4rem,4vw,3.6rem)] font-black tracking-[-0.03em] leading-[1.05] mb-5"
          >
            Every great workspace <br className="hidden lg:block" />
            <span className="text-[#5D8A63]">starts with one note.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[15px] text-[#7A7870] leading-[1.65] font-[450] max-w-[400px]"
          >
            Turn scattered ideas into structured knowledge. Build your second brain with beautiful documentation.
          </motion.p>
        </div>

        {/* Paper World Illustration Area */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex-1 min-h-0 mt-4 relative"
        >
          <PaperWorldScene />
        </motion.div>

        {/* Bottom Trust Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-6 flex-wrap pt-4 border-t border-[#171717]/5 mt-auto"
        >
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#A0A09A]">Trusted by</span>
          {['OpenAI', 'Cursor', 'Vercel', 'GitHub', 'Figma'].map(name => (
            <span key={name} className="text-[12px] font-black uppercase tracking-[0.08em] text-[#A0A09A]/70">{name}</span>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT PANEL (45%) — Auth Card ───────────────────────────────────── */}
      <div className="w-full md:w-[45%] h-full relative flex items-center justify-center p-6 z-20 overflow-y-auto">
        
        {/* Soft radial glow behind card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/40 rounded-full blur-[60px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...SPRING, delay: 0.15 }}
          className="w-full max-w-[380px] bg-white rounded-3xl p-8 relative z-30 flex flex-col items-center text-center my-auto"
          style={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.03), 0 24px 64px rgba(0,0,0,0.06)', 
            border: '1px solid rgba(232,229,223,0.8)' 
          }}
        >
          {/* Logo & Dot */}
          <div className="flex items-center gap-2 mb-6 select-none">
            <span className="text-[18px] font-black tracking-tight text-[#171717]">Notely</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97745]" />
          </div>

          <h2 className="text-[1.6rem] font-black tracking-[-0.03em] leading-tight text-[#171717] mb-2">
            Create your workspace.
          </h2>
          <p className="text-[14px] text-[#7A7870] font-medium mb-6">
            Join thousands of teams building their second brain.
          </p>

          {/* Error Message */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="w-full mb-4 text-[13px] font-bold text-red-500 bg-red-50 py-2.5 px-4 rounded-xl text-left flex items-center gap-2"
              >
                <span>⚠</span> {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* The Google Button Area */}
          <div className="w-full flex justify-center min-h-[44px] mb-6 relative">
            <div id="googleSignInDiv" className="w-full flex justify-center [&>div]:w-full" />
            
            {/* Fallback button if GIS fails to load */}
            {typeof window !== 'undefined' && typeof google === 'undefined' && (
              <button 
                type="button"
                disabled={isGoogleLoading}
                className="w-full h-11 bg-white border border-[#E8E5DF] text-[#171717] rounded-md text-[14px] font-semibold flex items-center justify-center gap-3 hover:bg-[#F8F5EF] transition-colors shadow-sm disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <div className="w-4 h-4 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6 w-full opacity-60">
            <div className="flex-1 h-px bg-[#171717]/10" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#171717]/40">Or email</span>
            <div className="flex-1 h-px bg-[#171717]/10" />
          </div>

          <form onSubmit={handleEmailRegister} className="space-y-4 text-left w-full mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-black text-[#A0A09A] uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e=>setName(e.target.value)} 
                  required 
                  placeholder="Sarah Chen"
                  className="w-full px-4 py-2.5 bg-[#F8F5EF] border border-[#E8E5DF] rounded-xl text-[14px] text-[#171717] placeholder:text-[#A0A09A] focus:outline-none focus:ring-2 focus:ring-[#D97745]/30 focus:border-[#D97745] transition-all" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-[#A0A09A] uppercase tracking-wider mb-1.5 ml-1">Workspace</label>
                <input 
                  type="text" 
                  value={workspaceName} 
                  onChange={e=>setWorkspaceName(e.target.value)} 
                  required 
                  placeholder="Acme Corp"
                  className="w-full px-4 py-2.5 bg-[#F8F5EF] border border-[#E8E5DF] rounded-xl text-[14px] text-[#171717] placeholder:text-[#A0A09A] focus:outline-none focus:ring-2 focus:ring-[#D97745]/30 focus:border-[#D97745] transition-all" 
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black text-[#A0A09A] uppercase tracking-wider mb-1.5 ml-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                required 
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-[#F8F5EF] border border-[#E8E5DF] rounded-xl text-[14px] text-[#171717] placeholder:text-[#A0A09A] focus:outline-none focus:ring-2 focus:ring-[#D97745]/30 focus:border-[#D97745] transition-all" 
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-black text-[#A0A09A] uppercase tracking-wider mb-1.5 ml-1">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#F8F5EF] border border-[#E8E5DF] rounded-xl text-[14px] text-[#171717] placeholder:text-[#A0A09A] focus:outline-none focus:ring-2 focus:ring-[#D97745]/30 focus:border-[#D97745] transition-all" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-[#A0A09A] uppercase tracking-wider mb-1.5 ml-1">Confirm</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e=>setConfirmPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#F8F5EF] border border-[#E8E5DF] rounded-xl text-[14px] text-[#171717] placeholder:text-[#A0A09A] focus:outline-none focus:ring-2 focus:ring-[#D97745]/30 focus:border-[#D97745] transition-all" 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-[#171717] hover:bg-[#333] text-white py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-sm disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="w-full h-px bg-[#171717]/5 mb-5" />

          <p className="text-[13px] text-[#7A7870] font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#D97745] font-bold hover:underline underline-offset-2">
              Log in →
            </Link>
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12px] text-[#A0A09A] font-medium hover:text-[#171717] transition-colors mt-2"
          >
            ← Back to homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
