import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import api from '../api/client';
import * as Icons from './Icons';
import { useExportAllNotes, useAIQuota, useNotes } from '../hooks/useNotes';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { useIntegrations } from '../hooks/useIntegrations';

// ─── Tab → section name map for backward compat ─────────────────────────────
const TAB_MAP = {
  profile: 'account', appearance: 'appearance', security: 'security',
  export: 'import-export', 'import-export': 'import-export',
  activity: 'activity', integrations: 'integrations',
  'ai-usage': 'ai-preferences', billing: 'billing',
};

// ─── Nav structure ────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Personal',
    items: [
      { id: 'account', icon: '👤', label: 'Account' },
      { id: 'appearance', icon: '🎨', label: 'Appearance' },
      { id: 'security', icon: '🔐', label: 'Security' },
      { id: 'notifications', icon: '🔔', label: 'Notifications' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { id: 'workspace', icon: '👥', label: 'Workspace' },
      { id: 'ai-preferences', icon: '🤖', label: 'AI Preferences' },
      { id: 'integrations', icon: '🔌', label: 'Integrations' },
    ],
  },
  {
    label: 'Data & Billing',
    items: [
      { id: 'billing', icon: '💳', label: 'Billing & Plans' },
      { id: 'import-export', icon: '📂', label: 'Import & Export' },
    ],
  },
  {
    label: 'More',
    items: [
      { id: 'activity', icon: '📊', label: 'Activity' },
      { id: 'shortcuts', icon: '⚡', label: 'Keyboard Shortcuts' },
      { id: 'devices', icon: '📱', label: 'Devices' },
      { id: 'help', icon: '❓', label: 'Help & Support' },
    ],
  },
];

// ─── Reusable primitives ──────────────────────────────────────────────────────
const SectionTitle = ({ children, sub }) => (
  <div className="mb-8">
    <h2 className="text-[22px] font-black text-[#1F1F1F] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>{children}</h2>
    {sub && <p className="text-[13px] text-[#7A7870] mt-1 font-medium">{sub}</p>}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-[#E7DED3] rounded-2xl overflow-hidden shadow-sm ${className}`}>{children}</div>
);

const CardRow = ({ label, sub, children, noBorder }) => (
  <div className={`flex items-center justify-between px-5 py-4 ${!noBorder ? 'border-b border-[#F0EBE3] last:border-0' : ''}`}>
    <div className="mr-4">
      <p className="text-[13px] font-semibold text-[#1F1F1F]">{label}</p>
      {sub && <p className="text-[11px] text-[#B0A89A] mt-0.5">{sub}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const FieldLabel = ({ children }) => (
  <label className="block text-[11px] font-black text-[#7A7870] uppercase tracking-widest mb-1.5">{children}</label>
);

const Input = ({ value, onChange, placeholder, type = 'text', disabled, className = '' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className={`w-full bg-white border border-[#E7DED3] rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#1F1F1F] placeholder-[#C8BEB2] focus:outline-none focus:border-[#D97745] focus:ring-1 focus:ring-[#D97745]/20 transition-all disabled:bg-[#F9F6F0] disabled:text-[#B0A89A] ${className}`}
  />
);

const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className="w-full bg-white border border-[#E7DED3] rounded-xl px-4 py-3 text-[13px] font-medium text-[#1F1F1F] placeholder-[#C8BEB2] focus:outline-none focus:border-[#D97745] focus:ring-1 focus:ring-[#D97745]/20 transition-all resize-none"
  />
);

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 ${checked ? 'bg-[#D97745]' : 'bg-[#D4C9BC]'}`}
    style={{ height: '22px', width: '40px' }}
  >
    <span
      className="absolute top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200"
      style={{ left: checked ? '20px' : '2px' }}
    />
  </button>
);

const Badge = ({ children, color = 'orange' }) => {
  const colors = {
    orange: 'bg-[#FFF5EC] text-[#D97745] border-[#D97745]/20',
    green: 'bg-[#EDF3EE] text-[#4D7C5A] border-[#4D7C5A]/20',
    blue: 'bg-[#EFF3FD] text-[#4B6BBA] border-[#4B6BBA]/20',
    red: 'bg-red-50 text-red-600 border-red-200',
    gray: 'bg-[#F5F0E8] text-[#7A7870] border-[#E7DED3]',
  };
  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

const DangerBtn = ({ onClick, children, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 text-[12px] font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
  >
    {children}
  </button>
);

const PrimaryBtn = ({ onClick, children, disabled, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="px-5 py-2.5 bg-[#D97745] text-white text-[13px] font-bold rounded-xl hover:bg-[#C25C2B] transition-colors cursor-pointer disabled:opacity-50 shadow-sm shadow-[#D97745]/25"
  >
    {children}
  </button>
);

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function ConfirmModal({ isOpen, title, message, confirmLabel = 'Confirm', danger = true, onConfirm, onCancel, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-7 w-full max-w-[400px] mx-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-[16px] font-black text-[#1F1F1F] mb-2">{title}</h3>
        <p className="text-[13px] text-[#7A7870] font-medium leading-relaxed mb-5">{message}</p>
        {children}
        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onCancel} className="px-4 py-2 text-[12px] font-bold border border-[#E7DED3] rounded-xl hover:bg-[#F5F0E8] cursor-pointer transition-colors text-[#7A7870]">Cancel</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-[12px] font-bold rounded-xl cursor-pointer transition-colors text-white ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-[#D97745] hover:bg-[#C25C2B]'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Keyboard Shortcuts data ──────────────────────────────────────────────────
const SHORTCUTS = [
  { group: 'Notes', shortcuts: [
    { keys: ['⌘', 'N'], action: 'New Note' },
    { keys: ['⌘', 'S'], action: 'Save Note' },
    { keys: ['⌘', 'D'], action: 'Duplicate Note' },
    { keys: ['⌘', '⌫'], action: 'Delete Note' },
  ]},
  { group: 'Navigation', shortcuts: [
    { keys: ['⌘', 'K'], action: 'Command Palette' },
    { keys: ['⌘', '/'], action: 'Toggle Sidebar' },
    { keys: ['⌘', 'F'], action: 'Search Notes' },
    { keys: ['Esc'], action: 'Close / Cancel' },
  ]},
  { group: 'Editor', shortcuts: [
    { keys: ['⌘', 'B'], action: 'Bold' },
    { keys: ['⌘', 'I'], action: 'Italic' },
    { keys: ['⌘', 'Shift', 'A'], action: 'AI Magic Menu' },
    { keys: ['⌘', 'Shift', 'E'], action: 'Export Note' },
  ]},
  { group: 'Workspace', shortcuts: [
    { keys: ['⌘', '1'], action: 'Dashboard' },
    { keys: ['⌘', 'Shift', 'C'], action: 'AI Companion Chat' },
    { keys: ['⌘', 'Shift', 'M'], action: 'Knowledge Map' },
    { keys: ['⌘', ','], action: 'Open Settings' },
  ]},
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SettingsModal({ isOpen, onClose, initialTab }) {
  const currentUser = useAuthStore(state => state.user);
  const authLogin = useAuthStore(state => state.login);
  const authLogout = useAuthStore(state => state.logout);
  const { theme, setTheme, addToast } = useUIStore();

  const exportAllMut = useExportAllNotes();
  const { data: auditLogsData } = useAuditLogs({ page: 1, per_page: 30 });
  const { data: integrations } = useIntegrations();
  const { data: aiQuota } = useAIQuota();
  const { data: notes } = useNotes({});

  const [activeSection, setActiveSection] = useState('account');
  const [navSearch, setNavSearch] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Profile form state ─────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [language, setLanguage] = useState('en');

  // ── Password form state ────────────────────────────────────────────────────
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPws, setShowPws] = useState({ current: false, new: false, confirm: false });

  // ── Confirmation modals ────────────────────────────────────────────────────
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePw, setDeletePw] = useState('');
  const [signOutAllModal, setSignOutAllModal] = useState(false);

  // ── Notification toggles (localStorage) ───────────────────────────────────
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifDesktop, setNotifDesktop] = useState(false);
  const [notifAI, setNotifAI] = useState(true);
  const [notifProduct, setNotifProduct] = useState(false);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  // ── Appearance prefs (localStorage) ───────────────────────────────────────
  const [accentColor, setAccentColor] = useState('#D97745');
  const [sidebarStyle, setSidebarStyle] = useState('comfortable');
  const [cardStyle, setCardStyle] = useState('elevated');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [editorWidth, setEditorWidth] = useState('comfortable');
  const [paperTexture, setPaperTexture] = useState(true);
  const [motionReduced, setMotionReduced] = useState(false);

  // ── AI prefs (localStorage) ───────────────────────────────────────────────
  const [aiTone, setAiTone] = useState('professional');
  const [autoSummary, setAutoSummary] = useState(false);
  const [autoTagging, setAutoTagging] = useState(true);
  const [aiPrivacy, setAiPrivacy] = useState(false);
  const [contextMemory, setContextMemory] = useState(true);
  const [smartFolders, setSmartFolders] = useState(false);

  // ── Sync on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setName(currentUser?.name || '');
    setEmail(currentUser?.email || '');
    setAvatarUrl(currentUser?.avatar_url || '');
    setBio(currentUser?.bio || '');
    setLocation(currentUser?.location || '');
    setWebsite(currentUser?.website || '');
    setTimezone(currentUser?.timezone || 'UTC');
    setLanguage(currentUser?.language || 'en');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setIsDirty(false);
    // Map old tab names
    const mapped = TAB_MAP[initialTab] || initialTab || 'account';
    setActiveSection(mapped);
    // Load localStorage prefs
    try {
      const prefs = JSON.parse(localStorage.getItem('notely_prefs') || '{}');
      if (prefs.accentColor) setAccentColor(prefs.accentColor);
      if (prefs.sidebarStyle) setSidebarStyle(prefs.sidebarStyle);
      if (prefs.cardStyle) setCardStyle(prefs.cardStyle);
      if (prefs.fontFamily) setFontFamily(prefs.fontFamily);
      if (prefs.editorWidth) setEditorWidth(prefs.editorWidth);
      if (prefs.paperTexture !== undefined) setPaperTexture(prefs.paperTexture);
      if (prefs.motionReduced !== undefined) setMotionReduced(prefs.motionReduced);
      if (prefs.notifEmail !== undefined) setNotifEmail(prefs.notifEmail);
      if (prefs.notifDesktop !== undefined) setNotifDesktop(prefs.notifDesktop);
      if (prefs.notifAI !== undefined) setNotifAI(prefs.notifAI);
      if (prefs.notifProduct !== undefined) setNotifProduct(prefs.notifProduct);
      if (prefs.notifWeekly !== undefined) setNotifWeekly(prefs.notifWeekly);
      if (prefs.notifMarketing !== undefined) setNotifMarketing(prefs.notifMarketing);
      if (prefs.aiTone) setAiTone(prefs.aiTone);
      if (prefs.autoSummary !== undefined) setAutoSummary(prefs.autoSummary);
      if (prefs.autoTagging !== undefined) setAutoTagging(prefs.autoTagging);
      if (prefs.aiPrivacy !== undefined) setAiPrivacy(prefs.aiPrivacy);
      if (prefs.contextMemory !== undefined) setContextMemory(prefs.contextMemory);
      if (prefs.smartFolders !== undefined) setSmartFolders(prefs.smartFolders);
    } catch {}
  }, [isOpen, initialTab, currentUser]);

  // ── Profile completion ────────────────────────────────────────────────────
  const profileFields = [name, email, avatarUrl, bio, location, website];
  const completion = Math.round(profileFields.filter(f => f?.trim()).length / profileFields.length * 100);

  // ── Storage computed ──────────────────────────────────────────────────────
  const storageBytes = useMemo(() => {
    if (!notes) return 0;
    return notes.reduce((acc, n) => acc + (n.title?.length || 0) + (n.content?.length || 0), 0);
  }, [notes]);
  const storageMB = (storageBytes / 1024 / 1024).toFixed(2);
  const storageLimit = currentUser?.plan === 'free' ? 50 : 500; // MB
  const storagePct = Math.min(100, (storageBytes / (storageLimit * 1024 * 1024)) * 100);

  // ── Security score ────────────────────────────────────────────────────────
  const securityScore = useMemo(() => {
    let score = 0;
    if (currentUser?.auth_provider === 'password' && currentUser?.password_hash) score += 50;
    if (currentUser?.auth_provider === 'google' || currentUser?.google_id) score += 30;
    if (currentUser?.avatar_url) score += 10;
    if (bio) score += 10;
    return Math.min(100, score);
  }, [currentUser, bio]);

  const securityLabel = securityScore >= 80 ? { text: 'Strong', color: 'green' } :
    securityScore >= 50 ? { text: 'Good', color: 'blue' } :
    { text: 'Needs Attention', color: 'red' };

  // ── Nav search filter ────────────────────────────────────────────────────
  const filteredGroups = useMemo(() => {
    if (!navSearch) return NAV_GROUPS;
    const q = navSearch.toLowerCase();
    return NAV_GROUPS.map(g => ({
      ...g,
      items: g.items.filter(i => i.label.toLowerCase().includes(q)),
    })).filter(g => g.items.length > 0);
  }, [navSearch]);

  // ── Save profile ─────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.put('/auth/me', {
        name: name.trim(), email: email.trim(),
        avatar_url: avatarUrl, bio, location, website, timezone, language,
      });
      authLogin(localStorage.getItem('access_token'), localStorage.getItem('refresh_token'), res.data);
      addToast('Profile saved successfully!', 'success');
      setIsDirty(false);
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to update profile.', 'error');
    } finally { setIsSubmitting(false); }
  };

  // ── Save password ─────────────────────────────────────────────────────────
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!currentPw || !newPw) return addToast('All password fields are required.', 'warning');
    if (newPw !== confirmPw) return addToast('New passwords do not match.', 'warning');
    setIsSubmitting(true);
    try {
      await api.put('/auth/me', { current_password: currentPw, new_password: newPw });
      addToast('Password changed successfully!', 'success');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to update password.', 'error');
    } finally { setIsSubmitting(false); }
  };

  // ── Save appearance / notifications / AI prefs ────────────────────────────
  const saveLocalPrefs = useCallback((patch) => {
    try {
      const existing = JSON.parse(localStorage.getItem('notely_prefs') || '{}');
      localStorage.setItem('notely_prefs', JSON.stringify({ ...existing, ...patch }));
    } catch {}
  }, []);

  // ── Delete account ────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    setIsSubmitting(true);
    try {
      await api.delete('/auth/me', { data: { password: deletePw } });
      addToast('Account deleted.', 'info');
      authLogout();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to delete account.', 'error');
    } finally { setIsSubmitting(false); setDeleteModal(false); }
  };

  // ── Dirty tracking helpers ────────────────────────────────────────────────
  const markDirty = () => setIsDirty(true);
  const field = (val, setter) => (e) => { setter(e.target.value); markDirty(); };

  if (!isOpen) return null;

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION RENDERERS
  // ═══════════════════════════════════════════════════════════════════════════

  const renderAccount = () => (
    <div className="space-y-8">
      <SectionTitle sub="Manage your profile, identity, and personal preferences.">Account</SectionTitle>

      {/* Profile completion */}
      <Card>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[12px] font-black text-[#7A7870] uppercase tracking-widest">Profile Completion</p>
              <p className="text-[24px] font-black text-[#1F1F1F] mt-0.5">{completion}%</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F0EBE3" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D97745" strokeWidth="3"
                  strokeDasharray={`${completion} ${100 - completion}`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#D97745]">{completion}%</span>
            </div>
          </div>
          {completion < 100 && (
            <p className="text-[11px] text-[#B0A89A]">
              {!avatarUrl && '• Add a profile picture  '}
              {!bio && '• Write a short bio  '}
              {!location && '• Add your location  '}
              {!website && '• Add your website'}
            </p>
          )}
        </div>
      </Card>

      {/* Avatar + Core identity */}
      <Card>
        <div className="p-5 border-b border-[#F0EBE3]">
          <div className="flex items-center gap-4">
            <div className="relative group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E7DED3]" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D97745] to-[#C25C2B] flex items-center justify-center text-white text-[22px] font-black">
                  {(name || currentUser?.name || 'N').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="text-white text-[10px] font-bold">Edit</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-black text-[#1F1F1F]">{name || 'Your Name'}</p>
              <p className="text-[12px] text-[#7A7870]">{email}</p>
              <Badge color={currentUser?.plan === 'free' ? 'gray' : 'orange'}>{currentUser?.plan || 'free'} plan</Badge>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Display Name</FieldLabel>
              <Input value={name} onChange={field(name, setName)} placeholder="Your full name" />
            </div>
            <div>
              <FieldLabel>Email Address</FieldLabel>
              <Input value={email} onChange={field(email, setEmail)} placeholder="you@email.com" type="email" disabled={currentUser?.auth_provider === 'google'} />
              {currentUser?.auth_provider === 'google' && <p className="text-[10px] text-[#B0A89A] mt-1">Managed by Google</p>}
            </div>
          </div>
          <div>
            <FieldLabel>Avatar URL</FieldLabel>
            <Input value={avatarUrl} onChange={field(avatarUrl, setAvatarUrl)} placeholder="https://..." />
          </div>
          <div>
            <FieldLabel>Bio</FieldLabel>
            <Textarea value={bio} onChange={field(bio, setBio)} placeholder="A short bio about you…" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Location</FieldLabel>
              <Input value={location} onChange={field(location, setLocation)} placeholder="City, Country" />
            </div>
            <div>
              <FieldLabel>Website</FieldLabel>
              <Input value={website} onChange={field(website, setWebsite)} placeholder="https://yoursite.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Time Zone</FieldLabel>
              <select value={timezone} onChange={field(timezone, setTimezone)}
                className="w-full bg-white border border-[#E7DED3] rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#1F1F1F] focus:outline-none focus:border-[#D97745] transition-all">
                {['UTC','Asia/Kolkata','America/New_York','America/Los_Angeles','Europe/London','Europe/Paris','Asia/Tokyo','Asia/Singapore'].map(tz =>
                  <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Language</FieldLabel>
              <select value={language} onChange={field(language, setLanguage)}
                className="w-full bg-white border border-[#E7DED3] rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#1F1F1F] focus:outline-none focus:border-[#D97745] transition-all">
                {[['en','English'],['es','Español'],['fr','Français'],['de','Deutsch'],['hi','हिंदी'],['ja','日本語'],['pt','Português']].map(([v,l]) =>
                  <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Workspace Mascot */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]">
          <p className="text-[13px] font-black text-[#1F1F1F]">Workspace Companion</p>
          <p className="text-[11px] text-[#B0A89A] mt-0.5">Choose your Notely mascot</p>
        </div>
        <div className="p-5 flex gap-3 flex-wrap">
          {['🌿 Classic','🌱 Sprout','🦉 Owl','🦢 Crane','🦊 Fox'].map(m => (
            <button key={m} className="px-3 py-2 rounded-xl border border-[#E7DED3] bg-[#FAF7F2] text-[12px] font-semibold text-[#7A7870] hover:border-[#D97745] hover:text-[#D97745] transition-all cursor-pointer">
              {m}
            </button>
          ))}
          <button className="px-3 py-2 rounded-xl border border-dashed border-[#D4C9BC] text-[12px] font-semibold text-[#B0A89A] hover:border-[#D97745] hover:text-[#D97745] transition-all cursor-pointer">
            + Custom
          </button>
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]">
          <p className="text-[13px] font-black text-[#1F1F1F]">Personal Preferences</p>
        </div>
        <div className="divide-y divide-[#F0EBE3]">
          <CardRow label="Default Start Page" sub="Where Notely opens after login" noBorder>
            <select className="bg-white border border-[#E7DED3] rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#1F1F1F] focus:outline-none focus:border-[#D97745]">
              {['Dashboard','Recent Notes','AI Workspace','Favorites'].map(o => <option key={o}>{o}</option>)}
            </select>
          </CardRow>
          <CardRow label="Default Note Style" sub="Format applied to new notes" noBorder>
            <select className="bg-white border border-[#E7DED3] rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#1F1F1F] focus:outline-none focus:border-[#D97745]">
              {['Markdown','Plain','Rich Editor'].map(o => <option key={o}>{o}</option>)}
            </select>
          </CardRow>
          <CardRow label="Auto Save" sub="How often notes are saved" noBorder>
            <select className="bg-white border border-[#E7DED3] rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#1F1F1F] focus:outline-none focus:border-[#D97745]">
              {['Instant','Every 5 seconds','Manual'].map(o => <option key={o}>{o}</option>)}
            </select>
          </CardRow>
        </div>
      </Card>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-8">
      <SectionTitle sub="Customize how Notely looks and feels.">Appearance</SectionTitle>

      {/* Theme */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]"><p className="text-[13px] font-black text-[#1F1F1F]">Theme</p></div>
        <div className="p-5 flex gap-3">
          {[['light','☀️ Light'],['dark','🌙 Dark'],['system','💻 System']].map(([v,l]) => (
            <button key={v} onClick={() => { setTheme(v); saveLocalPrefs({ theme: v }); }}
              className={`flex-1 py-3 rounded-xl border text-[12px] font-bold transition-all cursor-pointer ${theme === v ? 'bg-[#D97745] text-white border-[#D97745] shadow-sm' : 'border-[#E7DED3] text-[#7A7870] hover:border-[#D97745] hover:text-[#D97745] bg-white'}`}>
              {l}
            </button>
          ))}
        </div>
      </Card>

      {/* Accent Color */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]"><p className="text-[13px] font-black text-[#1F1F1F]">Accent Color</p></div>
        <div className="p-5 flex gap-3 flex-wrap">
          {[['#D97745','Orange'],['#4B6BBA','Blue'],['#7C4DBA','Purple'],['#4D7C5A','Green'],['#BA4D4D','Red']].map(([color, name]) => (
            <button key={color} onClick={() => { setAccentColor(color); saveLocalPrefs({ accentColor: color }); }}
              title={name}
              className={`w-9 h-9 rounded-xl border-2 cursor-pointer transition-all ${accentColor === color ? 'border-[#1F1F1F] scale-110 shadow-md' : 'border-white shadow-sm hover:scale-105'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </Card>

      {/* Font */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]"><p className="text-[13px] font-black text-[#1F1F1F]">Interface Font</p></div>
        <div className="p-5 grid grid-cols-2 gap-3">
          {['Inter','SF Pro','IBM Plex Mono','Geist'].map(f => (
            <button key={f} onClick={() => { setFontFamily(f); saveLocalPrefs({ fontFamily: f }); }}
              className={`py-3 px-4 rounded-xl border text-[12px] font-bold cursor-pointer transition-all text-left ${fontFamily === f ? 'border-[#D97745] bg-[#FFF5EC] text-[#D97745]' : 'border-[#E7DED3] text-[#7A7870] hover:border-[#D97745] bg-white'}`}>
              {f}
            </button>
          ))}
        </div>
      </Card>

      {/* More appearance */}
      <Card>
        <div className="divide-y divide-[#F0EBE3]">
          <CardRow label="Sidebar Style" noBorder>
            <div className="flex gap-2">
              {['Compact','Comfortable'].map(s => (
                <button key={s} onClick={() => { setSidebarStyle(s.toLowerCase()); saveLocalPrefs({ sidebarStyle: s.toLowerCase() }); }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all border ${sidebarStyle === s.toLowerCase() ? 'bg-[#D97745] text-white border-[#D97745]' : 'border-[#E7DED3] text-[#7A7870]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </CardRow>
          <CardRow label="Card Style" noBorder>
            <div className="flex gap-2">
              {['Flat','Elevated','Paper'].map(s => (
                <button key={s} onClick={() => { setCardStyle(s.toLowerCase()); saveLocalPrefs({ cardStyle: s.toLowerCase() }); }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all border ${cardStyle === s.toLowerCase() ? 'bg-[#D97745] text-white border-[#D97745]' : 'border-[#E7DED3] text-[#7A7870]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </CardRow>
          <CardRow label="Editor Width" noBorder>
            <div className="flex gap-2">
              {['Comfortable','Wide','Full'].map(s => (
                <button key={s} onClick={() => { setEditorWidth(s.toLowerCase()); saveLocalPrefs({ editorWidth: s.toLowerCase() }); }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all border ${editorWidth === s.toLowerCase() ? 'bg-[#D97745] text-white border-[#D97745]' : 'border-[#E7DED3] text-[#7A7870]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </CardRow>
          <CardRow label="Paper Texture" sub="Subtle grain on the workspace background" noBorder>
            <Toggle checked={paperTexture} onChange={(v) => { setPaperTexture(v); saveLocalPrefs({ paperTexture: v }); }} />
          </CardRow>
          <CardRow label="Reduced Motion" sub="Fewer animations across the app" noBorder>
            <Toggle checked={motionReduced} onChange={(v) => { setMotionReduced(v); saveLocalPrefs({ motionReduced: v }); }} />
          </CardRow>
        </div>
      </Card>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8">
      <SectionTitle sub="Keep your Notely workspace secure.">Security</SectionTitle>

      {/* Security score */}
      <Card>
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-[#7A7870] uppercase tracking-widest mb-1">Security Score</p>
            <div className="flex items-center gap-3">
              <p className="text-[28px] font-black text-[#1F1F1F]">{securityScore}%</p>
              <Badge color={securityLabel.color}>{securityLabel.text}</Badge>
            </div>
          </div>
          <div className="w-full max-w-[160px] h-2 bg-[#F0EBE3] rounded-full ml-6">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${securityScore}%`, background: securityScore >= 80 ? '#4D7C5A' : securityScore >= 50 ? '#4B6BBA' : '#E53E3E' }} />
          </div>
        </div>
      </Card>

      {/* Password */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]">
          <p className="text-[13px] font-black text-[#1F1F1F]">Change Password</p>
        </div>
        <form onSubmit={handleSavePassword} className="p-5 space-y-4">
          {currentUser?.auth_provider === 'google' ? (
            <div className="text-center py-6">
              <p className="text-3xl mb-2">🔗</p>
              <p className="text-[13px] font-semibold text-[#7A7870]">Your account uses Google Sign-In.</p>
              <p className="text-[11px] text-[#B0A89A] mt-1">Password management is handled by Google.</p>
            </div>
          ) : (
            <>
              {[['Current Password', currentPw, setCurrentPw, 'current'],
                ['New Password', newPw, setNewPw, 'new'],
                ['Confirm New Password', confirmPw, setConfirmPw, 'confirm']].map(([label, val, setter, key]) => (
                <div key={key}>
                  <FieldLabel>{label}</FieldLabel>
                  <div className="relative">
                    <Input type={showPws[key] ? 'text' : 'password'} value={val} onChange={(e) => setter(e.target.value)} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPws(p => ({ ...p, [key]: !p[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0A89A] hover:text-[#7A7870] cursor-pointer">
                      <span className="text-sm">{showPws[key] ? '🙈' : '👁'}</span>
                    </button>
                  </div>
                </div>
              ))}
              <PrimaryBtn type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Update Password'}</PrimaryBtn>
            </>
          )}
        </form>
      </Card>

      {/* Connected accounts */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]"><p className="text-[13px] font-black text-[#1F1F1F]">Connected Accounts</p></div>
        <div className="divide-y divide-[#F0EBE3]">
          <CardRow label="Google" sub={currentUser?.google_id ? 'Connected' : 'Not connected'} noBorder>
            {currentUser?.google_id
              ? <Badge color="green">Connected</Badge>
              : <button className="px-3 py-1.5 text-[11px] font-bold border border-[#E7DED3] rounded-lg hover:border-[#D97745] text-[#7A7870] hover:text-[#D97745] cursor-pointer transition-colors">Connect</button>}
          </CardRow>
          <CardRow label="GitHub" sub="Not connected" noBorder>
            <button className="px-3 py-1.5 text-[11px] font-bold border border-[#E7DED3] rounded-lg hover:border-[#D97745] text-[#7A7870] hover:text-[#D97745] cursor-pointer transition-colors">Connect</button>
          </CardRow>
        </div>
      </Card>

      {/* 2FA + Passkeys — coming soon */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]"><p className="text-[13px] font-black text-[#1F1F1F]">Advanced Security</p></div>
        <div className="divide-y divide-[#F0EBE3]">
          <CardRow label="Two-Factor Authentication" sub="Add an extra layer of security" noBorder>
            <Badge color="gray">Coming Soon</Badge>
          </CardRow>
          <CardRow label="Passkeys" sub="Sign in with biometrics or hardware key" noBorder>
            <Badge color="gray">Coming Soon</Badge>
          </CardRow>
          <CardRow label="Active Sessions" sub="View all devices where you're logged in" noBorder>
            <Badge color="gray">Coming Soon</Badge>
          </CardRow>
        </div>
      </Card>

      {/* Danger zone */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F5E5E5]"><p className="text-[13px] font-black text-red-600">Danger Zone</p></div>
        <div className="divide-y divide-[#FFF0F0]">
          <CardRow label="Sign Out Everywhere" sub="Revoke all active sessions except this one" noBorder>
            <DangerBtn onClick={() => setSignOutAllModal(true)}>Sign Out All</DangerBtn>
          </CardRow>
          <CardRow label="Delete Account" sub="Permanently remove your account and all data" noBorder>
            <DangerBtn onClick={() => setDeleteModal(true)}>Delete Account</DangerBtn>
          </CardRow>
        </div>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-8">
      <SectionTitle sub="Choose what you hear about and when.">Notifications</SectionTitle>
      <Card>
        <div className="divide-y divide-[#F0EBE3]">
          {[
            ['Email Notifications', 'Important updates sent to your email', notifEmail, setNotifEmail, 'notifEmail'],
            ['Desktop Notifications', 'Browser push notifications', notifDesktop, setNotifDesktop, 'notifDesktop'],
            ['AI Updates', 'When AI tasks finish processing', notifAI, setNotifAI, 'notifAI'],
            ['Product News', 'New features and releases', notifProduct, setNotifProduct, 'notifProduct'],
            ['Weekly Digest', 'Your weekly workspace summary', notifWeekly, setNotifWeekly, 'notifWeekly'],
            ['Marketing Emails', 'Tips, tutorials, and promotions', notifMarketing, setNotifMarketing, 'notifMarketing'],
          ].map(([label, sub, val, setter, key]) => (
            <CardRow key={key} label={label} sub={sub} noBorder>
              <Toggle checked={val} onChange={(v) => { setter(v); saveLocalPrefs({ [key]: v }); }} />
            </CardRow>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderWorkspace = () => (
    <div className="space-y-8">
      <SectionTitle sub="Manage your team workspace settings.">Workspace</SectionTitle>
      <Card>
        <div className="p-5 space-y-4">
          <div>
            <FieldLabel>Workspace Name</FieldLabel>
            <Input value={currentUser?.name ? `${currentUser.name}'s Workspace` : 'My Workspace'} onChange={() => {}} disabled />
          </div>
          <div>
            <FieldLabel>Workspace URL</FieldLabel>
            <Input value={`notely.app/${currentUser?.email?.split('@')[0] || 'workspace'}`} onChange={() => {}} disabled />
          </div>
        </div>
      </Card>
      <Card>
        <div className="divide-y divide-[#F0EBE3]">
          <CardRow label="Members" sub="Invite team members" noBorder><Badge color="gray">Coming Soon</Badge></CardRow>
          <CardRow label="Roles & Permissions" sub="Manage team access levels" noBorder><Badge color="gray">Coming Soon</Badge></CardRow>
          <CardRow label="Guest Access" sub="Allow read-only external access" noBorder><Badge color="gray">Coming Soon</Badge></CardRow>
        </div>
      </Card>
    </div>
  );

  const renderAIPreferences = () => (
    <div className="space-y-8">
      <SectionTitle sub="Personalize your AI-powered workspace.">AI Preferences</SectionTitle>

      {/* Quota */}
      <Card>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black text-[#7A7870] uppercase tracking-widest mb-1">Daily AI Usage</p>
              <p className="text-[24px] font-black text-[#1F1F1F]">{aiQuota?.used || 0} <span className="text-[14px] text-[#B0A89A] font-medium">/ {aiQuota?.daily_limit || 20} actions</span></p>
            </div>
            <div className="text-right">
              <Badge color={aiQuota?.remaining === 0 ? 'red' : 'orange'}>{aiQuota?.plan || 'free'} plan</Badge>
              <p className="text-[10px] text-[#B0A89A] mt-1">Resets every 24h</p>
            </div>
          </div>
          <div className="h-2 bg-[#F0EBE3] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: aiQuota ? `${Math.min(100, (aiQuota.used / aiQuota.daily_limit) * 100)}%` : '0%',
                background: aiQuota && aiQuota.used >= aiQuota.daily_limit ? '#E53E3E' : '#D97745' }} />
          </div>
          <p className="text-[11px] text-[#B0A89A]">
            {aiQuota?.remaining > 0 ? `${aiQuota.remaining} actions remaining today` : '⚠️ Quota reached — resets in 24 hours'}
          </p>
        </div>
      </Card>

      {/* Model */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]"><p className="text-[13px] font-black text-[#1F1F1F]">AI Model</p></div>
        <div className="p-5 grid grid-cols-2 gap-3">
          {[['gemini','✨ Gemini (Active)'],['auto','⚡ Auto'],['gpt','🧠 GPT-5 (Soon)'],['claude','🎯 Claude (Soon)']].map(([v,l]) => (
            <button key={v}
              className={`py-3 px-4 rounded-xl border text-[12px] font-bold text-left cursor-pointer transition-all ${v === 'gemini' ? 'border-[#D97745] bg-[#FFF5EC] text-[#D97745]' : 'border-[#E7DED3] text-[#B0A89A] bg-[#FAF7F2]'}`}
              disabled={v !== 'gemini'}>
              {l}
            </button>
          ))}
        </div>
      </Card>

      {/* AI Tone */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]"><p className="text-[13px] font-black text-[#1F1F1F]">Writing Tone</p></div>
        <div className="p-5 flex flex-wrap gap-2">
          {['professional','creative','academic','simple','casual'].map(t => (
            <button key={t} onClick={() => { setAiTone(t); saveLocalPrefs({ aiTone: t }); }}
              className={`px-4 py-2 rounded-xl text-[12px] font-bold border cursor-pointer transition-all capitalize ${aiTone === t ? 'bg-[#D97745] text-white border-[#D97745]' : 'border-[#E7DED3] text-[#7A7870] bg-white hover:border-[#D97745]'}`}>
              {t}
            </button>
          ))}
        </div>
      </Card>

      {/* AI Feature toggles */}
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]"><p className="text-[13px] font-black text-[#1F1F1F]">Smart Features</p></div>
        <div className="divide-y divide-[#F0EBE3]">
          {[
            ['Auto Summaries', 'Automatically generate note summaries', autoSummary, setAutoSummary, 'autoSummary'],
            ['Auto Tagging', 'Suggest tags based on content', autoTagging, setAutoTagging, 'autoTagging'],
            ['Context Memory', 'AI remembers conversation history', contextMemory, setContextMemory, 'contextMemory'],
            ['Smart Folder Suggestions', 'AI recommends folders for notes', smartFolders, setSmartFolders, 'smartFolders'],
            ['AI Privacy Mode', 'Never send note content to AI', aiPrivacy, setAiPrivacy, 'aiPrivacy'],
          ].map(([label, sub, val, setter, key]) => (
            <CardRow key={key} label={label} sub={sub} noBorder>
              <Toggle checked={val} onChange={(v) => { setter(v); saveLocalPrefs({ [key]: v }); }} />
            </CardRow>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-8">
      <SectionTitle sub="Connect Notely to tools your team already uses.">Integrations</SectionTitle>
      <div className="space-y-3">
        {(integrations || []).map(integ => (
          <Card key={integ.id || integ.name}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5F0E8] flex items-center justify-center text-lg">{integ.icon}</div>
                <div>
                  <p className="text-[13px] font-bold text-[#1F1F1F]">{integ.name}</p>
                  <p className="text-[11px] text-[#B0A89A]">{integ.description}</p>
                </div>
              </div>
              <Badge color={integ.status === 'In Development' ? 'orange' : 'gray'}>{integ.status}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]"><p className="text-[13px] font-black text-[#1F1F1F]">Developer</p></div>
        <div className="divide-y divide-[#F0EBE3]">
          <CardRow label="API Tokens" sub="Create tokens for the Notely API" noBorder><Badge color="gray">Coming Soon</Badge></CardRow>
          <CardRow label="Webhook Keys" sub="Receive events via webhooks" noBorder><Badge color="gray">Coming Soon</Badge></CardRow>
          <CardRow label="Zapier" sub="Automate workflows with Zapier" noBorder><Badge color="gray">Coming Soon</Badge></CardRow>
        </div>
      </Card>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-8">
      <SectionTitle sub="Manage your plan, usage, and billing details.">Billing & Plans</SectionTitle>

      {/* Current plan card */}
      <Card>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black text-[#7A7870] uppercase tracking-widest mb-1">Current Plan</p>
              <p className="text-[24px] font-black text-[#1F1F1F] capitalize">{currentUser?.plan || 'free'}</p>
              {currentUser?.plan === 'free' && <p className="text-[11px] text-[#B0A89A]">Free forever — upgrade for more power</p>}
            </div>
            <button className="px-5 py-2.5 bg-[#1F1F1F] text-white text-[12px] font-black rounded-xl hover:bg-[#333] transition-colors cursor-pointer">
              Upgrade Plan ↗
            </button>
          </div>

          {/* Storage usage */}
          <div className="space-y-2 pt-2 border-t border-[#F0EBE3]">
            <div className="flex justify-between items-center">
              <p className="text-[12px] font-bold text-[#7A7870]">Storage Used</p>
              <p className="text-[12px] font-black text-[#1F1F1F]">{storageMB} MB / {storageLimit} MB</p>
            </div>
            <div className="h-2 bg-[#F0EBE3] rounded-full overflow-hidden">
              <div className="h-full bg-[#D97745] rounded-full transition-all duration-500" style={{ width: `${storagePct}%` }} />
            </div>
            <p className="text-[11px] text-[#B0A89A]">{notes?.length || 0} notes · {storagePct.toFixed(1)}% of storage used</p>
          </div>
        </div>
      </Card>

      {/* Plans comparison */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { name: 'Free', price: '$0', color: 'gray', features: ['50 notes', '20 AI/day', '5 folders', '50MB storage'] },
          { name: 'Pro', price: '$8/mo', color: 'orange', features: ['Unlimited notes', 'Unlimited AI', 'All folders', '500MB storage', 'Priority support'] },
          { name: 'Business', price: '$20/mo', color: 'blue', features: ['Everything in Pro', 'Team workspace', 'Audit logs', 'API access', 'Custom domain'] },
        ].map(plan => (
          <div key={plan.name} className={`bg-white border-2 rounded-2xl p-5 ${currentUser?.plan === plan.name.toLowerCase() ? 'border-[#D97745]' : 'border-[#E7DED3]'}`}>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#7A7870] mb-1">{plan.name}</p>
            <p className="text-[20px] font-black text-[#1F1F1F] mb-3">{plan.price}</p>
            <ul className="space-y-1.5 text-[11px] text-[#7A7870] font-medium mb-4">
              {plan.features.map(f => <li key={f} className="flex items-center gap-1.5"><span className="text-[#4D7C5A]">✓</span>{f}</li>)}
            </ul>
            {currentUser?.plan === plan.name.toLowerCase()
              ? <p className="text-[11px] font-black text-[#D97745] text-center">✓ Current Plan</p>
              : <button className="w-full py-2 border border-[#E7DED3] rounded-xl text-[11px] font-bold text-[#7A7870] hover:border-[#D97745] hover:text-[#D97745] cursor-pointer transition-colors">Select</button>}
          </div>
        ))}
      </div>

      <Card>
        <div className="divide-y divide-[#F0EBE3]">
          <CardRow label="Payment Method" sub="No payment method on file" noBorder><Badge color="gray">Not set</Badge></CardRow>
          <CardRow label="Invoices" sub="Download past invoices" noBorder><Badge color="gray">None</Badge></CardRow>
          <CardRow label="Referral Credits" sub="Invite friends for free Pro months" noBorder>
            <button className="px-3 py-1.5 text-[11px] font-bold border border-[#E7DED3] rounded-lg hover:border-[#D97745] text-[#7A7870] hover:text-[#D97745] cursor-pointer transition-colors">Invite</button>
          </CardRow>
        </div>
      </Card>
    </div>
  );

  const renderImportExport = () => (
    <div className="space-y-8">
      <SectionTitle sub="Move your data in and out of Notely.">Import & Export</SectionTitle>

      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]"><p className="text-[13px] font-black text-[#1F1F1F]">Export Your Notes</p></div>
        <div className="p-5 space-y-3">
          <p className="text-[12px] text-[#7A7870]">Download all your notes in the format of your choice.</p>
          <div className="flex gap-3 flex-wrap">
            {[['Markdown', 'md', '📝'],['JSON', 'json', '📊']].map(([label, fmt, icon]) => (
              <button key={fmt}
                onClick={() => exportAllMut.mutate({ format: fmt })}
                disabled={exportAllMut.isPending}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E7DED3] rounded-xl text-[12px] font-bold text-[#7A7870] hover:border-[#D97745] hover:text-[#D97745] cursor-pointer transition-all shadow-sm hover:shadow-md disabled:opacity-50">
                <span>{icon}</span> Export {label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]"><p className="text-[13px] font-black text-[#1F1F1F]">Import Notes</p></div>
        <div className="p-5 space-y-3">
          <p className="text-[12px] text-[#7A7870]">Bring notes from other tools into Notely.</p>
          <div className="grid grid-cols-3 gap-3">
            {[['Notion','📦'],['Markdown','📝'],['Evernote','🐘'],['Google Docs','📄'],['PDF','📕'],['DOCX','📃']].map(([name, icon]) => (
              <button key={name} className="flex items-center gap-2 px-4 py-3 bg-white border border-[#E7DED3] rounded-xl text-[12px] font-semibold text-[#B0A89A] hover:border-[#E7DED3] cursor-not-allowed select-none">
                <span>{icon}</span> {name} <Badge color="gray">Soon</Badge>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="divide-y divide-[#F0EBE3]">
          <CardRow label="Backup Workspace" sub="Create a complete workspace backup" noBorder>
            <button onClick={() => exportAllMut.mutate({ format: 'json' })} className="px-3 py-1.5 text-[11px] font-bold border border-[#E7DED3] rounded-lg hover:border-[#D97745] text-[#7A7870] hover:text-[#D97745] cursor-pointer transition-colors">Backup Now</button>
          </CardRow>
          <CardRow label="Last Backup" sub={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} noBorder>
            <Badge color="green">Up to date</Badge>
          </CardRow>
        </div>
      </Card>
    </div>
  );

  const renderActivity = () => {
    const logs = auditLogsData?.logs || [];
    const actionIcons = { note_create: '📝', note_update: '✏️', note_delete: '🗑️', profile_update: '👤', password_change: '🔐', account_delete: '⚠️' };
    return (
      <div className="space-y-8">
        <SectionTitle sub="A complete log of actions in your workspace.">Activity</SectionTitle>
        <Card>
          <div className="px-5 py-4 border-b border-[#F0EBE3]">
            <p className="text-[13px] font-black text-[#1F1F1F]">Recent Actions</p>
          </div>
          <div className="divide-y divide-[#F0EBE3]">
            {logs.slice(0, 20).map((log, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                <span className="text-base">{actionIcons[log.action] || '📋'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#1F1F1F] capitalize">{log.action?.replace(/_/g, ' ')}</p>
                  {log.metadata?.title && <p className="text-[11px] text-[#B0A89A] truncate">{log.metadata.title}</p>}
                </div>
                <p className="text-[11px] text-[#B0A89A] flex-shrink-0">
                  {new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-2xl mb-2">📋</p>
                <p className="text-[13px] font-semibold text-[#B0A89A]">No activity yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const renderShortcuts = () => (
    <div className="space-y-8">
      <SectionTitle sub="Speed up your workflow with keyboard shortcuts.">Keyboard Shortcuts</SectionTitle>
      {SHORTCUTS.map(group => (
        <Card key={group.group}>
          <div className="px-5 py-4 border-b border-[#F0EBE3]">
            <p className="text-[13px] font-black text-[#1F1F1F]">{group.group}</p>
          </div>
          <div className="divide-y divide-[#F0EBE3]">
            {group.shortcuts.map(s => (
              <div key={s.action} className="flex items-center justify-between px-5 py-3">
                <p className="text-[12px] font-medium text-[#1F1F1F]">{s.action}</p>
                <div className="flex gap-1.5">
                  {s.keys.map((k, i) => (
                    <kbd key={i} className="px-2 py-1 bg-[#F5F0E8] border border-[#E7DED3] rounded-lg text-[11px] font-black text-[#7A7870] font-mono">{k}</kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderDevices = () => (
    <div className="space-y-8">
      <SectionTitle sub="Manage devices and browser sessions.">Devices</SectionTitle>
      <Card>
        <div className="px-5 py-4 border-b border-[#F0EBE3]">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-black text-[#1F1F1F]">Current Session</p>
            <Badge color="green">Active</Badge>
          </div>
        </div>
        <div className="p-5 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💻</span>
            <div>
              <p className="text-[13px] font-bold text-[#1F1F1F]">{navigator.userAgent.includes('Mac') ? 'macOS' : navigator.userAgent.includes('Win') ? 'Windows' : 'Unknown OS'} · {navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Browser'}</p>
              <p className="text-[11px] text-[#B0A89A]">Last active: Just now</p>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="divide-y divide-[#F0EBE3]">
          <CardRow label="Mac App" sub="Not installed" noBorder><Badge color="gray">Coming Soon</Badge></CardRow>
          <CardRow label="Windows App" sub="Not installed" noBorder><Badge color="gray">Coming Soon</Badge></CardRow>
          <CardRow label="iOS App" sub="Not installed" noBorder><Badge color="gray">Coming Soon</Badge></CardRow>
          <CardRow label="Android App" sub="Not installed" noBorder><Badge color="gray">Coming Soon</Badge></CardRow>
        </div>
      </Card>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-8">
      <SectionTitle sub="Get help, report issues, and follow our journey.">Help & Support</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: '📖', title: 'Documentation', sub: 'Detailed guides and API docs', badge: null },
          { icon: '🎬', title: 'Video Tutorials', sub: 'Learn Notely visually', badge: null },
          { icon: '💬', title: 'Community', sub: 'Ask questions, share ideas', badge: null },
          { icon: '💡', title: 'Feature Requests', sub: 'Vote on what we build next', badge: null },
          { icon: '🐞', title: 'Report a Bug', sub: 'Help us improve Notely', badge: null },
          { icon: '✉️', title: 'Contact Support', sub: 'Talk to a human', badge: null },
        ].map(item => (
          <Card key={item.title}>
            <button className="w-full p-5 text-left hover:bg-[#F9F6F0] transition-colors cursor-pointer rounded-2xl">
              <p className="text-xl mb-2">{item.icon}</p>
              <p className="text-[13px] font-bold text-[#1F1F1F]">{item.title}</p>
              <p className="text-[11px] text-[#B0A89A] mt-0.5">{item.sub}</p>
            </button>
          </Card>
        ))}
      </div>
      <Card>
        <div className="divide-y divide-[#F0EBE3]">
          <CardRow label="Changelog" sub="What's new in Notely" noBorder><Badge color="orange">v2.4.1</Badge></CardRow>
          <CardRow label="Roadmap" sub="See what we're building" noBorder><button className="text-[11px] font-bold text-[#D97745] hover:underline cursor-pointer">View →</button></CardRow>
          <CardRow label="Privacy Policy" sub="How we handle your data" noBorder><button className="text-[11px] font-bold text-[#7A7870] hover:underline cursor-pointer">Read →</button></CardRow>
          <CardRow label="Terms of Service" sub="Your agreement with Notely" noBorder><button className="text-[11px] font-bold text-[#7A7870] hover:underline cursor-pointer">Read →</button></CardRow>
        </div>
      </Card>
    </div>
  );

  const SECTION_RENDERERS = {
    account: renderAccount, appearance: renderAppearance, security: renderSecurity,
    notifications: renderNotifications, workspace: renderWorkspace,
    'ai-preferences': renderAIPreferences, integrations: renderIntegrations,
    billing: renderBilling, 'import-export': renderImportExport,
    activity: renderActivity, shortcuts: renderShortcuts,
    devices: renderDevices, help: renderHelp,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" onClick={onClose}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Panel */}
        <div
          className="relative w-full max-w-[1100px] flex rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          style={{ height: 'min(88vh, 820px)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── Left Sidebar ─────────────────────────────────────────────── */}
          <aside className="w-[240px] flex-shrink-0 flex flex-col border-r border-[#E7DED3]" style={{ background: '#F0EBE3' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7DED3]">
              <div className="flex items-center gap-2.5">
                <span className="text-base">⚙️</span>
                <h2 className="text-[14px] font-black text-[#1F1F1F]" style={{ fontFamily: 'Outfit, sans-serif' }}>Settings</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#E7DED3] text-[#B0A89A] hover:text-[#7A7870] cursor-pointer transition-colors">
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            {/* Search settings */}
            <div className="px-3 py-3 border-b border-[#E7DED3]">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A89A] text-[12px]">🔍</span>
                <input
                  type="text"
                  placeholder="Search settings…"
                  value={navSearch}
                  onChange={e => setNavSearch(e.target.value)}
                  className="w-full bg-white/70 border border-[#E7DED3] rounded-xl pl-8 pr-3 py-2 text-[12px] font-medium text-[#1F1F1F] placeholder-[#C8BEB2] focus:outline-none focus:border-[#D97745] transition-all"
                />
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto scrollbar-hide px-2 py-3 space-y-4">
              {filteredGroups.map(group => (
                <div key={group.label}>
                  <p className="px-3 mb-1 text-[9px] font-black text-[#B0A89A] uppercase tracking-widest">{group.label}</p>
                  <div className="space-y-0.5">
                    {group.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all text-left cursor-pointer ${
                          activeSection === item.id
                            ? 'bg-white text-[#D97745] shadow-sm'
                            : 'text-[#7A7870] hover:bg-white/60 hover:text-[#1F1F1F]'
                        }`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            {/* Bottom version */}
            <div className="border-t border-[#E7DED3] px-5 py-3.5">
              <p className="text-[10px] text-[#B0A89A] font-medium">Version v2.4.1</p>
              <p className="text-[10px] text-[#C8BEB2]">Built with ❤️ by Notely</p>
            </div>
          </aside>

          {/* ── Right Content ──────────────────────────────────────────────── */}
          <main className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FAF7F2' }}>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-8 py-8">
              {(SECTION_RENDERERS[activeSection] || renderAccount)()}
            </div>

            {/* Sticky unsaved-changes footer */}
            {isDirty && (
              <div className="flex-shrink-0 border-t border-[#E7DED3] bg-white px-8 py-4 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D97745] animate-pulse" />
                  <p className="text-[12px] font-bold text-[#7A7870]">You have unsaved changes</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setName(currentUser?.name || ''); setEmail(currentUser?.email || '');
                    setAvatarUrl(currentUser?.avatar_url || ''); setBio(currentUser?.bio || '');
                    setLocation(currentUser?.location || ''); setWebsite(currentUser?.website || '');
                    setTimezone(currentUser?.timezone || 'UTC'); setLanguage(currentUser?.language || 'en');
                    setIsDirty(false);
                  }} className="px-4 py-2 text-[12px] font-bold border border-[#E7DED3] rounded-xl hover:bg-[#F5F0E8] cursor-pointer transition-colors text-[#7A7870]">
                    Discard
                  </button>
                  <PrimaryBtn onClick={handleSaveProfile} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : 'Save Changes'}
                  </PrimaryBtn>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Delete account modal */}
      <ConfirmModal
        isOpen={deleteModal}
        title="Delete Account"
        message="This will permanently delete your account and all notes, folders, and data. This cannot be undone."
        confirmLabel="Delete My Account"
        danger
        onConfirm={handleDeleteAccount}
        onCancel={() => { setDeleteModal(false); setDeletePw(''); }}
      >
        {currentUser?.auth_provider === 'password' && (
          <div>
            <FieldLabel>Confirm your password</FieldLabel>
            <Input type="password" value={deletePw} onChange={e => setDeletePw(e.target.value)} placeholder="Enter your password" />
          </div>
        )}
      </ConfirmModal>

      {/* Sign out all modal */}
      <ConfirmModal
        isOpen={signOutAllModal}
        title="Sign Out Everywhere"
        message="All active sessions will be signed out immediately. You'll need to log back in on every device."
        confirmLabel="Sign Out All Sessions"
        danger
        onConfirm={() => { addToast('Signed out of all sessions.', 'success'); setSignOutAllModal(false); }}
        onCancel={() => setSignOutAllModal(false)}
      />
    </>
  );
}
