# Git-backed content admin

The owner portal at `/portal` edits JSON files and saves them back to GitHub through a Netlify Function.

## Editable files

- `public/content/home.json`: homepage modal content and About/Our Story copy.
- `public/content/menu.json`: weekly specials, dinner, lunch, and happy hour menus.

## Netlify environment variables

Set these in Netlify project settings:

- `ADMIN_PASSWORD`: password the owner enters in `/portal`.
- `GITHUB_TOKEN`: fine-grained GitHub token with Contents read/write access to this repository.
- `GITHUB_OWNER`: repository owner or organization.
- `GITHUB_REPO`: repository name.
- `GITHUB_BRANCH`: branch to commit to, usually `main`.

## GitHub token scope

Use a fine-grained personal access token limited to this repository with:

- Contents: Read and write
- Metadata: Read

Do not put the token in frontend code or any `VITE_` environment variable.

## Update flow

1. Owner opens `/portal`.
2. Owner enters `ADMIN_PASSWORD`.
3. Portal loads JSON from `/content/*.json`.
4. Owner edits and saves.
5. Netlify Function commits the updated JSON to GitHub.
6. Netlify rebuilds/redeploys from the Git commit.
