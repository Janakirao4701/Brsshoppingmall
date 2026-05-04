export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category: "men" | "women" | "kids";
  subcategory: string;
  brand: string;
  sizes: string[];
  colors: string[];
  images: string[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  count: number;
}
