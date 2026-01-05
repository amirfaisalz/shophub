"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductListItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: ProductListItem;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const secondImage = product.images[1];
  const primaryImage = product.images[0];

  return (
    <Link href={`/products/${product.slug}`} title={`View ${product.name}`}>
      <Card
        className={`
          group relative overflow-hidden border-0 shadow-sm 
          card-hover cursor-pointer bg-card
          opacity-0 animate-fade-in-up
        `}
        style={{
          animationDelay: `${index * 0.1}s`,
          animationFillMode: "forwards",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Quick Actions */}
        <div
          className={`
            absolute top-3 right-3 z-10 flex flex-col gap-2
            transition-all duration-300 ease-out
            ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }
          `}
        >
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-primary hover:text-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-primary hover:text-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative aspect-4/5 overflow-hidden bg-linear-to-br from-muted/50 to-muted">
            {/* Primary Image */}
            <Image
              src={primaryImage?.url || "/placeholder.jpg"}
              alt={product.name}
              fill
              className={`
                object-cover transition-all duration-500 ease-out
                ${imageLoaded ? "opacity-100" : "opacity-0"}
                ${
                  isHovered && secondImage
                    ? "opacity-0 scale-105"
                    : "opacity-100 scale-100"
                }
              `}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setImageLoaded(true)}
            />

            {/* Secondary Image (shown on hover) */}
            {secondImage && (
              <Image
                src={secondImage.url}
                alt={`${product.name} - alternate view`}
                fill
                className={`
                  object-cover transition-all duration-500 ease-out absolute inset-0
                  ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                `}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}

            {/* Loading shimmer */}
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton-shimmer" />
            )}

            {/* Gradient overlay on hover */}
            <div
              className={`
                absolute inset-x-0 bottom-0 h-24 
                bg-linear-to-t from-black/40 to-transparent
                transition-opacity duration-300
                ${isHovered ? "opacity-100" : "opacity-0"}
              `}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start p-4 gap-2">
          {/* Product Name */}
          <h3 className="font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold gradient-text">
              {formatPrice(product.price)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
