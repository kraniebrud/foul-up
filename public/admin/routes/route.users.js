'USE STRICT'

const server = require(__base+'/server')
const Boom = require('boom')
const bcrypt = require('bcryptjs')

const User = require(__base+'/db/models/User')

const toasting = require(__base+'/helpers/helper.toasting')

server.route({
	method: ['GET'], 
	path: '/users',
	handler: ((request, reply) => {
		const authenticatedUser = request.auth.credentials
		User.find({}).sort({_id: -1})
		.then(data => {
			reply.view('users/template', {
				title: 'Users',
				users: data,
				authenticated: authenticatedUser,
				toast: toasting.getMessage() 
			})
		})
		.catch(err => reply(Boom.badData(err)))
	})
})

server.route({
	method: ['POST'], 
	path: '/users',
	handler: ((request, reply) => {
		const authenticatedUser = request.auth.credentials
		//couldve prolly be handled with auth.scop to route auth
		if(authenticatedUser.role !== 'admin'){
			toasting.setMessage('Role admin required', 'FAILED')
			return reply().redirect('/users')
		}

		const payload = request.payload
		User.findOneAndUpdate({_id: payload._id}, {
			password:  bcrypt.hashSync(payload.password, 10) 
		})
		.then( res => {
			toasting.setMessage('Password is now changed')
			return reply().redirect('/users')
		})
		.catch( err => {
			reply(Boom.badData(err))
		})
	})
})