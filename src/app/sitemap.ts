import { MetadataRoute } from "next";
import { hygraph, GET_ALL_PRODUCTS_SLUGS } from "@/lib/hygraph";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

    // Fetch all product slugs from Hygraph
    const response = await hygraph.request<{ products: Array<{ slug: string }> }>(
        GET_ALL_PRODUCTS_SLUGS
    );

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
    ];

    // Product pages
    const productPages: MetadataRoute.Sitemap = response.products.map(
        (product) => ({
            url: `${siteUrl}/products/${product.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        })
    );

    return [...staticPages, ...productPages];
}
