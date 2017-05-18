'USE STRICT'

const bcrypt = require('bcryptjs')

const server = require('./server')
const path = require('path')

const connection = {
	host: 'localhost',
	port: 3100
}

/*
	makes it easy to see if request accepts json
	**usage request.likesJson()
*/
function hapiRequestAcceptsJson(server, options, next) {
	server.decorate('request', 'likesJson', function () {
		return this.headers.accept === 'application/json'
	})
	next()
}

hapiRequestAcceptsJson.attributes = {
	name: 'hapiRequestAcceptsJson'
}

server.connection(connection)

server.register([
		require('inert'),
		require('vision'),
		require('hapi-auth-cookie'),
		hapiRequestAcceptsJson
	], 
	err => {
		if(err) throw new Error(err)
		server.start( err => {
			if(err) throw new Error(err) 
			console.log('Server admin running: ', server.info.uri)
		})
	}
)

const cookie = require(__base+'/../configuration/config').cookie
server.auth.strategy(
	'session', 'cookie', 'required', //required on routes by default 
	{
		cookie: cookie.cookie,
		password: cookie.password,
		redirectTo: '/login',
		ttl: cookie.ttl, //3days in msec
		isSecure: false, //non-http
	}
)

// SERVE STATIC FILES
server.route({
	method: 'GET',
	path: '/assets/{filename*}',
	config: {
		auth: false
	},
	handler: {
		directory: {
			path: path.join(__dirname, './admin/static/'),
			listing: false,
			index: false
		}
	}
})

// SERVE UPLOADS
server.route({
	method: 'GET',
	path: '/uploads/{filename*}',
	handler: {
		directory: {
			path: path.join(__dirname, './uploads/'),
			listing: false,
			index: false
		}
	}
})

server.views({
	engines: {html: require('handlebars')},
	relativeTo: __dirname,
	path: './admin/templates/views',
	layout: true,
	layoutPath: './admin/templates/layout',
	partialsPath: './admin/templates/partials',
	helpersPath: './admin/templates/helpers'
})

//Them routes
require('./admin/server.routes')