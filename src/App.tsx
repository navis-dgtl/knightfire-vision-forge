import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";

const ThermalStop = lazy(() => import("./pages/ThermalStop"));
const ThermalShield = lazy(() => import("./pages/ThermalShield"));
const ProductComparison = lazy(() => import("./pages/ProductComparison"));
const Products = lazy(() => import("./pages/Products"));
const Publications = lazy(() => import("./pages/Publications"));
const Industries = lazy(() => import("./pages/Industries"));
const About = lazy(() => import("./pages/About"));
const Distributors = lazy(() => import("./pages/Distributors"));
const Contact = lazy(() => import("./pages/Contact"));
const Suppressit = lazy(() => import("./pages/Suppressit"));
const FireQuit = lazy(() => import("./pages/FireQuit"));
const Elixir5 = lazy(() => import("./pages/Elixir5"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/thermal-stop" element={<ThermalStop />} />
              <Route path="/products/thermal-shield" element={<ThermalShield />} />
              <Route path="/products/suppressit" element={<Suppressit />} />
              <Route path="/products/fire-quit" element={<FireQuit />} />
              <Route path="/products/elixir-5" element={<Elixir5 />} />
              <Route path="/products/comparison" element={<ProductComparison />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/about" element={<About />} />
              <Route path="/distributors" element={<Distributors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
