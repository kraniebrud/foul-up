require('dotenv').config()

const Hapi = require('hapi')
global.__base = __dirname

require('./db/connection')

module.exports = new Hapi.Server({
	connections: {
		router: {
			isCaseSensitive: false,
			stripTrailingSlash: true
		}
	}
})