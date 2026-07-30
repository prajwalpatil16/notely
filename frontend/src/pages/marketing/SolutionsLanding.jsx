import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconOwl, 
  IconTerminal, 
  IconUsers, 
  IconPalette, 
  IconBook, 
  IconBriefcase 
} from '../../components/CompanyIllustrations';

export default function SolutionsLanding() {
  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-16 pb-32 overflow-hidden selection:bg-[#171717]/10">
      
      {/* Background Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* ─── HERO ──────────────────────────────────────────────────────── */}
        <div className="text-center pt-8 pb-16">
          <h1 className="text-[56px] md:text-[72px] font-black tracking-tight text-[#171717] leading-[1.05] mb-6 max-w-[800px] mx-auto">
            One workspace.<br/>Built for every team.
          </h1>
          <p className="text-[18px] text-[#7A7870] font-medium leading-relaxed max-w-[600px] mx-auto mb-10">
            Whether you're shipping software, launching campaigns, onboarding employees, or organizing research, Notely adapts to the way your team thinks—not the other way around.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/solutions#cards" className="w-full sm:w-auto relative group">
                <div className="absolute inset-0 bg-[#E8E5DF] rounded-sm translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
                <div className="relative bg-[#FDFCF8] border border-[#E8E5DF] text-[#171717] px-8 py-3 rounded-sm font-bold text-[15px] shadow-sm transform group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                  Explore Solutions
                </div>
              </Link>
             <Link to="/register" className="w-full sm:w-auto relative group">
               <div className="absolute inset-0 bg-[#D97745] rounded-sm translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
               <div className="relative bg-[#171717] border-2 border-[#171717] text-white px-8 py-3 rounded-sm font-bold text-[15px] shadow-sm transform group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                 Start Free Workspace
               </div>
             </Link>
          </div>
        </div>

        {/* ─── HERO STATS ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
          <div className="bg-white border border-[#E8E5DF] rounded-xl p-6 shadow-sm rotate-[1deg] hover:rotate-0 transition-transform">
            <h3 className="text-[13px] font-black tracking-widest uppercase font-mono text-[#171717] mb-2 flex items-center gap-2"><IconTerminal className="w-4 h-4"/> Engineering</h3>
            <p className="text-[14px] text-[#7A7870] font-medium">Ship faster with structured documentation.</p>
          </div>
          <div className="bg-white border border-[#E8E5DF] rounded-xl p-6 shadow-sm rotate-[-1deg] hover:rotate-0 transition-transform">
            <h3 className="text-[13px] font-black tracking-widest uppercase font-mono text-[#D97745] mb-2 flex items-center gap-2"><IconPalette className="w-4 h-4"/> Marketing</h3>
            <p className="text-[14px] text-[#7A7870] font-medium">Keep campaigns, briefs, and content organized.</p>
          </div>
          <div className="bg-white border border-[#E8E5DF] rounded-xl p-6 shadow-sm rotate-[1deg] hover:rotate-0 transition-transform">
            <h3 className="text-[13px] font-black tracking-widest uppercase font-mono text-[#4D7C5A] mb-2 flex items-center gap-2"><IconBriefcase className="w-4 h-4"/> HR & Ops</h3>
            <p className="text-[14px] text-[#7A7870] font-medium">Standardize onboarding and internal knowledge.</p>
          </div>
          <div className="bg-white border border-[#E8E5DF] rounded-xl p-6 shadow-sm rotate-[-1deg] hover:rotate-0 transition-transform">
            <h3 className="text-[13px] font-black tracking-widest uppercase font-mono text-[#171717] mb-2 flex items-center gap-2"><IconBook className="w-4 h-4"/> Education</h3>
            <p className="text-[14px] text-[#7A7870] font-medium">Build modern digital classrooms and research hubs.</p>
          </div>
        </div>

        {/* ─── WHY CHOOSE NOTELY ─────────────────────────────────────────── */}
        <div className="mb-32">
          <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717] mb-12 text-center">
            Why teams choose Notely
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FDFCF8] border border-[#E8E5DF] p-10 rounded-2xl shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[linear-gradient(#E8E5DF_1px,transparent_1px),linear-gradient(90deg,#E8E5DF_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30 rounded-bl-full pointer-events-none" />
              <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-4">Shared Knowledge</h3>
              <p className="text-[16px] text-[#7A7870] font-medium leading-relaxed">
                One searchable workspace where every document, decision, and discussion stays connected.
              </p>
            </div>
            <div className="bg-[#FDFCF8] border border-[#E8E5DF] p-10 rounded-2xl shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[linear-gradient(45deg,transparent_50%,#E8E5DF_50%)] opacity-30 pointer-events-none" />
              <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-4">Faster Collaboration</h3>
              <p className="text-[16px] text-[#7A7870] font-medium leading-relaxed">
                Edit together in real time, leave comments, assign tasks, and keep everyone aligned.
              </p>
            </div>
            <div className="bg-[#171717] border border-[#333333] p-10 rounded-2xl shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-20 pointer-events-none" />
              <h3 className="text-[24px] font-black tracking-tight text-white mb-4 relative z-10">AI Assistance</h3>
              <p className="text-[16px] text-[#A0A09A] font-medium leading-relaxed relative z-10">
                Generate outlines, summarize documents, answer questions, and organize ideas instantly.
              </p>
            </div>
            <div className="bg-[#FDFCF8] border border-[#E8E5DF] p-10 rounded-2xl shadow-sm relative overflow-hidden group">
               <div className="absolute -bottom-8 -right-8 opacity-5">
                 <IconOwl className="w-40 h-40 text-[#171717]" />
               </div>
              <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-4">Enterprise Ready</h3>
              <p className="text-[16px] text-[#7A7870] font-medium leading-relaxed">
                Granular permissions, audit logs, backups, and enterprise-grade security built in.
              </p>
            </div>
          </div>
        </div>

        {/* ─── WORKFLOW SECTION ──────────────────────────────────────────── */}
        <div className="mb-32">
          <div className="bg-white border-y border-[#E8E5DF] py-20 px-8 text-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#171717 1px, transparent 1px)', backgroundSize: '100% 1.5rem', marginTop: '1.5rem' }} />
             <div className="relative z-10">
               <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717] mb-4">
                 Every team follows a different process.
               </h2>
               <p className="text-[20px] text-[#7A7870] font-medium mb-12 font-serif italic">
                 Notely adapts to yours.
               </p>
               
               <div className="flex flex-wrap items-center justify-center gap-4 text-[14px] font-black font-mono tracking-widest uppercase">
                  <span className="px-4 py-2 bg-[#F0EDE8] border border-[#E8E5DF] rounded-full text-[#171717]">Plan</span>
                  <span className="text-[#D97745]">↓</span>
                  <span className="px-4 py-2 bg-[#F0EDE8] border border-[#E8E5DF] rounded-full text-[#171717]">Document</span>
                  <span className="text-[#D97745]">↓</span>
                  <span className="px-4 py-2 bg-[#F0EDE8] border border-[#E8E5DF] rounded-full text-[#171717]">Collaborate</span>
                  <span className="text-[#D97745]">↓</span>
                  <span className="px-4 py-2 bg-[#171717] border border-[#171717] rounded-full text-white">Search</span>
                  <span className="text-[#D97745]">↓</span>
                  <span className="px-4 py-2 bg-[#F0EDE8] border border-[#E8E5DF] rounded-full text-[#171717]">Ship</span>
                  <span className="text-[#D97745]">↓</span>
                  <span className="px-4 py-2 bg-[#F0EDE8] border border-[#E8E5DF] rounded-full text-[#171717]">Improve</span>
               </div>
             </div>
          </div>
        </div>

        {/* ─── SOLUTION CARDS ────────────────────────────────────────────── */}
        <div id="cards" className="mb-24 scroll-mt-24">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 max-w-5xl mx-auto">
              
              {/* Engineering */}
              <div className="bg-[#FDFCF8] border border-[#E8E5DF] p-10 md:p-12 shadow-md group relative flex flex-col mt-4 md:mt-12 rotate-[-1.5deg] hover:rotate-0 transition-all duration-300 z-10 hover:z-20 hover:shadow-xl">
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-red-400/20 border-b border-red-400/40 rotate-[-2deg] shadow-sm z-20" />
                 <div className="w-12 h-12 bg-white border border-[#E8E5DF] flex items-center justify-center mb-8 rotate-[3deg] shadow-sm">
                   <IconTerminal className="w-6 h-6 text-[#171717]" />
                 </div>
                 <h3 className="text-[28px] font-black tracking-tight text-[#171717] mb-4 font-serif">Engineering</h3>
                 <p className="text-[16px] text-[#7A7870] font-medium leading-relaxed mb-8 flex-grow">
                   Technical documentation, API references, sprint planning, and architecture decisions.
                 </p>
                 <Link to="/solutions/engineering" className="inline-flex items-center gap-2 text-[15px] font-bold text-[#171717] group-hover:text-[#D97745] transition-colors border-b-2 border-transparent group-hover:border-[#D97745] pb-1 self-start">
                   Explore Engineering <span>→</span>
                 </Link>
              </div>

              {/* Marketing */}
              <div className="bg-white border border-[#E8E5DF] p-10 md:p-12 shadow-sm group relative flex flex-col rotate-[1deg] hover:rotate-0 transition-all duration-300 z-10 hover:z-20 hover:shadow-xl">
                 <div className="absolute top-0 right-0 w-12 h-12 bg-[linear-gradient(45deg,transparent_50%,#E8E5DF_50%)]" />
                 <div className="w-12 h-12 bg-[#FDFCF8] border border-[#E8E5DF] flex items-center justify-center mb-8 rotate-[-2deg] shadow-sm">
                   <IconPalette className="w-6 h-6 text-[#D97745]" />
                 </div>
                 <h3 className="text-[28px] font-black tracking-tight text-[#171717] mb-4 font-serif">Marketing</h3>
                 <p className="text-[16px] text-[#7A7870] font-medium leading-relaxed mb-8 flex-grow">
                   Campaign calendars, content planning, SEO documentation, and creative briefs.
                 </p>
                 <Link to="/solutions/marketing" className="inline-flex items-center gap-2 text-[15px] font-bold text-[#171717] group-hover:text-[#D97745] transition-colors border-b-2 border-transparent group-hover:border-[#D97745] pb-1 self-start">
                   Explore Marketing <span>→</span>
                 </Link>
              </div>

              {/* HR */}
              <div className="bg-white border border-[#E8E5DF] p-10 md:p-12 shadow-sm group relative flex flex-col md:-mt-8 rotate-[2deg] hover:rotate-0 transition-all duration-300 z-10 hover:z-20 hover:shadow-xl">
                 <div className="absolute top-5 left-5 w-3 h-3 rounded-full bg-[#171717]/10 shadow-inner" />
                 <div className="w-12 h-12 bg-[#FDFCF8] border border-[#E8E5DF] flex items-center justify-center mb-8 rotate-[-3deg] shadow-sm ml-4">
                   <IconBriefcase className="w-6 h-6 text-[#4D7C5A]" />
                 </div>
                 <h3 className="text-[28px] font-black tracking-tight text-[#171717] mb-4 font-serif">HR & Operations</h3>
                 <p className="text-[16px] text-[#7A7870] font-medium leading-relaxed mb-8 flex-grow">
                   Employee onboarding, SOPs, internal policies, and company handbooks.
                 </p>
                 <Link to="/solutions/hr" className="inline-flex items-center gap-2 text-[15px] font-bold text-[#171717] group-hover:text-[#D97745] transition-colors border-b-2 border-transparent group-hover:border-[#D97745] pb-1 self-start">
                   Explore HR <span>→</span>
                 </Link>
              </div>

              {/* Education */}
              <div className="bg-[#FDFCF8] border border-[#E8E5DF] p-10 md:p-12 shadow-md group relative flex flex-col mt-4 md:mt-16 rotate-[-1deg] hover:rotate-0 transition-all duration-300 z-10 hover:z-20 hover:shadow-xl">
                 <div className="absolute -top-3 -right-3">
                   <IconTerminal className="w-8 h-8 text-[#171717] opacity-0" /> {/* Just a spacer if needed, or add paperclip */}
                 </div>
                 <div className="w-12 h-12 bg-white border border-[#E8E5DF] flex items-center justify-center mb-8 rotate-[2deg] shadow-sm">
                   <IconBook className="w-6 h-6 text-[#171717]" />
                 </div>
                 <h3 className="text-[28px] font-black tracking-tight text-[#171717] mb-4 font-serif">Education</h3>
                 <p className="text-[16px] text-[#7A7870] font-medium leading-relaxed mb-8 flex-grow">
                   Lecture notes, collaborative classrooms, research projects, and assignments.
                 </p>
                 <Link to="/solutions/education" className="inline-flex items-center gap-2 text-[15px] font-bold text-[#171717] group-hover:text-[#D97745] transition-colors border-b-2 border-transparent group-hover:border-[#D97745] pb-1 self-start">
                   Explore Education <span>→</span>
                 </Link>
              </div>

           </div>
        </div>

        {/* ─── CUSTOMER QUOTE ────────────────────────────────────────────── */}
        <div className="mb-20 text-center">
           <div className="bg-white border border-[#E8E5DF] rounded-sm p-12 shadow-sm rotate-[1deg] max-w-4xl mx-auto relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-red-400/20 border-b border-red-400/40 rotate-[-2deg] shadow-sm" />
              <blockquote className="text-[24px] md:text-[32px] font-serif font-bold text-[#171717] leading-tight mb-8">
                "Notely replaced six different tools and became our team's second brain."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-[#171717] text-white flex items-center justify-center font-black font-mono">O</div>
                 <div className="text-left">
                    <div className="font-bold text-[#171717]">Olivia Chen</div>
                    <div className="text-[14px] text-[#A0A09A] font-medium">Head of Operations, Bright Labs</div>
                 </div>
              </div>
           </div>
        </div>

        {/* ─── FINAL CTA ─────────────────────────────────────────────────── */}
        <div className="text-center pb-8">
          <h2 className="text-[40px] md:text-[56px] font-black tracking-tight text-[#171717] leading-[1.05] mb-6 max-w-[800px] mx-auto">
            Every team deserves a better workspace.
          </h2>
          <p className="text-[18px] text-[#7A7870] font-medium leading-relaxed max-w-[500px] mx-auto mb-10">
            Start with one note. Scale to your entire organization.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/register" className="w-full sm:w-auto relative group">
               <div className="absolute inset-0 bg-[#D97745] rounded-sm translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
               <div className="relative bg-[#171717] border-2 border-[#171717] text-white px-8 py-3 rounded-sm font-bold text-[15px] shadow-sm transform group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                 Get Started
               </div>
             </Link>
             <Link to="/contact" className="w-full sm:w-auto relative group">
                <div className="absolute inset-0 bg-[#E8E5DF] rounded-sm translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
                <div className="relative bg-[#FDFCF8] border border-[#E8E5DF] text-[#171717] px-8 py-3 rounded-sm font-bold text-[15px] shadow-sm transform group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                  Book Demo
                </div>
              </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
