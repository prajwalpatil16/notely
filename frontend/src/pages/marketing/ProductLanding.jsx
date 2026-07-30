import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PaperClip, IconCheck } from '../../components/CompanyIllustrations';

// ─── ICONS ─────────────────────────────────────────────────────────────────────

const IconEdit = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconFolder = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IconUsers = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconSearch = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconSparkle = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const IconTemplate = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

const IconClock = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconSmartphone = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

// ─── FEATURES DATA ─────────────────────────────────────────────────────────────

const features = [
  { slug: "notes",           icon: IconEdit,       title: "Rich Notes",          desc: "Write beautifully with Markdown and rich formatting.",       accent: "#D97745" },
  { slug: "workspaces",      icon: IconFolder,     title: "Workspaces",          desc: "Organize projects with folders and nested pages.",            accent: "#4D7C5A" },
  { slug: "collaboration",   icon: IconUsers,      title: "Live Collaboration",   desc: "Work together in real time.",                                accent: "#171717" },
  { slug: "search",          icon: IconSearch,     title: "Semantic Search",      desc: "Find knowledge instantly.",                                  accent: "#171717" },
  { slug: "ai",              icon: IconSparkle,    title: "AI Workspace",         desc: "Generate, summarize, and organize content.",                 accent: "#D97745" },
  { slug: "templates",       icon: IconTemplate,   title: "Templates",            desc: "Start faster with pre-built workflows.",                     accent: "#4D7C5A" },
  { slug: "version-history", icon: IconClock,      title: "Version History",      desc: "Restore any document anytime.",                              accent: "#171717" },
  { slug: "mobile-apps",     icon: IconSmartphone, title: "Mobile Apps",          desc: "Stay connected wherever work happens.",                      accent: "#D97745" },
];

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export default function ProductLanding() {
  useEffect(() => {
    document.title = "Product | Notely — One Platform for Modern Knowledge";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Write, organize, collaborate, search, and build with AI—all from one beautifully connected workspace.";
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-16 pb-12 overflow-hidden selection:bg-[#171717]/10">
      
      {/* Background Texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">

        {/* ─── HERO ────────────────────────────────────────────────────────── */}
        <div className="text-center pt-6 pb-20">
          <h1 className="text-[56px] md:text-[80px] font-black tracking-tight text-[#171717] leading-[1.02] mb-6 max-w-[900px] mx-auto">
            One platform for modern knowledge.
          </h1>
          <p className="text-[20px] text-[#7A7870] font-medium leading-relaxed max-w-[560px] mx-auto mb-10 font-serif">
            Write, organize, collaborate, search, and build with AI—all from one beautifully connected workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto relative group">
              <div className="absolute inset-0 bg-[#D97745] translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
              <div className="relative bg-[#171717] text-white border-2 border-[#171717] px-8 py-3 font-bold text-[15px] group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                Start Free Workspace
              </div>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto relative group">
              <div className="absolute inset-0 bg-[#E8E5DF] translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
              <div className="relative bg-[#FDFCF8] text-[#171717] border border-[#E8E5DF] px-8 py-3 font-bold text-[15px] group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                Watch Demo
              </div>
            </Link>
          </div>
        </div>

        {/* ─── FEATURE GRID ────────────────────────────────────────────────── */}
        <div className="mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const rotations = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[0.5deg]', 'rotate-[-0.5deg]'];
              const rot = rotations[idx % 4];
              const offsets = ['mt-0', 'mt-4', 'mt-2', 'mt-6'];
              const off = offsets[idx % 4];
              return (
                <Link
                  key={feature.slug}
                  to={`/product/${feature.slug}`}
                  className={`group bg-white border border-[#E8E5DF] p-6 shadow-sm hover:shadow-lg ${rot} ${off} hover:rotate-0 transition-all duration-300 block relative overflow-hidden`}
                >
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#E8E5DF]" />
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-5 border border-[#E8E5DF] bg-[#F8F5EF] rotate-[-2deg] group-hover:rotate-0 transition-transform"
                    style={{ borderRadius: '8px' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: feature.accent }} />
                  </div>
                  <h3 className="text-[16px] font-black tracking-tight text-[#171717] mb-2">{feature.title}</h3>
                  <p className="text-[13px] text-[#7A7870] font-medium leading-relaxed mb-4">{feature.desc}</p>
                  <span
                    className="text-[12px] font-bold uppercase tracking-widest font-mono group-hover:text-[#D97745] transition-colors"
                    style={{ color: feature.accent }}
                  >
                    Learn more →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ─── FINAL CTA ───────────────────────────────────────────────────── */}
        <div className="bg-[#FDFCF8] border border-[#E8E5DF] p-12 md:p-20 shadow-sm rotate-[0.5deg] text-center relative overflow-hidden">
          <PaperClip className="absolute -top-3 right-10 w-7 h-7 text-[#171717] rotate-45" />
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#171717 1px, transparent 1px)', backgroundSize: '100% 1.6rem', marginTop: '1.6rem' }} />
          <div className="relative z-10">
            <h2 className="text-[32px] md:text-[48px] font-black tracking-tight text-[#171717] leading-tight mb-4 font-serif max-w-[720px] mx-auto">
              Everything your team needs.<br/>Nothing it doesn't.
            </h2>
            <p className="text-[17px] text-[#7A7870] font-medium leading-relaxed max-w-[540px] mx-auto mb-10">
              Replace scattered documents, disconnected tools, and endless searching with one connected workspace built for modern teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto relative group">
                <div className="absolute inset-0 bg-[#D97745] translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
                <div className="relative bg-[#171717] text-white border-2 border-[#171717] px-8 py-3 font-bold text-[15px] group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                  Start Free Workspace
                </div>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto relative group">
                <div className="absolute inset-0 bg-[#E8E5DF] translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
                <div className="relative bg-[#FDFCF8] text-[#171717] border border-[#E8E5DF] px-8 py-3 font-bold text-[15px] group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                  Book a Demo
                </div>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
