import React from 'react';
import { useParams } from 'react-router-dom';

const legalData = {
  "privacy": {
    title: "Privacy Policy",
    subtitle: "Last Updated: July 30, 2026",
    sections: [
      {
        title: "1. Information We Collect",
        desc: "We collect account details (email address, full name, avatar layouts) when you register. We do not inspect your document content sheets except for indexing database search terms on your behalf."
      },
      {
        title: "2. How We Use Information",
        desc: "We use data parameters to authorize session connections, process subscription billing logs, and verify compliance audits. Your records are never sold or shared with advertiser hubs."
      },
      {
        title: "3. Compliance & Portability",
        desc: "Notely fully complies with GDPR directives. You retain complete ownership of your notes. You can export or request full deletion of your database profiles at any time."
      }
    ]
  },
  "terms": {
    title: "Terms of Service",
    subtitle: "Last Updated: July 30, 2026",
    sections: [
      {
        title: "1. Acceptance of Terms",
        desc: "By setting up a Notely workspace account, you agree to these legal conditions. You must not leverage workspaces to distribute malicious scripts or execute illegal activities."
      },
      {
        title: "2. Account Responsibilities",
        desc: "You are solely responsible for actions performed under your workspace session tokens. Do not expose JWT keys or authorization keys publicly."
      },
      {
        title: "3. Termination & Refunds",
        desc: "You can cancel subscriptions at any time. Refunds for annual billing intervals can be processed within 14 days of transaction logs."
      }
    ]
  }
};

export default function LegalPage() {
  const { slug } = useParams();
  const data = legalData[slug] || legalData["privacy"];

  return (
    <div className="py-20 px-6 max-w-2xl mx-auto space-y-8 text-left animate-in fade-in duration-300">
      
      {/* Header details */}
      <div className="space-y-2 border-b border-[#F0EFEF] pb-6">
        <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#111111] leading-tight">
          {data.title}
        </h1>
        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">{data.subtitle}</p>
      </div>

      {/* Policy sections */}
      <div className="space-y-8 text-sm text-[#111111] leading-relaxed">
        {data.sections.map((sec, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="font-bold text-xs text-[#111111]">{sec.title}</h3>
            <p className="text-[#666666] leading-relaxed">{sec.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
