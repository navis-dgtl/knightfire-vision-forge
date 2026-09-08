import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { BadgeCheck, Box, ChevronRight } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import thermalBoxMain from "@/assets/thermal-box-main.webp";
import thermalBoxOpen from "@/assets/thermal-box-open.webp";
import thermalBoxBack from "@/assets/thermal-box-back.webp";
import thermalBoxLid from "@/assets/thermal-box-lid.webp";

const boxGallery = [
  { src: thermalBoxMain, alt: "KnightTek™ Lithium-Ion Thermal Runaway Box with Thermal Stop™ extinguisher" },
  { src: thermalBoxOpen, alt: "Thermal Runaway Box open with contents and Thermal Stop™ extinguisher" },
  { src: thermalBoxBack, alt: "Thermal Runaway Box end view with safety warning label" },
  { src: thermalBoxLid, alt: "Thermal Stop™ extinguisher mounted on Thermal Runaway Box lid" },
];

const ThermalRunawayBox = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Thermal Runaway Box™ | Lithium-Ion Battery Containment System"
        description="A portable, fire-rated containment and suppression kit for small lithium-ion batteries. Includes a Thermal Stop™ pouch, gloves, and a 2-liter extinguisher."
        canonical="/products/thermal-runaway-box"
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "KnightTek™ Lithium-Ion Thermal Runaway Box",
          description:
            "Portable, fire-rated containment unit with integrated suppression for small lithium-ion batteries.",
          brand: { "@type": "Brand", name: "KnightTek" },
          category: "Fire Suppression Equipment",
          url: "https://ktekglobal.com/products/thermal-runaway-box",
        }}
      />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm mb-6 text-primary-foreground/80">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/products" className="hover:text-accent">Products</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Thermal Runaway Box™</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <Box className="h-8 w-8 text-accent" />
                <h1 className="text-4xl md:text-5xl font-heading font-bold">Thermal Runaway Box™</h1>
              </div>
              <p className="text-xl mb-2 text-primary-foreground/90">
                Portable Lithium-Ion Containment &amp; Suppression Kit
              </p>
              <p className="text-lg mb-6 text-accent font-semibold">
                Rapid Containment. Immediate Suppression. Proactive Protection.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">Patent Pending</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-accent" />
                  <span className="text-sm font-semibold">No Special Training Required</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact">Request Quote</Link>
                </Button>
              </div>
            </div>

            <ProductGallery images={boxGallery} />
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6 text-primary">
                What is the Thermal Runaway Box™?
              </h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  The KnightTek™ Lithium-Ion Thermal Runaway Box is a portable, fire-rated containment unit designed for
                  small lithium-ion batteries — laptops, phones, power tools, e-bike packs, medical devices, and more.
                </p>
                <p>
                  It works in two modes. Before a battery ignites, a swelling or overheating device can be placed inside
                  the box for safe isolation. After ignition, the integrated Thermal Stop™ suppression pouch and the
                  included 2-liter extinguisher work together to knock down the fire and hold the event inside the unit.
                </p>
                <p>
                  Everything needed is in the kit, with clear instructional labeling so any staff member can act
                  immediately. No special training is required.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-heading font-bold mb-6 text-primary">Key Features</h3>
              <div className="grid gap-3">
                {[
                  "Fire-rated portable containment box",
                  "Integrated Thermal Stop™ suppression pouch",
                  "Two modes: pre-runaway isolation and post-ignition suppression",
                  "Fire-protective gloves included",
                  "2-liter Thermal Stop™ extinguisher included",
                  "Clear instructional labeling on the unit",
                  "Compact footprint for hallways, labs, and storage rooms",
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

          <Tabs defaultValue="kit" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="kit">Kit Contents</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            <TabsContent value="kit" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-4 text-primary">What's In the Box</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li>• Fire-rated containment box with secure lid</li>
                    <li>• Integrated Thermal Stop™ suppression pouch</li>
                    <li>• Fire-protective gloves</li>
                    <li>• 2-liter Thermal Stop™ extinguisher</li>
                    <li>• Instructional labeling and quick-use guide</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-4 text-primary">Specifications</h3>
                  <div className="space-y-4 text-foreground/80">
                    <div>
                      <h4 className="font-semibold mb-2">Dimensions</h4>
                      <p>18" × 10" × 15"</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Status</h4>
                      <p>Patent pending.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Suppression Agent</h4>
                      <p>Thermal Stop™ — NFPA 18 certified, EPA Safer Choice listed, PFAS- and PFOS-free.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Training</h4>
                      <p>No special training required. Training materials available on request.</p>
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
                    <li>• Hospitals and medical facilities</li>
                    <li>• Schools and universities</li>
                    <li>• Offices and coworking spaces</li>
                    <li>• Hotels and hospitality</li>
                    <li>• Commercial and industrial facilities</li>
                    <li>• Device repair and charging stations</li>
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
              <Link to="/products/fire-quit">Fire Quit™</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/products/elixir-5">Elixir 5™</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary to-accent/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary-foreground">
            Ready to Protect Your Facility?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Talk with our team about deploying the Thermal Runaway Box™ across your locations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <Link to="/contact">Request a Consultation</Link>
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

export default ThermalRunawayBox;
