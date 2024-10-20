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
    ],
  },
});
