"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SORT_OPTIONS, SortOption } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X, SlidersHorizontal, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProductFiltersProps {
  maxPrice: number;
}

export default function ProductFilters({ maxPrice }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get current filter values from URL
  const priceRange = [
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || maxPrice,
  ];
  const sortBy = (searchParams.get("sort") as SortOption) || "newest";

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      return params.toString();
    },
    [searchParams]
  );

  const updateFilters = (updates: Record<string, string | null>) => {
    startTransition(() => {
      const queryString = createQueryString(updates);
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    });
  };

  const handlePriceChange = (values: number[]) => {
    updateFilters({
      minPrice: values[0] > 0 ? values[0].toString() : null,
      maxPrice: values[1] < maxPrice ? values[1].toString() : null,
    });
  };

  const handleSortChange = (value: SortOption) => {
    updateFilters({
      sort: value !== "newest" ? value : null,
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters =
    priceRange[0] > 0 || priceRange[1] < maxPrice || sortBy !== "newest";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Filters</h2>
          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      {/* Sort */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Sort By</Label>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Accordion Filters */}
      <Accordion type="multiple" defaultValue={["price"]} className="space-y-2">
        {/* Price Range */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="hover:no-underline py-3">
            <span className="font-medium">Price Range</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={maxPrice}
                step={10}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
