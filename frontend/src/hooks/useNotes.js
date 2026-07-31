import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getNotes, 
  createNote, 
  updateNote, 
  deleteNote, 
  getNoteLinks,
  createNoteLink,
  deleteNoteLink,
  summarizeNote, 
  suggestTags, 
  improveContent,
  exportNote,
  exportAllNotes,
  getNoteRevisions,
  restoreNoteRevision,
  shareNote,
  revokeNoteShare
} from "../api/notes";
import { getFolders, createFolder, deleteFolder } from "../api/folders";
import { getTags, createTag, deleteTag, attachTagsToNote } from "../api/tags";
import { chatWithMessage, getRelatedSuggestions, getChatSessions, getSessionMessages, semanticSearch, generateDraft, extractActionItems, translateContent, brainstormIdeas, getAIQuota } from "../api/ai";
import { useUIStore } from "../store/uiStore";

// Notes Hooks
export function useNotes(params = {}) {
  return useQuery({
    queryKey: ["notes", params],
    queryFn: () => getNotes(params).then((r) => r.data),
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
    onError: (err) => {
      addToast(err.response?.data?.detail || err.response?.data?.message || "Failed to create note.", "error");
    }
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: ({ id, data }) => updateNote(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["note-links"] });
    },
    onError: (err) => {
      if (err.response?.status === 409) {
        addToast("Conflict: This note has been modified by another session. Please reload or re-open it to get latest changes.", "error");
      } else {
        addToast(err.response?.data?.detail || err.response?.data?.message || "Failed to update note.", "error");
      }
    }
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["note-links"] });
    },
  });
}

// Folders Hooks
export function useFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: () => getFolders().then((r) => r.data),
  });
}

export function useCreateFolder() {
  const qc = useQueryClient();
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["folders"] }),
    onError: (err) => {
      addToast(err.response?.data?.detail || err.response?.data?.message || "Failed to create folder.", "error");
    }
  });
}

export function useDeleteFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["folders"] });
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

// Tags Hooks
export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags().then((r) => r.data),
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tags"] }),
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tags"] });
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useAttachTags() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId, data }) => attachTagsToNote(noteId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
}

// Note Links Hooks
export function useNoteLinks() {
  return useQuery({
    queryKey: ["note-links"],
    queryFn: () => getNoteLinks().then((r) => r.data),
  });
}

export function useCreateNoteLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createNoteLink,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["note-links"] }),
  });
}

export function useDeleteNoteLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteNoteLink,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["note-links"] }),
  });
}

// AI Basic Hooks
export function useAISummarize() {
  return useMutation({
    mutationFn: summarizeNote,
  });
}

export function useAITags() {
  return useMutation({
    mutationFn: suggestTags,
  });
}

export function useAIImprove() {
  return useMutation({
    mutationFn: improveContent,
  });
}

// AI Knowledge Companion Hooks
export function useChatSessions() {
  return useQuery({
    queryKey: ["chat-sessions"],
    queryFn: () => getChatSessions().then((r) => r.data),
  });
}

export function useSessionMessages(sessionId) {
  return useQuery({
    queryKey: ["chat-messages", sessionId],
    queryFn: () => getSessionMessages(sessionId).then((r) => r.data),
    enabled: !!sessionId,
  });
}

export function useSendChatMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ message, chatSessionId }) => chatWithMessage(message, chatSessionId),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["chat-sessions"] });
      if (data.data?.chat_session_id) {
        qc.invalidateQueries({ queryKey: ["chat-messages", data.data.chat_session_id] });
      }
    },
  });
}

export function useRelatedSuggestions(noteId) {
  return useQuery({
    queryKey: ["related-suggestions", noteId],
    queryFn: () => getRelatedSuggestions(noteId).then((r) => r.data),
    enabled: !!noteId,
  });
}

export function useExportNote() {
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: ({ id, format }) => exportNote(id, format).then((r) => r.data),
    onSuccess: (data, variables) => {
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", variables.format === "json" ? `note_${variables.id}.json` : `note_${variables.id}.md`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      addToast("Note exported successfully!", "success");
    },
    onError: (err) => {
      addToast("Export failed: " + err.message, "error");
    }
  });
}

export function useExportAllNotes() {
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: ({ format }) => exportAllNotes(format).then((r) => r.data),
    onSuccess: (data, variables) => {
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", variables.format === "json" ? "notely_export.json" : "notely_export_markdown.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      addToast("Bulk export successfully started!", "success");
    },
    onError: (err) => {
      addToast("Bulk export failed: " + err.message, "error");
    }
  });
}

export function useNoteRevisions(noteId) {
  return useQuery({
    queryKey: ["note-revisions", noteId],
    queryFn: () => getNoteRevisions(noteId).then((r) => r.data),
    enabled: !!noteId,
  });
}

export function useRestoreNoteRevision() {
  const qc = useQueryClient();
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: ({ noteId, revisionId }) => restoreNoteRevision(noteId, revisionId).then((r) => r.data),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["note-revisions", variables.noteId] });
      addToast("Version restored successfully!", "success");
    },
    onError: (err) => {
      addToast("Failed to restore version: " + err.message, "error");
    }
  });
}

export function useShareNote() {
  const qc = useQueryClient();
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: (id) => shareNote(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) => {
      addToast("Failed to share note: " + err.message, "error");
    }
  });
}

export function useRevokeNoteShare() {
  const qc = useQueryClient();
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: (id) => revokeNoteShare(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) => {
      addToast("Failed to revoke share link: " + err.message, "error");
    }
  });
}

// ─── New AI Hooks ──────────────────────────────────────────────────────────

export function useSemanticSearch() {
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: ({ q, limit }) => semanticSearch(q, limit).then((r) => r.data),
    onError: (err) => {
      addToast(err.response?.data?.detail || "Semantic search failed.", "error");
    }
  });
}

export function useAIGenerateDraft() {
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: (prompt) => generateDraft(prompt).then((r) => r.data),
    onError: (err) => {
      addToast(err.response?.data?.detail || "Draft generation failed.", "error");
    }
  });
}

export function useAIExtractActions() {
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: (content) => extractActionItems(content).then((r) => r.data),
    onError: (err) => {
      addToast(err.response?.data?.detail || "Action extraction failed.", "error");
    }
  });
}

export function useAITranslate() {
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: ({ content, lang }) => translateContent(content, lang).then((r) => r.data),
    onError: (err) => {
      addToast(err.response?.data?.detail || "Translation failed.", "error");
    }
  });
}

export function useAIBrainstorm() {
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: (content) => brainstormIdeas(content).then((r) => r.data),
    onError: (err) => {
      addToast(err.response?.data?.detail || "Brainstorm failed.", "error");
    }
  });
}

export function useAIQuota() {
  return useQuery({
    queryKey: ["ai-quota"],
    queryFn: () => getAIQuota().then((r) => r.data),
    staleTime: 30 * 1000, // refresh every 30s
  });
}
