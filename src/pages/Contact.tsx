import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Download, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isBrochureRequest, setIsBrochureRequest] = useState(false);

  useEffect(() => {
    if (searchParams.get('brochure') === 'true') {
      setIsBrochureRequest(true);
    }
  }, [searchParams]);

  const handleBrochureSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Thank you!",
      description: "Your brochure download will begin shortly.",
    });
    // Download the brochure
    window.open('/brochures/thermal-stop-thermal-shield-brochure.pdf', '_blank');
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="pt-32 pb-16 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            {isBrochureRequest ? "Download Product Brochure" : "Contact KnightTek"}
          </h1>
          <p className="text-xl text-primary-foreground/90">
            {isBrochureRequest ? "Fill out the form below to receive your brochure" : "We're here to help you protect lives"}
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-bold mb-2 text-primary">Call Us</h3>
                <a href="tel:1-833-466-5835" className="text-lg text-primary hover:text-accent hover:underline">1-833-ion-ktek</a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-bold mb-2 text-primary">Email Us</h3>
                <a href="mailto:info@ktekglobal.com" className="text-lg text-primary hover:text-accent hover:underline break-all">info@ktekglobal.com</a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-bold mb-2 text-primary">Business Hours</h3>
                <p className="text-primary/80">Mon-Fri: 8AM-5PM CST</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              {isBrochureRequest ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Download className="h-8 w-8 text-accent" />
                    <h2 className="text-2xl font-heading font-bold text-primary">Request Your Product Brochure</h2>
                  </div>
                  <p className="text-foreground/70 mb-6">
                    Please provide your information below and we'll send you the Thermal Stop & Thermal Shield product brochure immediately.
                  </p>
                  <form onSubmit={handleBrochureSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input placeholder="First Name *" required />
                      <Input placeholder="Last Name *" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input type="email" placeholder="Email *" required />
                      <Input type="tel" placeholder="Phone *" required />
                    </div>
                    <Input placeholder="Company Name *" required />
                    <Input placeholder="Job Title" />
                    <Textarea placeholder="How do you plan to use our products? (optional)" rows={4} />
                    <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <Download className="h-5 w-5 mr-2" />
                      Download Brochure
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-heading font-bold mb-6 text-primary">Send Us a Message</h2>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input placeholder="First Name *" required />
                      <Input placeholder="Last Name *" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input type="email" placeholder="Email *" required />
                      <Input type="tel" placeholder="Phone *" required />
                    </div>
                    <Input placeholder="Company Name" />
                    <Textarea placeholder="Message *" rows={6} required />
                    <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      Send Message
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
