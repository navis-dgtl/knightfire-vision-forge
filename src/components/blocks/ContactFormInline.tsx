import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyFormspree } from "@/lib/formspree";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(50),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  details: z.string().trim().max(5000).optional().or(z.literal("")),
});

const initial = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  details: "",
};

/**
 * The contact form, simplified for embedding inside a custom page block.
 * Submits to the same `contact_submissions` table + Formspree notification
 * pipeline as the standalone /contact page, so admin and reporting flows
 * work identically regardless of which surface the user submitted from.
 */
export function ContactFormInline() {
  const { toast } = useToast();
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Please check the form",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company || null,
      products: [],
      details: parsed.data.details || null,
    });
    setSubmitting(false);
    if (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or call 1-833-466-5835.",
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
      formType: "Contact Request (inline)",
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company || "",
      details: parsed.data.details || "",
    });
    setForm(initial);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          required
          placeholder="First name *"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <Input
          required
          placeholder="Last name *"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          required
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          required
          type="tel"
          placeholder="Phone *"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <Input
        placeholder="Company"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />
      <Textarea
        placeholder="What can we help with?"
        rows={4}
        value={form.details}
        onChange={(e) => setForm({ ...form, details: e.target.value })}
      />
      <Button
        type="submit"
        size="lg"
        className="bg-accent text-accent-foreground hover:bg-accent/90"
        disabled={submitting}
      >
        {submitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
