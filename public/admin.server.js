const server = require('./server')

const {
	SERVER_HOST, ADMIN_PORT,
	COOKIE_NAME, COOKIE_PASSWORD, COOKIE_TTL
} = process.env

const bcrypt = require('bcryptjs')
const path = require('path')

const connection = {
	host: SERVER_HOST,
	port: ADMIN_PORT
}

// makes it easy to see if request(s) accepts json
// suitable to transform endpoints for API-usage 
// decorates -> request.likesJson()
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

server.auth.strategy(
	'session', 'cookie', 'required', //required on routes by default 
	{
		cookie: COOKIE_NAME,
		password: COOKIE_PASSWORD,
		redirectTo: '/login',
		ttl: COOKIE_TTL, 
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

require('./admin/server.routes')