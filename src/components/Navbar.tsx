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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
          className="shrink-0 rounded-full p-2 hover:bg-accent"
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
          className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-accent hover:bg-yt-hover"
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
      <div className="flex shrink-0 items-center gap-4">
        {/* Nakatago na ang hamburger menu sa mobile (hidden sm:block) */}
        <button
          onClick={onToggleSidebar}
          className="hidden shrink-0 rounded-full p-2 hover:bg-accent sm:block"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-1">
          <div className="flex items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-primary
