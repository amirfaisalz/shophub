// app/products/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  hygraph,
  GET_PRODUCT_QUERY,
  GET_ALL_PRODUCTS_SLUGS,
  GET_RELATED_PRODUCTS,
} from "@/lib/hygraph";
import { Product, ProductSchema } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import ProductImageGallery from "@/components/product-image-gallery";
import { Separator } from "@/components/ui/separator";
import { Truck, Shield, RotateCcw } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AddToCartButton from "@/components/add-to-cart-button";
import RelatedProducts from "@/components/related-products";

interface ProductPageParams {
  params: Promise<{ slug: string }>;
}

interface ProductResponse {
  products: Product[];
}

interface RelatedProductsResponse {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    images: Array<{ url: string }>;
  }>;
}

// ISR: Revalidate every 30 minutes
export const revalidate = 1800;

// Pre-compute a static priceValidUntil date (30 days from build/revalidation time)
// This avoids calling Date.now() during render, which React Compiler flags as impure
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const priceValidUntilDate = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();

// Generate static params at build time
export async function generateStaticParams() {
  const response = await hygraph.request<{ products: Array<{ slug: string }> }>(
    GET_ALL_PRODUCTS_SLUGS
  );

  return response.products.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProductPageParams): Promise<Metadata> {
  const { slug } = await params;
  const response = await hygraph.request<ProductResponse>(GET_PRODUCT_QUERY, {
    slug,
  });

  if (!response.products || response.products.length === 0) {
    return { title: "Product Not Found" };
  }

  const validProduct = ProductSchema.parse(response.products[0]);

  const title = `${validProduct.name} - Premium Quality | ShopHub Store`;
  const baseDescription = validProduct.description.slice(0, 100);
  const description = `${baseDescription}... Shop ${validProduct.name} at ShopHub. Free shipping on orders $50+!`;
  const image = validProduct.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}`,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
    other: {
      "product:price:amount": validProduct.price.toString(),
      "product:price:currency": "USD",
    },
  };
}

export default async function ProductPage({ params }: ProductPageParams) {
  const { slug } = await params;
  const response = await hygraph.request<ProductResponse>(GET_PRODUCT_QUERY, {
    slug,
  });

  if (!response.products || response.products.length === 0) {
    notFound();
  }

  const validProduct = ProductSchema.parse(response.products[0]);

  // Fetch related products
  let relatedProducts: RelatedProductsResponse["products"] = [];
  try {
    const relatedResponse = await hygraph.request<RelatedProductsResponse>(
      GET_RELATED_PRODUCTS,
      {
        excludeId: validProduct.id,
      }
    );
    relatedProducts = relatedResponse.products;
  } catch (error) {
    console.warn(`Failed to fetch related products for ${slug}:`, error);
    // Continue without related products
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return (
    <>
      {/* JSON-LD Structured Data - Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: validProduct.name,
            description: validProduct.description,
            image: validProduct.images.map((img) => img.url),
            brand: {
              "@type": "Brand",
              name: "ShopHub",
            },
            offers: {
              "@type": "Offer",
              price: validProduct.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: `${siteUrl}/products/${slug}`,
              priceValidUntil: priceValidUntilDate,
            },
          }),
        }}
      />

      {/* JSON-LD Structured Data - BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Products",
                item: `${siteUrl}/#products`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: validProduct.name,
                item: `${siteUrl}/products/${slug}`,
              },
            ],
          }),
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/#products"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {validProduct.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="animate-fade-in-up">
            <ProductImageGallery
              images={validProduct.images}
              productName={validProduct.name}
            />
          </div>

          {/* Product Info */}
          <div className="animate-fade-in-up stagger-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {validProduct.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold gradient-text">
                {formatPrice(validProduct.price)}
              </span>
            </div>

            {/* Description */}
            <h2 className="text-xl font-semibold mb-3">Product Description</h2>
            <p className="prose prose-gray dark:prose-invert max-w-none mb-6 text-muted-foreground">
              {validProduct.description}
            </p>

            <Separator className="my-6" />

            {/* Add to Cart */}
            <AddToCartButton />

            {/* Trust Badges */}
            <h2 className="sr-only">Why Shop With Us</h2>
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders $50+</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium">2-Year Warranty</p>
                <p className="text-xs text-muted-foreground">Guaranteed</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <RotateCcw className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </>
  );
}
