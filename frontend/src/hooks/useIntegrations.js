import { useQuery } from "@tanstack/react-query";
import { getIntegrations } from "../api/integrations";

export function useIntegrations() {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: () => getIntegrations().then((r) => r.data),
  });
}
