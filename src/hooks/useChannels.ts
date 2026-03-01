import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import data from "@/data.json";
import type { Channel } from "@/types/channel";

export function useChannels() {
  const { data: dbChannels = [], isLoading } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("channels")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching channels:", error);
        return [];
      }

      return (rows || []).map((row: any): Channel => ({
        id: row.id,
        name: row.name,
        logo: row.logo,
        category: row.category,
        type: row.type,
        url: row.url,
        clearKey: row.clear_key as Record<string, string> | undefined,
        subscribers: row.subscribers || "0",
        views: row.views || "0 watching",
      }));
    },
  });

  // Merge: DB channels first, then JSON channels
  const allChannels: Channel[] = [...dbChannels, ...data.channels];

  // Deduplicate by name (DB takes priority)
  const seen = new Set<string>();
  const channels = allChannels.filter((ch) => {
    if (seen.has(ch.name)) return false;
    seen.add(ch.name);
    return true;
  });

  return { channels, categories: data.categories, isLoading };
}
