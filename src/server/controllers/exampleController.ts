import { FastifyRequest, FastifyReply } from "fastify";

export const exampleController = {
  async getExample(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = {
        id: 1,
        message: "Hello from the example controller!",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
      };

      return reply.send(data);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        error: "Internal Server Error",
        message: "Something went wrong in the example controller",
      });
    }
  },
};
