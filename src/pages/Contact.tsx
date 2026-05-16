import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Mail, Download, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyFormspree } from "@/lib/formspree";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(50),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  details: z.string().trim().max(5000).optional().or(z.literal("")),
  products: z.array(z.string()).max(20),
});

const brochureSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(50),
  company: z.string().trim().min(1, "Company is required").max(200),
  jobTitle: z.string().trim().max(150).optional().or(z.literal("")),
  intendedUse: z.string().trim().max(5000).optional().or(z.literal("")),
});

const initialContact = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  details: "",
};

const initialBrochure = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  jobTitle: "",
  intendedUse: "",
};

const Contact = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isBrochureRequest, setIsBrochureRequest] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [contactForm, setContactForm] = useState(initialContact);
  const [brochureForm, setBrochureForm] = useState(initialBrochure);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [brochureSubmitting, setBrochureSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get("brochure") === "true") {
      setIsBrochureRequest(true);
    }
  }, [searchParams]);

  const handleCheckboxChange = (product: string, checked: boolean) => {
    setSelectedProducts((prev) =>
      checked ? [...prev, product] : prev.filter((p) => p !== product),
    );
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse({ ...contactForm, products: selectedProducts });
    if (!parsed.success) {
      toast({
        title: "Please check the form",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setContactSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company || null,
      products: parsed.data.products,
      details: parsed.data.details || null,
    });
    setContactSubmitting(false);
    if (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or call us at 1-833-ion-ktek.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Message received",
      description: "Thanks for reaching out! Our team will be in touch soon.",
    });
    void notifyFormspree({
      _subject: `New contact request — ${parsed.data.firstName} ${parsed.data.lastName} (${parsed.data.company || "no company"})`,
      _replyto: parsed.data.email,
      formType: "Contact Request",
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company || "",
      products: parsed.data.products.join(", "),
      details: parsed.data.details || "",
    });
    setContactForm(initialContact);
    setSelectedProducts([]);
  };

  const handleBrochureSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = brochureSchema.safeParse(brochureForm);
    if (!parsed.success) {
      toast({
        title: "Please check the form",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setBrochureSubmitting(true);
    const { error } = await supabase.from("brochure_requests").insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      job_title: parsed.data.jobTitle || null,
      intended_use: parsed.data.intendedUse || null,
    });
    setBrochureSubmitting(false);
    if (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or call us at 1-833-ion-ktek.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Thank you!",
      description: "Your brochure download will begin shortly.",
    });
    void notifyFormspree({
      _subject: `Brochure request — ${parsed.data.company}`,
      _replyto: parsed.data.email,
      formType: "Brochure Request",
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      jobTitle: parsed.data.jobTitle || "",
      intendedUse: parsed.data.intendedUse || "",
    });
    setBrochureForm(initialBrochure);
    window.open("/brochures/thermal-stop-thermal-shield-brochure.pdf", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Contact KnightTek | Request a Consultation or Brochure"
        description="Contact KnightTek for lithium-ion battery fire suppression consultations, product brochures, and partnership inquiries. Call 1-833-466-5835."
        canonical="/contact"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact KnightTek",
          url: "https://ktekglobal.com/contact",
          mainEntity: {
            "@type": "Organization",
            name: "KnightTek",
            telephone: "+1-833-466-5835",
            url: "https://ktekglobal.com/",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+1-833-466-5835",
              contactType: "sales",
              areaServed: "Worldwide",
              availableLanguage: "English",
            },
          },
        }}
      />
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
                    Please provide your information below and we'll send you the Thermal Stop™ & Thermal Shield™ product
                    brochure immediately.
                  </p>
                  <form onSubmit={handleBrochureSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="First Name *"
                        required
                        value={brochureForm.firstName}
                        onChange={(e) => setBrochureForm({ ...brochureForm, firstName: e.target.value })}
                      />
                      <Input
                        placeholder="Last Name *"
                        required
                        value={brochureForm.lastName}
                        onChange={(e) => setBrochureForm({ ...brochureForm, lastName: e.target.value })}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        type="email"
                        placeholder="Email *"
                        required
                        value={brochureForm.email}
                        onChange={(e) => setBrochureForm({ ...brochureForm, email: e.target.value })}
                      />
                      <Input
                        type="tel"
                        placeholder="Phone *"
                        required
                        value={brochureForm.phone}
                        onChange={(e) => setBrochureForm({ ...brochureForm, phone: e.target.value })}
                      />
                    </div>
                    <Input
                      placeholder="Company Name *"
                      required
                      value={brochureForm.company}
                      onChange={(e) => setBrochureForm({ ...brochureForm, company: e.target.value })}
                    />
                    <Input
                      placeholder="Job Title"
                      value={brochureForm.jobTitle}
                      onChange={(e) => setBrochureForm({ ...brochureForm, jobTitle: e.target.value })}
                    />
                    <Textarea
                      placeholder="How do you plan to use our products? (optional)"
                      rows={4}
                      value={brochureForm.intendedUse}
                      onChange={(e) => setBrochureForm({ ...brochureForm, intendedUse: e.target.value })}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      disabled={brochureSubmitting}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      {brochureSubmitting ? "Submitting…" : "Download Brochure"}
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-heading font-bold mb-6 text-primary">Send Us a Message</h2>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    {/* First & Last Name */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block font-heading font-medium text-sm text-foreground" htmlFor="firstName">
                          First Name <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="firstName"
                          type="text"
                          required
                          value={contactForm.firstName}
                          onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block font-heading font-medium text-sm text-foreground" htmlFor="lastName">
                          Last Name <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="lastName"
                          type="text"
                          required
                          value={contactForm.lastName}
                          onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Email and Phone */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block font-heading font-medium text-sm text-foreground" htmlFor="email">
                          Email <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block font-heading font-medium text-sm text-foreground" htmlFor="phone">
                          Phone Number <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Company (Optional) */}
                    <div className="space-y-2">
                      <label className="block font-heading font-medium text-sm text-foreground" htmlFor="company">
                        Company
                      </label>
                      <Input
                        id="company"
                        type="text"
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                      />
                    </div>

                    {/* Product Interest Checkboxes */}
                    <div className="space-y-3">
                      <label className="block font-heading font-medium text-sm text-foreground">
                        What product(s) are you interested in?
                      </label>
                      <div className="space-y-3 pl-1">
                        {[
                          ["thermalShield", "Thermal Shield™"],
                          ["thermalStop", "Thermal Stop™"],
                          ["suppressit", "Suppressit™"],
                          ["fireQuit", "Fire Quit™"],
                          ["elixir5", "Elixir 5™"],
                          ["customSolution", "Custom Engineered Solution"],
                          ["other", "Other"],
                        ].map(([id, label]) => (
                          <div key={id} className="flex items-center space-x-3">
                            <Checkbox
                              id={id}
                              checked={selectedProducts.includes(label)}
                              onCheckedChange={(checked) => handleCheckboxChange(label, checked as boolean)}
                            />
                            <label
                              htmlFor={id}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-2">
                      <label className="block font-heading font-medium text-sm text-foreground" htmlFor="details">
                        Any specific questions, details, or information you'd like to add for our team?
                      </label>
                      <Textarea
                        id="details"
                        rows={5}
                        className="resize-y"
                        value={contactForm.details}
                        onChange={(e) => setContactForm({ ...contactForm, details: e.target.value })}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      disabled={contactSubmitting}
                    >
                      {contactSubmitting ? "Sending…" : "Send Message"}
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
