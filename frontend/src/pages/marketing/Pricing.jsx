import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SPRING = { type: 'spring', stiffness: 200, damping: 20 };

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: "Free",
      desc: "Perfect for personal notes and styling draft pages.",
      price: 0,
      cta: "Get Started Free",
      features: [
        "Unlimited notes & documents",
        "Up to 5 team editors",
        "100 MB total storage capacity",
        "Community support access"
      ]
    },
    {
      name: "Pro",
      desc: "For growing builders and specialists needing deep tools.",
      price: billingPeriod === 'monthly' ? 8 : 6,
      cta: "Get Pro",
      highlight: true,
      features: [
        "Unlimited collaborators",
        "10 GB storage space per user",
        "30-day version history",
        "Advanced sharing permissions",
        "Custom tag schemes"
      ]
    },
    {
      name: "Business",
      desc: "For full-scale departments, squads, and workspaces.",
      price: billingPeriod === 'monthly' ? 15 : 12,
      cta: "Get Business",
      features: [
        "Workspace audit logs",
        "Unlimited version history",
        "SAML SSO & OAuth integrations",
        "100 GB storage per user",
        "Priority 24/7 support line"
      ]
    },
    {
      name: "Enterprise",
      desc: "For high-compliance corporations with auditing needs.",
      price: "Custom",
      cta: "Contact Sales",
      features: [
        "Dedicated server allocations",
        "Whitelisted IP constraints",
        "Custom SLA agreements",
        "Dedicated account manager",
        "Custom migrations support"
      ]
    }
  ];

  return (
    <div className="py-24 px-6 max-w-6xl mx-auto space-y-20 relative select-none">
      
      {/* ── BACKGROUND ACCENTS ────────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#D97745]/[0.03] to-transparent pointer-events-none -z-10" />

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-5 max-w-2xl mx-auto">

        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
          className="text-[clamp(2.2rem,4vw,3.2rem)] font-black tracking-[-0.03em] leading-[1.08] text-[#171717]"
        >
          Built for teams of <span className="text-[#4D7C5A]">any size.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[16px] text-[#7A7870] leading-[1.65] font-[450] max-w-xl mx-auto"
        >
          Start writing for free. Adjust licenses or swap plans dynamically as your knowledge base expands.
        </motion.p>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-1.5 pt-8"
        >
          <div className="bg-[#EAE7E0] p-1.5 rounded-xl inline-flex relative shadow-inner">
            <button 
              onClick={() => setBillingPeriod('monthly')}
              className={`relative px-5 py-2.5 rounded-lg text-[13.5px] font-bold transition-all z-10 ${billingPeriod === 'monthly' ? 'text-[#171717]' : 'text-[#7A7870] hover:text-[#171717]'}`}
            >
              {billingPeriod === 'monthly' && (
                <motion.div
                  layoutId="billing-pill"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                  transition={SPRING}
                />
              )}
              Monthly
            </button>
            <button 
              onClick={() => setBillingPeriod('annual')}
              className={`relative px-5 py-2.5 rounded-lg text-[13.5px] font-bold transition-all z-10 flex items-center gap-2 ${billingPeriod === 'annual' ? 'text-[#171717]' : 'text-[#7A7870] hover:text-[#171717]'}`}
            >
              {billingPeriod === 'annual' && (
                <motion.div
                  layoutId="billing-pill"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                  transition={SPRING}
                />
              )}
              Annually
              <span className="bg-[#D97745]/10 text-[#D97745] px-1.5 py-0.5 rounded-[4px] text-[10px] font-black uppercase tracking-wider">Save 20%</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── PRICING CARDS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch relative z-10">
        {plans.map((p, index) => (
          <motion.div 
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.4 + index * 0.1 }}
            className={`flex flex-col justify-between transition-all ${
              p.highlight 
                ? 'bg-[#FEFCF9] border-[2px] border-[#D97745] rounded-3xl p-8 relative shadow-[0_12px_40px_rgba(217,119,69,0.12)] scale-100 lg:scale-[1.03] z-10' 
                : 'bg-white border border-[#E8E5DF] rounded-3xl p-8 shadow-sm hover:shadow-md'
            }`}
          >
            {p.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D97745] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-sm flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                Most Popular
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <h3 className="text-[18px] font-black text-[#171717] tracking-tight mb-1.5">{p.name}</h3>
                <p className="text-[13.5px] text-[#7A7870] leading-[1.6]">{p.desc}</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-[42px] font-black text-[#171717] tracking-[-0.04em] leading-none">
                  {typeof p.price === 'number' ? `$${p.price}` : p.price}
                </span>
                {typeof p.price === 'number' && (
                  <span className="text-[13px] text-[#A0A09A] font-medium mb-1.5">/ user / mo</span>
                )}
              </div>
              
              <ul className="space-y-3.5 pt-4">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-[1.4]">
                    <svg viewBox="0 0 24 24" fill="none" stroke={p.highlight ? "#D97745" : "#4D7C5A"} strokeWidth="3" className="w-4 h-4 mt-0.5 shrink-0" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="text-[14px] text-[#5B5B5B] font-[450]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Link 
              to="/register" 
              className={`w-full text-center px-4 py-3 rounded-xl text-[14.5px] font-bold mt-8 transition-all flex items-center justify-center gap-2 ${
                p.highlight 
                  ? 'bg-[#D97745] hover:bg-[#C25C2B] text-white shadow-sm' 
                  : 'bg-white border border-[#E8E5DF] hover:bg-[#FAF8F3] text-[#171717]'
              }`}
            >
              {p.cta}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── COMPARISON TABLE ──────────────────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="pt-16 max-w-5xl mx-auto overflow-x-auto"
      >
        <div className="text-center mb-10">
          <h2 className="text-[24px] font-black text-[#171717] tracking-[-0.02em] mb-2">Compare every capability</h2>
          <p className="text-[15px] text-[#7A7870]">A detailed breakdown of what's included in each plan.</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8E5DF] p-8 shadow-sm">
          <table className="w-full text-[14px] text-[#171717] border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E8E5DF] text-[#A0A09A]">
                <th className="py-4 font-bold text-[12px] uppercase tracking-wider text-left w-1/3">Feature Set</th>
                <th className="py-4 font-bold text-[12px] uppercase tracking-wider text-left">Free</th>
                <th className="py-4 font-bold text-[12px] uppercase tracking-wider text-left text-[#D97745]">Pro</th>
                <th className="py-4 font-bold text-[12px] uppercase tracking-wider text-left">Business</th>
                <th className="py-4 font-bold text-[12px] uppercase tracking-wider text-left">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-[#E8E5DF]">
              {[
                { label: 'Collaborators limit', f: '5 members', p: 'Unlimited', b: 'Unlimited', e: 'Unlimited' },
                { label: 'Total workspace pages', f: 'Unlimited', p: 'Unlimited', b: 'Unlimited', e: 'Unlimited' },
                { label: 'Max upload capacity', f: '5 MB', p: '100 MB', b: '1 GB', e: 'Unlimited' },
                { label: 'Document history', f: '—', p: '30 days', b: 'Unlimited', e: 'Exportable' },
                { label: 'SAML SSO', f: '—', p: '—', b: '✓', e: '✓' },
                { label: 'Support channels', f: 'Community', p: 'Priority', b: '24/7 Priority', e: 'Custom SLAs' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAF8F3]/50 transition-colors">
                  <td className="py-4.5 font-bold">{row.label}</td>
                  <td className="py-4.5 text-[#5B5B5B]">{row.f}</td>
                  <td className="py-4.5 text-[#D97745] font-semibold">{row.p}</td>
                  <td className="py-4.5 text-[#5B5B5B]">{row.b}</td>
                  <td className="py-4.5 text-[#5B5B5B]">{row.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
