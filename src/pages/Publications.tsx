import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Newspaper, ExternalLink, Calendar } from "lucide-react";

const Publications = () => {
  // Placeholder publications - will be populated with actual content
  const publications = [
    {
      id: 1,
      title: "Fire Apparatus Magazine",
      description: "Coverage of KnightTek's innovative lithium-ion battery fire suppression technology and its impact on fire services.",
      date: "2024",
      category: "Industry Press",
      link: "#"
    },
    {
      id: 2,
      title: "Fire Engineering",
      description: "In-depth article on the effectiveness of Thermal Stop and Thermal Shield in real-world emergency situations.",
      date: "2024",
      category: "Technical Article",
      link: "#"
    },
    {
      id: 3,
      title: "Firefighter Nation",
      description: "Feature story on first responder experiences using KnightTek products for EV fire suppression.",
      date: "2024",
      category: "Industry Press",
      link: "#"
    },
    {
      id: 4,
      title: "IFF Mag",
      description: "International coverage of KnightTek's worldwide expansion and partnership developments.",
      date: "2024",
      category: "International Press",
      link: "#"
    },
    {
      id: 5,
      title: "Gulf Fire",
      description: "Middle East regional coverage of maritime and port safety applications.",
      date: "2024",
      category: "International Press",
      link: "#"
    },
    {
      id: 6,
      title: "APF Mag",
      description: "Asia-Pacific feature on battery fire safety innovation and technology.",
      date: "2024",
      category: "International Press",
      link: "#"
    },
    {
      id: 7,
      title: "UK Fire Mag",
      description: "European perspective on advanced fire suppression solutions for lithium-ion batteries.",
      date: "2024",
      category: "International Press",
      link: "#"
    },
    {
      id: 8,
      title: "Fire Buyer",
      description: "Product review and buyer's guide featuring KnightTek fire suppression solutions.",
      date: "2024",
      category: "Product Review",
      link: "#"
    }
  ];

  const categories = ["All", "Industry Press", "Technical Article", "International Press", "Product Review"];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-3 bg-accent/10 rounded-full mb-6">
              <Newspaper className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-primary-foreground">
              Publications & Press
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              News, Articles, and Industry Recognition
            </p>
            <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto">
              Stay informed with the latest coverage of KnightTek's innovations, partnerships, and impact on lithium-ion battery fire safety across industries worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section - Placeholder for future functionality */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={category === "All" ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {publications.map((publication) => (
              <Card key={publication.id} className="border-2 hover:border-accent hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
                      {publication.category}
                    </span>
                    <h3 className="text-xl font-heading font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                      {publication.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{publication.date}</span>
                    </div>
                  </div>
                  <p className="text-foreground/80 mb-4 line-clamp-3">
                    {publication.description}
                  </p>
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-accent/10 transition-colors"
                  >
                    <a href={publication.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <span>Read Article</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section - Coming Soon */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary">
              KnightTek Blog & Insights
            </h2>
            <p className="text-lg text-foreground/80 mb-6">
              Stay tuned for expert insights, product updates, and industry analysis from our team. Monthly posts from Matt Hill and podcast content coming soon.
            </p>
            <Card className="border-2 border-accent/20 bg-card">
              <CardContent className="p-8">
                <div className="inline-block p-4 bg-accent/10 rounded-full mb-4">
                  <Newspaper className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3 text-primary">
                  Coming Soon: Expert Content & Podcasts
                </h3>
                <p className="text-foreground/70 mb-4">
                  Subscribe to our newsletter to be notified when we launch our blog and podcast series featuring industry experts and real-world case studies.
                </p>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/contact">Subscribe for Updates</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-primary to-accent/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-primary-foreground">
            Press Inquiries
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Media professionals: Contact us for product information, interviews, or press materials.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            <Link to="/contact">Contact Press Team</Link>
          </Button>
          <p className="mt-6 text-primary-foreground/90">
            Email: <a href="mailto:info@ktekglobal.com" className="text-accent font-semibold hover:underline">info@ktekglobal.com</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Publications;
