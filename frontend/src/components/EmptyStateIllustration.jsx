import React from 'react';
import { IconOwl, IconSprout, IconNotebook } from './CompanyIllustrations';

/**
 * EmptyStateIllustration — now uses the same mascot family as the marketing
 * site (owl/sprout/notebook) so first-run moments feel like they're part of
 * the same Notely world the user saw on the landing page.
 */
export default function EmptyStateIllustration({ 
  className = "w-40 h-40",
  variant = "notes"   // "notes" | "chat" | "folders"
}) {
  if (variant === "chat") {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <div className="relative">
          <div className="w-20 h-20 rounded-[22px] bg-[#EDF3EE] border border-[#4D7C5A]/20 flex items-center justify-center rotate-[-4deg]">
            <IconOwl className="w-12 h-12" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D97745] border-2 border-[#FAF7F2] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[14px] font-black text-[#1F1F1F] tracking-tight">Ask Notely AI</p>
          <p className="text-[12px] text-[#B0A89A] font-medium mt-0.5">Ask questions about your notes</p>
        </div>
      </div>
    );
  }

  if (variant === "folders") {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <div className="w-16 h-16 rounded-[18px] bg-[#FFF5EC] border border-[#D97745]/20 flex items-center justify-center rotate-[3deg]">
          <IconNotebook className="w-9 h-9" />
        </div>
        <div className="text-center">
          <p className="text-[13px] font-black text-[#1F1F1F]">No folders yet</p>
          <p className="text-[11px] text-[#B0A89A] font-medium mt-0.5">Organize your notes into workspaces.</p>
        </div>
      </div>
    );
  }

  // Default: notes
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative">
        <div className="w-24 h-24 rounded-[24px] bg-[#FFF5EC] border border-[#D97745]/20 flex items-center justify-center rotate-[-3deg] shadow-sm">
          <IconSprout className="w-14 h-14" />
        </div>
        {/* Tiny star doodle */}
        <svg className="absolute -top-2 -right-2 w-5 h-5 text-[#D97745]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" opacity="0.6"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="text-[16px] font-black text-[#1F1F1F] tracking-tight">Knowledge begins here</p>
        <p className="text-[13px] text-[#7A7870] font-medium mt-1 leading-relaxed max-w-[180px]">
          Start capturing ideas, meeting notes, and everything in between.
        </p>
      </div>
    </div>
  );
}
