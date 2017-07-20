const server = require(__base+'/server')

const path = require('path')
const shortid = require('shortid')
const makeSlug = require('slugg')
const marked = require('marked')
const Boom = require('boom')

const ImageFile = require(__base+'/db/models/ImageFile')
const News = require(__base+'/db/models/News')

server.route({
	method: ['GET'], 
	path: '/news',
	handler: ((request, reply) => {
		News.find({}).sort({_id: -1})
		.then(data => {
			reply.view('news/template', {
				title: 'News',
				posts: data
			})
		})
		.catch(err => reply(Boom.badData(err)))
	})
})

server.route({
	method: ['GET'], 
	path: '/news/{postId}',
	handler: ((request, reply) => {
		const postId = request.params.postId
		
		News
			.findOne({_id: postId})
			.populate('images')
			.exec()
		
		.then(postData => {
			if(!postData) return reply(Boom.notFound())
			
			ImageFile.find({})
			.sort({_id: -1})
			
			.then(images => {
				postData.allImages = images
				reply.view('news/single-template', {
					title: "News, Update",
					data: postData
				})
			})

		})
		.catch(err => {
			return reply(Boom.badData(err))
		})
	})
})

server.route({
	method: ['POST'], 
	path: '/news/{postId}',
	handler: ((request, reply) => {
		const payload = request.payload
		const postId = request.params.postId
		const draftUid = payload.draftUid
		News.findOneAndUpdate(
			{_id: postId}, 
			{
				title: payload.title,
				draft: payload.draft,
				draftUid: draftUid ? draftUid : shortid.generate(),
				images: payload.images,
				contentMarkdown: payload.contentMarkdown,
				contentHtml: marked(payload.contentMarkdown),
				notesMarkdown: payload.notesMarkdown,
				notesHtml: marked(payload.notesMarkdown)
			}
		)
		.then(() => reply().redirect('/news'))
		.catch(err => reply(Boom.badData(err)))
	})
})

server.route({
	method: ['GET'], 
	path: '/news/create',
	handler: ((request, reply) => {
		ImageFile.find({}).sort({_id: -1})
		.then(images => {
			reply.view('news/single-template', {
				title: 'News, Create',
				data: {
					allImages: images
				}
			})			
		})
	})
})

server.route({
	method: ['POST'], 
	path: '/news/create',
	handler: ((request, reply) => {
		const payload = request.payload
		News.create({
			slug: makeSlug(payload.title),
			draft: payload.draft,
			draftUid: shortid.generate(),
			title: payload.title,
			images: payload.images,
			contentMarkdown: payload.contentMarkdown,
			notesMarkdown: payload.notesMarkdown,
			contentHtml: marked(payload.contentMarkdown),
			notesHtml: marked(payload.notesMarkdown)
		})
		.then(() => reply().redirect('/news'))
		.catch(err => reply(Boom.badData(err)))
	})
})

server.route({
	method: ['POST', 'DELETE'], 
	path: '/news/delete/{_id}',
	handler: ((request, reply) => {
		const params = request.params
		News.findByIdAndRemove({
			_id: params._id
		})
		.then( () => reply().redirect('/news'))
		.catch( err => reply(Boom.badData(err)) )
	})
})