import { FastifyInstance } from "fastify";
import { exampleController } from "./controllers/exampleController.js";

export default async function routes(fastify: FastifyInstance) {
  // Example API route
  fastify.get("/example", exampleController.getExample);

  // Add more routes here as needed
  fastify.get("/data", async (request, reply) => {
    return {
      message: "Hello from API!",
      timestamp: new Date().toISOString(),
    };
  });
}
