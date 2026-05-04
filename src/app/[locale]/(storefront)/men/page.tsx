import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Collection | BSR Shopping Mall",
  description: "Discover premium shirts, trousers, ethnic wear, and more from top brands at BSR Shopping Mall. Quality garments for every occasion.",
};

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
