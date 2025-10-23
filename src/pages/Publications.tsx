import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Video } from "lucide-react";

const Publications = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-3 bg-accent/10 rounded-full mb-6">
              <BookOpen className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-foreground">
              KnightTek Resources and Articles
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Comprehensive directory of all of our fire safety videos
            </p>
          </div>
        </div>
      </section>

      {/* KnightTek Blog & Insights Section - NOW AT TOP */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary">
              KnightTek Blog & Insights
            </h2>
            <p className="text-lg text-foreground/80 mb-6">
              Expert insights, product updates, and industry analysis from our team.
            </p>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Subscribe for Updates</Link>
            </Button>
          </div>

          {/* Featured Article */}
          <div className="max-w-4xl mx-auto mt-12 space-y-6">
            <h3 className="text-2xl font-heading font-bold mb-6 text-primary text-center">
              Featured Publications
            </h3>
            
            {/* Fire Magazine Article */}
            <Card className="border-2 border-accent/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg flex-shrink-0">
                    <FileText className="h-8 w-8 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-heading font-bold mb-2 text-primary">
                      Fire Magazine - September 2025
                    </h4>
                    <p className="text-foreground/70 mb-4">
                      Featured article: "KnightTek rolls out dual agent system..." - Stephen Knight, CEO of KnightTek, discusses the innovative dual-agent approach to lithium-ion battery fire safety.
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        asChild 
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <a 
                          href="/publications/fire-magazine-september-2025.pdf" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View Article
                        </a>
                      </Button>
                      <Button 
                        asChild 
                        variant="outline"
                      >
                        <a 
                          href="/publications/fire-magazine-september-2025.pdf" 
                          download="Fire_Magazine_September_2025_KnightTek.pdf"
                        >
                          Download PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto Infos Article */}
            <Card className="border-2 border-accent/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg flex-shrink-0">
                    <FileText className="h-8 w-8 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-heading font-bold mb-2 text-primary">
                      Three Minutes to Extinguish a Tesla Fire: The Miracle Solution from Nevada
                    </h4>
                    <p className="text-foreground/70 mb-4">
                      Auto Infos (France) covers KnightTek' innovative plant-based fire suppression system that can extinguish electric vehicle fires in just three minutes, addressing the critical challenge of lithium-ion battery thermal runaway.
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        asChild 
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <a 
                          href="https://www.auto-infos.fr/article/trois-minutes-pour-eteindre-une-tesla-en-feu-la-solution-miracle-viendrait-du-nevada.287299" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View Article
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Media and Videos Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8 justify-center">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Video className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
                Media & Videos
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Video 1 */}
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/jsvnC8jPDSk?si=baA8TpK0ulnO1w5b" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Video 2 */}
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/l4wn4y4AyPI?si=KL80alwiUvuA79VZ" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Video 3 */}
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/PVMUKiYUOQM?si=xyFU6VnYYxwhMdcU" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Video 4 */}
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/0uMmqji6sg0?si=kghyGjFULG0wlkDP" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Video 5 */}
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg md:col-span-2 md:max-w-2xl md:mx-auto">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/pdsO9bsEz9E?si=vxSWJMNHIfxgmebY" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lithium-Ion Battery Fire Resources Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary">
                Lithium-Ion Battery Fire Resources
              </h2>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
                Watch our comprehensive demonstration and burn videos showcasing the effectiveness of our thermal management solutions in real-world scenarios.
              </p>
            </div>

            <Card className="border-2 border-accent/20 bg-card">
              <CardContent className="p-8 text-center">
                <div className="inline-block p-4 bg-accent/10 rounded-full mb-4">
                  <Video className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">
                  Demonstration & Burn Videos
                </h3>
                <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
                  Coming soon: Our burn demonstration videos from KnightTek showcasing thermal runaway containment in action. These videos will demonstrate the real-world effectiveness of our dual-agent system.
                </p>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact">Request Demo Information</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Publications;