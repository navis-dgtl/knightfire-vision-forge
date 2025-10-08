import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="pt-32 pb-16 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Contact KnightTek</h1>
          <p className="text-xl text-primary-foreground/90">We're here to help you protect lives</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-bold mb-2">Call Us</h3>
                <a href="tel:405-568-2742" className="text-lg text-accent hover:underline">405-568-2742</a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-bold mb-2">Email Us</h3>
                <a href="mailto:info@knightfiretek.com" className="text-lg text-accent hover:underline break-all">info@knightfiretek.com</a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="font-heading font-bold mb-2">Business Hours</h3>
                <p className="text-foreground/70">Mon-Fri: 8AM-5PM CST</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-heading font-bold mb-6 text-primary">Send Us a Message</h2>
              <form className="space-y-6">
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
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
