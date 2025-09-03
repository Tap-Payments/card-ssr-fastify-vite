import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  root: "src/wrapper",
  base: "/wrapper/",
  build: {
    outDir: "../../dist/wrapper",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/wrapper/index.html"),
      },
    },
  },
});
