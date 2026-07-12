import React, { useState, useEffect } from 'react';
import AIWidget from './AIWidget';
import { useTags, useCreateTag } from '../hooks/useNotes';
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

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setSelectedTags(note?.tags || []);
    setAiSuggestions([]);
    setTagInput('');
  }, [note]);

  const handleSave = () => {
    onSave({ 
      title, 
      content, 
      tag_ids: selectedTags.map(t => t.id) 
    });
  };

  const handleApplyImprovement = (newContent) => {
    setContent(newContent);
  };

  const handleApplyTags = (suggestedTagNames) => {
    setAiSuggestions(suggestedTagNames);
  };

  const handleAddTag = async (tagName) => {
    const cleanName = tagName.trim();
    if (!cleanName) return;

    if (selectedTags.some(t => t.name.toLowerCase() === cleanName.toLowerCase())) {
      setTagInput('');
      return;
    }

    const existing = allTags?.find(t => t.name.toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      setSelectedTags([...selectedTags, existing]);
    } else {
      try {
        const res = await createTagMut.mutateAsync({ name: cleanName });
        setSelectedTags([...selectedTags, res.data]);
      } catch (err) {
        addToast("Failed to create tag: " + err.message, "error");
      }
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagId) => {
    setSelectedTags(selectedTags.filter(t => t.id !== tagId));
  };

  const handleAcceptAISuggestion = async (name) => {
    await handleAddTag(name);
    setAiSuggestions(aiSuggestions.filter(s => s !== name));
  };

  const handleRejectAISuggestion = (name) => {
    setAiSuggestions(aiSuggestions.filter(s => s !== name));
  };

  return (
    // Borderless workspace layout on desktop, full screen absolute overlay on mobile
    <div className="fixed inset-0 sm:static bg-white sm:bg-transparent rounded-none p-6 sm:p-0 h-full flex flex-col z-50 sm:z-20 w-full animate-in slide-in-from-right-5 duration-300">
      <div className="w-full max-w-[720px] mx-auto flex flex-col h-full">
        
        {/* Title row with close control */}
        <div className="flex justify-between items-center mb-4 relative flex-shrink-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="text-2xl sm:text-3xl font-bold text-dark w-full border-none focus:ring-0 placeholder-slate-300 tracking-tight pr-16 bg-transparent"
          />
          <button 
            onClick={onCancel} 
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            aria-label="Close editor"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiet Tag input row directly under title */}
        <div className="flex items-center justify-between gap-4 mb-6 select-none flex-shrink-0">
          <div className="flex flex-wrap gap-1.5 items-center flex-1">
            {selectedTags.map(tag => (
              <span 
                key={tag.id}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-[#F3D9C8]/40 text-slate-500 hover:text-primary border border-transparent hover:border-primary/10 flex items-center gap-1 transition-all"
              >
                {tag.name}
                <button 
                  onClick={() => handleRemoveTag(tag.id)}
                  className="hover:text-primary rounded-full"
                  title="Remove Tag"
                >
                  <Icons.X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            <input 
              type="text"
              placeholder="+ Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(tagInput);
                }
              }}
              className="border-none focus:ring-0 text-[10px] font-semibold text-slate-400 hover:text-slate-600 w-16 p-0 bg-transparent placeholder-slate-300 transition-colors"
            />
          </div>
          
          <AIWidget 
            content={content} 
            onApplyImprovement={handleApplyImprovement}
            onApplyTags={handleApplyTags}
          />
        </div>

        {/* AI Suggested Tags list */}
        {aiSuggestions.length > 0 && (
          <div className="p-3 bg-purple-50/20 border border-purple-100/50 rounded-xl space-y-2 mb-6 flex-shrink-0">
            <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest">AI Suggested:</p>
            <div className="flex flex-wrap gap-1.5">
              {aiSuggestions.map(name => (
                <span 
                  key={name}
                  className="text-[10px] bg-white text-purple-700 border border-purple-200/80 px-2 py-1 rounded-lg font-bold flex items-center gap-1.5"
                >
                  {name}
                  <div className="flex gap-0.5">
                    <button 
                      onClick={() => handleAcceptAISuggestion(name)}
                      className="text-green-600 hover:bg-green-50 w-4 h-4 rounded flex items-center justify-center cursor-pointer"
                      title="Accept Tag"
                    >
                      <Icons.Check className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleRejectAISuggestion(name)}
                      className="text-red-500 hover:bg-red-50 w-4 h-4 rounded flex items-center justify-center cursor-pointer"
                      title="Reject Tag"
                    >
                      <Icons.X className="w-3 h-3" />
                    </button>
                  </div>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content body textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="flex-1 w-full text-sm sm:text-[15px] text-dark font-normal border-none focus:ring-0 resize-none placeholder-slate-300 leading-relaxed scrollbar-hide bg-transparent pb-16"
        />

        {/* Sticky Save note footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#E5E3DF]/50 py-4 flex justify-end items-center flex-shrink-0 z-10 w-full mt-auto">
          <button
            onClick={handleSave}
            className="btn-primary w-full sm:w-auto text-center"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
