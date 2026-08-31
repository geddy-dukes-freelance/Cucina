import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const GITHUB_OWNER = process.env.GITHUB_OWNER || "geddy-dukes-freelance";
  const GITHUB_REPO = process.env.GITHUB_REPO || "Cucina";
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cucina2026";

  if (req.method === "GET") {
    try {
      const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/content/menu.json`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        return res.status(500).json({ error: "Could not fetch specials content." });
      }
      const menuData = (await response.json()) as { specials?: Record<string, unknown> };
      return res.status(200).json(menuData.specials || { title: "WEEKLY SPECIALS", categories: [] });
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

    if (!GITHUB_TOKEN) {
      return res.status(500).json({ error: "Missing GITHUB_TOKEN in Vercel settings." });
    }

    try {
      const fileUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/public/content/menu.json`;
      const headers = {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "cucina-sa-content-admin",
      };

      const getRes = await fetch(`${fileUrl}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, { headers });
      if (!getRes.ok) {
        return res.status(getRes.status).json({ error: "Could not read current menu.json from GitHub." });
      }

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

      if (!putRes.ok) {
        const err = (await putRes.json().catch(() => ({}))) as { message?: string };
        return res.status(putRes.status).json({ error: err.message || "Failed to update GitHub." });
      }

      return res.status(200).json({ ok: true, specials });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : "Save failed." });
    }
  }

  return res.status(405).json({ error: "Method not allowed." });
}
