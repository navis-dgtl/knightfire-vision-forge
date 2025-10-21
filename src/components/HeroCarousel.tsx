import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.png";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Advanced Lithium-Ion Battery Fire Solutions",
    subtitle: "NFPA 18 Certified. EPA Safer Choice Listed. 100% Success Rate.",
    cta: "Explore Products",
    ctaLink: "/products/thermal-stop",
    secondaryCta: "Request Consultation",
    secondaryCtaLink: "/contact",
  },
  {
    id: 2,
    title: "Thermal Stop: Extinguish Lithium-Ion Battery Fires",
    subtitle: "The only suppressant specifically designed to eliminate thermal runaway",
    cta: "Learn More About Thermal Stop",
    ctaLink: "/products/thermal-stop",
  },
  {
    id: 3,
    title: "Thermal Shield: Prevent & Contain Battery Fires",
    subtitle: "Revolutionary solution for lithium-ion battery fire transport and containment",
    cta: "Learn More About Thermal Shield",
    ctaLink: "/products/thermal-shield",
  },
  {
    id: 4,
    title: "Trusted by First Responders Worldwide",
    subtitle: "Serving Law Enforcement, Fire Services, and Industry Professionals",
    cta: "Contact Us Today",
    ctaLink: "/contact",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden bg-primary">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBackground})` }} />
          {/* Blue Overlay with reduced opacity */}
          <div className="absolute inset-0 bg-primary/70" />

          {/* Content */}
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-3xl text-primary-foreground">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">{slide.subtitle}</p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  <Link to={slide.ctaLink}>{slide.cta}</Link>
                </Button>
                {slide.secondaryCta && (
                  <Button asChild size="lg" variant="outline-light">
                    <Link to={slide.secondaryCtaLink!}>{slide.secondaryCta}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground p-1 md:p-1.5 rounded-full backdrop-blur-sm transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground p-1 md:p-1.5 rounded-full backdrop-blur-sm transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-accent w-8" : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
