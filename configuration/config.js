const _config = require('./_config')

module.exports = {
	db: {
		uri: _config.db.uri,
		options: _config.db.options
	}
}