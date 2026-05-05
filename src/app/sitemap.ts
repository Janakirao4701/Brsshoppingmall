import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://brsshoppingmall.vercel.app';

  // Static routes
  const staticRoutes = [
    '',
    '/men',
    '/women',
    '/kids',
    '/bulk-orders',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes
  for (const route of staticRoutes) {
    sitemapEntries.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : 0.8,
    });
  }

  // Fetch dynamic products from Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_active', true);

      if (products) {
        for (const product of products) {
          sitemapEntries.push({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        }
      }
    }
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return sitemapEntries;
}
