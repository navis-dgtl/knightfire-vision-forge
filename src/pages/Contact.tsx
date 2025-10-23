import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Mail, Download, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isBrochureRequest, setIsBrochureRequest] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (searchParams.get("brochure") === "true") {
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
    window.open("/brochures/thermal-stop-thermal-shield-brochure.pdf", "_blank");
  };

  const handleCheckboxChange = (product: string, checked: boolean) => {
    setSelectedProducts((prev) => (checked ? [...prev, product] : prev.filter((p) => p !== product)));
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
            {isBrochureRequest
              ? "Fill out the form below to receive your brochure"
              : "We're here to help you protect lives"}
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
                <a href="tel:1-833-466-5835" className="text-lg text-primary hover:text-accent hover:underline">
                  1-833-ion-ktek
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-heading font-bold mb-2 text-primary">Email Us</h3>
                <a
                  href="mailto:info@ktekglobal.com"
                  className="text-lg text-primary hover:text-accent hover:underline break-all"
                >
                  info@ktekglobal.com
                </a>
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
            <CardContent className="p-4 md:p-8">
              {isBrochureRequest ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Download className="h-8 w-8 text-accent" />
                    <h2 className="text-2xl font-heading font-bold text-primary">Request Your Product Brochure</h2>
                  </div>
                  <p className="text-foreground/70 mb-6">
                    Please provide your information below and we'll send you the Thermal Stop & Thermal Shield product
                    brochure immediately.
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
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Brochure
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-heading font-bold mb-6 text-primary">Send Us a Message</h2>
                  <form action="https://formspree.io/f/xwprgeno" method="POST" className="space-y-6">
                    {/* First & Last Name */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block font-heading font-medium text-sm text-foreground" htmlFor="firstName">
                          First Name <span className="text-destructive">*</span>
                        </label>
                        <Input id="firstName" name="firstName" type="text" required />
                      </div>

                      <div className="space-y-2">
                        <label className="block font-heading font-medium text-sm text-foreground" htmlFor="lastName">
                          Last Name <span className="text-destructive">*</span>
                        </label>
                        <Input id="lastName" name="lastName" type="text" required />
                      </div>
                    </div>

                    {/* Email and Phone */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block font-heading font-medium text-sm text-foreground" htmlFor="email">
                          Email <span className="text-destructive">*</span>
                        </label>
                        <Input id="email" name="email" type="email" required />
                      </div>

                      <div className="space-y-2">
                        <label className="block font-heading font-medium text-sm text-foreground" htmlFor="phone">
                          Phone Number <span className="text-destructive">*</span>
                        </label>
                        <Input id="phone" name="phone" type="tel" required />
                      </div>
                    </div>

                    {/* Company (Optional) */}
                    <div className="space-y-2">
                      <label className="block font-heading font-medium text-sm text-foreground" htmlFor="company">
                        Company
                      </label>
                      <Input id="company" name="company" type="text" />
                    </div>

                    {/* Product Interest Checkboxes */}
                    <div className="space-y-3">
                      <label className="block font-heading font-medium text-sm text-foreground">
                        What product(s) are you interested in? <span className="text-destructive">*</span>
                      </label>
                      <div className="space-y-3 pl-1">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="thermalShield"
                            name="products[]"
                            value="Thermal Shield"
                            onCheckedChange={(checked) => handleCheckboxChange("Thermal Shield", checked as boolean)}
                          />
                          <label
                            htmlFor="thermalShield"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Thermal Shield
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="thermalStop"
                            name="products[]"
                            value="Thermal Stop"
                            onCheckedChange={(checked) => handleCheckboxChange("Thermal Stop", checked as boolean)}
                          />
                          <label
                            htmlFor="thermalStop"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Thermal Stop
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="customSolution"
                            name="products[]"
                            value="Custom Engineered Solution"
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("Custom Engineered Solution", checked as boolean)
                            }
                          />
                          <label
                            htmlFor="customSolution"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Custom Engineered Solution
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="other"
                            name="products[]"
                            value="Other"
                            onCheckedChange={(checked) => handleCheckboxChange("Other", checked as boolean)}
                          />
                          <label
                            htmlFor="other"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Other
                          </label>
                        </div>
                      </div>
                      {/* Hidden input to submit selected products to Formspree */}
                      <input type="hidden" name="products" value={selectedProducts.join(", ")} />
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-2">
                      <label className="block font-heading font-medium text-sm text-foreground" htmlFor="details">
                        Any specific questions, details, or information you'd like to add for our team?
                      </label>
                      <Textarea id="details" name="details" rows={5} className="resize-y" />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
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
