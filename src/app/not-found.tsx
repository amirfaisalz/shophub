"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold gradient-text leading-none animate-pulse-soft">
            404
          </h1>
          <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 animate-pulse" />
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          The page you&apos;re looking for seems to have wandered off.
          Don&apos;t worry, let&apos;s get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="gradient-primary text-white border-0 shadow-lg shadow-primary/25 btn-press w-full sm:w-auto"
            asChild
          >
            <Link href="/" title="Go to homepage">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/20 hover:bg-primary/5 btn-press w-full sm:w-auto"
            asChild
          >
            <Link href="/#products" title="Browse our products">
              <Search className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <button
            onClick={() =>
              typeof window !== "undefined" && window.history.back()
            }
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back to previous page
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl animate-float" />
        <div
          className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </div>
  );
}
