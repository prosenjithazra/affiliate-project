export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string; // URL to image
  icon: string;  // Lucide icon name or emoji
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    products: number;
  };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string; // URL to logo
  description: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    products: number;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  order: number;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null; // percentage e.g., 20
  rating: number; // e.g. 4.5
  affiliateStore: string; // e.g., Amazon, Walmart
  affiliateUrl: string; // Target external URL
  features: string[]; // List of key features
  specifications: Record<string, string>; // Spec key-values
  pros: string[];
  cons: string[];
  tags: string[];
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  featured: boolean;
  trending: boolean;
  topDeal: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  categoryId: string;
  brandId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  category?: Category;
  brand?: Brand;
  images?: ProductImage[];
}

export interface AffiliateClick {
  id: string;
  productId: string;
  product?: Product;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  clickedAt: Date;
}

export interface Settings {
  id: string;
  websiteName: string;
  logo?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  socialLinks: Record<string, string>; // e.g. { twitter: '...', facebook: '...' }
  footerText?: string | null;
  contactEmail?: string | null;
  googleAnalyticsId?: string | null;
  updatedAt: Date;
}

// Wishlist item helper
export interface WishlistItem {
  productId: string;
  addedAt: Date;
  product?: Product;
}

// Search and Filter DTOs
export interface ProductFilters {
  query?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  featured?: boolean;
  trending?: boolean;
  topDeal?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "discount_desc" | "rating_desc";
  page?: number;
  limit?: number;
}
