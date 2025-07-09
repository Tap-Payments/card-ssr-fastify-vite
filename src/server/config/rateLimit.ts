export default {
	//global : false, // default true
	max: 5000, // default 1000
	//ban: 2, // default null
	timeWindow: '1 minute', // default 1000 * 60
	//hook: 'preHandler', // default 'onRequest'
	//cache: 10000, // default 5000
	//allowList: ['127.0.0.1'], // default []
	//redis: new Redis({ host: '127.0.0.1' }), // default null
	//nameSpace: 'teste-ratelimit-', // default is 'fastify-rate-limit-'
	continueExceeding: true, // default false
	skipOnError: true, // default false
	//keyGenerator: function (request) { /* ... */ }, // default (request) => request.raw.ip
	//errorResponseBuilder: function (request, context) { /* ... */},
	//enableDraftSpec: false, // default false. Uses IEFT draft header standard
	addHeadersOnExceeding: {
		// default show all the response headers when rate limit is not reached
		'x-ratelimit-limit': false,
		'x-ratelimit-remaining': false,
		'x-ratelimit-reset': false
	},
	addHeaders: {
		// default show all the response headers when rate limit is reached
		'x-ratelimit-limit': false,
		'x-ratelimit-remaining': false,
		'x-ratelimit-reset': false,
		'retry-after': false
	}
}
