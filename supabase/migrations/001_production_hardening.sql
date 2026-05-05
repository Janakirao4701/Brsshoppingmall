-- ============================================================
-- BSR Shopping Mall: Production Database Hardening Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. ADD MISSING COLUMNS TO ORDERS TABLE
-- ============================================================

-- Idempotency key for duplicate order prevention
ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE;

-- Payment tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS webhook_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS webhook_amount_paise INTEGER;

-- Error tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_error_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_error_description TEXT;

-- 2. ADD UNIQUE CONSTRAINTS (prevent duplicates)
-- ============================================================

-- Unique constraint on razorpay_order_id (prevent duplicate orders)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_razorpay_order_id_unique'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_razorpay_order_id_unique UNIQUE (razorpay_order_id);
  END IF;
END $$;

-- Unique constraint on razorpay_payment_id (prevent duplicate payment processing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_razorpay_payment_id_unique'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_razorpay_payment_id_unique UNIQUE (razorpay_payment_id);
  END IF;
END $$;


-- 3. INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);


-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent migration)
DROP POLICY IF EXISTS "Service role has full access to orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Service role has full access to bulk_inquiries" ON bulk_inquiries;
DROP POLICY IF EXISTS "Anyone can submit bulk inquiries" ON bulk_inquiries;
DROP POLICY IF EXISTS "Admins can view bulk inquiries" ON bulk_inquiries;

-- ORDERS: Service role (API routes) has full access
CREATE POLICY "Service role has full access to orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ORDERS: Users can view their own orders (by phone match or auth ID)
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND (
      customer_phone = (
        SELECT phone FROM auth.users WHERE id = auth.uid()
      )
      OR customer_email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- PRODUCTS: Anyone can read (public catalog)
CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  USING (true);

-- PRODUCTS: Only admins can modify
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- BULK INQUIRIES: Service role full access (API routes)
CREATE POLICY "Service role has full access to bulk_inquiries"
  ON bulk_inquiries FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- BULK INQUIRIES: Anyone can submit (public form)
CREATE POLICY "Anyone can submit bulk inquiries"
  ON bulk_inquiries FOR INSERT
  WITH CHECK (true);

-- BULK INQUIRIES: Only admins can view
CREATE POLICY "Admins can view bulk inquiries"
  ON bulk_inquiries FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );


-- 5. SETTINGS TABLE RLS
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'settings') THEN
    ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Anyone can read settings" ON settings;
    DROP POLICY IF EXISTS "Admins can manage settings" ON settings;

    CREATE POLICY "Anyone can read settings"
      ON settings FOR SELECT
      USING (true);

    CREATE POLICY "Admins can manage settings"
      ON settings FOR ALL
      USING (
        auth.role() = 'service_role'
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
      WITH CHECK (
        auth.role() = 'service_role'
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;


-- 6. PROFILES TABLE RLS
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role has full access to profiles" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role has full access to profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


-- 7. ATOMIC INVENTORY DECREMENT FUNCTION (prevents overselling)
-- ============================================================

CREATE OR REPLACE FUNCTION decrement_stock(
  p_product_id UUID,
  p_size TEXT,
  p_quantity INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_stock INTEGER;
BEGIN
  -- Lock the row for update (prevents race conditions)
  SELECT stock INTO v_current_stock
  FROM products
  WHERE id = p_product_id
  FOR UPDATE;

  IF v_current_stock IS NULL THEN
    RAISE EXCEPTION 'Product not found: %', p_product_id;
  END IF;

  IF v_current_stock < p_quantity THEN
    RETURN FALSE; -- Insufficient stock
  END IF;

  UPDATE products
  SET stock = stock - p_quantity,
      updated_at = NOW()
  WHERE id = p_product_id
    AND stock >= p_quantity; -- Double-check to prevent negative stock

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================
-- Run this migration in Supabase SQL Editor.
-- After running, add SUPABASE_SERVICE_ROLE_KEY and RAZORPAY_WEBHOOK_SECRET
-- to your Vercel environment variables.
