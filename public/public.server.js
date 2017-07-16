const server = require('./server')

const {SERVER_PORT} = process.env

const path = require('path')
const fs = require('fs')

const connection = {
	host: 'localhost',
	port: SERVER_PORT
}

server.register([require('inert'), require('vision')], (err) => {
	
	if(err) console.log('faild to register vision')
	
	server.views({
		engines: {html: require('handlebars')},
		relativeTo: __dirname,
		path: './www/templates',
		layout: true,
		layoutPath: './www/templates/layout',
		helpersPath: './www/templates/helpers'
	})

	server.connection(connection)
	server.start((err) => {
		console.log('Server running at:', server.info.uri);
		
		// SERVE STATIC FILES
		server.route({
			method: 'GET',
			path: '/assets/{filename*}',
			handler: {
				directory: {
					path: path.join(__dirname, './www/static'),
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
	
		require('./www/server.routes')

	})
})