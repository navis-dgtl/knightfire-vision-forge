import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import stephenKnight from "@/assets/stephen-knight.jpg";
import mattHill from "@/assets/matt-hill.avif";
import mirandaKnight from "@/assets/miranda-knight.png";
import brandonAlvarez from "@/assets/brandon-alvarez.jpg";

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
            KnightTek, LLC is the exclusive global distributor for Thermal Stop™ and Thermal Shield™. We are dedicated to providing the most advanced lithium-ion battery fire suppression solutions to first responders and industry professionals worldwide.
          </p>
          <p className="text-lg text-foreground/80 mb-8">
            With 7+ years of R&D, our products represent purpose-built technology specifically engineered for lithium-ion battery fires—proven effective across all battery chemistries.
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
                <p className="text-sm text-foreground/80 mb-3">
                  Stephen Knight, Founder and CEO of KnightTek, LLC, brings over 30 years of experience in the oil and gas industry as a petroleum engineer. After witnessing a near-catastrophic fire on a frac location, Stephen recognized the urgent need for improved fire suppression solutions to better protect lives and assets. This pivotal event inspired him to establish a company dedicated to developing advanced technologies for fire safety and prevention.
                </p>
                <p className="text-sm text-foreground/80">
                  Throughout his career, Stephen has engineered numerous innovative products and holds multiple patents for his designs. He continues to collaborate closely with industry partners and global insurance leaders, including Lloyd's of London, to advance fire protection standards across high-risk sectors.
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
                <p className="text-sm text-muted-foreground mb-3">VP of Business Development</p>
                <p className="text-sm text-foreground/80">
                  Matt serves as Vice President with over 20 years of experience in the Oil and Gas industry. As a Safety Leader and board member of AADE, SPE, IADC, Oilfield Christian Fellowship, and API, he is an entrepreneur, podcast host, and speaker specializing in business development, automation, research, and energy advocacy.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <img 
                  src={mirandaKnight} 
                  alt="Miranda Knight" 
                  className="w-32 h-32 rounded-full object-cover object-top mx-auto mb-4"
                />
                <h3 className="text-xl font-heading font-bold mb-2 text-primary">Miranda Knight</h3>
                <p className="text-sm text-muted-foreground mb-3">Client Engagement & Brand Development Director</p>
                <p className="text-sm text-foreground/80 mb-3">
                  With a diverse background spanning emergency response, healthcare, and business management, Miranda brings a unique blend of operational insight and strategic vision to the company.
                </p>
                <p className="text-sm text-foreground/80 mb-3">
                  As KnightTEK's Client Engagement & Brand Development Director, she leads initiatives that connect industries, partners, and clients with innovative fire-suppression solutions that protect lives, property, and the environment.
                </p>
                <p className="text-sm text-foreground/80">
                  Dynamic, results-driven, and deeply committed to safety through innovation, Miranda plays a key role in expanding KnightTEK's worldwide footprint and strengthening relationships with distributors, dealers, and global partners.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <img 
                  src={brandonAlvarez} 
                  alt="Brandon Alvarez" 
                  className="w-32 h-32 rounded-full object-cover object-top mx-auto mb-4"
                />
                <h3 className="text-xl font-heading font-bold mb-2 text-primary">Brandon Alvarez</h3>
                <p className="text-sm text-muted-foreground mb-3">Director of Innovative Sales Solutions</p>
                <p className="text-sm text-foreground/80">
                  Sales Professional with over 15 years of success driving revenue and leading strategic growth across diverse industries. Brandon is results-driven with deep expertise in navigating dynamic sales cycles, optimizing pipelines, and contributing to the expansion of early-stage and growth-phase companies. He is dedicated to KnightTek's North Star - our customers.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center text-primary">Advisory Board</h2>
          <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
            <CardContent className="p-12 text-center">
              <p className="text-xl text-foreground/70">Coming Soon</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
