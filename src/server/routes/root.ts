import { FastifyPluginAsync } from 'fastify'
const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get('/', async function (request, reply) {
		return reply.status(200).send('card service works fine!')
	})
	fastify.get('/checkhealth', (request: any, reply: any) => {
		return reply.status(200).send('OK')
	})
}

export default root
