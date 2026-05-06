import { getProducts } from "@/lib/products";
export const dynamic = "force-dynamic";

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
    title: t('kids_title'),
    description: t('kids_desc'),
  };
}

export default async function KidsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getProducts({ category: "kids" });

  return (
    <ProductGrid
      products={products}
      categoryTitle="Kids' Collection"
      categoryDescription="Fun, colorful, and comfortable clothing for your little ones. From casual wear to party outfits."
    />
  );
}
