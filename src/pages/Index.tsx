import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Flame, Leaf, Gauge, Users, Award, BadgeCheck, Droplet, Zap, Wrench } from "lucide-react";
import extinguishersGroup from "@/assets/extinguishers-group.png";
import thermalShieldProduct from "@/assets/thermal-shield-new.jpg";
import customSolutionsImg from "@/assets/custom-solutions.jpg";
import evFireImg from "@/assets/ev-fire-demo.jpg";
import publicSafetyImg from "@/assets/fire-department-team.jpg";
import maritimeImg from "@/assets/maritime-port.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Carousel */}
      <section className="pt-20 lg:pt-28">
        <HeroCarousel />
      </section>

      {/* Introduction / Value Proposition */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-primary">
                Protecting Lives with Advanced Fire Suppression Technology
              </h2>
              <p className="text-lg mb-4 text-foreground/80">
                KnightTek is the exclusive global distributor of Thermal Stop and Thermal Shield, revolutionary
                lithium-ion battery fire suppression solutions developed through 7+ years of dedicated research and
                development.
              </p>
              <p className="text-lg mb-4 text-foreground/80">
                Our products are specifically designed—not repurposed—to combat lithium-ion battery thermal runaway
                fires with a 100% success rate across all battery chemistries.
              </p>
              <p className="text-lg mb-6 text-foreground/80">
                With NFPA 18 certification and EPA Safer Choice listing, we provide the most advanced, environmentally
                responsible fire suppression solutions for first responders and industry professionals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/products/thermal-stop">Explore Our Products</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/about">Learn About Us</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/4HARY7Go9Js?si=gZrVEIHqOQ_dAvks"
                title="KnightTek Product Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Our Solutions</h2>
            <p className="text-xl text-primary-foreground/90">Purpose-Built for Lithium-Ion Battery Fires</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Thermal Stop Card */}
            <Card className="bg-card border-0 overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="aspect-square bg-muted flex items-center justify-center p-8">
                <img
                  src={extinguishersGroup}
                  alt="Thermal Stop and Thermal Shield Extinguisher Range"
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-6 w-6 text-accent" />
                  <h3 className="text-2xl font-heading font-bold text-primary">Thermal Stop</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 font-semibold">Extinguishing Agent</p>
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
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/products/thermal-stop">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Thermal Shield Card */}
            <Card className="bg-card border-0 overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="aspect-square bg-muted flex items-center justify-center p-8">
                <img
                  src={thermalShieldProduct}
                  alt="Thermal Shield Containment Solution"
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                  <h3 className="text-2xl font-heading font-bold text-primary">Thermal Shield</h3>
                </div>
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
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/products/thermal-shield">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Custom Engineered Solutions Card */}
            <Card className="bg-card border-0 overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="aspect-square bg-muted flex items-center justify-center p-8">
                <img
                  src={customSolutionsImg}
                  alt="Custom Engineered Fire Suppression Solutions"
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Wrench className="h-6 w-6 text-accent" />
                  <h3 className="text-2xl font-heading font-bold text-primary">Custom Engineered Solutions</h3>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Custom-engineered fire suppression apparatus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Tailored delivery systems for exact specifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Full R&D for your specific project</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">On-site assessment and consultation</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact">Contact Our Team</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline-light">
              <Link to="/products/comparison">Compare Our Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm text-primary font-semibold mb-2 uppercase tracking-wide">Why Choose KnightTek</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">The KnightTek Difference</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplet className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">Purpose-Built Technology</h3>
                <p className="text-foreground/80">
                  7+ years of R&D creating solutions specifically for lithium-ion battery fires—not repurposed products.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">Proven Performance</h3>
                <p className="text-foreground/80">
                  100% success rate across hundreds of tests with all battery chemistries. NFPA 18 certified.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">Environmentally Responsible</h3>
                <p className="text-foreground/80">
                  EPA Safer Choice listed. PFAS and PFOS free. All-natural, plant-based formula.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gauge className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">Maximum Efficiency</h3>
                <p className="text-foreground/80">
                  Stopped EV fires with as little as 1.5 gallons—saving costs and response time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">Dual Function</h3>
                <p className="text-foreground/80">
                  Not only extinguishes fires but provides thermal shielding for storage and transport.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">Made by Firefighters</h3>
                <p className="text-foreground/80">
                  Created by first responders who understand the real-world demands of fire suppression.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary">Industries We Serve</h2>
            <p className="text-xl text-foreground/70">Trusted by professionals across critical sectors</p>
            <Link to="/industries" className="text-accent font-semibold hover:underline inline-flex items-center gap-1">
              View All Industries →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Link
              to="/industries"
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow aspect-[4/3]"
            >
              <img
                src={maritimeImg}
                alt="Maritime Imports Fire Solutions"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-primary-foreground">
                <div className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded w-fit mb-2">
                  #1
                </div>
                <h3 className="text-2xl font-heading font-bold mb-2">Maritime</h3>
                <p className="mb-4">Critical protection for port operations and shipping</p>
                <span className="text-accent font-semibold group-hover:underline">Learn More →</span>
              </div>
            </Link>

            <Link
              to="/industries"
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow aspect-[4/3]"
            >
              <img
                src={publicSafetyImg}
                alt="Public Safety - Fire & Police"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-primary-foreground">
                <div className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded w-fit mb-2">
                  #2
                </div>
                <h3 className="text-2xl font-heading font-bold mb-2">Public Safety</h3>
                <p className="mb-4">Fire departments & law enforcement agencies</p>
                <span className="text-accent font-semibold group-hover:underline">Learn More →</span>
              </div>
            </Link>

            <Link
              to="/industries"
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow aspect-[4/3]"
            >
              <img
                src={evFireImg}
                alt="EV & Mobility Fire Safety"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-primary-foreground">
                <div className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded w-fit mb-2">
                  #3
                </div>
                <h3 className="text-2xl font-heading font-bold mb-2">EV & Mobility</h3>
                <p className="mb-4">Advanced solutions for electric vehicle safety</p>
                <span className="text-accent font-semibold group-hover:underline">Learn More →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
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
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
          <p className="mt-6 text-primary-foreground/90">
            Or call us at{" "}
            <a href="tel:1-833-466-5835" className="text-accent font-semibold hover:underline">
              1-833-ion-ktek
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
