import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

interface CategoryBarProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryBar = ({ categories, selected, onSelect }: CategoryBarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex items-center">
      {showLeft && (
        <div className="absolute left-0 z-10 flex items-center bg-gradient-to-r from-background via-background to-transparent pr-6">
          <button
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="hide-scrollbar flex gap-3 overflow-x-auto px-1 py-3"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              selected === cat
                ? "bg-yt-chip-active text-yt-chip-text-active"
                : "bg-yt-chip text-yt-chip-text hover:bg-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {showRight && (
        <div className="absolute right-0 z-10 flex items-center bg-gradient-to-l from-background via-background to-transparent pl-6">
          <button
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryBar;
