
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
import MyEvents from "./pages/MyEvents";
import MyPurchases from "./pages/MyPurchases";
import EventDetail from "./pages/EventDetail";
import CheckIn from "./pages/CheckIn";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import Support from "./pages/Support";
import ContentPage from "./pages/ContentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/purchases" element={<MyPurchases />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/support" element={<Support />} />
            <Route path="/content/:slug" element={<ContentPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
