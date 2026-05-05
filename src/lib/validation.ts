/**
 * Input validation and sanitization utilities.
 * Prevents XSS, SQL injection, and malformed data from reaching the database.
 */

/** Strip HTML tags and dangerous characters from user input */
export function sanitizeString(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")         // Strip HTML tags
    .replace(/[<>"'`;]/g, "")        // Remove dangerous chars
    .trim();
}

/** Validate Indian phone number (+91 or 10-digit) */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^(\+91|91)?[6-9]\d{9}$/.test(cleaned);
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate Indian pincode */
export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

/** Validate amount is a positive number within reasonable range */
export function isValidAmount(amount: number): boolean {
  return (
    typeof amount === "number" &&
    Number.isFinite(amount) &&
    amount > 0 &&
    amount <= 10_000_000 // ₹1 crore max
  );
}

/** Validate order items array */
export function isValidOrderItems(items: unknown): items is Array<{
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}> {
  if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
    return false;
  }

  return items.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.quantity === "number" &&
      item.quantity > 0 &&
      item.quantity <= 1000 &&
      typeof item.price === "number" &&
      item.price >= 0
  );
}

/**
 * Validate and sanitize the full checkout payload.
 * Returns sanitized data or an error message.
 */
export function validateCheckoutPayload(body: Record<string, unknown>): {
  valid: boolean;
  error?: string;
  data?: {
    amount: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingPincode: string;
    items: unknown[];
    subtotal: number;
    shippingCost: number;
    idempotencyKey?: string;
  };
} {
  const {
    amount,
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingPincode,
    items,
    subtotal,
    shippingCost,
    idempotencyKey,
  } = body;

  // Required fields
  if (!amount || !customerName || !customerPhone || !shippingAddress || !items) {
    return { valid: false, error: "Missing required fields: amount, customerName, customerPhone, shippingAddress, items" };
  }

  if (!isValidAmount(amount as number)) {
    return { valid: false, error: "Invalid amount" };
  }

  if (!isValidPhone(customerPhone as string)) {
    return { valid: false, error: "Invalid phone number" };
  }

  if (customerEmail && !isValidEmail(customerEmail as string)) {
    return { valid: false, error: "Invalid email address" };
  }

  if (shippingPincode && !isValidPincode(shippingPincode as string)) {
    return { valid: false, error: "Invalid pincode" };
  }

  if (!isValidOrderItems(items)) {
    return { valid: false, error: "Invalid order items" };
  }

  return {
    valid: true,
    data: {
      amount: amount as number,
      customerName: sanitizeString(customerName as string),
      customerPhone: (customerPhone as string).replace(/[\s\-()]/g, ""),
      customerEmail: customerEmail ? sanitizeString(customerEmail as string) : null,
      shippingAddress: sanitizeString(shippingAddress as string),
      shippingCity: sanitizeString((shippingCity as string) || ""),
      shippingState: sanitizeString((shippingState as string) || "Andhra Pradesh"),
      shippingPincode: (shippingPincode as string) || "",
      items: items as unknown[],
      subtotal: (subtotal as number) || 0,
      shippingCost: (shippingCost as number) || 0,
      idempotencyKey: idempotencyKey as string | undefined,
    },
  };
}
