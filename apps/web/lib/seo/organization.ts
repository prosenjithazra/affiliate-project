import { WithContext, Organization, Corporation, ContactPoint } from "schema-dts";

const baseUrl = "https://shopzone.com";

export function buildContactPointSchema(): ContactPoint {
  return {
    "@type": "ContactPoint",
    "telephone": "+1-800-SHOPZONE",
    "contactType": "customer service",
    "areaServed": "US",
    "availableLanguage": ["en"]
  };
}

export function buildOrganizationSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "ShopZone",
    "url": baseUrl,
    "logo": `${baseUrl}/logoNewUpdate.png`,
    "sameAs": [
      "https://twitter.com/shopzone",
      "https://facebook.com/shopzone"
    ],
    "contactPoint": buildContactPointSchema()
  };
}

export function buildCorporationSchema(): WithContext<Corporation> {
  return {
    "@context": "https://schema.org",
    "@type": "Corporation",
    "@id": `${baseUrl}/#corporation`,
    "name": "ShopZone Inc.",
    "tickerSymbol": "PRIVATE",
    "url": baseUrl,
    "logo": `${baseUrl}/logoNewUpdate.png`,
    "contactPoint": buildContactPointSchema()
  };
}
