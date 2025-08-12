import { FastifyPluginAsync } from 'fastify';
import controller from '../../controllers/baseController.js';

const index: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          configurations: {
            type: 'string',
          },
        },
        required: ['configurations'],
      },
    },
    handler: (request: any, reply: any) => controller.makeWrapper(request, fastify, reply),
  });
};

export default index;
