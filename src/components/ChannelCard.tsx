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

interface ChannelCardProps {
  channel: Channel;
}

const ChannelCard = ({ channel }: ChannelCardProps) => {
  return (
    <Link
      to={`/watch/${encodeURIComponent(channel.name)}`}
      className="group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-yt-thumbnail-bg">
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={channel.logo}
            alt={channel.name}
            className="h-16 w-16 object-contain opacity-70 transition-transform group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        {/* Live badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-foreground" />
          LIVE
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 flex gap-3">
        <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-accent">
          <img
            src={channel.logo}
            alt={channel.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">
            {channel.name} — Live Stream
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {channel.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {channel.views} • {channel.subscribers} subscribers
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ChannelCard;
