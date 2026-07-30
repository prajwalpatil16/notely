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

  // Listen to Quick-Ask command submissions
  useEffect(() => {
    if (prefilledQuery) {
      handlePrefilledSend(prefilledQuery);
    }
  }, [prefilledQuery]);

  const handlePrefilledSend = async (queryText) => {
    onClearPrefilled();
    if (!queryText.trim()) return;

    try {
      const res = await sendChatMut.mutateAsync({
        message: queryText,
        chatSessionId: selectedSessionId
      });
      if (!selectedSessionId && res.data?.chat_session_id) {
        setSelectedSessionId(res.data.chat_session_id);
      }
    } catch (err) {
      addToast("Failed to send message: " + err.message, "error");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const msg = inputMessage;
    setInputMessage('');

    try {
      const res = await sendChatMut.mutateAsync({
        message: msg,
        chatSessionId: selectedSessionId
      });
      if (!selectedSessionId && res.data?.chat_session_id) {
        setSelectedSessionId(res.data.chat_session_id);
      }
    } catch (err) {
      addToast("Failed to send message: " + err.message, "error");
    }
  };

  const handleNewChat = () => {
    setSelectedSessionId(null);
  };

  return (
    // Responsive slide-in right overlay (~400px width on desktop)
    <div className="fixed inset-0 lg:static w-full lg:w-[400px] bg-white border-l border-[#E5E3DF] flex flex-col h-full lg:h-screen shadow-2xl lg:shadow-none z-50 lg:z-30 animate-in slide-in-from-right-10 duration-250">
      
      {/* Header */}
      <div className="p-6 border-b border-[#E5E3DF]/80 flex justify-between items-center bg-[#F7F7F5]/50 select-none">
        <div>
          <h2 className="text-sm font-bold text-dark tracking-tight">AI Companion</h2>
          <p className="text-[12px] text-slate-400 font-semibold mt-0.5">Chat with your knowledge canvas</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNewChat}
            className="px-3 py-1.5 bg-primary text-white hover:bg-primary-dark rounded-lg transition-all font-bold text-[12px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <Icons.Sparkles className="w-3 h-3 text-white" /> New Chat
          </button>
          
          {/* Close trigger */}
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
              title="Close Panel"
            >
              <Icons.X className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedSessionId ? (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 select-none">Recent Chats</h3>
            {isLoadingSessions ? (
              <div className="flex justify-center py-6">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-1.5">
                {sessions?.map(session => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className="p-3 border border-[#E5E3DF]/60 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <p className="font-semibold text-xs text-dark truncate mb-0.5">{session.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(session.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {(!sessions || sessions.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-12 opacity-65 gap-3 select-none">
                    <EmptyStateIllustration className="w-16 h-16 opacity-50" />
                    <p className="text-[13px] font-semibold text-slate-400 text-center">Start a conversation by typing below!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
            <button
              onClick={() => setSelectedSessionId(null)}
              className="text-[11px] font-black text-primary hover:text-primary-dark uppercase tracking-widest flex items-center gap-1 mb-4 cursor-pointer"
            >
              ← Back to list
            </button>

            {isLoadingMessages ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  {/* Claude-style Asymmetry: User inside quiet neutral bubble, Assistant has no background */}
                  {msg.role === 'user' ? (
                    <div className="p-4 rounded-xl text-xs font-semibold leading-relaxed tracking-tight bg-slate-100 text-dark rounded-tr-none border border-[#E5E3DF]/50 shadow-sm">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="text-xs font-medium leading-relaxed tracking-tight text-dark pl-2 border-l-2 border-slate-100/50">
                      {msg.content}
                    </div>
                  )}

                  {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 items-center select-none">
                      {msg.citations.map((cite) => (
                        <button
                          key={cite.id}
                          onClick={() => onSelectNote(cite)}
                          className="text-[11px] px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-md hover:border-slate-400 font-medium transition-colors text-slate-500 hover:text-dark cursor-pointer flex items-center gap-1 max-w-[150px] truncate"
                          title={`Open ${cite.title}`}
                        >
                          <span>From:</span>
                          <span className="italic font-semibold">{cite.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}

            {sendChatMut.isPending && (
              <div className="flex flex-col items-start max-w-[80%]">
                <div className="p-3 bg-slate-50 border border-[#E5E3DF]/50 rounded-xl rounded-tl-none text-slate-400 text-xs font-semibold flex items-center gap-1.5 select-none">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce duration-500" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce duration-500 [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce duration-500 [animation-delay:0.3s]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSend} className="p-4 border-t border-[#E5E3DF] bg-white flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask AI about notes..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={sendChatMut.isPending}
            className="w-full bg-[#F7F7F5] border border-[#E5E3DF] focus:border-primary rounded-lg py-2.5 pl-4 pr-12 focus:outline-none focus:bg-white shadow-sm font-semibold text-xs text-dark placeholder-slate-400 transition-colors"
          />
          <button
            type="submit"
            disabled={sendChatMut.isPending || !inputMessage.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-primary-dark text-white rounded-md disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <Icons.Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
