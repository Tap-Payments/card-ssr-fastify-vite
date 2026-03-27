import { FastifyPluginAsync } from 'fastify';
import binController from '../../../controllers/binController.js';
import RequestParser from '../../../services/RequestParser.js';

const index: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.addHook('preHandler', (request, reply, done) => {
    RequestParser.APIRequestParser(fastify, request, reply, done);
    //done()
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      headers: {
        type: 'object',
        properties: {
          Authorization: {
            type: 'string',
          },
        },
        required: ['Authorization'],
      },
    },
    handler: (request: any, reply: any) => binController.getBin(request, fastify, reply),
  });
};

export default index;
