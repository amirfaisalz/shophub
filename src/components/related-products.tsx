import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: Array<{
    url: string;
  }>;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="mt-20 pt-12 border-t">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            You May Also <span className="gradient-text">Like</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            Discover more products from our collection
          </p>
        </div>
        <Button variant="ghost" className="hidden md:flex group" asChild>
          <Link href="/#products" title="View all products">
            View All
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            title={`View ${product.name}`}
          >
            <Card
              className="group card-hover border-0 shadow-sm overflow-hidden opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "forwards",
              }}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.images[0]?.url}
                    alt={product.name}
                    fill
                    className="object-cover img-zoom"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4 gap-2">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-base font-bold gradient-text">
                  {formatPrice(product.price)}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* Mobile View All Button */}
      <div className="mt-6 md:hidden">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/#products" title="View all products">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
