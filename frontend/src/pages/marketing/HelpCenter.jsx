import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconOwl, 
  IconSprout, 
  IconPencil, 
  IconNotebook,
  IconStickyNote,
  IconCoffee,
  IconShieldCheck,
  PaperClip,
  IconCrane,
  DoodleArrow
} from '../../components/CompanyIllustrations';

const categories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: <IconSprout className="w-8 h-8 text-[#5D8A63]" />,
    articles: [
      { id: "create-first-note", title: "Create your first workspace", readTime: "2 min" },
      { id: "import-markdown", title: "Importing markdown files", readTime: "3 min" },
      { id: "invite-team", title: "Inviting team members", readTime: "1 min" }
    ]
  },
  {
    id: "workspaces",
    name: "Workspaces & Folders",
    icon: <IconNotebook className="w-8 h-8 text-[#171717]" />,
    articles: [
      { id: "nesting-pages", title: "Infinite page nesting", readTime: "4 min" },
      { id: "workspace-settings", title: "Workspace permissions", readTime: "3 min" },
      { id: "custom-templates", title: "Creating custom templates", readTime: "5 min" }
    ]
  },
  {
    id: "account-billing",
    name: "Account & Billing",
    icon: <IconShieldCheck className="w-8 h-8 text-[#171717]" />,
    articles: [
      { id: "annual-discount", title: "Annual billing discounts", readTime: "1 min" },
      { id: "update-profile", title: "Update profile & passwords", readTime: "2 min" },
      { id: "invoice-history", title: "Viewing invoice history", readTime: "1 min" }
    ]
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const allArticles = [];
  categories.forEach(cat => {
    cat.articles.forEach(art => {
      allArticles.push({ ...art, catName: cat.name });
    });
  });

  const searchedArticles = searchQuery.trim() === ''
    ? []
    : allArticles.filter(art => 
        art.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-24 pb-32 overflow-hidden selection:bg-[#D97745]/20">
      
      {/* Background Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        
        {/* ─── HERO & SEARCH ────────────────────────────────────────────── */}
        <div className="relative mb-24 flex flex-col items-center justify-center text-center">
          
          <motion.div 
            animate={{ y: [0, -5, 0], rotate: [-2, 0, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8 relative"
          >
            <div className="bg-white border border-[#E8E5DF] p-6 shadow-md rounded-lg rotate-[-2deg]">
              <IconOwl className="w-20 h-20 text-[#171717]" />
            </div>
            <div className="absolute -top-4 -right-6 bg-[#FEF4EC] px-3 py-1 border border-[#E8E5DF] rotate-[10deg] shadow-sm">
              <span className="text-[12px] font-mono font-bold text-[#D97745]">I can help!</span>
            </div>
          </motion.div>

          <h1 className="text-[48px] md:text-[64px] font-black tracking-tight text-[#171717] leading-[1] mb-8 font-serif italic">
            How can our Owl help?
          </h1>

          {/* Premium Search Bar */}
          <div className="w-full max-w-[600px] relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D97745]/20 via-transparent to-[#D97745]/20 rounded-xl blur-md" />
            <div className="relative bg-white border border-[#171717] border-2 rounded-xl p-2 flex shadow-sm">
              <div className="flex-1 flex items-center px-4">
                <svg className="w-5 h-5 text-[#A0A09A] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search for guides, tutorials, or troubleshooting..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-[16px] font-medium text-[#171717] placeholder:text-[#A0A09A]"
                />
              </div>
              <button className="px-6 py-3 bg-[#171717] text-white font-bold rounded-lg hover:bg-[#2A2A2A] transition-colors shadow-md">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* ─── SEARCH RESULTS ───────────────────────────────────────────── */}
        {searchQuery && (
          <div className="mb-24 bg-white border border-[#E8E5DF] rounded-sm p-8 shadow-md">
            <h3 className="font-mono text-[12px] font-black text-[#A0A09A] uppercase tracking-widest mb-6">Search Results</h3>
            {searchedArticles.length > 0 ? (
              <div className="space-y-4">
                {searchedArticles.map(art => (
                  <Link to="#" key={art.id} className="group block p-4 border border-[#E8E5DF] rounded-sm hover:border-[#171717] transition-all bg-[#FDFCF8] hover:shadow-sm">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[16px] font-bold text-[#171717] group-hover:underline decoration-2 underline-offset-4">{art.title}</h4>
                      <span className="text-[12px] font-mono text-[#A0A09A]">{art.catName}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <IconCoffee className="w-12 h-12 text-[#A0A09A] mx-auto mb-4 opacity-50" />
                <p className="text-[15px] text-[#7A7870] font-medium">No articles found matching "{searchQuery}".<br/>Try searching for "workspace" or "billing".</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TACTILE CATEGORIES ───────────────────────────────────────── */}
        {!searchQuery && (
          <div className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat, idx) => (
                <div key={cat.id} className={`bg-[#FDFCF8] border border-[#E8E5DF] p-8 rounded-sm shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-xl ${idx % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'}`}>
                  
                  {/* Ledger Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-red-400/20" />
                  
                  <div className="relative z-10 pl-4">
                    <div className="mb-6 bg-white w-14 h-14 flex items-center justify-center rounded-sm border border-[#E8E5DF] shadow-sm rotate-[-2deg]">
                      {cat.icon}
                    </div>
                    <h3 className="text-[22px] font-black tracking-tight text-[#171717] mb-6 font-serif leading-tight">
                      {cat.name}
                    </h3>
                    
                    <ul className="space-y-4">
                      {cat.articles.map(art => (
                        <li key={art.id}>
                          <Link to="#" className="group flex flex-col items-start">
                            <span className="text-[15px] font-bold text-[#171717] group-hover:text-[#D97745] transition-colors group-hover:underline decoration-1 underline-offset-4">
                              {art.title}
                            </span>
                            <span className="text-[12px] font-mono text-[#A0A09A] mt-1">
                              {art.readTime} read
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    
                    <Link to="#" className="inline-block mt-8 text-[13px] font-black font-mono text-[#171717] hover:text-[#D97745] uppercase tracking-widest border-b-2 border-transparent hover:border-[#D97745] transition-all">
                      View all →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── POPULAR TASKS & SHORTCUTS (STICKY NOTES) ─────────────────── */}
        {!searchQuery && (
          <div className="mb-24">
            <h2 className="text-[28px] font-black tracking-tight text-[#171717] font-serif italic mb-8 text-center">Interactive Tutorials & Shortcuts</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <Link to="#" className="bg-[#FEF4EC] p-6 shadow-md border border-[#E8E5DF] rotate-[-2deg] hover:rotate-0 hover:shadow-lg transition-all h-48 flex flex-col justify-between">
                <div>
                  <PaperClip className="w-5 h-5 text-[#171717] absolute -top-2 left-6" />
                  <h4 className="text-[18px] font-bold text-[#171717] mt-2 font-serif">Keyboard Shortcuts</h4>
                  <p className="text-[13px] text-[#7A7870] mt-2">Navigate Notely without touching the mouse.</p>
                </div>
                <div className="text-[11px] font-mono font-bold text-[#D97745] uppercase tracking-widest">Cheatsheet</div>
              </Link>

              <Link to="#" className="bg-white p-6 shadow-md border border-[#E8E5DF] rotate-[1deg] hover:-rotate-1 hover:shadow-lg transition-all h-48 flex flex-col justify-between relative">
                <div className="absolute top-2 right-2 w-3 h-3 bg-red-400/80 rounded-full shadow-inner" />
                <div>
                  <h4 className="text-[18px] font-bold text-[#171717] mt-2 font-serif">Markdown Guide</h4>
                  <p className="text-[13px] text-[#7A7870] mt-2">Master syntax formatting in minutes.</p>
                </div>
                <div className="text-[11px] font-mono font-bold text-[#A0A09A] uppercase tracking-widest">Guide</div>
              </Link>

              <Link to="#" className="bg-[#F8F5EF] p-6 shadow-[4px_4px_0px_#171717] border border-[#171717] border-2 rotate-[-1deg] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_#171717] transition-all h-48 flex flex-col justify-between">
                <div>
                  <IconCrane className="w-8 h-8 text-[#171717] mb-2" />
                  <h4 className="text-[18px] font-bold text-[#171717] font-serif">API Quickstart</h4>
                  <p className="text-[13px] text-[#5B5B5B] mt-2 font-mono">Build custom integrations.</p>
                </div>
                <div className="text-[11px] font-mono font-bold text-[#171717] uppercase tracking-widest">Developer</div>
              </Link>

              <Link to="#" className="bg-white p-6 shadow-md border border-[#E8E5DF] rotate-[3deg] hover:rotate-1 hover:shadow-lg transition-all h-48 flex flex-col justify-between">
                <div>
                  <IconPencil className="w-8 h-8 text-[#5D8A63] mb-2" />
                  <h4 className="text-[18px] font-bold text-[#171717] font-serif">Writing Templates</h4>
                  <p className="text-[13px] text-[#7A7870] mt-2">Pre-built formats for PRDs and meetings.</p>
                </div>
                <div className="text-[11px] font-mono font-bold text-[#5D8A63] uppercase tracking-widest">Resource</div>
              </Link>

            </div>
          </div>
        )}

        {/* ─── BOTTOM CTA ────────────────────────────────────────────────── */}
        <div className="text-center py-12 md:py-16 bg-[#FDFCF8] rounded-3xl shadow-sm relative overflow-hidden border border-[#E8E5DF]">
          
          <IconStickyNote className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.03] text-[#D97745]" />
          <DoodleArrow className="absolute top-10 left-10 w-24 h-24 opacity-10 rotate-180" />

          <div className="relative z-10 max-w-[600px] mx-auto px-6">
            <h2 className="text-[28px] md:text-[36px] font-black tracking-tight text-[#171717] mb-4">
              Still need help?
            </h2>
            <p className="text-[16px] text-[#7A7870] font-medium mb-8 max-w-[400px] mx-auto">
              Can't find what you're looking for? Our support team is full of real humans ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="px-8 py-3.5 bg-white border border-[#171717] border-2 text-[#171717] rounded-sm font-bold text-[15px] transition-all shadow-sm active:translate-y-1">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
