import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconOwl, 
  IconCrane, 
  IconSprout, 
  IconPencil, 
  IconNotebook,
  IconCoffee,
  PaperClip,
  DoodleArrow
} from '../../components/CompanyIllustrations';

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-16 pb-24 overflow-hidden selection:bg-[#D97745]/20">
      
      {/* Background Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* ─── MASSIVE CENTERED HERO ─────────────────────────────────────── */}
        <div className="text-center mb-24 relative">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-[48px] md:text-[72px] lg:text-[84px] font-black tracking-tighter text-[#171717] leading-[0.95] mb-8">
              We never wanted to build <span className="text-[#A0A09A]">another note app.</span>
            </h1>
            
            <p className="text-[22px] md:text-[28px] text-[#5B5B5B] font-medium leading-tight max-w-[700px] mx-auto">
              We wanted to build a place where <strong className="text-[#171717]">knowledge could live</strong>, breathe, and grow alongside your team.
            </p>
          </motion.div>

          {/* Floating Illustrations */}
          <div className="absolute top-10 -left-10 hidden lg:block opacity-60">
            <motion.div animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <IconCrane className="w-20 h-20" />
            </motion.div>
          </div>
          <div className="absolute top-20 -right-10 hidden lg:block opacity-60">
            <motion.div animate={{ y: [0, 10, 0], rotate: [0, 5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
              <IconOwl className="w-24 h-24" />
            </motion.div>
          </div>
        </div>

        {/* ─── FOUNDER'S LETTER (PAPER STYLE) ────────────────────────────── */}
        <div className="mb-24 relative max-w-[800px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-[#FDFCF8] border border-[#E8E5DF] p-10 md:p-16 rounded-sm shadow-xl relative z-10"
          >
            <PaperClip className="absolute -top-3 left-10 w-8 h-8 text-[#171717] rotate-12" />
            
            {/* Lined paper effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(#E8E5DF 1px, transparent 1px)', backgroundSize: '100% 2.5rem', marginTop: '4rem' }} />
            
            <div className="relative z-10 font-serif">
              <p className="text-[20px] md:text-[24px] text-[#171717] leading-[2.5rem] mb-6 italic">
                "It started with a simple frustration. Every tool we used to document our work eventually became a graveyard of lost ideas. Folders became too deep. Search became useless. Context was always missing."
              </p>
              <p className="text-[20px] md:text-[24px] text-[#171717] leading-[2.5rem] mb-12 italic">
                "So we stopped trying to organize files, and started trying to connect thoughts. That's when Notely was born—not as a filing cabinet, but as a second brain for teams."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#171717] rounded-full flex items-center justify-center">
                  <IconPencil className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-[#171717] font-sans text-[16px]">The Notely Founders</div>
                  <div className="text-[13px] text-[#7A7870] font-mono uppercase tracking-widest">Est. 2024</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <DoodleArrow className="absolute -right-20 top-1/2 w-32 h-32 opacity-20 rotate-[140deg] hidden lg:block" />
        </div>

        {/* ─── OUR PRINCIPLES (BENTO GRID) ───────────────────────────────── */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-[32px] md:text-[48px] font-black tracking-tight text-[#171717]">How we build</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            
            {/* Sticky Note */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#FDFCF8] border border-[#E8E5DF] p-10 shadow-md hover:shadow-xl transition-all group relative rotate-[-2deg]"
              style={{ borderRadius: '2px 15px 15px 2px' }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm rotate-[3deg]" />
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform border border-[#E8E5DF]">
                <IconPencil className="w-6 h-6 text-[#171717]" />
              </div>
              <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-3">Radical Simplicity</h3>
              <p className="text-[16px] text-[#5B5B5B] font-medium leading-relaxed">
                Software should disappear. We obsess over removing unnecessary clicks, modals, and settings so your ideas can surface immediately.
              </p>
            </motion.div>

            {/* Lined Index Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-[#E8E5DF] p-10 rounded-md shadow-sm hover:shadow-xl transition-all group relative rotate-[1deg] overflow-hidden"
            >
              <PaperClip className="absolute -top-3 right-6 w-8 h-8 text-[#171717] rotate-12 z-20 group-hover:scale-110 transition-transform" />
              <div className="absolute left-8 top-0 bottom-0 w-px bg-red-400/40 z-0" />
              <div className="absolute inset-0 opacity-30 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#7FB3D5 1px, transparent 1px)', backgroundSize: '100% 1.5rem', marginTop: '6rem' }} />
              
              <div className="relative z-10 pl-6">
                <div className="w-14 h-14 bg-[#FDFCF8] border border-[#E8E5DF] rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <IconOwl className="w-7 h-7 text-[#5D8A63]" />
                </div>
                <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-3 bg-white inline-block">Quiet Intelligence</h3>
                <p className="text-[16px] text-[#5B5B5B] font-medium leading-relaxed bg-white/80 p-1 rounded-sm">
                  Your workspace should actively help you find answers, without being intrusive. We use AI to connect the dots behind the scenes.
                </p>
              </div>
            </motion.div>

            {/* Light Blueprint / Grid Folder */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#EEF4F8] border border-[#D5E3EE] p-10 rounded-3xl shadow-sm hover:shadow-md transition-all group md:col-span-2 flex flex-col md:flex-row items-start md:items-center gap-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(#D5E3EE_1px,transparent_1px),linear-gradient(90deg,#D5E3EE_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50 pointer-events-none" />
              
              <div className="flex-1 relative z-10">
                <div className="w-14 h-14 bg-white border border-[#D5E3EE] rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <IconNotebook className="w-7 h-7 text-[#7FB3D5]" />
                </div>
                <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-3 bg-[#EEF4F8] inline-block px-1 -mx-1">Absolute Ownership</h3>
                <p className="text-[16px] text-[#5B5B5B] font-medium leading-relaxed max-w-[400px] bg-[#EEF4F8] p-1 -mx-1">
                  Your data belongs to you. Notely is built on an open format. You can export your entire workspace to local Markdown files at any time with a single click.
                </p>
              </div>
              <div className="hidden md:block w-48 h-48 relative z-10">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-[#E8E5DF] rotate-6 flex items-center justify-center">
                  <span className="font-mono font-bold text-[#A0A09A] text-[14px]">.md</span>
                </div>
                <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-[#E8E5DF] -rotate-3 flex items-center justify-center">
                  <span className="font-mono font-bold text-[#A0A09A] text-[14px]">.json</span>
                </div>
                <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-[#E8E5DF] flex items-center justify-center text-[#171717] font-mono font-bold text-[18px]">
                  Export All
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ─── CRAFT OVER CORPORATE ──────────────────────────────────────── */}
        <div className="mb-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative">
          
          <div className="flex-1">
            <h2 className="text-[32px] md:text-[48px] font-black tracking-tight text-[#171717] leading-tight mb-6">
              We are a small,<br/>independent team.
            </h2>
            <p className="text-[18px] text-[#5B5B5B] font-medium leading-relaxed mb-6">
              We don't answer to venture capitalists demanding hyper-growth. We answer to the people who use Notely every single day.
            </p>
            <p className="text-[18px] text-[#5B5B5B] font-medium leading-relaxed">
              This independence allows us to focus entirely on <strong className="text-[#171717]">craft, stability, and speed</strong>. We build features because they solve real problems, not because they look good on a pitch deck.
            </p>
          </div>

          <div className="flex-1 relative h-[300px] w-full flex items-center justify-center hidden md:flex">
            
            <motion.div 
              className="absolute left-[10%] top-[15%] w-32 h-32 bg-white border border-[#E8E5DF] rounded-2xl shadow-lg flex flex-col items-center justify-center rotate-[-10deg] z-10 hover:z-40 transition-all hover:scale-110"
              animate={{ y: [0, -8, 0], rotate: [-10, -12, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
               <IconPencil className="w-8 h-8 text-[#171717] mb-2" />
               <span className="text-[10px] font-mono font-bold text-[#A0A09A] tracking-widest">CRAFT</span>
            </motion.div>

            <motion.div 
              className="absolute left-[35%] top-[25%] w-40 h-40 bg-[#FDFCF8] border border-[#E8E5DF] rounded-3xl shadow-2xl flex flex-col items-center justify-center rotate-[5deg] z-30 hover:z-40 transition-all hover:scale-110 cursor-pointer"
              animate={{ y: [0, -12, 0], rotate: [5, 7, 5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
               <div className="absolute inset-0 bg-[linear-gradient(#E8E5DF_1px,transparent_1px)] bg-[size:100%_1rem] opacity-40 pointer-events-none rounded-3xl" />
               <IconCoffee className="w-12 h-12 text-[#D97745] mb-2 relative z-10" />
               <span className="text-[11px] font-mono font-bold text-[#171717] relative z-10 tracking-widest">FUEL</span>
            </motion.div>

            <motion.div 
              className="absolute right-[10%] top-[20%] w-32 h-32 bg-[#EDF3EE] border border-[#E8E5DF] rounded-2xl shadow-md flex flex-col items-center justify-center rotate-[15deg] z-20 hover:z-40 transition-all hover:scale-110"
              animate={{ y: [0, -6, 0], rotate: [15, 12, 15] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
               <IconSprout className="w-8 h-8 text-[#5D8A63] mb-2" />
               <span className="text-[10px] font-mono font-bold text-[#5D8A63] tracking-widest">GROW</span>
            </motion.div>

          </div>
          
        </div>

        {/* ─── CTA ───────────────────────────────────────────────────────── */}
        <div className="text-center py-12 md:py-16 bg-[#FDFCF8] rounded-3xl shadow-sm relative overflow-hidden border border-[#E8E5DF]">
          
          <IconSprout className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.03] text-[#171717]" />

          <div className="relative z-10 max-w-[500px] mx-auto px-6">
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717] mb-4 leading-tight">
              Start building your second brain.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Link to="/register" className="px-8 py-3.5 bg-[#171717] hover:bg-[#2A2A2A] text-white rounded-xl font-bold text-[15px] transition-all shadow-sm active:scale-95">
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
