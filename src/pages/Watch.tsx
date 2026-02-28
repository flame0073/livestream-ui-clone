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
      <div className="flex min-h-screen items-center justify-center pt-14">
        <p className="text-muted-foreground">Channel not found.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-14 bg-background transition-all duration-300 ${sidebarExpanded ? 'md:pl-60' : 'md:pl-[72px]'}`}>
      <div className="mx-auto flex max-w-[1800px] flex-col lg:flex-row xl:px-12">
        
        {/* Main content */}
        <div className="flex-1 min-w-0 lg:max-w-[calc(100%-360px)] xl:max-w-[calc(100%-420px)] lg:py-6 lg:px-4">
          
          {/* DITO YUNG FIX: Naka-sticky top-14 sa mobile, tapos static sa desktop */}
          <div className="sticky top-14 z-40 w-full bg-black lg:static lg:z-auto lg:bg-transparent lg:rounded-xl shadow-lg lg:shadow-none">
            <VideoPlayer channel={channel} />
          </div>
          
          <div className="px-4 lg:px-0 mt-4">
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

        {/* Sidebar */}
        <div className="w-full lg:w-[360px] xl:w-[400px] flex-shrink-0 px-4 py-6 lg:px-0">
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
