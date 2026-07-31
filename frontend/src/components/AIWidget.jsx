import React, { useState } from 'react';
import { useAISummarize, useAITags, useAIImprove, useAIExtractActions, useAITranslate, useAIBrainstorm } from '../hooks/useNotes';
import * as Icons from './Icons';
import { useUIStore } from '../store/uiStore';

const LANGUAGES = [
  { code: "Spanish", label: "🇪🇸 Spanish" },
  { code: "French", label: "🇫🇷 French" },
  { code: "German", label: "🇩🇪 German" },
  { code: "Hindi", label: "🇮🇳 Hindi" },
  { code: "Japanese", label: "🇯🇵 Japanese" },
  { code: "Portuguese", label: "🇵🇹 Portuguese" },
];

export default function AIWidget({ content, onApplyImprovement, onApplyTags, onApplyIdeas }) {
  const addToast = useUIStore(state => state.addToast);
  const [isOpen, setIsOpen] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const summarize = useAISummarize();
  const getTags = useAITags();
  const improve = useAIImprove();
  const extractActions = useAIExtractActions();
  const translate = useAITranslate();
  const brainstorm = useAIBrainstorm();

  const isAnyPending =
    summarize.isPending ||
    getTags.isPending ||
    improve.isPending ||
    extractActions.isPending ||
    translate.isPending ||
    brainstorm.isPending;

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

  const handleExtractActions = async () => {
    if (!content.trim()) return addToast("Write some content first!", "warning");
    const res = await extractActions.mutateAsync(content);
    const items = res.items || [];
    if (!items.length) return addToast("No action items found in this note.", "info");
    // Append as markdown checklist
    const checklist = "\n\n## ✅ Action Items\n" + items.map(i => `- [ ] ${i}`).join("\n");
    onApplyImprovement(content + checklist);
    addToast(`${items.length} action items extracted!`, "success");
    setIsOpen(false);
  };

  const handleTranslate = async (lang) => {
    if (!content.trim()) return addToast("Write some content first!", "warning");
    const res = await translate.mutateAsync({ content, lang });
    onApplyImprovement(res.content);
    addToast(`Note translated to ${lang}!`, "success");
    setIsOpen(false);
    setShowLangPicker(false);
  };

  const handleBrainstorm = async () => {
    if (!content.trim()) return addToast("Write some content first!", "warning");
    const res = await brainstorm.mutateAsync(content);
    const ideas = res.ideas || [];
    if (!ideas.length) return addToast("No ideas generated. Try writing more content.", "info");
    if (onApplyIdeas) onApplyIdeas(ideas);
    addToast(`${ideas.length} ideas generated!`, "success");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setIsOpen(!isOpen); setShowLangPicker(false); }}
        disabled={isAnyPending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer select-none ${
          isOpen
            ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
            : 'bg-white text-primary border-primary/40 hover:bg-primary/5 hover:border-primary'
        } ${isAnyPending ? 'opacity-70' : ''}`}
      >
        <Icons.Sparkles className={`w-3.5 h-3.5 flex-shrink-0 ${isAnyPending ? 'animate-spin' : ''}`} />
        <span>{isAnyPending ? "Working…" : "AI Magic"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E5E3DF] rounded-2xl shadow-xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-slate-400 font-black text-[11px] uppercase tracking-widest mb-2.5 border-b border-slate-100 pb-2.5 pl-2 select-none">
            Magical Tools
          </h4>
          <div className="space-y-0.5">

            {/* Summarize */}
            <button
              onClick={handleSummarize}
              disabled={summarize.isPending}
              className="w-full text-left px-3 py-2.5 text-xs font-semibold text-dark hover:bg-companion-soft hover:text-companion rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <Icons.BookOpen className="w-4 h-4 text-companion flex-shrink-0" />
              <span>{summarize.isPending ? "Summarizing…" : "Summarize Content"}</span>
            </button>

            {/* Improve */}
            <button
              onClick={handleImprove}
              disabled={improve.isPending}
              className="w-full text-left px-3 py-2.5 text-xs font-semibold text-dark hover:bg-companion-soft hover:text-companion rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <Icons.Sparkles className="w-4 h-4 text-companion flex-shrink-0" />
              <span>{improve.isPending ? "Refining…" : "Improve Writing"}</span>
            </button>

            {/* Suggest Tags */}
            <button
              onClick={handleSuggestTags}
              disabled={getTags.isPending}
              className="w-full text-left px-3 py-2.5 text-xs font-semibold text-dark hover:bg-companion-soft hover:text-companion rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <Icons.Folder className="w-4 h-4 text-companion flex-shrink-0" />
              <span>{getTags.isPending ? "Thinking…" : "Suggest Tags"}</span>
            </button>

            <div className="border-t border-slate-100 my-1.5" />

            {/* Extract Action Items */}
            <button
              onClick={handleExtractActions}
              disabled={extractActions.isPending}
              className="w-full text-left px-3 py-2.5 text-xs font-semibold text-dark hover:bg-companion-soft hover:text-companion rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <Icons.Check className="w-4 h-4 text-companion flex-shrink-0" />
              <span>{extractActions.isPending ? "Extracting…" : "Extract Action Items"}</span>
            </button>

            {/* Brainstorm */}
            <button
              onClick={handleBrainstorm}
              disabled={brainstorm.isPending}
              className="w-full text-left px-3 py-2.5 text-xs font-semibold text-dark hover:bg-companion-soft hover:text-companion rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <Icons.Sparkles className="w-4 h-4 text-companion flex-shrink-0 animate-pulse" />
              <span>{brainstorm.isPending ? "Brainstorming…" : "Brainstorm Ideas"}</span>
            </button>

            {/* Translate */}
            <div className="relative">
              <button
                onClick={() => setShowLangPicker(!showLangPicker)}
                disabled={translate.isPending}
                className="w-full text-left px-3 py-2.5 text-xs font-semibold text-dark hover:bg-companion-soft hover:text-companion rounded-lg transition-colors flex items-center justify-between gap-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Icons.BookOpen className="w-4 h-4 text-companion flex-shrink-0" />
                  <span>{translate.isPending ? "Translating…" : "Translate Note"}</span>
                </div>
                <span className="text-[10px] text-slate-400">▶</span>
              </button>

              {showLangPicker && (
                <div className="absolute left-full top-0 ml-2 w-44 bg-white border border-[#E5E3DF] rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => handleTranslate(l.code)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-dark hover:bg-companion-soft hover:text-companion rounded-lg transition-colors cursor-pointer"
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
