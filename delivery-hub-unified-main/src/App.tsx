
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Register from "./pages/Register";
import { TaskProvider } from "./context/TaskContext";

// import Layout from "@/components/Layout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "@/pages/Dashboard";
import Map from "./pages/Map";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Earnings from "./pages/Earnings"
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* Add Register Route */}
            <Route path="/dashboard" element={ <Dashboard />} />
            <Route path="/map" element={<Map />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
             <Route path="/earnings" element={<Earnings />} />
             <Route path="/settings" element={<Settings />} />
             <Route path="/tasks" element={<TaskProvider><Dashboard /></TaskProvider>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
