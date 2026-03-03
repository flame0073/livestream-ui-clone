import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Watch from "./pages/Watch";
import Subscriptions from "./pages/Subscriptions";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const AppContent = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, loading, signOut } = useAuth();

  return (
    <>
      <Navbar 
        onToggleSidebar={() => setSidebarExpanded((p) => !p)} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        onSignOut={signOut}
      />
      <LeftSidebar expanded={sidebarExpanded} isAdmin={isAdmin} />
      
      <Routes>
        <Route path="/" element={<Index sidebarExpanded={sidebarExpanded} searchQuery={searchQuery} />} />
        <Route path="/watch/:channelName" element={<Watch sidebarExpanded={sidebarExpanded} />} />
        <Route path="/subscriptions" element={<Subscriptions sidebarExpanded={sidebarExpanded} />} />
        <Route path="/history" element={<History sidebarExpanded={sidebarExpanded} />} />
        <Route path="/admin" element={isAdmin ? <Admin sidebarExpanded={sidebarExpanded} /> : <Navigate to="/" />} />
        <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth sidebarExpanded={sidebarExpanded} />} />
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
