import React from 'react';
import * as Icons from './Icons';

// Subtle random-ish rotation per card index
const ROTATIONS = ['-rotate-[0.8deg]', 'rotate-[0.6deg]', '-rotate-[0.4deg]', 'rotate-[1deg]', '-rotate-[0.6deg]', 'rotate-[0.4deg]'];

export default function NoteCard({ note, onSelect, onDelete, index = 0 }) {
  const rot = ROTATIONS[index % ROTATIONS.length];

  return (
    <div
      onClick={() => onSelect(note)}
      className={`
        group cursor-pointer relative flex flex-col justify-between
        min-h-[200px] rounded-[20px] p-5
        transition-all duration-250
        hover:-translate-y-1
        ${rot} hover:rotate-0
      `}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 8px rgba(200,190,178,0.2)',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(200,190,178,0.35)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(200,190,178,0.2)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
    >
      {/* Pinned accent stripe */}
      {note.is_pinned && (
        <div className="absolute top-0 left-5 right-5 h-[3px] rounded-full" style={{ background: 'var(--accent)' }} />
      )}
      {/* Rivet dot */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full" style={{ background: 'var(--border-subtle)' }} />

      {/* Content */}
      <div>
        <div className="flex items-start justify-between gap-3 pr-4">
          <h3 className="font-black text-[15px] tracking-tight leading-snug line-clamp-2 group-hover:transition-colors duration-200"
            style={{ color: 'var(--text-primary)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
          >
            {note.title || 'Untitled'}
          </h3>
          {note.is_pinned && <Icons.Pin className="w-3.5 h-3.5 text-[#D97745] flex-shrink-0 mt-0.5" />}
        </div>

        <p className="text-[13px] font-medium mt-3 line-clamp-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {note.content || 'No content yet…'}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid var(--bg-hover)' }}>
        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {note.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide"
              style={{ background: tag.color + '18', color: tag.color, border: `1px solid ${tag.color}30` }}
            >
              {tag.name}
            </span>
          ))}
          {note.tags?.length > 2 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full font-bold text-[#B0A89A] bg-[#F5F0E8]">
              +{note.tags.length - 2}
            </span>
          )}
        </div>

        {/* Date + delete */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#B0A89A] uppercase tracking-widest">
            {new Date(note.updated_at || note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="opacity-0 group-hover:opacity-100 text-[#C8BEB2] hover:text-red-400 hover:bg-red-50 transition-all p-1.5 rounded-lg cursor-pointer"
            title="Delete Note"
          >
            <Icons.Trash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
