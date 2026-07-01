import { WithContext, FAQPage } from "schema-dts";

interface FAQItem {
  question: string;
  answer: string;
}

export function buildFAQSchema(faqs: FAQItem[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
