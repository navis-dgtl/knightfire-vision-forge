import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-4">
              Knight<span className="text-accent">Tek</span>
            </h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Exclusive global distributor of Thermal Stop and Thermal Shield - revolutionary lithium-ion battery fire suppression solutions.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading font-bold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products/thermal-stop" className="hover:text-accent transition-colors">
                  Thermal Stop
                </Link>
              </li>
              <li>
                <Link to="/products/thermal-shield" className="hover:text-accent transition-colors">
                  Thermal Shield
                </Link>
              </li>
              <li>
                <Link to="/products/comparison" className="hover:text-accent transition-colors">
                  Product Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-1 flex-shrink-0" />
                <a href="tel:405-568-2742" className="hover:text-accent transition-colors">
                  405-568-2742
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-1 flex-shrink-0" />
                <a href="mailto:info@knightfiretek.com" className="hover:text-accent transition-colors break-all">
                  info@knightfiretek.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>© {currentYear} KnightTek, LLC. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
