import type { VercelRequest, VercelResponse } from "@vercel/node";

const allowedPaths = new Set([
  "public/content/home.json",
  "public/content/menu.json",
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cucina2026";
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER || "geddy-dukes-freelance";
  const GITHUB_REPO = process.env.GITHUB_REPO || "Cucina";
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

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

  if (!GITHUB_TOKEN) {
    return res.status(500).json({
      error: "Missing GITHUB_TOKEN environment variable in Vercel project settings.",
    });
  }

  try {
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
    if (!currentResponse.ok) {
      const errorText = await currentResponse.text();
      return res.status(currentResponse.status).json({ error: `Could not read current file from GitHub: ${errorText}` });
    }

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

    if (!updateResponse.ok) {
      return res.status(updateResponse.status).json({ error: result.message || "GitHub update failed." });
    }

    return res.status(200).json({
      ok: true,
      commit: result.commit?.html_url,
      path,
    });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error." });
  }
}
