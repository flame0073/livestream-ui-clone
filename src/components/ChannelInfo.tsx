import { useState, useEffect } from "react";
import { Bell, ChevronDown, ThumbsDown, ThumbsUp, Share2, Download, MoreHorizontal } from "lucide-react";

interface ChannelInfoProps {
  channel: any;
}

const ChannelInfo = ({ channel }: ChannelInfoProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // I-check kung naka-subscribe na pagka-load ng page
    const savedSubs = JSON.parse(localStorage.getItem("flame_subscriptions") || "[]");
    setIsSubscribed(savedSubs.includes(channel.name));
  }, [channel.name]);

  const handleSubscribe = () => {
    const savedSubs = JSON.parse(localStorage.getItem("flame_subscriptions") || "[]");
    
    if (isSubscribed) {
      // Unsubscribe
      const newSubs = savedSubs.filter((name: string) => name !== channel.name);
      localStorage.setItem("flame_subscriptions", JSON.stringify(newSubs));
      setIsSubscribed(false);
    } else {
      // Subscribe
      savedSubs.push(channel.name);
      localStorage.setItem("flame_subscriptions", JSON.stringify(savedSubs));
      setIsSubscribed(true);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side - Channel Info */}
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-accent">
          <img src={channel.logo} alt={channel.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{channel.name}</h2>
          <p className="text-sm text-muted-foreground">{channel.subscribers} subscribers</p>
        </div>
        
        {/* Working Subscribe Button */}
        <button 
          onClick={handleSubscribe}
          className={`ml-2 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            isSubscribed 
              ? 'bg-accent text-foreground hover:bg-accent/80' 
              : 'bg-foreground text-background hover:bg-foreground/90'
          }`}
        >
          {isSubscribed ? (
            <>
              <Bell className="h-4 w-4" />
              Subscribed
              <ChevronDown className="h-4 w-4" />
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      {/* Right side - Actions */}
      <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        <div className="flex shrink-0 items-center rounded-full bg-accent">
          <button className="flex items-center gap-2 rounded-l-full px-4 py-2 hover:bg-yt-hover">
            <ThumbsUp className="h-5 w-5" />
            <span className="text-sm font-medium">Like</span>
          </button>
          <div className="my-2 w-px bg-border" />
          <button className="rounded-r-full px-4 py-2 hover:bg-yt-hover">
            <ThumbsDown className="h-5 w-5" />
          </button>
        </div>
        <button className="flex shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2 hover:bg-yt-hover">
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium">Share</span>
        </button>
        <button className="hidden shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2 hover:bg-yt-hover md:flex">
          <Download className="h-5 w-5" />
          <span className="text-sm font-medium">Download</span>
        </button>
        <button className="flex shrink-0 items-center rounded-full bg-accent p-2 hover:bg-yt-hover">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChannelInfo;
