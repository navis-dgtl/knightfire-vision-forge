import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const schema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }).max(255),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(72),
});

const SignUp = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/admin", { replace: true });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast({
        title: "Invalid input",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: `${window.location.origin}/auth` },
    });
    if (error) {
      setSubmitting(false);
      const msg = /allowlist|restricted|Database error/i.test(error.message)
        ? "This email isn't approved for sign-up. Contact your KnightTek administrator to be added to the allowlist."
        : error.message;
      toast({ title: "Sign up failed", description: msg, variant: "destructive" });
      return;
    }
    // Auto-confirm is on; if no session was returned, sign in directly.
    if (!data.session) {
      await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
    }
    setSubmitting(false);
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Admin Sign Up | KnightTek"
        description="Restricted KnightTek team registration."
        canonical="/signup"
        noindex
      />
      <Navigation />
      <section className="pt-32 pb-16 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Create Admin Account</h1>
          <p className="text-primary-foreground/80 mt-2">
            Restricted to allowlisted KnightTek team members.
          </p>
        </div>
      </section>
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 md:p-8">
              {done ? (
                <div className="space-y-4 text-center">
                  <h2 className="font-heading font-bold text-xl">Check your inbox</h2>
                  <p className="text-muted-foreground text-sm">
                    We've sent a verification link to <strong>{email}</strong>. Click it to
                    activate your account, then sign in.
                  </p>
                  <Link to="/auth" className="text-primary hover:underline text-sm inline-block">
                    Go to sign in →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block font-heading font-medium text-sm" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-heading font-medium text-sm" htmlFor="password">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      At least 8 characters. Common breached passwords are rejected.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={submitting}
                  >
                    {submitting ? "Creating account…" : "Create Account"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Only emails added to the KnightTek admin allowlist can register.
                  </p>
                  <p className="text-xs text-center">
                    Already have an account?{" "}
                    <Link to="/auth" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SignUp;
