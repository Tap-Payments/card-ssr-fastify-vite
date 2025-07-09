export default {
	host: process.env.REDIS_URL,
	port: 6379,
	namespace: 'publickeys',
	...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD, tls: {} })
}
