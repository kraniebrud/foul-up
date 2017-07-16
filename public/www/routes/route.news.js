const server = require(__base+'/server')
const {NEWS_PER_PAGE} = process.env

const Boom = require('boom')

const News = require(__base+'/db/models/News')
const ImageFile = require(__base+'/db/models/ImageFile')

const getNews = function() {

	const paginated =  ((request, reply) => {
		const post = {items: null}
		const p = parseInt(request.params.page)
		const perPage = NEWS_PER_PAGE ? parseInt(NEWS_PER_PAGE) : 5
		const page = (!p || p === 0 ? 1 : p)

		return News
			.find({draft: false})
			.skip( perPage * (page-1) )
			.limit(perPage)
			.populate('images')
			.sort({_id: -1})

		.then(data => {
			post.items = data
			return News.count({})
		})

		.then(totalCount => {
			
			const hasContent = post.items.length !== 0
			
			const totalPages = Math.ceil(totalCount / perPage)
			const pages = []
			for(let i = 1;  (i > totalPages) === false; i++) {
				pages.push({page: i, active: i === page})
			}

			const pagination = {
				currently: page,
				pages: pages,
				totalPosts: totalCount,
				totalPages: totalPages,
				next: hasContent ? (totalPages === page ? false : page + 1) : false,
				previous: hasContent ? (page > 0 ? page - 1 : false) : false
			}

			reply.view('news/template', {
				title: 'News',
				menu: {active : 'news'},
				posts: post.items,
				pagination: pagination
			})
			.code(hasContent ? 200 : 404)

		})

		.catch(err => {
			console.error(err)
			reply(Boom.badImplementation(err))
		})

	})

	const singleArticle = ((request, reply) => {
		const slug = request.params.slug
		const draftUid = request.query.draft
		const news = {slug, draft: false}
		if(draftUid !== undefined) {
			Object.assign(news, {draft: true, draftUid})
		}
		console.log(news)
		return News
			.findOne({draft: true, draftUid})
			.populate('images')

		.then(data => {
			if(!data) {
				return reply
					.view('404', {
						menu: {active : 'news'},
						title: 'News, article not found',
						body: 'Article: '+slug
					})
					.code(404)
			}
			const viewData = {
				menu: {active : 'news'},
				title: "News, "+data.title,
				post: data
			}
			if(data.draft) {
				return reply.view('news/single-template', viewData).code(403)
			}
			reply.view('news/single-template', viewData)
		})

		.catch(err => {
			console.error(err)
			reply(Boom.badImplementation(err))
		})

	})
	return {paginated, singleArticle}
	
}()

server.route({
	method: ['GET'], 
	path: '/',
	handler: getNews.paginated
})

server.route({
	method: ['GET'], 
	path: '/news',
	handler: getNews.paginated
})

server.route({
	method: ['GET'], 
	path: '/news/page/{page}',
	handler: getNews.paginated
})

server.route({
	method: ['GET'], 
	path: '/news/article/{slug}/{draft?}',
	handler: getNews.singleArticle
})