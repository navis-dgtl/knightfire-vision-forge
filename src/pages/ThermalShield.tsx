import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, BadgeCheck, Download, ChevronRight } from "lucide-react";
import thermalShieldProduct from "@/assets/thermal-shield-product.jpg";

const ThermalShield = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="pt-32 pb-16 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm mb-6 text-primary-foreground/80">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Thermal Shield</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Thermal Shield</h1>
              <p className="text-xl mb-6 text-primary-foreground/90">The Premier Solution for Lithium-Ion Battery Fire Transport & Containment</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">NFPA 18 Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">EPA Safer Choice Listed</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact">Request Quote</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  <Download className="h-5 w-5 mr-2" />
                  Download Brochure
                </Button>
              </div>
            </div>

            <div className="bg-background rounded-lg p-8">
              <img src={thermalShieldProduct} alt="Thermal Shield" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-heading font-bold mb-6 text-primary">Safe Battery Transport After Thermal Events</h2>
          <p className="text-lg text-foreground/80 mb-8">
            Thermal Shield is a revolutionary gel solution designed specifically for lithium-ion battery fires. It acts as a powerful barrier to prevent and halt reignition during transport and storage.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/contact">Contact Us for Details</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThermalShield;
