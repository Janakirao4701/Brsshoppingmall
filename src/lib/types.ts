export type CategorySlug = "men" | "women" | "kids" | "accessories" | "footwear";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category: CategorySlug;
  subcategory: string;
  brand_id?: string;
  collection?: string;
  material?: string;
  fit?: string;
  images: string[]; // Gallery
  featured: boolean;
  status: "draft" | "active" | "archived";
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  
  // Relations
  variants?: ProductVariant[];
  brand?: Brand;
  
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  color_code?: string; // Hex for UI swatches
  stock: number;
  price_override?: number;
  image_index?: number; // Links to a specific image in the product gallery
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  parent_id?: string; // For subcategories
  count?: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  total: number;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  variant_id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}
