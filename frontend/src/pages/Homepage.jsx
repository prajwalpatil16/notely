import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import logoLockup from '../assets/notely-logo-lockup.svg';
import logoIcon from '../assets/notely-logo-icon.svg';

export default function Homepage() {
  const token = useAuthStore(state => state.token);

  return (
    <div className="min-h-screen bg-[#F6F1EA] text-[#2B2622] font-sans selection:bg-[#D9663B]/10 selection:text-[#D9663B] pb-24">
      
      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between select-none">
        <Link to="/" className="flex items-center">
          <img 
            src={logoLockup} 
            alt="notely" 
            className="h-10 cursor-pointer object-contain"
          />
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            to={token ? "/dashboard" : "/login"} 
            className="text-xs font-bold text-[#6B6B6B] hover:text-[#2B2622] transition-colors"
          >
            {token ? "Dashboard" : "Log in"}
          </Link>
          <Link 
            to={token ? "/dashboard" : "/register"} 
            className="px-4 py-2 bg-[#D9663B] hover:bg-[#C44625] text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-[#D9663B]/10"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-2xl mx-auto px-6 pt-24 pb-32 text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight leading-[1.15] mb-6">
          Notely remembers, so you don't have to.
        </h1>
        <p className="text-sm sm:text-base text-[#6B6B6B] font-medium max-w-lg leading-[1.65] mb-8">
          Write your thoughts down. Ask about them later. Notely answers using only what you've actually written.
        </p>
        <Link 
          to={token ? "/dashboard" : "/register"} 
          className="px-6 py-3.5 bg-[#D9663B] hover:bg-[#C44625] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#D9663B]/15"
        >
          Get started
        </Link>
      </header>

      {/* Content Canvas / Screenshots Sections */}
      <div className="max-w-3xl mx-auto px-6 space-y-36">
        
        {/* Section 1 — The product, shown once, plainly */}
        <section className="space-y-6">
          {/* Plain Product Mockup */}
          <div className="w-full border border-[#E5E3DF] bg-white rounded-2xl shadow-xl overflow-hidden p-4 aspect-[16/10] bg-slate-50 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-200/50" />
            <div className="w-full h-full bg-white rounded-xl border border-slate-150 shadow-inner flex overflow-hidden text-left text-[10px]">
              {/* Sidebar */}
              <div className="w-40 bg-[#F7F7F5] border-r border-[#E5E3DF] p-3 space-y-4">
                <div className="w-16 h-3 bg-slate-200 rounded" />
                <div className="w-full h-7 bg-[#D9663B]/10 rounded border border-[#D9663B]/20" />
                <div className="space-y-2 pt-2">
                  <div className="w-20 h-2.5 bg-slate-300 rounded" />
                  <div className="w-28 h-5 bg-slate-200 rounded-md" />
                  <div className="w-24 h-5 bg-slate-200 rounded-md" />
                </div>
              </div>
              {/* Note Editor */}
              <div className="flex-1 p-6 flex flex-col gap-3 relative">
                <div className="w-36 h-6 bg-slate-200 rounded-md" />
                <div className="w-10 h-4 bg-[#F3D9C8] rounded" />
                <div className="space-y-2 mt-2">
                  <div className="w-full h-3.5 bg-slate-150 rounded" />
                  <div className="w-11/12 h-3.5 bg-slate-100 rounded" />
                  <div className="w-3/4 h-3.5 bg-slate-100 rounded" />
                </div>
              </div>
              {/* AI Companion Slide panel */}
              <div className="w-56 bg-white border-l border-[#E5E3DF] p-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-24 h-3 bg-slate-200 rounded" />
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-slate-500 font-semibold">
                    What was the budget proposal details?
                  </div>
                  <div className="text-slate-600 pl-1 border-l border-slate-200 leading-relaxed">
                    Based on your notes, the Q3 budget proposal was $12,500.
                  </div>
                  {/* Citation chip */}
                  <div className="text-[8px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-500 inline-block font-bold">
                    From: Q3 Budget Notes
                  </div>
                </div>
                <div className="w-full h-7 bg-[#F7F7F5] border border-slate-200 rounded" />
              </div>
            </div>
          </div>
          <p className="text-xs font-semibold text-[#6B6B6B] text-center leading-relaxed max-w-lg mx-auto">
            Ask a question. Get an answer from your own notes, with a link back to where it came from.
          </p>
        </section>

        {/* Section 2 — One idea, stated once */}
        <section className="space-y-10 flex flex-col items-center">
          <div className="max-w-2xl text-center space-y-4">
            <p className="text-sm sm:text-base text-[#2B2622] font-semibold leading-[1.65]">
              Most notes apps are good at storing what you write and bad at helping you find it again. Notely connects related notes on its own, so a thought from three months ago resurfaces exactly when it's relevant — not just when you happen to remember to search for it.
            </p>
          </div>
          {/* Knowledge Map Mockup */}
          <div className="w-full max-w-xl border border-[#E5E3DF] bg-white rounded-2xl shadow-xl overflow-hidden p-6 aspect-[16/10] bg-slate-50 relative flex items-center justify-center">
            <svg className="w-full h-full opacity-60" viewBox="0 0 400 240">
              <g className="edge-flow" stroke="#E5E3DF" strokeWidth="2">
                <line x1="80" y1="120" x2="200" y2="70" />
                <line x1="80" y1="120" x2="200" y2="170" />
                <line x1="200" y1="70" x2="320" y2="120" />
                <line x1="200" y1="170" x2="320" y2="120" />
              </g>
              <circle cx="80" cy="120" r="16" fill="#D9663B" />
              <text x="80" y="124" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">N1</text>
              
              <circle cx="200" cy="70" r="16" fill="#5B4B8A" />
              <text x="200" y="74" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">N2</text>
              
              <circle cx="200" cy="170" r="16" fill="#5B4B8A" />
              <text x="200" y="174" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">N3</text>
              
              <circle cx="320" cy="120" r="16" fill="#D9663B" />
              <text x="320" y="124" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">N4</text>
            </svg>
          </div>
        </section>

        {/* Section 3 — One more idea, same treatment */}
        <section className="space-y-6 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-sm sm:text-base text-[#2B2622] font-semibold leading-[1.65]">
              Everything you write gets organized without extra effort — tags get suggested and applied, not just suggested and left for you to deal with.
            </p>
          </div>
        </section>

        {/* Closing Section */}
        <section className="pt-16 pb-12 text-center flex flex-col items-center select-none border-t border-[#E5E3DF]">
          <h2 className="text-3xl font-display font-black text-[#2B2622] mb-6">
            Start writing somewhere that remembers.
          </h2>
          <Link 
            to={token ? "/dashboard" : "/register"} 
            className="px-6 py-3.5 bg-[#D9663B] hover:bg-[#C44625] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#D9663B]/15"
          >
            Get started
          </Link>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-[#E5E3DF] mt-24 pt-16 text-[#6B6B6B] font-semibold text-[11px] bg-transparent select-none">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          <div className="grid grid-cols-3 gap-16 md:gap-24 mb-12 text-center">
            <div className="space-y-3.5">
              <span className="text-dark block font-bold uppercase tracking-wider text-[9px] text-slate-400">Product</span>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-dark">Features</a></li>
                <li><a href="#" className="hover:text-dark">Pricing</a></li>
              </ul>
            </div>
            <div className="space-y-3.5">
              <span className="text-dark block font-bold uppercase tracking-wider text-[9px] text-slate-400">Company</span>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-dark">About</a></li>
                <li><a href="#" className="hover:text-dark">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-3.5">
              <span className="text-dark block font-bold uppercase tracking-wider text-[9px] text-slate-400">Legal</span>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-dark">Privacy</a></li>
                <li><a href="#" className="hover:text-dark">Terms</a></li>
              </ul>
            </div>
          </div>
          
          {/* Logo & Year Line */}
          <div className="flex flex-col items-center gap-3.5 pt-4">
            <img 
              src={logoIcon} 
              alt="Notely Icon" 
              className="h-6 object-contain"
            />
            <span className="text-[10px] text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} Notely. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
