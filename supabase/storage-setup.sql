-- ==========================================
-- Run this in Supabase SQL Editor FIRST
-- before uploading images from Admin
-- ==========================================

-- 1. Create the 'products' storage bucket (public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public READ access to product images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- 3. Allow authenticated or anon uploads (for admin form)
CREATE POLICY "Allow uploads to products bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

-- 4. Allow deletes from products bucket
CREATE POLICY "Allow deletes from products bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');
