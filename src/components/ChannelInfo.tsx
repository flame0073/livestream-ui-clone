import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal } from "lucide-react";

interface Channel {
  name: string;
  logo: string;
  subscribers: string;
}

const ChannelInfo = ({ channel }: { channel: Channel }) => {
  return (
    <div className="mt-3">
      <h1 className="text-lg font-semibold">{channel.name} — Live Stream</h1>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Channel info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-accent">
            <img
              src={channel.logo}
              alt={channel.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div>
            <p className="text-sm font-medium">{channel.name}</p>
            <p className="text-xs text-muted-foreground">
              {channel.subscribers} subscribers
            </p>
          </div>
          <button className="ml-4 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
            Subscribe
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-full bg-accent">
            <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-yt-hover">
              <ThumbsUp className="h-5 w-5" />
              <span>4.2K</span>
            </button>
            <div className="w-px bg-border" />
            <button className="flex items-center px-3 py-2 hover:bg-yt-hover">
              <ThumbsDown className="h-5 w-5" />
            </button>
          </div>

          <button className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm hover:bg-yt-hover">
            <Share2 className="h-5 w-5" />
            Share
          </button>

          <button className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm hover:bg-yt-hover">
            <Download className="h-5 w-5" />
            Download
          </button>

          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-accent hover:bg-yt-hover">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelInfo;
