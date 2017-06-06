const server = require(__base+'/server')

//404

server.route({
	method: '*', 
	path: '/{p*}',
	handler: ((request, reply) => {
		reply
			.view('404', {
				title: 'Not found',
				body: request.params.p
			})
			.code(404)
	})
})

//the real stuff

require('./routes/route.news')

require('./routes/route.releases')

require('./routes/route.info')

require('./routes/route.help')