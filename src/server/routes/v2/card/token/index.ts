import { FastifyPluginAsync } from 'fastify'
import controller from '../../../../controllers/baseController'
import RequestParser from '../../../../services/RequestParser'

const index: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.addHook('preHandler', (request, reply, done) => {
		RequestParser.APIRequestParser(fastify, request, reply, done)
		//done()
	})
	fastify.route({
		method: 'POST',
		url: '/',
		schema: {
			headers: {
				type: 'object',
				properties: {
					Authorization: {
						type: 'string'
					}
				},
				required: ['Authorization']
			}
		},
		handler: (request: any, reply: any) => controller.createToken(request, fastify, reply)
	})
}

export default index
