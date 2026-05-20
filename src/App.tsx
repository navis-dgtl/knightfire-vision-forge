import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import { RequireAdmin } from "@/components/RequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";

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
const SignUp = lazy(() => import("./pages/SignUp"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const CustomPage = lazy(() => import("./pages/CustomPage"));
const RsvpMesquite = lazy(() => import("./pages/RsvpMesquite"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin routes
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Submissions = lazy(() => import("./pages/admin/Submissions"));
const PostsList = lazy(() => import("./pages/admin/PostsList"));
const PostEditor = lazy(() => import("./pages/admin/PostEditor"));
const PagesList = lazy(() => import("./pages/admin/PagesList"));
const PageEditor = lazy(() => import("./pages/admin/PageEditor"));
const HeroSlidesList = lazy(() => import("./pages/admin/HeroSlidesList"));
const HeroSlideEditor = lazy(() => import("./pages/admin/HeroSlideEditor"));
const BannersList = lazy(() => import("./pages/admin/BannersList"));
const BannerEditor = lazy(() => import("./pages/admin/BannerEditor"));
const NavigationEditor = lazy(() => import("./pages/admin/NavigationEditor"));
const SiteSettings = lazy(() => import("./pages/admin/SiteSettings"));
const Allowlist = lazy(() => import("./pages/admin/Allowlist"));

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
              <Route path="/publications/:slug" element={<PostDetail />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/about" element={<About />} />
              <Route path="/distributors" element={<Distributors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/rsvp-mesquite" element={<RsvpMesquite />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Admin: gated once at the parent, then wrapped by the shell. */}
              <Route path="/admin" element={<RequireAdmin />}>
                <Route element={<AdminShell />}>
                  <Route index element={<Dashboard />} />
                  <Route path="submissions" element={<Submissions />} />
                  <Route path="posts" element={<PostsList />} />
                  <Route path="posts/new" element={<PostEditor />} />
                  <Route path="posts/:id" element={<PostEditor />} />
                  <Route path="pages" element={<PagesList />} />
                  <Route path="pages/new" element={<PageEditor />} />
                  <Route path="pages/:id" element={<PageEditor />} />
                  <Route path="hero" element={<HeroSlidesList />} />
                  <Route path="hero/new" element={<HeroSlideEditor />} />
                  <Route path="hero/:id" element={<HeroSlideEditor />} />
                  <Route path="banners" element={<BannersList />} />
                  <Route path="banners/new" element={<BannerEditor />} />
                  <Route path="banners/:id" element={<BannerEditor />} />
                  <Route path="navigation" element={<NavigationEditor />} />
                  <Route path="settings" element={<SiteSettings />} />
                  <Route path="allowlist" element={<Allowlist />} />
                </Route>
              </Route>

              {/* Custom admin-authored pages. MUST stay last before the 404
                  catch-all so existing fixed routes always win. */}
              <Route path="/:slug" element={<CustomPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
