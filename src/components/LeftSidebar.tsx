import { Home, Flame, PlaySquare, Clock, ThumbsUp, Music2, Gamepad2, Newspaper, Trophy, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface LeftSidebarProps {
  expanded: boolean;
  isAdmin?: boolean;
}

const mainItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Flame, label: "Shorts", path: "#" },
  { icon: PlaySquare, label: "Subscriptions", path: "/subscriptions" },
];

const secondaryItems = [
  { icon: Clock, label: "History", path: "/history" },
  { icon: PlaySquare, label: "Your videos", path: "#" },
  { icon: ThumbsUp, label: "Liked videos", path: "#" },
];

const exploreItems = [
  { icon: Flame, label: "Trending", path: "#" },
  { icon: Music2, label: "Music", path: "#" },
  { icon: Gamepad2, label: "Gaming", path: "#" },
  { icon: Newspaper, label: "News", path: "#" },
  { icon: Trophy, label: "Sports", path: "#" },
];

const LeftSidebar = ({ expanded, isAdmin }: LeftSidebarProps) => {
  const location = useLocation();

  if (!expanded) {
    return (
      <aside className="fixed left-0 top-14 z-40 hidden h-[calc(100vh-56px)] w-[72px] flex-col items-center overflow-y-auto bg-background py-1 md:flex">
        {mainItems.map((item) => (
          <Link key={item.label} to={item.path}
            className={`flex w-full flex-col items-center gap-1 rounded-lg px-1 py-4 text-[10px] hover:bg-accent ${
              location.pathname === item.path ? "font-medium" : "text-muted-foreground"
            }`}>
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-14 z-40 hidden h-[calc(100vh-56px)] w-60 overflow-y-auto bg-background pb-4 md:block">
      <div className="px-3 py-2">
        {mainItems.map((item) => (
          <Link key={item.label} to={item.path}
            className={`flex items-center gap-5 rounded-lg px-3 py-2 text-sm hover:bg-accent ${
              location.pathname === item.path ? "bg-accent font-medium" : ""
            }`}>
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mx-3 my-2 border-t border-border" />

      <div className="px-3 py-1">
        <p className="px-3 pb-1 text-sm font-medium">You</p>
        {secondaryItems.map((item) => (
          <Link key={item.label} to={item.path}
            className={`flex items-center gap-5 rounded-lg px-3 py-2 text-sm hover:bg-accent ${
              location.pathname === item.path ? "bg-accent font-medium" : ""
            }`}>
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mx-3 my-2 border-t border-border" />

      <div className="px-3 py-1">
        <p className="px-3 pb-1 text-sm font-medium">Explore</p>
        {exploreItems.map((item) => (
          <Link key={item.label} to={item.path}
            className="flex items-center gap-5 rounded-lg px-3 py-2 text-sm hover:bg-accent">
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {isAdmin && (
        <>
          <div className="mx-3 my-2 border-t border-border" />
          <div className="px-3 py-1">
            <Link to="/admin" className="flex items-center gap-5 rounded-lg px-3 py-2 text-sm hover:bg-accent">
              <Settings className="h-5 w-5" />
              <span>Admin</span>
            </Link>
          </div>
        </>
      )}
    </aside>
  );
};

export default LeftSidebar;
