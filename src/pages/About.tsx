import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import stephenKnight from "@/assets/stephen-knight.jpg";
import mattHill from "@/assets/matt-hill.avif";

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

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-heading font-bold mb-12 text-center text-primary">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <img 
                  src={stephenKnight} 
                  alt="Stephen Knight" 
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-heading font-bold mb-2 text-primary">Stephen Knight</h3>
                <p className="text-sm text-muted-foreground mb-3">Founder & CEO</p>
                <p className="text-sm text-foreground/80">
                  Stephen is the founder and CEO of KnightTek, LLC - has over 30 years of experience in fire fighting within the oil and gas industry. As an engineer Stephen has designed and implemented many unique innovative solutions and holds many product patents of his designs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <img 
                  src={mattHill} 
                  alt="Matt Hill" 
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-heading font-bold mb-2 text-primary">Matt Hill</h3>
                <p className="text-sm text-muted-foreground mb-3">Vice President</p>
                <p className="text-sm text-foreground/80">
                  Matt Hill serves as Vice President of KnightTek, bringing two decades of extensive experience in the Oil and Gas industry. As a recognized Safety Leader, Matt holds board positions with prestigious organizations including AADE, SPE, IADC, Oilfield Christian Fellowship, and API. He is a dynamic entrepreneur and sought-after speaker who hosts a popular industry podcast while leading business development initiatives. His expertise spans automation, research, and technology innovation, and he is passionate about energy advocacy and event planning that brings the industry together.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-muted-foreground">?</span>
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 text-primary">Miranda</h3>
                <p className="text-sm text-muted-foreground mb-3">Team Member</p>
                <p className="text-sm text-foreground/80">
                  More information coming soon.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-muted-foreground">?</span>
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 text-primary">Brandon Alvarez</h3>
                <p className="text-sm text-muted-foreground mb-3">Team Member</p>
                <p className="text-sm text-foreground/80">
                  More information coming soon.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-muted-foreground">?</span>
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 text-primary">Simon</h3>
                <p className="text-sm text-muted-foreground mb-3">International Team</p>
                <p className="text-sm text-foreground/80">
                  More information coming soon.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-muted-foreground">?</span>
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 text-primary">Alistair Newton</h3>
                <p className="text-sm text-muted-foreground mb-3">International Team</p>
                <p className="text-sm text-foreground/80">
                  Coming soon.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
