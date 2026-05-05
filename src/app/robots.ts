import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/account/', '/checkout/'],
    },
    sitemap: 'https://brsshoppingmall.vercel.app/sitemap.xml',
  };
}
