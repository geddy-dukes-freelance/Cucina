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
            const urlObj = new URL(req.url, "http://localhost:8080");
            const requestedPath = urlObj.searchParams.get("path") || "public/content/menu.json";
            const filePath = path.resolve(__dirname, requestedPath);
            if (fs.existsSync(filePath)) {
              res.setHeader("Content-Type", "application/json");
              return res.end(fs.readFileSync(filePath, "utf-8"));
            }
          }
          if (req.url?.startsWith("/api/specials")) {
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
