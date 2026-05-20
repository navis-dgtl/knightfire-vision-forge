import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AllowlistRow {
  email: string;
  created_at: string;
}

const Allowlist = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<AllowlistRow[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("admin_email_allowlist")
      .select("email, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load allowlist", description: error.message, variant: "destructive" });
    } else {
      setRows(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setAdding(true);
    const { error } = await supabase.from("admin_email_allowlist").insert({ email: trimmed });
    setAdding(false);
    if (error) {
      toast({ title: "Could not add email", description: error.message, variant: "destructive" });
      return;
    }
    setEmail("");
    toast({ title: "Email added", description: `${trimmed} can now sign up at /signup.` });
    load();
  };

  const remove = async (target: string) => {
    if (!confirm(`Remove ${target} from the allowlist? They will no longer be able to sign up.`)) return;
    const { error } = await supabase.from("admin_email_allowlist").delete().eq("email", target);
    if (error) {
      toast({ title: "Could not remove", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Removed", description: target });
    load();
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="text-2xl font-heading font-bold">Admin Allowlist</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Only emails on this list can register at <code className="text-foreground">/signup</code> and
          receive admin access automatically.
        </p>
      </div>

      <Card className="border">
        <CardContent className="p-5">
          <form onSubmit={addEmail} className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <Label htmlFor="email">Add an email</Label>
              <Input
                id="email"
                type="email"
                placeholder="person@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={adding}>
              <UserPlus className="h-4 w-4 mr-2" />
              {adding ? "Adding…" : "Add to allowlist"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-heading font-semibold mb-3">
          Allowed emails ({rows.length})
        </h3>
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground">No emails on the allowlist yet.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((row) => (
              <Card key={row.email} className="border">
                <CardContent className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{row.email}</div>
                    <div className="text-xs text-muted-foreground">
                      Added {new Date(row.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => remove(row.email)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Allowlist;
