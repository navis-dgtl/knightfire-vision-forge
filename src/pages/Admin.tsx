import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut, Mail, Phone, Building, Calendar, Eye, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface ContactRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string | null;
  products: string[];
  details: string | null;
  status: string;
  created_at: string;
}

interface DistributorRow {
  id: string;
  business_name: string;
  business_address: string;
  website: string | null;
  business_phone: string;
  contact_name: string;
  contact_title: string;
  contact_phone: string;
  contact_email: string;
  linkedin: string | null;
  year_established: string;
  employees: string;
  territory: string;
  markets: string[];
  company_profile: string;
  us_confirmed: boolean;
  status: string;
  created_at: string;
}

interface BrochureRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string | null;
  intended_use: string | null;
  created_at: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [distributors, setDistributors] = useState<DistributorRow[]>([]);
  const [brochures, setBrochures] = useState<BrochureRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    if (!isAdmin) {
      // Authenticated but not an admin
      setDataLoading(false);
      return;
    }
    const load = async () => {
      const [c, d, b] = await Promise.all([
        supabase
          .from("contact_submissions")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("distributor_applications")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("brochure_requests")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);
      if (c.data) setContacts(c.data as ContactRow[]);
      if (d.data) setDistributors(d.data as DistributorRow[]);
      if (b.data) setBrochures(b.data as BrochureRow[]);
      setDataLoading(false);
    };
    load();
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <section className="pt-32 pb-16 flex-1 bg-background">
          <div className="container mx-auto px-4 max-w-md text-center">
            <h1 className="text-2xl font-heading font-bold mb-3">Access denied</h1>
            <p className="text-muted-foreground mb-6">
              Your account does not have admin permissions. Please contact your
              KnightTek site administrator.
            </p>
            <Button onClick={signOut} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <section className="pt-32 pb-8 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">
              Submission Inbox
            </h1>
            <p className="text-primary-foreground/80 mt-1">
              All contact, distributor, and brochure form submissions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to="/admin/posts">
                <FileText className="h-4 w-4 mr-2" />
                Manage Publications
              </Link>
            </Button>
            <Button onClick={signOut} variant="outline" className="bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </section>
      <section className="py-10 bg-background flex-1">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="contact">
            <TabsList className="mb-6">
              <TabsTrigger value="contact">
                Contact ({contacts.length})
              </TabsTrigger>
              <TabsTrigger value="distributor">
                Distributor ({distributors.length})
              </TabsTrigger>
              <TabsTrigger value="brochure">
                Brochure ({brochures.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contact">
              {dataLoading ? (
                <p className="text-muted-foreground">Loading…</p>
              ) : contacts.length === 0 ? (
                <p className="text-muted-foreground">No contact submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {contacts.map((row) => (
                    <Card key={row.id} className="border-0 shadow">
                      <CardContent className="p-4 md:p-5">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-heading font-semibold">
                                {row.first_name} {row.last_name}
                              </h3>
                              {row.company && (
                                <Badge variant="secondary">{row.company}</Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                <a
                                  href={`mailto:${row.email}`}
                                  className="hover:underline"
                                >
                                  {row.email}
                                </a>
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                <a
                                  href={`tel:${row.phone}`}
                                  className="hover:underline"
                                >
                                  {row.phone}
                                </a>
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(row.created_at)}
                              </span>
                            </div>
                            {row.products.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {row.products.map((p) => (
                                  <Badge key={p} variant="outline">
                                    {p}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1.5" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Contact submission · {row.first_name}{" "}
                                  {row.last_name}
                                </DialogTitle>
                              </DialogHeader>
                              <DetailGrid
                                fields={[
                                  ["Submitted", formatDate(row.created_at)],
                                  ["First name", row.first_name],
                                  ["Last name", row.last_name],
                                  ["Email", row.email],
                                  ["Phone", row.phone],
                                  ["Company", row.company || "—"],
                                  [
                                    "Products of interest",
                                    row.products.join(", ") || "—",
                                  ],
                                  ["Details", row.details || "—"],
                                ]}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="distributor">
              {dataLoading ? (
                <p className="text-muted-foreground">Loading…</p>
              ) : distributors.length === 0 ? (
                <p className="text-muted-foreground">
                  No distributor applications yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {distributors.map((row) => (
                    <Card key={row.id} className="border-0 shadow">
                      <CardContent className="p-4 md:p-5">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Building className="h-4 w-4 text-accent" />
                              <h3 className="font-heading font-semibold">
                                {row.business_name}
                              </h3>
                              {row.markets.map((m) => (
                                <Badge key={m} variant="outline">
                                  {m}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span>
                                {row.contact_name} · {row.contact_title}
                              </span>
                              <a
                                href={`mailto:${row.contact_email}`}
                                className="hover:underline flex items-center gap-1"
                              >
                                <Mail className="h-3.5 w-3.5" />
                                {row.contact_email}
                              </a>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(row.created_at)}
                              </span>
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1.5" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Distributor application · {row.business_name}
                                </DialogTitle>
                              </DialogHeader>
                              <DetailGrid
                                fields={[
                                  ["Submitted", formatDate(row.created_at)],
                                  ["Business name", row.business_name],
                                  ["Business address", row.business_address],
                                  ["Website", row.website || "—"],
                                  ["Main business phone", row.business_phone],
                                  ["Contact name", row.contact_name],
                                  ["Contact title", row.contact_title],
                                  ["Contact phone", row.contact_phone],
                                  ["Contact email", row.contact_email],
                                  ["LinkedIn", row.linkedin || "—"],
                                  ["Year established", row.year_established],
                                  ["Employees", row.employees],
                                  ["Territory", row.territory],
                                  ["Markets served", row.markets.join(", ") || "—"],
                                  ["Company profile", row.company_profile],
                                  [
                                    "US-based confirmed",
                                    row.us_confirmed ? "Yes" : "No",
                                  ],
                                ]}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="brochure">
              {dataLoading ? (
                <p className="text-muted-foreground">Loading…</p>
              ) : brochures.length === 0 ? (
                <p className="text-muted-foreground">No brochure requests yet.</p>
              ) : (
                <div className="space-y-3">
                  {brochures.map((row) => (
                    <Card key={row.id} className="border-0 shadow">
                      <CardContent className="p-4 md:p-5">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-heading font-semibold">
                                {row.first_name} {row.last_name}
                              </h3>
                              <Badge variant="secondary">{row.company}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <a
                                href={`mailto:${row.email}`}
                                className="hover:underline flex items-center gap-1"
                              >
                                <Mail className="h-3.5 w-3.5" />
                                {row.email}
                              </a>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                {row.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(row.created_at)}
                              </span>
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1.5" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Brochure request · {row.first_name}{" "}
                                  {row.last_name}
                                </DialogTitle>
                              </DialogHeader>
                              <DetailGrid
                                fields={[
                                  ["Submitted", formatDate(row.created_at)],
                                  ["First name", row.first_name],
                                  ["Last name", row.last_name],
                                  ["Email", row.email],
                                  ["Phone", row.phone],
                                  ["Company", row.company],
                                  ["Job title", row.job_title || "—"],
                                  ["Intended use", row.intended_use || "—"],
                                ]}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
};

const DetailGrid = ({ fields }: { fields: [string, string][] }) => (
  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm">
    {fields.map(([label, value]) => (
      <div key={label} className="sm:contents">
        <dt className="font-medium text-muted-foreground sm:col-span-1">
          {label}
        </dt>
        <dd className="sm:col-span-2 whitespace-pre-wrap break-words">
          {value}
        </dd>
      </div>
    ))}
  </dl>
);

export default Admin;
