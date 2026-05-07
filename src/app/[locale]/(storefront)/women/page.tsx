import { getProducts } from "@/lib/products";

import { ProductGrid } from "@/components/products/ProductGrid";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SEO' });

  return {
    title: t('women_title'),
    description: t('women_desc'),
  };
}

export default async function WomenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getProducts({ category: "women" });

  return (
    <ProductGrid
      products={products}
      categoryTitle="Women's Collection"
      categoryDescription="Explore elegant sarees, trendy kurtas, western wear, and ethnic sets. Curated fashion for every woman."
    />
  );
}
