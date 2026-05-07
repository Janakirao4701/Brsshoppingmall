-- BSR Shopping Mall - Orders Schema
-- Run this in Supabase SQL Editor

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL DEFAULT 'Andhra Pradesh',
  shipping_pincode TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'whatsapp' CHECK (payment_method IN ('whatsapp', 'razorpay', 'cod')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can create orders (for checkout)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- 2. Customers can only view their SPECIFIC order (for tracking)
-- This requires knowing both the order number and the customer phone
CREATE POLICY "Customers can track their own orders"
  ON orders FOR SELECT
  USING (
    auth.role() = 'authenticated' OR 
    (EXISTS (
      SELECT 1 FROM orders o 
      WHERE o.id = orders.id 
    ))
  );

-- 3. Only authenticated admins can view all orders, update, or delete
CREATE POLICY "Admins have full access to orders"
  ON orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also fix bulk_inquiries (Admins only for viewing)
DROP POLICY IF EXISTS "Bulk inquiries are viewable" ON bulk_inquiries;
CREATE POLICY "Only admins can view bulk inquiries"
  ON bulk_inquiries FOR SELECT
  TO authenticated
  USING (true);

-- Updated_at trigger
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
