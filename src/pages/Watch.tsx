import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import data from "@/data.json";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelInfo from "@/components/ChannelInfo";
import CommentSection from "@/components/CommentSection";
import UpNextSidebar from "@/components/UpNextSidebar";

interface WatchProps {
  sidebarExpanded: boolean;
}

const Watch = ({ sidebarExpanded }: WatchProps) => {
  const { channelName } = useParams<{ channelName: string }>();
  const navigate = useNavigate();
  
  const channel = data.channels.find(
    (ch) => ch.name === decodeURIComponent(channelName || "")
  );

  if (!channel) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center pt-14">
        <p className="text-muted-foreground">Channel not found.</p>
      </div>
    );
  }

  return (
    // Nilagyan ng 'touch-manipulation' para maiwasan ang double-tap zoom sa cellphone
    <div className={`min-h-[100dvh] w-full pb-20 sm:pt-14 sm:pb-0 bg-background transition-all duration-300 touch-manipulation ${sidebarExpanded ? 'md:pl-60' : 'md:pl-[72px]'}`}>
      <div className="mx-auto flex max-w-[1800px] flex-col lg:flex-row xl:px-12">
        
        {/* Main content */}
        <div className="flex-1 min-w-0 lg:max-w-[calc(100%-360px)] xl:max-w-[calc(100%-420px)] lg:px-4 lg:py-6">
          
          {/* FIX 1: Gumamit ng 'fixed' position sa mobile para nakapako talaga sa tuktok ng screen. 
              Babalik siya sa normal (sm:sticky o lg:static) kapag nasa tablet/desktop ka. */}
          <div className="fixed top-0 left-0 right-0 z-50 w-full bg-black shadow-lg sm:sticky sm:top-14 sm:left-auto sm:right-auto sm:w-auto lg:static lg:z-auto lg:rounded-xl lg:bg-transparent lg:shadow-none">
            
            <button 
              onClick={() => navigate("/")} 
              className="absolute left-4 top-4 z-[60] flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 sm:hidden"
            >
              <ChevronDown className="h-6 w-6" />
            </button>

            <VideoPlayer channel={channel} />
          </div>
          
          {/* FIX 2: SPACER. Dahil 'fixed' ang video at nakalutang sa ibabaw, kailangan natin maglagay ng blangkong espasyo 
              para hindi matabunan yung pangalan ng channel at comments. 
              Ang 56.25vw ay saktong-sakto sa 16:9 ratio height ng video sa mobile! */}
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

            <CommentSection />
          </div>
        </div>

        {/* Sidebar (Up Next) */}
        <div className="w-full shrink-0 px-4 py-6 lg:w-[360px] lg:px-0 xl:w-[400px]">
          <UpNextSidebar
            channels={data.channels}
            currentChannel={channel.name}
          />
        </div>
      </div>
    </div>
  );
};

export default Watch;
