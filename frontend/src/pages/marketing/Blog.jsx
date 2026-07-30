import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconOwl, 
  IconNotebook,
  IconPencil,
  PaperClip,
  IconKey,
  IconTerminal
} from '../../components/CompanyIllustrations';

const articles = [
  {
    slug: "announcing-workspaces-v3",
    title: "Announcing Workspaces v3: Collaborative outlines and folders",
    desc: "We completely rebuilt the document organization structure to support infinite folder hierarchies and permissions locks.",
    date: "July 28, 2026",
    category: "Product Updates",
    author: "Sarah Chen",
    readTime: "4 min read",
    featured: false
  },
  {
    slug: "how-squads-document-apis",
    title: "How high-speed squads document APIs and system schemas",
    desc: "A review of markdown shortcuts, code block formatting, and API reference guidelines for engineering departments.",
    date: "June 15, 2026",
    category: "Productivity",
    author: "Marcus Aurelius",
    readTime: "6 min read",
    featured: true
  },
  {
    slug: "remote-first-wiki-culture",
    title: "Why your remote company needs a clear internal wiki culture",
    desc: "Playbooks, onboarding guidelines, and benefits policies are only useful if they can be located. Here is how we do it.",
    date: "May 20, 2026",
    category: "Culture",
    author: "Helena Vance",
    readTime: "5 min read",
    featured: false
  },
  {
    slug: "semantic-search-architecture",
    title: "Designing a privacy-first semantic search architecture",
    desc: "How we utilize local vector indexes and sandboxed embeddings to power instantaneous AI search across millions of documents.",
    date: "May 02, 2026",
    category: "Engineering",
    author: "Alex Rivera",
    readTime: "8 min read",
    featured: false
  },
  {
    slug: "zero-knowledge-encryption",
    title: "Implementing zero-knowledge encryption in browser storage",
    desc: "A deep dive into WebCrypto API, IndexedDB, and the challenges of offline-first encrypted collaborative text editing.",
    date: "April 18, 2026",
    category: "Engineering",
    author: "David Kim",
    readTime: "12 min read",
    featured: false
  }
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Engineering', 'Product Updates', 'Productivity', 'Culture'];
  
  const filteredArticles = selectedCategory === 'all' 
    ? articles.filter(a => !a.featured)
    : articles.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase());

  const featuredArticle = articles.find(a => a.featured) || articles[0];

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

          <h1 className="text-[56px] md:text-[72px] font-black tracking-tight text-[#171717] leading-[1.05] mb-6">
            Stories from Notely
          </h1>
          <p className="text-[18px] text-[#7A7870] font-medium leading-relaxed max-w-[500px] mx-auto">
            Engineering deep-dives, product announcements, and thoughts on building better remote culture.
          </p>
        </div>

        {/* ─── MAGAZINE FEATURE SECTION ──────────────────────────────────── */}
        {selectedCategory === 'all' && (
          <div className="mb-24 flex flex-col lg:flex-row gap-10 items-stretch">
            
            {/* Featured Left (Hero Article) */}
            <Link to={`/blog/${featuredArticle.slug}`} className="flex-1 group block relative bg-[#FDFCF8] border border-[#E8E5DF] rounded-sm shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 md:p-12 overflow-hidden rotate-[-1deg] hover:rotate-0">
              <PaperClip className="absolute top-8 right-8 w-10 h-10 text-[#171717] rotate-12 opacity-80 group-hover:scale-110 transition-transform z-10" />
              <div className="absolute inset-0 bg-[linear-gradient(#E8E5DF_1px,transparent_1px)] bg-[size:100%_1.5rem] opacity-40 pointer-events-none mt-2" />
              
              <div className="w-16 h-16 bg-white border border-[#171717] rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#171717] group-hover:text-white transition-colors shadow-[2px_2px_0px_#171717] relative z-10">
                <IconTerminal className="w-8 h-8 text-current" />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-[#171717] rounded-sm text-[11px] font-black tracking-widest uppercase font-mono text-white">Featured</span>
                <span className="px-3 py-1 bg-[#FDFCF8] border border-[#E8E5DF] rounded-sm text-[11px] font-black tracking-widest uppercase font-mono text-[#171717]">{featuredArticle.category}</span>
                <span className="text-[13px] font-bold text-[#A0A09A]">{featuredArticle.date}</span>
              </div>
              
              <h2 className="text-[40px] md:text-[48px] font-black tracking-tight text-[#171717] leading-tight mb-6 group-hover:underline decoration-4 underline-offset-4">
                {featuredArticle.title}
              </h2>
              
              <p className="text-[18px] text-[#7A7870] font-medium leading-relaxed mb-10 max-w-[600px]">
                {featuredArticle.desc}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F0EDE8] rounded-full border-2 border-[#171717] flex items-center justify-center font-black font-mono text-[14px]">
                  {featuredArticle.author.charAt(0)}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#171717] leading-tight">{featuredArticle.author}</div>
                  <div className="text-[12px] font-medium text-[#7A7870]">{featuredArticle.readTime}</div>
                </div>
              </div>
            </Link>

            {/* Editorial List Right (Secondary Features) */}
            <div className="w-full lg:w-[400px] flex flex-col gap-6">
              {articles.filter(a => !a.featured).slice(0, 3).map((article, i) => (
                <Link key={i} to={`/blog/${article.slug}`} className={`flex-1 bg-white border border-[#E8E5DF] p-6 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden flex flex-col justify-center ${i % 2 === 0 ? 'rotate-[1deg] hover:rotate-0' : 'rotate-[-1deg] hover:rotate-0'}`}>
                  <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[#171717]/10 shadow-inner" />
                  <div className="flex items-center gap-3 mb-3 ml-4">
                    <span className="text-[11px] font-black tracking-widest uppercase font-mono text-[#D97745]">{article.category}</span>
                    <span className="text-[12px] font-bold text-[#A0A09A]">· {article.readTime}</span>
                  </div>
                  <h4 className="text-[20px] font-black tracking-tight text-[#171717] leading-tight group-hover:underline decoration-2 underline-offset-2">
                    {article.title}
                  </h4>
                </Link>
              ))}
            </div>
            
          </div>
        )}

        {/* ─── TABS & GRID ───────────────────────────────────────────────── */}
        <div className="mb-12 border-b border-[#E8E5DF] flex overflow-x-auto hide-scrollbar gap-2 pl-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat.toLowerCase())}
              className={`relative px-6 py-3 font-bold text-[14px] uppercase tracking-wider font-mono whitespace-nowrap transition-colors rounded-t-xl border-t border-l border-r ${
                selectedCategory === cat.toLowerCase()
                  ? 'bg-white text-[#171717] border-[#E8E5DF] z-10' 
                  : 'bg-[#F0EDE8] text-[#A0A09A] border-transparent hover:bg-[#FDFCF8] hover:text-[#171717]'
              }`}
            >
              {cat === 'all' ? 'Latest' : cat}
              {selectedCategory === cat.toLowerCase() && (
                <div className="absolute -bottom-px left-0 right-0 h-px bg-white" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, i) => (
            <Link key={article.slug} to={`/blog/${article.slug}`} className={`group bg-[#FDFCF8] border border-[#E8E5DF] rounded-sm p-8 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative overflow-hidden ${i % 3 === 0 ? 'rotate-[-1deg] hover:rotate-0' : i % 3 === 1 ? 'rotate-[1deg] hover:rotate-0' : 'rotate-[-0.5deg] hover:rotate-[0.5deg]'}`}>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-2 bg-[#E8E5DF]/50 rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.1)] opacity-70" />
              
              <div className="flex items-center gap-3 mb-6 mt-4 relative z-10">
                <span className="text-[11px] font-black tracking-widest uppercase font-mono text-[#171717] bg-white border border-[#E8E5DF] px-2 py-1 rounded-sm shadow-sm">{article.category}</span>
                <span className="text-[12px] font-bold text-[#A0A09A]">{article.date}</span>
              </div>
              
              <h3 className="font-black text-[24px] text-[#171717] leading-tight mb-4 group-hover:underline decoration-2 underline-offset-2">
                {article.title}
              </h3>
              
              <p className="text-[15px] text-[#7A7870] font-medium leading-relaxed mb-8 flex-grow">
                {article.desc}
              </p>
              
              <div className="flex items-center gap-3 pt-6 border-t border-[#E8E5DF]">
                <div className="w-8 h-8 bg-[#171717] rounded-full flex items-center justify-center font-black font-mono text-[12px] text-white">
                  {article.author.charAt(0)}
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-[13px] font-bold text-[#171717]">{article.author}</span>
                  <span className="text-[12px] font-bold text-[#A0A09A]">{article.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
