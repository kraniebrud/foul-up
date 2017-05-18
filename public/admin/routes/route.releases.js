'USE STRICT'

const server = require(__base+'/server')
const path = require('path')

const makeSlug = require('slugg')
const marked = require('marked')
const Boom = require('boom')

const ImageFile = require(__base+'/db/models/ImageFile')
const Release = require(__base+'/db/models/Release')

const mongoose = require('mongoose')

server.route({
	method: ['GET'], 
	path: '/releases',
	handler: ((request, reply) => {
		Release.find({}).sort({_id: -1})
		.then(data => {
			reply.view('releases/template', {
				title: 'Releases',
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
			
			Release
				.findOne({slug: request.params.slug})
				.populate('images')
				.exec()
			
			.then(postData => {
				if(!postData) return reply(Boom.notFound())
				
				ImageFile.find({})
				.then(images => {

					postData.allImages = images
					const replyData = {
						title: "Releases, Update",
						data: postData
					}

					if(request.likesJson())  return reply(replyData)
					//
					reply.view('releases/single-template', replyData)

			})
			.catch(err => {
				return reply(Boom.badData(err))
			})
		})

	})
})

server.route({
	method: ['POST'], 
	path: '/releases/{releaseId}',
	handler: ((request, reply) => {
		const payload = request.payload
		const releaseId = request.params.releaseId

		if(!payload.contentMarkdown) return reply(Boom.badData())

		Release.findOneAndUpdate(
			{_id: releaseId}, 
			{
				artist: payload.artist,
				title: payload.title,
				images: payload.images,
				releaseDate: payload.releaseDate,
				releaseFormat: payload.releaseFormat,
				catalogNumber: payload.catalogNumber,
				contentMarkdown: payload.contentMarkdown,
				contentHtml: marked(payload.contentMarkdown),
				soundcloud: payload.soundcloud,
				buy: payload.buy,
			}
		)
		
		.then((data) => {
			if(request.likesJson())  return reply(data)
			//
			reply().redirect('/releases')
		})

		.catch(err => reply(Boom.badData(err)))
	
	})
})


server.route({
	method: ['GET'], 
	path: '/releases/create',
	handler: ((request, reply) => {
		ImageFile.find({}).sort({_id: -1})
		.then(images => {
			reply.view('releases/single-template', {
				title: 'Releases, Create',
				images: images
			})			
		})
	})
})

server.route({
	method: ['POST'], 
	path: '/releases/create',
	handler: ((request, reply) => {
		const payload = request.payload
		const slug =  makeSlug(payload.artist+' '+payload.title)

		Release.create({
			slug: slug,
			artist: payload.artist,
			title: payload.title,
			images: payload.images,
			releaseDate: payload.releaseDate,
			releaseFormat: payload.releaseFormat,
			catalogNumber: payload.catalogNumber,
			contentMarkdown: payload.contentMarkdown,
			contentHtml: marked(payload.contentMarkdown),
			soundcloud: payload.soundcloud,
			buy: payload.buy,
		})

		.then(res => reply(res))	
		.catch(err => reply(Boom.badData(err)))
	})
})

server.route({
	method: ['POST', 'DELETE'], 
	path: '/releases/delete/{_id}',
	handler: ((request, reply) => {
		const params = request.params
		
		Release.findByIdAndRemove({_id: params._id})
		.then( () => reply().redirect('/releases'))
		.catch( err => reply(Boom.badData(err)) )
	})
})