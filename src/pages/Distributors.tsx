import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import {
  Ship,
  Plane,
  Battery,
  Car,
  Plug,
  Flame,
  Factory,
  Home,
  MapPin,
  TrendingUp,
  Wrench,
  Megaphone,
  Flag,
  Info,
  Phone,
} from "lucide-react";

const industries = [
  { icon: Ship, label: "Maritime Shipping" },
  { icon: Plane, label: "Aviation" },
  { icon: Battery, label: "BESS" },
  { icon: Car, label: "EV Fleets & Warehouses" },
  { icon: Plug, label: "Charging Infrastructure" },
  { icon: Flame, label: "Fire Departments" },
  { icon: Factory, label: "Industrial" },
  { icon: Home, label: "Residential & Consumer" },
];

const benefits = [
  {
    icon: MapPin,
    title: "Exclusive Territory Opportunities",
    description:
      "Secure regional distribution rights for scientifically advanced, IP-protected lithium-ion fire suppression solutions.",
  },
  {
    icon: TrendingUp,
    title: "Strong Margin Structure",
    description:
      "Premium, high-value products engineered for critical risk environments provide compelling profit potential.",
  },
  {
    icon: Wrench,
    title: "Technical & Engineering Support",
    description:
      "From custom apparatus builds to application-specific deployment strategies, our team supports you every step of the way.",
  },
  {
    icon: Megaphone,
    title: "Co-Branded Marketing & Lead Generation",
    description:
      "Professionally developed marketing assets, demonstrations, and strategic support to accelerate market penetration.",
  },
  {
    icon: Flag,
    title: "Manufactured in the USA",
    description:
      "Reliable supply chain, proven performance, and uncompromising quality standards.",
  },
];

const marketOptions = [
  "Maritime",
  "BESS",
  "EV/Fleet",
  "Fire Department",
  "Industrial",
  "Other",
];

const Distributors = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [usConfirmed, setUsConfirmed] = useState(false);
  const [usError, setUsError] = useState(false);

  const handleMarketChange = (market: string, checked: boolean) => {
    setSelectedMarkets((prev) =>
      checked ? [...prev, market] : prev.filter((m) => m !== market)
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!usConfirmed) {
      e.preventDefault();
      setUsError(true);
      return;
    }
    setUsError(false);
    // Formspree handles submission natively; show toast after redirect
    toast({
      title: "Thank you for your application!",
      description:
        "Our team will review your submission and contact you soon.",
    });
  };

  const scrollToForm = () => {
    document
      .getElementById("application-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* SECTION 1: Hero Banner */}
      <section className="pt-32 pb-16 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Become a KnightTek™ U.S. Distributor
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Partner with us to bring advanced lithium-ion fire suppression
            technology to your region.
          </p>
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            onClick={scrollToForm}
          >
            Apply Now
          </Button>
        </div>
      </section>

      {/* SECTION 2: Program Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6 text-primary">
                Why Partner with KnightTek™?
              </h2>
              <p className="text-foreground/80 mb-4">
                As demand for lithium-ion fire suppression accelerates across
                the United States, KnightTek is expanding our domestic
                distribution network. We are seeking ambitious, growth-driven
                partners to represent our proprietary fire mitigation
                technologies, Thermal Stop™ and Thermal Shield™.
              </p>
              <p className="text-foreground/80">
                Our solutions are non-toxic, PFAS-free, environmentally
                responsible, and purpose-built for lithium-ion battery fires
                across high-risk sectors.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
              {industries.map(({ icon: Icon, label }) => (
                <Card
                  key={label}
                  className="border-0 shadow-md text-center"
                >
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {label}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Distributor Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-primary">
            Distributor Benefits
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-heading font-bold mb-2 text-primary">
                    {title}
                  </h3>
                  <p className="text-sm text-foreground/70">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Application Form */}
      <section id="application-form" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-heading font-bold text-center mb-2 text-primary">
            U.S. Distributor Application
          </h2>
          <p className="text-center text-foreground/70 mb-8">
            Initial Qualification Form
          </p>

          {/* US-only disclaimer */}
          <div className="flex items-start gap-3 p-4 mb-8 rounded-lg bg-muted/50 border-l-4 border-primary">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground/80">
              KnightTek distributor partnerships are currently available within
              the United States only. International distribution opportunities
              are coming soon. Please check back for updates.
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 md:p-8">
              <form
                ref={formRef}
                action="https://formspree.io/f/xzdagako"
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <input
                  type="hidden"
                  name="_subject"
                  value="New U.S. Distributor Application"
                />
                <input
                  type="hidden"
                  name="markets"
                  value={selectedMarkets.join(", ")}
                />

                {/* US Confirmation Checkbox */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="usConfirm"
                      checked={usConfirmed}
                      onCheckedChange={(checked) => {
                        setUsConfirmed(checked as boolean);
                        if (checked) setUsError(false);
                      }}
                    />
                    <label
                      htmlFor="usConfirm"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      I confirm that my business is located in and operates
                      within the United States.{" "}
                      <span className="text-destructive">*</span>
                    </label>
                  </div>
                  {usError && (
                    <p className="text-destructive text-sm pl-7">
                      You must confirm your business operates in the United
                      States to submit this form.
                    </p>
                  )}
                </div>

                {/* Legal Business Name */}
                <div className="space-y-2">
                  <label
                    className="block font-heading font-medium text-sm text-foreground"
                    htmlFor="businessName"
                  >
                    Legal Business Name{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="businessName"
                    name="businessName"
                    required
                  />
                </div>

                {/* Business Address */}
                <div className="space-y-2">
                  <label
                    className="block font-heading font-medium text-sm text-foreground"
                    htmlFor="businessAddress"
                  >
                    Business Address{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="businessAddress"
                    name="businessAddress"
                    required
                  />
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label
                    className="block font-heading font-medium text-sm text-foreground"
                    htmlFor="website"
                  >
                    Website
                  </label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://"
                  />
                </div>

                {/* Main Business Phone */}
                <div className="space-y-2">
                  <label
                    className="block font-heading font-medium text-sm text-foreground"
                    htmlFor="businessPhone"
                  >
                    Main Business Phone{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="businessPhone"
                    name="businessPhone"
                    type="tel"
                    required
                  />
                </div>

                {/* Primary Contact Name & Title */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      className="block font-heading font-medium text-sm text-foreground"
                      htmlFor="contactName"
                    >
                      Primary Contact Name{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="contactName"
                      name="contactName"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="block font-heading font-medium text-sm text-foreground"
                      htmlFor="contactTitle"
                    >
                      Title{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="contactTitle"
                      name="contactTitle"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      className="block font-heading font-medium text-sm text-foreground"
                      htmlFor="contactPhone"
                    >
                      Phone <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="block font-heading font-medium text-sm text-foreground"
                      htmlFor="contactEmail"
                    >
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      required
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <label
                    className="block font-heading font-medium text-sm text-foreground"
                    htmlFor="linkedin"
                  >
                    LinkedIn Profile
                  </label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/"
                  />
                </div>

                {/* Year Established & Employees */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      className="block font-heading font-medium text-sm text-foreground"
                      htmlFor="yearEstablished"
                    >
                      Year Established{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="yearEstablished"
                      name="yearEstablished"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="block font-heading font-medium text-sm text-foreground"
                      htmlFor="employees"
                    >
                      Number of Employees{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="employees"
                      name="employees"
                      required
                    />
                  </div>
                </div>

                {/* Territory Covered */}
                <div className="space-y-2">
                  <label
                    className="block font-heading font-medium text-sm text-foreground"
                    htmlFor="territory"
                  >
                    Territory Covered{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="territory"
                    name="territory"
                    placeholder="States or regions you serve"
                    required
                  />
                </div>

                {/* Primary Markets Served */}
                <div className="space-y-3">
                  <label className="block font-heading font-medium text-sm text-foreground">
                    Primary Markets Served{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="space-y-3 pl-1">
                    {marketOptions.map((market) => (
                      <div
                        key={market}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={`market-${market}`}
                          name="markets[]"
                          value={market}
                          onCheckedChange={(checked) =>
                            handleMarketChange(market, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`market-${market}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {market}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Short Company Profile */}
                <div className="space-y-2">
                  <label
                    className="block font-heading font-medium text-sm text-foreground"
                    htmlFor="companyProfile"
                  >
                    Short Company Profile{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="companyProfile"
                    name="companyProfile"
                    placeholder="Brief company overview (3-5 sentences)"
                    rows={5}
                    className="resize-y"
                    required
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 5: Bottom CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Questions About Our Distribution Program?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Our team is ready to discuss partnership opportunities with you.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
          >
            <Link to="/contact">Contact Us</Link>
          </Button>
          <p className="mt-4 text-primary-foreground/80">
            Or call us at{" "}
            <a
              href="tel:1-833-466-5835"
              className="underline hover:text-accent transition-colors"
            >
              1-833-ion-ktek
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Distributors;
