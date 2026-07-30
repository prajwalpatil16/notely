import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  IconTerminal,
  IconPalette,
  IconBriefcase,
  IconBook,
  IconUsers,
  PaperClip,
  IconCheck
} from '../../components/CompanyIllustrations';

// Extra icons inline
const IconSparkle = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);
const IconLayers = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
const IconTarget = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IconPentagon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l9.5 6.9-3.6 11.1H6.1L2.5 8.9 12 2z" />
  </svg>
);
const IconTrendingUp = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────

const solutionData = {
  teams: {
    seoTitle: "Team Workspace & Knowledge Base | Notely",
    seoDescription: "Replace scattered documents and endless chat threads with one connected workspace where ideas become plans and knowledge never gets lost.",
    icon: IconUsers,
    themeColor: "#171717",
    tag: "FOR EVERY TEAM",
    heroHeading: "One workspace for everything your team builds.",
    heroDesc: "Replace scattered documents, endless chat threads, and outdated folders with one connected workspace where ideas become plans, projects stay organized, and knowledge never gets lost.",
    primaryCta: "Start Free Workspace",
    secondaryCta: "See Team Workspace",
    challengeTitle: "The challenge every growing team faces",
    challengeDesc: "Growing teams create thousands of documents, but finding the right information becomes harder every month. Notely keeps every meeting, roadmap, SOP, decision, and project in one organized place so everyone stays aligned.",
    useCases: [
      { title: "Team Meetings", desc: "Capture discussions, assign action items, and never lose important decisions." },
      { title: "Project Planning", desc: "Plan work with structured documents, timelines, and collaborative checklists." },
      { title: "Internal Wiki", desc: "Build a searchable company handbook that grows with your team." },
      { title: "Knowledge Sharing", desc: "Keep information accessible across departments without duplicate documents." }
    ],
    bullets: [
      "One source of truth",
      "Live collaboration",
      "AI-powered search",
      "Unlimited nested pages",
      "Secure sharing",
      "Beautiful documentation"
    ],
    quote: "\"Before Notely, every project lived in Slack, Google Docs, and random folders. Today, our entire company knows exactly where to find information.\"",
    quoteAuthor: "Sarah Mitchell",
    quoteRole: "Operations Manager, BrightLabs",
    ctaTitle: "Your team's knowledge deserves one home.",
    ctaSub: "Start collaborating today."
  },
  engineering: {
    seoTitle: "Engineering Documentation & Dev Workspace | Notely",
    seoDescription: "From architecture decisions and API documentation to sprint planning and deployment guides—keep engineering knowledge organized and searchable.",
    icon: IconTerminal,
    themeColor: "#171717",
    tag: "FOR ENGINEERING",
    heroHeading: "Documentation developers actually enjoy maintaining.",
    heroDesc: "From architecture decisions and API documentation to sprint planning and deployment guides, keep engineering knowledge organized and searchable so your team ships faster.",
    primaryCta: "Start Engineering Workspace",
    secondaryCta: "See Developer Features",
    challengeTitle: "Engineering knowledge gets lost",
    challengeDesc: "Every team has that wiki nobody updates, that Slack thread with the critical decision, and that README that was accurate six months ago. Notely makes documentation easy enough that engineers actually keep it current.",
    useCases: [
      { title: "Technical Documentation", desc: "Architecture, RFCs, onboarding guides, coding standards—all in one searchable place." },
      { title: "API Documentation", desc: "Beautiful, versioned API references with code examples developers trust." },
      { title: "Sprint Planning", desc: "Plan releases, manage backlogs, and document feature work in structured pages." },
      { title: "Incident Reports", desc: "Capture outages, postmortems, and lessons learned with linked context." }
    ],
    bullets: [
      "Markdown editor with live preview",
      "Code syntax highlighting",
      "Mermaid diagram support",
      "GitHub integration",
      "Version history on every doc",
      "AI code explanations"
    ],
    quote: "\"Notely replaced Confluence for us. Engineers actually write documentation now because it doesn't feel like a chore.\"",
    quoteAuthor: "James Park",
    quoteRole: "Engineering Lead, Synaptic",
    ctaTitle: "Ship code—not documentation headaches.",
    ctaSub: "Set up your engineering workspace in minutes."
  },
  marketing: {
    seoTitle: "Marketing Campaign Management & Content Planning | Notely",
    seoDescription: "Manage campaigns, content calendars, creative briefs, SEO strategies, and brand assets from one collaborative workspace.",
    icon: IconPalette,
    themeColor: "#D97745",
    tag: "FOR MARKETING",
    heroHeading: "Plan campaigns. Create content. Launch faster.",
    heroDesc: "Manage campaigns, content calendars, creative briefs, SEO strategies, and brand assets from one collaborative workspace where your entire marketing team stays in sync.",
    primaryCta: "Start Marketing Workspace",
    secondaryCta: "See Campaign Tools",
    challengeTitle: "Marketing teams work across too many tools",
    challengeDesc: "Campaigns live in Google Docs, briefs in email, assets in Dropbox, and feedback in Slack. Notely brings your entire marketing workflow into one connected space from strategy to performance report.",
    useCases: [
      { title: "Campaign Planning", desc: "Organize launches, timelines, and deliverables in one structured workspace." },
      { title: "Content Calendar", desc: "Plan blogs, newsletters, social media, and podcasts with shared visibility." },
      { title: "Brand Guidelines", desc: "Store logos, messaging, tone of voice, and design systems every team can find." },
      { title: "Creative Approvals", desc: "Collect feedback with inline comments and resolve suggestions before launch." }
    ],
    bullets: [
      "Campaign brief templates",
      "Content calendar views",
      "Brand asset storage",
      "Real-time copy review",
      "Public sharing with agencies",
      "Performance documentation"
    ],
    quote: "\"Every campaign now lives in one place instead of twenty tabs. Our launch speed doubled in six months.\"",
    quoteAuthor: "Priya Sharma",
    quoteRole: "Head of Marketing, Waverly",
    ctaTitle: "Keep your entire marketing team in sync.",
    ctaSub: "From first brief to final report."
  },
  hr: {
    seoTitle: "HR Onboarding, Policies & Internal Wiki | Notely",
    seoDescription: "Centralize employee onboarding, HR policies, operational playbooks, hiring documentation, and company knowledge in one searchable workspace.",
    icon: IconBriefcase,
    themeColor: "#4D7C5A",
    tag: "FOR HR & OPERATIONS",
    heroHeading: "Build a workplace everyone can navigate.",
    heroDesc: "Centralize employee onboarding, HR policies, operational playbooks, hiring documentation, and company knowledge so every employee finds what they need on day one.",
    primaryCta: "Start HR Workspace",
    secondaryCta: "See HR Features",
    challengeTitle: "New hires shouldn't spend their first week searching",
    challengeDesc: "When policies live in email, onboarding in spreadsheets, and culture in people's heads, every new employee starts from scratch. Notely gives HR teams a home for everything the company needs to run.",
    useCases: [
      { title: "Employee Handbook", desc: "One always-current document every employee can access from day one." },
      { title: "Onboarding Checklist", desc: "Step-by-step onboarding flows that new hires complete themselves." },
      { title: "Hiring Pipeline", desc: "Structured interview notes, scorecards, and hiring decisions in one place." },
      { title: "Internal Policies", desc: "Version-controlled policies with full audit history and acknowledgment tracking." }
    ],
    bullets: [
      "Role-based access controls",
      "Private employee documents",
      "Full audit logs",
      "Version history on policies",
      "SSO authentication",
      "Embedded training videos"
    ],
    quote: "\"New hires now complete onboarding in two days instead of two weeks. Everything they need is exactly where it should be.\"",
    quoteAuthor: "Amelia Torres",
    quoteRole: "People Operations Lead, Crestview",
    ctaTitle: "Create a better employee experience.",
    ctaSub: "Starting from their very first day."
  },
  education: {
    seoTitle: "Education Workspace, Classrooms & Research | Notely",
    seoDescription: "Build digital classrooms, organize research, collaborate with students, and manage lecture notes from one modern workspace.",
    icon: IconBook,
    themeColor: "#171717",
    tag: "FOR EDUCATION",
    heroHeading: "Learning deserves better organization.",
    heroDesc: "Build digital classrooms, organize research, collaborate with students, and manage lecture notes from one modern workspace built for teachers, professors, and researchers.",
    primaryCta: "Start Education Workspace",
    secondaryCta: "See Classroom Features",
    challengeTitle: "Knowledge gets lost between courses",
    challengeDesc: "Lecture notes in Google Docs, assignments in email, research in scattered folders. Notely gives educators and students one organized space where learning builds on itself semester after semester.",
    useCases: [
      { title: "Course Materials", desc: "Organize lectures, readings, and resources by course and module." },
      { title: "Lecture Notes", desc: "Shared notebooks every student can access, annotate, and build on." },
      { title: "Research Projects", desc: "Organize findings, citations, and collaborators in structured workspaces." },
      { title: "Study Groups", desc: "Dedicated spaces where groups collaborate on assignments and projects." }
    ],
    bullets: [
      "LaTeX equation support",
      "PDF export for assignments",
      "Group collaboration workspaces",
      "Citation and reference linking",
      "Guest access for students",
      "Version history on drafts"
    ],
    quote: "\"My students produce better research because they have a structured place to think out loud and collaborate before writing their final papers.\"",
    quoteAuthor: "Dr. Rachel Kim",
    quoteRole: "Associate Professor, Northgate University",
    ctaTitle: "Build classrooms that never lose knowledge.",
    ctaSub: "From first lecture to final thesis."
  },
  product: {
    seoTitle: "Product Management Workspace & Roadmaps | Notely",
    seoDescription: "Manage roadmaps, feature specifications, customer feedback, release notes, and product documentation in one connected workspace.",
    icon: IconTarget,
    themeColor: "#D97745",
    tag: "FOR PRODUCT",
    heroHeading: "Everything your product team needs.",
    heroDesc: "Manage roadmaps, feature specifications, customer feedback, release notes, and product documentation in one connected workspace from idea to launch.",
    primaryCta: "Start Product Workspace",
    secondaryCta: "See PM Features",
    challengeTitle: "Product decisions get scattered",
    challengeDesc: "Feature specs in Notion, roadmaps in slides, feedback in email, and decisions in Slack. By the time development starts, context is already lost. Notely keeps the entire product lifecycle in one place.",
    useCases: [
      { title: "Product Specs", desc: "Write detailed feature specifications that engineering teams actually read and trust." },
      { title: "Roadmaps", desc: "Document strategy, milestones, and priorities in structured, shareable pages." },
      { title: "User Research", desc: "Organize customer interviews, feedback themes, and insights that inform decisions." },
      { title: "Release Notes", desc: "Draft and publish release notes that keep customers and teams informed." }
    ],
    bullets: [
      "Product spec templates",
      "Roadmap documentation",
      "Customer feedback organization",
      "Feature request tracking",
      "Release planning pages",
      "Stakeholder sharing controls"
    ],
    quote: "\"Our PMs and engineers finally work from the same source of truth. Miscommunication on feature scope dropped by 80%.\"",
    quoteAuthor: "Marcus Liu",
    quoteRole: "VP of Product, Fieldstone",
    ctaTitle: "Build products with clarity.",
    ctaSub: "Every decision documented. Every team aligned."
  },
  design: {
    seoTitle: "Design Team Documentation & System Wikis | Notely",
    seoDescription: "Document components, UX research, design principles, accessibility guidelines, and creative decisions in one collaborative space.",
    icon: IconPalette,
    themeColor: "#D97745",
    tag: "FOR DESIGN",
    heroHeading: "Design systems deserve documentation.",
    heroDesc: "Document components, UX research, design principles, accessibility guidelines, and creative decisions in one collaborative space that keeps designers and developers aligned.",
    primaryCta: "Start Design Workspace",
    secondaryCta: "See Design Features",
    challengeTitle: "Design decisions get undocumented",
    challengeDesc: "When the reasoning behind design choices lives only in people's heads, the same debates happen again and again. Notely gives design teams a structured place to capture research, decisions, and standards.",
    useCases: [
      { title: "Component Library", desc: "Document every component with usage rules, variants, and examples." },
      { title: "Design Tokens", desc: "Maintain a living record of colors, spacing, typography, and animation." },
      { title: "UX Research", desc: "Organize user interviews, personas, journey maps, and usability findings." },
      { title: "Design Reviews", desc: "Collect structured feedback with inline comments before Figma handoff." }
    ],
    bullets: [
      "Figma embed integration",
      "Component documentation",
      "Design token glossaries",
      "User persona templates",
      "Accessibility guidelines",
      "Developer handoff notes"
    ],
    quote: "\"Our engineers stopped asking 'why did we design it this way?' because every decision is documented with context.\"",
    quoteAuthor: "Nina Okafor",
    quoteRole: "Lead Designer, Skyforge",
    ctaTitle: "Keep designers and developers aligned.",
    ctaSub: "Document once. Reference forever."
  },
  startups: {
    seoTitle: "Startup Workspace & Knowledge Management | Notely",
    seoDescription: "From your first customer to your first hundred employees, Notely grows alongside your startup with structured documentation and AI-powered knowledge management.",
    icon: IconTrendingUp,
    themeColor: "#D97745",
    tag: "FOR STARTUPS",
    heroHeading: "Move fast without losing knowledge.",
    heroDesc: "From your first customer to your first hundred employees, Notely grows alongside your startup with structured documentation and AI-powered knowledge management.",
    primaryCta: "Start Free Workspace",
    secondaryCta: "See Startup Features",
    challengeTitle: "Startups move fast and lose context",
    challengeDesc: "In early-stage companies, critical decisions happen in Slack, product specs live in someone's Notion, and investor updates get written from memory. Notely gives startups a structured foundation from day one.",
    useCases: [
      { title: "Company Wiki", desc: "Document how your startup operates so every hire ramps up in days, not months." },
      { title: "Investor Updates", desc: "Write clear, structured investor updates that build confidence and trust." },
      { title: "OKRs & Goals", desc: "Keep the entire company aligned on what matters this quarter." },
      { title: "Hiring Documentation", desc: "Standardize interviews, scorecards, and onboarding before you need to scale fast." }
    ],
    bullets: [
      "Free to start, scales with you",
      "Company wiki templates",
      "Investor update templates",
      "OKR tracking pages",
      "Rapid onboarding flows",
      "AI-powered writing assistance"
    ],
    quote: "\"We built our entire company operating system in Notely before we hit 10 employees. It scaled perfectly to 80.\"",
    quoteAuthor: "David Chen",
    quoteRole: "Co-founder & CEO, Meridian",
    ctaTitle: "Build smarter from day one.",
    ctaSub: "Start free. No credit card required."
  },
  "customer-success": {
    seoTitle: "Customer Success Documentation & Playbooks | Notely",
    seoDescription: "Keep onboarding guides, implementation playbooks, support documentation, and customer knowledge organized for every account.",
    icon: IconSparkle,
    themeColor: "#4D7C5A",
    tag: "FOR CUSTOMER SUCCESS",
    heroHeading: "Deliver exceptional customer experiences.",
    heroDesc: "Keep onboarding guides, implementation playbooks, support documentation, and customer knowledge organized so every customer gets the same great experience.",
    primaryCta: "Start CS Workspace",
    secondaryCta: "See CS Features",
    challengeTitle: "Customer knowledge lives with individuals, not teams",
    challengeDesc: "When onboarding playbooks exist only in one CSM's head, and customer context lives in email threads, every escalation is harder than it needs to be. Notely gives customer success teams structured, searchable knowledge.",
    useCases: [
      { title: "Onboarding Guides", desc: "Structured, step-by-step onboarding that delivers consistent customer experiences." },
      { title: "Implementation Playbooks", desc: "Repeatable processes that ensure every customer implementation succeeds." },
      { title: "Support Documentation", desc: "Searchable answers that reduce tickets and improve self-service." },
      { title: "Account Notes", desc: "Organized customer history, decisions, and context accessible to the whole team." }
    ],
    bullets: [
      "Customer onboarding templates",
      "Implementation checklists",
      "Internal support wiki",
      "Account-level documentation",
      "Shared customer knowledge",
      "Renewal and expansion notes"
    ],
    quote: "\"Every CSM now onboards customers the same way. Churn dropped because consistency improved.\"",
    quoteAuthor: "Leila Hassan",
    quoteRole: "Director of Customer Success, Pulsar",
    ctaTitle: "Turn documentation into customer success.",
    ctaSub: "Consistent experiences start with organized knowledge."
  },
  sales: {
    seoTitle: "Sales Playbooks & Battle Cards | Notely",
    seoDescription: "Keep proposals, battle cards, product documentation, pricing guides, and sales playbooks available whenever your team needs them.",
    icon: IconLayers,
    themeColor: "#171717",
    tag: "FOR SALES",
    heroHeading: "Close deals with confidence.",
    heroDesc: "Keep proposals, battle cards, product documentation, pricing guides, and sales playbooks available whenever your team needs them—searchable, up-to-date, and always accessible.",
    primaryCta: "Start Sales Workspace",
    secondaryCta: "See Sales Features",
    challengeTitle: "Reps shouldn't hunt for information during a deal",
    challengeDesc: "When pricing lives in email, battle cards in a shared drive, and objection handling in someone's memory, every rep performs differently. Notely gives sales teams structured, searchable resources that close more deals.",
    useCases: [
      { title: "Sales Playbooks", desc: "Proven processes and scripts every rep can follow and improve." },
      { title: "Battle Cards", desc: "Up-to-date competitive intelligence organized by competitor and objection." },
      { title: "Proposal Templates", desc: "Professional, consistent proposals reps can customize and send quickly." },
      { title: "Pricing Documentation", desc: "Current pricing, discounting rules, and packaging in one searchable place." }
    ],
    bullets: [
      "Sales playbook templates",
      "Competitive battle cards",
      "Proposal template library",
      "Pricing and packaging docs",
      "Customer story library",
      "Demo script repository"
    ],
    quote: "\"New reps now ramp in three weeks instead of three months. Everything they need is in Notely.\"",
    quoteAuthor: "Tom Bradley",
    quoteRole: "VP of Sales, Harborview",
    ctaTitle: "Equip every salesperson with the right information.",
    ctaSub: "Organized knowledge closes more deals."
  }
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function SolutionPage() {
  const { slug } = useParams();
  const data = solutionData[slug] || solutionData['teams'];
  const Icon = data.icon;

  useEffect(() => {
    document.title = data.seoTitle;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = data.seoDescription;
  }, [data]);

  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-16 pb-12 overflow-hidden selection:bg-[#171717]/10">

      {/* Background Texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-[1000px] mx-auto px-6 relative z-10 animate-in fade-in duration-300">

        {/* ─── RETURN NAV ──────────────────────────────────────── */}
        <div className="mb-12 border-b border-[#E8E5DF] inline-block">
          <Link to="/solutions" className="block pb-2 text-[12px] font-black text-[#A0A09A] hover:text-[#171717] uppercase tracking-[0.2em] font-mono transition-colors">
            ← All Solutions
          </Link>
        </div>

        {/* ─── HERO ────────────────────────────────────────────── */}
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

          <h1 className="text-[50px] md:text-[66px] font-black tracking-tight text-[#171717] leading-[1.04] mb-6 max-w-[820px]">
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

        {/* ─── CHALLENGE SECTION ───────────────────────────────── */}
        <div className="mb-24">
          <div className="bg-white border border-[#E8E5DF] p-10 md:p-12 shadow-sm rotate-[0.4deg] relative">
            <div className="absolute top-5 left-5 w-2.5 h-2.5 rounded-full bg-[#171717]/10" />
            <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-[#171717]/10" />
            <p className="text-[11px] font-black tracking-[0.25em] text-[#A0A09A] uppercase font-mono mb-4">{data.challengeTitle}</p>
            <p className="text-[18px] text-[#3A3935] font-medium leading-relaxed font-serif max-w-[720px]">
              {data.challengeDesc}
            </p>
          </div>
        </div>

        {/* ─── USE CASES ───────────────────────────────────────── */}
        <div className="mb-24">
          <h2 className="text-[30px] md:text-[38px] font-black tracking-tight text-[#171717] mb-8">
            Built for everyday work
          </h2>
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

        {/* ─── FEATURE BULLETS ─────────────────────────────────── */}
        <div className="mb-24">
          <h2 className="text-[28px] font-black tracking-tight text-[#171717] mb-6">Why teams switch to Notely</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.bullets.map((b, idx) => {
              const rots = ['rotate-[-0.8deg]', 'rotate-[0.6deg]', 'rotate-[-0.4deg]', 'rotate-[0.8deg]'];
              return (
                <div
                  key={idx}
                  className={`bg-white border border-[#E8E5DF] px-5 py-4 shadow-sm flex items-center gap-4 ${rots[idx % 4]} hover:rotate-0 hover:shadow-md transition-all duration-200`}
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

        {/* ─── CUSTOMER QUOTE ──────────────────────────────────── */}
        {data.quote && (
          <div className="mb-24">
            <div className="bg-[#FDFCF8] border border-[#E8E5DF] p-12 shadow-sm rotate-[1deg] relative">
              <PaperClip className="absolute -top-3 left-8 w-7 h-7 text-[#171717] rotate-45" />
              <blockquote className="text-[22px] md:text-[28px] font-black tracking-tight text-[#171717] leading-snug mb-6 font-serif">
                {data.quote}
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-black text-[14px]">
                  {data.quoteAuthor?.[0]}
                </div>
                <div>
                  <div className="text-[14px] font-black text-[#171717]">{data.quoteAuthor}</div>
                  <div className="text-[12px] text-[#A0A09A] font-medium">{data.quoteRole}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── FINAL CTA ───────────────────────────────────────── */}
        <div className="bg-[#FDFCF8] border border-[#E8E5DF] p-12 md:p-20 shadow-sm rotate-[0.5deg] text-center relative overflow-hidden">
          <PaperClip className="absolute -top-3 right-8 w-7 h-7 text-[#171717] rotate-45" />
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(#171717 1px, transparent 1px)', backgroundSize: '100% 1.6rem', marginTop: '1.6rem' }}
          />
          <div className="relative z-10">
            <h2 className="text-[30px] md:text-[44px] font-black tracking-tight text-[#171717] leading-tight mb-3 font-serif">
              Ready to transform how your team works?
            </h2>
            <p className="text-[16px] text-[#7A7870] font-medium mb-2">
              {data.ctaTitle}
            </p>
            {data.ctaSub && (
              <p className="text-[15px] text-[#A0A09A] font-medium mb-8">{data.ctaSub}</p>
            )}
            {!data.ctaSub && <div className="mb-8" />}
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
