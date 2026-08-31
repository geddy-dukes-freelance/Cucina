import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, head } from "@vercel/blob";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cucina2026";
  const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (req.method === "GET") {
    try {
      if (BLOB_TOKEN) {
        try {
          const blobInfo = await head("content/specials.json", { token: BLOB_TOKEN });
          if (blobInfo?.url) {
            const blobRes = await fetch(blobInfo.url, { cache: "no-store" });
            if (blobRes.ok) {
              const data = await blobRes.json();
              return res.status(200).json(data);
            }
          }
        } catch {
          // Fallback to github or static
        }
      }

      const GITHUB_OWNER = process.env.GITHUB_OWNER || "geddy-dukes-freelance";
      const GITHUB_REPO = process.env.GITHUB_REPO || "Cucina";
      const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
      const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/content/menu.json`;
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        const menuData = (await response.json()) as { specials?: Record<string, unknown> };
        return res.status(200).json(menuData.specials || { title: "WEEKLY SPECIALS", categories: [] });
      }

      return res.status(200).json({ title: "WEEKLY SPECIALS", categories: [] });
    } catch {
      return res.status(500).json({ error: "Failed to load specials." });
    }
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

    if (BLOB_TOKEN) {
      try {
        const blob = await put("content/specials.json", JSON.stringify(specials, null, 2), {
          access: "public",
          addRandomSuffix: false,
          contentType: "application/json",
          token: BLOB_TOKEN,
        });
        return res.status(200).json({ ok: true, url: blob.url, specials });
      } catch {
        // Fallback to GitHub
      }
    }

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
      } catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : "Save failed." });
      }
    }

    return res.status(200).json({ ok: true, specials });
  }

  return res.status(405).json({ error: "Method not allowed." });
}
