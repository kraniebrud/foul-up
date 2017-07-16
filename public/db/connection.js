const {DB_HOST, DB_NAME, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_AUTH_NAME} = process.env

const mongoose = require('mongoose')

mongoose.connect(
		`mongodb://${DB_HOST}/${DB_NAME}:${DB_PORT}`, {
		server: { poolSize: 5 },
		user: DB_USERNAME,
		pass: DB_PASSWORD
	}
)

mongoose.Promise = require('bluebird')