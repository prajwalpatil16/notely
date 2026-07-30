import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconOwl, 
  IconCrane, 
  IconSprout, 
  IconPencil, 
  IconRocket,
  DoodleArrow,
  IconNotebook,
  IconStickyNote,
  IconCoffee,
  IconShieldCheck
} from '../../components/CompanyIllustrations';

export default function CompanyLanding() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-24 pb-32 overflow-hidden selection:bg-[#D97745]/20">
      
      {/* Background Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* ─── SCRAPBOOK HERO ────────────────────────────────────────────── */}
        <div className="relative mb-16 border-b border-[#E8E5DF] pb-16">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            <motion.div 
              className="lg:w-1/2 relative z-10 text-center lg:text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-white border border-[#E8E5DF] px-3 py-1 mb-8 rotate-[-1deg] shadow-sm relative">
                <h4 className="text-[11px] font-black tracking-[0.25em] text-[#171717] uppercase font-mono">
                  THE COMPANY
                </h4>
              </div>
              <h1 className="text-[56px] md:text-[72px] font-black tracking-tight text-[#171717] leading-[1] mb-8">
                Documentation<br /> deserves more<br className="hidden md:block"/> than folders.
              </h1>
              <p className="text-[20px] font-medium text-[#7A7870] max-w-[500px] mx-auto lg:mx-0 leading-relaxed mb-10">
                Every feature inside Notely exists for one reason: to help teams remember what matters, without the noise.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/about" className="px-8 py-3.5 bg-white border border-[#171717] border-2 text-[#171717] rounded-sm font-bold text-[15px] transition-all shadow-sm active:translate-y-1">
                  Read our Manifesto
                </Link>
                <Link to="/careers" className="px-8 py-3.5 bg-[#FDFCF8] border border-[#E8E5DF] hover:bg-[#F8F5EF] text-[#171717] rounded-sm font-bold text-[15px] transition-all shadow-sm active:translate-y-1">
                  View Open Roles
                </Link>
              </div>
            </motion.div>

            {/* Hero Scrapbook Art */}
            <motion.div 
              className="lg:w-1/2 relative w-full h-[400px] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {/* Blueprint Grid Base */}
              <div className="absolute inset-0 bg-[linear-gradient(#E8E5DF_1px,transparent_1px),linear-gradient(90deg,#E8E5DF_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40 rounded-3xl" />
              
              {/* Main Card */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute z-20 bg-white border border-[#E8E5DF] p-6 shadow-md rotate-[-2deg]"
              >
                <IconCrane className="w-24 h-24 text-[#171717]" />
              </motion.div>

              {/* Photo Note */}
              <motion.div 
                animate={{ y: [0, 5, 0], rotate: [5, 6, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute z-10 -right-4 top-10 bg-[#FDFCF8] p-4 shadow-sm border border-[#E8E5DF] pb-10"
              >
                <div className="w-20 h-20 bg-[#F0EDE8] border border-[#E8E5DF] flex items-center justify-center mb-2">
                  <IconCoffee className="w-8 h-8 text-[#A0A09A]" />
                </div>
                <div className="text-[10px] font-mono font-bold text-[#A0A09A] text-center">v1.0 Launch</div>
              </motion.div>

              {/* Sticky Note */}
              <motion.div 
                animate={{ y: [0, -3, 0], rotate: [-8, -10, -8] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute z-30 -left-6 bottom-16 bg-[#FEF4EC] p-3 shadow-md border border-[#E8E5DF]"
              >
                <IconPencil className="w-10 h-10 text-[#D97745]" />
              </motion.div>

              {/* Floating Doodle */}
              <div className="absolute z-10 bottom-8 right-12 opacity-60">
                <DoodleArrow className="w-16 h-16 transform -rotate-12" />
              </div>
            </motion.div>

          </div>
        </div>

        {/* ─── DEPARTMENT DIRECTORY (NAVIGATION) ─────────────────────────── */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717] font-serif italic">Company Directory</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
            
            {/* About Us (Notebook Style) */}
            <Link to="/about" className="group relative bg-white border border-[#E8E5DF] p-10 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between h-[240px]">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#171717] opacity-[0.03]" />
              <div className="absolute left-6 top-0 bottom-0 w-px bg-red-400/20" />
              <div className="relative z-10 pl-4">
                <div className="mb-4 bg-[#F8F5EF] w-12 h-12 flex items-center justify-center rounded-sm border border-[#E8E5DF] group-hover:scale-110 transition-transform">
                  <IconOwl className="w-6 h-6 text-[#171717]" />
                </div>
                <h3 className="text-[28px] font-black tracking-tight text-[#171717] mb-2 font-serif group-hover:underline decoration-2 underline-offset-4">
                  About Us
                </h3>
                <p className="text-[15px] text-[#7A7870] font-medium max-w-[250px]">
                  Learn why we built Notely and the manifesto that drives us.
                </p>
              </div>
            </Link>

            {/* Careers (Folder Style) */}
            <Link to="/careers" className="group relative bg-[#FDFCF8] border border-[#E8E5DF] rounded-b-xl rounded-tr-xl p-10 shadow-sm hover:shadow-lg transition-all duration-300 mt-[24px] h-[216px]">
              <div className="absolute top-[-24px] left-[-1px] bg-[#FDFCF8] border-t border-l border-r border-[#E8E5DF] px-6 py-2 rounded-t-lg font-mono text-[11px] font-black text-[#A0A09A] uppercase tracking-widest">
                Hiring
              </div>
              <div className="relative z-10">
                <div className="mb-4 bg-white w-12 h-12 flex items-center justify-center rounded-full border border-[#E8E5DF] group-hover:rotate-[15deg] transition-transform shadow-sm">
                  <IconSprout className="w-6 h-6 text-[#5D8A63]" />
                </div>
                <h3 className="text-[28px] font-black tracking-tight text-[#171717] mb-2 font-serif group-hover:underline decoration-2 underline-offset-4">
                  Careers
                </h3>
                <p className="text-[15px] text-[#7A7870] font-medium max-w-[250px]">
                  Join builders who care deeply about craft and focus.
                </p>
              </div>
            </Link>

            {/* Security (Vault Style) */}
            <Link to="/security" className="group relative bg-[#F8F5EF] border border-[#171717] border-2 p-10 rounded-sm shadow-[4px_4px_0px_#171717] hover:shadow-[6px_6px_0px_#171717] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all duration-200 h-[240px]">
              <div className="absolute inset-0 bg-[linear-gradient(#E8E5DF_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30" />
              <div className="relative z-10">
                <div className="mb-4">
                  <IconShieldCheck className="w-10 h-10 text-[#171717] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-[28px] font-black tracking-tight text-[#171717] mb-2 font-mono uppercase">
                  Security
                </h3>
                <p className="text-[15px] text-[#5B5B5B] font-medium max-w-[250px] font-mono">
                  Enterprise-grade trust, zero-knowledge architecture, and compliance.
                </p>
              </div>
            </Link>

            {/* Contact (Sticky Note Style) */}
            <Link to="/contact" className="group relative bg-[#FEF4EC] border border-[#E8E5DF] p-10 shadow-md rotate-[1deg] hover:rotate-[2deg] hover:shadow-xl transition-all duration-300 h-[240px]">
              <div className="absolute top-0 right-10 w-8 h-8 bg-black/5 rotate-45 transform origin-top-right mix-blend-multiply" />
              <div className="relative z-10">
                <div className="mb-4">
                  <IconStickyNote className="w-10 h-10 text-[#D97745] group-hover:-translate-y-1 transition-transform" />
                </div>
                <h3 className="text-[28px] font-black tracking-tight text-[#171717] mb-2 font-serif group-hover:underline decoration-2 underline-offset-4 decoration-[#D97745]">
                  Contact Us
                </h3>
                <p className="text-[15px] text-[#7A7870] font-medium max-w-[250px]">
                  Talk to real humans. Sales, support, or press inquiries.
                </p>
              </div>
            </Link>

          </div>
        </div>

        {/* ─── LEDGER TIMELINE ───────────────────────────────────────────── */}
        <div className="max-w-[700px] mx-auto mb-16 relative bg-white border border-[#E8E5DF] rounded-md shadow-md p-8 md:p-12 rotate-[-1deg]">
          <div className="absolute top-4 right-8 w-12 h-6 bg-[#D97745]/20 -rotate-2 mix-blend-multiply" />
          
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-[28px] font-black tracking-tight text-[#171717] font-mono uppercase">Company History</h2>
          </div>

          {/* Lined paper texture */}
          <div className="absolute inset-0 opacity-20 pointer-events-none z-0 mt-24" style={{ backgroundImage: 'linear-gradient(#171717 1px, transparent 1px)', backgroundSize: '100% 4rem' }} />
          
          {/* Red margin lines */}
          <div className="absolute left-16 md:left-24 top-0 bottom-0 w-[2px] bg-red-400/30 z-0" />
          <div className="absolute left-[70px] md:left-[100px] top-0 bottom-0 w-[1px] bg-red-400/30 z-0" />

          <div className="space-y-12 relative z-10 font-mono">
            
            {/* 2024 */}
            <div className="flex items-start">
              <div className="w-16 md:w-24 shrink-0 pt-1">
                <span className="text-[16px] font-black text-[#D97745]">2024</span>
              </div>
              <div className="flex-1 pl-8 md:pl-10">
                <div className="bg-[#F8F5EF] inline-block p-1 border border-[#E8E5DF] mb-3 rotate-[2deg]">
                  <IconSprout className="w-5 h-5 text-[#171717]" />
                </div>
                <h3 className="text-[20px] md:text-[22px] font-bold text-[#171717]">One notebook.</h3>
                <p className="text-[14px] text-[#7A7870] mt-2 font-sans leading-relaxed">It started with a simple question: why is writing so distracting? We built the first prototype over a weekend.</p>
              </div>
            </div>

            {/* Semantic Search */}
            <div className="flex items-start">
              <div className="w-16 md:w-24 shrink-0 pt-1">
                <span className="text-[16px] font-black text-[#A0A09A]">2025</span>
              </div>
              <div className="flex-1 pl-8 md:pl-10">
                <div className="bg-white inline-block p-1 border border-[#E8E5DF] mb-3 rotate-[-1deg] shadow-sm">
                  <IconOwl className="w-5 h-5 text-[#171717]" />
                </div>
                <h3 className="text-[20px] md:text-[22px] font-bold text-[#171717]">Search becomes semantic.</h3>
                <p className="text-[14px] text-[#7A7870] mt-2 font-sans leading-relaxed">Finding information shouldn't require exact keyword matches. We introduced privacy-first AI embeddings.</p>
              </div>
            </div>

            {/* Collaboration */}
            <div className="flex items-start">
              <div className="w-16 md:w-24 shrink-0 pt-1">
                <span className="text-[16px] font-black text-[#A0A09A]">2025</span>
              </div>
              <div className="flex-1 pl-8 md:pl-10">
                <div className="bg-[#FEF4EC] inline-block p-1 border border-[#E8E5DF] mb-3 rotate-[1deg]">
                  <IconCrane className="w-5 h-5 text-[#D97745]" />
                </div>
                <h3 className="text-[20px] md:text-[22px] font-bold text-[#171717]">Real-time collaboration.</h3>
                <p className="text-[14px] text-[#7A7870] mt-2 font-sans leading-relaxed">Workspaces v2 launched, allowing thousands of teams to build documentation together simultaneously.</p>
              </div>
            </div>

            {/* Today */}
            <div className="flex items-start">
              <div className="w-16 md:w-24 shrink-0 pt-1">
                <span className="text-[16px] font-black text-[#171717]">Today</span>
              </div>
              <div className="flex-1 pl-8 md:pl-10 relative">
                <div className="bg-white inline-block p-1 border border-[#171717] mb-3 rotate-[-2deg]">
                  <IconRocket className="w-5 h-5 text-[#171717]" />
                </div>
                <h3 className="text-[20px] md:text-[22px] font-bold text-[#171717]">Growing with teams worldwide.</h3>
                <p className="text-[14px] text-[#7A7870] mt-2 font-sans leading-relaxed">Serving over 100,000 workspaces with enterprise security and uncompromised performance.</p>
                <DoodleArrow className="absolute right-0 bottom-0 w-12 h-12 opacity-30 rotate-180" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
