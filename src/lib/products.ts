import { supabase } from "@/lib/supabase";
import { MOCK_PRODUCTS } from "@/data/products";
import { Product } from "@/lib/types";

/**
 * Fetch all products — from Supabase if configured, otherwise mock data.
 */
export async function getProducts(filters?: {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}): Promise<Product[]> {
  if (supabase) {
    let query = supabase.from("products").select("*");

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }
    if (filters?.subcategory) {
      query = query.eq("subcategory", filters.subcategory);
    }
    if (filters?.brand) {
      query = query.eq("brand", filters.brand);
    }
    if (filters?.minPrice) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters?.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }
    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return MOCK_PRODUCTS;
    }

    return (data as Product[]) ?? [];
  }

  // Fallback to mock data
  let products = [...MOCK_PRODUCTS];

  if (filters?.category) {
    products = products.filter((p) => p.category === filters.category);
  }
  if (filters?.subcategory) {
    products = products.filter((p) => p.subcategory === filters.subcategory);
  }
  if (filters?.brand) {
    products = products.filter((p) => p.brand === filters.brand);
  }
  if (filters?.minPrice) {
    products = products.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice) {
    products = products.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  return products;
}

/**
 * Fetch a single product by slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
    }

    return data as Product;
  }

  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

/**
 * Get unique brands for filter UI.
 */
export function getBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brand))].sort();
}

/**
 * Get unique subcategories for filter UI.
 */
export function getSubcategories(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.subcategory))].sort();
}

/**
 * Get price range for filter UI.
 */
export function getPriceRange(products: Product[]): { min: number; max: number } {
  const prices = products.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
