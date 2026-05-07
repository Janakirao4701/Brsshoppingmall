-- ==========================================
-- BSR SHOPPING MALL - SECURITY HARDENING
-- ==========================================

-- 1. Create Profiles Table if it doesn't exist
-- (This stores user roles and is linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  full_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Helper function for admin checks
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (role = 'admin')
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Profiles Policies
-- Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Only admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (is_admin());

-- 4. Orders Policies (Hardened)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Admins have full control
DROP POLICY IF EXISTS "Admins have full access to orders" ON orders;
CREATE POLICY "Admins have full access to orders"
  ON orders FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Customers can view their own orders (Based on email)
DROP POLICY IF EXISTS "Customers can view own orders" ON orders;
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (customer_email = auth.jwt() ->> 'email');

-- 5. Bulk Inquiries Policies (Hardened)
ALTER TABLE bulk_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public to submit inquiries (Required for the form to work)
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON bulk_inquiries;
CREATE POLICY "Anyone can submit inquiries"
  ON bulk_inquiries FOR INSERT
  WITH CHECK (true);

-- Only admins can manage bulk inquiries (Read/Update/Delete)
DROP POLICY IF EXISTS "Admins can manage bulk inquiries" ON bulk_inquiries;
CREATE POLICY "Admins can manage bulk inquiries"
  ON bulk_inquiries FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 6. Products Policies (Hardened Write Access)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
