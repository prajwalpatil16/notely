import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTemplates, createTemplate, deleteTemplate } from "../api/templates";
import { useUIStore } from "../store/uiStore";

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => getTemplates().then((r) => r.data),
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["templates"] });
      addToast("Template created successfully!", "success");
    },
    onError: (err) => {
      addToast("Failed to create template: " + err.message, "error");
    }
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  const addToast = useUIStore(state => state.addToast);
  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["templates"] });
      addToast("Template deleted successfully!", "success");
    },
    onError: (err) => {
      addToast("Failed to delete template: " + err.message, "error");
    }
  });
}
