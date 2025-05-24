// ========================================
// FRONTEND - src/components/SEO.js
// ========================================

import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'ChecklistPro - Professional Industry Checklists',
  description = 'Save time, avoid costly mistakes, and ensure thoroughness with our expert-level checklist packages designed for niche industries.',
  keywords = 'business checklists, industry guides, professional templates, startup resources',
  image = '/images/og-image.jpg',
  url = window.location.href,
  type = 'website',
  noIndex = false,
  structured = null
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ChecklistPro" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@checklistpro" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      {structured && (
        <script type="application/ld+json">
          {JSON.stringify(structured)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;