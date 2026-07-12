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
  improveContent 
} from "../api/notes";
import { getFolders, createFolder, deleteFolder } from "../api/folders";
import { getTags, createTag, deleteTag, attachTagsToNote } from "../api/tags";
import { chatWithMessage, getRelatedSuggestions, getChatSessions, getSessionMessages } from "../api/ai";

// Notes Hooks
export function useNotes(params = {}) {
  return useQuery({
    queryKey: ["notes", params],
    queryFn: () => getNotes(params).then((r) => r.data),
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateNote(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["note-links"] });
    },
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
  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["folders"] }),
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
