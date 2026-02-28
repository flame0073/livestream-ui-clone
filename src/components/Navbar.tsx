import { Menu, Search, Bell, User, Mic } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Navbar = ({ onToggleSidebar, searchQuery, setSearchQuery }: NavbarProps) => {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Kapag nag-search ka habang nanonood, ibabalik ka sa Home page para makita ang results
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between bg-background px-4">
      {/* Left - May shrink-0 na para hindi mapitpit */}
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
            <span className="ml-1 text-xl font-semibold tracking-tight">
              LiveTube
            </span>
          </div>
        </Link>
      </div>

      {/* Center - Totoong gumagana na ang Search */}
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
          className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-yt-hover"
        >
          <Mic className="h-5 w-5" />
        </button>
      </form>

      {/* Right - May shrink-0 na rin */}
      <div className="flex items-center gap-1 shrink-0">
        <button className="rounded-full p-2 hover:bg-accent sm:hidden">
          <Search className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>
        <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
