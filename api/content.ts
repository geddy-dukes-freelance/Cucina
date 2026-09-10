import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, list, get } from "@vercel/blob";
import { createClient } from "@supabase/supabase-js";

const allowedPaths = new Set([
  "public/content/home.json",
  "public/content/menu.json",
]);

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

function normalizeContent(filePath: string, content: any) {
  if (!content || typeof content !== "object") return content;
  if (filePath.includes("home.json")) {
    if (content.hero && content.hero.paragraph) {
      if (content.hero.paragraph.includes("full bar")) {
        content.hero.paragraph = content.hero.paragraph.replace("full bar", "craft cocktails");
      } else if (!content.hero.paragraph.includes("craft cocktails")) {
        content.hero.paragraph = content.hero.paragraph.replace(
          "thoughtfully prepared dishes, and a curated selection",
          "thoughtfully prepared dishes, craft cocktails, and a curated selection"
        );
      }
    }
    if (content.community && content.community.paragraph) {
      if (content.community.paragraph.includes("For more than 27 years")) {
        content.community.paragraph = content.community.paragraph.replace("For more than 27 years", "Since 1998");
      } else if (content.community.paragraph.includes("for more than 27 years")) {
        content.community.paragraph = content.community.paragraph.replace("for more than 27 years", "since 1998");
      } else if (content.community.paragraph.includes("For 27 years")) {
        content.community.paragraph = content.community.paragraph.replace("For 27 years", "Since 1998");
      }
    }
    if (content.about && Array.isArray(content.about.paragraphs)) {
      content.about.paragraphs = content.about.paragraphs.map((p: string) => {
        let updated = p;
        if (updated.includes("full bar")) {
          updated = updated.replace("full bar", "craft cocktails");
        }
        if (updated.includes("for more than 27 years")) {
          updated = updated.replace("for more than 27 years", "since 1998");
        } else if (updated.includes("For more than 27 years")) {
          updated = updated.replace("For more than 27 years", "Since 1998");
        } else if (updated.includes("for 27 years")) {
          updated = updated.replace("for 27 years", "since 1998");
        }
        return updated;
      });
    }
  }
  return content;
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
    const rawPath = (req.query.path as string) || "public/content/menu.json";
    const path = allowedPaths.has(rawPath) ? rawPath : "public/content/menu.json";
    const contentKey = path.includes("home.json") ? "home" : "menu";

    // 1. Primary: If Supabase is connected, query site_content table
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("content")
          .eq("key", contentKey)
          .maybeSingle();

        if (!error && data?.content) {
          return res.status(200).json(normalizeContent(path, data.content));
        }
      } catch (sbErr) {
        console.warn("[Supabase] Query error in api/content:", sbErr);
      }
    }

    // 2. Secondary fallback: Vercel Blob
    const blobKey = path.replace("public/", "");
    try {
      const blobs = await list({ prefix: blobKey });
      if (blobs.blobs.length > 0) {
        const sortedBlobs = [...blobs.blobs].sort(
          (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        const latestBlob = sortedBlobs[0];

        try {
          const privateBlob = await get(latestBlob.url, { access: "private", useCache: false });
          if (privateBlob && privateBlob.stream) {
            const text = await new Response(privateBlob.stream).text();
            return res.status(200).json(normalizeContent(path, JSON.parse(text)));
          }
        } catch (getErr) {
          console.warn("Blob get error:", getErr);
        }

        try {
          const privateBlob = await get(latestBlob.pathname || blobKey, { access: "private", useCache: false });
          if (privateBlob && privateBlob.stream) {
            const text = await new Response(privateBlob.stream).text();
            return res.status(200).json(normalizeContent(path, JSON.parse(text)));
          }
        } catch (pathnameErr) {
          console.warn("Blob pathname error:", pathnameErr);
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
            return res.status(200).json(normalizeContent(path, data));
          }
        } catch (fetchErr) {
          console.warn("Blob direct fetch error:", fetchErr);
        }
      }
    } catch (listErr) {
      console.warn("Vercel Blob list error:", listErr);
    }

    // 3. Tertiary fallback: Raw GitHub file
    try {
      const GITHUB_OWNER = process.env.GITHUB_OWNER || "geddy-dukes-freelance";
      const GITHUB_REPO = process.env.GITHUB_REPO || "Cucina";
      const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
      const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;
      const response = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(normalizeContent(path, data));
      }
    } catch {
      // Fallback
    }

    return res.status(404).json({ error: "Content file not found." });
  }

  if (req.method === "POST") {
    const { password, path, content } = (req.body || {}) as {
      password?: string;
      path?: string;
      content?: Record<string, unknown>;
    };

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid admin password." });
    }

    if (!path || !allowedPaths.has(path)) {
      return res.status(400).json({ error: "This content path is not editable." });
    }

    if (!content || typeof content !== "object") {
      return res.status(400).json({ error: "Content must be a JSON object." });
    }

    const contentKey = path.includes("home.json") ? "home" : "menu";

    // 1. Primary: Save to Supabase if configured
    if (supabase) {
      try {
        const { error } = await supabase
          .from("site_content")
          .upsert(
            {
              key: contentKey,
              content,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "key" }
          );

        if (!error) {
          return res.status(200).json({ ok: true, source: "supabase", path, key: contentKey });
        }
        console.warn("[Supabase] Upsert error, falling back:", error);
      } catch (sbErr) {
        console.warn("[Supabase] Save exception, falling back:", sbErr);
      }
    }

    // 2. Secondary fallback: Save to Vercel Blob
    try {
      const blobKey = path.replace("public/", "");
      let blob;
      try {
        blob = await put(blobKey, JSON.stringify(content, null, 2), {
          access: "private",
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: "application/json",
        });
      } catch {
        blob = await put(blobKey, JSON.stringify(content, null, 2), {
          access: "private",
          addRandomSuffix: true,
          contentType: "application/json",
        });
      }
      return res.status(200).json({ ok: true, url: blob.url, path, source: "blob" });
    } catch (blobErr) {
      const blobMsg = blobErr instanceof Error ? blobErr.message : String(blobErr);

      // 3. Fallback: GitHub commit
      const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
      if (GITHUB_TOKEN) {
        try {
          const GITHUB_OWNER = process.env.GITHUB_OWNER || "geddy-dukes-freelance";
          const GITHUB_REPO = process.env.GITHUB_REPO || "Cucina";
          const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
          const apiPath = encodeURIComponent(path).replace(/%2F/g, "/");
          const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${apiPath}`;
          const headers = {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "cucina-sa-content-admin",
          };

          const currentResponse = await fetch(`${url}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, { headers });
          if (currentResponse.ok) {
            const currentFile = (await currentResponse.json()) as { sha: string };
            const prettyContent = `${JSON.stringify(content, null, 2)}\n`;
            const encodedContent = Buffer.from(prettyContent, "utf8").toString("base64");

            const updateResponse = await fetch(url, {
              method: "PUT",
              headers,
              body: JSON.stringify({
                message: `Update ${path} from owner portal`,
                content: encodedContent,
                sha: currentFile.sha,
                branch: GITHUB_BRANCH,
              }),
            });

            const result = (await updateResponse.json().catch(() => ({}))) as { commit?: { html_url: string }; message?: string };

            if (updateResponse.ok) {
              return res.status(200).json({ ok: true, commit: result.commit?.html_url, path, source: "github" });
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
