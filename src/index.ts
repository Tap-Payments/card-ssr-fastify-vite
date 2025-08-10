import fastify from "fastify";
import path from "path";

const server = fastify({ logger: true });

// Register static files plugin for assets
await server.register(import("@fastify/static"), {
  root: path.join(process.cwd(), "dist/client"),
  prefix: "/",
});

// Register routes
await server.register(import("./server/routes.js"), { prefix: "/api" });

// SSR route for React app
server.get("/react", async (request, reply) => {
  try {
    const { renderApp } = await import("./server/ssr.js");
    const html = await renderApp();
    reply.type("text/html").send(html);
  } catch (error) {
    server.log.error(error);
    reply.code(500).send({ error: "Internal Server Error" });
  }
});

// Health check
server.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    await server.listen({ port, host: "0.0.0.0" });
    server.log.info(`Server running on http://localhost:${port}`);
    server.log.info(`React app available at http://localhost:${port}/react`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
