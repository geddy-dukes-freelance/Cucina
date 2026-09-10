import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, list, get } from "@vercel/blob";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (url && key) {
    return createClient(url, key, { auth: { persistSession: false } });
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cucina2026";
  const supabase = getSupabaseClient();

  if (req.method === "GET") {
    // 1. Primary: Query Supabase site_content for specials
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("content")
          .eq("key", "specials")
          .maybeSingle();

        if (!error && data?.content) {
          return res.status(200).json(data.content);
        }
      } catch (sbErr) {
        console.warn("[Supabase] Query error in api/specials:", sbErr);
      }
    }

    // 2. Secondary fallback: Vercel Blob
    try {
      const blobs = await list({ prefix: "content/specials.json" });
      if (blobs.blobs.length > 0) {
        const sortedBlobs = [...blobs.blobs].sort(
          (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        const latestBlob = sortedBlobs[0];

        try {
          const privateBlob = await get(latestBlob.url, { access: "private", useCache: false });
          if (privateBlob && privateBlob.stream) {
            const text = await new Response(privateBlob.stream).text();
            return res.status(200).json(JSON.parse(text));
          }
        } catch (getErr) {
          console.warn("Specials get error:", getErr);
        }

        try {
          const privateBlob = await get(latestBlob.pathname || "content/specials.json", { access: "private", useCache: false });
          if (privateBlob && privateBlob.stream) {
            const text = await new Response(privateBlob.stream).text();
            return res.status(200).json(JSON.parse(text));
          }
        } catch (pathnameErr) {
          console.warn("Specials pathname error:", pathnameErr);
        }

        const token = process.env.BLOB_READ_WRITE_TOKEN;
        const targetUrl = latestBlob.downloadUrl || latestBlob.url;
        try {
          const blobRes = await fetch(`${targetUrl}?t=${Date.now()}`, {
            cache: "no-store",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });
          if (blobRes.ok) {
            const data = await blobRes.json();
            return res.status(200).json(data);
          }
        } catch (fetchErr) {
          console.warn("Specials direct fetch error:", fetchErr);
        }
      }
    } catch (listErr) {
      console.warn("Vercel Blob specials list error:", listErr);
    }

    // 3. Tertiary fallback: Raw GitHub file
    try {
      const GITHUB_OWNER = process.env.GITHUB_OWNER || "geddy-dukes-freelance";
      const GITHUB_REPO = process.env.GITHUB_REPO || "Cucina";
      const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
      const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/content/menu.json`;
      const response = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
      if (response.ok) {
        const menuData = (await response.json()) as { specials?: Record<string, unknown> };
        return res.status(200).json(menuData.specials || { title: "WEEKLY SPECIALS", categories: [] });
      }
    } catch {
      // Fallback
    }

    return res.status(200).json({ title: "WEEKLY SPECIALS", categories: [] });
  }

  if (req.method === "POST") {
    const { password, specials } = (req.body || {}) as {
      password?: string;
      specials?: Record<string, unknown>;
    };

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid admin password." });
    }

    if (!specials || typeof specials !== "object") {
      return res.status(400).json({ error: "Invalid specials payload." });
    }

    // 1. Primary: Save to Supabase if configured
    if (supabase) {
      try {
        const { error } = await supabase
          .from("site_content")
          .upsert(
            {
              key: "specials",
              content: specials,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "key" }
          );

        if (!error) {
          return res.status(200).json({ ok: true, source: "supabase", specials });
        }
        console.warn("[Supabase] Upsert error in specials, falling back:", error);
      } catch (sbErr) {
        console.warn("[Supabase] Save exception in specials, falling back:", sbErr);
      }
    }

    // 2. Secondary fallback: Vercel Blob
    try {
      let blob;
      try {
        blob = await put("content/specials.json", JSON.stringify(specials, null, 2), {
          access: "private",
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: "application/json",
        });
      } catch {
        blob = await put("content/specials.json", JSON.stringify(specials, null, 2), {
          access: "private",
          addRandomSuffix: true,
          contentType: "application/json",
        });
      }
      return res.status(200).json({ ok: true, url: blob.url, specials, source: "blob" });
    } catch (blobErr) {
      const blobMsg = blobErr instanceof Error ? blobErr.message : String(blobErr);

      // 3. Fallback: GitHub commit
      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
      if (GITHUB_TOKEN) {
        try {
          const GITHUB_OWNER = process.env.GITHUB_OWNER || "geddy-dukes-freelance";
          const GITHUB_REPO = process.env.GITHUB_REPO || "Cucina";
          const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
          const fileUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/content/menu.json`;
          const headers = {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "cucina-sa-content-admin",
          };

          const getRes = await fetch(`${fileUrl}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, { headers });
          if (getRes.ok) {
            const fileData = (await getRes.json()) as { sha: string; content: string };
            const rawJson = Buffer.from(fileData.content, "base64").toString("utf8");
            const fullMenu = JSON.parse(rawJson) as { specials?: Record<string, unknown> };

            fullMenu.specials = specials;

            const updatedContent = Buffer.from(JSON.stringify(fullMenu, null, 2) + "\n", "utf8").toString("base64");

            const putRes = await fetch(fileUrl, {
              method: "PUT",
              headers,
              body: JSON.stringify({
                message: "Update Weekly Specials via Owner Portal",
                content: updatedContent,
                sha: fileData.sha,
                branch: GITHUB_BRANCH,
              }),
            });

            if (putRes.ok) {
              return res.status(200).json({ ok: true, specials, source: "github" });
            }
          }
        } catch {
          // Fallback
        }
      }

      return res.status(400).json({
        error: `Storage error: ${blobMsg}`,
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed." });
}
