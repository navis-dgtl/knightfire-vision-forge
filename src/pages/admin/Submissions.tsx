import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Phone, Building, Calendar, Eye } from "lucide-react";

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
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function Submissions() {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [distributors, setDistributors] = useState<DistributorRow[]>([]);
  const [brochures, setBrochures] = useState<BrochureRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [c, d, b] = await Promise.all([
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("distributor_applications").select("*").order("created_at", { ascending: false }),
        supabase.from("brochure_requests").select("*").order("created_at", { ascending: false }),
      ]);
      if (c.data) setContacts(c.data as ContactRow[]);
      if (d.data) setDistributors(d.data as DistributorRow[]);
      if (b.data) setBrochures(b.data as BrochureRow[]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-heading font-bold">Submission Inbox</h2>
        <p className="text-muted-foreground text-sm mt-1">
          All contact, distributor, and brochure form submissions.
        </p>
      </div>

      <Tabs defaultValue="contact">
        <TabsList>
          <TabsTrigger value="contact">Contact ({contacts.length})</TabsTrigger>
          <TabsTrigger value="distributor">Distributor ({distributors.length})</TabsTrigger>
          <TabsTrigger value="brochure">Brochure ({brochures.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-4">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : contacts.length === 0 ? (
            <EmptyState message="No contact submissions yet." />
          ) : (
            <div className="space-y-3">
              {contacts.map((row) => (
                <Card key={row.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-heading font-semibold">
                            {row.first_name} {row.last_name}
                          </h3>
                          {row.company && <Badge variant="secondary">{row.company}</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            <a href={`mailto:${row.email}`} className="hover:underline">{row.email}</a>
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            <a href={`tel:${row.phone}`} className="hover:underline">{row.phone}</a>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(row.created_at)}
                          </span>
                        </div>
                        {row.products.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {row.products.map((p) => (
                              <Badge key={p} variant="outline">{p}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <ViewDialog
                        title={`Contact submission · ${row.first_name} ${row.last_name}`}
                        fields={[
                          ["Submitted", formatDate(row.created_at)],
                          ["First name", row.first_name],
                          ["Last name", row.last_name],
                          ["Email", row.email],
                          ["Phone", row.phone],
                          ["Company", row.company || "—"],
                          ["Products of interest", row.products.join(", ") || "—"],
                          ["Details", row.details || "—"],
                        ]}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="distributor" className="mt-4">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : distributors.length === 0 ? (
            <EmptyState message="No distributor applications yet." />
          ) : (
            <div className="space-y-3">
              {distributors.map((row) => (
                <Card key={row.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Building className="h-4 w-4 text-accent" />
                          <h3 className="font-heading font-semibold">{row.business_name}</h3>
                          {row.markets.map((m) => (
                            <Badge key={m} variant="outline">{m}</Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span>{row.contact_name} · {row.contact_title}</span>
                          <a href={`mailto:${row.contact_email}`} className="hover:underline flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {row.contact_email}
                          </a>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(row.created_at)}
                          </span>
                        </div>
                      </div>
                      <ViewDialog
                        title={`Distributor application · ${row.business_name}`}
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
                          ["US-based confirmed", row.us_confirmed ? "Yes" : "No"],
                        ]}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="brochure" className="mt-4">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : brochures.length === 0 ? (
            <EmptyState message="No brochure requests yet." />
          ) : (
            <div className="space-y-3">
              {brochures.map((row) => (
                <Card key={row.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-heading font-semibold">
                            {row.first_name} {row.last_name}
                          </h3>
                          <Badge variant="secondary">{row.company}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <a href={`mailto:${row.email}`} className="hover:underline flex items-center gap-1">
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
                      <ViewDialog
                        title={`Brochure request · ${row.first_name} ${row.last_name}`}
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12 text-muted-foreground">{message}</div>
);

const ViewDialog = ({
  title,
  fields,
}: {
  title: string;
  fields: [string, string][];
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button size="sm" variant="outline">
        <Eye className="h-4 w-4 mr-1.5" />
        View
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm">
        {fields.map(([label, value]) => (
          <div key={label} className="sm:contents">
            <dt className="font-medium text-muted-foreground sm:col-span-1">{label}</dt>
            <dd className="sm:col-span-2 whitespace-pre-wrap break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </DialogContent>
  </Dialog>
);
