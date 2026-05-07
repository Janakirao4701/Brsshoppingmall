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
    title: t('men_title'),
    description: t('men_desc'),
  };
}

export default async function MenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getProducts({ category: "men" });

  return (
    <ProductGrid
      products={products}
      categoryTitle="Men's Collection"
      categoryDescription="Discover premium shirts, trousers, ethnic wear, and more from top brands. Quality garments for every occasion."
    />
  );
}
