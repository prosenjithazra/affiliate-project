import { Metadata } from "next";
import { baseUrl } from "./metadata";

export interface MetadataPayload {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  updatedAt?: Date;
}

export function generateDynamicMetadata(
  type: "product" | "category" | "brand" | "blog" | "review",
  data: MetadataPayload
): Metadata {
  const canonicalUrl = `${baseUrl}/${type === "blog" ? "blog" : type === "product" ? "products" : "search"}/${data.slug}`;
  const title = `${data.name} - ShopZone`;
  const defaultImage = `${baseUrl}/og-image.jpg`;
  const image = data.imageUrl || defaultImage;

  return {
    title,
    description: data.description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description: data.description,
      url: canonicalUrl,
      type: type === "blog" ? "article" : "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${data.name} Showcase Banner`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: data.description,
      images: [image]
    }
  };
}
