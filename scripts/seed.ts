import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use the SERVICE_ROLE key for bypassing RLS during seed, or ANON_KEY if RLS allows inserts.
// If using ANON_KEY, make sure your RLS policies allow inserts!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// We will use the mock products from our data file
// (In a real scenario, you'd read from a CSV or JSON file)
const mockProducts = [
  {
    name: "Classic Cotton Solid Shirt",
    slug: "classic-cotton-solid-shirt",
    description: "Premium 100% cotton casual shirt perfect for everyday wear. Features a comfortable fit and breathable fabric.",
    price: 999,
    original_price: 1499,
    category: "men",
    subcategory: "Shirts",
    brand: "BSR Originals",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Navy", "Black"],
    images: ["https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=600&auto=format&fit=crop"],
    in_stock: true,
    featured: true
  },
  {
    name: "Designer Silk Saree",
    slug: "designer-silk-saree",
    description: "Elegant silk saree with intricate zari work. Perfect for weddings and festive occasions.",
    price: 4999,
    original_price: 6999,
    category: "women",
    subcategory: "Sarees",
    brand: "Kanchi Weavers",
    sizes: ["Free Size"],
    colors: ["Red", "Green", "Gold"],
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop"],
    in_stock: true,
    featured: true
  },
  {
    name: "Kids Party Wear Frock",
    slug: "kids-party-wear-frock",
    description: "Beautiful princess-style frock for girls. Made with soft, non-itchy premium net fabric.",
    price: 1299,
    original_price: 1999,
    category: "kids",
    subcategory: "Party Wear",
    brand: "Little Angels",
    sizes: ["2-3Y", "4-5Y", "6-7Y"],
    colors: ["Pink", "Blue"],
    images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop"],
    in_stock: true,
    featured: false
  },
  {
    name: "Men's Slim Fit Denim",
    slug: "mens-slim-fit-denim",
    description: "Stretchable slim-fit jeans for all-day comfort. Classic blue wash.",
    price: 1499,
    original_price: 2499,
    category: "men",
    subcategory: "Jeans",
    brand: "Denim Co.",
    sizes: ["30", "32", "34", "36"],
    colors: ["Blue", "Dark Blue", "Black"],
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop"],
    in_stock: true,
    featured: false
  },
  {
    name: "Women's Floral Kurti",
    slug: "womens-floral-kurti",
    description: "Daily wear cotton kurti with beautiful floral prints. Straight cut.",
    price: 699,
    original_price: 999,
    category: "women",
    subcategory: "Kurtis",
    brand: "Aurelia",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Yellow", "Pink", "White"],
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop"],
    in_stock: true,
    featured: true
  }
];

async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  for (const product of mockProducts) {
    console.log(`Inserting: ${product.name}...`);
    
    const { data, error } = await supabase
      .from("products")
      .upsert(
        product, 
        { onConflict: 'slug' } // Prevent duplicates if you run it twice
      );

    if (error) {
      console.error(`❌ Error inserting ${product.name}:`, error.message);
    } else {
      console.log(`✅ Success: ${product.name}`);
    }
  }

  console.log("🎉 Seeding complete!");
}

seedDatabase();
