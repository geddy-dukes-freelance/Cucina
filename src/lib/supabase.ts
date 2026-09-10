import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { HomeContent, MenuContent } from "@/types/content";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL) as string | undefined;
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY
) as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

/**
 * Fetch a content document from Supabase `site_content` table.
 * Returns null if Supabase is not configured or if key is not found.
 */
export async function fetchSupabaseContent<T = HomeContent | MenuContent>(
  key: "home" | "menu" | "specials"
): Promise<T | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("key", key)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data.content as T;
  } catch (err) {
    console.warn(`[Supabase] Error fetching content for "${key}":`, err);
    return null;
  }
}

/**
 * Save content document to Supabase `site_content` table.
 */
export async function saveSupabaseContent(
  key: "home" | "menu" | "specials",
  content: Record<string, unknown>
): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from("site_content")
      .upsert(
        {
          key,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (error) {
      console.error(`[Supabase] Error saving content for "${key}":`, error);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`[Supabase] Unexpected error saving content for "${key}":`, err);
    return false;
  }
}

/**
 * Pings the database with a lightweight query to prevent project pausing.
 */
export async function pingSupabase(): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("key")
      .limit(1);

    return !error && Array.isArray(data);
  } catch {
    return false;
  }
}
