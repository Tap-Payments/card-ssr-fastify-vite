import { FastifyPluginAsync } from 'fastify'
import controller from '../../../controllers/baseController'
import RequestParser from '../../../services/RequestParser'

const index: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.addHook('preHandler', (request, reply, done) => {
		RequestParser.APIRequestParser(fastify, request, reply, done)
		//done()
	})

	fastify.route({
		method: 'GET',
		url: '/bin/:id',
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
		handler: (request: any, reply: any) => controller.getBin(request, fastify, reply)
	})
	fastify.route({
		method: 'POST',
		url: '/verify',
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
		handler: (request: any, reply: any) => controller.createCardVerify(request, fastify, reply)
	})

	fastify.route({
		method: 'GET',
		url: '/verify/:id',
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
		handler: (request: any, reply: any) => controller.getCardVerify(request, fastify, reply)
	})

	fastify.route({
		method: 'GET',
		url: '/transaction/:id/:object',
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
		handler: (request: any, reply: any) => controller.getTransaction(request, fastify, reply)
	})
}

export default index
