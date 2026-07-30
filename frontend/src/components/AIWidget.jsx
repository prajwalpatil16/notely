import React, { useState } from 'react';
import { useAISummarize, useAITags, useAIImprove } from '../hooks/useNotes';
import * as Icons from './Icons';
import { useUIStore } from '../store/uiStore';

export default function AIWidget({ content, onApplyImprovement, onApplyTags }) {
  const addToast = useUIStore(state => state.addToast);
  const [isOpen, setIsOpen] = useState(false);
  const summarize = useAISummarize();
  const getTags = useAITags();
  const improve = useAIImprove();

  const handleSummarize = async () => {
    if (!content.trim()) return addToast("Write some content first!", "warning");
    const res = await summarize.mutateAsync(content);
    addToast("Summary:\n" + res.data.summary, "info", 8000);
    setIsOpen(false);
  };

  const handleImprove = async () => {
    if (!content.trim()) return addToast("Write some content first!", "warning");
    const res = await improve.mutateAsync(content);
    onApplyImprovement(res.data.content);
    addToast("Writing improved successfully!", "success");
    setIsOpen(false);
  };

  const handleSuggestTags = async () => {
    if (!content.trim()) return addToast("Write some content first!", "warning");
    const res = await getTags.mutateAsync(content);
    onApplyTags(res.data.tags);
    addToast("Tags suggested successfully!", "success");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer select-none ${
          isOpen 
            ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' 
            : 'bg-white text-primary border-primary/40 hover:bg-primary/5 hover:border-primary'
        }`}
      >
        <Icons.Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
        <span>AI Magic</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-[#E5E3DF] rounded-2xl shadow-xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-slate-400 font-black text-[11px] uppercase tracking-widest mb-2.5 border-b border-slate-100 pb-2.5 pl-2 select-none">Magical Tools</h4>
          <div className="space-y-1">
            <button 
              onClick={handleSummarize}
              disabled={summarize.isPending}
              className="w-full text-left px-3 py-2.5 text-xs font-semibold text-dark hover:bg-companion-soft hover:text-companion rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <Icons.BookOpen className="w-4 h-4 text-companion" /> 
              <span>{summarize.isPending ? "Summarizing..." : "Summarize Content"}</span>
            </button>
            <button 
              onClick={handleImprove}
              disabled={improve.isPending}
              className="w-full text-left px-3 py-2.5 text-xs font-semibold text-dark hover:bg-companion-soft hover:text-companion rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <Icons.Sparkles className="w-4 h-4 text-companion animate-pulse" /> 
              <span>{improve.isPending ? "Refining..." : "Improve Writing"}</span>
            </button>
            <button 
              onClick={handleSuggestTags}
              disabled={getTags.isPending}
              className="w-full text-left px-3 py-2.5 text-xs font-semibold text-dark hover:bg-companion-soft hover:text-companion rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <Icons.Folder className="w-4 h-4 text-companion" /> 
              <span>{getTags.isPending ? "Thinking..." : "Suggest Tags"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
