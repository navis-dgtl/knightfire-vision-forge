import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import knightTekIcon from "@/assets/knight-tek-icon.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { 
      name: "Products", 
      path: "/products",
      submenu: [
        { name: "All Products", path: "/products" },
        { name: "Thermal Stop™", path: "/products/thermal-stop" },
        { name: "Thermal Shield™", path: "/products/thermal-shield" },
        { name: "Product Comparison", path: "/products/comparison" },
      ]
    },
    { name: "Industries", path: "/industries" },
    { name: "Media", path: "/publications" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
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
            <div className="text-xs">
              Lithium-Ion Battery Thermal Runaway Solutions
            </div>
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
              <div key={link.path} className="relative group">
                <Link
                  to={link.path}
                  className={`font-medium transition-colors hover:text-accent ${
                    isActive(link.path) ? "text-accent" : "text-primary-foreground"
                  }`}
                >
                  {link.name}
                </Link>
                {link.submenu && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-card shadow-xl rounded-lg border border-border py-2 min-w-[220px]">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          className="block px-4 py-2 hover:bg-muted transition-colors text-foreground"
                        >
                          {sublink.name}
                        </Link>
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
                <div key={link.path}>
                  <Link
                    to={link.path}
                    className={`block font-medium py-2 transition-colors ${
                      isActive(link.path) ? "text-accent" : "text-primary-foreground"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.submenu && (
                    <div className="pl-4 flex flex-col gap-2 mt-2">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          className="text-primary-foreground/80 hover:text-accent transition-colors py-1"
                          onClick={() => setIsOpen(false)}
                        >
                          {sublink.name}
                        </Link>
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
