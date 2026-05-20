import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import knightTekIcon from "@/assets/knight-tek-icon.webp";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { usePublicNav, type NavNode } from "@/lib/navigation";
import { useAllPages, type Page } from "@/lib/pages";

interface RenderedLink {
  key: string;
  name: string;
  path: string;
  external: boolean;
  newTab: boolean;
  submenu?: RenderedLink[];
}

const FALLBACK_LINKS: RenderedLink[] = [
  { key: "f-home", name: "Home", path: "/", external: false, newTab: false },
  {
    key: "f-products",
    name: "Products",
    path: "/products",
    external: false,
    newTab: false,
    submenu: [
      { key: "f-p-all", name: "All Products", path: "/products", external: false, newTab: false },
      { key: "f-p-1", name: "Thermal Stop™", path: "/products/thermal-stop", external: false, newTab: false },
      { key: "f-p-2", name: "Thermal Shield™", path: "/products/thermal-shield", external: false, newTab: false },
      { key: "f-p-3", name: "Suppressit™", path: "/products/suppressit", external: false, newTab: false },
      { key: "f-p-4", name: "Fire Quit™", path: "/products/fire-quit", external: false, newTab: false },
      { key: "f-p-5", name: "Elixir 5™", path: "/products/elixir-5", external: false, newTab: false },
      { key: "f-p-6", name: "Product Comparison", path: "/products/comparison", external: false, newTab: false },
    ],
  },
  { key: "f-industries", name: "Industries", path: "/industries", external: false, newTab: false },
  { key: "f-distributors", name: "Distributors", path: "/distributors", external: false, newTab: false },
  { key: "f-media", name: "Media", path: "/publications", external: false, newTab: false },
  { key: "f-about", name: "About", path: "/about", external: false, newTab: false },
  { key: "f-contact", name: "Contact", path: "/contact", external: false, newTab: false },
];

const isExternal = (url: string) => /^https?:\/\//i.test(url);

const resolvePath = (
  node: NavNode,
  pagesById: Map<string, Pick<Page, "slug" | "status">>,
): string | null => {
  if (node.page_id) {
    const page = pagesById.get(node.page_id);
    if (!page || page.status !== "published") return null;
    return `/${page.slug}`;
  }
  return node.url || null;
};

const toRendered = (
  node: NavNode,
  pagesById: Map<string, Pick<Page, "slug" | "status">>,
): RenderedLink | null => {
  const path = resolvePath(node, pagesById);
  if (!path) return null;
  const submenu = node.children
    .map((child) => toRendered(child, pagesById))
    .filter((c): c is RenderedLink => !!c);
  return {
    key: node.id,
    name: node.label,
    path,
    external: isExternal(path),
    newTab: node.opens_new_tab,
    submenu: submenu.length > 0 ? submenu : undefined,
  };
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { data: dbTree } = usePublicNav("header");
  const { data: pages = [] } = useAllPages();

  const navLinks: RenderedLink[] = useMemo(() => {
    if (!dbTree || dbTree.length === 0) return FALLBACK_LINKS;
    const pagesById = new Map<string, Pick<Page, "slug" | "status">>(
      pages.map((p) => [p.id, { slug: p.slug, status: p.status }]),
    );
    const rendered = dbTree
      .map((node) => toRendered(node, pagesById))
      .filter((n): n is RenderedLink => !!n);
    return rendered.length > 0 ? rendered : FALLBACK_LINKS;
  }, [dbTree, pages]);

  const isActive = (path: string) => location.pathname === path;

  // Single component for an in-content link that knows internal vs. external.
  const NavAnchor = ({
    link,
    className,
    onClick,
    children,
  }: {
    link: RenderedLink;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
  }) => {
    if (link.external) {
      return (
        <a
          href={link.path}
          className={className}
          onClick={onClick}
          target={link.newTab ? "_blank" : undefined}
          rel={link.newTab ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        to={link.path}
        className={className}
        onClick={onClick}
        target={link.newTab ? "_blank" : undefined}
        rel={link.newTab ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
      <AnnouncementBanner />
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        <div className="border-b border-primary-foreground/20 py-2 hidden lg:block">
          <div className="flex justify-between items-center text-sm text-primary-foreground/90">
            <div className="flex gap-6">
              <a href="tel:1-833-466-5835" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="h-4 w-4" />
                1-833-466-5835
              </a>
              <a href="mailto:info@ktekglobal.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="h-4 w-4" />
                info@ktekglobal.com
              </a>
            </div>
            <div className="text-xs">Lithium-Ion Battery Thermal Runaway Solutions</div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={knightTekIcon} alt="KnightTek Logo" className="h-10 w-10" />
            <div>
              <div className="text-2xl font-heading font-bold text-primary-foreground">
                Knight<span className="text-accent">Tek</span>
              </div>
              <div className="text-xs text-primary-foreground/80 -mt-1">
                Safety Through Innovative Solutions
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.key} className="relative group">
                <NavAnchor
                  link={link}
                  className={`font-medium transition-colors hover:text-accent ${
                    isActive(link.path) ? "text-accent" : "text-primary-foreground"
                  }`}
                >
                  {link.name}
                </NavAnchor>
                {link.submenu && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-card shadow-xl rounded-lg border border-border py-2 min-w-[220px]">
                      {link.submenu.map((sublink) => (
                        <NavAnchor
                          key={sublink.key}
                          link={sublink}
                          className="block px-4 py-2 hover:bg-muted transition-colors text-foreground"
                        >
                          {sublink.name}
                        </NavAnchor>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Request Quote</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-primary-foreground/20 py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <div key={link.key}>
                  <NavAnchor
                    link={link}
                    onClick={() => setIsOpen(false)}
                    className={`block font-medium py-2 transition-colors ${
                      isActive(link.path) ? "text-accent" : "text-primary-foreground"
                    }`}
                  >
                    {link.name}
                  </NavAnchor>
                  {link.submenu && (
                    <div className="pl-4 flex flex-col gap-2 mt-2">
                      {link.submenu.map((sublink) => (
                        <NavAnchor
                          key={sublink.key}
                          link={sublink}
                          onClick={() => setIsOpen(false)}
                          className="text-primary-foreground/80 hover:text-accent transition-colors py-1"
                        >
                          {sublink.name}
                        </NavAnchor>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                <Link to="/contact" onClick={() => setIsOpen(false)}>Request Quote</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
