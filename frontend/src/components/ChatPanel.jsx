import React, { useState, useEffect } from 'react';
import { useChatSessions, useSessionMessages, useSendChatMessage } from '../hooks/useNotes';
import EmptyStateIllustration from './EmptyStateIllustration';
import * as Icons from './Icons';
import { useUIStore } from '../store/uiStore';

export default function ChatPanel({ onSelectNote, onClose, prefilledQuery, onClearPrefilled }) {
  const addToast = useUIStore(state => state.addToast);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [inputMessage, setInputMessage] = useState('');

  const { data: sessions, isLoading: isLoadingSessions } = useChatSessions();
  const { data: messages, isLoading: isLoadingMessages } = useSessionMessages(selectedSessionId);
  const sendChatMut = useSendChatMessage();

  useEffect(() => {
    if (prefilledQuery) handlePrefilledSend(prefilledQuery);
  }, [prefilledQuery]);

  const handlePrefilledSend = async (queryText) => {
    onClearPrefilled();
    if (!queryText.trim()) return;
    try {
      const res = await sendChatMut.mutateAsync({ message: queryText, chatSessionId: selectedSessionId });
      if (!selectedSessionId && res.data?.chat_session_id) setSelectedSessionId(res.data.chat_session_id);
    } catch (err) { addToast('Failed to send: ' + err.message, 'error'); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const msg = inputMessage;
    setInputMessage('');
    try {
      const res = await sendChatMut.mutateAsync({ message: msg, chatSessionId: selectedSessionId });
      if (!selectedSessionId && res.data?.chat_session_id) setSelectedSessionId(res.data.chat_session_id);
    } catch (err) { addToast('Failed to send: ' + err.message, 'error'); }
  };

  return (
    <div className="fixed inset-0 lg:static w-full lg:w-[380px] flex flex-col h-full lg:h-screen z-50 lg:z-30"
      style={{ background: 'var(--bg-canvas)', borderLeft: '1px solid var(--border-subtle)' }}>

      {/* ─── Header ──────────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b flex items-center justify-between flex-shrink-0"
        style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-sidebar)' }}>
        <div className="flex items-center gap-3">
          {/* Owl mascot badge */}
          <div className="w-8 h-8 rounded-xl flex items-center justify-center rotate-[-2deg]"
            style={{ background: 'var(--companion-soft)', border: '1px solid rgba(77,124,90,0.2)' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 L19 9 L19 20 L5 20 L5 9 Z" fill="#F8F5EF" stroke="#171717" strokeWidth="1.8" />
              <circle cx="9" cy="10" r="2.2" fill="#F8F5EF" stroke="#171717" strokeWidth="1.8" />
              <circle cx="15" cy="10" r="2.2" fill="#F8F5EF" stroke="#171717" strokeWidth="1.8" />
              <circle cx="9" cy="10" r="0.85" fill="#171717" />
              <circle cx="15" cy="10" r="0.85" fill="#171717" />
              <polygon points="12,12 10.8,14.2 13.2,14.2" fill="#E8B44C" stroke="#171717" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h2 className="text-[14px] font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Notely AI</h2>
            <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Ask questions about your workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedSessionId(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[12px] cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <Icons.Sparkles className="w-3 h-3" /> New
          </button>
          {onClose && (
            <button onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl cursor-pointer transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Icons.X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ─── Message area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedSessionId ? (
          <div className="flex-1 flex flex-col p-5 overflow-y-auto scrollbar-hide">
            <p className="section-label mb-4">Recent Chats</p>

            {isLoadingSessions ? (
              <div className="flex justify-center py-8">
                <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--border-subtle)', borderTopColor: 'var(--accent)' }} />
              </div>
            ) : (
              <div className="space-y-1.5">
                {sessions?.map(session => (
                  <div key={session.id} onClick={() => setSelectedSessionId(session.id)}
                    className="p-3.5 rounded-2xl cursor-pointer transition-all duration-150 hover:rotate-0 group"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
                  >
                    <p className="font-semibold text-[13px] truncate mb-0.5" style={{ color: 'var(--text-primary)' }}>
                      {session.title}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {new Date(session.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {(!sessions || sessions.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <EmptyStateIllustration variant="chat" className="w-52 h-52" />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 p-5 overflow-y-auto scrollbar-hide space-y-5">
            <button onClick={() => setSelectedSessionId(null)}
              className="section-label flex items-center gap-1 mb-2 cursor-pointer transition-colors"
              style={{ color: 'var(--accent)' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              ← Back
            </button>

            {isLoadingMessages ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--border-subtle)', borderTopColor: 'var(--accent)' }} />
              </div>
            ) : messages?.map(msg => (
              <div key={msg.id}
                className={`flex flex-col max-w-[88%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                {msg.role === 'user' ? (
                  <div className="p-3.5 rounded-2xl rounded-tr-none text-[13px] font-semibold leading-relaxed"
                    style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                    {msg.content}
                  </div>
                ) : (
                  <div className="text-[13px] font-medium leading-relaxed pl-3"
                    style={{ color: 'var(--text-primary)', borderLeft: '2px solid var(--border-subtle)' }}>
                    {msg.content}
                  </div>
                )}
                {msg.role === 'assistant' && msg.citations?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.citations.map(cite => (
                      <button key={cite.id} onClick={() => onSelectNote(cite)}
                        className="text-[11px] px-2.5 py-1 rounded-full font-semibold cursor-pointer transition-all"
                        style={{ background: 'var(--bg-hover-warm)', color: 'var(--accent)', border: '1px solid rgba(217,119,69,0.2)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-soft)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-hover-warm)'}
                      >
                        ↗ {cite.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {sendChatMut.isPending && (
              <div className="flex items-start gap-1.5 max-w-[80%] pl-1">
                {[0, 150, 300].map(delay => (
                  <span key={delay} className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: 'var(--accent)', animationDelay: `${delay}ms` }} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Input ───────────────────────────────────────────────────── */}
      <form onSubmit={handleSend} className="p-4 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-sidebar)' }}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none">✨</span>
          <input
            type="text"
            placeholder="Ask about your notes…"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            disabled={sendChatMut.isPending}
            className="w-full rounded-2xl py-3 pl-10 pr-12 text-[13px] font-medium transition-all duration-200 focus:outline-none"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
          />
          <button
            type="submit"
            disabled={sendChatMut.isPending || !inputMessage.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#fff' }}
            onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--accent-dark)'; }}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            <Icons.Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
