import React from 'react';
import * as Icons from './Icons';

export default function NoteCard({ note, onSelect, onDelete }) {
  return (
    <div
      onClick={() => onSelect(note)}
      style={{
        borderLeftColor: note.is_pinned ? '#D9663B' : '#E5E3DF'
      }}
      className="group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[220px] rounded-xl p-5 bg-white border border-[#E5E3DF] border-l-[3px] transition-all duration-300 hover:shadow-md hover:border-slate-300 hover:[border-left-color:#D9663B]"
    >
      {/* Pinned indicator pulse */}
      {note.is_pinned && (
        <div className="absolute top-3.5 right-3.5">
          <span className="w-2 h-2 rounded-full bg-primary block animate-pulse" />
        </div>
      )}
      
      <div>
        <div className="flex items-start justify-between gap-4 pr-4">
          <h3 className="font-display font-black text-dark truncate text-base tracking-tight leading-tight group-hover:text-primary transition-colors duration-200">
            {note.title || "Untitled"}
          </h3>
          {note.is_pinned && <Icons.Pin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />}
        </div>
        
        <p className="font-sans text-xs text-secondary font-medium mt-3 line-clamp-4 leading-relaxed tracking-tight">
          {note.content || "No content inside yet..."}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
        <div className="flex gap-1.5 flex-wrap">
          {note.tags?.slice(0, 2).map((tag) => (
            <span key={tag.id}
              className="text-[9px] px-2.5 py-1 rounded-lg font-bold tracking-wider"
              style={{ background: tag.color + "15", color: tag.color, border: `1px solid ${tag.color}30` }}>
              {tag.name}
            </span>
          ))}
          {note.tags?.length > 2 && (
            <span className="text-[9px] px-2 py-0.5 rounded-lg font-bold text-slate-400 bg-slate-50 tracking-wider">
              +{note.tags.length - 2}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {new Date(note.updated_at || note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all p-1.5 rounded-lg cursor-pointer"
            title="Delete Note"
          >
            <Icons.Trash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
