import React, { useState } from 'react';
import { useCreateFolder, useDeleteFolder } from '../hooks/useNotes';
import { useAuthStore } from '../store/authStore';
import * as Icons from './Icons';
import logoIcon from '../assets/notely-logo-icon.svg';
import logoLockup from '../assets/notely-logo-lockup.svg';

export default function Sidebar({ 
  folders, 
  selectedFolder, 
  onSelectFolder, 
  onLogout, 
  isOpen, 
  onClose, 
  notes, 
  onSelectNote, 
  onDeleteNote,
  onOpenSettings
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showCollapsedSearch, setShowCollapsedSearch] = useState(false);
  const [showCollapsedNotes, setShowCollapsedNotes] = useState(false);
  const [showCollapsedFolders, setShowCollapsedFolders] = useState(false);

  const currentUser = useAuthStore(state => state.user);
  const createFolderMut = useCreateFolder();
  const deleteFolderMut = useDeleteFolder();

  const handleAddFolder = () => {
    const name = prompt("Enter new folder name:");
    if (name && name.trim()) {
      createFolderMut.mutate({ name: name.trim() });
    }
  };

  const handleDeleteFolder = (e, folderId) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this folder? Notes inside will remain.")) {
      if (selectedFolder === folderId) onSelectFolder(null);
      deleteFolderMut.mutate(folderId);
    }
  };

  const getRecencyGroup = (updatedAtStr) => {
    const date = new Date(updatedAtStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return 'Today';
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) return 'This Week';
    return 'Older';
  };

  const groupedNotes = { 'Today': [], 'Yesterday': [], 'This Week': [], 'Older': [] };
  const filteredNotes = notes?.filter(note =>
    note.title.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(sidebarSearch.toLowerCase()))
  ) || [];

  filteredNotes.forEach(note => {
    const group = getRecencyGroup(note.updated_at || note.created_at);
    groupedNotes[group].push(note);
  });

  const handleFolderSelect = (folderId) => {
    onSelectFolder(folderId);
    if (onClose) onClose();
  };

  const handleCreateNew = () => {
    onSelectNote({ title: '', content: '', tags: [] });
    if (onClose) onClose();
  };

  // ─── Shared note item ──────────────────────────────────────────────────────
  const NoteItem = ({ note }) => (
    <li
      onClick={() => onSelectNote(note)}
      className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F0EBE3] cursor-pointer transition-all duration-150 relative"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {note.is_pinned
          ? <Icons.Pin className="w-3.5 h-3.5 text-[#D97745] flex-shrink-0" />
          : <Icons.BookOpen className="w-3.5 h-3.5 text-[#B0A89A] group-hover:text-[#7A7870] flex-shrink-0" />
        }
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[#1F1F1F] truncate leading-snug">{note.title || 'Untitled'}</p>
          <p className="text-[11px] text-[#B0A89A] truncate leading-none mt-0.5">{note.content?.slice(0, 40) || 'Empty…'}</p>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
        className="opacity-0 group-hover:opacity-100 text-[#B0A89A] hover:text-red-400 p-1 rounded-lg transition-all cursor-pointer"
      >
        <Icons.Trash className="w-3.5 h-3.5" />
      </button>
    </li>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-[#1F1F1F]/20 backdrop-blur-sm z-40 lg:hidden" />
      )}

      {/* ─── Sidebar Shell ────────────────────────────────────────────────── */}
      <div className={`fixed lg:static top-0 left-0 h-full flex flex-col z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none
        bg-[#F5F0E8] border-r border-[#E7DED3]
        ${isOpen ? 'translate-x-0 w-[264px]' : 'lg:translate-x-0 ' + (isCollapsed ? 'w-[60px] px-3' : 'w-[264px]') + ' -translate-x-full'}
        ${isCollapsed ? 'px-3 py-5' : 'px-4 py-5'}
      `}>

        {/* ─── Logo + collapse ────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6 px-1">
          {!isCollapsed && (
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img src={logoIcon} alt="N" className="w-7 h-7 flex-shrink-0" />
              <span className="font-black text-[15px] text-[#1F1F1F] tracking-tight">notely</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#E7DED3] text-[#B0A89A] hover:text-[#7A7870] cursor-pointer transition-colors flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <Icons.ChevronRight className="w-4 h-4" /> : <Icons.ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-[#E7DED3] rounded-lg text-[#B0A89A] cursor-pointer">
            <Icons.X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── New Note Button ─────────────────────────────────────────── */}
        <div className="mb-5">
          <button
            onClick={handleCreateNew}
            title="New Note"
            className={`w-full flex items-center justify-center gap-2 bg-[#D97745] hover:bg-[#C25C2B] text-white font-bold text-[13px] rounded-2xl py-2.5 shadow-sm shadow-[#D97745]/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#D97745]/25 transition-all duration-200 cursor-pointer ${isCollapsed ? 'px-2' : 'px-4'}`}
          >
            <Icons.Plus className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>New Note</span>}
          </button>
        </div>

        {/* ─── Search ──────────────────────────────────────────────────── */}
        {!isCollapsed && (
          <div className="relative mb-5">
            <Icons.Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0A89A]" />
            <input
              type="text"
              placeholder="Search notes…"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full bg-[#EDE8DF] border border-[#E0D8CE] rounded-xl py-2.5 pl-9 pr-3 text-[13px] font-medium text-[#1F1F1F] placeholder-[#B0A89A] focus:outline-none focus:border-[#D97745] focus:bg-white transition-all duration-200"
            />
          </div>
        )}

        {/* ─── Collapsed rail ──────────────────────────────────────────── */}
        {isCollapsed && (
          <div className="flex-1 flex flex-col items-center gap-4 mt-2">
            {[
              { icon: Icons.Search, label: "Search", key: 'search', set: setShowCollapsedSearch, val: showCollapsedSearch },
              { icon: Icons.BookOpen, label: "Notes", key: 'notes', set: setShowCollapsedNotes, val: showCollapsedNotes },
              { icon: Icons.Folder, label: "Folders", key: 'folders', set: setShowCollapsedFolders, val: showCollapsedFolders },
            ].map(({ icon: Ico, label, set, val }) => (
              <div key={label} className="relative">
                <button
                  onClick={() => { set(!val); setShowCollapsedSearch(false); setShowCollapsedNotes(false); setShowCollapsedFolders(false); set(!val); }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all ${val ? 'bg-[#E7DED3] text-[#D97745]' : 'hover:bg-[#E7DED3] text-[#B0A89A]'}`}
                  title={label}
                >
                  <Ico className="w-4 h-4" />
                </button>
                {val && (
                  <div className="absolute left-full top-0 ml-3 w-60 bg-white border border-[#E7DED3] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
                    <h4 className="text-[11px] font-black text-[#B0A89A] uppercase tracking-widest mb-2">{label}</h4>
                    {label === 'Search' && (
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search notes…"
                        value={sidebarSearch}
                        onChange={(e) => setSidebarSearch(e.target.value)}
                        className="w-full bg-[#F5F0E8] border border-[#E7DED3] rounded-xl py-1.5 px-3 text-[13px] focus:outline-none focus:border-[#D97745]"
                      />
                    )}
                    {label === 'Notes' && (
                      <ul className="space-y-0.5 max-h-[260px] overflow-y-auto scrollbar-hide">
                        {filteredNotes.map(note => (
                          <li key={note.id} onClick={() => { onSelectNote(note); setShowCollapsedNotes(false); }}
                            className="px-2 py-2 rounded-lg hover:bg-[#F5F0E8] cursor-pointer text-[13px] font-medium text-[#1F1F1F] truncate">
                            {note.title || 'Untitled'}
                          </li>
                        ))}
                      </ul>
                    )}
                    {label === 'Folders' && (
                      <ul className="space-y-0.5 max-h-[200px] overflow-y-auto scrollbar-hide">
                        {folders?.map(f => (
                          <li key={f.id} onClick={() => { handleFolderSelect(f.id); setShowCollapsedFolders(false); }}
                            className={`px-2 py-2 rounded-lg cursor-pointer text-[13px] font-medium truncate ${selectedFolder === f.id ? 'text-[#D97745] bg-[#FFF5EC]' : 'text-[#1F1F1F] hover:bg-[#F5F0E8]'}`}>
                            {f.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── Note list (expanded) ─────────────────────────────────────── */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto space-y-5 scrollbar-hide -mx-1 px-1">

            {/* Pinned */}
            {notes?.some(n => n.is_pinned) && (
              <div>
                <p className="text-[11px] font-black text-[#B0A89A] uppercase tracking-[0.15em] px-3 mb-1.5">Pinned</p>
                <ul className="space-y-0.5">
                  {notes.filter(n => n.is_pinned).map(note => <NoteItem key={note.id} note={note} />)}
                </ul>
              </div>
            )}

            {/* Recency groups */}
            {Object.keys(groupedNotes).map(group => {
              const list = groupedNotes[group];
              if (!list.length) return null;
              return (
                <div key={group}>
                  <p className="text-[11px] font-black text-[#B0A89A] uppercase tracking-[0.15em] px-3 mb-1.5">{group}</p>
                  <ul className="space-y-0.5">
                    {list.map(note => <NoteItem key={note.id} note={note} />)}
                  </ul>
                </div>
              );
            })}

            {filteredNotes.length === 0 && (
              <div className="text-center py-10 px-4">
                <div className="text-3xl mb-2">📝</div>
                <p className="text-[13px] font-semibold text-[#B0A89A]">No notes yet.</p>
                <p className="text-[12px] text-[#C8BEB2] mt-1">Click + New Note to start writing.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Folders (expanded) ───────────────────────────────────────── */}
        {!isCollapsed && (
          <div className="mt-4 pt-4 border-t border-[#E0D8CE]">
            <div className="flex items-center justify-between px-3 mb-2">
              <button
                onClick={() => setFoldersExpanded(!foldersExpanded)}
                className="flex items-center gap-1.5 text-[11px] font-black text-[#B0A89A] hover:text-[#7A7870] uppercase tracking-[0.15em] cursor-pointer transition-colors"
              >
                <Icons.Folder className="w-3.5 h-3.5" />
                <span>Folders</span>
                {foldersExpanded ? <Icons.ChevronDown className="w-3 h-3" /> : <Icons.ChevronRight className="w-3 h-3" />}
              </button>
              <button
                onClick={handleAddFolder}
                className="text-[#D97745] hover:bg-[#FFF5EC] p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Add Folder"
              >
                <Icons.Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {foldersExpanded && (
              <ul className="space-y-0.5">
                {folders?.map(folder => (
                  <li
                    key={folder.id}
                    onClick={() => handleFolderSelect(folder.id)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${selectedFolder === folder.id ? 'bg-[#FFF5EC] text-[#D97745]' : 'text-[#7A7870] hover:bg-[#F0EBE3] hover:text-[#1F1F1F]'}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icons.Folder className={`w-3.5 h-3.5 flex-shrink-0 ${selectedFolder === folder.id ? 'text-[#D97745]' : 'text-[#B0A89A] group-hover:text-[#7A7870]'}`} />
                      <span className="text-[13px] font-semibold truncate max-w-[130px]">{folder.name}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteFolder(e, folder.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#B0A89A] hover:text-red-400 p-0.5 rounded transition-all cursor-pointer"
                    >
                      <Icons.Trash className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}

                {(!folders || folders.length === 0) && (
                  <div className="text-center py-5 px-3">
                    <p className="text-[13px] font-semibold text-[#B0A89A]">No folders yet</p>
                    <p className="text-[12px] text-[#C8BEB2] mt-0.5">Organize notes into workspaces.</p>
                    <button
                      onClick={handleAddFolder}
                      className="mt-3 text-[12px] font-bold text-[#D97745] hover:underline cursor-pointer"
                    >
                      + Create Folder
                    </button>
                  </div>
                )}
              </ul>
            )}
          </div>
        )}

        {isCollapsed && <div className="flex-1" />}

        {/* ─── Profile row ──────────────────────────────────────────────── */}
        <div className="pt-4 border-t border-[#E0D8CE] relative">
          <button
            onClick={() => { setShowAccountMenu(!showAccountMenu); setShowCollapsedSearch(false); setShowCollapsedNotes(false); setShowCollapsedFolders(false); }}
            className="w-full flex items-center gap-3 p-2 hover:bg-[#EDE8DF] rounded-xl transition-all duration-200 cursor-pointer text-left"
          >
            {currentUser?.avatar_url ? (
              <img src={currentUser.avatar_url} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover border border-[#E7DED3] flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#D97745] text-white flex items-center justify-center font-black text-[13px] uppercase flex-shrink-0">
                {currentUser?.name?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
              </div>
            )}
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#1F1F1F] truncate leading-snug">{currentUser?.name || 'User'}</p>
                  <p className="text-[11px] text-[#B0A89A] truncate leading-none mt-0.5">{currentUser?.email}</p>
                </div>
                <Icons.ChevronRight className={`w-3.5 h-3.5 text-[#B0A89A] transition-transform duration-200 flex-shrink-0 ${showAccountMenu ? 'rotate-90' : ''}`} />
              </>
            )}
          </button>

          {showAccountMenu && (
            <div className={`absolute bottom-full mb-2 bg-white border border-[#E7DED3] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 ${isCollapsed ? 'left-full ml-3 w-48' : 'left-0 w-full'}`}>
              <div className="px-3 py-1.5 text-[11px] font-black text-[#B0A89A] uppercase tracking-widest border-b border-[#F0EBE3] mb-1">Account</div>
              {[
                { label: '⚙ Settings', action: () => { onOpenSettings?.('profile'); setShowAccountMenu(false); } },
                { label: '🌓 Appearance', action: () => { onOpenSettings?.('appearance'); setShowAccountMenu(false); } },
              ].map(({ label, action }) => (
                <button key={label} onClick={action}
                  className="w-full text-left px-3 py-2 text-[13px] font-semibold text-[#1F1F1F] hover:bg-[#F5F0E8] rounded-xl transition-colors cursor-pointer">
                  {label}
                </button>
              ))}
              <button onClick={onLogout}
                className="w-full text-left px-3 py-2 text-[13px] font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border-t border-[#F0EBE3] mt-1 flex items-center gap-2">
                <Icons.LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
