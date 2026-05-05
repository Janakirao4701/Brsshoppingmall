import { getProducts } from "@/lib/products";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { ShopPageClient } from "./ShopPageClient";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SEO' });

  return {
    title: "Shop All Collections | BSR Shopping Mall",
    description: "Browse our complete collection of premium readymade garments for Men, Women, and Kids.",
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch all categories in parallel
  const [menProducts, womenProducts, kidsProducts] = await Promise.all([
    getProducts({ category: "men" }),
    getProducts({ category: "women" }),
    getProducts({ category: "kids" }),
  ]);

  return (
    <ShopPageClient
      menProducts={menProducts}
      womenProducts={womenProducts}
      kidsProducts={kidsProducts}
    />
  );
}
