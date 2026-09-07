import { useState } from "react";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  src: string;
  alt: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
}

const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={images[active].src}
          alt={images[active].alt}
          className="w-full h-full object-contain"
          loading="eager"
          decoding="async"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}: ${image.alt}`}
              aria-current={index === active}
              className={cn(
                "aspect-square rounded-md overflow-hidden bg-muted border-2 transition-colors",
                index === active
                  ? "border-accent"
                  : "border-transparent hover:border-accent/50"
              )}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
