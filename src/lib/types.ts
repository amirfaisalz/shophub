import { z } from 'zod'

export const ProductImageSchema = z.object({
    url: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
})

export const CategorySchema = z.object({
    name: z.string(),
    slug: z.string(),
})

// Product schema - flexible to handle varying Hygraph setups
export const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    price: z.number(),
    description: z.string(),
    images: z.array(ProductImageSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
})

// Lightweight product schema for listing pages
export const ProductListItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    price: z.number(),
    images: z.array(ProductImageSchema),
})

// Category schema
export const CategoryFullSchema = z.object({
    name: z.string(),
    slug: z.string(),
})

export type Product = z.infer<typeof ProductSchema>
export type ProductImage = z.infer<typeof ProductImageSchema>
export type Category = z.infer<typeof CategorySchema>
export type ProductListItem = z.infer<typeof ProductListItemSchema>
export type CategoryFull = z.infer<typeof CategoryFullSchema>

export const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
] as const

export type SortOption = typeof SORT_OPTIONS[number]['value']