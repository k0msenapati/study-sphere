// components/SEO.tsx
import Head from 'next/head';

const SEO = ({ title, description, url, image }: any) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content="study, ai notes, quizzes, flashcards, learning, education, study sphere" />
    <meta name="author" content="Study Sphere Team" />

    {/* Open Graph Meta Tags for social media sharing */}
        <meta property="og:type" content="website" /> {/* Type of object */}
        <meta property="og:title" content={title} /> {/* Title shown when shared */}
        <meta property="og:description" content={description} /> {/* Description in preview */}
        <meta property="og:image" content={image} /> {/* Thumbnail/OG banner */}
        <meta property="og:url" content={url} /> {/* Canonical URL */}

        {/* Twitter-specific Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
  </Head>
);

export default SEO;
