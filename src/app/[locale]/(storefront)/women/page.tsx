import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Collection | BSR Shopping Mall",
  description: "Explore the latest trends in sarees, kurtas, western wear, and bridal collections at BSR Shopping Mall. Elegant fashion for every woman.",
};

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
