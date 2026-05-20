import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  Newspaper,
  FileText,
  Megaphone,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";

interface Counts {
  contacts: number;
  distributors: number;
  brochures: number;
  posts: number;
  pages: number;
  banners: number;
  heroSlides: number;
}

const ZERO: Counts = {
  contacts: 0,
  distributors: 0,
  brochures: 0,
  posts: 0,
  pages: 0,
  banners: 0,
  heroSlides: 0,
};

const head = (table: string) =>
  supabase.from(table).select("*", { count: "exact", head: true });

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>(ZERO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      head("contact_submissions"),
      head("distributor_applications"),
      head("brochure_requests"),
      head("posts"),
      head("pages"),
      head("announcement_banners"),
      head("hero_slides"),
    ]).then(
      ([
        contactsRes,
        distributorsRes,
        brochuresRes,
        postsRes,
        pagesRes,
        bannersRes,
        heroRes,
      ]) => {
        setCounts({
          contacts: contactsRes.count ?? 0,
          distributors: distributorsRes.count ?? 0,
          brochures: brochuresRes.count ?? 0,
          posts: postsRes.count ?? 0,
          pages: pagesRes.count ?? 0,
          banners: bannersRes.count ?? 0,
          heroSlides: heroRes.count ?? 0,
        });
        setLoading(false);
      },
    );
  }, []);

  const formCount = counts.contacts + counts.distributors + counts.brochures;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Welcome back</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage every public-facing surface of the KnightTek site.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          to="/admin/submissions"
          icon={Inbox}
          label="Form submissions"
          value={formCount}
          loading={loading}
          breakdown={`${counts.contacts} contact · ${counts.distributors} distributor · ${counts.brochures} brochure`}
        />
        <StatCard
          to="/admin/posts"
          icon={Newspaper}
          label="Publications"
          value={counts.posts}
          loading={loading}
          breakdown="Articles, news, videos, publications"
        />
        <StatCard
          to="/admin/pages"
          icon={FileText}
          label="Custom pages"
          value={counts.pages}
          loading={loading}
          breakdown="Drafts and published"
        />
        <StatCard
          to="/admin/banners"
          icon={Megaphone}
          label="Announcement banners"
          value={counts.banners}
          loading={loading}
          breakdown="Schedule banners site-wide"
        />
        <StatCard
          to="/admin/hero"
          icon={ImageIcon}
          label="Hero slides"
          value={counts.heroSlides}
          loading={loading}
          breakdown="The homepage carousel"
        />
      </div>

      <Card>
        <CardContent className="p-5 space-y-3">
          <h3 className="font-heading font-semibold">Quick actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/pages/new">New page</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/posts/new">New publication</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/banners/new">New banner</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/hero/new">New hero slide</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/navigation">Edit navigation</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  to: string;
  icon: typeof Inbox;
  label: string;
  value: number;
  breakdown: string;
  loading: boolean;
}

const StatCard = ({ to, icon: Icon, label, value, breakdown, loading }: StatCardProps) => (
  <Link
    to={to}
    className="group block rounded-lg border bg-card p-5 transition-colors hover:border-accent hover:shadow-sm"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-md bg-muted">
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
    </div>
    <div className="text-2xl font-heading font-bold mb-1">
      {loading ? "—" : value}
    </div>
    <div className="text-sm font-medium">{label}</div>
    <div className="text-xs text-muted-foreground mt-1">{breakdown}</div>
  </Link>
);
