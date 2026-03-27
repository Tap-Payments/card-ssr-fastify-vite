import { FastifyPluginAsync } from "fastify";
import cardController from "../../controllers/cardController.js";
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
      await cardController.makeFrame(req, fastify, res),
  });
};

export default index;
