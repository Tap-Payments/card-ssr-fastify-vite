import { FastifyPluginAsync } from "fastify";
import controller from "../../controllers/baseController.js";
import RequestParser from "../../services/RequestParser.js";

const index: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.addHook("preHandler", (request, reply, done) => {
    RequestParser.frameRequestParser(request, reply, done);
    //done()
  });

  fastify.route({
    method: "GET",
    url: ".html",
    schema: {
      querystring: {
        type: "object",
        properties: {
          publicKey: {
            type: "string",
          },
          mid: {
            type: "string",
            nullable: true,
            default: null,
          },
          application: {
            type: "string",
          },
          tap_id: {},
          data: {
            type: "string",
          },
        },
        required: ["publicKey"],
      },
    },
    handler: async (req: any, res: any) =>
      await controller.makeFrame(req, fastify, res),
  });

  fastify.route({
    method: "POST",
    url: "/verify",
    schema: {
      headers: {
        type: "object",
        properties: {
          Authorization: {
            type: "string",
          },
        },
        required: ["Authorization"],
      },
    },
    handler: (request: any, reply: any) =>
      controller.createCardVerify(request, fastify, reply),
  });

  fastify.route({
    method: "GET",
    url: "/verify/:id",
    schema: {
      headers: {
        type: "object",
        properties: {
          Authorization: {
            type: "string",
          },
        },
        required: ["Authorization"],
      },
    },
    handler: (request: any, reply: any) =>
      controller.getCardVerify(request, fastify, reply),
  });
};

export default index;
