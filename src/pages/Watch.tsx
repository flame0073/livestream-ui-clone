import { useParams } from "react-router-dom";
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
    <div className={`min-h-[100dvh] w-full overflow-x-hidden pt-14 pb-20 sm:pb-0 bg-background transition-all duration-300 ${sidebarExpanded ? 'md:pl-60' : 'md:pl-[72px]'}`}>
      <div className="mx-auto flex max-w-[1800px] flex-col lg:flex-row xl:px-12">
        
        {/* Main content */}
        <div className="flex-1 min-w-0 lg:max-w-[calc(100%-360px)] xl:max-w-[calc(100%-420px)] lg:px-4 lg:py-6">
          
          {/* Naka-sticky top-14 sa mobile, tapos static sa desktop para laging nasa ibabaw ang video */}
          <div className="sticky top-14 z-40 w-full bg-black shadow-lg lg:static lg:z-auto lg:rounded-xl lg:bg-transparent lg:shadow-none">
            <VideoPlayer channel={channel} />
          </div>
          
          <div className="mt-4 px-4 lg:px-0">
            <ChannelInfo channel={channel} />

            {/* Description box */}
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
