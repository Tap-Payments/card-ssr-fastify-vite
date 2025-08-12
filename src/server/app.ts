import path from "path";
import { config } from "dotenv";
import Fastify, { FastifyInstance, FastifyRequest } from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyRedis from "@fastify/redis";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyJwt from "@fastify/jwt";
import { createServer as createViteServer, ViteDevServer } from "vite";
import middie from "@fastify/middie";

import rateLimitConfig from "./config/rateLimit.js";
import redisConfig from "./config/redis.js";
import ErrorHandler from "./services/ErrorHandler.js";
import helmetFrame from "./config/helmetFrame.js";
import app from './config/app.js'

const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

config({ path: path.resolve(process.cwd(), isProd ? ".env" : ".env.development") });

export async function createApp() {
  const fastify: FastifyInstance = Fastify({
    logger: true,
    trustProxy: true,
    ignoreTrailingSlash: true,
  });

  await fastify.register(middie);
  fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET || "" });
  fastify.register(fastifyRateLimit, rateLimitConfig);
  fastify.log.info(redisConfig, "redis-config");
  fastify.register(fastifyRedis, redisConfig);
  fastify.addHook(
    "onSend",
    (_request: any, reply: any, _payload: any, next: any) => {
      reply.header("X-XSS-Protection", "1; mode=block");
      reply.header("Permissions-Policy", "camera=self, geolocation=self");
      reply.header("X-Frame-Options", "ALLOWALL");
      next();
    }
  );

  fastify.setErrorHandler(
    async (error: any, request: FastifyRequest, reply: any) => {
      // Handle the error here
      console.error(error);
      fastify.log.error(error);
      const { ip, method, url, ips, body, headers } = request;
      const requestInfo = { ip, method, url, ips, body, headers };
      console.error("server_error_request:", JSON.stringify(requestInfo));
      const errorLogMessage = `Server Error: ${
        error.message ? error.message : error
      }`;

      const stackTrace = error.stack ? { stackTrace: error.stack } : {};
      if (!errorLogMessage.includes("Unsupported Media Type")) {
        ErrorHandler.logToSlack(errorLogMessage, stackTrace);
      }
      // Send an error response to the client
      reply.status(500).send({
        error: "Internal Server Error",
        message: "Something went wrong",
      });
    }
  );

  const vite: ViteDevServer = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: isTest ? "error" : "info",
  });
  fastify.use(vite.middlewares);

  if (isProd) {
    // fastify.register(fastifyCompress)
    await fastify.register(fastifyStatic, {
      root: path.resolve("dist/client"),
      prefix: "/", // optional: serve from root
    });
    
    fastify.register(fastifyHelmet, helmetFrame);
  }

  await fastify.register(app, { vite, isProd }) // Pass vite and isProd to wrapperRouter

  fastify.setNotFoundHandler((req, reply) => {
    reply.code(404).type("text/html").send("Page Not Found");
  });
  return fastify;
}
