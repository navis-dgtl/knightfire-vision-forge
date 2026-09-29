import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type Status = "validating" | "confirm" | "submitting" | "success" | "invalid";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("validating");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (res.ok && body?.valid) {
          setStatus("confirm");
        } else if (body?.alreadyUnsubscribed) {
          setStatus("success");
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setStatus("submitting");
    const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    setStatus(error ? "invalid" : "success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title="Unsubscribe | KnightTek"
        description="Manage your KnightTek email preferences."
        canonical="/unsubscribe"
        noindex
      />
      <Navigation />
      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-heading font-bold text-foreground mb-4">
                Email Preferences
              </h1>
              {status === "validating" && (
                <p className="text-muted-foreground">Validating your link…</p>
              )}
              {status === "confirm" && (
                <>
                  <p className="text-muted-foreground mb-6">
                    Click below to stop receiving follow-up emails from KnightTek
                    website form submissions.
                  </p>
                  <Button onClick={handleUnsubscribe}>Confirm Unsubscribe</Button>
                </>
              )}
              {status === "submitting" && (
                <p className="text-muted-foreground">Processing…</p>
              )}
              {status === "success" && (
                <p className="text-muted-foreground">
                  You've been unsubscribed. You will no longer receive these
                  emails from KnightTek.
                </p>
              )}
              {status === "invalid" && (
                <p className="text-muted-foreground">
                  This unsubscribe link is invalid or has expired. If you need
                  help, contact us at info@ktekglobal.com.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Unsubscribe;
