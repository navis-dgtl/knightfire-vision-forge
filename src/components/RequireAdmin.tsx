import { ReactNode, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

/**
 * Gates a route to signed-in admins. Sends anonymous visitors to /auth and
 * shows an access-denied notice to signed-in users without the admin role.
 *
 * Used two ways:
 *   <RequireAdmin><MyPage/></RequireAdmin>     (wrap a single page)
 *   <Route element={<RequireAdmin/>}><Route .../></Route>   (gate a subtree via Outlet)
 */
export function RequireAdmin({ children }: { children?: ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
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

  return <>{children ?? <Outlet />}</>;
}
