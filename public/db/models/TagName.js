'USE STRICT'

const mongoose = require('mongoose')

const TagNameSchema = new mongoose.Schema({
	tagName: {
		type: String,
		unique: true,
		required: true
	},
	tagSlug: {
		type: String,
		unique: true,
		required: true,
		validate: '/^[a-z0-9]+(?:-[a-z0-9]+)*$/'
	}
})

module.exports = mongoose.model('TagName', TagNameSchema)