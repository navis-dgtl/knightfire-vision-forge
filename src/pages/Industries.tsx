import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Ship, 
  ShieldAlert, 
  Car, 
  BatteryCharging, 
  Plane, 
  TrainFront, 
  TruckIcon,
  Factory,
  BadgeCheck
} from "lucide-react";
import evFireImg from "@/assets/ev-fire-demo.jpg";
import publicSafetyImg from "@/assets/fire-department-team.jpg";
import policeImg from "@/assets/police-officer-demo.jpg";

const Industries = () => {
  const industries = [
    {
      id: 1,
      rank: "#1",
      icon: Ship,
      title: "Maritime Imports",
      description: "Critical fire protection solutions for port operations, shipping containers, and cargo handling. Specialized systems designed for the unique challenges of maritime battery transport and storage.",
      features: [
        "Port facility protection",
        "Cargo container fire suppression",
        "Lithium battery shipment safety",
        "Compliance with maritime regulations"
      ],
      image: evFireImg
    },
    {
      id: 2,
      rank: "#2",
      icon: ShieldAlert,
      title: "Public Safety",
      description: "Comprehensive solutions for fire departments and law enforcement agencies. Purpose-built equipment to protect first responders facing lithium-ion battery fire emergencies.",
      features: [
        "Fire department response equipment",
        "Law enforcement vehicle protection",
        "Training and support programs",
        "Rapid deployment systems"
      ],
      image: publicSafetyImg
    },
    {
      id: 3,
      rank: "#3",
      icon: Car,
      title: "EV & Mobility",
      description: "Advanced fire suppression for electric vehicles, e-bikes, and personal mobility devices. Proven effectiveness across all battery chemistries with minimal agent usage.",
      features: [
        "Electric vehicle fire suppression",
        "E-bike and scooter protection",
        "Dealership and service center safety",
        "Transportation and storage solutions"
      ],
      image: policeImg
    },
    {
      id: 4,
      rank: "#4",
      icon: BatteryCharging,
      title: "BESS - Battery Energy Storage Systems",
      description: "Specialized protection for large-scale battery energy storage installations. Safeguarding critical infrastructure and preventing catastrophic energy storage failures.",
      features: [
        "Grid-scale battery protection",
        "Energy storage facility safety",
        "Thermal runaway prevention",
        "24/7 monitoring compatibility"
      ]
    },
    {
      id: 5,
      rank: "#5",
      icon: Plane,
      title: "Aviation",
      description: "Flight-safe fire suppression solutions for aircraft and airport operations. Meeting stringent aviation safety standards while protecting passengers, crew, and aircraft.",
      features: [
        "Aircraft battery fire protection",
        "Airport cargo facility safety",
        "Passenger device incident response",
        "Aviation authority certified"
      ]
    },
    {
      id: 6,
      rank: "#6",
      icon: TrainFront,
      title: "Rail",
      description: "Comprehensive fire safety for rail transportation including passenger trains, freight operations, and maintenance facilities. Protection for the growing use of battery-powered rail systems.",
      features: [
        "Passenger train safety systems",
        "Freight cargo protection",
        "Rail yard and depot safety",
        "Battery-electric locomotive protection"
      ]
    },
    {
      id: 7,
      rank: "#7",
      icon: TruckIcon,
      title: "Towing & Recovery",
      description: "Essential safety equipment for tow operators and recovery services handling disabled electric vehicles and lithium battery incidents. Protect your crew and equipment.",
      features: [
        "EV towing safety equipment",
        "Recovery vehicle protection",
        "Storage yard fire prevention",
        "Operator training support"
      ]
    },
    {
      id: 8,
      rank: "#8",
      icon: Factory,
      title: "Industrial & Commercial",
      description: "Broad-spectrum protection for manufacturing, warehousing, and commercial facilities. Comprehensive solutions for any operation utilizing lithium-ion battery technology.",
      features: [
        "Manufacturing facility protection",
        "Warehouse and distribution safety",
        "Commercial building systems",
        "Custom industrial solutions"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-foreground">
              Industries We Serve
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Trusted by professionals across critical sectors worldwide
            </p>
            <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto">
              From maritime operations to emergency services, our purpose-built lithium-ion battery fire suppression solutions protect lives and assets across diverse industries.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {industries.map((industry) => {
              const IconComponent = industry.icon;
              return (
                <Card key={industry.id} className="border-2 hover:border-accent hover:shadow-2xl transition-all duration-300">
                  {industry.image && (
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={industry.image} 
                        alt={industry.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm font-bold px-3 py-1 rounded">
                        {industry.rank}
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        {!industry.image && (
                          <div className="text-sm font-bold text-accent mb-1">{industry.rank}</div>
                        )}
                        <h3 className="text-2xl font-heading font-bold text-primary">{industry.title}</h3>
                      </div>
                    </div>
                    <p className="text-foreground/80 mb-4">
                      {industry.description}
                    </p>
                    <div className="space-y-2">
                      {industry.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <BadgeCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground/70">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-primary to-accent/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary-foreground">
            Ready to Protect Your Industry?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Contact us today to learn how our solutions can be tailored to your specific industry needs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <Link to="/contact">Request a Consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline-light">
              <Link to="/products/thermal-stop">View Our Products</Link>
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

export default Industries;
