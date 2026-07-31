import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import ChatPanel from '../components/ChatPanel';
import GraphView from '../components/GraphView';
import SettingsModal from '../components/SettingsModal';
import EmptyStateIllustration from '../components/EmptyStateIllustration';
import { useNotes, useFolders, useCreateNote, useUpdateNote, useDeleteNote, useExportNote, useShareNote, useRevokeNoteShare, useSemanticSearch, useAIGenerateDraft } from '../hooks/useNotes';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import * as Icons from '../components/Icons';

// ─── Greeting helper ──────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const addToast = useUIStore(state => state.addToast);
  const currentUser = useAuthStore(state => state.user);

  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [quickAskInput, setQuickAskInput] = useState('');
  const [chatQuery, setChatQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [aiSearchMode, setAiSearchMode] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState(null);
  const [showGenerateDraft, setShowGenerateDraft] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState('');

  const { data: notes, isLoading: isLoadingNotes } = useNotes({ folder_id: selectedFolder, q: searchQuery });
  const { data: folders } = useFolders();

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const exportNoteMut = useExportNote();
  const startSharing = useShareNote();
  const stopSharing = useRevokeNoteShare();
  const semanticSearchMut = useSemanticSearch();
  const generateDraftMut = useAIGenerateDraft();
  const logout = useAuthStore(state => state.logout);

  const handleSave = async (data) => {
    if (selectedNote?.id) {
      await updateNote.mutateAsync({ id: selectedNote.id, data });
    } else {
      await createNote.mutateAsync({ ...data, folder_id: selectedFolder });
    }
    setSelectedNote(null);
  };

  const handleCreateNew = () => setSelectedNote({ title: '', content: '', tags: [] });

  const handleQuickAsk = (e) => {
    e.preventDefault();
    if (!quickAskInput.trim()) return;
    setChatQuery(quickAskInput);
    setQuickAskInput('');
    setChatOpen(true);
  };

  const handleAISearch = async (q) => {
    if (!q.trim()) { setAiSearchResults(null); return; }
    const data = await semanticSearchMut.mutateAsync({ q: q.trim(), limit: 15 });
    setAiSearchResults(data);
  };

  const handleGenerateDraft = async (e) => {
    e.preventDefault();
    if (!draftPrompt.trim()) return;
    const draft = await generateDraftMut.mutateAsync(draftPrompt.trim());
    setSelectedNote({ title: draft.title || draftPrompt, content: draft.content || '', tags: [] });
    setDraftPrompt('');
    setShowGenerateDraft(false);
  };

  const handleTogglePin = async () => {
    if (!selectedNote?.id) return;
    try {
      const res = await updateNote.mutateAsync({ id: selectedNote.id, data: { is_pinned: !selectedNote.is_pinned } });
      setSelectedNote(res.data);
      addToast(res.data.is_pinned ? 'Note pinned!' : 'Note unpinned!', 'success');
    } catch { addToast('Failed to toggle pin.', 'error'); }
    finally { setMoreMenuOpen(false); }
  };

  const handleToggleArchive = async () => {
    if (!selectedNote?.id) return;
    try {
      const res = await updateNote.mutateAsync({ id: selectedNote.id, data: { is_archived: !selectedNote.is_archived } });
      setSelectedNote(null);
      addToast(res.data.is_archived ? 'Note archived!' : 'Note unarchived!', 'success');
    } catch { addToast('Failed to archive note.', 'error'); }
    finally { setMoreMenuOpen(false); }
  };

  const handleDeleteCurrentNote = async () => {
    if (!selectedNote?.id) return;
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote.mutateAsync(selectedNote.id);
        setSelectedNote(null);
        addToast('Note deleted.', 'success');
      } catch { addToast('Failed to delete note.', 'error'); }
      finally { setMoreMenuOpen(false); }
    }
  };

  const firstName = currentUser?.name?.split(' ')[0] || 'there';

  return (
    <div className="flex h-screen paper-texture overflow-hidden font-sans" style={{ background: 'var(--bg-canvas)' }}>

      {/* Sidebar */}
      <Sidebar
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
        onLogout={logout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        notes={notes}
        onSelectNote={setSelectedNote}
        onDeleteNote={(id) => deleteNote.mutate(id)}
        onOpenSettings={(tab) => { setSettingsTab(tab || 'profile'); setSettingsOpen(true); }}
      />

      {/* Main canvas */}
      <main className="flex-1 flex flex-col overflow-hidden relative">

        {/* ─── Topbar ─────────────────────────────────────────────────────── */}
        <header className="h-[56px] border-b border-[#E7DED3] bg-[#FAF7F2] flex items-center justify-between px-6 flex-shrink-0 select-none">

          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-[#EDE8DF] rounded-xl text-[#B0A89A] cursor-pointer transition-colors"
            >
              <Icons.Menu className="w-4 h-4" />
            </button>
            <span className="text-[13px] font-bold text-[#1F1F1F] truncate">
              {selectedNote
                ? (selectedNote.title || 'Untitled Note')
                : selectedFolder
                  ? (folders?.find(f => f.id === selectedFolder)?.name || 'Workspace')
                  : 'Workspace'}
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Map */}
            <button
              onClick={() => setMapOpen(!mapOpen)}
              className={`p-2 rounded-xl cursor-pointer transition-all ${mapOpen ? 'bg-[#FFF5EC] text-[#D97745]' : 'hover:bg-[#EDE8DF] text-[#B0A89A]'}`}
              title="Knowledge Map"
            >
              <Icons.Map className="w-4 h-4" />
            </button>

            {/* Share */}
            {selectedNote && (
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 hover:bg-[#EDE8DF] rounded-xl text-[#B0A89A] hover:text-[#7A7870] cursor-pointer transition-colors"
                title="Share Note"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.748L15 12m0 0l-6.316 1.252m6.316-1.252V6m0 6v6M4 12a2 2 0 11-4 0 2 2 0 014 0zM18 6a2 2 0 11-4 0 2 2 0 014 0zM18 18a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            )}

            {/* AI chat */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-2 rounded-xl cursor-pointer transition-all ${chatOpen ? 'bg-[#EDF3EE] text-[#4D7C5A]' : 'hover:bg-[#EDE8DF] text-[#B0A89A]'}`}
              title="AI Companion"
            >
              <Icons.Message className="w-4 h-4" />
            </button>

            {/* More */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`p-2 rounded-xl cursor-pointer transition-all text-[#B0A89A] ${moreMenuOpen ? 'bg-[#EDE8DF] text-[#7A7870]' : 'hover:bg-[#EDE8DF]'}`}
                title="More"
              >
                <span className="text-sm font-black">⋯</span>
              </button>

              {moreMenuOpen && (
                <>
                  <div className="fixed inset-0 z-45" onClick={() => setMoreMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E7DED3] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-black text-[#B0A89A] uppercase tracking-widest border-b border-[#F5F0E8] mb-1">
                      {selectedNote ? 'Note Actions' : 'Workspace'}
                    </div>
                    {selectedNote ? (
                      <>
                        <MenuBtn onClick={handleTogglePin} icon="📌">{selectedNote.is_pinned ? 'Unpin Note' : 'Pin Note'}</MenuBtn>
                        <MenuBtn onClick={handleToggleArchive} icon="📁">{selectedNote.is_archived ? 'Unarchive' : 'Archive Note'}</MenuBtn>
                        <MenuBtn onClick={() => { exportNoteMut.mutate({ id: selectedNote.id, format: 'md' }); setMoreMenuOpen(false); }} icon="📥">Export Markdown</MenuBtn>
                        <MenuBtn onClick={() => { exportNoteMut.mutate({ id: selectedNote.id, format: 'json' }); setMoreMenuOpen(false); }} icon="📥">Export JSON</MenuBtn>
                        <MenuBtn onClick={handleDeleteCurrentNote} icon="🗑️" danger>Delete Note</MenuBtn>
                        <MenuBtn onClick={() => { setSelectedNote(null); setMoreMenuOpen(false); }} icon="✕" divider>Close Editor</MenuBtn>
                      </>
                    ) : (
                      <>
                        <MenuBtn onClick={() => { setMapOpen(!mapOpen); setMoreMenuOpen(false); }} icon="🗺️">{mapOpen ? 'Hide Map' : 'Show Knowledge Map'}</MenuBtn>
                        <MenuBtn onClick={() => { handleCreateNew(); setMoreMenuOpen(false); }} icon="➕">Create New Note</MenuBtn>
                        <MenuBtn onClick={() => { setSettingsTab('profile'); setSettingsOpen(true); setMoreMenuOpen(false); }} icon="⚙️" divider>Settings & Profile</MenuBtn>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ─── Content ─────────────────────────────────────────────────────── */}
        <div className="flex-1 px-6 sm:px-12 py-8 overflow-hidden flex flex-col">
          <div className="flex-1 w-full max-w-[800px] mx-auto flex flex-col overflow-y-auto scrollbar-hide">

            {selectedNote ? (
              <div className="flex-1 h-full">
                <NoteEditor note={selectedNote} onSave={handleSave} onCancel={() => setSelectedNote(null)} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col">

                {/* ─── Greeting header ─────────────────────────────────── */}
                {!mapOpen && (
                  <div className="mb-8 flex-shrink-0">
                    <h1 className="text-[28px] md:text-[34px] font-black text-[#1F1F1F] tracking-tight leading-tight">
                      {getGreeting()}, {firstName}.
                    </h1>
                    <p className="text-[15px] text-[#7A7870] font-medium mt-1">
                      {notes?.length
                        ? `${notes.length} note${notes.length !== 1 ? 's' : ''} · Continue where you left off`
                        : 'Start by creating your first note.'}
                    </p>
                  </div>
                )}

                {/* ─── AI action bar ────────────────────────────────────── */}
                {!mapOpen && (
                  <div className="flex gap-2 mb-6 flex-shrink-0">
                    {/* AI Semantic Search bar */}
                    <div className="flex-1 relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none">
                        {aiSearchMode ? '🔮' : '🔍'}
                      </span>
                      <input
                        type="text"
                        placeholder={aiSearchMode ? "Semantic AI search across your notes…" : "Search notes…"}
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (aiSearchMode && e.target.value.length > 2) {
                            handleAISearch(e.target.value);
                          }
                          if (!e.target.value) setAiSearchResults(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && aiSearchMode) handleAISearch(searchQuery);
                        }}
                        className="w-full bg-white border border-[#E7DED3] hover:border-[#D4C9BC] focus:border-[#D97745] rounded-xl py-2.5 pl-9 pr-4 text-[13px] font-medium text-[#1F1F1F] placeholder-[#B0A89A] focus:outline-none shadow-sm transition-all duration-200"
                      />
                    </div>
                    {/* AI Search toggle */}
                    <button
                      onClick={() => {
                        setAiSearchMode(!aiSearchMode);
                        if (aiSearchMode) { setAiSearchResults(null); }
                      }}
                      title={aiSearchMode ? "Switch to keyword search" : "Switch to AI semantic search"}
                      className={`px-3 py-2 rounded-xl text-[12px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        aiSearchMode
                          ? 'bg-[#D97745] text-white border-[#D97745] shadow-sm'
                          : 'bg-white text-[#B0A89A] border-[#E7DED3] hover:border-[#D97745] hover:text-[#D97745]'
                      }`}
                    >
                      🔮 <span>AI</span>
                    </button>
                    {/* Generate Draft */}
                    <button
                      onClick={() => setShowGenerateDraft(!showGenerateDraft)}
                      title="Generate a note with AI"
                      className={`px-3 py-2 rounded-xl text-[12px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        showGenerateDraft
                          ? 'bg-[#D97745] text-white border-[#D97745] shadow-sm'
                          : 'bg-white text-[#B0A89A] border-[#E7DED3] hover:border-[#D97745] hover:text-[#D97745]'
                      }`}
                    >
                      ✨ <span className="hidden sm:inline">Draft</span>
                    </button>
                  </div>
                )}


                <div className="space-y-8 flex-1">
                  {/* Graph view */}
                  {mapOpen && (
                    <div className="animate-in fade-in slide-in-from-top-3 duration-250 flex-shrink-0">
                      <GraphView onSelectNote={setSelectedNote} />
                    </div>
                  )}

                {/* Notes grid */}
                  {/* ─── AI Search Results ──────────────────────────────────── */}
                  {aiSearchMode && aiSearchResults !== null && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] font-bold text-[#7A7870]">
                          {semanticSearchMut.isPending
                            ? '🔮 Searching semantically…'
                            : `${aiSearchResults.results?.length || 0} result${aiSearchResults.results?.length !== 1 ? 's' : ''} · ${aiSearchResults.search_type === 'semantic' ? '🔮 Semantic' : '🔤 Keyword'} Search`}
                        </p>
                        <button onClick={() => { setAiSearchResults(null); }} className="text-[11px] text-[#B0A89A] hover:text-[#D97745] cursor-pointer font-bold">Clear</button>
                      </div>
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 w-full">
                        {aiSearchResults.results?.map((r) => {
                          const note = notes?.find(n => n.id === r.id);
                          if (!note) return null;
                          return (
                            <NoteCard key={r.id} note={note} index={0} onSelect={setSelectedNote} onDelete={(id) => deleteNote.mutate(id)} />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Generate Draft Inline Box */}
                  {showGenerateDraft && (
                    <div className="bg-white border border-[#E7DED3] rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-[12px] font-black text-[#1F1F1F] uppercase tracking-widest mb-3">✨ Generate Note with AI</p>
                      <form onSubmit={handleGenerateDraft} className="flex gap-2">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Describe the note you want to create…"
                          value={draftPrompt}
                          onChange={e => setDraftPrompt(e.target.value)}
                          className="flex-1 border border-[#E7DED3] rounded-xl px-4 py-2.5 text-[13px] font-medium focus:outline-none focus:border-[#D97745] transition-colors"
                        />
                        <button type="submit" disabled={generateDraftMut.isPending} className="px-4 py-2.5 bg-[#D97745] text-white text-[13px] font-bold rounded-xl hover:bg-[#C25C2B] transition-colors cursor-pointer disabled:opacity-60">
                          {generateDraftMut.isPending ? 'Generating…' : 'Generate'}
                        </button>
                        <button type="button" onClick={() => setShowGenerateDraft(false)} className="px-3 py-2.5 border border-[#E7DED3] text-[13px] font-bold rounded-xl hover:bg-[#F5F0E8] cursor-pointer transition-colors text-[#B0A89A]">✕</button>
                      </form>
                    </div>
                  )}

                {/* Normal notes grid (hide when in AI search mode with results) */}
                  {(!aiSearchMode || aiSearchResults === null) && !isLoadingNotes && notes?.length > 0 && (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 w-full">
                      {notes.map((note, idx) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          index={idx}
                          onSelect={setSelectedNote}
                          onDelete={(id) => deleteNote.mutate(id)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Empty state with brand mascot */}
                  {!isLoadingNotes && notes?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center select-none">
                      <EmptyStateIllustration variant="notes" className="w-64 h-64" />
                      <button
                        onClick={handleCreateNew}
                        className="btn-primary mt-2"
                      >
                        <Icons.Plus className="w-4 h-4" />
                        Create First Note
                      </button>
                    </div>
                  )}
                </div>

                {/* ─── AI Quick-Ask bar ────────────────────────────────── */}
                <div className="pt-5 mt-auto border-t border-[#E7DED3] flex-shrink-0">
                  <form onSubmit={handleQuickAsk} className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none">✨</span>
                    <input
                      type="text"
                      placeholder="Ask about your notes…"
                      value={quickAskInput}
                      onChange={(e) => setQuickAskInput(e.target.value)}
                      className="w-full bg-white border border-[#E7DED3] hover:border-[#D4C9BC] focus:border-[#D97745] rounded-2xl py-3.5 pl-11 pr-14 text-[14px] font-medium text-[#1F1F1F] placeholder-[#B0A89A] focus:outline-none shadow-sm shadow-[#C8BEB2]/20 transition-all duration-200"
                    />
                    <button
                      type="submit"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-[#D97745] text-white rounded-xl hover:-translate-y-0.5 hover:bg-[#C25C2B] active:scale-95 transition-all duration-150 cursor-pointer"
                    >
                      <Icons.Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>
            )}
          </div>
        </div>
      </main>

      {/* AI Chat panel */}
      {chatOpen && (
        <div className="fixed lg:static top-0 right-0 h-full bg-white z-50 lg:z-30 shadow-2xl lg:shadow-none border-l border-[#E7DED3] animate-in slide-in-from-right-10 duration-250 flex-shrink-0">
          <ChatPanel
            onSelectNote={setSelectedNote}
            onClose={() => setChatOpen(false)}
            prefilledQuery={chatQuery}
            onClearPrefilled={() => setChatQuery('')}
          />
        </div>
      )}

      {showShareModal && selectedNote && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4 select-none">
          <div className="bg-[#FAF7F2] border border-[#E7DED3] w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-[#E7DED3] mb-4">
              <h3 className="text-sm font-black text-[#1F1F1F] uppercase tracking-wider">Share Note</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-[#EDE8DF] rounded-lg text-[#B0A89A] cursor-pointer">
                <Icons.X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-[#7A7870] font-medium leading-relaxed mb-4">
              Anyone with this link will be able to read this note, even if they don't have a Notely account.
            </p>

            {selectedNote.share_token ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-white border border-[#E7DED3] p-2.5 rounded-xl">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/shared/${selectedNote.share_token}`}
                    className="flex-1 text-[12px] font-semibold text-[#1F1F1F] border-none p-0 focus:ring-0 select-all bg-transparent"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/shared/${selectedNote.share_token}`);
                      addToast("Link copied to clipboard!", "success");
                    }}
                    className="text-[11px] font-bold text-[#D97745] hover:text-[#C25C2B] shrink-0"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] font-bold text-[#4D7C5A] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4D7C5A] animate-pulse" /> Active sharing link
                  </span>
                  <button
                    onClick={async () => {
                      await stopSharing.mutateAsync(selectedNote.id);
                      setSelectedNote(prev => ({ ...prev, share_token: null }));
                      addToast("Sharing revoked.", "info");
                    }}
                    className="text-[11px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Stop Sharing
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 border border-[#E7DED3] text-[#7A7870] hover:bg-[#F5F0E8] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const res = await startSharing.mutateAsync(selectedNote.id);
                    setSelectedNote(prev => ({ ...prev, share_token: res.share_token }));
                    addToast("Sharing link generated!", "success");
                  }}
                  className="btn-primary py-2 px-4 text-xs rounded-xl flex items-center gap-1.5"
                >
                  <span>🔗</span> Create Public Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} initialTab={settingsTab} />
    </div>
  );
}

// ─── Helper: menu button ──────────────────────────────────────────────────────
function MenuBtn({ children, onClick, icon, danger, divider }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-[13px] font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer
        ${danger ? 'text-red-500 hover:bg-red-50' : 'text-[#1F1F1F] hover:bg-[#F5F0E8]'}
        ${divider ? 'border-t border-[#F5F0E8] mt-1' : ''}`}
    >
      <span>{icon}</span> {children}
    </button>
  );
}
