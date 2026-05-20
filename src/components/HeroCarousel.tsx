import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.webp";
import { useActiveHeroSlides } from "@/lib/hero";

/**
 * Shape used by the renderer regardless of source (DB or fallback).
 * Hardcoded fallback below preserves the pre-admin copy so the public
 * site never goes blank if `hero_slides` is empty (or the query errors).
 */
interface RenderedSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
}

const FALLBACK: RenderedSlide[] = [
  {
    id: "fallback-0",
    title: "Become a KnightTek™ Distributor",
    subtitle:
      "We're expanding our U.S. distribution network. Partner with us to bring advanced lithium-ion fire suppression solutions to your region.",
    imageUrl: heroBackground,
    ctaLabel: "Apply Now",
    ctaUrl: "/distributors",
    secondaryLabel: "Learn More",
    secondaryUrl: "/distributors",
  },
  {
    id: "fallback-1",
    title: "Advanced Lithium-Ion Battery Fire Solutions",
    subtitle: "NFPA 18 Certified. EPA Safer Choice Listed.",
    imageUrl: heroBackground,
    ctaLabel: "Explore Products",
    ctaUrl: "/products/thermal-stop",
    secondaryLabel: "Request Consultation",
    secondaryUrl: "/contact",
  },
  {
    id: "fallback-2",
    title: "Thermal Stop™: Extinguish Lithium-Ion Battery Fires",
    subtitle: "The only suppressant specifically designed to eliminate thermal runaway",
    imageUrl: heroBackground,
    ctaLabel: "Learn More About Thermal Stop™",
    ctaUrl: "/products/thermal-stop",
  },
  {
    id: "fallback-3",
    title: "Thermal Shield™: Prevent & Contain Battery Fires",
    subtitle: "Revolutionary solution for lithium-ion battery fire transport and containment",
    imageUrl: heroBackground,
    ctaLabel: "Learn More About Thermal Shield™",
    ctaUrl: "/products/thermal-shield",
  },
  {
    id: "fallback-4",
    title: "Trusted by First Responders Worldwide",
    subtitle: "Serving Law Enforcement, Fire Services, and Industry Professionals",
    imageUrl: heroBackground,
    ctaLabel: "Contact Us Today",
    ctaUrl: "/contact",
  },
];

const isExternal = (url: string) => /^https?:\/\//i.test(url);

const Cta = ({
  label,
  url,
  variant,
}: {
  label: string;
  url: string;
  variant: "primary" | "secondary";
}) => {
  const className =
    variant === "primary"
      ? "bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
      : "";
  const buttonProps = { size: "lg" as const, className } as const;
  if (isExternal(url)) {
    return (
      <Button
        asChild
        {...buttonProps}
        variant={variant === "primary" ? "default" : "outline-light"}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </Button>
    );
  }
  return (
    <Button
      asChild
      {...buttonProps}
      variant={variant === "primary" ? "default" : "outline-light"}
    >
      <Link to={url}>{label}</Link>
    </Button>
  );
};

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { data: dbSlides } = useActiveHeroSlides();

  // Use DB slides if any exist; otherwise fall back to the hardcoded list.
  // This keeps the home page populated on first load even before any admin
  // has added DB content.
  const slides: RenderedSlide[] = useMemo(() => {
    if (!dbSlides || dbSlides.length === 0) return FALLBACK;
    return dbSlides.map((s) => ({
      id: s.id,
      title: s.title ?? "",
      subtitle: s.subtitle ?? "",
      imageUrl: s.image_url || heroBackground,
      ctaLabel: s.cta_label ?? undefined,
      ctaUrl: s.cta_url ?? undefined,
      secondaryLabel: s.secondary_cta_label ?? undefined,
      secondaryUrl: s.secondary_cta_url ?? undefined,
    }));
  }, [dbSlides]);

  // Reset to first slide when the slide list changes length (e.g. admin
  // deletes the current slide while you're on the page).
  useEffect(() => {
    if (currentSlide >= slides.length) setCurrentSlide(0);
  }, [slides.length, currentSlide]);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

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
      <h1 className="sr-only">
        Lithium-Ion Battery Fire Suppression Solutions — Thermal Stop™ &amp; Thermal Shield™
      </h1>

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={index !== currentSlide}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-primary/70" />

          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-3xl text-primary-foreground">
              {slide.title && (
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
                  {slide.title}
                </h2>
              )}
              {slide.subtitle && (
                <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
                  {slide.subtitle}
                </p>
              )}
              <div className="flex flex-wrap gap-4">
                {slide.ctaLabel && slide.ctaUrl && (
                  <Cta label={slide.ctaLabel} url={slide.ctaUrl} variant="primary" />
                )}
                {slide.secondaryLabel && slide.secondaryUrl && (
                  <Cta
                    label={slide.secondaryLabel}
                    url={slide.secondaryUrl}
                    variant="secondary"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 bottom-8 z-20 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground p-1 md:p-1.5 rounded-full backdrop-blur-sm transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 bottom-8 z-20 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground p-1 md:p-1.5 rounded-full backdrop-blur-sm transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-accent w-8"
                    : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
