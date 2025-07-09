import { FastifyInstance } from 'fastify'

export default class RedisHelper {
	static async setKey(fastify: FastifyInstance, publicKey: string, secretKey: string, reply: any) {
		const { redis } = fastify
		return await redis.publickeys.set(publicKey, secretKey)
	}

	static async setKeyWithExpiry(
		fastify: FastifyInstance,
		publicKey: string,
		secretKey: string,
		reply: any,
		expiry: number
	) {
		const { redis } = fastify
		return await redis.publickeys.set(publicKey, secretKey, 'EX', expiry)
	}
	static async getKey(fastify: FastifyInstance, publicKey: string) {
		const { redis } = fastify
		return await redis.publickeys.get(publicKey)
	}
}
