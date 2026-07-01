import { WithContext, Article, BlogPosting } from "schema-dts";

const baseUrl = "https://shopzone.com";

interface ArticleParams {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
}

export function buildArticleSchema(params: ArticleParams): WithContext<Article> {
  const articleUrl = `${baseUrl}/blog/${params.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    "headline": params.title,
    "description": params.description,
    "image": params.imageUrl,
    "datePublished": params.datePublished,
    "dateModified": params.dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "author": {
      "@type": "Person",
      "name": params.authorName,
      "url": `${baseUrl}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShopZone",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logoNewUpdate.png`
      }
    }
  };
}

export function buildBlogPostingSchema(params: ArticleParams): WithContext<BlogPosting> {
  const postUrl = `${baseUrl}/blog/${params.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#blogposting`,
    "headline": params.title,
    "description": params.description,
    "image": params.imageUrl,
    "datePublished": params.datePublished,
    "dateModified": params.dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "author": {
      "@type": "Person",
      "name": params.authorName,
      "url": `${baseUrl}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShopZone",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logoNewUpdate.png`
      }
    }
  };
}
