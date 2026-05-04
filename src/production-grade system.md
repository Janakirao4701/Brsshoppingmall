You are a senior backend engineer specializing in high-reliability payment systems.

I am building an e-commerce platform (BSR Shopping Mall) using:

* Next.js (API routes on Vercel)
* Supabase (PostgreSQL)
* Razorpay (payments)

Your task is to design a COMPLETE, production-grade system to prevent:

* order failures
* duplicate payments
* inconsistent order states
* inventory mismatch
* race conditions during checkout

========================
REQUIREMENTS
============

1. ORDER FLOW DESIGN
   Design a robust order lifecycle:

* PENDING → CREATED → PAID → CONFIRMED → SHIPPED → DELIVERED → FAILED
  Explain transitions and failure scenarios.

2. IDEMPOTENCY (CRITICAL)
   Implement idempotency for:

* order creation
* payment verification
* webhook handling

Include:

* idempotency key strategy
* database constraints
* retry-safe APIs

3. DUPLICATE PAYMENT PREVENTION
   Handle cases where:

* user clicks “Pay” multiple times
* network retries happen
* webhook fires multiple times

Must include:

* unique constraint on razorpay_order_id
* payment_id deduplication
* safe retry logic

4. PAYMENT VERIFICATION (MANDATORY)
   Provide:

* HMAC SHA256 signature verification logic
* server-side verification only
* reject tampered responses

5. WEBHOOK AS SOURCE OF TRUTH
   Design:

* Razorpay webhook handler
* signature verification
* idempotent processing
* handling delayed or repeated events

6. DATABASE DESIGN (SUPABASE)
   Provide SQL schema with:

* orders table
* order_items table
* payments table

Include:

* unique constraints
* indexes
* foreign keys
* status fields

7. ATOMIC INVENTORY CONTROL
   Prevent overselling:

* use SQL transaction OR RPC function
* decrement stock safely
* rollback on failure

8. FAILURE HANDLING
   Cover:

* payment success but DB failure
* DB success but payment failure
* partial order creation
* webhook delay

Include retry + compensation strategies.

9. CONCURRENCY CONTROL
   Handle:

* multiple users buying same product
* last-item race condition

Use:

* row locking OR conditional updates

10. API DESIGN (NEXT.JS)
    Provide secure APIs:

* /api/create-order
* /api/verify-payment
* /api/webhook

Include full code examples.

11. COMMON MISTAKES TO AVOID
    Explicitly list:

* trusting frontend payment success
* no idempotency
* updating stock before payment confirmation
* missing webhook handling

12. OUTPUT FORMAT

* Structured sections
* Clear step-by-step logic
* Production-ready code blocks (JS + SQL)

========================
GOAL
====

Build a system that guarantees:

* no duplicate orders
* no duplicate payments
* no stock inconsistencies
* safe retries without side effects
* eventual consistency with webhook recovery

Make it realistic, optimized for serverless (Vercel + Supabase), and directly implementable.
