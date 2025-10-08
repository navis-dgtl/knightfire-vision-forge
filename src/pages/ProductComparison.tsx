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
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Thermal Stop vs. Thermal Shield</h1>
          <p className="text-xl text-primary-foreground/90">Choose the Right Solution for Your Needs</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="p-4 text-left font-heading">Feature</th>
                  <th className="p-4 text-center font-heading">Thermal Stop</th>
                  <th className="p-4 text-center font-heading">Thermal Shield</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Primary Use", stop: "Fire suppression", shield: "Containment & transport" },
                  { feature: "Form", stop: "Concentrate", shield: "Gel" },
                  { feature: "NFPA 18 Certified", stop: true, shield: true },
                  { feature: "EPA Safer Choice", stop: true, shield: true },
                  { feature: "Prevents Reignition", stop: true, shield: true },
                  { feature: "Thermal Shielding", stop: "Limited", shield: "Primary function" },
                  { feature: "Ideal For", stop: "First responders, immediate suppression", shield: "Transport, storage, containment" }
                ].map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4 font-semibold">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.stop === 'boolean' ? (row.stop ? <Check className="h-5 w-5 text-accent mx-auto" /> : '-') : row.stop}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.shield === 'boolean' ? (row.shield ? <Check className="h-5 w-5 text-accent mx-auto" /> : '-') : row.shield}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Need Help Choosing? Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductComparison;
