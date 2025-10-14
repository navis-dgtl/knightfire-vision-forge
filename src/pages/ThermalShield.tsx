import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, BadgeCheck, Download, ChevronRight } from "lucide-react";
import thermalShieldProduct from "@/assets/thermal-shield-new.png";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Snowflake, Lock, Wind } from "lucide-react";

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
                <Button asChild size="lg" variant="outline-light">
                  <a href="/brochures/thermal-stop-thermal-shield-brochure.pdf" download>
                    <Download className="h-5 w-5 mr-2" />
                    Download Brochure
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-background rounded-lg p-8">
              <img src={thermalShieldProduct} alt="Thermal Shield" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6 text-primary">What is Thermal Shield?</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Extinguishing the flames doesn't mean the danger is gone. Thermal Shield is the only gel suppressant proven to prevent reignition during the high-risk transport and storage phases.
                </p>
                <p>
                  Applied directly to damaged battery packs, it delivers instant surface cooling, seals breaches to stop chemical activity, and traps hazardous PFAS vapors before they can escape.
                </p>
                <p>
                  This all-natural, non-hazardous gel is certified to NFPA 18 standards and goes on easily, requiring only a small amount for full containment. Quick to clean up and engineered for safety, Thermal Shield's patent-pending formulation keeps compromised batteries stable, secure, and under control until they can be safely disposed of or repaired.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold mb-6 text-primary">Key Features</h3>
              <div className="grid gap-3">
                {[
                  "Prevents reignition during transport and storage",
                  "Instant surface cooling on contact",
                  "Seals battery breaches to stop chemical activity",
                  "Traps hazardous PFAS vapors",
                  "All-natural, non-hazardous gel formula",
                  "NFPA 18 certified",
                  "Patent-pending formulation",
                  "Easy application with minimal product needed",
                  "Quick and simple cleanup",
                  "Non-toxic and biodegradable",
                  "Safe for humans, animals, and environment",
                  "Long-term shelf life",
                  "DOT Non-Hazardous for easy transport"
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

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary">How Thermal Shield Works</h2>
            <p className="text-xl text-foreground/70">Three-Part Containment System</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Snowflake className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">1. Cool</h3>
                <p className="text-foreground/70">
                  Delivers instant surface cooling on contact with damaged battery packs, rapidly reducing temperature.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">2. Seal</h3>
                <p className="text-foreground/70">
                  Seals breaches in battery casings to stop ongoing chemical activity and prevent oxygen exposure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wind className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">3. Trap</h3>
                <p className="text-foreground/70">
                  Traps hazardous PFAS vapors and toxic gases, preventing them from escaping into the environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center text-primary">Technical Specifications</h2>
          
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Product Information</TabsTrigger>
              <TabsTrigger value="certs">Certifications</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-4 text-primary">Available Sizes</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li>• 32 oz bottle for immediate deployment</li>
                    <li>• 1 gallon container</li>
                    <li>• 5 gallon bulk container</li>
                    <li>• Custom sizing available for large-scale operations</li>
                  </ul>
                  <h3 className="text-xl font-heading font-bold mt-6 mb-4 text-primary">Storage & Handling</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li>• Extended shelf life with proper storage</li>
                    <li>• Store in cool, dry location</li>
                    <li>• No special handling requirements</li>
                    <li>• DOT Non-Hazardous classification</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="certs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-4 text-primary">Certifications & Compliance</h3>
                  <div className="space-y-4 text-foreground/80">
                    <div>
                      <h4 className="font-semibold mb-2">NFPA 18 Certification</h4>
                      <p>Certified to meet industry standards for wetting agents in fire suppression.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">EPA Safer Choice Listed</h4>
                      <p>Recognized by the EPA for environmental safety and effectiveness.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Patent-Pending Technology</h4>
                      <p>Proprietary gel formulation designed specifically for lithium-ion battery containment.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Safety Data Sheet (SDS)</h4>
                      <p>Complete safety documentation available for download.</p>
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
                    <li>• Post-fire EV and hybrid vehicle containment</li>
                    <li>• Towing and vehicle transport after thermal events</li>
                    <li>• Battery storage facility safety</li>
                    <li>• Industrial battery energy storage systems (BESS)</li>
                    <li>• Maritime vessel battery containment</li>
                    <li>• Aviation battery incident management</li>
                    <li>• E-mobility device storage (e-bikes, e-scooters)</li>
                    <li>• Emergency response and hazmat operations</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Dual-Agent System */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold mb-4 text-primary">The Complete Dual-Agent System</h2>
            <p className="text-xl text-foreground/70">
              Thermal Stop + Thermal Shield work together to provide comprehensive lithium-ion battery fire protection
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Shield className="h-12 w-12 text-accent flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-2xl font-heading font-bold mb-2 text-primary">Thermal Stop</h3>
                  <p className="text-foreground/70 mb-4">
                    Rapid-response liquid agent that penetrates battery cells to halt thermal runaway in under 30 seconds. Your first line of defense against lithium-ion battery fires.
                  </p>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link to="/products/thermal-stop">Learn More About Thermal Stop</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Order Thermal Shield?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Contact us today to request a quote or learn more about our dual-agent fire suppression system
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Request a Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline-light">
              <Link to="/contact">Schedule a Demo</Link>
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

export default ThermalShield;
