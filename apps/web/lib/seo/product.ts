import { WithContext, Product, Offer, AggregateRating, Brand } from "schema-dts";

const baseUrl = "https://shopzone.com";

export function buildBrandSchema(brandName: string): Brand {
  return {
    "@type": "Brand",
    "name": brandName
  };
}

export function buildOfferSchema(params: {
  price: number;
  priceCurrency?: string;
  availability?: string;
  url: string;
}): Offer {
  return {
    "@type": "Offer",
    "price": params.price,
    "priceCurrency": params.priceCurrency || "USD",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": (params.availability || "https://schema.org/InStock") as any,
    "url": params.url,
    "priceValidUntil": "2030-01-01"
  };
}

export function buildAggregateRatingSchema(params: {
  ratingValue: number;
  reviewCount: number;
}): AggregateRating {
  return {
    "@type": "AggregateRating",
    "ratingValue": params.ratingValue,
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": params.reviewCount || 1
  };
}

export function buildProductSchema(params: {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  price: number;
  oldPrice?: number;
  ratingValue: number;
  reviewCount: number;
  brandName?: string;
  affiliateUrl: string;
}): WithContext<Product> {
  const productUrl = `${baseUrl}/products/${params.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    "name": params.name,
    "image": params.imageUrl,
    "description": params.description,
    "sku": params.id,
    "mpn": params.id,
    "brand": params.brandName ? buildBrandSchema(params.brandName) : undefined,
    "offers": buildOfferSchema({
      price: params.price,
      url: params.affiliateUrl
    }),
    "aggregateRating": buildAggregateRatingSchema({
      ratingValue: params.ratingValue,
      reviewCount: params.reviewCount
    })
  };
}
