// app/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { hygraph, GET_ALL_PRODUCTS } from "@/lib/hygraph";
import { ProductListItem, SortOption } from "@/lib/types";
import HeroSection from "@/components/hero-section";
import ProductGrid from "@/components/product-grid";
import ProductFilters from "@/components/product-filters";
import ProductCardSkeleton from "@/components/product-card-skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

// ISR: Revalidate every 30 minutes
export const revalidate = 1800;

// Site metadata for SEO
export const metadata: Metadata = {
  title: "ShopHub | Premium Products & Top Quality Essentials",
  description:
    "Discover ShopHub's curated collection of premium products crafted with care for your lifestyle. Free shipping on orders over $50. Shop now!",
  keywords: ["products", "premium", "fashion", "accessories", "shopping"],
  openGraph: {
    title: "ShopHub | Premium Products & Top Quality Essentials",
    description:
      "Discover ShopHub's curated collection of premium products crafted with care for your lifestyle. Free shipping on orders over $50. Shop now!",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "ShopHub",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "ShopHub - Premium Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopHub | Premium Products & Top Quality Essentials",
    description:
      "Discover ShopHub's curated collection of premium products crafted with care for your lifestyle. Free shipping on orders over $50. Shop now!",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface SearchParams {
  minPrice?: string;
  maxPrice?: string;
  sort?: SortOption;
}

interface ProductsResponse {
  products: ProductListItem[];
}

async function getProducts(
  searchParams: SearchParams
): Promise<ProductListItem[]> {
  const sortMap: Record<SortOption, string> = {
    newest: "createdAt_DESC",
    price_asc: "price_ASC",
    price_desc: "price_DESC",
  };

  const orderBy = sortMap[searchParams.sort || "newest"] || "createdAt_DESC";

  const response = await hygraph.request<ProductsResponse>(GET_ALL_PRODUCTS, {
    orderBy,
  });

  let products = response.products;

  // Client-side filtering
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : null;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : null;

  if (minPrice !== null) {
    products = products.filter((p) => p.price >= minPrice);
  }

  if (maxPrice !== null) {
    products = products.filter((p) => p.price <= maxPrice);
  }

  return products;
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

interface ProductsSectionProps {
  searchParams: Promise<SearchParams>;
}

async function ProductsSection({ searchParams }: ProductsSectionProps) {
  const params = await searchParams;
  const products = await getProducts(params);

  // Calculate max price for filter slider
  const allPrices = products.map((p) => p.price);
  const maxPrice =
    allPrices.length > 0 ? Math.ceil(Math.max(...allPrices)) : 1000;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Desktop Filters Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-card rounded-xl border p-6">
          <ProductFilters maxPrice={maxPrice} />
        </div>
      </aside>

      {/* Products */}
      <div className="flex-1">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters & Sort
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <ProductFilters maxPrice={maxPrice} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {products.length}
            </span>{" "}
            products
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}

interface HomePageProps {
  searchParams: Promise<SearchParams>;
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <>
      {/* JSON-LD Structured Data - WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "ShopHub",
            url: process.env.NEXT_PUBLIC_SITE_URL,
            description:
              "Premium products. Crafted with care, designed for your lifestyle.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* JSON-LD Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ShopHub",
            url: process.env.NEXT_PUBLIC_SITE_URL,
            logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+1-555-555-5555",
              contactType: "customer service",
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
                item: process.env.NEXT_PUBLIC_SITE_URL,
              },
            ],
          }),
        }}
      />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Products Section */}
        <section id="products" className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Collection</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our handpicked selection of premium products
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductsSection searchParams={searchParams} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
