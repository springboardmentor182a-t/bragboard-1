import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Shoutouts from "./pages/Shoutouts";
import CreateShoutout from "./pages/CreateShoutout";
import EditShoutout from "./pages/EditShoutout";
import ShoutoutDetail from "./pages/ShoutoutDetail";
import Users from "./pages/Users";
import FlaggedContent from "./pages/FlaggedContent";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/shoutouts" element={<Shoutouts />} />
            <Route path="/shoutouts/create" element={<CreateShoutout />} />
            <Route path="/shoutouts/:id" element={<ShoutoutDetail />} />
            <Route path="/shoutouts/:id/edit" element={<EditShoutout />} />
            <Route path="/users" element={<Users />} />
            <Route path="/flagged" element={<FlaggedContent />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
