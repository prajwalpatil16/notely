import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../api/auditLogs";

export function useAuditLogs(params = {}) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params).then((r) => r.data),
  });
}
