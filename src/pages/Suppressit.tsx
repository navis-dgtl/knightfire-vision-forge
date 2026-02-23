import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { BadgeCheck, Shield, ChevronRight, Droplets } from "lucide-react";
import suppressitImg from "@/assets/suppressit.jpg";

const Suppressit = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm mb-6 text-primary-foreground/80">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/products" className="hover:text-accent">Products</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Suppressit™</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <Droplets className="h-8 w-8 text-accent" />
                <h1 className="text-4xl md:text-5xl font-heading font-bold">Suppressit™</h1>
              </div>
              <p className="text-xl mb-2 text-primary-foreground/90">Non-Fluorinated Foam — Direct AFFF Replacement</p>
              <p className="text-lg mb-6 text-accent font-semibold">Attack Fire Smarter — Anywhere, Anytime.</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">NFPA 11 Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">PFAS-Free</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">UL 162</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact">Request Quote</Link>
                </Button>
              </div>
            </div>

            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center p-8">
              <img 
                src={suppressitImg} 
                alt="Suppressit™ Non-Fluorinated Foam" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6 text-primary">What is Suppressit™?</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Suppressit™ is expertly designed to replace AFFF, providing a low-viscosity, high-performance solution that seamlessly integrates into existing systems without the need to change proportioning plates. Its innovative self-healing ability is first in its class, ensuring high safety standards for firefighters during suppression and rescue operations.
                </p>
                <p>
                  With non-toxic ingredients, Suppressit™ eliminates the concerns associated with PFAS and PFOS, offering zero health effects on first responders and minimal environmental impact. Whether deployed from aircraft, helicopters, ground crews, firetrucks, or CAFS systems, Suppressit™ penetrates faster, clings longer, and stops fire in its tracks.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Patented technology developed and owned by Redline Fire Solutions. Distributed by KnightTEK, Exclusive Global Distributor.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold mb-6 text-primary">Key Features</h3>
              <div className="grid gap-3">
                {[
                  "Direct AFFF replacement",
                  "Low-viscosity, high-performance",
                  "First-in-class self-healing ability",
                  "No proportioning plate changes needed",
                  "Aircraft, helicopter, and ground deployment",
                  "CAFS system compatible",
                  "Non-toxic, zero health effects on first responders",
                  "PFAS and PFOS free",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center text-primary">Technical Specifications</h2>
          
          <Tabs defaultValue="certs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="certs">Certifications</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            <TabsContent value="certs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-4 text-primary">Certifications & Compliance</h3>
                  <div className="space-y-4 text-foreground/80">
                    <div>
                      <h4 className="font-semibold mb-2">NFPA 11 Certification</h4>
                      <p>Third-party certified to meet NFPA 11 standards.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">UL 162</h4>
                      <p>Meets and exceeds UL 162 standards.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">PFAS-Free</h4>
                      <p>Third-party tested and verified PFAS-free.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Patented Technology</h4>
                      <p>Patent-pending formulation developed and owned by Redline Fire Solutions.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="applications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-4 text-primary">Ideal Applications</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li>• Aircraft and helicopter deployment</li>
                    <li>• Ground crew firefighting operations</li>
                    <li>• Firetruck-based suppression</li>
                    <li>• CAFS system integration</li>
                    <li>• Industrial fire suppression</li>
                    <li>• Facilities with existing AFFF systems</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold mb-4 text-primary">Explore Our Other Products</h2>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/products/thermal-stop">Thermal Stop™</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/products/thermal-shield">Thermal Shield™</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/products/fire-quit">Fire Quit™</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/products/elixir-5">Elixir 5™</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Replace AFFF?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Contact us today to learn how Suppressit™ can seamlessly integrate into your existing systems.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Request a Quote</Link>
            </Button>
          </div>
          <p className="mt-6 text-primary-foreground/90">
            Or call us at <a href="tel:1-833-466-5835" className="text-accent font-semibold hover:underline">1-833-ion-ktek</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Suppressit;