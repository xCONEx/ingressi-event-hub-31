
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import MyProfile from "./pages/MyProfile";
import MyPurchases from "./pages/MyPurchases";
import MyEvents from "./pages/MyEvents";
import EventDetail from "./pages/EventDetail";
import CheckIn from "./pages/CheckIn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/purchases" element={<MyPurchases />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
