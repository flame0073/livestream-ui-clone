import { Home, Flame, PlaySquare, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Flame, label: "Shorts", path: "#" },
    { icon: PlaySquare, label: "Subscriptions", path: "/subscriptions" }, // <-- Updated path
    { icon: User, label: "You", path: "#" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-border bg-background sm:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex h-full w-full flex-col items-center justify-center gap-1 ${
              isActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <item.icon className={`h-6 w-6 ${isActive ? "fill-current" : ""}`} />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
