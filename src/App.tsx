import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Reviews from "./pages/Reviews";
import Pricing from "./pages/Pricing";
import Fashion from "./pages/Fashion";
import Wedding from "./pages/Wedding";
import BabyShower from "./pages/BabyShower";
import Newborn from "./pages/Newborn";
import PreBirthday from "./pages/PreBirthday";
import FamilyPortraits from "./pages/FamilyPortraits";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./hooks/useAuth";

const AdminApp = lazy(() => import("./admin/AdminApp"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* The only pages open to signed-out visitors */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Studio admin dashboard: its own sign-in, separate from client accounts */}
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<div className="min-h-screen bg-background" aria-busy="true" />}>
                  <AdminApp />
                </Suspense>
              }
            />

            {/* Everything else is for signed-in clients only */}
            <Route element={<RequireAuth><Outlet /></RequireAuth>}>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/services/fashion" element={<Fashion />} />
              <Route path="/services/wedding" element={<Wedding />} />
              <Route path="/services/baby-shower" element={<BabyShower />} />
              {/* Maternity is now part of the combined Baby Shower & Maternity service */}
              <Route path="/services/maternity" element={<Navigate to="/services/baby-shower" replace />} />
              <Route path="/services/newborn" element={<Newborn />} />
              <Route path="/services/pre-birthday" element={<PreBirthday />} />
              <Route path="/services/family-portraits" element={<FamilyPortraits />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
