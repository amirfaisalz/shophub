import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardSkeletonProps {
  index?: number;
}

export default function ProductCardSkeleton({
  index = 0,
}: ProductCardSkeletonProps) {
  return (
    <Card
      className="overflow-hidden border-0 shadow-sm opacity-0 animate-fade-in"
      style={{
        animationDelay: `${index * 0.05}s`,
        animationFillMode: "forwards",
      }}
    >
      <CardContent className="p-0">
        {/* Image skeleton */}
        <div className="relative aspect-4/5 skeleton-shimmer" />
      </CardContent>

      <CardFooter className="flex flex-col items-start p-4 gap-3">
        {/* Category skeleton */}
        <Skeleton className="h-3 w-16" />

        {/* Title skeleton */}
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3 w-8" />
        </div>

        {/* Price skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
      </CardFooter>
    </Card>
  );
}
