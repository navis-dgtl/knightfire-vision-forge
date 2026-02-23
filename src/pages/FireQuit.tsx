import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { BadgeCheck, Flame, ChevronRight } from "lucide-react";
import firequitImg from "@/assets/firequit.png";

const FireQuit = () => {
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
            <span>Fire Quit™</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <Flame className="h-8 w-8 text-accent" />
                <h1 className="text-4xl md:text-5xl font-heading font-bold">Fire Quit™</h1>
              </div>
              <p className="text-xl mb-2 text-primary-foreground/90">Advanced Wetting Agent — Class A, B, D, and K Fires</p>
              <p className="text-lg mb-6 text-accent font-semibold">Efficient, Effective Firefighting.</p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">NFPA 18 Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">PFAS-Free</span>
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
                src={firequitImg} 
                alt="Fire Quit™ Wetting Agent" 
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
              <h2 className="text-3xl font-heading font-bold mb-6 text-primary">What is Fire Quit™?</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Fire Quit™ is a cutting-edge wetting agent designed to tackle Class A, B, D, and K fires. By reducing water's surface tension, Fire Quit™ allows water to spread and penetrate deeply into wood, vegetation, and other combustible surfaces.
                </p>
                <p>
                  Fire Quit™ enhances water's ability to wet and coat surfaces, significantly improving the effectiveness of firefighting operations in wildland firefighting and structural fire suppression. It stands alone as a solution that does not require combination with other firefighting chemicals to maximize effectiveness.
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
                  "Tackles Class A, B, D, and K fires",
                  "Reduces water surface tension for deeper penetration",
                  "Wildland firefighting applications",
                  "Structural fire suppression",
                  "No additional chemicals required",
                  "Superior cooling and fire suppression",
                  "Improved fuel saturation and coating",
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
                      <h4 className="font-semibold mb-2">NFPA 18 Certification</h4>
                      <p>Third-party certified to meet NFPA 18 standards.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">PFAS-Free</h4>
                      <p>Third-party tested and verified PFAS-free.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Patented Technology</h4>
                      <p>Patented formulation developed and owned by Redline Fire Solutions.</p>
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
                    <li>• Wildland firefighting</li>
                    <li>• Structural fire suppression</li>
                    <li>• Class A combustible materials</li>
                    <li>• Class B flammable liquids</li>
                    <li>• Class D combustible metals</li>
                    <li>• Class K cooking fires</li>
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
              <Link to="/products/suppressit">Suppressit™</Link>
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
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Upgrade Your Firefighting?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Contact us today to learn how Fire Quit™ can enhance your suppression operations.
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

export default FireQuit;