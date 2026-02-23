import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const ProductComparison = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="pt-32 pb-16 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Product Comparison</h1>
          <p className="text-xl text-primary-foreground/90">Choose the Right Solution for Your Needs</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="p-4 text-left font-heading">Feature</th>
                  <th className="p-4 text-center font-heading">Thermal Stop™</th>
                  <th className="p-4 text-center font-heading">Thermal Shield™</th>
                  <th className="p-4 text-center font-heading">Suppressit™</th>
                  <th className="p-4 text-center font-heading">Fire Quit™</th>
                  <th className="p-4 text-center font-heading">Elixir 5™</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Primary Use", stop: "Li-ion fire suppression", shield: "Containment & transport", suppressit: "AFFF replacement foam", quit: "Wetting agent", elixir: "Extinguisher refill" },
                  { feature: "Form", stop: "Concentrate", shield: "Gel", suppressit: "Low-viscosity foam", quit: "Wetting agent", elixir: "Wetting agent" },
                  { feature: "Fire Classes", stop: "Li-ion thermal runaway", shield: "Li-ion containment", suppressit: "Class A & B", quit: "Class A, B, D, K", elixir: "Class A, B, C, D, K" },
                  { feature: "NFPA 18 Certified", stop: true, shield: true, suppressit: false, quit: true, elixir: true },
                  { feature: "NFPA 11 Certified", stop: false, shield: false, suppressit: true, quit: false, elixir: false },
                  { feature: "EPA Safer Choice", stop: true, shield: true, suppressit: false, quit: false, elixir: false },
                  { feature: "PFAS-Free", stop: true, shield: true, suppressit: true, quit: true, elixir: true },
                  { feature: "Prevents Reignition", stop: true, shield: true, suppressit: false, quit: false, elixir: false },
                  { feature: "Non-Conductive", stop: false, shield: false, suppressit: false, quit: false, elixir: true },
                  { feature: "Ideal For", stop: "First responders, immediate suppression", shield: "Transport, storage, containment", suppressit: "Facilities with AFFF systems", quit: "Wildland & structural firefighting", elixir: "Extinguisher refill, electrical safety" },
                ].map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4 font-semibold">{row.feature}</td>
                    {['stop', 'shield', 'suppressit', 'quit', 'elixir'].map((key) => {
                      const val = row[key as keyof typeof row];
                      return (
                        <td key={key} className="p-4 text-center">
                          {typeof val === 'boolean' ? (val ? <Check className="h-5 w-5 text-accent mx-auto" /> : '—') : val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 bg-gradient-to-br from-accent/5 to-primary/5 border-2 border-accent/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-primary">
              Complete Fire Suppression Ecosystem
            </h2>
            <p className="text-lg text-foreground/80 mb-6 max-w-3xl mx-auto">
              Our product lineup covers the full spectrum of fire suppression needs — from lithium-ion battery thermal runaway to AFFF replacement, wildland firefighting, and all-class extinguisher solutions. Contact us to find the right combination for your operations.
            </p>
            <p className="text-sm text-muted-foreground mb-6 italic">
              Patented technology developed and owned by Redline Fire Solutions. Distributed by KnightTEK, Exclusive Global Distributor.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/products">View All Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductComparison;