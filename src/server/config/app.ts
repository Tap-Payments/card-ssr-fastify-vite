import { fileURLToPath } from "url";
import { dirname, join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import { ViteDevServer } from "vite";
import ErrorHandler from "../services/ErrorHandler.js";

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.on("unhandledRejection", async (err: Error) => {
  console.error("err", err.message);
  await ErrorHandler.logToSlack("Server Error", { error: err.message });
});
export type AppOptions = {
  // Export the interface
  vite: ViteDevServer;
  isProd: boolean;
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "..", "plugins"),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "..", "routes"),
    options: opts,
  });
};

export default app;
export { app };
