import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useChannels } from "@/hooks/useChannels";
import ChannelCard from "@/components/ChannelCard";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";

interface HistoryProps {
  sidebarExpanded: boolean;
}

const History = ({ sidebarExpanded }: HistoryProps) => {
  const { history, clearHistory } = useWatchHistory();
  const { channels } = useChannels();

  const historyChannels = history
    .map((h) => channels.find((ch) => ch.name === h.channelName))
    .filter(Boolean) as typeof channels;

  return (
    <div className={`min-h-screen pt-14 pb-20 sm:pb-8 transition-all duration-200 ${sidebarExpanded ? "md:ml-60" : "md:ml-[72px]"}`}>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold">Watch History</h1>
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearHistory}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          )}
        </div>

        {historyChannels.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <Clock className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No watch history yet</p>
            <p className="text-sm text-muted-foreground">Channels you watch will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {historyChannels.map((channel) => (
              <ChannelCard key={channel.name} channel={channel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
