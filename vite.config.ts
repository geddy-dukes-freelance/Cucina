import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    {
      name: "api-mock-middleware",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/api/content")) {
            if (req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => { body += chunk; });
              req.on("end", () => {
                try {
                  const { path: savePath, content } = JSON.parse(body);
                  if (savePath && content) {
                    const filePath = path.resolve(__dirname, savePath);
                    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
                    res.setHeader("Content-Type", "application/json");
                    return res.end(JSON.stringify({ ok: true, path: savePath }));
                  }
                } catch (e) {
                  res.statusCode = 500;
                  return res.end(JSON.stringify({ error: String(e) }));
                }
              });
              return;
            }
            const urlObj = new URL(req.url, "http://localhost:8080");
            const requestedPath = urlObj.searchParams.get("path") || "public/content/menu.json";
            const filePath = path.resolve(__dirname, requestedPath);
            if (fs.existsSync(filePath)) {
              res.setHeader("Content-Type", "application/json");
              return res.end(fs.readFileSync(filePath, "utf-8"));
            }
          }
          if (req.url?.startsWith("/api/specials")) {
            if (req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => { body += chunk; });
              req.on("end", () => {
                try {
                  const { specials } = JSON.parse(body);
                  if (specials) {
                    const filePath = path.resolve(__dirname, "public/content/specials.json");
                    fs.writeFileSync(filePath, JSON.stringify(specials, null, 2), "utf-8");
                    res.setHeader("Content-Type", "application/json");
                    return res.end(JSON.stringify({ ok: true }));
                  }
                } catch (e) {
                  res.statusCode = 500;
                  return res.end(JSON.stringify({ error: String(e) }));
                }
              });
              return;
            }
            const filePath = path.resolve(__dirname, "public/content/specials.json");
            if (fs.existsSync(filePath)) {
              res.setHeader("Content-Type", "application/json");
              return res.end(fs.readFileSync(filePath, "utf-8"));
            }
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
