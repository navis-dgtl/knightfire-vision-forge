import { supabase } from "@/integrations/supabase/client";

/**
 * Sends the automatic "Thank you for your inquiry" confirmation email to a
 * form submitter. Fire-and-forget: failures are logged but never block or
 * error the user's form submission.
 */
export async function sendInquiryAutoReply(params: {
  email: string;
  firstName: string;
  formType: string;
}): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "inquiry-confirmation",
        recipientEmail: params.email,
        idempotencyKey: `inquiry-confirmation-${params.formType}-${params.email.toLowerCase()}-${Date.now()}`,
        templateData: { firstName: params.firstName },
      },
    });
    if (error) {
      console.error("[auto-reply] send failed", error);
    }
  } catch (err) {
    console.error("[auto-reply] network error", err);
  }
}
