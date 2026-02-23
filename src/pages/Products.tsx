import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Flame, BadgeCheck, ArrowRight, Droplets, Zap, Box, SprayCan } from "lucide-react";
import extinguishersGroup from "@/assets/extinguishers-group.png";
import thermalShieldProduct from "@/assets/thermal-shield-new.jpg";
import suppressitImg from "@/assets/suppressit.jpg";
import firequitImg from "@/assets/firequit.png";
import elixir5Img from "@/assets/elixir5.png";
import thermalBoxMain from "@/assets/thermal-box-main.png";
import thermalBoxOpen from "@/assets/thermal-box-open.png";
import thermalBoxBack from "@/assets/thermal-box-back.png";
import thermalBoxLid from "@/assets/thermal-box-lid.png";

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
              7+ years of development by Redline Fire Solutions, specifically designed for lithium-ion battery thermal runaway fire solutions. NFPA 18 certified. EPA Safer Choice listed. Additional certifications and testing are ongoing globally.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-8">
            {/* Thermal Stop Card */}
            <Card className="bg-card border-0 overflow-hidden hover:shadow-2xl transition-shadow group">
              <div className="aspect-square bg-muted flex items-center justify-center p-8">
                <img 
                  src={extinguishersGroup} 
                  alt="Thermal Stop™ and Thermal Shield™ Extinguisher Range" 
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-6 w-6 text-accent" />
                  <h3 className="text-2xl font-heading font-bold text-primary">Thermal Stop™</h3>
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
                  alt="Thermal Shield™ Containment Solution" 
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-6 w-6 text-accent" />
                  <h3 className="text-2xl font-heading font-bold text-primary">Thermal Shield™</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 font-semibold">Containment Gel</p>
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

            {/* Suppressit Card */}
            <Card className="bg-card border-0 overflow-hidden hover:shadow-2xl transition-shadow group">
              <div className="aspect-square bg-muted flex items-center justify-center p-8">
                <img 
                  src={suppressitImg} 
                  alt="Suppressit™ Non-Fluorinated Foam" 
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-6 w-6 text-accent" />
                  <h3 className="text-2xl font-heading font-bold text-primary">Suppressit™</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 font-semibold">Non-Fluorinated Foam</p>
                <p className="text-foreground/80 mb-6">
                  Expertly designed to replace AFFF, providing a low-viscosity, high-performance solution that seamlessly integrates into existing systems without changing proportioning plates. First-in-class self-healing ability ensures high safety standards during suppression and rescue operations.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Direct AFFF replacement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">NFPA 11 certified, meets UL 162 standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Third-party PFAS-free tested</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Works with existing proportioning systems</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 group-hover:shadow-lg transition-all">
                  <Link to="/products/suppressit" className="flex items-center justify-center gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Fire Quit Card */}
            <Card className="bg-card border-0 overflow-hidden hover:shadow-2xl transition-shadow group">
              <div className="aspect-square bg-muted flex items-center justify-center p-8">
                <img 
                  src={firequitImg} 
                  alt="Fire Quit™ Wetting Agent" 
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-6 w-6 text-accent" />
                  <h3 className="text-2xl font-heading font-bold text-primary">Fire Quit™</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 font-semibold">Wetting Agent</p>
                <p className="text-foreground/80 mb-6">
                  A cutting-edge wetting agent designed to tackle Class A, B, D, and K fires. Reduces water's surface tension to spread and penetrate deeply into wood, vegetation, and other combustible surfaces. Stands alone without requiring combination with other chemicals.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Class A, B, D, and K fires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">NFPA 18 third-party certified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Third-party PFAS-free tested</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">No additional chemicals required</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 group-hover:shadow-lg transition-all">
                  <Link to="/products/fire-quit" className="flex items-center justify-center gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Elixir 5 Card */}
            <Card className="bg-card border-0 overflow-hidden hover:shadow-2xl transition-shadow group">
              <div className="aspect-square bg-muted flex items-center justify-center p-8">
                <img 
                  src={elixir5Img} 
                  alt="Elixir 5™ Extinguisher Solution" 
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-6 w-6 text-accent" />
                  <h3 className="text-2xl font-heading font-bold text-primary">Elixir 5™</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 font-semibold">All-Class Wetting Agent — Extinguisher Refill Solution</p>
                <p className="text-foreground/80 mb-6">
                  An advanced wetting agent formulated for all fire classes including Class C electrical fires. Non-conductive for safety around electrical hazards. Pre-measured, ready-to-use extinguisher refill solution.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">All fire classes: A, B, C, D, and K</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">NFPA 18 third-party certified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Third-party PFAS-free tested</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Non-conductive, extinguisher ready</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 group-hover:shadow-lg transition-all">
                  <Link to="/products/elixir-5" className="flex items-center justify-center gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Redline attribution */}
          <p className="text-sm text-muted-foreground text-center max-w-7xl mx-auto mb-16 italic">
            Patented technology developed and owned by Redline Fire Solutions. Distributed by KnightTEK, Exclusive Global Distributor.
          </p>

          {/* Coming Soon Products */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
                Coming Soon
              </h2>
              <p className="text-lg text-foreground/70 mt-2">Our R&D Team Has Been Hard at Work</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Thermal Runaway Containment Box */}
              <Card className="border-2 border-dashed border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 relative overflow-hidden">
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <div className="p-4 bg-white">
                  <img src={thermalBoxMain} alt="KnightTek™ Lithium-Ion Thermal Runaway Box" className="w-full h-auto object-contain max-h-64 mx-auto" />
                </div>
                <div className="grid grid-cols-3 gap-1 px-4 pb-4 bg-white">
                  <img src={thermalBoxOpen} alt="Thermal Runaway Box open view" className="w-full h-20 object-contain bg-muted/20 rounded" />
                  <img src={thermalBoxBack} alt="Thermal Runaway Box back view" className="w-full h-20 object-contain bg-muted/20 rounded" />
                  <img src={thermalBoxLid} alt="Thermal Runaway Box lid detail" className="w-full h-20 object-contain bg-muted/20 rounded" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold text-primary mb-1">KnightTek™ Lithium-Ion Thermal Runaway Box</h3>
                  <p className="text-sm text-accent font-semibold mb-2">Patent Pending</p>
                  <p className="text-sm text-foreground/70 italic mb-3">Rapid Containment. Immediate Suppression. Proactive Protection.</p>
                  <p className="text-foreground/80 mb-4 text-sm">
                    A portable, fire-rated containment unit designed for small lithium-ion batteries. Works in two modes: pre-runaway intervention and post-ignition suppression. Ships with an integrated Thermal Stop™ suppression pouch, fire-rated containment box, fire-protective gloves, a 2-liter extinguisher, and clear instructional labeling. No special training required.
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">Dimensions: 18" × 10" × 15"</p>
                  <p className="text-xs text-muted-foreground mb-4">Target: Hospitals, schools, offices, hotels, and commercial facilities.</p>
                  <p className="text-sm font-semibold text-primary">Available to order soon.</p>
                </CardContent>
              </Card>

              {/* Personal Handheld Canister */}
              <Card className="border-2 border-dashed border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 relative overflow-hidden">
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <div className="aspect-video bg-muted/50 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <SprayCan className="h-16 w-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Product Image Coming Soon</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold text-primary mb-1">Thermal Stop™ Personal Canister</h3>
                  <p className="text-sm text-accent font-semibold mb-2">Patent Pending</p>
                  <p className="text-sm text-foreground/70 italic mb-3">Protection in the Palm of Your Hand.</p>
                  <p className="text-foreground/80 mb-4 text-sm">
                    A compact, portable fire suppression canister designed for personal use while traveling. Purpose-built for addressing lithium-ion thermal runaway events from small devices on aircraft and in transit. Carry-on friendly.
                  </p>
                  <p className="text-sm font-semibold text-primary">Available to order soon.</p>
                </CardContent>
              </Card>
            </div>
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
            Or call us at <a href="tel:1-833-466-5835" className="text-accent font-semibold hover:underline">1-833-ion-ktek</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;