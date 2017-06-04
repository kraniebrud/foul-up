const server = require(__base+'/server')

server.route({
	method: 'GET', 
	path: '/',
	handler: ((request, reply) => {
		reply
			.redirect('/news')
	})
})

require('./routes/route.login')

require('./routes/route.images')

require('./routes/route.news')

require('./routes/route.releases')

require('./routes/route.info')

require('./routes/route.users')