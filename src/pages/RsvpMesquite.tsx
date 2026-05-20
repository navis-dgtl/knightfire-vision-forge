import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSchBpATiyuBQWHCRgN5qmqIDFXRlE1lKwed3-Hhitilz36HlA/viewform?embedded=true";
const FORM_PUBLIC_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSchBpATiyuBQWHCRgN5qmqIDFXRlE1lKwed3-Hhitilz36HlA/viewform";

const RsvpMesquite = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title="RSVP - Mesquite, Nevada Burn Demonstration | KnightTek"
        description="RSVP for the upcoming KnightTek live burn demonstration in Mesquite, Nevada. See Thermal Stop™ and Thermal Shield™ in action against lithium-ion battery thermal runaway."
        canonical="/rsvp-mesquite"
      />
      <Navigation />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block px-4 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
                Live Burn Demonstration
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                RSVP — Mesquite, Nevada Burn
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join KnightTek for an upcoming live burn demonstration in Mesquite, Nevada.
                See firsthand how Thermal Stop™ and Thermal Shield™ suppress and contain
                lithium-ion battery thermal runaway events. Please complete the RSVP form
                below to reserve your spot.
              </p>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <a href={FORM_PUBLIC_URL} target="_blank" rel="noopener noreferrer">
                    Open form in new tab <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <iframe
                src={FORM_EMBED_URL}
                title="Mesquite, Nevada Burn RSVP Form"
                className="w-full"
                style={{ height: "1800px", border: 0 }}
                loading="lazy"
              >
                Loading RSVP form…
              </iframe>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RsvpMesquite;
