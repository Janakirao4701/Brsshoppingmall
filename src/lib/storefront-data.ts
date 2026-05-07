import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

/**
 * Lightweight server-side Supabase client for public data reads.
 * Uses the anon key (not the service role key) since hero banners are public data.
 * This avoids importing the heavy service-role client for storefront reads.
 */
function getPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    url === "https://placeholder.supabase.co" ||
    !anonKey ||
    anonKey === "placeholder"
  ) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Fetch active hero banners from Supabase, cached for 5 minutes.
 * Returns empty array if Supabase is not configured or query fails.
 */
export const getHeroBanners = unstable_cache(
  async () => {
    const supabase = getPublicSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from("hero_banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching hero banners:", error.message);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error("Unexpected error fetching hero banners:", err);
      return [];
    }
  },
  ["hero-banners"],
  { revalidate: 30, tags: ["hero-banners"] }
);

/**
 * Fetch storefront settings (announcements) from Supabase, cached for 5 minutes.
 */
export const getStorefrontSettings = unstable_cache(
  async () => {
    const supabase = getPublicSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from("settings")
        .select("announcements, announcement_active, announcement_text")
        .eq("id", "00000000-0000-0000-0000-000000000000")
        .single();

      if (error) {
        console.error("Error fetching settings:", error.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Unexpected error fetching settings:", err);
      return null;
    }
  },
  ["storefront-settings"],
  { revalidate: 30, tags: ["settings"] }
);
