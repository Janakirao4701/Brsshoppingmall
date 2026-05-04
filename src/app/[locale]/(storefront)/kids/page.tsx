import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { setRequestLocale } from "next-intl/server";

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
