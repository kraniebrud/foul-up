'USE STRICT'

const server = require(__base+'/server')

const Info = require(__base+'/db/models/Info')

server.route({
	method: ['GET'], 
	path: '/info',
	handler: ((request, reply) => {
		Info.findOne({})
		.then(data => {
			reply.view('info/template', {
				title: 'Info',
				menu: {active : 'info'},
				data: data
			})
		})
		.catch(err => reply(Boom.badData(err)))
	})
})