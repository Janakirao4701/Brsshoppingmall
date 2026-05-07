"use server";

import { updateTag, revalidatePath } from "next/cache";

/**
 * Force clear the cache for specific data tags.
 * This can be called from Admin components to ensure the storefront
 * updates immediately after a database change.
 */
export async function triggerRevalidation(tag?: string) {
  try {
    if (tag) {
      updateTag(tag);
    } else {
      revalidatePath("/", "layout");
    }
    return { success: true };
  } catch (err) {
    console.error("Revalidation failed:", err);
    return { success: false };
  }
}
