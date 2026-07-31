import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicNote } from '../api/notes';
import logoLockup from '../assets/notely-logo-lockup.svg';

export default function SharedNote() {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicNote(token)
      .then((res) => {
        setNote(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Shared note not found or has been revoked.");
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="min-h-screen paper-texture flex flex-col font-sans" style={{ background: 'var(--bg-canvas)' }}>
      {/* Mini header */}
      <header className="px-6 py-4 flex justify-between items-center border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-sidebar)' }}>
        <Link to="/">
          <img src={logoLockup} alt="Notely" className="h-6" />
        </Link>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-[#4D7C5A] bg-[#EDF3EE] border border-[#4D7C5A]/15">
          Read Only
        </span>
      </header>

      {/* Note view */}
      <main className="flex-1 w-full max-w-[720px] mx-auto p-6 md:py-16 flex flex-col relative">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-24">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--border-subtle)', borderTopColor: 'var(--accent)' }} />
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 gap-4">
            <span className="text-4xl">⚠️</span>
            <div>
              <h2 className="text-[18px] font-black text-dark">Link Unavailable</h2>
              <p className="text-sm text-secondary mt-1">{error}</p>
            </div>
            <Link to="/" className="btn-primary mt-2 text-xs py-2 px-4 rounded-xl">
              Go to Notely Home
            </Link>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full relative">
            {/* Horizontal lines */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04] rounded-none"
              style={{
                backgroundImage: 'linear-gradient(#6B6B6B 1px, transparent 1px)',
                backgroundSize: '100% 1.75rem',
                backgroundPositionY: '12px'
              }}
            />
            
            <h1 className="text-[28px] sm:text-[36px] font-black text-[#1F1F1F] tracking-tight leading-tight mb-2 border-b border-[#E7DED3] pb-3"
              style={{ fontFamily: 'Outfit, sans-serif' }}>
              {note.title || "Untitled"}
            </h1>
            
            <div className="text-[12px] text-slate-400 font-semibold mb-6 flex items-center gap-1.5">
              <span>Published {new Date(note.created_at).toLocaleDateString()}</span>
              <span>·</span>
              <span>Updated {new Date(note.updated_at).toLocaleDateString()}</span>
            </div>

            <div className="text-[15px] sm:text-[17px] text-[#3A3935] font-normal leading-[1.75rem] whitespace-pre-wrap pb-16 z-10 relative">
              {note.content}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
