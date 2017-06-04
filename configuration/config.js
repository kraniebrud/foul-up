const _config = require('./setup.config')
const bcrypt = require('bcryptjs')

const config = Object.assign(
	{
		db: _config.db,
		cookie: {
			//Overrides itself on every server start, making currently session cookies invalid. 
			password: bcrypt.genSaltSync()+'123',
			cookie: _config.cookie.cookie,
			ttl: 259200000 //3days in msec
		}
	},
	_config
)

module.exports = config