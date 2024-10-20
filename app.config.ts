import { defineConfig } from "@solidjs/start/config";
import compression from "vite-plugin-compression";

export default defineConfig({
  vite: {
    plugins: [
      compression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      }),
      {
        name: "set-cache-headers",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && new URL(req.url).pathname === "/skills.svg") {
              res.setHeader(
                "Cache-Control",
                "public, max-age=31536000, immutable",
              );
            }
            next();
          });
        },
      },
    ],
  },
});
