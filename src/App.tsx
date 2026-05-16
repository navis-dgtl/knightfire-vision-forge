import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import ThermalStop from "./pages/ThermalStop";
import ThermalShield from "./pages/ThermalShield";
import ProductComparison from "./pages/ProductComparison";
import Products from "./pages/Products";
import Publications from "./pages/Publications";
import Industries from "./pages/Industries";
import About from "./pages/About";
import Distributors from "./pages/Distributors";
import Contact from "./pages/Contact";
import Suppressit from "./pages/Suppressit";
import FireQuit from "./pages/FireQuit";
import Elixir5 from "./pages/Elixir5";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import PostDetail from "./pages/PostDetail";
import PostsList from "./pages/admin/PostsList";
import PostEditor from "./pages/admin/PostEditor";
import { RequireAdmin } from "@/components/RequireAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
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
            <Route path="/publications/:slug" element={<PostDetail />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/about" element={<About />} />
            <Route path="/distributors" element={<Distributors />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/admin/posts"
              element={
                <RequireAdmin>
                  <PostsList />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/posts/new"
              element={
                <RequireAdmin>
                  <PostEditor />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/posts/:id"
              element={
                <RequireAdmin>
                  <PostEditor />
                </RequireAdmin>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
