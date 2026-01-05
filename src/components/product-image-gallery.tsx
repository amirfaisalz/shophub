"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/types";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    },
    [isZoomed]
  );

  if (images.length === 0) return null;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
    setImageLoaded(false);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    setImageLoaded(false);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className={cn(
          "relative aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-muted/50 to-muted cursor-zoom-in group"
        )}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Image */}
        <Image
          src={images[selectedImage].url}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          className={cn(
            "object-cover transition-all duration-500",
            imageLoaded ? "opacity-100" : "opacity-0",
            isZoomed && "scale-150"
          )}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : undefined
          }
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Loading shimmer */}
        {!imageLoaded && <div className="absolute inset-0 skeleton-shimmer" />}

        {/* Zoom indicator */}
        <div
          className={cn(
            "absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full",
            "bg-black/50 text-white text-sm backdrop-blur-sm",
            "transition-opacity duration-200",
            isZoomed ? "opacity-0" : "opacity-100 group-hover:opacity-100"
          )}
        >
          <ZoomIn className="h-4 w-4" />
          Hover to zoom
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "bg-white/90 hover:bg-white shadow-lg",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "h-10 w-10 rounded-full"
              )}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "bg-white/90 hover:bg-white shadow-lg",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "h-10 w-10 rounded-full"
              )}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setImageLoaded(false);
              }}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden",
                "border-2 transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                index === selectedImage
                  ? "border-primary ring-2 ring-primary/20 scale-[0.98]"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              <Image
                src={image.url}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
              />
              {index === selectedImage && (
                <div className="absolute inset-0 bg-primary/10" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
