-- BSR Shopping Mall - Product Catalog Schema
-- Run this in Supabase SQL Editor

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL,
  original_price INTEGER,
  category TEXT NOT NULL CHECK (category IN ('men', 'women', 'kids')),
  subcategory TEXT NOT NULL,
  brand TEXT NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bulk order inquiries
CREATE TABLE IF NOT EXISTS bulk_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  product_category TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Public insert for bulk inquiries (anyone can submit)
CREATE POLICY "Anyone can submit bulk inquiries"
  ON bulk_inquiries FOR INSERT
  WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
