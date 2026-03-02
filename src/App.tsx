import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Watch from "./pages/Watch";
import Subscriptions from "./pages/Subscriptions";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const AppContent = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Navbar 
        onToggleSidebar={() => setSidebarExpanded((p) => !p)} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <LeftSidebar expanded={sidebarExpanded} />
      
      <Routes>
        <Route path="/" element={<Index sidebarExpanded={sidebarExpanded} searchQuery={searchQuery} />} />
        <Route path="/watch/:channelName" element={<Watch sidebarExpanded={sidebarExpanded} />} />
        <Route path="/subscriptions" element={<Subscriptions sidebarExpanded={sidebarExpanded} />} />
        <Route path="/history" element={<History sidebarExpanded={sidebarExpanded} />} />
        <Route path="/admin" element={<Admin sidebarExpanded={sidebarExpanded} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <BottomNav /> 
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
