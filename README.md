# ShopHub - Scalable SEO with Next.js

A production-ready e-commerce storefront demonstrating how to build **SEO-optimized pages at scale** with Next.js 15 and Hygraph CMS. Even with thousands of product pages, every page maintains excellent SEO performance.

## 🚀 Key SEO Features

- **Dynamic Metadata Generation** - Each product page generates unique, optimized meta titles (40-60 chars) and descriptions (140-160 chars)
- **Automatic Sitemap** - Dynamically generates `sitemap.xml` from all products in your CMS
- **Robots.txt** - Proper crawler directives with sitemap reference
- **JSON-LD Structured Data** - Product, Organization, Website, and BreadcrumbList schemas
- **Open Graph & Twitter Cards** - Social sharing optimized for all pages
- **Static Generation (ISR)** - Pages are pre-rendered and revalidated every 30 minutes
- **Semantic HTML** - Proper heading hierarchy (H1, H2) and accessible markup
- **Anchor Title Attributes** - All links have descriptive titles for SEO and accessibility

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Hygraph (GraphQL Headless CMS)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Validation**: Zod

## 🛠️ Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd builderio-nextjs-integration
npm install
```

### 2. Environment Variables

Copy the example env file and fill in your values:

```bash
cp env.example .env.local
```

Required variables:

| Variable                  | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_HYGRAPH_URL` | Your Hygraph Content API endpoint                       |
| `HYGRAPH_TOKEN`           | Hygraph API token (for authenticated requests)          |
| `NEXT_PUBLIC_SITE_URL`    | Your production domain (e.g., `https://yourdomain.com`) |

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5555](http://localhost:5555) to view the site.

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Homepage with product grid
│   ├── products/[slug]/  # Dynamic product pages
│   ├── sitemap.ts        # Dynamic sitemap generation
│   ├── robots.ts         # Robots.txt configuration
│   ├── not-found.tsx     # Custom 404 page
│   └── layout.tsx        # Root layout with metadata
├── components/           # UI components
└── lib/
    ├── hygraph.ts        # GraphQL client & queries
    └── types.ts          # TypeScript types & Zod schemas
```

## 🔍 How SEO Scales

1. **ISR (Incremental Static Regeneration)** - Pages are statically generated at build time and revalidated on-demand, ensuring fast load times without sacrificing freshness.

2. **Dynamic `generateMetadata()`** - Each product page fetches its data and generates unique metadata, so thousands of pages each have proper SEO without manual effort.

3. **Automatic Sitemap** - The `sitemap.ts` queries all products from your CMS and generates a complete sitemap, updated with each deployment.

4. **Structured Data** - JSON-LD schemas are generated per-page with actual product data (name, price, availability), improving rich snippet eligibility.

## 📄 License

MIT
