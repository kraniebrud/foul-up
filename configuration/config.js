const _config = require('./setup.config')
const bcrypt = require('bcryptjs')

const config = Object.assign(
	{
		db: {
			uri: 'mongodb://localhost:27000/mycoolapp',
			options: {}
		},
		cookie: {
			//Overrides itself on every server start, making currently session cookies invalid. 
			password: bcrypt.genSaltSync()+'123',
			cookie: 'mycoolappcookie',
			ttl: 259200000, //3days in msec
			isSecure: false, //non-http
			redirectTo: '/login',
			redirectOnTry: false
		}
	},
	_config
)

module.exports = config