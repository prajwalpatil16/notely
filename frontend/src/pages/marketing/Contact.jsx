import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconOwl, 
  IconCrane, 
  IconNotebook,
  IconCoffee
} from '../../components/CompanyIllustrations';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send data to backend here.
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-24 pb-16 overflow-hidden selection:bg-[#D97745]/20">
      
      {/* Background Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* ─── SPLIT LAYOUT ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-8">
          
          {/* Left Column - Illustration & Messaging */}
          <div className="flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-[48px] md:text-[64px] font-black tracking-tight text-[#171717] leading-[1.05] mb-6">
                Need help?<br/>Let's talk.
              </h1>
              <p className="text-[18px] text-[#7A7870] font-medium leading-relaxed max-w-[400px]">
                Whether you need help setting up an enterprise workspace or just have a question, our team is ready.
              </p>
            </motion.div>

            <div className="relative h-[300px] w-full mt-12 hidden md:block">
               <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 flex gap-8 items-end"
               >
                  <IconNotebook className="w-32 h-32 text-[#171717] opacity-80" />
                  <IconCoffee className="w-20 h-20 text-[#171717] opacity-80 mb-2" />
                  
                  <motion.div 
                    className="absolute -top-10 left-10 bg-white border border-[#E8E5DF] px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <span className="text-[14px] font-bold text-[#171717]">Hi there! 👋</span>
                  </motion.div>

                  <motion.div 
                    className="absolute -top-16 right-10"
                    animate={{ x: [0, -10, 0], y: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <IconCrane className="w-16 h-16" />
                  </motion.div>

                  <IconOwl className="absolute bottom-4 -right-4 w-12 h-12 opacity-80" />
               </motion.div>
            </div>
          </div>

          {/* Right Column - Minimal Form */}
          <div>
            <div className="bg-[#FDFCF8] border border-[#E8E5DF] rounded-3xl p-8 md:p-10 shadow-sm relative">
              {submitted ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-[#EDF3EE] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-[24px] text-[#5D8A63]">✓</span>
                  </div>
                  <h3 className="text-[24px] font-black text-[#171717] mb-2">Message sent</h3>
                  <p className="text-[#7A7870] font-medium">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-[13px] font-bold text-[#5B5B5B] mb-2 uppercase tracking-wide">Name</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      className="w-full bg-white border border-[#E8E5DF] rounded-xl px-4 py-3 text-[15px] font-medium text-[#171717] focus:outline-none focus:border-[#D97745] focus:ring-1 focus:ring-[#D97745] transition-all"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-[13px] font-bold text-[#5B5B5B] mb-2 uppercase tracking-wide">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      className="w-full bg-white border border-[#E8E5DF] rounded-xl px-4 py-3 text-[15px] font-medium text-[#171717] focus:outline-none focus:border-[#D97745] focus:ring-1 focus:ring-[#D97745] transition-all"
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[13px] font-bold text-[#5B5B5B] mb-2 uppercase tracking-wide">Message</label>
                    <textarea 
                      id="message"
                      required
                      rows="4"
                      className="w-full bg-white border border-[#E8E5DF] rounded-xl px-4 py-3 text-[15px] font-medium text-[#171717] focus:outline-none focus:border-[#D97745] focus:ring-1 focus:ring-[#D97745] transition-all resize-none"
                      placeholder="How can we help?"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#171717] hover:bg-[#2A2A2A] text-white rounded-xl py-3.5 font-bold text-[15px] transition-all shadow-sm active:scale-[0.98]"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 px-4">
              <div>
                <div className="text-[12px] font-bold text-[#A0A09A] uppercase tracking-wider mb-1">Avg Response</div>
                <div className="text-[18px] font-black text-[#171717]">&lt; 2 hours</div>
              </div>
              <div>
                <div className="text-[12px] font-bold text-[#A0A09A] uppercase tracking-wider mb-1">Satisfaction</div>
                <div className="text-[18px] font-black text-[#171717]">98%</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-[12px] font-bold text-[#A0A09A] uppercase tracking-wider mb-1">Rating</div>
                <div className="text-[18px] font-black text-[#D97745] tracking-widest">★★★★★</div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── DIRECT EMAILS (COMPACT) ─────────────────────────────────────────────── */}
        <div className="max-w-[900px] mx-auto bg-white border border-[#E8E5DF] rounded-2xl shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#E8E5DF] overflow-hidden">
          
          {/* Sales */}
          <div className="flex-1 p-6 md:p-8 hover:bg-[#FDFCF8] transition-colors group">
             <div className="flex items-center gap-4 mb-3">
               <div className="w-10 h-10 rounded-full bg-white border border-[#E8E5DF] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                 <IconNotebook className="w-5 h-5 text-[#171717]" />
               </div>
               <h3 className="text-[18px] font-black text-[#171717]">Sales</h3>
             </div>
             <p className="text-[14px] text-[#7A7870] font-medium mb-5">Enterprise pricing and custom contracts.</p>
             <a href="mailto:sales@notely.com" className="text-[14px] font-bold text-[#171717] hover:underline flex items-center gap-1">sales@notely.com <span>→</span></a>
          </div>

          {/* Support */}
          <div className="flex-1 p-6 md:p-8 hover:bg-[#FEF9E6] transition-colors group bg-[#FCEBA7]/5">
             <div className="flex items-center gap-4 mb-3">
               <div className="w-10 h-10 rounded-full bg-white border border-[#E8E5DF] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                 <IconCoffee className="w-5 h-5 text-[#D97745]" />
               </div>
               <h3 className="text-[18px] font-black text-[#171717]">Support</h3>
             </div>
             <p className="text-[14px] text-[#7A7870] font-medium mb-5">Help with billing, bugs, or usage.</p>
             <a href="mailto:support@notely.com" className="text-[14px] font-bold text-[#D97745] hover:underline flex items-center gap-1">support@notely.com <span>→</span></a>
          </div>

          {/* Press */}
          <div className="flex-1 p-6 md:p-8 hover:bg-[#F6F9F7] transition-colors group">
             <div className="flex items-center gap-4 mb-3">
               <div className="w-10 h-10 rounded-full bg-white border border-[#E8E5DF] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                 <IconOwl className="w-5 h-5 text-[#5D8A63]" />
               </div>
               <h3 className="text-[18px] font-black text-[#171717]">Press</h3>
             </div>
             <p className="text-[14px] text-[#7A7870] font-medium mb-5">Media inquiries and brand assets.</p>
             <a href="mailto:press@notely.com" className="text-[14px] font-bold text-[#5D8A63] hover:underline flex items-center gap-1">press@notely.com <span>→</span></a>
          </div>

        </div>

      </div>
    </div>
  );
}
