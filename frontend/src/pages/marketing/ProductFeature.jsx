import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PaperClip, IconCheck } from '../../components/CompanyIllustrations';

// ─── ICONS ────────────────────────────────────────────────────────────────────

const I = ({ d, extra = "" }) => (
  <svg className={`w-5 h-5 ${extra}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {d.map((p, i) => typeof p === 'string' && p.startsWith('<') ? null : <path key={i} d={p} />)}
  </svg>
);

const IconEdit = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconFolder = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const IconUsers = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconSearch = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconSparkle = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);
const IconTemplate = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
  </svg>
);
const IconClock = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconSmartphone = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const IconLink = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const IconShield = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────

const featureData = {
  "notes": {
    seoTitle: "Rich Notes & Document Editor | Notely",
    seoDescription: "Write beautiful documents with markdown, slash commands, code blocks, tables, and AI writing assistance.",
    icon: IconEdit,
    themeColor: "#D97745",
    tag: "DOCUMENT EDITOR",
    heroHeading: "Write documents people actually enjoy reading.",
    heroDesc: "Beautiful writing meets powerful organization. Create meeting notes, product specs, engineering documentation, company wikis, and everything in between—all from a distraction-free editor.",
    primaryCta: "Start Writing Free",
    secondaryCta: "See Rich Notes in Action",
    sectionTitle: "Why teams choose Rich Notes",
    sectionSubtitle: "Create documentation that stays organized as your company grows.",
    bullets: [
      "Markdown with live formatting",
      "Slash commands for faster writing",
      "Tables, callouts, diagrams, embeds",
      "Code blocks with syntax highlighting",
      "AI writing assistant",
      "Nested pages",
      "Version history",
      "Beautiful typography"
    ],
    useCases: [
      { title: "Product Specifications", desc: "Document every feature from idea to release." },
      { title: "Meeting Notes", desc: "Capture discussions and automatically generate action items." },
      { title: "Engineering Docs", desc: "Maintain technical documentation that developers actually use." },
      { title: "Knowledge Base", desc: "Create a searchable company handbook." }
    ],
    ctaTitle: "Start documenting smarter.",
    ctaSub: "Create your first workspace in under one minute."
  },
  "workspaces": {
    seoTitle: "Workspaces & Organization | Notely",
    seoDescription: "Organize your company into workspaces built for teams, projects, departments, or clients.",
    icon: IconFolder,
    themeColor: "#4D7C5A",
    tag: "ORGANIZATION",
    heroHeading: "Everything has a place.",
    heroDesc: "Organize your company into workspaces built for teams, projects, departments, or clients. No more scattered documents or endless folders.",
    primaryCta: "Build your workspace",
    secondaryCta: "See how it works",
    sectionTitle: "Built for how real teams work",
    sectionSubtitle: "Structure your knowledge without limiting how your team thinks.",
    bullets: [
      "Unlimited nested pages",
      "Department-level workspaces",
      "Granular permission controls",
      "Smart tagging and filtering",
      "Auto-organization by project",
      "Shared and private spaces",
      "Guest and external access",
      "Real-time sync across devices"
    ],
    useCases: [
      { title: "Unlimited hierarchy", desc: "Nest pages forever without losing structure." },
      { title: "Department workspaces", desc: "Separate Engineering, Marketing, HR, Design, Finance, and Operations while keeping everything connected." },
      { title: "Permission controls", desc: "Share exactly what people need and nothing more." },
      { title: "Smart organization", desc: "Tag, filter, group, and automatically organize documents." }
    ],
    ctaTitle: "Your structure, your rules.",
    ctaSub: "Build a workspace that scales with your team."
  },
  "collaboration": {
    seoTitle: "Live Collaboration & Real-Time Editing | Notely",
    seoDescription: "See edits instantly, leave comments anywhere, assign tasks, and collaborate with your entire team in real time.",
    icon: IconUsers,
    themeColor: "#171717",
    tag: "COLLABORATION",
    heroHeading: "Work together without getting in each other's way.",
    heroDesc: "See edits instantly, leave comments anywhere, assign tasks, and collaborate with your entire team in real time.",
    primaryCta: "Invite your team",
    secondaryCta: "See it in action",
    sectionTitle: "Built for real-time teamwork",
    sectionSubtitle: "Every collaboration feature you need, none you don't.",
    bullets: [
      "Live cursors and presence",
      "Inline comments anywhere",
      "@mentions and notifications",
      "Task assignments from comments",
      "Suggestion mode",
      "Document-level activity feed",
      "Real-time conflict resolution",
      "Team presence indicators"
    ],
    useCases: [
      { title: "Live cursors", desc: "Watch teammates edit documents as they happen." },
      { title: "Inline comments", desc: "Discuss ideas exactly where they belong." },
      { title: "Mentions", desc: "Notify teammates with @mentions." },
      { title: "Task assignments", desc: "Turn comments into action items with owners and due dates." }
    ],
    ctaTitle: "Great ideas are built together.",
    ctaSub: "Bring your entire team into one shared workspace."
  },
  "search": {
    seoTitle: "Semantic Search & AI Knowledge Discovery | Notely",
    seoDescription: "Search every workspace, note, document, meeting, comment, and attachment in milliseconds using semantic AI search.",
    icon: IconSearch,
    themeColor: "#171717",
    tag: "SEARCH",
    heroHeading: "Find knowledge instantly.",
    heroDesc: "Search every workspace, note, document, meeting, comment, and attachment in milliseconds using semantic AI search.",
    primaryCta: "Try Search",
    secondaryCta: "See how it works",
    sectionTitle: "Search that actually understands you",
    sectionSubtitle: "Find information the way you think about it, not the way you filed it.",
    bullets: [
      "Semantic AI search",
      "Search by meaning, not keywords",
      "Filter by owner, tags, date, workspace",
      "Full-text across attachments",
      "Recent searches and history",
      "Instant results as you type",
      "Ask questions in plain English",
      "Connected results across spaces"
    ],
    useCases: [
      { title: "Search by meaning", desc: "Find ideas—not just keywords." },
      { title: "Filters", desc: "Filter by owner, workspace, tags, or date." },
      { title: "Recent searches", desc: "Jump back into previous work instantly." },
      { title: "AI Answers", desc: "Ask questions in plain English and get answers instantly from your knowledge base." }
    ],
    ctaTitle: "Knowledge should never be hidden.",
    ctaSub: "Start searching your workspace in seconds."
  },
  "ai": {
    seoTitle: "AI Workspace Assistant | Notely",
    seoDescription: "Ask questions naturally and receive instant answers based on your team's knowledge. Generate, summarize, rewrite, and organize.",
    icon: IconSparkle,
    themeColor: "#D97745",
    tag: "AI",
    heroHeading: "An AI assistant that knows your workspace.",
    heroDesc: "Instead of searching through hundreds of documents, ask questions naturally and receive instant answers based on your team's knowledge.",
    primaryCta: "Try AI Features",
    secondaryCta: "See examples",
    sectionTitle: "AI that works with your knowledge",
    sectionSubtitle: "Spend less time writing. More time thinking.",
    bullets: [
      "Generate first drafts instantly",
      "Summarize long documents",
      "Rewrite and improve content",
      "Create checklists from prose",
      "Translate documents",
      "Extract action items from meetings",
      "Brainstorm ideas on demand",
      "Explain technical concepts simply"
    ],
    useCases: [
      { title: "Generate documents", desc: "Create structured first drafts from a single prompt." },
      { title: "Summarize meetings", desc: "Turn hour-long transcripts into clear, actionable summaries." },
      { title: "Rewrite content", desc: "Improve clarity, tone, and structure with one click." },
      { title: "Brainstorm ideas", desc: "Break through creative blocks with contextual AI suggestions." }
    ],
    ctaTitle: "Meet your team's AI.",
    ctaSub: "Built into your workspace. Ready to use on day one."
  },
  "templates": {
    seoTitle: "Templates & Pre-Built Workflows | Notely",
    seoDescription: "Start faster with professionally designed templates for product planning, documentation, HR, engineering, education, and more.",
    icon: IconTemplate,
    themeColor: "#4D7C5A",
    tag: "TEMPLATES",
    heroHeading: "Start with a proven workflow.",
    heroDesc: "Choose from professionally designed templates for product planning, documentation, HR, engineering, education, and more.",
    primaryCta: "Browse Templates",
    secondaryCta: "Start from scratch",
    sectionTitle: "A template for every team",
    sectionSubtitle: "Stop reinventing the wheel. Start with structure.",
    bullets: [
      "API Docs & Sprint Planning",
      "Architecture Decision Records",
      "Campaign Briefs & Content Calendars",
      "Employee Handbook & Onboarding",
      "Interview Notes & Performance Reviews",
      "Lecture Notes & Research Projects",
      "Daily Journal & Goal Planner",
      "Custom templates for your team"
    ],
    useCases: [
      { title: "Engineering", desc: "API Docs, Sprint Planning, Architecture Decisions, Release Notes." },
      { title: "Marketing", desc: "Campaign Briefs, Content Calendar, Brand Guidelines, SEO Checklist." },
      { title: "HR & People", desc: "Employee Handbook, Onboarding Checklist, Interview Notes, Performance Reviews." },
      { title: "Education", desc: "Lecture Notes, Research Projects, Course Planner, Assignment Tracker." }
    ],
    ctaTitle: "Don't start from scratch.",
    ctaSub: "Pick a template and start building in seconds."
  },
  "version-history": {
    seoTitle: "Version History & Document Recovery | Notely",
    seoDescription: "Restore any document, compare changes, and see who edited what. Every edit, every version, forever.",
    icon: IconClock,
    themeColor: "#171717",
    tag: "VERSION HISTORY",
    heroHeading: "Every edit. Every version. Forever.",
    heroDesc: "Never worry about losing work. Restore any document, compare changes, and see who edited what—all without thinking about it.",
    primaryCta: "Get Started",
    secondaryCta: "See Version History",
    sectionTitle: "Complete document history",
    sectionSubtitle: "Confidence that your work is always safe.",
    bullets: [
      "Automatic continuous saving",
      "Full timeline revision history",
      "One-click version restore",
      "Side-by-side change comparison",
      "Per-author contribution tracking",
      "Named snapshots and milestones",
      "30-day history on all plans",
      "Unlimited history on Pro"
    ],
    useCases: [
      { title: "Timeline history", desc: "Browse every revision with timestamps and authors." },
      { title: "Restore instantly", desc: "One click to recover any previous version." },
      { title: "Compare versions", desc: "See exactly what changed, line by line." },
      { title: "Author tracking", desc: "Know who edited every part of every document." }
    ],
    ctaTitle: "Mistakes shouldn't be permanent.",
    ctaSub: "Start writing confidently knowing everything is saved."
  },
  "mobile-apps": {
    seoTitle: "Mobile Apps for iOS & Android | Notely",
    seoDescription: "Access your workspace anywhere with beautifully designed apps for iPhone and Android.",
    icon: IconSmartphone,
    themeColor: "#D97745",
    tag: "MOBILE",
    heroHeading: "Your workspace travels with you.",
    heroDesc: "Access documents anywhere with beautifully designed apps for iPhone and Android. Read, write, search, and collaborate without missing a beat.",
    primaryCta: "Download App",
    secondaryCta: "See features",
    sectionTitle: "A full workspace in your pocket",
    sectionSubtitle: "Every feature available on web, now on mobile.",
    bullets: [
      "Full offline editing support",
      "Instant cross-device sync",
      "Quick Capture for fast ideas",
      "Push notifications for mentions",
      "Dark and light mode",
      "Biometric authentication",
      "Native iOS and Android design",
      "Tablet-optimized layouts"
    ],
    useCases: [
      { title: "Offline editing", desc: "Continue working without internet. Changes sync automatically when you reconnect." },
      { title: "Instant sync", desc: "Changes appear everywhere, on every device, in real time." },
      { title: "Quick capture", desc: "Save ideas before you forget them with one-tap capture." },
      { title: "Push notifications", desc: "Never miss mentions, comments, or important updates." }
    ],
    ctaTitle: "Your second brain should fit in your pocket.",
    ctaSub: "Available on App Store and Google Play."
  },
  "integrations": {
    seoTitle: "Integrations & Connected Tools | Notely",
    seoDescription: "Connect GitHub, Slack, Figma, Linear, Google Drive, Jira, and hundreds more to bring your entire workflow into one place.",
    icon: IconLink,
    themeColor: "#4D7C5A",
    tag: "INTEGRATIONS",
    heroHeading: "Connect the tools your team already uses.",
    heroDesc: "Bring conversations, designs, code, and files into one connected knowledge hub. No more context switching between apps.",
    primaryCta: "View Integrations",
    secondaryCta: "Request an integration",
    sectionTitle: "Works with everything your team uses",
    sectionSubtitle: "Connect your stack in minutes, not months.",
    bullets: [
      "GitHub — link PRs and issues",
      "Slack — post updates automatically",
      "Figma — embed live designs",
      "Google Drive — attach files",
      "Linear — sync project status",
      "Jira — connect tickets",
      "Zapier — build custom workflows",
      "Notion Import — migrate in minutes"
    ],
    useCases: [
      { title: "GitHub", desc: "Link pull requests, issues, and code reviews directly to documentation." },
      { title: "Slack", desc: "Post document updates, comments, and mentions directly to channels." },
      { title: "Figma", desc: "Embed live, interactive design files without leaving your workspace." },
      { title: "Zapier", desc: "Build automated workflows connecting Notely to 5,000+ other apps." }
    ],
    ctaTitle: "One workspace. Every tool connected.",
    ctaSub: "Start integrating in minutes."
  },
  "security": {
    seoTitle: "Enterprise Security & Compliance | Notely",
    seoDescription: "Protect company knowledge with encryption, permissions, backups, audit logs, and compliance trusted by modern teams.",
    icon: IconShield,
    themeColor: "#171717",
    tag: "SECURITY",
    heroHeading: "Enterprise-grade security built into every workspace.",
    heroDesc: "Protect company knowledge with encryption, permissions, backups, audit logs, and compliance trusted by modern teams.",
    primaryCta: "Read Security Docs",
    secondaryCta: "Talk to Sales",
    sectionTitle: "Security without compromise",
    sectionSubtitle: "Built for teams that take data protection seriously.",
    bullets: [
      "AES-256 encryption at rest",
      "TLS in transit",
      "SOC 2 Type II ready",
      "Single Sign-On (SSO)",
      "Granular role-based permissions",
      "Hourly automated backups",
      "Full audit logs",
      "Data export and portability"
    ],
    useCases: [
      { title: "AES-256 Encryption", desc: "Every document encrypted at rest and in transit." },
      { title: "SSO Authentication", desc: "Connect your existing identity provider with SAML 2.0." },
      { title: "Granular Permissions", desc: "Control access at workspace, folder, and document level." },
      { title: "Audit Logs", desc: "Know exactly who accessed or modified every document, when." }
    ],
    ctaTitle: "Trust starts with transparency.",
    ctaSub: "Read our full security documentation."
  }
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function ProductFeature() {
  const { slug } = useParams();
  const data = featureData[slug] || featureData["notes"];
  const Icon = data.icon;

  useEffect(() => {
    document.title = data.seoTitle;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = data.seoDescription;
  }, [data]);

  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-16 pb-12 overflow-hidden selection:bg-[#171717]/10">

      {/* Background Paper Texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-[1000px] mx-auto px-6 relative z-10">

        {/* ─── RETURN NAV ──────────────────────────────────────────── */}
        <div className="mb-12 border-b border-[#E8E5DF] inline-block">
          <Link to="/product" className="block pb-2 text-[12px] font-black text-[#A0A09A] hover:text-[#171717] uppercase tracking-[0.2em] font-mono transition-colors">
            ← All Features
          </Link>
        </div>

        {/* ─── HERO ────────────────────────────────────────────────── */}
        <div className="mb-24 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[linear-gradient(45deg,transparent_50%,#E8E5DF_50%)] opacity-30 pointer-events-none" />

          <div
            className="inline-flex items-center justify-center w-16 h-16 bg-white border border-[#E8E5DF] shadow-sm mb-6 rotate-[-2deg]"
            style={{ borderRadius: '14px' }}
          >
            <Icon className="w-8 h-8" style={{ color: data.themeColor }} />
          </div>

          <div className="mb-3">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#A0A09A] uppercase font-mono">{data.tag}</span>
          </div>

          <h1 className="text-[52px] md:text-[68px] font-black tracking-tight text-[#171717] leading-[1.04] mb-6 max-w-[820px]">
            {data.heroHeading}
          </h1>
          <p className="text-[19px] text-[#7A7870] font-medium leading-relaxed max-w-[620px] mb-10 font-serif">
            {data.heroDesc}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="relative group inline-block">
              <div className="absolute inset-0 bg-[#D97745] translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
              <div className="relative bg-[#171717] text-white border-2 border-[#171717] px-8 py-3 font-bold text-[15px] transition-transform group-active:translate-y-1 group-active:translate-x-1">
                {data.primaryCta}
              </div>
            </Link>
            <Link to="/contact" className="relative group inline-block">
              <div className="absolute inset-0 bg-[#E8E5DF] translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
              <div className="relative bg-[#FDFCF8] text-[#171717] border border-[#E8E5DF] px-8 py-3 font-bold text-[15px] transition-transform group-active:translate-y-1 group-active:translate-x-1">
                {data.secondaryCta}
              </div>
            </Link>
          </div>
        </div>

        {/* ─── WHY SECTION ─────────────────────────────────────────── */}
        <div className="mb-24">
          <div className="mb-10">
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717] leading-tight mb-3">
              {data.sectionTitle}
            </h2>
            <p className="text-[17px] text-[#7A7870] font-medium font-serif">{data.sectionSubtitle}</p>
          </div>

          {/* Bullet grid — 2 columns, handcrafted paper cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.bullets.map((b, idx) => {
              const rots = ['rotate-[-0.8deg]', 'rotate-[0.6deg]', 'rotate-[-0.4deg]', 'rotate-[0.8deg]'];
              return (
                <div
                  key={idx}
                  className={`bg-white border border-[#E8E5DF] px-5 py-4 shadow-sm flex items-center gap-4 ${rots[idx % 4]} hover:rotate-0 hover:shadow-md transition-all duration-200 group`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#F8F5EF] border border-[#E8E5DF] flex items-center justify-center shrink-0">
                    <IconCheck className="w-3.5 h-3.5 text-[#171717]" />
                  </div>
                  <span className="text-[14px] font-semibold text-[#3A3935] leading-snug">{b}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── USE CASES ───────────────────────────────────────────── */}
        <div className="mb-24">
          <h2 className="text-[28px] font-black tracking-tight text-[#171717] mb-8">How teams use it</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.useCases.map((uc, idx) => {
              const rots = ['rotate-[-1.5deg] mt-4', 'rotate-[1deg]', 'rotate-[1.5deg] mt-6', 'rotate-[-0.5deg] mt-2'];
              return (
                <div
                  key={idx}
                  className={`bg-[#FDFCF8] border border-[#E8E5DF] p-8 md:p-10 shadow-sm relative overflow-hidden group ${rots[idx % 4]} hover:rotate-0 hover:shadow-md transition-all duration-300`}
                >
                  <div className="absolute top-4 left-4 w-2.5 h-2.5 rounded-full bg-[#171717]/10 shadow-inner" />
                  <div className="pt-2">
                    <div className="text-[11px] font-black text-[#A0A09A] uppercase tracking-[0.2em] font-mono mb-3">{String(idx + 1).padStart(2, '0')}</div>
                    <h3 className="text-[20px] font-black tracking-tight text-[#171717] mb-2">{uc.title}</h3>
                    <p className="text-[15px] text-[#7A7870] font-medium leading-relaxed">{uc.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── FINAL CTA ───────────────────────────────────────────── */}
        <div className="bg-[#FDFCF8] border border-[#E8E5DF] p-12 md:p-20 shadow-sm rotate-[0.5deg] text-center relative overflow-hidden">
          <PaperClip className="absolute -top-3 right-8 w-7 h-7 text-[#171717] rotate-45" />
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(#171717 1px, transparent 1px)', backgroundSize: '100% 1.6rem', marginTop: '1.6rem' }}
          />
          <div className="relative z-10">
            <h2 className="text-[32px] md:text-[44px] font-black tracking-tight text-[#171717] leading-tight mb-3 font-serif">
              {data.ctaTitle}
            </h2>
            {data.ctaSub && (
              <p className="text-[16px] text-[#7A7870] font-medium mb-8">{data.ctaSub}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="relative group inline-block">
                <div className="absolute inset-0 bg-[#D97745] translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
                <div className="relative bg-[#171717] text-white border-2 border-[#171717] px-10 py-4 font-bold text-[16px] transition-transform group-active:translate-y-1 group-active:translate-x-1">
                  Start Free Workspace
                </div>
              </Link>
              <Link to="/contact" className="relative group inline-block">
                <div className="absolute inset-0 bg-[#E8E5DF] translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
                <div className="relative bg-[#FDFCF8] text-[#171717] border border-[#E8E5DF] px-10 py-4 font-bold text-[16px] transition-transform group-active:translate-y-1 group-active:translate-x-1">
                  Book a Live Demo
                </div>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
