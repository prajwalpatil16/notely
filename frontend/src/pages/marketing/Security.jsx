import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconOwl, 
  IconShield,
  IconNotebook,
  DoodleArrow,
  IconVault,
  IconServer,
  IconKey,
  IconLock,
  IconShieldCheck,
  PaperClip
} from '../../components/CompanyIllustrations';

export default function Security() {
  const [activeFaqTab, setActiveFaqTab] = useState('general');
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqData = {
    general: [
      { q: "Where is my data stored?", a: "Workspace data is securely hosted on enterprise cloud infrastructure with encrypted storage and regional redundancy." },
      { q: "Is my data encrypted?", a: "Yes. All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption." },
      { q: "How often are backups created?", a: "Incremental encrypted backups are created continuously, with point-in-time recovery available for enterprise customers." }
    ],
    privacy: [
      { q: "Do you train AI models on my documents?", a: "No. Your private workspace content is never used to train public AI models." },
      { q: "Can I export my data?", a: "Yes. You can export your entire workspace at any time in Markdown, PDF, or JSON formats." }
    ],
    enterprise: [
      { q: "Do you support SSO?", a: "Enterprise workspaces can integrate with SAML-based identity providers such as Okta, Azure AD, and Google Workspace." }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-16 pb-16 overflow-hidden selection:bg-[#171717]/10">
      
      {/* Background Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* ─── HERO SECTION ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 pt-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[48px] md:text-[64px] font-black tracking-tight text-[#171717] leading-[1.05] mb-6">
              Security isn't a feature.<br/>
              It's built into every page.
            </h1>
            <p className="text-[18px] text-[#7A7870] font-medium leading-relaxed max-w-[480px] mb-10">
              Your workspace deserves enterprise-grade protection from day one. Every note, document, and collaboration is protected by modern encryption, strict access controls, and resilient infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/docs/security" className="w-full sm:w-auto relative group">
                <div className="absolute inset-0 bg-[#171717] rounded-sm translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
                <div className="relative bg-white border-2 border-[#171717] text-[#171717] px-8 py-3 rounded-sm font-bold text-[15px] shadow-sm transform group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                  Read Security Docs
                </div>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto relative group">
                <div className="absolute inset-0 bg-[#E8E5DF] rounded-sm translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
                <div className="relative bg-[#FDFCF8] border border-[#E8E5DF] text-[#171717] px-8 py-3 rounded-sm font-bold text-[15px] shadow-sm transform group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                  Talk to Sales
                </div>
              </Link>
            </div>
          </motion.div>
          
          <div className="relative w-full flex items-center justify-center mt-12 lg:mt-0">
             <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex items-center justify-center w-full max-w-[400px] h-[350px]"
             >
                {/* Blueprint Background Grid for tactile feel */}
                <div className="absolute inset-0 bg-[linear-gradient(#E8E5DF_1px,transparent_1px),linear-gradient(90deg,#E8E5DF_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-50 rounded-xl" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-multiply">
                   <svg width="100%" height="100%" className="absolute pointer-events-none">
                     <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#171717" strokeWidth="1" strokeDasharray="4 4" />
                     <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="#171717" strokeWidth="1" strokeDasharray="4 4" />
                     <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="#171717" strokeWidth="1" strokeDasharray="4 4" />
                   </svg>
                </div>
                
                {/* Center Vault (White Card) */}
                <div className="bg-white border-2 border-[#171717] p-6 shadow-md rounded-lg relative z-20 hover:scale-105 transition-transform rotate-[-1deg]">
                  <IconVault className="w-24 h-24 text-[#171717]" />
                </div>
                
                {/* Notebook Log */}
                <motion.div 
                  className="absolute top-[10%] left-[10%] bg-[#FDFCF8] p-3 rounded-md shadow-sm border border-[#E8E5DF] rotate-[-5deg]"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <IconNotebook className="w-8 h-8 text-[#171717]" />
                </motion.div>

                {/* Key / Lock */}
                <motion.div 
                  className="absolute top-[15%] right-[10%] bg-white p-3 rounded-md shadow-sm border border-[#E8E5DF] rotate-[8deg]"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <IconLock className="w-8 h-8 text-[#171717]" />
                </motion.div>
                
                {/* Owl Guard */}
                <motion.div 
                  className="absolute bottom-[5%] right-[5%] z-30"
                  animate={{ y: [0, -5, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <div className="bg-white border border-[#E8E5DF] p-2 shadow-sm rounded-full rotate-[12deg]">
                    <IconOwl className="w-14 h-14 text-[#171717]" />
                  </div>
                </motion.div>
             </motion.div>
          </div>
        </div>

        {/* ─── TRUST METRICS (INDEX CARDS STYLE) ─────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 max-w-[1000px] mx-auto">
          {[
            { value: "99.99%", label: "Platform Availability", rotate: "-rotate-1" },
            { value: "AES-256", label: "Encryption at Rest", rotate: "rotate-1" },
            { value: "TLS 1.3", label: "Encrypted in Transit", rotate: "-rotate-2" },
            { value: "SOC 2", label: "Enterprise Ready", rotate: "rotate-2" },
          ].map((metric, idx) => (
            <div key={idx} className={`bg-[#FDFCF8] border border-[#E8E5DF] p-6 shadow-sm flex flex-col items-center text-center ${metric.rotate} hover:rotate-0 transition-all duration-300 relative`}>
              <div className="absolute -top-3 w-8 h-2 bg-[#E8E5DF]/50 shadow-[0_1px_2px_rgba(0,0,0,0.1)] rotate-[-2deg]" />
              <div className="text-[28px] lg:text-[32px] font-black text-[#171717] mb-2 font-serif italic tracking-tight">{metric.value}</div>
              <div className="text-[10px] font-bold text-[#A0A09A] uppercase tracking-widest font-mono border-t border-[#E8E5DF] w-full pt-2">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* ─── INTERACTIVE DATA JOURNEY (LEDGER STYLE) ───────────────────── */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717] font-serif italic mb-2">How your data travels</h2>
            <p className="text-[#7A7870] font-medium font-mono text-[14px]">Follow the secure path of a single keystroke.</p>
          </div>

          <div className="max-w-[1000px] mx-auto bg-white border border-[#E8E5DF] p-8 md:p-12 shadow-sm relative overflow-hidden rotate-[-1deg]">
             {/* Blueprint/Ledger background lines */}
             <div className="absolute inset-0 opacity-20 pointer-events-none z-0 mt-8" style={{ backgroundImage: 'linear-gradient(#171717 1px, transparent 1px)', backgroundSize: '100% 4.5rem' }} />
             
             {/* Red margin lines */}
             <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[2px] bg-red-400/30 z-0" />
             <div className="absolute left-[36px] md:left-[52px] top-0 bottom-0 w-[1px] bg-red-400/30 z-0" />

             {/* Path Connection Line */}
             <div className="absolute top-1/2 left-20 right-20 h-[2px] border-t-2 border-dashed border-[#A0A09A] -translate-y-1/2 z-10 hidden lg:block opacity-50" />
             
             <div className="relative z-20 flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-0 mt-8">
               {[
                 { step: "01", icon: <IconKey className="w-6 h-6 text-[#171717]" />, title: "Authentication", desc: "Identity verified securely." },
                 { step: "02", icon: <IconShield className="w-6 h-6 text-[#5D8A63]" />, title: "TLS Encryption", desc: "Encrypted in transit." },
                 { step: "03", icon: <IconVault className="w-6 h-6 text-[#171717]" />, title: "Encrypted Storage", desc: "AES-256 at rest." },
                 { step: "04", icon: <IconServer className="w-6 h-6 text-[#7FB3D5]" />, title: "Redundancy", desc: "Distributed backups." }
               ].map((step, i) => (
                 <motion.div 
                   key={i}
                   className="group relative flex flex-col items-center text-center bg-white p-4"
                   whileHover={{ y: -5 }}
                 >
                   <div className="absolute -top-6 left-0 text-[10px] font-black text-[#D97745] font-mono tracking-widest">{step.step}</div>
                   <div className="w-16 h-16 bg-[#FDFCF8] border-2 border-[#171717] rounded-full flex items-center justify-center shadow-[2px_2px_0px_#171717] mb-4 group-hover:bg-white group-hover:scale-110 transition-all cursor-pointer relative z-10">
                     {step.icon}
                   </div>
                   <h4 className="font-bold text-[#171717] text-[15px] font-serif bg-white px-2 mb-1">{step.title}</h4>
                   <p className="text-[12px] text-[#A0A09A] font-mono max-w-[120px] bg-white px-1 leading-tight">{step.desc}</p>
                 </motion.div>
               ))}
             </div>
             
             {/* Doodle Arrow */}
             <div className="absolute bottom-4 right-8 opacity-40 transform rotate-180">
               <DoodleArrow className="w-12 h-12 text-[#171717]" />
             </div>
          </div>
        </div>

        {/* ─── FEATURE CARDS GRID (BENTO BOX) ────────────────────────────── */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717]">Enterprise-grade protection</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
            
            {/* Encryption - Large */}
            <div className="md:col-span-2 bg-[#FDFCF8] border border-[#E8E5DF] p-8 md:p-12 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <IconShieldCheck className="w-64 h-64" />
              </div>
              <IconLock className="w-10 h-10 text-[#5D8A63] mb-6" />
              <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-4">Zero-Knowledge Architecture</h3>
              <p className="text-[16px] text-[#7A7870] font-medium leading-relaxed max-w-[400px]">
                Sensitive information is encrypted before storage using industry-standard AES-256 encryption and managed encryption keys.
              </p>
            </div>

            {/* Access Control - Small */}
            <div className="bg-[#FEF4EC] border border-[#E8E5DF] p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <IconKey className="w-10 h-10 text-[#D97745] mb-6" />
              <h3 className="text-[20px] font-black tracking-tight text-[#171717] mb-3">Access Control</h3>
              <p className="text-[14px] text-[#7A7870] font-medium leading-relaxed">
                Fine-grained permissions, workspace roles, OAuth, Google authentication, and enterprise-ready SSO keep every workspace secure.
              </p>
            </div>

            {/* Backups - Small */}
            <div className="bg-[#EEF4F8] border border-[#E8E5DF] p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <IconServer className="w-10 h-10 text-[#7FB3D5] mb-6" />
              <h3 className="text-[20px] font-black tracking-tight text-[#171717] mb-3">Disaster Recovery</h3>
              <p className="text-[14px] text-[#7A7870] font-medium leading-relaxed">
                Automatic backups, cross-region replication, and rapid recovery procedures minimize downtime and data loss.
              </p>
            </div>

            {/* Audit Logs - Large */}
            <div className="md:col-span-2 bg-[#FDFCF8] border border-[#E8E5DF] p-8 md:p-12 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-4">Detailed Audit Logs</h3>
                <p className="text-[16px] text-[#7A7870] font-medium leading-relaxed max-w-[350px]">
                  Track authentication, permission changes, document activity, and administrative actions with complete transparency.
                </p>
              </div>
              <div className="hidden sm:block p-4 bg-[#F8F5EF] rounded-xl border border-[#E8E5DF] font-mono text-[11px] text-[#5B5B5B] shadow-inner">
                <div>[08:42:12] USER_LOGIN_SUCCESS</div>
                <div>[08:43:01] DOC_READ_WORKSPACE</div>
                <div>[08:45:22] PERMISSION_UPDATE</div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── DEVELOPER SECURITY (LEDGER PRINTOUT) ──────────────────────── */}
        <div className="mb-16 max-w-[800px] mx-auto bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row border border-[#E8E5DF]">
          <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-[#E8E5DF] bg-[#FDFCF8]">
            <h2 className="text-[24px] font-black tracking-tight text-[#171717] mb-4">Security built for developers.</h2>
            <p className="text-[14px] text-[#7A7870] font-medium leading-relaxed mb-6">
              Every API request is protected with modern authentication, signed requests, granular scopes, and strict rate limiting.
            </p>
            <ul className="space-y-3 text-[#171717] font-bold text-[14px]">
              <li className="flex items-center gap-3">
                <span className="text-[#171717]">✓</span> Bearer Token Authentication
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#171717]">✓</span> OAuth 2.0
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#171717]">✓</span> HMAC Request Signatures
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#171717]">✓</span> Workspace-Level Permissions
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#171717]">✓</span> API Rate Limiting
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#171717]">✓</span> Scoped Access Tokens
              </li>
            </ul>
          </div>
          
          <div className="flex-1 bg-white p-6 md:p-8 font-mono text-[12px] leading-relaxed relative flex items-center justify-center">
            {/* Lined paper texture background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#E8E5DF 1px, transparent 1px)', backgroundSize: '100% 1.5rem', marginTop: '1.5rem' }} />
            <div className="absolute left-6 top-0 bottom-0 w-px bg-red-400/20 z-0" />
            
            <div className="relative z-10 w-full pl-6 text-[#5B5B5B]">
              <span className="text-[#171717] font-bold">const</span> crypto = require(<span className="text-[#171717]">'crypto'</span>);<br/><br/>
              <span className="text-[#A0A09A] italic">// Verify Webhook Signature</span><br/>
              <span className="text-[#171717] font-bold">function</span> verifySignature(req, secret) {'{'}<br/>
              &nbsp;&nbsp;<span className="text-[#171717] font-bold">const</span> sig = req.headers[<span className="text-[#171717]">'x-notely-signature'</span>];<br/>
              &nbsp;&nbsp;<span className="text-[#171717] font-bold">const</span> hash = crypto<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;.createHmac(<span className="text-[#171717]">'sha256'</span>, secret)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;.update(JSON.stringify(req.body))<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;.digest(<span className="text-[#171717]">'hex'</span>);<br/>
              <br/>
              &nbsp;&nbsp;<span className="text-[#171717] font-bold">return</span> sig === hash;<br/>
              {'}'}
            </div>
          </div>
        </div>

        {/* ─── COMPLIANCE & WHITEPAPER ───────────────────────────────────── */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
          
          {/* Compliance Timeline */}
          <div className="bg-[#FDFCF8] border border-[#E8E5DF] p-10 rounded-3xl shadow-sm">
            <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-2">Compliance & Certifications</h3>
            <p className="text-[14px] text-[#7A7870] font-medium leading-relaxed mb-8">
              Our security practices align with globally recognized standards trusted by modern organizations.
            </p>
            <div className="space-y-6 relative border-l-2 border-[#E8E5DF] ml-3 pl-6">
              
              <div className="relative">
                <div className="absolute -left-[35px] w-4 h-4 bg-[#171717] rounded-full border-4 border-[#FDFCF8]" />
                <h4 className="font-bold text-[#171717]">SOC 2 Type II</h4>
                <p className="text-[14px] text-[#7A7870] font-medium">Annual independent audits</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] w-4 h-4 bg-[#171717] rounded-full border-4 border-[#FDFCF8]" />
                <h4 className="font-bold text-[#171717]">GDPR</h4>
                <p className="text-[14px] text-[#7A7870] font-medium">Data protection and privacy compliance</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] w-4 h-4 bg-[#171717] rounded-full border-4 border-[#FDFCF8]" />
                <h4 className="font-bold text-[#171717]">CCPA</h4>
                <p className="text-[14px] text-[#7A7870] font-medium">California consumer privacy</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] w-4 h-4 bg-[#E8E5DF] rounded-full border-4 border-[#FDFCF8]" />
                <h4 className="font-bold text-[#A0A09A]">ISO 27001 (Planned)</h4>
                <p className="text-[14px] text-[#A0A09A] font-medium">Information security management</p>
              </div>

            </div>
          </div>

          {/* Whitepaper Card (Notebook Style) */}
          <div className="bg-white p-10 rounded-xl shadow-sm relative overflow-hidden group cursor-pointer border border-[#E8E5DF] hover:shadow-md transition-shadow">
            <PaperClip className="absolute top-8 right-8 w-8 h-8 text-[#171717] rotate-45 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[linear-gradient(#E8E5DF_1px,transparent_1px)] bg-[size:100%_2rem] opacity-30 pointer-events-none" />
            
            <div className="relative z-10 h-full flex flex-col justify-between pt-6">
              <div>
                <h4 className="text-[12px] font-black tracking-[0.2em] text-[#A0A09A] uppercase mb-4 font-mono">Resource</h4>
                <h3 className="text-[28px] font-black tracking-tight text-[#171717] leading-tight mb-4">Notely Security<br/>Whitepaper</h3>
                <p className="text-[15px] text-[#7A7870] font-medium">A detailed overview of our architecture, encryption model, authentication systems, disaster recovery strategy, and compliance practices.</p>
              </div>
              
              <div className="mt-8 flex items-center gap-2 text-[#171717] font-bold text-[15px] transition-colors">
                Download PDF <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </div>
            </div>
          </div>

        </div>

        {/* ─── CATEGORIZED NOTEBOOK FAQ ──────────────────────────────────── */}
        <div className="mb-24 max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-black tracking-tight text-[#171717]">Common Questions</h2>
          </div>

          <div className="bg-[#FDFCF8] border border-[#E8E5DF] rounded-2xl shadow-sm overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-[#E8E5DF] overflow-x-auto hide-scrollbar">
              {Object.keys(faqData).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveFaqTab(tab); setActiveFaq(null); }}
                  className={`px-8 py-4 font-bold text-[14px] uppercase tracking-wider font-mono whitespace-nowrap transition-colors ${
                    activeFaqTab === tab 
                      ? 'bg-white text-[#171717] border-b-2 border-[#171717]' 
                      : 'bg-[#FDFCF8] text-[#A0A09A] hover:bg-[#F8F5EF] hover:text-[#171717]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Accordions */}
            <div className="p-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFaqTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {faqData[activeFaqTab].map((faq, i) => (
                    <div key={i} className="border-b border-[#E8E5DF] last:border-0">
                      <button
                        onClick={() => toggleFaq(i)}
                        className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-[#171717] text-[16px] hover:bg-[#F8F5EF] transition-colors rounded-xl"
                      >
                        {faq.q}
                        <span className={`transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-[#171717]' : 'text-[#A0A09A]'}`}>↓</span>
                      </button>
                      <AnimatePresence>
                        {activeFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 text-[#7A7870] text-[15px] leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* ─── ENTERPRISE CTA ────────────────────────────────────────────── */}
        <div className="text-center py-16 bg-[#FDFCF8] rounded-2xl shadow-sm relative overflow-hidden border border-[#E8E5DF]">
          
          <IconVault className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.03] text-[#171717]" />
          
          <div className="relative z-10 max-w-[500px] mx-auto px-6">
            <h2 className="text-[32px] md:text-[40px] font-black tracking-tight text-[#171717] mb-6 leading-tight">
              Ready to protect your team's knowledge?
            </h2>
            <p className="text-[16px] text-[#5B5B5B] font-medium mb-10">
              Enterprise-grade security, powerful collaboration, and complete ownership of your data—all in one workspace.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="px-8 py-3.5 bg-white hover:bg-[#FDFCF8] text-[#171717] border border-[#171717] border-2 rounded-sm font-bold text-[15px] transition-all shadow-sm active:translate-y-1">
                Talk to Sales
              </Link>
              <Link to="/register" className="px-8 py-3.5 bg-[#171717] hover:bg-[#2A2A2A] text-white border border-[#171717] rounded-sm font-bold text-[15px] transition-all shadow-sm active:translate-y-1">
                Start Free Workspace
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
