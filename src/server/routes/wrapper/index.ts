import { FastifyPluginAsync } from 'fastify';
import wrapperController from '../../controllers/wrapperController.js';

const index: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    method: 'GET',
    url: '.html',
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
    handler: (request: any, reply: any) => wrapperController.makeWrapper(request, fastify, reply),
  });
};

export default index;
