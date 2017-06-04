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

server.route({
	method: ['GET'], 
	path: '/users/create',
	handler: ((request, reply) => {
		const authenticatedUser = request.auth.credentials

		if(authenticatedUser.role !== 'admin'){
			toasting.setMessage('Role admin required', 'FAILED')
			return reply().redirect('/users')
		}

		reply.view('users/create', {
			title: 'Users, New user',
			authenticated: authenticatedUser
		})
	})
})


server.route({
	method: ['post'], 
	path: '/users/create',
	handler: ((request, reply) => {
		const authenticatedUser = request.auth.credentials

		if(authenticatedUser.role !== 'admin'){
			toasting.setMessage('Role admin required', 'FAILED')
			return reply().redirect('/users')
		}

		const newUser = {
			username: request.payload.username,
			password: bcrypt.hashSync(request.payload.password, 10),
			role: request.payload.role
		}

		new User(newUser).save()
		.then(() => {
			toasting.setMessage('User '+newUser.username+' created')
			return reply().redirect('/users')
		})

		.catch(err => reply(Boom.badData(err)))

	})
})