import { useState } from "react";
import data from "@/data.json";
import CategoryBar from "@/components/CategoryBar";
import ChannelCard from "@/components/ChannelCard";

interface IndexProps {
  sidebarExpanded: boolean;
}

const Index = ({ sidebarExpanded }: IndexProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredChannels =
    selectedCategory === "All"
      ? data.channels
      : data.channels.filter((ch) => ch.category === selectedCategory);

  return (
    <div
      className={`pt-14 transition-all duration-200 ${
        sidebarExpanded ? "md:ml-60" : "md:ml-[72px]"
      }`}
    >
      <div className="sticky top-14 z-30 bg-background px-4">
        <CategoryBar
          categories={data.categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      <div className="px-4 pb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredChannels.map((channel) => (
            <ChannelCard key={channel.name} channel={channel} />
          ))}
        </div>

        {filteredChannels.length === 0 && (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">
              No channels found for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
