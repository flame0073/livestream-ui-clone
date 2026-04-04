import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useChannels } from "@/hooks/useChannels";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelInfo from "@/components/ChannelInfo";

import UpNextSidebar from "@/components/UpNextSidebar";
import { useEffect } from "react";

interface WatchProps {
  sidebarExpanded: boolean;
}

const Watch = ({ sidebarExpanded }: WatchProps) => {
  const { channelName } = useParams<{ channelName: string }>();
  const navigate = useNavigate();
  const { channels } = useChannels();
  const { addToHistory } = useWatchHistory();
  
  const channel = channels.find(
    (ch) => ch.name === decodeURIComponent(channelName || "")
  );

  useEffect(() => {
    if (channel) {
      addToHistory(channel.name);
    }
  }, [channel?.name, addToHistory]);

  if (!channel) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center pt-14">
        <p className="text-muted-foreground">Channel not found.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-[100dvh] w-full pb-20 sm:pt-14 sm:pb-0 bg-background transition-all duration-300 touch-manipulation ${sidebarExpanded ? 'md:pl-60' : 'md:pl-[72px]'}`}>
      <div className="mx-auto flex max-w-[1800px] flex-col lg:flex-row xl:px-12">
        <div className="flex-1 min-w-0 px-0 lg:max-w-[calc(100%-360px)] xl:max-w-[calc(100%-420px)] lg:px-4 lg:py-6">
          <div className="fixed inset-x-0 top-0 z-50 w-full bg-black sm:sticky sm:top-14 lg:static lg:z-auto lg:rounded-xl lg:bg-transparent">
            <button 
              onClick={() => navigate("/")} 
              className="absolute left-4 top-4 z-[60] flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 sm:hidden"
            >
              <ChevronDown className="h-6 w-6" />
            </button>
            <VideoPlayer channel={channel} />
          </div>
          
          <div className="pt-[56.25vw] sm:pt-0"></div>

          <div className="mt-4 px-4 lg:px-0">
            <ChannelInfo channel={channel} />
            <div className="mt-4 rounded-xl bg-accent p-3">
              <div className="flex gap-2 text-sm">
                <span className="font-medium">{channel.views || "10K watching"}</span>
                <span className="text-muted-foreground">Started streaming recently</span>
              </div>
              <p className="mt-1 text-sm">
                Welcome to {channel.name} live stream. Enjoy high-quality content 24/7.
              </p>
            </div>
            <CommentSection channelName={channel.name} />
          </div>
        </div>

        <div className="w-full shrink-0 px-4 py-6 lg:w-[360px] lg:px-0 xl:w-[400px]">
          <UpNextSidebar channels={channels} currentChannel={channel.name} />
        </div>
      </div>
    </div>
  );
};

export default Watch;
