import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, list, get } from "@vercel/blob";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cucina2026";

  if (req.method === "GET") {
    try {
      const blobs = await list({ prefix: "content/specials.json" });
      if (blobs.blobs.length > 0) {
        const latestBlob = blobs.blobs[0];
        const targetUrl = latestBlob.downloadUrl || latestBlob.url;
        try {
          const blobRes = await fetch(`${targetUrl}?t=${Date.now()}`, { cache: "no-store" });
          if (blobRes.ok) {
            const data = await blobRes.json();
            return res.status(200).json(data);
          }
        } catch {
          // Fallback
        }

        try {
          const privateBlob = await get(latestBlob.pathname || "content/specials.json", { access: "private" });
          if (privateBlob) {
            const text = await new Response(privateBlob.stream).text();
            return res.status(200).json(JSON.parse(text));
          }
        } catch {
          // Fallback
        }
      }
    } catch (e) {
      console.error("Vercel Blob read error:", e);
    }

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

    try {
      let blob;
      try {
        blob = await put("content/specials.json", JSON.stringify(specials, null, 2), {
          access: "private",
          addRandomSuffix: false,
          contentType: "application/json",
        });
      } catch {
        blob = await put("content/specials.json", JSON.stringify(specials, null, 2), {
          access: "private",
          contentType: "application/json",
        });
      }
      return res.status(200).json({ ok: true, url: blob.url, specials });
    } catch (blobErr) {
      const blobMsg = blobErr instanceof Error ? blobErr.message : String(blobErr);

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
              return res.status(200).json({ ok: true, specials });
            }
          }
        } catch {
          // Fallback
        }
      }

      return res.status(400).json({
        error: `Vercel Blob Storage error: ${blobMsg}`,
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed." });
}
