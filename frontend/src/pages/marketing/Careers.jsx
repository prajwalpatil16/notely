import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconOwl, 
  IconCrane, 
  IconCoffee, 
  IconNotebook,
  IconStickyNote,
  IconSprout,
  IconPencil,
  DoodleArrow
} from '../../components/CompanyIllustrations';

export default function Careers() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-16 pb-16 overflow-hidden selection:bg-[#D97745]/20">
      
      {/* Background Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* ─── HERO ──────────────────────────────────────────────────────── */}
        <div className="relative pt-4 pb-8 mb-12 flex flex-col items-center justify-center border-b border-[#E8E5DF] overflow-hidden">
          {/* Blueprint background in hero */}
          <div className="absolute inset-0 bg-[linear-gradient(#E8E5DF_1px,transparent_1px),linear-gradient(90deg,#E8E5DF_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50 pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center max-w-[800px] mx-auto"
          >

            <h1 className="text-[56px] md:text-[80px] font-black tracking-tight text-[#171717] leading-[1] mb-6">
              Build software that<br className="hidden md:block"/> people love using.
            </h1>
            <p className="text-[18px] text-[#7A7870] font-medium leading-relaxed max-w-[600px] mx-auto mb-10">
              We're building the future of connected knowledge. At Notely, designers, engineers, and builders work together to create software that feels fast, thoughtful, and genuinely useful. Every decision starts with the user.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#roles" onClick={(e) => { e.preventDefault(); document.getElementById('roles').scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-3.5 bg-white border border-[#171717] border-2 text-[#171717] rounded-sm font-bold text-[15px] shadow-sm active:translate-y-1 transition-all">
                View Open Roles
              </a>
              <a href="#culture" onClick={(e) => { e.preventDefault(); document.getElementById('culture').scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-3.5 bg-[#FDFCF8] border border-[#E8E5DF] text-[#171717] rounded-sm font-bold text-[15px] shadow-sm hover:bg-[#F8F5EF] active:translate-y-1 transition-all">
                Our Culture
              </a>
            </div>
          </motion.div>
          
          <div className="relative w-full flex justify-center items-center mt-12 pb-12">
             <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
             >
                {/* Notebook */}
                <div className="bg-white border border-[#E8E5DF] p-4 md:p-6 shadow-md rounded-lg rotate-[-3deg] relative z-10">
                  <div className="absolute -left-2 top-4 w-4 h-8 bg-[#171717] rounded-sm" />
                  <IconNotebook className="w-16 h-16 md:w-24 md:h-24 text-[#171717]" />
                </div>
                
                {/* Coffee Cup on the edge */}
                <div className="absolute -bottom-6 -right-8 md:-right-12 bg-white border border-[#E8E5DF] p-3 shadow-md rounded-full rotate-[12deg] z-20 hover:scale-110 transition-transform">
                  <IconCoffee className="w-10 h-10 md:w-14 md:h-14 text-[#171717]" />
                </div>
                
                {/* Crane resting on top */}
                <motion.div 
                  className="absolute -top-10 -right-4 md:-right-8 z-30"
                  animate={{ y: [0, -5, 0], rotate: [5, -5, 5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <IconCrane className="w-12 h-12 md:w-20 md:h-20 text-[#171717]" />
                </motion.div>
             </motion.div>
          </div>
        </div>

        {/* ─── OPEN ROLES ────────────────────────────────────────────────── */}
        <div className="mb-12" id="roles">
          <div className="text-center mb-8">
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717] font-serif italic">Open Roles</h2>
          </div>

          <div className="max-w-[800px] mx-auto space-y-6">
            
            <Link to="#" className="group block p-6 md:p-8 bg-[#FDFCF8] border border-[#E8E5DF] rounded-sm shadow-md hover:shadow-xl hover:rotate-[1deg] transition-all duration-300 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-3 group-hover:text-[#171717]/70 transition-colors font-serif">Senior Frontend Engineer</h3>
                  <div className="flex gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[-1deg]">Remote</span>
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[1deg]">React</span>
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[1deg]">TypeScript</span>
                  </div>
                  <p className="text-[#7A7870] font-medium text-[15px]">Build delightful user experiences used every day by thousands of teams.</p>
                </div>
                <div className="mt-6 sm:mt-0 flex items-center justify-center w-12 h-12 rounded-full border border-[#E8E5DF] bg-white group-hover:bg-[#171717] group-hover:border-[#171717] transition-colors shadow-sm">
                  <span className="text-[#171717] group-hover:text-white font-bold font-mono text-[18px]">→</span>
                </div>
              </div>
            </Link>

            <Link to="#" className="group block p-6 md:p-8 bg-[#FDFCF8] border border-[#E8E5DF] rounded-sm shadow-md hover:shadow-xl hover:rotate-[-1deg] transition-all duration-300 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-3 group-hover:text-[#171717]/70 transition-colors font-serif">Product Designer</h3>
                  <div className="flex gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[1deg]">Remote</span>
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[-2deg]">Figma</span>
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[1deg]">UX</span>
                  </div>
                  <p className="text-[#7A7870] font-medium text-[15px]">Design workflows that make complex collaboration feel effortless.</p>
                </div>
                <div className="mt-6 sm:mt-0 flex items-center justify-center w-12 h-12 rounded-full border border-[#E8E5DF] bg-white group-hover:bg-[#171717] group-hover:border-[#171717] transition-colors shadow-sm">
                  <span className="text-[#171717] group-hover:text-white font-bold font-mono text-[18px]">→</span>
                </div>
              </div>
            </Link>

            <Link to="#" className="group block p-6 md:p-8 bg-[#FDFCF8] border border-[#E8E5DF] rounded-sm shadow-md hover:shadow-xl hover:rotate-[1deg] transition-all duration-300 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-3 group-hover:text-[#171717]/70 transition-colors font-serif">Backend Engineer</h3>
                  <div className="flex gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[1deg]">Remote</span>
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[-1deg]">Go</span>
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[1deg]">Node.js</span>
                  </div>
                  <p className="text-[#7A7870] font-medium text-[15px]">Scale APIs, search, permissions, and collaboration infrastructure.</p>
                </div>
                <div className="mt-6 sm:mt-0 flex items-center justify-center w-12 h-12 rounded-full border border-[#E8E5DF] bg-white group-hover:bg-[#171717] group-hover:border-[#171717] transition-colors shadow-sm">
                  <span className="text-[#171717] group-hover:text-white font-bold font-mono text-[18px]">→</span>
                </div>
              </div>
            </Link>

            <Link to="#" className="group block p-6 md:p-8 bg-[#FDFCF8] border border-[#E8E5DF] rounded-sm shadow-md hover:shadow-xl hover:rotate-[-1deg] transition-all duration-300 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-3 group-hover:text-[#171717]/70 transition-colors font-serif">AI Engineer</h3>
                  <div className="flex gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[-1deg]">Remote</span>
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[1deg]">Python</span>
                    <span className="px-3 py-1 bg-[#FDFCF8] text-[#5B5B5B] font-mono text-[12px] font-bold border border-[#E8E5DF] rounded-sm shadow-sm rotate-[1deg]">LLMs</span>
                  </div>
                  <p className="text-[#7A7870] font-medium text-[15px]">Build intelligent assistants that help users think faster—not harder.</p>
                </div>
                <div className="mt-6 sm:mt-0 flex items-center justify-center w-12 h-12 rounded-full border border-[#E8E5DF] bg-white group-hover:bg-[#171717] group-hover:border-[#171717] transition-colors shadow-sm">
                  <span className="text-[#171717] group-hover:text-white font-bold font-mono text-[18px]">→</span>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* ─── WHY YOU'LL LOVE WORKING HERE ──────────────────────────────── */}
        <div className="mb-12" id="culture">
          <div className="text-center mb-8">
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717]">Why you'll love working here</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1000px] mx-auto">
            {/* Scrapbook Note 1 (Wide) */}
            <motion.div 
              whileHover={{ scale: 1.02, rotate: -1 }}
              className="md:col-span-2 bg-[#FDFCF8] p-8 md:p-10 rounded-sm shadow-md rotate-[-1deg] relative transform transition-transform cursor-pointer border border-[#E8E5DF]"
            >
              <div className="absolute -top-3 left-10 w-12 h-6 bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm rotate-[4deg]" />
              <div className="mb-6">
                <IconSprout className="w-12 h-12 text-[#171717]" />
              </div>
              <h3 className="text-[24px] font-black text-[#171717] leading-tight mb-2">Remote-first</h3>
              <p className="text-[#7A7870] font-medium text-[15px] max-w-[400px]">Work from wherever you're most productive. We care about outcomes—not hours online.</p>
            </motion.div>

            {/* Scrapbook Note 2 (Tall) */}
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="bg-white p-8 pb-10 rounded-sm shadow-md rotate-[2deg] relative transform transition-transform cursor-pointer border border-[#E8E5DF] overflow-hidden"
            >
              <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-[#171717]/10 shadow-inner" />
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#171717]/10 shadow-inner" />
              <div className="absolute inset-0 opacity-10 pointer-events-none z-0 mt-12" style={{ backgroundImage: 'linear-gradient(#171717 1px, transparent 1px)', backgroundSize: '100% 1.5rem' }} />
              
              <div className="mb-6 relative z-10 mt-6 bg-white inline-block rounded-full p-2 border border-[#E8E5DF]">
                <IconPencil className="w-8 h-8 text-[#171717]" />
              </div>
              <h3 className="text-[20px] font-black text-[#171717] leading-tight relative z-10 bg-white inline-block pr-2">Build beautiful<br/>software</h3>
              <p className="text-[#7A7870] font-medium text-[14px] mt-4 relative z-10 bg-white inline-block pr-2">Every pixel matters. We obsess over simplicity, usability, and craftsmanship.</p>
            </motion.div>

            {/* Scrapbook Note 3 (Square) */}
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="bg-[#FDFCF8] p-8 rounded-sm shadow-md rotate-[-2deg] relative transform transition-transform cursor-pointer border border-[#E8E5DF]"
            >
              <div className="w-full h-8 bg-black/5 absolute top-0 left-0 border-b border-black/5" />
              <div className="mb-6 mt-4">
                <IconOwl className="w-10 h-10 text-[#171717]" />
              </div>
              <h3 className="text-[20px] font-black text-[#171717] leading-tight mb-3">Solve meaningful problems</h3>
              <p className="text-[#7A7870] font-medium text-[14px]">Help millions of teams organize knowledge instead of searching for it.</p>
            </motion.div>

            {/* Scrapbook Note 4 (Wide) */}
            <motion.div 
              whileHover={{ scale: 1.02, rotate: 1 }}
              className="md:col-span-2 bg-[#FDFCF8] p-8 md:p-10 rounded-sm shadow-md rotate-[1deg] relative transform transition-transform cursor-pointer border border-[#E8E5DF]"
            >
              <IconStickyNote className="absolute top-4 right-4 w-8 h-8 text-[#D97745]/40" />
              <div className="mb-6">
                <IconCoffee className="w-12 h-12 text-[#171717]" />
              </div>
              <h3 className="text-[24px] font-black text-[#171717] leading-tight mb-2">Deep work culture</h3>
              <p className="text-[#7A7870] font-medium text-[15px] max-w-[400px]">We protect uninterrupted focus with fewer meetings, asynchronous communication, and clear documentation.</p>
            </motion.div>
          </div>
        </div>

        {/* ─── A DAY AT NOTELY (LEDGER PLANNER) ───────────────────────────────────────────── */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717] font-serif italic">A day at Notely</h2>
          </div>

          <div className="max-w-[700px] mx-auto relative bg-white border border-[#E8E5DF] rounded-md shadow-md p-8 md:p-12 rotate-[1deg]">
            
            {/* Lined paper texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0 mt-8" style={{ backgroundImage: 'linear-gradient(#171717 1px, transparent 1px)', backgroundSize: '100% 4rem' }} />
            
            {/* Red margin lines */}
            <div className="absolute left-16 md:left-24 top-0 bottom-0 w-[2px] bg-[#D97745]/30 z-0" />
            <div className="absolute left-[70px] md:left-[100px] top-0 bottom-0 w-[1px] bg-[#D97745]/30 z-0" />

            <div className="space-y-10 relative z-10 font-mono">
              
              <div className="flex items-start">
                <div className="w-16 md:w-24 shrink-0 pt-1">
                  <span className="text-[14px] font-bold text-[#A0A09A]">09:00</span>
                </div>
                <div className="flex-1 pl-8 md:pl-10">
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#171717]">Focus Block</h3>
                  <p className="text-[14px] text-[#7A7870] mt-1 italic font-sans">No meetings. Build, design, or write documentation.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-16 md:w-24 shrink-0 pt-1">
                  <span className="text-[14px] font-bold text-[#A0A09A]">11:30</span>
                </div>
                <div className="flex-1 pl-8 md:pl-10">
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#171717]">Design Review</h3>
                  <p className="text-[14px] text-[#7A7870] mt-1 italic font-sans">Share progress asynchronously before live discussion.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-16 md:w-24 shrink-0 pt-1">
                  <span className="text-[14px] font-bold text-[#A0A09A]">13:00</span>
                </div>
                <div className="flex-1 pl-8 md:pl-10">
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#171717]">Lunch & Learn</h3>
                  <p className="text-[14px] text-[#7A7870] mt-1 italic font-sans">Weekly talks from teammates on engineering, design, AI, and productivity.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-16 md:w-24 shrink-0 pt-1">
                  <span className="text-[14px] font-bold text-[#A0A09A]">15:00</span>
                </div>
                <div className="flex-1 pl-8 md:pl-10">
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#171717]">Ship Features</h3>
                  <p className="text-[14px] text-[#7A7870] mt-1 font-sans">Merge pull requests, review code, and deploy improvements.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-16 md:w-24 shrink-0 pt-1">
                  <span className="text-[14px] font-bold text-[#D97745]">17:00</span>
                </div>
                <div className="flex-1 pl-8 md:pl-10">
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#D97745]">Paper Crane Celebration</h3>
                  <p className="text-[14px] text-[#A0A09A] mt-1 font-sans">Every meaningful release ends with a small team celebration.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ─── CTA ───────────────────────────────────────────────────────── */}
        <div className="text-center py-8 md:py-10 bg-[#FDFCF8] rounded-3xl shadow-sm relative overflow-hidden border border-[#E8E5DF]">
          
          <IconSprout className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.03] text-[#171717]" />

          <div className="relative z-10 max-w-[600px] mx-auto px-6">
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717] mb-4">
              See yourself here?
            </h2>
            <p className="text-[16px] text-[#7A7870] font-medium mb-8 max-w-[500px] mx-auto">
              We're always looking for curious builders who care about quality, simplicity, and creating products people genuinely enjoy using.
            </p>
            <Link to="#roles" className="inline-block px-8 py-3 bg-white hover:bg-[#FDFCF8] text-[#171717] rounded-sm font-bold text-[15px] transition-all shadow-sm active:translate-y-1 border border-[#171717]">
              View All Careers
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
