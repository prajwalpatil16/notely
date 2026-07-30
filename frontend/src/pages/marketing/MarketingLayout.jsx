import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logoLockup from '../../assets/notely-logo-lockup.svg';
import logoIcon from '../../assets/notely-logo-icon.svg';

// ─── NOTELY CHARACTER ILLUSTRATIONS ─────────────────────────────────────────
// Premium outlined style matching the brand identity — 1.8px stroke, warm fills

const IllustrationSprout = ({ className = 'w-10 h-10' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="16" width="10" height="5" rx="1" fill="#FDFCF8" stroke="#171717" strokeWidth="1.8" />
    <line x1="12" y1="16" x2="12" y2="9" stroke="#171717" strokeWidth="1.8" />
    <path d="M12 13 Q15 11 16 7 Q12.5 6.5 12 10" fill="#4D7C5A" stroke="#171717" strokeWidth="1.8" />
    <path d="M12 12 Q9 10 8 12 Q9.5 14.5 12 12" fill="#4D7C5A" stroke="#171717" strokeWidth="1.8" />
    <circle cx="10.2" cy="18.5" r="0.6" fill="#171717" />
    <circle cx="13.8" cy="18.5" r="0.6" fill="#171717" />
  </svg>
);

const IllustrationOwl = ({ className = 'w-10 h-10' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 L19 9 L19 20 L5 20 L5 9 Z" fill="#FDFCF8" stroke="#171717" strokeWidth="1.8" />
    <path d="M5 14 L12 20 L19 14" stroke="#171717" strokeWidth="1.8" />
    <circle cx="9" cy="10" r="2.2" fill="#FDFCF8" stroke="#171717" strokeWidth="1.8" />
    <circle cx="15" cy="10" r="2.2" fill="#FDFCF8" stroke="#171717" strokeWidth="1.8" />
    <circle cx="9" cy="10" r="0.8" fill="#171717" />
    <circle cx="15" cy="10" r="0.8" fill="#171717" />
    <polygon points="12,12 10.8,14.2 13.2,14.2" fill="#E8B44C" stroke="#171717" strokeWidth="1.5" />
  </svg>
);

const IllustrationCrane = ({ className = 'w-10 h-10' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 11 L21 4 L16 13 Z" fill="#FDFCF8" stroke="#171717" strokeWidth="1.8" />
    <path d="M12 11 L3 4 L8 13 Z" fill="#F0EEDE" stroke="#171717" strokeWidth="1.8" />
    <path d="M12 11 L12 21 L10 15 Z" fill="#7FB3D5" stroke="#171717" strokeWidth="1.8" />
    <path d="M12 11 L15.5 7.5 L12 6 Z" fill="#D97745" stroke="#171717" strokeWidth="1.8" />
    <circle cx="13.5" cy="8.2" r="0.5" fill="#171717" />
  </svg>
);

const IllustrationExplorer = ({ className = 'w-10 h-10' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8.5 Q12 3.5 18 8.5" fill="#D97745" stroke="#171717" strokeWidth="1.8" />
    <line x1="4" y1="8.5" x2="20" y2="8.5" stroke="#171717" strokeWidth="1.8" />
    <circle cx="12" cy="14.5" r="4.5" fill="#FDFCF8" stroke="#171717" strokeWidth="1.8" />
    <circle cx="10.4" cy="13.5" r="0.65" fill="#171717" />
    <circle cx="13.6" cy="13.5" r="0.65" fill="#171717" />
    <path d="M10.7 16 Q12 17 13.3 16" stroke="#171717" strokeWidth="1.3" />
    <rect x="18" y="12" width="3" height="5" rx="0.5" fill="#E8B44C" stroke="#171717" strokeWidth="1.5" />
  </svg>
);

const IllustrationCourier = ({ className = 'w-10 h-10' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9.5" cy="10" r="2.5" fill="#FDFCF8" stroke="#171717" strokeWidth="1.8" />
    <circle cx="9" cy="9.5" r="0.5" fill="#171717" />
    <path d="M7.5 10 L5 9 L7 11 Z" fill="#D97745" stroke="#171717" strokeWidth="1.2" />
    <ellipse cx="13" cy="13" rx="4" ry="2.8" fill="#FDFCF8" stroke="#171717" strokeWidth="1.8" />
    <path d="M9 12 Q6 8.5 3.5 10.5 Q6 11.5 9 14 Z" fill="#F0EEDE" stroke="#171717" strokeWidth="1.8" />
    <rect x="13" y="10" width="7" height="5" rx="0.5" fill="#FAF8F3" stroke="#171717" strokeWidth="1.5" />
    <path d="M13 10 L16.5 12.5 L20 10" stroke="#171717" strokeWidth="1.2" />
  </svg>
);

const IllustrationFox = ({ className = 'w-10 h-10' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="7,9 9,4 11.5,8.5" fill="#D97745" stroke="#171717" strokeWidth="1.8" />
    <polygon points="12.5,8.5 15,4 17,9" fill="#D97745" stroke="#171717" strokeWidth="1.8" />
    <circle cx="12" cy="13.5" r="5" fill="#FDFCF8" stroke="#171717" strokeWidth="1.8" />
    <circle cx="10" cy="12.5" r="1.4" fill="none" stroke="#171717" strokeWidth="1.2" />
    <circle cx="14" cy="12.5" r="1.4" fill="none" stroke="#171717" strokeWidth="1.2" />
    <ellipse cx="12" cy="15" rx="1" ry="0.6" fill="#D97745" />
  </svg>
);

// ─── SPRING CONSTANTS ──────────────────────────────────────────────────────
const SPRING_CARD = { type: 'spring', stiffness: 300, damping: 24 };

// ─── ANIMATED MEGA MENU WRAPPER ─────────────────────────────────────────────
function MegaMenuPanel({ children, onMouseEnter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-0 right-0 top-full z-50"
      onMouseEnter={onMouseEnter}
    >
      {/* Soft top shadow line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E8E5DF] to-transparent" />
      <div
        className="bg-[#FEFCF9] border-b border-[#E8E5DF]"
        style={{
          boxShadow: '0 16px 48px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E")`,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// ─── FEATURED CARD (hero card in each mega menu) ────────────────────────────
function FeaturedCard({ illustration: Illustration, title, description, cta, to, onClick, bg = '#EDF3EE', accent = '#4D7C5A' }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
      transition={SPRING_CARD}
      className="rounded-2xl border border-[#E8E5DF] overflow-hidden cursor-pointer h-full"
      style={{ backgroundColor: bg }}
    >
      <Link to={to} onClick={onClick} className="block p-6 h-full flex flex-col">
        <div className="w-14 h-14 rounded-xl bg-white/80 border border-[#E8E5DF] flex items-center justify-center mb-4 shadow-sm">
          <Illustration className="w-8 h-8" />
        </div>
        <h4 className="text-[16px] font-black text-[#171717] tracking-tight mb-1.5">{title}</h4>
        <p className="text-[14px] text-[#7A7870] leading-relaxed flex-1">{description}</p>
        <span className="text-[13px] font-bold mt-4 inline-flex items-center gap-1" style={{ color: accent }}>
          {cta} <span className="text-[15px]">→</span>
        </span>
      </Link>
    </motion.div>
  );
}

// ─── MENU LINK ITEM ──────────────────────────────────────────────────────────
function MenuLink({ to, icon: Icon, title, description, onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 + delay * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        whileHover={{ y: -1, backgroundColor: 'rgba(232,229,223,0.25)' }}
        transition={SPRING_CARD}
      >
        <Link
          to={to}
          onClick={onClick}
          className="flex items-start gap-3.5 p-3 rounded-xl transition-colors group"
        >
          <span className="p-1.5 bg-[#FDF4F0] border border-[#E8E5DF] rounded-lg flex-shrink-0 group-hover:shadow-sm transition-shadow">
            <Icon />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[#171717] tracking-tight group-hover:text-[#D97745] transition-colors">{title}</p>
            <p className="text-[13px] text-[#9A9890] mt-0.5 leading-relaxed">{description}</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── MENU FOOTER CTA ─────────────────────────────────────────────────────────
function MenuFooter({ text, to, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="border-t border-[#E8E5DF]/60 mt-1 pt-4 pb-1 px-1"
    >
      <Link
        to={to}
        onClick={onClick}
        className="text-[13px] font-bold text-[#D97745] hover:text-[#C25C2B] transition-colors inline-flex items-center gap-1.5 group"
      >
        {text}
        <motion.span
          className="inline-block"
          whileHover={{ x: 3 }}
          transition={SPRING_CARD}
        >
          →
        </motion.span>
      </Link>
    </motion.div>
  );
}

// ─── SECTION LABEL ───────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <motion.h4
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 }}
      className="text-[11px] font-black text-[#C0BEB8] uppercase tracking-[0.2em] mb-3 font-mono px-1"
    >
      {children}
    </motion.h4>
  );
}

// ─── ICON COMPONENTS (matching brand) ─────────────────────────────────────────
const sw = 2;
const ic = "w-[18px] h-[18px] text-[#D97745]";

const IcoDocument = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);
const IcoFolder = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const IcoSearch = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IcoUsers = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
  </svg>
);
const IcoGitBranch = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);
const IcoSmartphone = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const IcoTerminal = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);
const IcoPalette = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C4.85857 19 4.5 20 5.5 21C6.5 22 8 21 8 21C9.1962 21.6397 10.5562 22 12 22Z" />
  </svg>
);
const IcoBook = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const IcoHelp = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IcoBriefcase = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IcoShield = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcoPhone = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IcoSparkle = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const IcoTag = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const IcoLock = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IcoLink = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IcoWifi = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
    <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

const IcoCode = () => (
  <svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

// ─── NAV CHEVRON ──────────────────────────────────────────────────────────────
function NavChevron({ isOpen }) {
  return (
    <motion.svg
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      className="w-3 h-3 text-[#C0BEB8]"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN LAYOUT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function MarketingLayout() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeTimerRef = useRef(null);

  const handleMenuHover = useCallback((menu) => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
    setActiveMenu(menu);
  }, []);

  const handleMenuLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setActiveMenu(null), 150);
  }, []);

  const closeMenus = useCallback(() => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
    setActiveMenu(null);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); };
  }, []);

  // Keyboard: close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeMenus(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeMenus]);

  const navItems = ['product', 'solutions', 'resources', 'company'];

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#171717] font-sans antialiased selection:bg-[#D97745]/10 selection:text-[#D97745] flex flex-col justify-between relative">

      {/* ═══ PREMIUM NAVIGATION ═══════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 bg-[#FAF8F3]/95 backdrop-blur-xl select-none"
        onMouseLeave={handleMenuLeave}
      >
        {/* Top bar */}
        <div className="border-b border-[#E8E8E4]/70">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-10">
              {/* Logo */}
              <Link to="/" onClick={closeMenus} className="flex items-center">
                <img src={logoLockup} alt="Notely logo" className="h-7 w-auto object-contain" />
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
                {navItems.map((item) => (
                  <div 
                    key={item} 
                    className="relative flex items-center h-full"
                    onMouseEnter={() => handleMenuHover(item)}
                  >
                    {['solutions', 'resources', 'company'].includes(item) ? (
                      <Link
                        to={`/${item}`}
                        onClick={closeMenus}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[15px] font-semibold transition-all ${
                          activeMenu === item
                            ? 'text-[#171717] bg-[#F0EDE8]'
                            : 'text-[#7A7870] hover:text-[#171717] hover:bg-[#F5F3EE]'
                        }`}
                        aria-expanded={activeMenu === item}
                        aria-haspopup="true"
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                        <NavChevron isOpen={activeMenu === item} />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleMenuHover(item)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[15px] font-semibold transition-all ${
                          activeMenu === item
                            ? 'text-[#171717] bg-[#F0EDE8]'
                            : 'text-[#7A7870] hover:text-[#171717] hover:bg-[#F5F3EE]'
                        }`}
                        aria-expanded={activeMenu === item}
                        aria-haspopup="true"
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                        <NavChevron isOpen={activeMenu === item} />
                      </button>
                    )}
                  </div>
                ))}
                <Link
                  to="/pricing"
                  onClick={closeMenus}
                  className="text-[15px] font-semibold text-[#7A7870] hover:text-[#171717] hover:bg-[#F5F3EE] px-3.5 py-2 rounded-lg transition-all"
                  onMouseEnter={() => setActiveMenu(null)}
                >
                  Pricing
                </Link>
              </nav>
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login" onClick={closeMenus} className="text-[15px] font-bold text-[#7A7870] hover:text-[#171717] px-3.5 py-2 rounded-lg transition-colors">Log in</Link>
              <Link to="/register" onClick={closeMenus} className="bg-[#D97745] hover:bg-[#C25C2B] text-white px-4 py-2 rounded-lg text-[15px] font-bold transition-all shadow-sm shadow-[#D97745]/15 hover:shadow-md hover:shadow-[#D97745]/20 active:scale-[0.98]">
                Get Started
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-[#F0EDE8] rounded-lg text-[#5B5B5B] cursor-pointer transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* ═══ MEGA MENU PANELS ═══════════════════════════════════════════ */}
        <AnimatePresence mode="wait">

          {/* ─── PRODUCT MEGA MENU ───────────────────────────────────────── */}
          {activeMenu === 'product' && (
            <MegaMenuPanel key="product" onMouseEnter={() => handleMenuHover('product')}>
              <div className="max-w-[1200px] mx-auto px-8 py-8">
                <div className="grid grid-cols-[260px_1fr] gap-10">

                  {/* Featured Card */}
                  <FeaturedCard
                    illustration={IllustrationSprout}
                    title="Everything your team knows. One place."
                    description="Notely combines documentation, collaboration, AI search, templates, workflows, and structured knowledge into one beautifully organized workspace—built for teams that move fast."
                    cta="Explore the platform →"
                    to="/product"
                    onClick={closeMenus}
                    bg="#EDF3EE"
                    accent="#4D7C5A"
                  />

                  {/* Links Grid — 3 columns × 4 rows */}
                  <div>
                    <div className="grid grid-cols-3 gap-x-3">

                      {/* Col 1: WRITE */}
                      <div>
                        <SectionLabel>Write</SectionLabel>
                        <div className="space-y-0.5">
                          <MenuLink to="/product/notes" icon={IcoDocument} title="Rich Notes" description="Markdown, slash commands, code blocks, tables, callouts, and AI writing—without breaking your flow." onClick={closeMenus} delay={0} />
                          <MenuLink to="/product/templates" icon={IcoPalette} title="Templates" description="Launch faster with templates for specs, onboarding, campaigns, roadmaps, SOPs, and more." onClick={closeMenus} delay={1} />
                          <MenuLink to="/product/ai" icon={IcoSparkle} title="AI Workspace" description="Generate drafts, summarize docs, rewrite content, and answer questions across your knowledge base." onClick={closeMenus} delay={2} />
                          <MenuLink to="/product/mobile-apps" icon={IcoSmartphone} title="Mobile Apps" description="Read, edit, search, and collaborate beautifully on iPhone and Android. Even offline." onClick={closeMenus} delay={3} />
                        </div>
                      </div>

                      {/* Col 2: ORGANIZE & COLLABORATE */}
                      <div>
                        <SectionLabel>Organize</SectionLabel>
                        <div className="space-y-0.5">
                          <MenuLink to="/product/workspaces" icon={IcoFolder} title="Workspaces" description="Dedicated spaces for every department, project, or client with nested folders and unlimited hierarchy." onClick={closeMenus} delay={4} />
                          <MenuLink to="/product/search" icon={IcoSearch} title="Semantic Search" description="Find any note, decision, or document instantly using AI search—not just keyword matching." onClick={closeMenus} delay={5} />
                          <MenuLink to="/product/collaboration" icon={IcoUsers} title="Live Collaboration" description="Real-time cursors, inline comments, mentions, suggestions, and task assignments across every doc." onClick={closeMenus} delay={6} />
                          <MenuLink to="/product/version-history" icon={IcoGitBranch} title="Version History" description="Track every edit, restore previous versions, and compare changes. Nothing is ever lost." onClick={closeMenus} delay={7} />
                        </div>
                      </div>

                      {/* Col 3: PLATFORM */}
                      <div>
                        <SectionLabel>Platform</SectionLabel>
                        <div className="space-y-0.5">
                          <MenuLink to="/product/workspaces" icon={IcoLock} title="Team Permissions" description="Granular roles, guest access, private docs, and workspace-level security controls." onClick={closeMenus} delay={8} />
                          <MenuLink to="/product/notes" icon={IcoTag} title="Smart Collections" description="Documents auto-organized by project, team, owner, status, or tag—no manual sorting." onClick={closeMenus} delay={9} />
                          <MenuLink to="/product/notes" icon={IcoLink} title="Integrations" description="Connect GitHub, Slack, Figma, Linear, Google Drive, Jira, Zapier, and hundreds more." onClick={closeMenus} delay={10} />
                          <MenuLink to="/product/notes" icon={IcoCode} title="Developer APIs" description="Build custom workflows with REST APIs, webhooks, and SDKs designed for engineering teams." onClick={closeMenus} delay={11} />
                        </div>
                      </div>

                    </div>
                    <MenuFooter text="Explore the Notely Platform →" to="/product" onClick={closeMenus} />
                  </div>

                </div>
              </div>
            </MegaMenuPanel>
          )}

          {/* ─── SOLUTIONS MEGA MENU ─────────────────────────────────────── */}
          {activeMenu === 'solutions' && (
            <MegaMenuPanel key="solutions" onMouseEnter={() => handleMenuHover('solutions')}>
              <div className="max-w-[1100px] mx-auto px-8 py-8">
                <div className="grid grid-cols-[280px_1fr] gap-8">

                  {/* Featured Card */}
                  <FeaturedCard
                    illustration={IllustrationOwl}
                    title="Built for every team"
                    description="From engineering sprints to marketing campaigns, Notely adapts to the way your team plans, collaborates, and shares knowledge."
                    cta="See all solutions"
                    to="/solutions"
                    onClick={closeMenus}
                    bg="#FEF9EE"
                    accent="#E8B44C"
                  />

                  {/* Links */}
                  <div>
                    <SectionLabel>By Team</SectionLabel>
                    <div className="grid grid-cols-2 gap-x-4">
                      <div className="space-y-0.5">
                        <MenuLink to="/solutions/teams" icon={IcoUsers} title="General Teams" description="Shared workspaces, meeting notes, and project planning." onClick={closeMenus} delay={0} />
                        <MenuLink to="/solutions/engineering" icon={IcoTerminal} title="Engineering" description="Documentation, APIs, architecture, and sprint planning." onClick={closeMenus} delay={1} />
                        <MenuLink to="/solutions/marketing" icon={IcoPalette} title="Marketing" description="Campaigns, content calendars, and brand management." onClick={closeMenus} delay={2} />
                      </div>
                      <div className="space-y-0.5">
                        <MenuLink to="/solutions/hr" icon={IcoBriefcase} title="HR & Operations" description="Onboarding, policies, and internal knowledge." onClick={closeMenus} delay={3} />
                        <MenuLink to="/solutions/education" icon={IcoBook} title="Education" description="Research, classrooms, lecture notes, and assignments." onClick={closeMenus} delay={4} />
                      </div>
                    </div>
                    <MenuFooter text="Explore all solutions" to="/solutions" onClick={closeMenus} />
                  </div>
                </div>
              </div>
            </MegaMenuPanel>
          )}

          {/* ─── RESOURCES MEGA MENU ─────────────────────────────────────── */}
          {activeMenu === 'resources' && (
            <MegaMenuPanel key="resources" onMouseEnter={() => handleMenuHover('resources')}>
              <div className="max-w-[900px] mx-auto px-8 py-8">
                <div className="grid grid-cols-[260px_1fr] gap-8">

                  {/* Featured Card */}
                  <FeaturedCard
                    illustration={IllustrationCrane}
                    title="Learn & Build"
                    description="Guides, documentation, and articles to help you get the most out of your Notely workspace."
                    cta="Visit Help Center"
                    to="/help"
                    onClick={closeMenus}
                    bg="#EEF4F8"
                    accent="#7FB3D5"
                  />

                  {/* Links */}
                  <div>
                    <SectionLabel>Resources</SectionLabel>
                    <div className="space-y-0.5">
                      <MenuLink to="/blog" icon={IcoDocument} title="Product Blog" description="Updates, insights, and best practices." onClick={closeMenus} delay={0} />
                      <MenuLink to="/help" icon={IcoHelp} title="Help Center" description="Guides, manuals, and troubleshooting." onClick={closeMenus} delay={1} />
                      <MenuLink to="/docs" icon={IcoTerminal} title="API Reference" description="Developer documentation and endpoints." onClick={closeMenus} delay={2} />
                    </div>
                    <MenuFooter text="Browse all resources" to="/resources" onClick={closeMenus} />
                  </div>
                </div>
              </div>
            </MegaMenuPanel>
          )}

          {/* ─── COMPANY MEGA MENU ───────────────────────────────────────── */}
          {activeMenu === 'company' && (
            <MegaMenuPanel key="company" onMouseEnter={() => handleMenuHover('company')}>
              <div className="max-w-[900px] mx-auto px-8 py-8">
                <div className="grid grid-cols-[260px_1fr] gap-8">

                  {/* Featured Card */}
                  <FeaturedCard
                    illustration={IllustrationExplorer}
                    title="Our Story"
                    description="Every feature inside Notely exists for one reason: help teams remember what matters."
                    cta="Explore Notely"
                    to="/about"
                    onClick={closeMenus}
                    bg="#FEF4EC"
                    accent="#D97745"
                  />

                  {/* Links */}
                  <div>
                    <SectionLabel>Company</SectionLabel>
                    <div className="grid grid-cols-2 gap-x-4">
                      <div className="space-y-0.5">
                        <MenuLink to="/about" icon={IcoUsers} title="About Notely" description="Our mission, values, and team." onClick={closeMenus} delay={0} />
                        <MenuLink to="/careers" icon={IcoBriefcase} title="Careers" description="Join us and shape the future." onClick={closeMenus} delay={1} />
                      </div>
                      <div className="space-y-0.5">
                        <MenuLink to="/security" icon={IcoShield} title="Security" description="Enterprise-grade data protection." onClick={closeMenus} delay={2} />
                        <MenuLink to="/contact" icon={IcoPhone} title="Contact Sales" description="Enterprise workspace setup." onClick={closeMenus} delay={3} />
                      </div>
                    </div>
                    <MenuFooter text="Learn more about Notely" to="/company" onClick={closeMenus} />
                  </div>
                </div>
              </div>
            </MegaMenuPanel>
          )}

        </AnimatePresence>

        {/* Overlay backdrop when mega menu is open */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-14 bg-black/5 backdrop-blur-[1px] z-40 pointer-events-none"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </header>

      {/* ═══ MOBILE MENU ═════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-14 z-50 bg-[#FAF8F3] overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Product */}
              <div>
                <h3 className="text-[12px] font-black text-[#C0BEB8] uppercase tracking-[0.18em] mb-3 font-mono">Product</h3>
                <div className="space-y-1">
                  {[
                    { to: '/product/notes', label: 'Rich Notes' },
                    { to: '/product/workspaces', label: 'Workspaces' },
                    { to: '/product/collaboration', label: 'Live Collaboration' },
                    { to: '/product/search', label: 'Global Search' },
                    { to: '/product/templates', label: 'Templates' },
                    { to: '/product/version-history', label: 'Version History' },
                    { to: '/product/mobile-apps', label: 'Mobile Apps' },
                  ].map(({ to, label }) => (
                    <Link key={to} to={to} onClick={closeMenus} className="block py-2 px-3 text-[16px] font-medium text-[#5B5B5B] hover:text-[#171717] hover:bg-[#F0EDE8] rounded-lg transition-colors">{label}</Link>
                  ))}
                </div>
              </div>
              {/* Solutions */}
              <div>
                <h3 className="text-[12px] font-black text-[#C0BEB8] uppercase tracking-[0.18em] mb-3 font-mono">Solutions</h3>
                <div className="space-y-1">
                  {[
                    { to: '/solutions/teams', label: 'General Teams' },
                    { to: '/solutions/engineering', label: 'Engineering' },
                    { to: '/solutions/marketing', label: 'Marketing' },
                    { to: '/solutions/education', label: 'Education' },
                    { to: '/solutions/hr', label: 'HR & Operations' },
                  ].map(({ to, label }) => (
                    <Link key={to} to={to} onClick={closeMenus} className="block py-2 px-3 text-[16px] font-medium text-[#5B5B5B] hover:text-[#171717] hover:bg-[#F0EDE8] rounded-lg transition-colors">{label}</Link>
                  ))}
                </div>
              </div>
              {/* Resources */}
              <div>
                <h3 className="text-[12px] font-black text-[#C0BEB8] uppercase tracking-[0.18em] mb-3 font-mono">Resources</h3>
                <div className="space-y-1">
                  <Link to="/pricing" onClick={closeMenus} className="block py-2 px-3 text-[16px] font-medium text-[#5B5B5B] hover:text-[#171717] hover:bg-[#F0EDE8] rounded-lg transition-colors">Pricing</Link>
                  <Link to="/resources" onClick={closeMenus} className="block py-2 px-3 text-[16px] font-medium text-[#5B5B5B] hover:text-[#171717] hover:bg-[#F0EDE8] rounded-lg transition-colors">Resources</Link>
                  <Link to="/blog" onClick={closeMenus} className="block py-2 px-3 text-[16px] font-medium text-[#5B5B5B] hover:text-[#171717] hover:bg-[#F0EDE8] rounded-lg transition-colors">Product Blog</Link>
                  <Link to="/help" onClick={closeMenus} className="block py-2 px-3 text-[16px] font-medium text-[#5B5B5B] hover:text-[#171717] hover:bg-[#F0EDE8] rounded-lg transition-colors">Help Center</Link>
                  <Link to="/docs" onClick={closeMenus} className="block py-2 px-3 text-[16px] font-medium text-[#5B5B5B] hover:text-[#171717] hover:bg-[#F0EDE8] rounded-lg transition-colors">API Reference</Link>
                </div>
              </div>
              {/* Company */}
              <div>
                <h3 className="text-[12px] font-black text-[#C0BEB8] uppercase tracking-[0.18em] mb-3 font-mono">Company</h3>
                <div className="space-y-1">
                  <Link to="/company" onClick={closeMenus} className="block py-2 px-3 text-[16px] font-bold text-[#D97745] hover:bg-[#F0EDE8] rounded-lg transition-colors">Our Story →</Link>
                  <Link to="/about" onClick={closeMenus} className="block py-2 px-3 text-[16px] font-medium text-[#5B5B5B] hover:text-[#171717] hover:bg-[#F0EDE8] rounded-lg transition-colors">About Notely</Link>
                  <Link to="/careers" onClick={closeMenus} className="block py-2 px-3 text-[16px] font-medium text-[#5B5B5B] hover:text-[#171717] hover:bg-[#F0EDE8] rounded-lg transition-colors">Careers</Link>
                  <Link to="/security" onClick={closeMenus} className="block py-2 px-3 text-[16px] font-medium text-[#5B5B5B] hover:text-[#171717] hover:bg-[#F0EDE8] rounded-lg transition-colors">Security</Link>
                  <Link to="/contact" onClick={closeMenus} className="block py-2 px-3 text-[16px] font-medium text-[#5B5B5B] hover:text-[#171717] hover:bg-[#F0EDE8] rounded-lg transition-colors">Contact Sales</Link>
                </div>
              </div>
              {/* Mobile CTA */}
              <div className="pt-4 space-y-3 border-t border-[#E8E5DF]">
                <Link to="/login" onClick={closeMenus} className="block text-center py-3 text-[16px] font-bold text-[#5B5B5B] border border-[#E8E5DF] rounded-xl hover:bg-[#F0EDE8] transition-colors">Log in</Link>
                <Link to="/register" onClick={closeMenus} className="block text-center py-3 text-[16px] font-bold text-white bg-[#D97745] hover:bg-[#C25C2B] rounded-xl transition-colors shadow-sm">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAIN CONTENT ═════════════════════════════════════════════════ */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ═══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer className="relative border-t border-[#E8E5DF] pt-8 pb-24 text-[#5B5B5B] font-semibold text-[15px] bg-[#FAF8F3] select-none text-left overflow-hidden">
        
        {/* Soft paper texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-[1440px] mx-auto px-10 relative z-10">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-16 mb-24">
            {/* Column 1: Paper Archives (Product) */}
            <div className="space-y-6">
              <div className="w-14 h-14 bg-[#FDFCF8] rounded-xl border border-[#E8E5DF] flex items-center justify-center shadow-sm">
                <IllustrationSprout className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[#171717] font-black uppercase tracking-[0.15em] text-[12px] font-mono border-b border-dashed border-[#D0CECA] pb-3">Paper Archives</h4>
                <ul className="space-y-3 pt-1">
                  <li><Link to="/product/notes" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Rich Notes</Link></li>
                  <li><Link to="/product/workspaces" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Workspaces</Link></li>
                  <li><Link to="/product/collaboration" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Collaboration</Link></li>
                  <li><Link to="/product/search" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Semantic Search</Link></li>
                  <li><Link to="/product/ai" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">AI Workspace</Link></li>
                  <li><Link to="/product/templates" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Templates</Link></li>
                  <li><Link to="/product/version-history" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Version History</Link></li>
                  <li><Link to="/product/mobile-apps" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Mobile Apps</Link></li>
                </ul>
              </div>
            </div>

            {/* Column 2: Knowledge Paths (Solutions) */}
            <div className="space-y-6">
              <div className="w-14 h-14 bg-[#FDFCF8] rounded-xl border border-[#E8E5DF] flex items-center justify-center shadow-sm">
                <IllustrationExplorer className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[#171717] font-black uppercase tracking-[0.15em] text-[12px] font-mono border-b border-dashed border-[#D0CECA] pb-3">Knowledge Paths</h4>
                <ul className="space-y-3 pt-1">
                  <li><Link to="/solutions/engineering" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Engineering</Link></li>
                  <li><Link to="/solutions/marketing" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Marketing</Link></li>
                  <li><Link to="/solutions/education" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Education</Link></li>
                  <li><Link to="/solutions/hr" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">HR & Ops</Link></li>
                  <li><Link to="/solutions/teams" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">General Teams</Link></li>
                </ul>
              </div>
            </div>

            {/* Column 3: Reference Shelf (Resources) */}
            <div className="space-y-6">
              <div className="w-14 h-14 bg-[#FDFCF8] rounded-xl border border-[#E8E5DF] flex items-center justify-center shadow-sm">
                <IllustrationOwl className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[#171717] font-black uppercase tracking-[0.15em] text-[12px] font-mono border-b border-dashed border-[#D0CECA] pb-3">Reference Shelf</h4>
                <ul className="space-y-3 pt-1">
                  <li><Link to="/pricing" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Pricing</Link></li>
                  <li><Link to="/blog" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Product Blog</Link></li>
                  <li><Link to="/resources" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Resources</Link></li>
                  <li><Link to="/help" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Help Center</Link></li>
                  <li><Link to="/docs" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">API Docs</Link></li>
                </ul>
              </div>
            </div>

            {/* Column 4: Our Studio (Company) */}
            <div className="space-y-6">
              <div className="w-14 h-14 bg-[#FDFCF8] rounded-xl border border-[#E8E5DF] flex items-center justify-center shadow-sm">
                <IllustrationFox className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[#171717] font-black uppercase tracking-[0.15em] text-[12px] font-mono border-b border-dashed border-[#D0CECA] pb-3">Our Studio</h4>
                <ul className="space-y-3 pt-1">
                  <li><Link to="/about" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">About Us</Link></li>
                  <li><Link to="/careers" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Careers</Link></li>
                  <li><Link to="/security" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Security</Link></li>
                  <li><Link to="/contact" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Contact Sales</Link></li>
                </ul>
              </div>
            </div>

            {/* Column 5: House Rules (Legal) */}
            <div className="space-y-6">
              <div className="w-14 h-14 bg-[#FDFCF8] rounded-xl border border-[#E8E5DF] flex items-center justify-center shadow-sm">
                <IllustrationCourier className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[#171717] font-black uppercase tracking-[0.15em] text-[12px] font-mono border-b border-dashed border-[#D0CECA] pb-3">House Rules</h4>
                <ul className="space-y-3 pt-1">
                  <li><Link to="/privacy" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-[#D97745] hover:translate-x-1 transition-transform inline-block">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Area */}
          <div className="pt-12 border-t border-[#E8E5DF] flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* Library Stamp & Branding */}
            <div className="flex items-center gap-8">
              <motion.div 
                whileHover={{ rotate: 0, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-16 h-16 rounded-full border-2 border-dashed border-[#D97745]/60 flex items-center justify-center -rotate-12 select-none bg-[#FDFCF8] shadow-sm cursor-pointer"
              >
                <div className="text-center leading-none">
                  <span className="block text-[6px] font-black text-[#D97745] uppercase tracking-widest font-mono">Archive</span>
                  <span className="block text-[14px] font-black text-[#D97745] mt-1">№ 01</span>
                </div>
              </motion.div>
              
              <div className="space-y-1.5">
                <p className="text-[#171717] font-bold text-[14px] flex items-center gap-2">
                  <IllustrationCrane className="w-6 h-6" />
                  Crafted one page at a time.
                </p>
                <p className="text-[13px] text-[#A0A09A]">
                  &copy; {new Date().getFullYear()} Notely Inc.
                </p>
              </div>
            </div>

            {/* Handwritten Version & Socials */}
            <div className="flex flex-col items-center lg:items-end gap-5">
              <div className="flex gap-6 text-[#A0A09A] font-bold font-mono text-[13px]">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D97745] hover:-translate-y-0.5 transition-transform block">GH</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D97745] hover:-translate-y-0.5 transition-transform block">IN</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D97745] hover:-translate-y-0.5 transition-transform block">X</a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D97745] hover:-translate-y-0.5 transition-transform block">DC</a>
              </div>
              
              <div className="text-[16px] text-[#D97745] opacity-70" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                v 2.4.1 — Final Draft
              </div>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
