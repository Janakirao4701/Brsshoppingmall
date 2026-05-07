import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the SERVICE ROLE key.
 * ONLY use in API routes and server actions — never expose to the browser.
 * Bypasses RLS for trusted server-side operations (order creation, payment verification).
 */
function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "CRITICAL: Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. " +
      "Server-side administrative operations will fail."
    );
    // Return a robust dummy client that handles common query chains
    const mockResult = Promise.resolve({ data: null, error: { message: "Missing Service Key" }, count: 0 });
    const mockQuery: any = {
      select: () => mockQuery,
      order: () => mockQuery,
      limit: () => mockQuery,
      eq: () => mockQuery,
      single: () => mockQuery,
      then: (onfulfilled: any) => mockResult.then(onfulfilled),
      catch: (onrejected: any) => mockResult.catch(onrejected),
    };

    return {
      from: () => mockQuery,
      rpc: () => mockResult,
      auth: { getUser: () => Promise.resolve({ data: { user: null }, error: { message: "Missing Service Key" } }) }
    } as any;
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Lazy-initialized server client to avoid build-time errors when env vars are missing.
 */
let supabaseInstance: any = null;

export const getSupabaseServer = () => {
  if (!supabaseInstance) {
    supabaseInstance = createServerSupabase();
  }
  return supabaseInstance;
};

// For backward compatibility with existing imports
export const supabaseServer = {
  from: (...args: any[]) => getSupabaseServer().from(...args as any),
  rpc: (...args: any[]) => getSupabaseServer().rpc(...args as any),
  auth: {
    getUser: (...args: any[]) => getSupabaseServer().auth.getUser(...args as any),
  }
} as any;

