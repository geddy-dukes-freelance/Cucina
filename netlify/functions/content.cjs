const allowedPaths = new Set([
  "public/content/home.json",
  "public/content/menu.json",
]);

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  const {
    ADMIN_PASSWORD,
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH = "main",
  } = process.env;

  if (!ADMIN_PASSWORD || !GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return json(500, {
      error: "Missing ADMIN_PASSWORD, GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO environment variable.",
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON request body." });
  }

  if (payload.password !== ADMIN_PASSWORD) {
    return json(401, { error: "Invalid admin password." });
  }

  if (!allowedPaths.has(payload.path)) {
    return json(400, { error: "This content path is not editable." });
  }

  if (typeof payload.content !== "object" || payload.content === null) {
    return json(400, { error: "Content must be a JSON object." });
  }

  const apiPath = encodeURIComponent(payload.path).replace(/%2F/g, "/");
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
    return json(currentResponse.status, { error: `Could not read current file from GitHub: ${errorText}` });
  }

  const currentFile = await currentResponse.json();
  const prettyContent = `${JSON.stringify(payload.content, null, 2)}\n`;
  const encodedContent = Buffer.from(prettyContent, "utf8").toString("base64");

  const updateResponse = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `Update ${payload.path} from owner portal`,
      content: encodedContent,
      sha: currentFile.sha,
      branch: GITHUB_BRANCH,
    }),
  });

  const result = await updateResponse.json().catch(() => ({}));

  if (!updateResponse.ok) {
    return json(updateResponse.status, { error: result.message || "GitHub update failed." });
  }

  return json(200, {
    ok: true,
    commit: result.commit?.html_url,
    path: payload.path,
  });
};
