import { supabase } from "@/lib/supabase";
import { MOCK_PRODUCTS } from "@/data/products";
import { Product } from "@/lib/types";

// Helper to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "placeholder"
  );
};

/**
 * Fetch all products — from Supabase if configured, otherwise fallback to mock data in development.
 */
export async function getProducts(filters?: {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from("products")
        .select("*, categories!inner(slug), brands(name), product_variants(*)");

      if (filters?.category) {
        // Filter by the slug in the joined categories table
        query = query.eq("categories.slug", filters.category);
      }
      if (filters?.subcategory) {
        query = query.eq("subcategory", filters.subcategory);
      }
      if (filters?.brand) {
        // Filter by the brand ID (UUID)
        query = query.eq("brand_id", filters.brand);
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
        console.error("Supabase error fetching products:", error);
        return process.env.NODE_ENV === "development" ? (MOCK_PRODUCTS as any[]) : [];
      }

      // Map relational data to match the Product interface
      return (data as any[]).map(p => ({
        ...p,
        category: p.categories?.slug || p.category // fallback if column exists
      })) ?? [];
    } catch (err) {
      console.error("Unexpected error fetching products:", err);
      return process.env.NODE_ENV === "development" ? (MOCK_PRODUCTS as any[]) : [];
    }
  }

  // Fallback to mock data
  if (process.env.NODE_ENV === "development") {
    let products = [...MOCK_PRODUCTS];
    return products as any[];
  }

  return [];
}

/**
 * Fetch a single product by slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(slug), brands(name), product_variants(*)")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Map relational data
      return {
        ...data,
        category: (data as any).categories?.slug || (data as any).category
      } as any;
    } catch (err) {
      console.error("Error fetching product by slug:", err);
      return null;
    }
  }
  return (MOCK_PRODUCTS.find(p => p.slug === slug) as any) || null;
}

/**
 * Get unique brands for filter UI.
 */
export function getBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brand?.name || "BSR"))].filter(Boolean) as string[];
}

/**
 * Get unique subcategories for filter UI.
 */
export function getSubcategories(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.subcategory))].filter(Boolean).sort();
}

/**
 * Get price range for filter UI.
 */
export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
