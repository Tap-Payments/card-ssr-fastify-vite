import { FastifyPluginAsync } from 'fastify';
const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async function (_request, reply) {
    return reply.status(200).send('card service works fine!');
  });
  fastify.get('/checkhealth', (_request: any, reply: any) => {
    return reply.status(200).send('OK');
  });
};

export default root;
