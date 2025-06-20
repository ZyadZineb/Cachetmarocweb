
import { useEffect } from 'react';

interface HrefLangTag {
  lang: string;
  url: string;
}

interface MetaProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  ogUrl?: string;
  structuredData?: any;
  hrefLangTags?: HrefLangTag[];
}

export const useMetaTags = ({
  title,
  description,
  keywords = 'stamps, custom stamps, self-inking stamps, cachets, Morocco',
  ogImage = 'https://lovable.dev/opengraph-image-p98pqg.png',
  ogType = 'website',
  ogUrl,
  structuredData,
  hrefLangTags
}: MetaProps) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Cachets Maroc`;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
    
    // Update Open Graph tags
    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', `${title} | Cachets Maroc`);
    }
    
    let ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionMeta) {
      ogDescriptionMeta.setAttribute('content', description);
    }
    
    let ogTypeMeta = document.querySelector('meta[property="og:type"]');
    if (ogTypeMeta) {
      ogTypeMeta.setAttribute('content', ogType);
    }
    
    let ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      ogImageMeta.setAttribute('content', ogImage);
    }
    
    let ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta && ogUrl) {
      ogUrlMeta.setAttribute('content', ogUrl);
    }
    
    // Handle hreflang tags for multi-language support
    if (hrefLangTags && hrefLangTags.length > 0) {
      // Remove any existing hreflang tags
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
      
      // Add new hreflang tags
      hrefLangTags.forEach(tag => {
        const linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'alternate');
        linkEl.setAttribute('hreflang', tag.lang);
        linkEl.setAttribute('href', tag.url);
        document.head.appendChild(linkEl);
      });
    }
    
    // Add structured data if provided
    if (structuredData) {
      let existingScript = document.querySelector('#structured-data-script');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.id = 'structured-data-script';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    
    return () => {
      // Clean up structured data when component unmounts
      const script = document.querySelector('#structured-data-script');
      if (script && structuredData) {
        script.remove();
      }
      
      // Clean up hreflang tags
      if (hrefLangTags && hrefLangTags.length > 0) {
        document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
      }
    };
  }, [title, description, keywords, ogImage, ogType, ogUrl, structuredData, hrefLangTags]);
};

// Helper to generate product structured data
export const generateProductSchema = (product: any) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://cachets-maroc.com/products/${product.id}`,
      "priceCurrency": "MAD",
      "price": product.price,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };
};

// Helper to generate organization schema
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cachets Maroc",
    "url": "https://cachets-maroc.com",
    "logo": "https://cachets-maroc.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+212-699-118-028",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://facebook.com/cachetsmaroc",
      "https://instagram.com/cachetsmaroc"
    ]
  };
};
