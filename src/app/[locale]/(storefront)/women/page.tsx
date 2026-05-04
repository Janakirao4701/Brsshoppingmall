import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { setRequestLocale } from "next-intl/server";

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
