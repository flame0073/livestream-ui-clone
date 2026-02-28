import { useState } from "react";
import data from "@/data.json";
import CategoryBar from "@/components/CategoryBar";
import ChannelCard from "@/components/ChannelCard";

interface IndexProps {
  sidebarExpanded: boolean;
  searchQuery: string;
}

const Index = ({ sidebarExpanded, searchQuery }: IndexProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter channels based on BOTH category AND search query
  const filteredChannels = data.channels.filter((ch) => {
    const matchesCategory = selectedCategory === "All" || ch.category === selectedCategory;
    const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

      <div className="px-4 pb-8 mt-4">
        {/* Magpapakita ito kapag may tinype ka sa search bar */}
        {searchQuery && (
          <p className="mb-4 text-sm text-muted-foreground font-medium">
            Search results for "{searchQuery}"
          </p>
        )}
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredChannels.map((channel) => (
            <ChannelCard key={channel.name} channel={channel} />
          ))}
        </div>

        {/* Magbabago ang empty state message kapag walang nahanap */}
        {filteredChannels.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <p className="text-lg font-medium">No channels found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
