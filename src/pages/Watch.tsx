import { useParams } from "react-router-dom";
import data from "@/data.json";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelInfo from "@/components/ChannelInfo";
import CommentSection from "@/components/CommentSection";
import UpNextSidebar from "@/components/UpNextSidebar";

const Watch = () => {
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
    <div className="min-h-screen pt-14">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-6 px-4 py-6 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <VideoPlayer channel={channel} />
          <ChannelInfo channel={channel} />

          {/* Description box */}
          <div className="mt-3 rounded-xl bg-accent p-3">
            <div className="flex gap-2 text-sm">
              <span className="font-medium">{channel.views}</span>
              <span className="text-muted-foreground">Started streaming 2 hours ago</span>
            </div>
            <p className="mt-1 text-sm">
              Welcome to {channel.name} live stream. Enjoy high-quality content 24/7.
            </p>
          </div>

          <CommentSection />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[402px] flex-shrink-0">
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
