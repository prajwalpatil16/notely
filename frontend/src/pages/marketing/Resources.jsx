import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconOwl, 
  IconNotebook,
  IconPencil,
  PaperClip,
  IconKey,
  IconVault,
  IconTerminal,
  DoodleArrow
} from '../../components/CompanyIllustrations';

export default function Resources() {
  const [activeCodeTab, setActiveCodeTab] = useState('cURL');

  const codeSnippets = {
    cURL: `curl -X GET "https://api.notely.com/v1/workspaces" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    JavaScript: `const response = await fetch('https://api.notely.com/v1/workspaces', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const data = await response.json();`,
    Python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}
response = requests.get('https://api.notely.com/v1/workspaces', headers=headers)
data = response.json()`,
    Go: `req, _ := http.NewRequest("GET", "https://api.notely.com/v1/workspaces", nil)
req.Header.Add("Authorization", "Bearer YOUR_API_KEY")

res, _ := http.DefaultClient.Do(req)
defer res.Body.Close()`,
    Java: `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.notely.com/v1/workspaces"))
    .header("Authorization", "Bearer YOUR_API_KEY")
    .method("GET", HttpRequest.BodyPublishers.noBody())
    .build();
HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());`
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32 pt-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            
            <h1 className="text-[48px] md:text-[72px] font-black tracking-tight text-[#171717] leading-[1.05] mb-6">
              Learn.<br/>Build.<br/>Master Notely.
            </h1>
            <p className="text-[18px] text-[#7A7870] font-medium leading-relaxed max-w-[480px] mb-10">
              Everything from beginner guides and tutorials to API documentation and engineering articles—all in one organized knowledge library.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/resources#explore" className="w-full sm:w-auto relative group">
                <div className="absolute inset-0 bg-[#171717] rounded-sm translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
                <div className="relative bg-white border-2 border-[#171717] text-[#171717] px-8 py-3 rounded-sm font-bold text-[15px] shadow-sm transform group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                  Explore Resources
                </div>
              </Link>
              <Link to="/blog" className="w-full sm:w-auto relative group">
                <div className="absolute inset-0 bg-[#E8E5DF] rounded-sm translate-y-1 translate-x-1 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform" />
                <div className="relative bg-[#FDFCF8] border border-[#E8E5DF] text-[#171717] px-8 py-3 rounded-sm font-bold text-[15px] shadow-sm transform group-active:translate-y-1 group-active:translate-x-1 transition-transform flex justify-center">
                  Read Product Blog
                </div>
              </Link>
            </div>
          </motion.div>
          
          <div className="relative w-full h-[500px] flex items-center justify-center mt-12 lg:mt-0 perspective-1000">
             <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-full max-w-[450px]"
             >
                {/* Bookshelf Background */}
                <div className="absolute -inset-4 bg-[linear-gradient(#E8E5DF_1px,transparent_1px),linear-gradient(90deg,#E8E5DF_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40 rounded-xl" />
                
                {/* Shelf */}
                <div className="absolute bottom-0 left-[-10%] right-[-10%] h-4 bg-white border border-[#E8E5DF] shadow-md z-0" />
                <div className="absolute bottom-[-16px] left-[-8%] right-[-8%] h-4 bg-[#F0EDE8] border border-[#E8E5DF] z-0" />

                {/* Books / Folders */}
                <div className="relative z-10 flex items-end justify-center h-[350px] gap-2 pb-4">
                  {/* Book 1 */}
                  <div className="w-16 h-[250px] bg-[#FDFCF8] border border-[#E8E5DF] shadow-sm rounded-sm rotate-[-4deg] origin-bottom relative flex items-center justify-center">
                    <div className="absolute top-4 w-full h-px bg-[#E8E5DF]" />
                    <span className="rotate-[-90deg] font-mono text-[12px] font-bold text-[#171717] tracking-widest whitespace-nowrap">GUIDES</span>
                  </div>
                  
                  {/* Book 2 */}
                  <div className="w-20 h-[280px] bg-white border border-[#E8E5DF] shadow-md rounded-sm rotate-[-1deg] origin-bottom relative flex items-center justify-center z-20">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-8 bg-red-400/20 border-b border-red-400/40" /> {/* Bookmark */}
                    <span className="rotate-[-90deg] font-mono text-[13px] font-black text-[#171717] tracking-widest whitespace-nowrap">API DOCS</span>
                  </div>

                  {/* Book 3 (Leaning) */}
                  <div className="w-14 h-[230px] bg-[#F8F5EF] border border-[#E8E5DF] shadow-sm rounded-sm rotate-[12deg] origin-bottom translate-x-4 relative flex items-center justify-center z-10">
                    <span className="rotate-[-90deg] font-mono text-[11px] font-bold text-[#A0A09A] tracking-widest whitespace-nowrap">AI WORKSPACE</span>
                  </div>

                  {/* Stacked books */}
                  <div className="flex flex-col gap-2 ml-8 pb-2">
                    <div className="w-[140px] h-12 bg-white border border-[#E8E5DF] shadow-sm rounded-sm relative flex items-center px-4">
                       <PaperClip className="absolute -left-2 top-2 w-6 h-6 text-[#171717]" />
                       <span className="font-mono text-[10px] font-bold text-[#171717] tracking-wider">TEMPLATES</span>
                    </div>
                    <div className="w-[150px] h-14 bg-[#FDFCF8] border border-[#E8E5DF] shadow-sm rounded-sm relative flex items-center px-4 -ml-2">
                       <span className="font-mono text-[11px] font-black text-[#171717] tracking-wider">TUTORIALS</span>
                       <div className="absolute top-0 right-0 w-4 h-4 bg-white border-l border-b border-[#E8E5DF]" /> {/* Folded corner */}
                    </div>
                    <div className="w-[160px] h-16 bg-white border-2 border-[#171717] shadow-sm rounded-sm relative flex items-center px-4">
                       <span className="font-mono text-[12px] font-black text-[#171717] tracking-wider">ENGINEERING</span>
                    </div>
                  </div>
                </div>
             </motion.div>
          </div>
        </div>

        {/* ─── FEATURED RESOURCES ────────────────────────────────────────── */}
        <div id="explore" className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <Link to="/help" className="bg-white border border-[#E8E5DF] p-10 rounded-xl shadow-sm hover:shadow-lg transition-all group relative overflow-hidden flex flex-col h-full">
              <div className="w-12 h-12 bg-[#FDFCF8] border border-[#E8E5DF] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IconNotebook className="w-6 h-6 text-[#171717]" />
              </div>
              <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-4">Getting Started</h3>
              <p className="text-[15px] text-[#7A7870] font-medium leading-relaxed flex-grow">
                Set up your workspace in under five minutes. Learn the basics of notes, folders, and sharing.
              </p>
              <div className="mt-8 font-bold text-[#171717] text-[14px] flex items-center gap-2 group-hover:gap-3 transition-all">
                Start Learning <span>→</span>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to="/docs" className="bg-[#171717] border border-[#2A2A2A] p-10 rounded-xl shadow-lg hover:shadow-xl transition-all group relative overflow-hidden flex flex-col h-full">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-20 pointer-events-none" />
              <div className="relative z-10 w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IconTerminal className="w-6 h-6 text-white" />
              </div>
              <h3 className="relative z-10 text-[24px] font-black tracking-tight text-white mb-4">Developer Documentation</h3>
              <p className="relative z-10 text-[15px] text-[#A0A09A] font-medium leading-relaxed flex-grow">
                REST APIs, SDKs, authentication and integrations. Build powerful tools on top of Notely.
              </p>
              <div className="relative z-10 mt-8 font-bold text-white text-[14px] flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore API <span>→</span>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/blog" className="bg-[#FDFCF8] border border-[#E8E5DF] p-10 rounded-xl shadow-sm hover:shadow-lg transition-all group relative overflow-hidden flex flex-col h-full">
              <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <IconOwl className="w-48 h-48 text-[#171717]" />
              </div>
              <div className="w-12 h-12 bg-white border border-[#E8E5DF] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <IconPencil className="w-6 h-6 text-[#171717]" />
              </div>
              <h3 className="text-[24px] font-black tracking-tight text-[#171717] mb-4">Engineering Journal</h3>
              <p className="text-[15px] text-[#7A7870] font-medium leading-relaxed flex-grow">
                Behind-the-scenes stories from the team building Notely. Architecture, scaling, and culture.
              </p>
              <div className="mt-8 font-bold text-[#171717] text-[14px] flex items-center gap-2 group-hover:gap-3 transition-all">
                Read Stories <span>→</span>
              </div>
            </Link>

          </div>
        </div>

        {/* ─── LEARNING PATHS ────────────────────────────────────────────── */}
        <div className="mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-[32px] font-black tracking-tight text-[#171717]">Learning Paths</h2>
              <p className="text-[#7A7870] font-medium mt-2">Curated curriculums to master Notely.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: "Beginner Workspace", diff: "Easy", time: "15m", lessons: 4, complete: "0%" },
              { title: "Workspace Expert", diff: "Medium", time: "45m", lessons: 8, complete: "0%" },
              { title: "API Integration", diff: "Hard", time: "2h", lessons: 12, complete: "0%" },
              { title: "AI Workspace", diff: "Medium", time: "30m", lessons: 5, complete: "0%" },
              { title: "Markdown Master", diff: "Easy", time: "20m", lessons: 6, complete: "0%" }
            ].map((path, i) => (
              <Link key={i} to="/help" className="bg-white border border-[#E8E5DF] p-6 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-red-400/20 z-0" />
                <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#E8E5DF 1px, transparent 1px)', backgroundSize: '100% 1.5rem', marginTop: '1.5rem' }} />
                
                <div className="relative z-10 pl-4 h-full flex flex-col">
                  <h4 className="font-bold text-[#171717] text-[16px] leading-tight mb-4 flex-grow group-hover:text-[#D97745] transition-colors">{path.title}</h4>
                  
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A09A]">
                      <span>{path.diff}</span>
                      <span>{path.time}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#171717]">
                      <span>{path.lessons} Lessons</span>
                      <span className="font-bold">{path.complete}</span>
                    </div>
                    <div className="w-full h-1 bg-[#F0EDE8] rounded-full overflow-hidden">
                      <div className="w-0 h-full bg-[#171717]" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── EXPLORE BY CATEGORY (FOLDERS) ─────────────────────────────── */}
        <div className="mb-32">
          <h2 className="text-[32px] font-black tracking-tight text-[#171717] mb-12">Explore by Category</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {[
              "Engineering", "AI", "Productivity", "Markdown", "Workspace",
              "Permissions", "Billing", "Search", "Templates", "Keyboard Shortcuts"
            ].map((cat, i) => (
              <Link key={i} to="/help" className={`group relative block h-[130px] ${i % 2 === 0 ? 'rotate-[1.5deg] hover:rotate-[0deg]' : 'rotate-[-1.5deg] hover:rotate-[0deg]'} transition-transform duration-300`}>
                {/* Folder Back */}
                <div className="absolute inset-x-0 bottom-0 top-5 bg-[#EAE7E0] border border-[#D5D2CC] rounded-t-sm rounded-b-md z-0" />
                {/* Folder Tab */}
                <div className="absolute top-2 left-3 w-20 h-4 bg-[#EAE7E0] border-t border-l border-r border-[#D5D2CC] rounded-t-sm z-0" />
                {/* Paper Insert */}
                <div className="absolute inset-x-3 bottom-2 top-4 bg-white border border-[#E8E5DF] shadow-sm rounded-sm z-10 group-hover:-translate-y-5 transition-transform duration-300">
                  <div className="absolute inset-x-3 top-3 bottom-3 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#171717 1px, transparent 1px)', backgroundSize: '100% 0.75rem' }} />
                </div>
                {/* Folder Front */}
                <div className="absolute inset-x-0 bottom-0 top-8 bg-[#FDFCF8] border border-[#D5D2CC] rounded-sm shadow-sm z-20 flex flex-col justify-end p-4 group-hover:shadow-md transition-shadow">
                  <div className="absolute top-3 left-3 w-4 h-4 opacity-[0.03]">
                    <div className="w-full h-full border-4 border-[#171717] rounded-full" />
                  </div>
                  <span className="font-black text-[#171717] text-[14px] leading-tight group-hover:text-[#D97745] transition-colors">{cat}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── LATEST ARTICLES (MAGAZINE) ────────────────────────────────── */}
        <div className="mb-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[32px] font-black tracking-tight text-[#171717]">Latest Articles</h2>
            <Link to="/blog" className="font-bold text-[14px] text-[#171717] hover:underline">View All Articles →</Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Featured Left */}
            <Link to="/blog/semantic-search" className="group block">
              <div className="bg-[#E8E5DF] h-[350px] rounded-xl mb-6 overflow-hidden relative">
                {/* Placeholder Image */}
                <div className="absolute inset-0 bg-[#FDFCF8] flex items-center justify-center">
                  <IconOwl className="w-32 h-32 text-[#E8E5DF] group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white border border-[#171717] rounded-sm text-[11px] font-black tracking-widest uppercase font-mono text-[#171717]">AI</span>
                <span className="text-[13px] font-bold text-[#A0A09A]">Jul 14, 2026 • 8 min read</span>
              </div>
              <h3 className="text-[32px] font-black tracking-tight text-[#171717] leading-tight mb-4 group-hover:underline">Introducing Semantic Search</h3>
              <p className="text-[16px] text-[#7A7870] font-medium leading-relaxed mb-6">
                How we built a privacy-first semantic search engine using strictly sandboxed embeddings and local vector indexes.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E8E5DF] rounded-full border border-[#171717]" />
                <span className="text-[14px] font-bold text-[#171717]">Sarah Chen, Engineering</span>
              </div>
            </Link>

            {/* Editorial List Right */}
            <div className="flex flex-col justify-between gap-8">
              {[
                { cat: "Engineering", date: "Jul 10", title: "Designing Knowledge Graphs for Scale", author: "Alex Rivera" },
                { cat: "Productivity", date: "Jul 05", title: "Markdown Tricks for Power Users", author: "Emma Davis" },
                { cat: "Culture", date: "Jun 28", title: "Engineering Culture at Notely", author: "Marcus Johnson" },
                { cat: "Engineering", date: "Jun 15", title: "Building Real-time Collaboration", author: "Sarah Chen" }
              ].map((article, i) => (
                <Link key={i} to={`/blog/${i}`} className="flex gap-6 group items-center">
                  <div className="w-32 h-32 bg-[#FDFCF8] border border-[#E8E5DF] rounded-xl flex-shrink-0 flex items-center justify-center group-hover:border-[#171717] transition-colors">
                     <IconNotebook className="w-10 h-10 text-[#E8E5DF] group-hover:text-[#171717] transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] font-black tracking-widest uppercase font-mono text-[#171717]">{article.cat}</span>
                      <span className="text-[12px] font-bold text-[#A0A09A]">{article.date}</span>
                    </div>
                    <h4 className="text-[20px] font-black tracking-tight text-[#171717] leading-tight mb-2 group-hover:underline">{article.title}</h4>
                    <p className="text-[13px] font-bold text-[#7A7870]">By {article.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ─── DEVELOPER CENTER (LEDGER TERMINAL) ───────────────────────── */}
        <div className="mb-32 max-w-[1200px] mx-auto bg-white rounded-2xl shadow-sm border border-[#E8E5DF] overflow-hidden flex flex-col lg:flex-row">
          <div className="flex-1 p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-[#E8E5DF] bg-[#FDFCF8]">
            <h2 className="text-[32px] font-black tracking-tight text-[#171717] mb-6">Developer Resources</h2>
            <p className="text-[16px] text-[#7A7870] font-medium leading-relaxed mb-8 max-w-[400px]">
              Build custom integrations, automate workflows, and extend your Notely workspace.
            </p>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10">
              {['REST API', 'SDK Downloads', 'Authentication', 'Rate Limits', 'Webhooks', 'Examples'].map(item => (
                <Link key={item} to="/docs" className="font-bold text-[15px] text-[#171717] hover:underline flex items-center gap-2">
                  <span className="text-[#A0A09A]">→</span> {item}
                </Link>
              ))}
            </div>

            <Link to="/docs" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#171717] rounded-sm font-bold text-[14px] text-[#171717] shadow-sm hover:bg-[#F8F5EF] transition-colors">
              View API Documentation <span>→</span>
            </Link>
          </div>
          
          <div className="flex-1 bg-white p-8 flex flex-col relative overflow-hidden">
             {/* Ledger background */}
             <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#E8E5DF 1px, transparent 1px)', backgroundSize: '100% 1.5rem', marginTop: '3.5rem' }} />
             <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400/20 z-0" />
             
             {/* Tabs */}
             <div className="relative z-10 flex border-b border-[#171717] mb-6">
               {['cURL', 'JavaScript', 'Python', 'Go', 'Java'].map(lang => (
                 <button
                   key={lang}
                   onClick={() => setActiveCodeTab(lang)}
                   className={`px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-wider transition-colors ${
                     activeCodeTab === lang
                       ? 'bg-[#171717] text-white'
                       : 'text-[#7A7870] hover:text-[#171717]'
                   }`}
                 >
                   {lang}
                 </button>
               ))}
             </div>

             {/* Code */}
             <div className="relative z-10 pl-8 pt-2 overflow-x-auto">
               <pre className="font-mono text-[13px] text-[#171717] leading-loose whitespace-pre">
                 {codeSnippets[activeCodeTab]}
               </pre>
             </div>
          </div>
        </div>

        {/* ─── COMMUNITY & NEWSLETTER ────────────────────────────────────── */}
        <div className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Community */}
          <div>
            <h2 className="text-[28px] font-black tracking-tight text-[#171717] mb-8">Join the Knowledge Community</h2>
            <div className="grid grid-cols-2 gap-6 relative">
              <DoodleArrow className="absolute -top-12 right-0 w-16 h-16 opacity-20 text-[#171717] rotate-[45deg]" />
              
              <a href="#" className="bg-[#FDFCF8] border border-[#E8E5DF] p-6 shadow-sm rotate-[1deg] hover:-translate-y-1 hover:shadow-md transition-all relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-400/80 rounded-full shadow-sm" /> {/* Pin */}
                <h3 className="font-bold text-[#171717] mt-2 mb-1">GitHub</h3>
                <p className="text-[13px] text-[#7A7870] font-medium">Contribute to open source SDKs.</p>
              </a>

              <a href="#" className="bg-white border border-[#E8E5DF] p-6 shadow-sm rotate-[-2deg] hover:-translate-y-1 hover:shadow-md transition-all relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/50 backdrop-blur-sm border border-[#E8E5DF] rotate-[4deg]" /> {/* Tape */}
                <h3 className="font-bold text-[#171717] mt-2 mb-1">Discord</h3>
                <p className="text-[13px] text-[#7A7870] font-medium">Chat with builders and experts.</p>
              </a>

              <a href="#" className="bg-white border border-[#E8E5DF] p-6 shadow-sm rotate-[2deg] hover:-translate-y-1 hover:shadow-md transition-all relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400/80 rounded-full shadow-sm" /> {/* Pin */}
                <h3 className="font-bold text-[#171717] mt-2 mb-1">Roadmap</h3>
                <p className="text-[13px] text-[#7A7870] font-medium">See what we're building next.</p>
              </a>

              <a href="#" className="bg-white border border-[#E8E5DF] p-6 shadow-md rotate-[-3deg] hover:-translate-y-1 hover:shadow-lg transition-all relative" style={{ borderRadius: '2px 10px 10px 2px' }}>
                <h3 className="font-bold text-[#171717] mb-1">Feature Requests</h3>
                <p className="text-[13px] text-[#5B5B5B] font-medium">Have an idea? Let us know!</p>
              </a>
            </div>
          </div>

          {/* Postcard Newsletter */}
          <div className="bg-[#FDFCF8] border border-[#E8E5DF] p-10 shadow-sm relative overflow-hidden h-full flex flex-col justify-center">
            {/* Postcard stamp */}
            <div className="absolute top-6 right-6 w-16 h-20 border-2 border-[#E8E5DF] border-dashed flex items-center justify-center p-2 opacity-50 rotate-[5deg]">
               <IconOwl className="w-10 h-10 text-[#A0A09A]" />
            </div>
            {/* Postcard lines */}
            <div className="absolute top-1/2 bottom-10 right-10 w-[40%] flex flex-col gap-6 justify-center">
              <div className="w-full h-px bg-[#E8E5DF]" />
              <div className="w-full h-px bg-[#E8E5DF]" />
              <div className="w-full h-px bg-[#E8E5DF]" />
            </div>

            <div className="relative z-10 w-[55%]">
              <h4 className="text-[11px] font-black tracking-[0.2em] text-[#171717] uppercase mb-4 font-mono">Newsletter</h4>
              <h2 className="text-[32px] font-black tracking-tight text-[#171717] mb-4 leading-tight">Weekly<br/>Notes</h2>
              <p className="text-[14px] text-[#7A7870] font-medium leading-relaxed mb-8">
                Every Friday we share thoughtful engineering stories, productivity ideas, and new Notely features.
              </p>
              <div className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full px-4 py-3 bg-white border border-[#171717] rounded-sm text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#171717]"
                />
                <button className="w-full px-4 py-3 bg-[#171717] hover:bg-[#2A2A2A] text-white rounded-sm font-bold text-[14px] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FINAL CTA ─────────────────────────────────────────────────── */}
        <div className="text-center py-24 bg-white rounded-xl shadow-sm border border-[#E8E5DF] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(#E8E5DF_1px,transparent_1px),linear-gradient(90deg,#E8E5DF_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />
          
          <div className="relative z-10 max-w-[500px] mx-auto px-6">
            <h2 className="text-[40px] md:text-[48px] font-black tracking-tight text-[#171717] mb-10 leading-tight">
              Ready to learn more?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/docs" className="px-8 py-3.5 bg-white hover:bg-[#FDFCF8] text-[#171717] border border-[#171717] border-2 rounded-sm font-bold text-[15px] transition-all shadow-sm active:translate-y-1">
                Explore the Library
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
