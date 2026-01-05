import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse-soft" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                             linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in-down">
            <Sparkles className="h-4 w-4" />
            <span>Premium Quality Products</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up">
            Discover Your Perfect <span className="gradient-text">Style</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up stagger-1">
            Explore our curated collection of premium bags and accessories.
            Crafted with care, designed for your lifestyle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-2">
            <Button
              size="lg"
              className="gradient-primary text-white border-0 shadow-lg shadow-primary/25 btn-press group"
              asChild
            >
              <Link href="#products" title="Shop now - browse our products">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/20 hover:bg-primary/5 btn-press"
              asChild
            >
              <Link href="/categories" title="Browse product categories">
                Browse Categories
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50 animate-fade-in-up stagger-3">
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">500+</p>
              <p className="text-sm text-muted-foreground mt-1">Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">50k+</p>
              <p className="text-sm text-muted-foreground mt-1">
                Happy Customers
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">4.9★</p>
              <p className="text-sm text-muted-foreground mt-1">
                Average Rating
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
