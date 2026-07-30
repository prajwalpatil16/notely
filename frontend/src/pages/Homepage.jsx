import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- CUSTOM HAND-DRAWN PAPER CIVILIZATION SVGS (2.5px stroke outline, warm theme) ---

export const IconSprout = ({ className = "w-6 h-6 text-[#4D7C5A]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* Base folded card card seed */}
    <path d="M6 16 L18 16 L18 21 L6 21 Z" fill="#FFFFFF" stroke="#171717" />
    <path d="M6 16 L12 19 L18 16" stroke="#171717" />
    {/* Sprout stem & leaves */}
    <path d="M12 16 L12 8 Q15 6 17 8 Q15 11 12 9" fill="#4D7C5A" stroke="#171717" />
    <path d="M12 12 Q9 9 7 11 Q9 14 12 12" fill="#4D7C5A" stroke="#171717" />
    
    {/* Minimal Expressive Face */}
    <circle cx="10" cy="18.5" r="0.75" fill="#171717" />
    <circle cx="14" cy="18.5" r="0.75" fill="#171717" />
  </svg>
);

export const IconOwl = ({ className = "w-6 h-6 text-[#E8B44C]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* Geometric folded owl body */}
    <path d="M12 3 L18 8 L18 19 L6 19 L6 8 Z" fill="#FFFFFF" stroke="#171717" />
    {/* Shaded belly fold */}
    <path d="M6 13 L12 19 L18 13" stroke="#171717" />
    {/* Wings */}
    <path d="M6 8 L3 12 L6 16" stroke="#171717" />
    <path d="M18 8 L21 12 L18 16" stroke="#171717" />
    {/* Eyes & glasses */}
    <circle cx="9" cy="9" r="2.5" stroke="#171717" fill="none" />
    <circle cx="15" cy="9" r="2.5" stroke="#171717" fill="none" />
    <path d="M11.5 9 L12.5 9" stroke="#171717" />
    <polygon points="12,11 11,13 13,13" fill="#E8B44C" stroke="#171717" />
  </svg>
);

export const IconCrane = ({ className = "w-6 h-6 text-[#7FB3D5]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* Wing Right */}
    <path d="M12 11 L20 4 L15 13 Z" fill="#FFFFFF" stroke="#171717" />
    {/* Wing Left */}
    <path d="M12 11 L4 4 L9 13 Z" fill="#F5F3EB" stroke="#171717" />
    {/* Body Tail */}
    <path d="M12 11 L12 20 L10 14 Z" fill="#7FB3D5" stroke="#171717" />
    {/* Head/Beak */}
    <path d="M12 11 L15 8 L12 7 Z" fill="#D97745" stroke="#171717" />
    <circle cx="13" cy="9" r="0.5" fill="#171717" />
  </svg>
);

export const IconExplorer = ({ className = "w-6 h-6 text-[#D97745]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* Explorer hat */}
    <path d="M6 9 Q12 4 18 9" stroke="#171717" fill="#D97745" />
    <path d="M4 9 L20 9" stroke="#171717" />
    {/* Round face */}
    <circle cx="12" cy="14" r="4" fill="#FFFFFF" stroke="#171717" />
    <circle cx="10.5" cy="13.5" r="0.75" fill="#171717" />
    <circle cx="13.5" cy="13.5" r="0.75" fill="#171717" />
    <path d="M11 15.5 Q12 16.5 13 15.5" stroke="#171717" fill="none" />
    {/* Lantern */}
    <path d="M17 12 L19 12 L19 17 L17 17 Z" fill="#E8B44C" stroke="#171717" />
    <path d="M18 10 L18 12" stroke="#171717" />
  </svg>
);

export const IconBlueprint = ({ className = "w-6 h-6 text-[#FAF8F3]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 3 L20 7 L8 19 L4 19 L4 15 Z" fill="#FAF8F3" stroke="#171717" />
    <path d="M7 16 L11 20" stroke="#171717" />
    {/* Grid line marks */}
    <path d="M10 6 L12 8 M12 4 L14 6" stroke="#171717" strokeWidth="1.5" />
  </svg>
);

export const IconPaperCity = ({ className = "w-6 h-6 text-[#8A8A8A]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 21 L3 12 L8 8 L13 12 L13 21 Z" fill="#FFFFFF" stroke="#171717" />
    <path d="M13 21 L13 10 L17 7 L21 10 L21 21 Z" fill="#F5F3EB" stroke="#171717" />
    <rect x="6" y="14" width="3" height="4" stroke="#171717" />
    <rect x="15" y="13" width="3" height="5" stroke="#171717" />
  </svg>
);

// --- FLOATING RETRO BUBBLE MASCOTS ---

const MascotBubble = ({ children, className = "" }) => (
  <motion.div 
    animate={{ y: [-8, 8] }}
    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    className={`bg-[#FAF8F3] border-2 border-[#171717] rounded-full p-2.5 shadow-[4px_4px_0px_#171717] flex items-center justify-center pointer-events-none select-none ${className}`}
  >
    {children}
  </motion.div>
);

export default function Homepage() {
  const [activeTab, setActiveTab] = useState('editor');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [typedText, setTypedText] = useState('');
  const fullText = "Sprouty is cataloging notes guidelines within the database...";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        setTimeout(() => {
          setTypedText('');
          index = 0;
        }, 3000);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const plans = [
    {
      name: "Starter",
      price: 0,
      desc: "For small teams organizing initial checklists and drafts.",
      cta: "Get Started Free",
      features: [
        "Unlimited workspace notes",
        "Up to 5 active collaborators",
        "Standard search index speed",
        "100 MB total file storage"
      ]
    },
    {
      name: "Pro",
      price: billingPeriod === 'monthly' ? 8 : 6,
      desc: "Complete documentation system for growing teams.",
      cta: "Upgrade to Pro",
      highlight: true,
      features: [
        "Unlimited members & editors",
        "Instant workspace indexing",
        "30-day version history log",
        "10 GB storage per member"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For compliance, advanced security, and dedicated clusters.",
      cta: "Contact Sales",
      features: [
        "SAML SSO & Okta directory synch",
        "Unlimited version history logs",
        "Dedicated database clusters",
        "Custom service level SLAs"
      ]
    }
  ];

  return (
    <div className="bg-[#FAF8F3] text-[#171717] font-sans antialiased selection:bg-[#D97745]/10 selection:text-[#D97745] space-y-16 pb-12 relative overflow-hidden">
      
      {/* Delicate grid background overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-grid-pattern bg-[size:20px_20px]" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D97745]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* SECTION 1: HERO — Sky & The Paper Island */}
      <section className="max-w-[1440px] mx-auto px-6 pt-10 text-center flex flex-col items-center space-y-8 select-none relative">
        


        {/* Overlapping Paper Mascot Circles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center justify-center -space-x-3 pt-2 select-none"
        >
          <div className="w-14 h-14 rounded-full bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center z-10">
            <IconSprout className="w-7 h-7" />
          </div>
          <div className="w-14 h-14 rounded-full bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center z-20">
            <IconOwl className="w-7 h-7" />
          </div>
          <div className="w-14 h-14 rounded-full bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center z-30">
            <IconCrane className="w-7 h-7" />
          </div>
          <div className="w-14 h-14 rounded-full bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center z-20">
            <IconExplorer className="w-7 h-7" />
          </div>
          <div className="w-14 h-14 rounded-full bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center z-10">
            <IconBlueprint className="w-7 h-7" />
          </div>
        </motion.div>

        {/* Confident 80px H1 headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-8xl font-black tracking-tight leading-[1.02] text-[#171717] max-w-4xl"
        >
          Architecting team <br />
          <span className="text-[#4D7C5A]">knowledge.</span>
        </motion.h1>

        {/* H1 description text */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-[20px] text-[#5B5B5B] max-w-xl leading-relaxed"
        >
          A paper-inspired collaborative environment built for speed, outlines organization, and documentation precision.
        </motion.p>

        {/* Action buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-3 z-10"
        >
          <Link to="/register" className="px-6 py-3.5 bg-[#D97745] hover:bg-[#C25C2B] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#D97745]/15 hover:scale-[1.01] active:scale-[0.99]">
            Start Free Workspace
          </Link>
          <Link to="/pricing" className="px-6 py-3.5 border border-[#E8E8E4] hover:border-[#171717] text-[#171717] font-bold rounded-xl text-xs bg-white hover:bg-neutral-50 transition-all shadow-sm">
            Explore pricing
          </Link>
        </motion.div>

        {/* Greyscale corporate logs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-3xl flex flex-wrap justify-center items-center gap-x-12 gap-y-6 pt-6 opacity-30 text-xs font-black uppercase tracking-widest text-[#5B5B5B] font-mono select-none"
        >
          <span>OpenAI</span>
          <span>Figma</span>
          <span>Ramp</span>
          <span>Cursor</span>
          <span>Vercel</span>
          <span>Apple</span>
        </motion.div>

        {/* THE PAPER CIVILIZATION INTERACTIVE WORKSPACE MOCKUP WITH POPPING EDGE MASCOTS */}
        <div className="relative w-full max-w-5xl mt-12 select-none">
          {/* Popping edge mascots */}
          <MascotBubble className="absolute left-[-28px] top-[14%] w-14 h-14 z-40 hidden md:flex">
            <IconSprout className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#171717] shadow-sm">2</span>
          </MascotBubble>
          <MascotBubble className="absolute left-[-28px] top-[48%] w-14 h-14 z-40 hidden md:flex">
            <IconCrane className="w-8 h-8" />
            <span className="absolute -bottom-2 -right-2 bg-[#7FB3D5] text-[#171717] text-[10px] font-black px-1 py-0.5 rounded border border-[#171717] shadow-sm">Sarah</span>
          </MascotBubble>
          <MascotBubble className="absolute right-[-28px] top-[18%] w-14 h-14 z-40 hidden md:flex">
            <IconOwl className="w-8 h-8" />
            <span className="absolute -top-2 -left-2 bg-[#D97745] text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg border border-[#171717] shadow-sm">AI</span>
          </MascotBubble>
          <MascotBubble className="absolute right-[-28px] top-[55%] w-14 h-14 z-40 hidden md:flex">
            <IconExplorer className="w-8 h-8" />
            <span className="absolute -top-2 -right-2 bg-[#E8B44C] text-[#171717] text-[11px] w-5 h-5 rounded-full flex items-center justify-center border border-[#171717] shadow-sm">💡</span>
          </MascotBubble>
          <MascotBubble className="absolute right-[40px] bottom-[-24px] w-14 h-14 z-40 hidden md:flex">
            <IconBlueprint className="w-8 h-8" />
          </MascotBubble>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="w-full bg-white border border-[#E8E8E4] rounded-2xl shadow-xl overflow-hidden aspect-[16/9] flex flex-col"
          >
            {/* Header toolbar */}
            <div className="flex items-center justify-between border-b border-[#E8E8E4] px-4 py-3 bg-neutral-50 select-none">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200 border" />
                <span className="w-3 h-3 rounded-full bg-slate-200 border" />
                <span className="w-3 h-3 rounded-full bg-slate-200 border" />
              </div>
              <div className="flex items-center gap-2 border border-[#E8E8E4] rounded-lg px-2.5 py-0.5 bg-white text-[13px] font-semibold text-[#5B5B5B]">
                <IconSprout className="w-3.5 h-3.5" />
                <span>seedlings_outline.md</span>
              </div>
              <div className="w-10" />
            </div>

            {/* Editor split workspace */}
            <div className="grid grid-cols-12 flex-grow overflow-hidden text-left">
              {/* Sidebar directories */}
              <div className="col-span-3 border-r border-[#E8E8E4] bg-[#F5F3EB] p-4 space-y-4 hidden md:block select-none font-semibold">
                <div className="space-y-1.5">
                  <span className="text-[12px] font-black text-[#5B5B5B] uppercase tracking-wider font-mono">Paper Outlines</span>
                  <div className="space-y-1 text-xs text-[#171717]">
                    <div className="flex items-center gap-2 p-1.5 bg-white border border-[#E8E8E4] rounded-lg text-[#D97745]">
                      <IconSprout className="w-4 h-4" /> <span>Specs Outlines</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg">
                      <IconPaperCity className="w-4 h-4" /> <span>Hiring Village</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg">
                      <IconCrane className="w-4 h-4" /> <span>Crane Messengers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document board content & live comments */}
              <div className="col-span-12 md:col-span-9 p-6 sm:p-8 space-y-6 flex flex-col justify-between overflow-y-auto relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E8E8E4] pb-3">
                    <h3 className="text-xl font-bold text-[#171717] flex items-center gap-2">
                      <IconSprout className="w-5 h-5" /> Document Seed Canvas
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4D7C5A]" />
                      <span className="text-[12px] font-bold text-slate-400 font-mono">Active</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-[16px] text-[#5B5B5B] font-medium leading-relaxed">
                    <p className="font-bold text-[#171717] font-mono"># Outline check list</p>
                    
                    {/* Real-time typing simulator container */}
                    <div className="flex items-center gap-1 bg-[#F5F3EB] p-3 rounded-lg border border-[#E8E8E4] text-[#171717] font-mono text-xs max-w-2xl relative">
                      <span className="text-[#4D7C5A] font-bold">$</span>
                      <span>{typedText || " "}</span>
                      <span className="w-1.5 h-4.5 bg-[#D97745] animate-pulse" />
                      
                      <span className="absolute right-3 top-[-10px] bg-[#D97745] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        Sprouty (Notes)
                      </span>
                    </div>

                    <p>Checklist parameters:</p>
                    <ul className="space-y-2 text-xs font-semibold">
                      <li className="flex items-center gap-2"><span className="w-4 h-4 border border-[#E8E8E4] rounded flex items-center justify-center text-[#4D7C5A]">✓</span> Launch document seeds configuration.</li>
                      <li className="flex items-center gap-2"><span className="w-4 h-4 border border-[#E8E8E4] rounded" /> Distribute pages template blueprints.</li>
                    </ul>
                  </div>
                </div>

                {/* Collaborative Comment box thread */}
                <div className="p-3.5 bg-[#F5F3EB] border border-[#E8E8E4] rounded-xl max-w-sm space-y-1.5 relative self-end shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7FB3D5]" />
                    <p className="text-[12px] text-slate-450 font-bold font-mono">Crane Messenger • Just now</p>
                  </div>
                  <p className="text-xs font-bold text-[#171717]">"Seedling setup logged. Forwarding revisions."</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </section>

      {/* SECTION 2: THE ORIGAMI LAB (AI & Wisdom - Left Text, Right Interactive) */}
      <section className="max-w-[1440px] mx-auto px-6 space-y-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 space-y-6 text-left">
            <span className="text-[13px] font-black uppercase text-[#D97745] tracking-widest font-mono">Knowledge Lab</span>
            <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight leading-tight text-[#171717]">
              Smart indexing with Origami Owls.
            </h2>
            <p className="text-[17px] sm:text-base text-[#5B5B5B] leading-relaxed">
              Notely's semantic queries run on clean code layers. Ask the Origami Owl to categorize notes guidelines, extract outline variables, and compile tags lists instantly.
            </p>
            <div className="pt-2">
              <Link to="/solutions/engineering" className="text-xs font-bold text-[#D97745] hover:underline flex items-center gap-1">
                Explore Origami Owl systems →
              </Link>
            </div>
          </div>

          {/* Owl interactive widget */}
          <div className="md:col-span-7 border border-[#E8E8E4] bg-white rounded-2xl p-6 shadow-sm aspect-[16/10] flex flex-col justify-between text-left">
            <div className="flex items-center justify-between border-b pb-3 text-xs font-mono text-slate-450 select-none">
              <span>ORIGAMI_OWL_INTELLIGENCE</span>
              <span className="text-[#4D7C5A]">CONNECTED</span>
            </div>
            <div className="space-y-4 flex-grow flex items-center gap-6 p-4">
              <IconOwl className="w-16 h-16 text-[#E8B44C]" />
              <div className="space-y-2 flex-grow">
                <div className="p-3 bg-[#F5F3EB] border rounded-lg text-xs font-bold text-[#171717]">
                  "Evaluating checklist variables... found 2 missing tags parameters."
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-[#EDF3EE] text-[#4D7C5A] text-[11px] font-black rounded uppercase">#engineering</span>
                  <span className="px-2 py-0.5 bg-[#EDF3EE] text-[#4D7C5A] text-[11px] font-black rounded uppercase">#milestone</span>
                </div>
              </div>
            </div>
            <div className="text-[12px] font-mono text-slate-400 pt-2 border-t select-none">
              Accuracy rate: 99.4%
            </div>
          </div>
        </div>

        {/* SECTION 3: THE SEARCH EXPEDITION (Search - Right Text, Left Interactive) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 md:order-last space-y-6 text-left">
            <span className="text-[13px] font-black uppercase text-[#4D7C5A] tracking-widest font-mono">Fuzzy Index Queries</span>
            <h2 className="text-3xl sm:text-[44px] font-extrabold tracking-tight leading-tight text-[#171717]">
              The Explorer scans outline roots.
            </h2>
            <p className="text-[17px] sm:text-base text-[#5B5B5B] leading-relaxed">
              Find files, templates, tags, or discussion comment parameters instantly. The Search Explorer traverses nested folder paths in milliseconds.
            </p>
            <div className="pt-2">
              <Link to="/product/search" className="text-xs font-bold text-[#4D7C5A] hover:underline flex items-center gap-1">
                How index queries work →
              </Link>
            </div>
          </div>

          {/* Explorer interactive search widget */}
          <div className="md:col-span-5 border border-[#E8E8E4] bg-white rounded-2xl p-6 shadow-sm aspect-[16/10] flex flex-col justify-between text-left">
            <div className="flex items-center gap-2 border-b pb-3 select-none">
              <IconExplorer className="w-5 h-5 text-[#D97745]" />
              <input type="text" readOnly value="specifications" className="bg-[#F5F3EB] border rounded px-2.5 py-0.5 text-xs font-semibold text-[#171717] focus:outline-none" />
            </div>
            <div className="space-y-2 flex-grow pt-4">
              <div className="p-2 bg-neutral-50 border rounded-lg">
                <p className="text-xs font-bold text-[#171717]">📌 dev_specifications.md</p>
                <p className="text-[12px] text-slate-400 mt-0.5">Found in: Engineering Village</p>
              </div>
              <div className="p-2 bg-neutral-50 border rounded-lg opacity-60">
                <p className="text-xs font-bold text-[#171717]">📌 templates_specifications.md</p>
                <p className="text-[12px] text-slate-400 mt-0.5">Found in: Templates Archives</p>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 select-none">
              Query completed in 1.2ms
            </div>
          </div>
        </div>

      </section>

      {/* SECTION 4: THE MARKETPLACE (Pricing Cards) */}
      <section className="max-w-[1440px] mx-auto px-6 space-y-16">
        <div className="text-center space-y-4 max-w-xl mx-auto select-none">
          <span className="text-[13px] font-black uppercase text-[#D97745] tracking-widest font-mono">Marketplace</span>
          <h2 className="text-3xl sm:text-[58px] font-extrabold tracking-tight text-[#171717] leading-tight">
            Plans built to scale.
          </h2>
          
          <div className="flex justify-center gap-2 pt-2">
            <button 
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${billingPeriod === 'monthly' ? 'bg-white border-[#E8E8E4] text-[#171717] shadow-sm' : 'bg-transparent border-transparent text-[#5B5B5B]'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingPeriod('annual')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${billingPeriod === 'annual' ? 'bg-white border-[#E8E8E4] text-[#171717] shadow-sm' : 'bg-transparent border-transparent text-[#5B5B5B]'}`}
            >
              Annual <span className="text-[#D97745] text-[11px] font-black uppercase ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left items-stretch select-none">
          {plans.map((p) => (
            <div 
              key={p.name}
              className={`p-8 bg-white border rounded-2xl flex flex-col justify-between transition-all ${p.highlight ? 'border-[#D97745] shadow-lg shadow-[#D97745]/5 scale-[1.01]' : 'border-[#E8E8E4]'}`}
            >
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-sm text-[#171717]">{p.name}</h3>
                  <p className="text-xs text-[#5B5B5B] mt-1.5 leading-normal">{p.desc}</p>
                </div>
                <div className="pt-2">
                  <span className="text-4xl font-black text-[#171717] tracking-tight">
                    {typeof p.price === 'number' ? `$${p.price}` : p.price}
                  </span>
                  {typeof p.price === 'number' && (
                    <span className="text-[13px] text-slate-400 font-semibold ml-1">/ user / mo</span>
                  )}
                </div>
                <ul className="space-y-3.5 text-xs text-[#5B5B5B] pt-6 border-t border-slate-100 font-medium">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#D97745] font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link 
                to="/register" 
                className={`w-full text-center px-4 py-3 rounded-xl text-xs font-bold mt-8 transition-all inline-block ${p.highlight ? 'bg-[#D97745] hover:bg-[#C25C2B] text-white shadow-md shadow-[#D97745]/15' : 'border border-[#E8E8E4] hover:border-[#171717] text-[#171717] bg-white'}`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: PREMIUM EDITORIAL FEATURE SHOWCASE (BORDERLESS) */}
      <section className="max-w-[1080px] mx-auto px-6 pt-8 pb-8 select-none space-y-16 md:space-y-24">
         {/* Hero Title */}
         <div className="text-center mb-16">
            <h3 className="text-4xl md:text-[52px] font-black text-[#171717] tracking-tight mb-6">
              The Paper Ecosystem.
            </h3>
            <p className="text-[19px] text-[#5B5B5B] leading-relaxed max-w-2xl mx-auto font-medium">
              A unified workspace where ideas sprout, documents connect, and teams collaborate without friction. Everything in its right place.
            </p>
         </div>

         {/* Feature 1: Structure */}
         <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1 space-y-6">
               <div className="w-12 h-12 rounded-2xl bg-[#EDF3EE] flex items-center justify-center">
                 <IconBlueprint className="w-6 h-6 text-[#4D7C5A]" />
               </div>
               <h4 className="text-3xl font-black text-[#171717] tracking-tight">Structure Knowledge</h4>
               <p className="text-[17px] text-[#5B5B5B] leading-relaxed font-medium">
                 Organize your thoughts into folder trees and nested notes that scale beautifully across your team.
               </p>
            </div>
            <div className="flex-1 w-full bg-[#FDFCF8] border border-[#E8E5DF] rounded-[32px] p-8 md:p-12 flex items-center justify-center shadow-sm">
                {/* Floating UI */}
                <motion.div initial={{ y: 10 }} whileInView={{ y: 0 }} viewport={{ once: true }} className="w-full max-w-xs space-y-4">
                  <div className="flex items-center gap-2 text-[15px] font-bold text-[#171717]"><span className="text-[12px]">▼</span> Engineering</div>
                  <div className="pl-6 space-y-3 border-l-2 border-[#E8E5DF] ml-2">
                    <div className="flex items-center gap-3 text-[14px] font-medium text-[#5B5B5B] bg-white p-3 rounded-xl shadow-sm border border-[#E8E5DF]"><IconBlueprint className="w-4 h-4 text-[#4D7C5A]" /> Architecture.md</div>
                    <div className="flex items-center gap-3 text-[14px] font-medium text-[#5B5B5B] bg-white p-3 rounded-xl shadow-sm border border-[#E8E5DF]"><IconBlueprint className="w-4 h-4 text-[#4D7C5A]" /> API_Specs.md</div>
                  </div>
                </motion.div>
            </div>
         </div>

         {/* Feature 2: Search */}
         <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <div className="flex-1 space-y-6">
               <div className="w-12 h-12 rounded-2xl bg-[#FFFBF0] flex items-center justify-center">
                 <IconOwl className="w-6 h-6 text-[#E8B44C]" />
               </div>
               <h4 className="text-3xl font-black text-[#171717] tracking-tight">Semantic Search</h4>
               <p className="text-[17px] text-[#5B5B5B] leading-relaxed font-medium">
                 Find answers instantly. The Owl assistant understands context, not just keywords.
               </p>
            </div>
            <div className="flex-1 w-full bg-[#FDFCF8] border border-[#E8E5DF] rounded-[32px] p-8 md:p-12 flex items-center justify-center shadow-sm">
                <motion.div initial={{ y: 10 }} whileInView={{ y: 0 }} viewport={{ once: true }} className="w-full max-w-sm">
                  <div className="bg-white border border-[#E8E5DF] rounded-2xl shadow-sm p-5 space-y-4">
                    <div className="bg-[#FAF8F3] rounded-xl p-3 flex items-center gap-3 border border-[#E8E5DF]">
                      <IconExplorer className="w-5 h-5 text-[#D97745]" />
                      <span className="text-[14px] font-bold text-[#171717] flex items-center">deployment str<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-0.5 h-4 bg-[#D97745] ml-1" /></span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[11px] font-black uppercase tracking-widest text-[#D97745] pl-2">Best match</div>
                      <div className="bg-[#FFFBF0] border border-[#E8B44C]/30 p-3 rounded-xl flex items-center gap-3">
                         <IconOwl className="w-5 h-5 text-[#E8B44C]" />
                         <span className="text-[14px] font-medium text-[#171717]">Deploying to Production</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
            </div>
         </div>

         {/* Feature 3: Collab */}
         <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1 space-y-6">
               <div className="w-12 h-12 rounded-2xl bg-[#F4F9FC] flex items-center justify-center">
                 <IconCrane className="w-6 h-6 text-[#7FB3D5]" />
               </div>
               <h4 className="text-3xl font-black text-[#171717] tracking-tight">Live Collaboration</h4>
               <p className="text-[17px] text-[#5B5B5B] leading-relaxed font-medium">
                 Paper cranes deliver shared comments and sync multiple cursors in real-time.
               </p>
            </div>
            <div className="flex-1 w-full bg-[#FDFCF8] border border-[#E8E5DF] rounded-[32px] p-8 md:p-12 flex items-center justify-center shadow-sm">
                <motion.div initial={{ y: 10 }} whileInView={{ y: 0 }} viewport={{ once: true }} className="w-full max-w-sm relative bg-white border border-[#E8E5DF] p-8 rounded-2xl shadow-sm space-y-4 h-40">
                  <div className="h-3 w-3/4 bg-[#E8E5DF] rounded" />
                  <div className="h-3 w-full bg-[#E8E5DF] rounded" />
                  <div className="h-3 w-5/6 bg-[#E8E5DF] rounded" />
                  <motion.div animate={{ x: [0, 40, 0], y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-4 left-10">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="#D97745" stroke="#fff" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
                     <span className="bg-[#D97745] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm absolute top-5 left-5">Alex</span>
                  </motion.div>
                  <motion.div animate={{ x: [0, -30, 0], y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="absolute bottom-4 right-10">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="#7FB3D5" stroke="#fff" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
                     <span className="bg-[#7FB3D5] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm absolute top-5 left-5">Sarah</span>
                  </motion.div>
                </motion.div>
            </div>
         </div>

         {/* Feature 4: AI */}
         <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <div className="flex-1 space-y-6">
               <div className="w-12 h-12 rounded-2xl bg-[#F3F7F4] flex items-center justify-center">
                 <IconSprout className="w-6 h-6 text-[#4D7C5A]" />
               </div>
               <h4 className="text-3xl font-black text-[#171717] tracking-tight">AI Workspace</h4>
               <p className="text-[17px] text-[#5B5B5B] leading-relaxed font-medium">
                 Watch a single seed become a tree with intelligent suggestions that naturally grow your knowledge graph.
               </p>
            </div>
            <div className="flex-1 w-full bg-[#FDFCF8] border border-[#E8E5DF] rounded-[32px] p-8 md:p-12 flex items-center justify-center shadow-sm">
                <motion.div initial={{ y: 10 }} whileInView={{ y: 0 }} viewport={{ once: true }} className="w-full max-w-sm flex flex-col gap-4">
                  <div className="self-end bg-white border border-[#E8E5DF] text-[#171717] text-[13px] font-bold px-4 py-3 rounded-2xl rounded-br-sm shadow-sm max-w-[80%]">
                    Expand this outline.
                  </div>
                  <div className="self-start bg-[#EDF3EE] border border-[#4D7C5A]/20 text-[#4D7C5A] text-[13px] font-bold px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm max-w-[90%] flex items-start gap-3">
                    <IconSprout className="w-5 h-5 shrink-0" />
                    <span>Here are 3 new sections to naturally grow this document...</span>
                  </div>
                </motion.div>
            </div>
         </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className="max-w-[1440px] mx-auto px-6 pt-8 pb-12 select-none text-center">
        <h2 className="text-4xl md:text-[56px] font-black text-[#171717] mb-8 tracking-tight">
          Start your story today.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="px-8 py-3.5 bg-[#D97745] text-white text-[16px] font-bold rounded-[12px] hover:bg-[#C66535] transition-colors shadow-sm">
            Get Notely free
          </Link>
          <Link to="/contact" className="px-8 py-3.5 bg-white text-[#171717] border border-[#E8E5DF] text-[16px] font-bold rounded-[12px] hover:bg-[#FAF8F3] transition-colors shadow-sm">
            Request a demo
          </Link>
        </div>
      </section>

    </div>
  );
}
