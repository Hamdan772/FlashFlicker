import Script from 'next/script';

export default function StructuredData() {
  const webApplicationData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FlashFlicker",
    "alternateName": ["Flash Flicker", "FlashFlicker AI", "Flash Flicker Study App"],
    "description": "AI-powered study platform with flashcards, quizzes, and personalized learning tools",
    "url": "https://flash-flicker.vercel.app",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0.0",
    "datePublished": "2025-01-02",
    "dateModified": "2025-01-02",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "AI Flashcard Generator",
      "Smart Quiz Creation", 
      "AI Study Coach",
      "Progress Tracking",
      "Gamification System",
      "Note Summarization",
      "Rich Text Editor",
      "Study Analytics",
      "Achievement Badges",
      "Streak Tracking"
    ],
    "screenshot": "https://flash-flicker.vercel.app/og-image.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Person",
      "name": "Hamdan Nishad",
      "url": "https://github.com/Hamdan772"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FlashFlicker",
      "url": "https://flash-flicker.vercel.app"
    }
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FlashFlicker",
    "alternateName": "Flash Flicker",
    "url": "https://flash-flicker.vercel.app",
    "logo": "https://flash-flicker.vercel.app/logo.png",
    "description": "Leading AI-powered study platform helping students achieve academic success through intelligent flashcards, quizzes, and personalized learning experiences.",
    "foundingDate": "2025",
    "applicationCategory": "Educational Technology",
    "sameAs": [
      "https://github.com/Hamdan772/FlashFlicker",
      "https://flashflicker.netlify.app"
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FlashFlicker",
    "alternateName": "Flash Flicker",
    "url": "https://flash-flicker.vercel.app",
    "description": "AI-powered study platform with smart flashcards, quizzes, and personalized learning tools",
    "inLanguage": "en-US",
    "copyrightYear": "2025",
    "creator": {
      "@type": "Person",
      "name": "Hamdan Nishad"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://flash-flicker.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Script
        id="structured-data-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationData)
        }}
      />
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      <Script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
    </>
  );
}