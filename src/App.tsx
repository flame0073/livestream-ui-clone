import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Watch from "./pages/Watch";
import Subscriptions from "./pages/Subscriptions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar 
            onToggleSidebar={() => setSidebarExpanded((p) => !p)} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <LeftSidebar expanded={sidebarExpanded} />
          
          <Routes>
            <Route
              path="/"
              element={
                <Index 
                  sidebarExpanded={sidebarExpanded} 
                  searchQuery={searchQuery} 
                />
              }
            />
            <Route 
              path="/watch/:channelName" 
              element={<Watch sidebarExpanded={sidebarExpanded} />} 
            />
            {/* Bagong Route para sa Subscriptions */}
            <Route 
              path="/subscriptions" 
              element={<Subscriptions sidebarExpanded={sidebarExpanded} />} 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <BottomNav /> 
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
