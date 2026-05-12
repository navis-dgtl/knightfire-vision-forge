import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import prerender from "@prerenderer/rollup-plugin";

// Routes to prerender to static HTML at build time. Each route receives the
// fully-rendered <head> (title, description, canonical, JSON-LD) baked in,
// fixing the audit's "high rendering %" GEO finding for non-JS crawlers.
const PRERENDER_ROUTES = [
  "/",
  "/products",
  "/products/thermal-stop",
  "/products/thermal-shield",
  "/products/suppressit",
  "/products/fire-quit",
  "/products/elixir-5",
  "/products/comparison",
  "/industries",
  "/about",
  "/distributors",
  "/publications",
  "/contact",
];

// Prerendering can be skipped (e.g. on hosts without Chromium) by setting
// SKIP_PRERENDER=1. The site still works as a normal SPA in that case.
const ENABLE_PRERENDER = process.env.SKIP_PRERENDER !== "1";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode !== "development" &&
      ENABLE_PRERENDER &&
      prerender({
        routes: PRERENDER_ROUTES,
        renderer: "@prerenderer/renderer-puppeteer",
        rendererOptions: {
          maxConcurrentRoutes: 4,
          renderAfterTime: 1500,
          headless: true,
          launchOptions: {
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          },
        },
        postProcess(rendered) {
          // Strip the <noscript> warning some setups inject; keep clean HTML.
          rendered.html = rendered.html.replace(
            /<script (?:type="module" )?(?:crossorigin )?src="\/?@vite\/client"><\/script>/g,
            "",
          );
        },
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
