import { useState, useEffect } from "react";
import data from "@/data.json";
import ChannelCard from "@/components/ChannelCard";

interface SubscriptionsProps {
  sidebarExpanded: boolean;
}

const Subscriptions = ({ sidebarExpanded }: SubscriptionsProps) => {
  const [subscribedChannels, setSubscribedChannels] = useState<any[]>([]);

  useEffect(() => {
    // Kunin ang mga nakasave na subscriptions sa memorya ng browser
    const savedSubs = JSON.parse(localStorage.getItem("flame_subscriptions") || "[]");
    
    // Hanapin yung buong details ng channel mula sa data.json
    const filtered = data.channels.filter((ch) => savedSubs.includes(ch.name));
    setSubscribedChannels(filtered);
  }, []);

  return (
    <div
      className={`min-h-[100dvh] pt-14 pb-20 transition-all duration-200 sm:pb-8 ${
        sidebarExpanded ? "md:ml-60" : "md:ml-[72px]"
      }`}
    >
      <div className="px-4 py-6 xl:px-8">
        <h1 className="mb-6 text-2xl font-bold">Latest from your subscriptions</h1>

        {subscribedChannels.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subscribedChannels.map((channel) => (
              <ChannelCard key={channel.name} channel={channel} />
            ))}
          </div>
        ) : (
          <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent">
              <svg viewBox="0 0 24 24" className="h-12 w-12 text-muted-foreground">
                <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 11V7l5 4-5 4z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium">Don't miss new videos</h2>
            <p className="max-w-xs text-sm text-muted-foreground">
              Subscribe to channels to see their latest videos here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
