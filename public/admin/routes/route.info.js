const server = require(__base+'/server')

const marked = require('marked')
const Boom = require('boom')

const Info = require(__base+'/db/models/Info')

server.route({
	method: ['GET'], 
	path: '/info',
	handler: ((request, reply) => {
		Info.findOne({})
		.then(data => {
			reply.view('info/template', {
				title: 'Info',
				data: data
			})
		})
		.catch(err => reply(Boom.badData(err)))
	})
})

server.route({
	method: ['POST'], 
	path: '/info',
	handler: ((request, reply) => {
		const payload = request.payload

		Info.findOneAndUpdate({
			contentHeader: payload.contentHeader,
			contentMarkdown: payload.contentMarkdown,
			contentHtml: marked(payload.contentMarkdown),
			emailAddress: payload.emailAddress,
			soundcloudUrl: payload.soundcloudUrl,
			facebookUrl: payload.facebookUrl,
			instagramUrl: payload.instagramUrl,
			distributionText: payload.distributionText,
			distributionUrl: payload.distributionUrl
		})

		.then(res => reply().redirect('/info'))	
		.catch(err => reply(Boom.badData(err)))

	})
})