import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="pt-32 pb-16 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">About KnightTek</h1>
          <p className="text-xl text-primary-foreground/90">Exclusive Global Distributor of Revolutionary Fire Suppression Technology</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-heading font-bold mb-6 text-primary">Our Mission</h2>
          <p className="text-lg text-foreground/80 mb-4">
            KnightTek, LLC is the exclusive global distributor for Redline Fire Solutions' Thermal Stop and Thermal Shield products. We are dedicated to providing the most advanced lithium-ion battery fire suppression solutions to first responders and industry professionals worldwide.
          </p>
          <p className="text-lg text-foreground/80 mb-8">
            With 7+ years of R&D, our products represent purpose-built technology specifically engineered for lithium-ion battery fires—achieving a 100% success rate across all battery chemistries.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/contact">Partner With Us</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
