import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import ChatPanel from '../components/ChatPanel';
import GraphView from '../components/GraphView';
import SettingsModal from '../components/SettingsModal';
import { useNotes, useFolders, useCreateNote, useUpdateNote, useDeleteNote } from '../hooks/useNotes';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import * as Icons from '../components/Icons';

export default function Dashboard() {
  const addToast = useUIStore(state => state.addToast);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'map', 'chat'
  
  // Quick ask & prefilled sync states
  const [quickAskInput, setQuickAskInput] = useState('');
  const [chatQuery, setChatQuery] = useState('');

  const { data: notes, isLoading: isLoadingNotes } = useNotes({ 
    folder_id: selectedFolder, 
    q: searchQuery 
  });
  const { data: folders } = useFolders();

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const logout = useAuthStore(state => state.logout);

  const handleSave = async (data) => {
    if (selectedNote?.id) {
      await updateNote.mutateAsync({ id: selectedNote.id, data });
    } else {
      await createNote.mutateAsync({ ...data, folder_id: selectedFolder });
    }
    setSelectedNote(null);
  };

  const handleCreateNew = () => {
    setSelectedNote({ title: '', content: '', tags: [] });
  };

  const handleQuickAsk = (e) => {
    e.preventDefault();
    if (!quickAskInput.trim()) return;

    setChatQuery(quickAskInput);
    setQuickAskInput('');
    setChatOpen(true);
  };

  const handleTogglePin = async () => {
    if (!selectedNote?.id) return;
    try {
      const res = await updateNote.mutateAsync({ 
        id: selectedNote.id, 
        data: { is_pinned: !selectedNote.is_pinned } 
      });
      setSelectedNote(res.data);
      addToast(res.data.is_pinned ? "Note pinned!" : "Note unpinned!", "success");
    } catch (err) {
      addToast("Failed to toggle pin state.", "error");
    } finally {
      setMoreMenuOpen(false);
    }
  };

  const handleToggleArchive = async () => {
    if (!selectedNote?.id) return;
    try {
      const res = await updateNote.mutateAsync({ 
        id: selectedNote.id, 
        data: { is_archived: !selectedNote.is_archived } 
      });
      setSelectedNote(null);
      addToast(res.data.is_archived ? "Note archived!" : "Note unarchived!", "success");
    } catch (err) {
      addToast("Failed to archive note.", "error");
    } finally {
      setMoreMenuOpen(false);
    }
  };

  const handleDeleteCurrentNote = async () => {
    if (!selectedNote?.id) return;
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote.mutateAsync(selectedNote.id);
        setSelectedNote(null);
        addToast("Note deleted.", "success");
      } catch (err) {
        addToast("Failed to delete note.", "error");
      } finally {
        setMoreMenuOpen(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-dark font-sans">
      
      {/* Sidebar Navigation */}
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
        onOpenSettings={(tab) => {
          setSettingsTab(tab || 'profile');
          setSettingsOpen(true);
        }}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-white">
        
        {/* Topbar (~56px high) */}
        <header className="h-[56px] border-b border-[#E5E3DF] bg-white flex items-center justify-between px-6 flex-shrink-0 select-none">
          {/* Left panel */}
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
              aria-label="Open menu"
            >
              <Icons.Menu className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-dark truncate">
              {selectedNote ? (selectedNote.title || 'Untitled Note') : 'Workspace Canvas'}
            </span>
          </div>

          {/* Right panel */}
          <div className="flex items-center gap-3">
            {/* Map Toggle */}
            <button 
              onClick={() => setMapOpen(!mapOpen)}
              className={`p-2 rounded-lg cursor-pointer transition-all ${mapOpen ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-500 hover:text-dark'}`}
              title="Knowledge Map"
            >
              <Icons.Map className="w-4 h-4" />
            </button>

            {/* Share action */}
            <button 
              onClick={() => addToast("Workspace link copied to clipboard!", "success")}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-dark cursor-pointer transition-colors"
              title="Share"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.748L15 12m0 0l-6.316 1.252m6.316-1.252V6m0 6v6M4 12a2 2 0 11-4 0 2 2 0 014 0zM18 6a2 2 0 11-4 0 2 2 0 014 0zM18 18a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            {/* AI Toggle */}
            <button 
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-2 rounded-lg cursor-pointer transition-all ${chatOpen ? 'bg-companion-soft text-companion font-bold' : 'hover:bg-slate-100 text-slate-500 hover:text-dark'}`}
              title="AI Companion"
            >
              <Icons.Message className="w-4 h-4" />
            </button>

            {/* More actions menu */}
            <div className="relative">
              <button 
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`p-2 rounded-lg cursor-pointer transition-all ${moreMenuOpen ? 'bg-slate-100 text-dark' : 'hover:bg-slate-100 text-slate-500 hover:text-dark'}`}
                title="More Actions"
              >
                <span className="text-xs font-black">⋯</span>
              </button>

              {moreMenuOpen && (
                <>
                  {/* Backdrop to close menu */}
                  <div 
                    className="fixed inset-0 z-45" 
                    onClick={() => setMoreMenuOpen(false)}
                  />
                  
                  {/* Popover Card */}
                  <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-zinc-900 border border-border-subtle rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 select-none">
                    <div className="px-3 py-1.5 text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest border-b border-slate-50 dark:border-zinc-850 mb-1">
                      {selectedNote ? 'Note Actions' : 'Workspace Actions'}
                    </div>

                    {selectedNote ? (
                      <>
                        <button 
                          onClick={handleTogglePin}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-dark dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer focus:outline-none focus:bg-slate-50"
                        >
                          <span>📌</span> {selectedNote.is_pinned ? 'Unpin Note' : 'Pin Note'}
                        </button>
                        <button 
                          onClick={handleToggleArchive}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-dark dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer focus:outline-none focus:bg-slate-50"
                        >
                          <span>📁</span> {selectedNote.is_archived ? 'Unarchive Note' : 'Archive Note'}
                        </button>
                        <button 
                          onClick={handleDeleteCurrentNote}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer focus:outline-none focus:bg-red-50"
                        >
                          <span>🗑️</span> Delete Note
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedNote(null);
                            setMoreMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer border-t border-slate-50 dark:border-zinc-850 mt-1 focus:outline-none focus:bg-slate-100"
                        >
                          <span>✕</span> Close Editor
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            setMapOpen(!mapOpen);
                            setMoreMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-dark dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer focus:outline-none focus:bg-slate-50"
                        >
                          <span>🗺️</span> {mapOpen ? 'Hide Knowledge Map' : 'Show Knowledge Map'}
                        </button>
                        <button 
                          onClick={() => {
                            handleCreateNew();
                            setMoreMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-dark dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer focus:outline-none focus:bg-slate-50"
                        >
                          <span>➕</span> Create New Note
                        </button>
                        <button 
                          onClick={() => {
                            setSettingsTab('profile');
                            setSettingsOpen(true);
                            setMoreMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-dark dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer border-t border-slate-50 dark:border-zinc-850 mt-1 focus:outline-none focus:bg-slate-50"
                        >
                          <span>⚙️</span> Settings & Profile
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Container (Notes List / Editor) */}
        <div className="flex-1 px-6 sm:px-12 py-8 overflow-hidden flex flex-col">
          
          {/* Constrain canvas width on desktop */}
          <div className="flex-1 w-full max-w-[720px] mx-auto flex flex-col overflow-y-auto pr-1 scrollbar-hide">
            
            {/* Editor mode overlay */}
            {selectedNote ? (
              <div className="flex-1 h-full">
                <NoteEditor 
                  note={selectedNote} 
                  onSave={handleSave} 
                  onCancel={() => setSelectedNote(null)} 
                />
              </div>
            ) : (
              // List Mode
              <div className="flex-1 flex flex-col justify-between">
                
                <div className="space-y-6">
                  {/* Graph visualization embedded on-demand */}
                  {mapOpen && (
                    <div className="animate-in fade-in slide-in-from-top-3 duration-250 flex-shrink-0">
                      <GraphView onSelectNote={setSelectedNote} />
                    </div>
                  )}

                  {/* Notes Grid */}
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 w-full">
                    {notes?.map(note => (
                      <NoteCard 
                        key={note.id} 
                        note={note} 
                        onSelect={setSelectedNote}
                        onDelete={(id) => deleteNote.mutate(id)}
                      />
                    ))}
                  </div>

                  {!isLoadingNotes && notes?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 opacity-60 text-center max-w-sm mx-auto gap-4 select-none">
                      <p className="text-xs font-semibold text-slate-400">No notes yet — start writing.</p>
                      <button 
                        onClick={handleCreateNew}
                        className="btn-primary"
                      >
                        <Icons.Plus className="w-3.5 h-3.5 text-white" />
                        <span>New Note</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick-Ask Pinned Command Bar */}
                <div className="w-full pt-4 border-t border-[#E5E3DF]/50 flex-shrink-0 bg-white select-none">
                  <form onSubmit={handleQuickAsk} className="relative">
                    <input 
                      type="text" 
                      placeholder="Ask about your notes..." 
                      value={quickAskInput}
                      onChange={(e) => setQuickAskInput(e.target.value)}
                      className="w-full bg-[#F7F7F5] border border-[#E5E3DF] focus:border-primary rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:bg-white shadow-sm font-semibold text-xs text-dark placeholder-slate-400 transition-all duration-300"
                    />
                    <button 
                      type="submit" 
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-[#D9663B] text-white rounded-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
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

      {/* AI Companion Slide-In Panel */}
      {chatOpen && (
        <div className="fixed lg:static top-0 right-0 h-full bg-white z-50 lg:z-30 shadow-2xl lg:shadow-none animate-in slide-in-from-right-10 duration-250 flex-shrink-0">
          <ChatPanel 
            onSelectNote={setSelectedNote} 
            onClose={() => setChatOpen(false)}
            prefilledQuery={chatQuery}
            onClearPrefilled={() => setChatQuery('')}
          />
        </div>
      )}

      {/* Settings & Profile Modal */}
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        initialTab={settingsTab} 
      />
    </div>
  );
}
