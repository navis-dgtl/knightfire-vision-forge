import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { BadgeCheck, Shield, Snowflake, Download, ChevronRight } from "lucide-react";
import extinguishersGroup from "@/assets/extinguishers-group.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import thermalStop2ltr from "@/assets/thermal-stop-2ltr.png";
import thermalStop5gal from "@/assets/thermal-stop-5gal.png";
import thermalStop6ltr from "@/assets/thermal-stop-6ltr.png";
import thermalStop9ltr from "@/assets/thermal-stop-9ltr.png";
import thermalStop55gal from "@/assets/thermal-stop-55gal.png";

const ThermalStop = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm mb-6 text-primary-foreground/80">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/products/thermal-stop" className="hover:text-accent">Products</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Thermal Stop™</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <Shield className="h-8 w-8 text-accent" />
                <h1 className="text-4xl md:text-5xl font-heading font-bold">Thermal Stop™</h1>
              </div>
              <p className="text-xl mb-6 text-primary-foreground/90">Lithium-Ion Battery Fire Extinguishing Agent</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">NFPA 18 Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">EPA Safer Choice Listed</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">Made in USA</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact">Request Quote</Link>
                </Button>
                <Button asChild size="lg" variant="outline-light">
                  <Link to="/contact?brochure=true">
                    <Download className="h-5 w-5 mr-2" />
                    Download Brochure
                  </Link>
                </Button>
              </div>
            </div>

            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center p-8">
              <img 
                src={extinguishersGroup} 
                alt="Thermal Stop™ and Thermal Shield™ Extinguisher Range" 
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
              <h2 className="text-3xl font-heading font-bold mb-6 text-primary">What is Thermal Stop™?</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Thermal Stop™ is your go-to solution for extinguishing lithium-ion battery fires caused by thermal runaway. As the only suppressant on the market specifically designed to eliminate thermal runaway, Thermal Stop™ sets a new standard in fire safety.
                </p>
                <p>
                  This all-natural, non-hazardous solution operates in three powerful ways: its superior endothermic properties provide super-fast cooling, effectively halting thermal runaway within just 30 seconds. By interrupting the chemical reactions within the battery, Thermal Stop™ blocks dangerous off-gassing and encapsulates harmful PFAS chemicals found in some lithium-ion batteries.
                </p>
                <p>
                  Designed for efficiency, Thermal Stop™ requires only a small amount to tackle large fires, making cleanup a breeze. With its patent-pending formulation, you can trust Thermal Stop™ to deliver exceptional performance when it matters most.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold mb-6 text-primary">Key Features</h3>
              <div className="grid gap-3">
                {[
                  "Rapidly encapsulates toxic offgas, smoke, fumes and vapors",
                  "Saves large amounts of water resources",
                  "Long-term shelf life and storage",
                  "Scalable use from small batteries to industrial energy storage",
                  "All natural plant-based formula",
                  "Non-toxic and biodegradable",
                  "Fluorine-free (non-carcinogenic)",
                  "Non-corrosive",
                  "Safe for humans, animals and aquatic life",
                  "Seamless use from fire pumps to aircraft",
                  "Non-clogging and non-staining",
                  "DOT Non-Hazardous material for easy shipping",
                  "NO PFAS or PFOS",
                  "Extremely Endothermic",
                  "Instant heat removal from lithium-ion thermal runaway",
                  "Prevents the reoccurrence of thermal runaway for towing and storage"
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
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary">How Thermal Stop™ Works</h2>
            <p className="text-xl text-foreground/70">Three-Part Suppression System</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">1. Suppresses</h3>
                <p className="text-foreground/70">
                  Rapidly extinguishes the fire as well as blocks dangerous off-gassing and encapsulates harmful PFAS chemicals found in some lithium-ion batteries.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Snowflake className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">2. Cools</h3>
                <p className="text-foreground/70">
                  Superior endothermic properties provide super-fast cooling within just 30 seconds.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">3. Stops</h3>
                <p className="text-foreground/70">
                  Effectively halts thermal runaway. Neutralizes the chemical reaction within the electrolyte solution and forms a porous barrier, condensing toxic gases.
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
                  <p className="text-sm text-foreground/60 mb-4">Click on each size to view product image</p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="2ltr">
                      <AccordionTrigger className="text-foreground/80 hover:text-primary">
                        2 Liter
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-center py-4">
                          <img src={thermalStop2ltr} alt="Thermal Stop™ 2 Liter" className="h-64 w-auto object-contain" />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="6ltr">
                      <AccordionTrigger className="text-foreground/80 hover:text-primary">
                        6 Liter
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-center py-4">
                          <img src={thermalStop6ltr} alt="Thermal Stop™ 6 Liter" className="h-64 w-auto object-contain" />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="9ltr">
                      <AccordionTrigger className="text-foreground/80 hover:text-primary">
                        9 Liter
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-center py-4">
                          <img src={thermalStop9ltr} alt="Thermal Stop™ 9 Liter" className="h-64 w-auto object-contain" />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="5gal">
                      <AccordionTrigger className="text-foreground/80 hover:text-primary">
                        5 Gallon
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-center py-4">
                          <img src={thermalStop5gal} alt="Thermal Stop™ 5 Gallon" className="h-64 w-auto object-contain" />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="55gal">
                      <AccordionTrigger className="text-foreground/80 hover:text-primary">
                        55 Gallon
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-center py-4">
                          <img src={thermalStop55gal} alt="Thermal Stop™ 55 Gallon" className="h-64 w-auto object-contain" />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <h3 className="text-xl font-heading font-bold mt-6 mb-4 text-primary">Specifications</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li>• Extended shelf life (5+ years) with proper storage</li>
                    <li>• 3% dilution ratio (3 parts foam / 97 parts water)</li>
                    <li>• Store in cool, dry location away from direct sunlight</li>
                    <li>• Compatible with standard firefighting equipment</li>
                    <li>• Storage temperature: Minimum -40°F, Maximum 120°F</li>
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
                      <h4 className="font-semibold mb-2">Safety Data Sheet (SDS)</h4>
                      <p>Complete safety documentation available for download.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">DOT Compliance</h4>
                      <p>Non-hazardous material classification for simplified shipping and transport.</p>
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
                    <li>• EV and hybrid vehicle fires</li>
                    <li>• E-bike and e-scooter fires</li>
                    <li>• Consumer electronics (phones, laptops, power tools)</li>
                    <li>• Industrial battery energy storage systems (BESS)</li>
                    <li>• Aviation incidents</li>
                    <li>• Marine vessel fires</li>
                    <li>• First responder suppression</li>
                    <li>• Facility emergency response</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Q&A Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center text-primary">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">
                  Q: How do you get Thermal Stop™ into the batteries?
                </h3>
                <p className="text-foreground/80">
                  Responding fire departments typically arrive on scene within 5-8 minutes. By that time, the battery has often burned through the floorboard. Handle the situation as a normal vehicle fire—suppress the flames, and once knocked down, inject Thermal Stop™'s patented plant-based solution into the burned area. Less than 5 gallons of Thermal Stop™ has been proven to stop EV thermal runaway.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">
                  Q: How can we handle runoff after contact with hazardous materials?
                </h3>
                <p className="text-foreground/80">
                  Thermal Stop™'s efficiency means that typically 5 gallons or less is needed to handle EV thermal runaway events. Standard absorbents carried on fire apparatus will be more than enough for cleanup.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">
                  Q: Can Thermal Stop™ be used in engine AB tanks?
                </h3>
                <p className="text-foreground/80">
                  Absolutely. As EVs become more common and regulations phase out internal combustion vehicles, fire departments may want to designate or add a "C" tank for Thermal Stop™. It can also be used in your existing A or B tanks as EV demographics shift across the U.S.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center text-primary">Complete Your Fire Safety Solution</h2>
          
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Shield className="h-12 w-12 text-accent flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-2xl font-heading font-bold mb-2 text-primary">Thermal Shield™</h3>
                  <p className="text-foreground/70 mb-4">
                    Revolutionary gel solution for battery fire containment and transport. Provides thermal shielding for storage and safe handling of damaged batteries.
                  </p>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link to="/products/thermal-shield">Learn More About Thermal Shield™</Link>
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
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Order Thermal Stop™?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Contact us today to request a quote or schedule a product demonstration
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

export default ThermalStop;
