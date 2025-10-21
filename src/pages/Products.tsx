import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Flame, BadgeCheck, ArrowRight } from "lucide-react";
import thermalStopProduct1 from "@/assets/thermal-stop-1.jpg";
import thermalStopProduct2 from "@/assets/thermal-stop-2.jpg";
import thermalShieldProduct from "@/assets/thermal-shield-new.png";

const Products = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-foreground">
              Our Products
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Purpose-Built Lithium-Ion Battery Fire Solutions
            </p>
            <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto">
              7+ years of dedicated research and development creating solutions specifically designed for lithium-ion battery thermal runaway fires. NFPA 18 certified. EPA Safer Choice listed. 100% success rate.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {/* Thermal Stop Card */}
            <Card className="bg-card border-0 overflow-hidden hover:shadow-2xl transition-shadow group">
              <div className="aspect-square bg-muted flex items-center justify-center p-4 gap-2">
                <img 
                  src={thermalStopProduct1} 
                  alt="Thermal Stop Fire Extinguishing Agent" 
                  className="h-full object-contain flex-1"
                />
                <img 
                  src={thermalStopProduct2} 
                  alt="Thermal Stop Fire Extinguishing Agent" 
                  className="h-full object-contain flex-1"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-6 w-6 text-accent" />
                  <h3 className="text-2xl font-heading font-bold text-primary">Thermal Stop</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 font-semibold">Extinguishing Agent</p>
                <p className="text-foreground/80 mb-6">
                  Revolutionary liquid agent that penetrates battery cells to halt thermal runaway in under 30 seconds. The only suppressant specifically designed to eliminate lithium-ion battery fires.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Stops thermal runaway in seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">NFPA 18 Certified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">EPA Safer Choice Listed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Effective on all lithium-ion battery chemistries</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 group-hover:shadow-lg transition-all">
                  <Link to="/products/thermal-stop" className="flex items-center justify-center gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Thermal Shield Card */}
            <Card className="bg-card border-0 overflow-hidden hover:shadow-2xl transition-shadow group">
              <div className="aspect-square bg-muted flex items-center justify-center p-8">
                <img 
                  src={thermalShieldProduct} 
                  alt="Thermal Shield Containment Solution" 
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-6 w-6 text-accent" />
                  <h3 className="text-2xl font-heading font-bold text-primary">Thermal Shield</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 font-semibold">Containment & Prevention Solution</p>
                <p className="text-foreground/80 mb-6">
                  High-performance gel barrier that locks down compromised batteries, preventing re-ignition and trapping toxic gases during transport or storage. The final containment solution.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Prevents thermal runaway propagation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Safe for battery transport</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Provides thermal shielding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">NFPA 18 Certified</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 group-hover:shadow-lg transition-all">
                  <Link to="/products/thermal-shield" className="flex items-center justify-center gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Products */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center text-primary">
              New Products Coming Soon
            </h2>
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardContent className="p-12 text-center">
                <p className="text-xl text-foreground/70 mb-4">Expanding Our Fire Safety Solutions</p>
                <p className="text-foreground/60">Stay tuned for exciting new additions to our product lineup</p>
              </CardContent>
            </Card>
          </div>

          {/* Comparison CTA */}
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardContent className="p-8">
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-primary">
                  Not Sure Which Product You Need?
                </h2>
                <p className="text-lg text-foreground/80 mb-6 max-w-2xl mx-auto">
                  Compare our products side-by-side to find the perfect solution for your specific needs. Or contact us for personalized recommendations.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link to="/products/comparison" className="flex items-center gap-2">
                      Compare Products <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-primary to-accent/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary-foreground">
            Ready to Protect Your Team?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            The best opportunity to reduce injuries and save lives.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <Link to="/contact">Request a Consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline-light">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </div>
          <p className="mt-6 text-primary-foreground/90">
            Or call us at <a href="tel:405-568-2742" className="text-accent font-semibold hover:underline">405-568-2742</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
