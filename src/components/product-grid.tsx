import { ProductListItem, ProductListItemSchema } from "@/lib/types";
import ProductCard from "@/components/product-card";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: ProductListItem[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // Validate products with schema
  const validProducts = products
    .map((product) => {
      try {
        return ProductListItemSchema.parse(product);
      } catch {
        return null;
      }
    })
    .filter((p): p is ProductListItem => p !== null);

  if (validProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your filters or check back later for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {validProducts.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
