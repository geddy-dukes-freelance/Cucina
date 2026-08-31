import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, list } from "@vercel/blob";

const allowedPaths = new Set([
  "public/content/home.json",
  "public/content/menu.json",
]);

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
    const rawPath = (req.query.path as string) || "public/content/menu.json";
    const path = allowedPaths.has(rawPath) ? rawPath : "public/content/menu.json";
    const blobKey = path.replace("public/", "");

    try {
      const blobs = await list({ prefix: blobKey });
      if (blobs.blobs.length > 0) {
        const latestBlob = blobs.blobs[0];
        const targetUrl = latestBlob.downloadUrl || latestBlob.url;
        const blobRes = await fetch(`${targetUrl}?t=${Date.now()}`, { cache: "no-store" });
        if (blobRes.ok) {
          const data = await blobRes.json();
          return res.status(200).json(data);
        }
      }
    } catch {
      // Fallback
    }

    try {
      const GITHUB_OWNER = process.env.GITHUB_OWNER || "geddy-dukes-freelance";
      const GITHUB_REPO = process.env.GITHUB_REPO || "Cucina";
      const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
      const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;
      const response = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
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

    try {
      const blobKey = path.replace("public/", "");
      let blob;
      try {
        blob = await put(blobKey, JSON.stringify(content, null, 2), {
          addRandomSuffix: false,
          contentType: "application/json",
        });
      } catch {
        blob = await put(blobKey, JSON.stringify(content, null, 2), {
          access: "public",
          addRandomSuffix: false,
          contentType: "application/json",
        });
      }
      return res.status(200).json({ ok: true, url: blob.url, path });
    } catch (blobErr) {
      const blobMsg = blobErr instanceof Error ? blobErr.message : String(blobErr);

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
              return res.status(200).json({ ok: true, commit: result.commit?.html_url, path });
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
