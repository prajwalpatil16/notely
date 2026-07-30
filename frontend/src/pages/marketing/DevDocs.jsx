import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconNotebook,
  IconKey,
  IconFolder,
  IconServer
} from '../../components/CompanyIllustrations';

const apiEndpoints = [
  {
    method: "GET",
    path: "/api/workspaces",
    desc: "Fetch all workspaces the authenticated user has access to.",
    headers: "Authorization: Bearer <access_token>",
    response: `{
  "data": [
    {
      "id": "ws_12345",
      "name": "Design Team",
      "role": "admin",
      "created_at": "2024-01-15T08:30:00Z"
    },
    {
      "id": "ws_67890",
      "name": "Personal Notes",
      "role": "owner",
      "created_at": "2024-02-10T11:20:00Z"
    }
  ],
  "meta": { "total": 2 }
}`
  },
  {
    method: "POST",
    path: "/api/notes",
    desc: "Create a new document note inside a workspace folder.",
    headers: "Content-Type: application/json\nAuthorization: Bearer <access_token>",
    response: `{
  "id": "note_891011",
  "title": "Q3 Roadmap",
  "content": "<h1>Goals for Q3</h1><p>Ship new API...</p>",
  "workspace_id": "ws_12345",
  "folder_id": "fld_555",
  "is_pinned": false,
  "created_at": "2026-07-30T17:46:57Z"
}`
  },
  {
    method: "GET",
    path: "/api/folders",
    desc: "List all folders associated with a specific workspace.",
    headers: "Authorization: Bearer <access_token>",
    response: `{
  "data": [
    {
      "id": "fld_555",
      "name": "Engineering Specs",
      "parent_id": null,
      "created_at": "2026-07-30T17:46:57Z"
    }
  ]
}`
  }
];

export default function DevDocs() {
  const [selectedLang, setSelectedLang] = useState('curl');
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);

  const endpoint = apiEndpoints[selectedEndpoint];

  const getCodeSnippet = (lang, ep) => {
    if (lang === 'curl') {
      return `curl -X ${ep.method} "https://api.notely.co${ep.path}" \\
  -H "Authorization: Bearer <access_token>" ${ep.method === 'POST' ? `\\
  -H "Content-Type: application/json" \\
  -d '{"title": "Q3 Roadmap", "content": "..."}'` : ''}`;
    }
    if (lang === 'js') {
      return `// Fetching Notely API
fetch("https://api.notely.co${ep.path}", {
  method: "${ep.method}",
  headers: {
    "Authorization": "Bearer <access_token>"${ep.method === 'POST' ? `,
    "Content-Type": "application/json"` : ''}
  }${ep.method === 'POST' ? `,
  body: JSON.stringify({ title: "Q3 Roadmap", content: "..." })` : ''}
})
.then(res => res.json())
.then(data => console.log(data));`;
    }
    if (lang === 'python') {
      return `import requests

url = "https://api.notely.co${ep.path}"
headers = {
    "Authorization": "Bearer <access_token>"${ep.method === 'POST' ? `,
    "Content-Type": "application/json"` : ''}
}

response = requests.request(
    "${ep.method}", url, headers=headers${ep.method === 'POST' ? `,
    json={"title": "Q3 Roadmap", "content": "..."}` : ''}
)

print(response.json())`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] pt-16 pb-32 overflow-hidden selection:bg-[#D97745]/20">
      
      {/* Background Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* ─── HEADER ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-16 relative">
           {/* Decorative elements */}
           <div className="absolute top-0 left-1/2 -translate-x-[400px] opacity-40 hidden lg:block rotate-[-12deg]">
             <IconServer className="w-16 h-16 text-[#A0A09A]" />
           </div>
           <div className="absolute top-4 right-1/2 translate-x-[350px] opacity-40 hidden lg:block rotate-[15deg]">
             <IconKey className="w-12 h-12 text-[#A0A09A]" />
           </div>

           <div className="inline-block bg-[#FDFCF8] border border-[#E8E5DF] px-3 py-1 mb-6 rotate-[1deg] shadow-sm relative">
             <h4 className="text-[11px] font-black tracking-[0.2em] text-[#171717] uppercase font-mono">
               DEVELOPERS
             </h4>
           </div>
           <h1 className="text-[48px] md:text-[64px] font-black tracking-tight text-[#171717] leading-[1] mb-6">
             Notely API
           </h1>
           <p className="text-[18px] text-[#7A7870] font-medium leading-relaxed max-w-[600px] mx-auto">
             Build custom workflows, sync your company's knowledge, and integrate Notely directly into your existing tools.
           </p>
        </div>

        {/* ─── API DOCUMENTATION GRID ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 text-left">
          
          {/* Sidebar navigation list of endpoints */}
          <div className="lg:col-span-1 select-none space-y-10">
            <div>
              <h3 className="text-[12px] font-black text-[#A0A09A] uppercase tracking-widest pl-2 mb-4 font-mono">Reference</h3>
              <div className="space-y-2">
                {apiEndpoints.map((ep, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedEndpoint(idx)}
                    className={`w-full text-left px-4 py-3 rounded-md text-[14px] font-bold transition-all cursor-pointer flex items-center gap-3 border ${
                      selectedEndpoint === idx 
                        ? 'bg-white border-[#171717] text-[#171717] shadow-sm rotate-[-1deg]' 
                        : 'bg-transparent border-transparent text-[#7A7870] hover:bg-white hover:border-[#E8E5DF]'
                    }`}
                  >
                    <span className={`text-[10px] font-black px-2 py-1 rounded-sm border ${
                      ep.method === 'GET' ? 'bg-[#EEF4F8] text-[#7FB3D5] border-[#7FB3D5]/30' : 'bg-[#FEF4EC] text-[#D97745] border-[#D97745]/30'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="truncate">{ep.path}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[12px] font-black text-[#A0A09A] uppercase tracking-widest pl-2 mb-4 font-mono">SDK Libraries</h3>
              <div className="space-y-3 pl-4 border-l-2 border-[#E8E5DF]">
                <p className="text-[14px] font-bold text-[#5B5B5B] hover:text-[#171717] cursor-pointer transition-colors flex items-center gap-2">
                  <span className="text-[#A0A09A] font-mono">→</span> Notely JS Client
                </p>
                <p className="text-[14px] font-bold text-[#5B5B5B] hover:text-[#171717] cursor-pointer transition-colors flex items-center gap-2">
                  <span className="text-[#A0A09A] font-mono">→</span> Notely Python SDK
                </p>
              </div>
            </div>
          </div>

          {/* Main Dev Content / Sandbox */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Left column: Endpoint details */}
            <div className="md:col-span-2 space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedEndpoint}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h1 className="text-[28px] font-black text-[#171717] tracking-tight flex items-center gap-3 mb-4 font-serif">
                      <span>{endpoint.path}</span>
                    </h1>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-[12px] font-black px-3 py-1 rounded-sm border ${
                        endpoint.method === 'GET' ? 'bg-[#EEF4F8] text-[#7FB3D5] border-[#7FB3D5]/30' : 'bg-[#FEF4EC] text-[#D97745] border-[#D97745]/30'
                      }`}>
                        {endpoint.method}
                      </span>
                      <span className="text-[11px] font-bold bg-[#FDFCF8] border border-[#E8E5DF] text-[#A0A09A] px-3 py-1 rounded-sm uppercase tracking-wider font-mono">
                        REST Endpoint
                      </span>
                    </div>
                    <p className="text-[15px] text-[#7A7870] font-medium leading-relaxed">{endpoint.desc}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black text-[#A0A09A] uppercase tracking-widest font-mono">Headers</h4>
                    <div className="bg-white border border-[#E8E5DF] p-4 rounded-sm shadow-sm relative rotate-[1deg]">
                      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#171717 1px, transparent 1px)', backgroundSize: '100% 1.5rem', marginTop: '1.5rem' }} />
                      <pre className="text-[13px] font-mono leading-relaxed text-[#171717] relative z-10 whitespace-pre-wrap">
                        {endpoint.headers}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black text-[#A0A09A] uppercase tracking-widest font-mono">Response Schema</h4>
                    <div className="bg-white border border-[#E8E5DF] p-4 rounded-sm shadow-sm relative rotate-[-1deg]">
                      <div className="absolute top-2 right-2 w-3 h-3 bg-red-400/20 rounded-full shadow-inner" />
                      <pre className="text-[13px] font-mono leading-relaxed text-[#5B5B5B] overflow-x-auto">
                        {endpoint.response}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right column: Sandbox Code snippets */}
            <div className="md:col-span-3">
              <div className="bg-[#171717] rounded-xl shadow-xl border border-[#333333] overflow-hidden flex flex-col h-full min-h-[500px]">
                
                {/* Terminal Header */}
                <div className="bg-[#222222] border-b border-[#333333] px-4 py-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ED6A5E]" />
                    <div className="w-3 h-3 rounded-full bg-[#F4BF4F]" />
                    <div className="w-3 h-3 rounded-full bg-[#61C554]" />
                  </div>
                  <div className="flex gap-2 select-none">
                    {['curl', 'js', 'python'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-3 py-1 text-[11px] font-bold rounded-sm transition-all font-mono uppercase tracking-wider ${
                          selectedLang === lang 
                            ? 'bg-[#333333] text-white' 
                            : 'text-[#888888] hover:text-[#CCCCCC]'
                        }`}
                      >
                        {lang === 'curl' ? 'cURL' : lang === 'js' ? 'Node' : 'Python'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Snippet box */}
                <div className="p-6 flex-1 overflow-x-auto relative">
                  <AnimatePresence mode="wait">
                    <motion.pre
                      key={selectedLang + selectedEndpoint}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-[13px] font-mono leading-loose text-[#D4D4D4] whitespace-pre"
                    >
                      {getCodeSnippet(selectedLang, endpoint)}
                    </motion.pre>
                  </AnimatePresence>
                </div>
                
                {/* Terminal Footer */}
                <div className="bg-[#222222] border-t border-[#333333] px-6 py-3">
                  <p className="text-[11px] text-[#888888] font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#61C554] animate-pulse" />
                    Authentication requires valid Bearer token.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
