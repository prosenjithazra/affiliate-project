import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes securely using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric price into a currency string (default USD)
 */
export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

/**
 * Formats a date into a clean, human-readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Generates a URL-friendly slug from string text
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

/**
 * Safe truncation of text for previews/cards
 */
export function truncate(text: string, length = 100): string {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Calculates discount percentage given current and old prices
 */
export function calculateDiscount(price: number, oldPrice?: number | null): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/**
 * Basic HTML/script tag sanitizer to assist in XSS prevention
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
