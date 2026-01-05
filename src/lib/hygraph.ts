import { GraphQLClient } from 'graphql-request'

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_URL!

export const hygraph = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
  },
})

// Public client for client-side queries
export const hygraphPublic = new GraphQLClient(endpoint)

// GraphQL Queries - Using only the most basic fields
export const GET_PRODUCT_QUERY = `
  query GetProduct($slug: String!) {
    products(where: { slug: $slug }, first: 1) {
      id
      name
      slug
      price
      description
      images {
        url
        width
        height
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_ALL_PRODUCTS_SLUGS = `
  query GetAllProductsSlugs {
    products {
      slug
    }
  }
`

// Get all products for listing page - minimal fields only
export const GET_ALL_PRODUCTS = `
  query GetAllProducts($orderBy: ProductOrderByInput) {
    products(orderBy: $orderBy) {
      id
      name
      slug
      price
      images(first: 2) {
        url
        width
        height
      }
    }
  }
`

// Get all categories
export const GET_ALL_CATEGORIES_FULL = `
  query GetAllCategoriesFull {
    categories {
      name
      slug
    }
  }
`

export const GET_PRODUCTS_BY_CATEGORY = `
  query GetProductsByCategory($categorySlug: String!) {
    products(where: { category: { slug: $categorySlug } }, orderBy: createdAt_DESC) {
      id
      name
      slug
      price
      images(first: 1) {
        url
      }
    }
  }
`

export const GET_ALL_CATEGORIES = `
  query GetAllCategories {
    categories {
      name
      slug
    }
  }
`

export const GET_RELATED_PRODUCTS = `
  query GetRelatedProducts($excludeId: ID!) {
    products(
      where: {
        id_not: $excludeId
      }
      first: 4
    ) {
      id
      name
      slug
      price
      images(first: 1) {
        url
      }
    }
  }
`