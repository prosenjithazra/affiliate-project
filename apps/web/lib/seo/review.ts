import { WithContext, Review } from "schema-dts";

const baseUrl = "https://shopzone.com";

interface ReviewParams {
  itemReviewedName: string;
  itemReviewedImage: string;
  reviewerName: string;
  reviewBody: string;
  ratingValue: number;
  url: string;
}

export function buildReviewSchema(params: ReviewParams): WithContext<Review> {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Product",
      "name": params.itemReviewedName,
      "image": params.itemReviewedImage
    },
    "author": {
      "@type": "Person",
      "name": params.reviewerName,
      "url": `${baseUrl}/about`
    },
    "reviewBody": params.reviewBody,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": params.ratingValue,
      "bestRating": "5",
      "worstRating": "1"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShopZone",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logoNewUpdate.png`
      }
    },
    "url": params.url
  };
}
