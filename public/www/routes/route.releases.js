const server = require(__base+'/server')

const Boom = require('boom')

const Release = require(__base+'/db/models/Release')

server.route({
	method: ['GET'], 
	path: '/releases',
	handler: ((request, reply) => {
		Release.find({}).sort({_id: -1})
		.populate('images')
		.then(data => {
			reply.view('releases/template', {
				title: 'Releases',
				menu: {active : 'releases'},
				posts: data
			})
		})
		.catch(err => reply(Boom.badData(err)))
	})
})

server.route({
	method: ['GET'], 
	path: '/releases/{slug}',
	handler: ((request, reply) => {
		const slug = request.params.slug

		Release.findOne({slug: slug})
		.populate('images')
		.then(data => {
			if(!data) return reply.redirect('/404')
			
			reply.view('releases/single-template', {
				title: 'Releases',
				menu: {active : 'releases'},
				post: data
			})

		})
		.catch(err => reply(Boom.badData(err)))

	})
})