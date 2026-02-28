import { Menu, Search, Bell, User, Mic, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

interface NavbarProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Navbar = ({ onToggleSidebar, searchQuery, setSearchQuery }: NavbarProps) => {
  const navigate = useNavigate();
  const [showMobileSearch, setShowMobileSearch] = useState(false); // Bagong state para sa mobile search

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMobileSearch(false); // Isasara ang mobile search box pagka-enter
    navigate("/"); // Ibabalik sa home para makita ang results
  };

  // KUNG NAKA-MOBILE SEARCH MODE (Eksklusibo para sa maliit na screen)
  if (showMobileSearch) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-2 bg-background px-4 sm:hidden">
        <button
          onClick={() => setShowMobileSearch(false)}
          className="rounded-full p-2 hover:bg-accent shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <form onSubmit={handleSearch} className="flex flex-1 items-center">
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="h-10 w-full rounded-full border border-border bg-popover px-4 text-sm focus:border-blue-500 focus:outline-none"
          />
        </form>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-yt-hover shrink-0"
        >
          <Mic className="h-5 w-5" />
        </button>
      </header>
    );
  }

  // DEFAULT NAVBAR (Desktop at default Mobile view)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-background px-4">
      {/* Left */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="rounded-full p-2 hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-1">
          <div className="flex items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-primary-foreground">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            {/* Tinago yung word na "LiveTube" sa sobrang liliit na screen para may space */}
            <span className="ml-1 hidden text-xl font-semibold tracking-tight sm:block">
              LiveTube
            </span>
          </div>
        </Link>
      </div>

      {/* Center - Desktop Search Bar */}
      <form
        onSubmit={handleSearch}
        className="mx-4 hidden max-w-2xl flex-1 items-center sm:flex"
      >
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-l-full border border-border bg-popover px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-10 w-16 items-center justify-center rounded-r-full border border-l-0 border-border bg-accent hover:bg-yt-hover"
          >
            <Search className="h-5 w-5 text-foreground" />
          </button>
        </div>
        <button
          type="button"
          className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-yt-hover shrink-0"
        >
          <Mic className="h-5 w-5" />
        </button>
      </form>

      {/* Right */}
      <div className="flex items-center gap-1 shrink-0">
        {/* DITO YUNG MAGIC: Mobile Search Toggle Button */}
        <button 
          className="rounded-full p-2 hover:bg-accent sm:hidden"
          onClick={() => setShowMobileSearch(true)}
        >
          <Search className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>
        <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent shrink-0">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
