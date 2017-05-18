const server = require(__base+'/server')
const User = require(__base+'/db/models/User')

const Boom = require('boom')
const bcrypt = require('bcryptjs')
const shortid = require('shortid')

server.route({
	method: ['GET', 'POST'], 
	path: '/login',
	config: {
		auth: false
	},
	handler: function(request, reply){

		request.cookieAuth.clear()

		const payload = request.payload ? request.payload : null

		if(!payload) {
			return reply.view('login/template', {
				title: "Login",
			})
			.code(401)
		}

		let authenticatedUser

		User.findOne({username: payload.username})
		.then( foundUser => {
			authenticatedUser = foundUser
			if(!foundUser) throw Boom.unauthorized()
			return bcrypt.compare(payload.password, foundUser.password)
		})

		.then( passwordMatch => {
			if(!passwordMatch) throw Boom.unauthorized()
			request.cookieAuth.set(authenticatedUser)
			reply().redirect('/news')	
		})

		.catch( err => {
			console.error(err)
			if(!err.isBoom) return reply(err)			

			reply.view('login/template', {
				title: "Login",
				toast: {type: 'FAILED', message: 'Bleh. No good.'}
			})
			.code(401)
		})
	}
})