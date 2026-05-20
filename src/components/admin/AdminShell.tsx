import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Newspaper,
  Image as ImageIcon,
  Megaphone,
  FileText,
  Menu as MenuIcon,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import knightTekIcon from "@/assets/knight-tek-icon.webp";
import Seo from "@/components/Seo";

interface NavGroup {
  label: string;
  items: Array<{ to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }>;
}

const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/submissions", label: "Submissions", icon: Inbox },
      { to: "/admin/posts", label: "Publications", icon: Newspaper },
      { to: "/admin/pages", label: "Pages", icon: FileText },
    ],
  },
  {
    label: "Site",
    items: [
      { to: "/admin/hero", label: "Hero Slides", icon: ImageIcon },
      { to: "/admin/banners", label: "Banners", icon: Megaphone },
      { to: "/admin/navigation", label: "Navigation", icon: MenuIcon },
      { to: "/admin/settings", label: "Site Settings", icon: Settings },
    ],
  },
  {
    label: "Access",
    items: [
      { to: "/admin/allowlist", label: "Allowlist", icon: ShieldCheck },
    ],
  },
];

/** Pretty title derived from the current pathname for the top bar. */
function deriveTitle(pathname: string): string {
  for (const group of NAV) {
    for (const item of group.items) {
      if (item.end ? pathname === item.to : pathname.startsWith(item.to)) {
        return item.label;
      }
    }
  }
  return "Admin";
}

export function AdminShell() {
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = deriveTitle(location.pathname);

  return (
    <div className="min-h-screen flex bg-muted/30">
      <Seo title={`${title} | KnightTek Admin`} description="KnightTek administration panel" noindex canonical={location.pathname} />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground flex flex-col transition-transform duration-200",
          "lg:translate-x-0 lg:static lg:flex",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link to="/" className="flex items-center gap-3 px-5 py-5 border-b border-primary-foreground/10">
          <img src={knightTekIcon} alt="KnightTek" className="h-8 w-8" />
          <div>
            <div className="text-lg font-heading font-bold leading-tight">
              Knight<span className="text-accent">Tek</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-primary-foreground/70">
              Admin Panel
            </div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto py-4 space-y-6">
          {NAV.map((group) => (
            <div key={group.label}>
              <div className="px-5 mb-1 text-[10px] uppercase tracking-wider text-primary-foreground/50 font-semibold">
                {group.label}
              </div>
              <ul>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-5 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-primary-foreground/10 text-accent border-l-2 border-accent"
                              : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5 border-l-2 border-transparent",
                          )
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-primary-foreground/10 space-y-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
          >
            <Link to="/" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View site
            </Link>
          </Button>
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="sticky top-0 z-20 bg-background border-b px-4 lg:px-8 py-3 flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 -ml-1.5 rounded hover:bg-muted"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
          <h1 className="text-lg font-heading font-semibold">{title}</h1>
        </header>

        <main className="flex-1 p-4 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
