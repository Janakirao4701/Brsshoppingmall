import { getProducts, getProductBySlug } from "@/lib/products";
import { ProductDetail } from "@/components/products/ProductDetail";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products from same category
  const allProducts = await getProducts({ category: product.category });
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
