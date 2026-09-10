import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  const now = new Date().toISOString();

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      status: "ready",
      message: "Ping received. Supabase credentials not set yet.",
      timestamp: now,
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase
      .from("site_content")
      .select("key, updated_at")
      .limit(1);

    if (error) {
      return res.status(500).json({
        status: "error",
        message: "Failed to page database.",
        error: error.message,
        timestamp: now,
      });
    }

    return res.status(200).json({
      status: "active",
      message: "Database successfully paged to prevent inactivity pause.",
      timestamp: now,
      recordsFound: data?.length || 0,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Unexpected error paging database.",
      error: err instanceof Error ? err.message : String(err),
      timestamp: now,
    });
  }
}
