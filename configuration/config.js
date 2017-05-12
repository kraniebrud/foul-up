const _config = require('./setup.config')

const config = Object.assign(
	{
		db: {
			uri: 'mongodb://localhost:27000/mycoolapp',
			options: {}
		}
	},
	_config
)

module.exports = config