import { WithContext, BreadcrumbList } from "schema-dts";

const baseUrl = "https://shopzone.com";

interface BreadcrumbItem {
  name: string;
  itemPath: string; // relative path from host, e.g., "/products"
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.name,
      "item": `${baseUrl}${item.itemPath}`
    }))
  };
}
