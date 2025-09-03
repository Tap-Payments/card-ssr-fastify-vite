import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  root: "src/client",
  build: {
    outDir: "../../dist/client",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/client/index.html"),
      },
    },
  },
});
