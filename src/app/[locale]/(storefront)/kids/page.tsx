import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kids' Collection | BSR Shopping Mall",
  description: "Shop comfortable and stylish clothing for kids of all ages. From infants to teens, we have the perfect outfit for your little ones.",
};

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
