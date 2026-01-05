"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";

export default function AddToCartButton() {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAdded(true);
    setIsAdding(false);
    setTimeout(() => setAdded(false), 2000);
  };

  const maxQuantity = 99;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="font-medium text-sm">
          Quantity:
        </label>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2.5 hover:bg-muted transition-colors disabled:opacity-50"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            id="quantity"
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.min(
                  maxQuantity,
                  Math.max(1, parseInt(e.target.value) || 1)
                )
              )
            }
            className="w-14 text-center py-2.5 border-x border-border bg-transparent focus:outline-none"
          />
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            className="px-3 py-2.5 hover:bg-muted transition-colors disabled:opacity-50"
            disabled={quantity >= maxQuantity}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isAdding || added}
        size="lg"
        className={`
          w-full h-14 text-base font-semibold btn-press
          ${
            added
              ? "bg-green-500 hover:bg-green-600"
              : "gradient-primary hover:opacity-90"
          }
          text-white border-0 shadow-lg shadow-primary/25
          transition-all duration-300
        `}
      >
        {added ? (
          <span className="flex items-center gap-2 animate-scale-in">
            <Check className="h-5 w-5" />
            Added to Cart!
          </span>
        ) : isAdding ? (
          <span className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Adding...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </span>
        )}
      </Button>

      {/* Buy Now Button */}
      <Button
        variant="outline"
        size="lg"
        className="w-full h-12 border-primary/30 hover:bg-primary/5 hover:border-primary font-medium btn-press"
      >
        Buy Now
      </Button>
    </div>
  );
}
