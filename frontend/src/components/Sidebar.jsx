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
      if (selectedFolder === folderId) {
        onSelectFolder(null);
      }
      deleteFolderMut.mutate(folderId);
    }
  };

  const getRecencyGroup = (updatedAtStr) => {
    const date = new Date(updatedAtStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return 'Today';
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isYesterday) return 'Yesterday';
    
    if (diffDays <= 7) return 'Previous 7 days';
    return 'Older';
  };

  // Group notes by recency
  const groupedNotes = {
    'Today': [],
    'Yesterday': [],
    'Previous 7 days': [],
    'Older': []
  };

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

  return (
    <>
      {/* Mobile drawer backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar shell */}
      <div className={`fixed lg:static top-0 left-0 h-full bg-[#F7F7F5] border-r border-[#E5E3DF] p-6 flex flex-col z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isOpen 
          ? 'translate-x-0 w-72' 
          : 'lg:translate-x-0 ' + (isCollapsed ? 'w-16 px-3' : 'w-72') + ' -translate-x-full'
      }`}>
        
        {/* Top: Logo + collapse toggle */}
        <div className="flex items-center justify-between mb-6">
          {/* Logo: hidden when collapsed to avoid overflow */}
          {!isCollapsed && (
            <div className="flex items-center min-w-0 overflow-hidden flex-1">
              <div className="h-7 flex-shrink-0">
                <img src={logoLockup} alt="Notely" className="h-full w-auto object-contain" style={{ maxWidth: '130px' }} />
              </div>
            </div>
          )}

          {/* Collapse toggle — centered when collapsed */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex items-center justify-center p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer transition-colors flex-shrink-0 ${isCollapsed ? 'w-full' : ''}`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <Icons.ChevronRight className="w-4 h-4" /> : <Icons.ChevronDown className="w-4 h-4" />}
          </button>
          
          {/* Mobile drawer close */}
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-slate-200/50 rounded text-slate-400 cursor-pointer"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>

        {/* New Note Button */}
        <div className="mb-4">
          <button 
            onClick={handleCreateNew}
            className={`btn-primary w-full shadow-sm shadow-primary/10 ${isCollapsed ? 'px-2' : ''}`}
            title="New Thought"
          >
            <Icons.Plus className="w-4 h-4 text-white flex-shrink-0" />
            {!isCollapsed && <span className="text-xs font-bold tracking-tight">New Note</span>}
          </button>
        </div>

        {/* Collapsed Rail Menu Items */}
        {isCollapsed && (
          <div className="flex-1 flex flex-col items-center gap-5 mt-6">
            {/* Search Icon button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowCollapsedSearch(!showCollapsedSearch);
                  setShowCollapsedNotes(false);
                  setShowCollapsedFolders(false);
                  setShowAccountMenu(false);
                }}
                className={`p-2 rounded-xl cursor-pointer transition-colors ${showCollapsedSearch ? 'bg-slate-200 text-primary' : 'hover:bg-slate-200/50 text-slate-400'}`}
                title="Search Notes"
                aria-label="Search notes"
              >
                <Icons.Search className="w-4 h-4" />
              </button>
              {showCollapsedSearch && (
                <div className="absolute left-full top-0 ml-3 w-60 bg-white border border-[#E5E3DF] rounded-xl shadow-lg p-3 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 select-none">Search</h4>
                  <input 
                    type="text" 
                    placeholder="Search notes..." 
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    className="w-full bg-[#F7F7F5] border border-[#E5E3DF] rounded-lg py-1.5 px-3 focus:outline-none focus:border-primary text-xs font-semibold text-dark"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Notes List Icon button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowCollapsedNotes(!showCollapsedNotes);
                  setShowCollapsedSearch(false);
                  setShowCollapsedFolders(false);
                  setShowAccountMenu(false);
                }}
                className={`p-2 rounded-xl cursor-pointer transition-colors ${showCollapsedNotes ? 'bg-slate-200 text-primary' : 'hover:bg-slate-200/50 text-slate-400'}`}
                title="Recent Notes"
                aria-label="Recent notes list"
              >
                <Icons.BookOpen className="w-4 h-4" />
              </button>
              {showCollapsedNotes && (
                <div className="absolute left-full top-0 ml-3 w-64 max-h-[300px] overflow-y-auto bg-white border border-[#E5E3DF] rounded-xl shadow-lg p-3 z-50 animate-in fade-in slide-in-from-left-2 duration-150 scrollbar-hide space-y-4">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Recent Notes</h4>
                  <ul className="space-y-0.5">
                    {filteredNotes.map(note => (
                      <li 
                        key={note.id}
                        onClick={() => { onSelectNote(note); setShowCollapsedNotes(false); }}
                        className="px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs font-semibold text-dark truncate flex items-center justify-between"
                      >
                        <span className="truncate flex-1">{note.title || "Untitled"}</span>
                        {note.is_pinned && <Icons.Pin className="w-3 h-3 text-primary flex-shrink-0 ml-1.5" />}
                      </li>
                    ))}
                    {filteredNotes.length === 0 && (
                      <p className="text-[10px] text-slate-400 font-medium pl-2 italic">No notes found.</p>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Folders Icon button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowCollapsedFolders(!showCollapsedFolders);
                  setShowCollapsedSearch(false);
                  setShowCollapsedNotes(false);
                  setShowAccountMenu(false);
                }}
                className={`p-2 rounded-xl cursor-pointer transition-colors ${showCollapsedFolders ? 'bg-slate-200 text-primary' : 'hover:bg-slate-200/50 text-slate-400'}`}
                title="Folders"
                aria-label="Folders list"
              >
                <Icons.Folder className="w-4 h-4" />
              </button>
              {showCollapsedFolders && (
                <div className="absolute left-full top-0 ml-3 w-56 bg-white border border-[#E5E3DF] rounded-xl shadow-lg p-3 z-50 animate-in fade-in slide-in-from-left-2 duration-150 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Folders</h4>
                    <button onClick={handleAddFolder} className="text-primary hover:bg-primary/5 p-1 rounded cursor-pointer">
                      <Icons.Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ul className="space-y-0.5 max-h-[200px] overflow-y-auto scrollbar-hide">
                    {folders?.map(folder => (
                      <li 
                        key={folder.id}
                        onClick={() => { handleFolderSelect(folder.id); setShowCollapsedFolders(false); }}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer text-xs font-semibold truncate ${selectedFolder === folder.id ? 'bg-slate-100 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {folder.name}
                      </li>
                    ))}
                    {(!folders || folders.length === 0) && (
                      <p className="text-[10px] text-slate-400 font-medium pl-2 italic">No folders created.</p>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search (Expanded only) */}
        {!isCollapsed && (
          <div className="relative mb-6">
            <Icons.Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full bg-white border border-[#E5E3DF] rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-primary text-xs font-medium text-dark placeholder-slate-400 transition-colors"
            />
          </div>
        )}

        {/* Dynamic Recency-Grouped Notes list (Expanded only) */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-hide">
            
            {/* Pinned section (if any) */}
            {notes?.some(n => n.is_pinned) && (
              <div className="space-y-2">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-wider ml-3">Pinned</h3>
                <ul className="space-y-0.5">
                  {notes.filter(n => n.is_pinned).map(note => (
                    <li 
                      key={note.id}
                      onClick={() => onSelectNote(note)}
                      className="group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-200/40 cursor-pointer relative"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <Icons.Pin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-dark truncate leading-tight">{note.title || 'Untitled'}</p>
                          <p className="text-[10px] text-slate-400 truncate leading-none mt-1">{note.content || 'Empty...'}</p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 absolute right-2 flex items-center bg-[#F7F7F5] pl-3 py-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                          className="text-slate-400 hover:text-red-500 p-0.5 rounded cursor-pointer"
                        >
                          <Icons.Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recency lists */}
            {Object.keys(groupedNotes).map(groupName => {
              const list = groupedNotes[groupName];
              if (list.length === 0) return null;
              return (
                <div key={groupName} className="space-y-2">
                  <h3 className="text-[9px] font-black text-slate-400/80 uppercase tracking-wider ml-3">{groupName}</h3>
                  <ul className="space-y-0.5">
                    {list.map(note => (
                      <li 
                        key={note.id}
                        onClick={() => onSelectNote(note)}
                        className="group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-200/40 cursor-pointer relative"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <Icons.BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-dark truncate leading-tight">{note.title || 'Untitled'}</p>
                            <p className="text-[10px] text-slate-400 truncate leading-none mt-1">{note.content || 'Empty...'}</p>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 absolute right-2 flex items-center bg-[#F7F7F5] pl-3 py-1">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                            className="text-slate-400 hover:text-red-500 p-0.5 rounded cursor-pointer"
                          >
                            <Icons.Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {/* Collapsible Folders Section (Expanded only) */}
        {!isCollapsed && (
          <div className="mt-6 border-t border-[#E5E3DF] pt-4 select-none">
            <div className="flex items-center justify-between px-3 mb-2">
              <button 
                onClick={() => setFoldersExpanded(!foldersExpanded)}
                className="text-[9px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest flex items-center gap-1 cursor-pointer"
              >
                <span>Folders</span>
                {foldersExpanded ? <Icons.ChevronDown className="w-3 h-3" /> : <Icons.ChevronRight className="w-3 h-3" />}
              </button>
              <button 
                onClick={handleAddFolder}
                className="text-primary hover:bg-primary/5 p-1 rounded-lg transition-colors cursor-pointer"
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
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group ${selectedFolder === folder.id ? 'bg-slate-200/50 text-primary font-bold' : 'text-slate-500 hover:bg-slate-200/20 hover:text-slate-900'}`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icons.Folder className={`w-3.5 h-3.5 ${selectedFolder === folder.id ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span className="text-xs font-semibold truncate max-w-[120px]">{folder.name}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteFolder(e, folder.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 rounded transition-all cursor-pointer"
                      title="Delete Folder"
                    >
                      <Icons.Trash className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
                {(!folders || folders.length === 0) && (
                  <p className="text-[10px] text-slate-400 font-medium pl-4 italic select-none">No folders created yet.</p>
                )}
              </ul>
            )}
          </div>
        )}

        {/* Collapsed spacer */}
        {isCollapsed && <div className="flex-1" />}

        {/* Bottom Interactive Profile Section */}
        <div className="pt-4 border-t border-[#E5E3DF] flex flex-col relative select-none">
          <button 
            onClick={() => {
              setShowAccountMenu(!showAccountMenu);
              setShowCollapsedSearch(false);
              setShowCollapsedNotes(false);
              setShowCollapsedFolders(false);
            }}
            className="w-full flex items-center justify-between p-1.5 hover:bg-slate-200/40 active:scale-[0.98] rounded-xl transition-all duration-200 cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-haspopup="true"
            aria-expanded={showAccountMenu}
            title="Account options"
          >
            <div className="flex items-center gap-3 min-w-0">
              {currentUser?.avatar_url ? (
                <img 
                  src={currentUser.avatar_url} 
                  alt={currentUser.name || 'User Avatar'} 
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-[#E5E3DF]" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-companion text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                  {currentUser?.name?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                </div>
              )}
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-dark truncate leading-tight">{currentUser?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-400 truncate leading-none mt-1">{currentUser?.email}</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Icons.ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showAccountMenu ? 'rotate-90' : ''}`} />
            )}
          </button>

          {/* Account Popover Menu */}
          {showAccountMenu && (
            <div className={`absolute bottom-full mb-2 bg-white border border-[#E5E3DF] rounded-xl shadow-lg p-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
              isCollapsed ? 'left-full ml-3 w-48' : 'left-0 w-full'
            }`}>
              <div className="px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1 select-none">
                Options
              </div>
              <button 
                onClick={() => {
                  onOpenSettings && onOpenSettings('profile');
                  setShowAccountMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-dark hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer focus:outline-none focus:bg-slate-50"
              >
                <span>⚙</span> Settings
              </button>
              <button 
                onClick={() => {
                  onOpenSettings && onOpenSettings('appearance');
                  setShowAccountMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-dark hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer focus:outline-none focus:bg-slate-50"
              >
                <span>🌓</span> Theme (System)
              </button>
              <button 
                onClick={onLogout}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer border-t border-slate-50 mt-1 focus:outline-none focus:bg-red-50"
              >
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
