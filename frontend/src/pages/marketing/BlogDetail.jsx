import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PaperClip } from '../../components/CompanyIllustrations';

const postData = {
  "announcing-workspaces-v3": {
    title: "Announcing Workspaces v3: Collaborative outlines and folders",
    category: "Product Updates",
    date: "July 28, 2026",
    author: "Sarah Chen",
    readTime: "4 min read",
    content: [
      "We completely rebuilt the document organization structure to support infinite folder hierarchies and permissions locks.",
      "Workspaces v3 introduces nested outlines, letting team administrators map company playbooks directly to department groups. Users can drag pages, folders, and checklists dynamically across workspaces without losing revision history hashes.",
      "Additionally, granular editing permissions can be set per page. Lock editing access on employee policies while leaving suggestion fields active for comments."
    ]
  },
  "how-squads-document-apis": {
    title: "How high-speed squads document APIs and system schemas",
    category: "Productivity",
    date: "June 15, 2026",
    author: "Marcus Aurelius",
    readTime: "6 min read",
    content: [
      "API documentation shouldn't live in isolated database targets. High-speed squads require specs to sit close to daily workflow logs.",
      "Using Notely's inline markdown shortcuts and keyboard actions, developers write, check, and edit payload specs concurrently. You can insert inline code blocks, highlight query paths, and link related webhook references instantly.",
      "Having one central outline for architecture reviews ensures onboarding engineers locate configurations specs in milliseconds via fuzzy global searches."
    ]
  },
  "remote-first-wiki-culture": {
    title: "Why your remote company needs a clear internal wiki culture",
    category: "Team Culture",
    date: "May 20, 2026",
    author: "Helena Vance",
    readTime: "5 min read",
    content: [
      "Employee policy guides, payroll schedules, review calendars, and onboarding lists are only useful if they can be located dynamically.",
      "We recommend establishing one central home for operations guides. Restricting page modifications rights prevents accidental edits, while keeping comments active invites team feedback on policies.",
      "Encourage team leads to build custom project frameworks and save templates to guide new hires through onboarding checklists easily."
    ]
  }
};

export default function BlogDetail() {
  const { slug } = useParams();
  const post = postData[slug] || postData["announcing-workspaces-v3"];

  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-12 pb-32 overflow-hidden selection:bg-[#171717]/10 relative">
      
      {/* Background Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[760px] mx-auto px-6 relative z-10 animate-in fade-in duration-300">
        
        {/* Return button */}
        <div className="mb-12 border-b border-[#E8E5DF] inline-block">
          <Link to="/blog" className="block pb-2 text-[12px] font-black text-[#A0A09A] hover:text-[#171717] uppercase tracking-[0.2em] font-mono transition-colors">
            ← Back to Blog
          </Link>
        </div>

        {/* Paper Container */}
        <div className="bg-white border border-[#E8E5DF] rounded-sm p-8 md:p-14 shadow-sm relative">
          
          <div className="absolute top-0 right-10 w-8 h-8 bg-[#F0EDE8] border-l border-b border-[#E8E5DF] flex items-center justify-center rotate-[-15deg] -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="absolute top-0 right-12 w-6 h-8 bg-red-400/20 rotate-[15deg] -translate-y-2 shadow-sm" />

          {/* Header details */}
          <div className="space-y-6 mb-12 relative">
            <span className="text-[11px] font-black tracking-widest uppercase font-mono text-[#171717] bg-[#FDFCF8] border border-[#E8E5DF] px-3 py-1.5 rounded-sm inline-block shadow-sm rotate-[-1deg]">
              {post.category}
            </span>
            <h1 className="text-[40px] md:text-[56px] font-black tracking-tight text-[#171717] leading-[1.05]">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 pt-6 border-t border-[#E8E5DF]">
              <div className="w-10 h-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-black font-mono text-[14px]">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#171717]">{post.author}</div>
                <div className="text-[12px] font-bold text-[#A0A09A]">{post.date} • {post.readTime}</div>
              </div>
            </div>
          </div>

          {/* Article body */}
          <div className="space-y-6 text-[18px] text-[#2C2C2C] leading-[1.8] font-medium font-serif">
            {post.content.map((p, i) => (
              <p key={i} className={`${i === 0 ? 'text-[20px] leading-[1.7] text-[#171717]' : ''}`}>{p}</p>
            ))}
          </div>

          {/* Blockquote block */}
          <div className="my-12 relative bg-[#FDFCF8] border border-[#E8E5DF] p-8 rounded-sm shadow-sm rotate-[1deg] mx-4">
            <PaperClip className="absolute -top-4 -left-4 w-10 h-10 text-[#171717] rotate-[-20deg]" />
            <blockquote className="italic text-[18px] md:text-[22px] font-serif text-[#D97745] font-bold text-center leading-relaxed">
              "Clarity of information leads directly to speed of execution."
            </blockquote>
          </div>
        </div>

        {/* Newsletter signup placeholder */}
        <div className="mt-16 bg-[#FDFCF8] border border-[#E8E5DF] p-10 rounded-sm shadow-sm relative overflow-hidden rotate-[-0.5deg]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[linear-gradient(45deg,transparent_50%,#E8E5DF_50%)] opacity-30" />
          
          <div className="relative z-10 text-center max-w-sm mx-auto">
            <h4 className="font-black text-[24px] text-[#171717] tracking-tight mb-2">Join the newsletter</h4>
            <p className="text-[14px] text-[#7A7870] font-medium mb-6">Get monthly updates on product releases, markdown tips, and culture summaries.</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="sarah@company.com" 
                className="flex-1 px-4 py-3 bg-white border border-[#E8E5DF] rounded-sm text-[14px] font-medium text-[#171717] placeholder:text-[#A0A09A] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all shadow-inner" 
              />
              <button 
                onClick={() => alert("Subscribed!")} 
                className="px-6 py-3 bg-[#171717] hover:bg-[#2C2C2C] active:translate-y-1 text-white font-bold rounded-sm text-[14px] transition-all shadow-[2px_2px_0px_#D97745] hover:shadow-[4px_4px_0px_#D97745]"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
