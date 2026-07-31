import React, { useState, useEffect } from 'react';
import AIWidget from './AIWidget';
import { useTags, useCreateTag, useNoteRevisions, useRestoreNoteRevision } from '../hooks/useNotes';
import * as Icons from './Icons';
import { useUIStore } from '../store/uiStore';

export default function NoteEditor({ note, onSave, onCancel }) {
  const addToast = useUIStore(state => state.addToast);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [selectedTags, setSelectedTags] = useState(note?.tags || []);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const { data: allTags } = useTags();
  const createTagMut = useCreateTag();
  const [showHistory, setShowHistory] = useState(false);
  const { data: revisions } = useNoteRevisions(note?.id);
  const restoreRevision = useRestoreNoteRevision();

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setSelectedTags(note?.tags || []);
    setAiSuggestions([]);
    setTagInput('');
  }, [note]);

  const handleSave = () => onSave({ title, content, tag_ids: selectedTags.map(t => t.id), version: note?.version });

  const handleApplyImprovement = (newContent) => setContent(newContent);
  const handleApplyTags = (suggestedTagNames) => setAiSuggestions(suggestedTagNames);
  const [brainstormIdeas, setBrainstormIdeas] = useState([]);
  const handleApplyIdeas = (ideas) => setBrainstormIdeas(ideas);

  const handleAddTag = async (tagName) => {
    const cleanName = tagName.trim();
    if (!cleanName) return;
    if (selectedTags.some(t => t.name.toLowerCase() === cleanName.toLowerCase())) { setTagInput(''); return; }
    const existing = allTags?.find(t => t.name.toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      setSelectedTags([...selectedTags, existing]);
    } else {
      try {
        const res = await createTagMut.mutateAsync({ name: cleanName });
        setSelectedTags([...selectedTags, res.data]);
      } catch (err) {
        addToast('Failed to create tag: ' + err.message, 'error');
      }
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagId) => setSelectedTags(selectedTags.filter(t => t.id !== tagId));

  const handleAcceptAISuggestion = async (name) => {
    await handleAddTag(name);
    setAiSuggestions(aiSuggestions.filter(s => s !== name));
  };
  const handleRejectAISuggestion = (name) => setAiSuggestions(aiSuggestions.filter(s => s !== name));

  return (
    <div className="fixed inset-0 sm:static sm:bg-transparent rounded-none p-6 sm:p-0 h-full flex flex-col z-50 sm:z-20 w-full animate-in slide-in-from-right-5 duration-300"
      style={{ background: 'var(--bg-card-alt)' }}>
      <div className="w-full max-w-[720px] mx-auto flex flex-col h-full relative">

        {/* ─── Faint notebook lines overlay (paper feel) ─────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.045] rounded-none"
          style={{
            backgroundImage: 'linear-gradient(#6B6B6B 1px, transparent 1px)',
            backgroundSize: '100% 1.75rem',
            backgroundPositionY: '64px'
          }}
        />

        {/* ─── Title ──────────────────────────────────────────────────────── */}
        <div className="relative flex-shrink-0 mb-1 pt-1 z-10">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="text-[28px] sm:text-[36px] font-black w-full border-none focus:ring-0 tracking-tight pr-14 bg-transparent leading-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}
          />
          <div className="absolute bottom-0 left-0 right-14 h-px" style={{ background: 'var(--border-subtle)' }} />
          <button
            onClick={onCancel}
            className="absolute right-0 top-1 p-2 rounded-xl transition-all cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close editor"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Tags + AI widget ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 mt-4 mb-5 select-none flex-shrink-0 z-10">
          <div className="flex flex-wrap gap-1.5 items-center flex-1">
            {selectedTags.map(tag => (
              <span
                key={tag.id}
                className="text-[12px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 transition-all"
                style={{ background: tag.color + '18', color: tag.color, border: `1px solid ${tag.color}28` }}
              >
                {tag.name}
                <button onClick={() => handleRemoveTag(tag.id)} className="hover:opacity-70 rounded-full cursor-pointer" title="Remove Tag">
                  <Icons.X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="+ Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(tagInput); } }}
              className="border-none focus:ring-0 text-[12px] font-semibold text-[#B0A89A] hover:text-[#7A7870] w-16 p-0 bg-transparent placeholder-[#C8BEB2] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${showHistory ? 'bg-[#FFF5EC] text-[#D97745]' : 'hover:bg-[#EDE8DF] text-[#B0A89A]'}`}
              title="Version History"
            >
              <Icons.Clock className="w-4.5 h-4.5" />
            </button>
            <AIWidget content={content} onApplyImprovement={handleApplyImprovement} onApplyTags={handleApplyTags} onApplyIdeas={handleApplyIdeas} />
          </div>
        </div>

        {/* ─── AI Suggestions ─────────────────────────────────────────────── */}
        {aiSuggestions.length > 0 && (
          <div className="p-3 bg-[#EDF3EE] border border-[#4D7C5A]/20 rounded-2xl space-y-2 mb-5 flex-shrink-0 z-10">
            <p className="text-[11px] font-black text-[#4D7C5A] uppercase tracking-widest">✨ AI Suggested:</p>
            <div className="flex flex-wrap gap-1.5">
              {aiSuggestions.map(name => (
                <span key={name} className="text-[12px] bg-white text-[#4D7C5A] border border-[#4D7C5A]/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                  {name}
                  <div className="flex gap-0.5">
                    <button onClick={() => handleAcceptAISuggestion(name)} className="text-[#4D7C5A] hover:bg-[#4D7C5A]/10 w-4 h-4 rounded-full flex items-center justify-center cursor-pointer" title="Accept">
                      <Icons.Check className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleRejectAISuggestion(name)} className="text-[#B0A89A] hover:bg-[#F5F0E8] w-4 h-4 rounded-full flex items-center justify-center cursor-pointer" title="Reject">
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </div>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ─── Brainstorm Ideas ─────────────────────────────────────────────── */}
        {brainstormIdeas.length > 0 && (
          <div className="p-3 bg-[#EFF3FD] border border-[#4B6BBA]/20 rounded-2xl space-y-2 mb-5 flex-shrink-0 z-10">
            <p className="text-[11px] font-black text-[#4B6BBA] uppercase tracking-widest">💡 Brainstorm Ideas:</p>
            <div className="flex flex-wrap gap-1.5">
              {brainstormIdeas.map((idea, i) => (
                <span key={i} className="text-[12px] bg-white text-[#4B6BBA] border border-[#4B6BBA]/30 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
                  {idea}
                  <button onClick={() => setBrainstormIdeas(brainstormIdeas.filter((_, j) => j !== i))} className="text-[#B0A89A] hover:text-[#4B6BBA] w-4 h-4 rounded-full flex items-center justify-center cursor-pointer" title="Dismiss"><Icons.X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <button onClick={() => setBrainstormIdeas([])} className="text-[10px] text-[#B0A89A] hover:text-[#4B6BBA] font-bold cursor-pointer">Dismiss all</button>
          </div>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing…"
          className="flex-1 w-full text-[15px] sm:text-[17px] font-normal border-none focus:ring-0 resize-none leading-[1.75rem] scrollbar-hide bg-transparent pb-16 z-10 relative"
          style={{ color: 'var(--text-primary)' }}
        />

        {/* ─── Sticky save footer ──────────────────────────────────────────── */}
        <div className="sticky bottom-0 border-t py-4 flex justify-between items-center flex-shrink-0 z-20 w-full mt-auto"
          style={{ background: 'var(--bg-card-alt)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2 text-[12px] text-[#B0A89A] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4D7C5A] animate-pulse" />
            Auto-saved
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#D97745] hover:bg-[#C25C2B] text-white font-bold text-[14px] px-6 py-2.5 rounded-2xl shadow-sm shadow-[#D97745]/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            Save Note
          </button>
        </div>

        {/* Revisions Sidebar Flyout */}
        {showHistory && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-[#E7DED3] shadow-2xl p-5 z-50 flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-[#F0EBE3] mb-4">
              <h4 className="text-[13px] font-black text-[#1F1F1F] uppercase tracking-wider">Version History</h4>
              <button onClick={() => setShowHistory(false)} className="text-[#B0A89A] hover:text-[#7A7870] cursor-pointer">
                <Icons.X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3.5 scrollbar-hide">
              {revisions?.map(rev => (
                <div key={rev.id} className="p-3 bg-[#FDFCF8] border border-[#E7DED3] rounded-xl flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-[#B0A89A] uppercase tracking-wider font-mono">
                      {new Date(rev.created_at).toLocaleString()}
                    </span>
                    <button
                      onClick={() => {
                        restoreRevision.mutate({ noteId: note.id, revisionId: rev.id });
                        setShowHistory(false);
                      }}
                      className="text-[11px] font-bold text-[#D97745] hover:underline cursor-pointer"
                    >
                      Restore
                    </button>
                  </div>
                  <div className="border-t border-[#F0EBE3]/65 pt-2">
                    <p className="text-[12px] font-bold text-[#1F1F1F] truncate">{rev.title || "Untitled"}</p>
                    <p className="text-[11px] text-[#7A7870] line-clamp-3 leading-relaxed mt-0.5">{rev.content || "Empty..."}</p>
                  </div>
                </div>
              ))}
              {(!revisions || revisions.length === 0) && (
                <div className="text-center py-12">
                  <span className="text-2xl">⏳</span>
                  <p className="text-[13px] font-semibold text-[#B0A89A] mt-2">No revisions found</p>
                  <p className="text-[11px] text-[#C8BEB2] mt-0.5">Make edits to track version history.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
