import { Link } from "react-router-dom";

interface Channel {
  name: string;
  logo: string;
  category: string;
  type: string;
  url: string;
  subscribers: string;
  views: string;
}

interface UpNextSidebarProps {
  channels: Channel[];
  currentChannel: string;
}

const UpNextSidebar = ({ channels, currentChannel }: UpNextSidebarProps) => {
  const filtered = channels.filter((ch) => ch.name !== currentChannel);

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium">Up next</h3>
      <div className="space-y-2">
        {filtered.map((channel) => (
          <Link
            key={channel.name}
            to={`/watch/${encodeURIComponent(channel.name)}`}
            className="group flex gap-2 rounded-lg p-1 hover:bg-accent"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-40 flex-shrink-0 overflow-hidden rounded-lg bg-yt-thumbnail-bg">
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="h-8 w-8 object-contain opacity-70"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="absolute bottom-1 right-1 flex items-center gap-0.5 rounded bg-primary px-1 py-0.5 text-[10px] font-medium text-primary-foreground">
                <span className="h-1 w-1 animate-pulse rounded-full bg-primary-foreground" />
                LIVE
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 overflow-hidden">
              <p className="line-clamp-2 text-sm font-medium leading-snug">
                {channel.name} — Live
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {channel.name}
              </p>
              <p className="text-xs text-muted-foreground">{channel.views}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UpNextSidebar;
