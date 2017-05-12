const mongoose = require('mongoose')

const ReleaseSchema = new mongoose.Schema({
	slug: {
		type: String, 
		validate: new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		unique: true,
		required: true
	},
	artist: {
		type: String,
		unique: true, 
		required: true
	},
	title: {
		type: String,
		unique: true, 
		required: true
	},
	releaseDate: {
		type: String,
		required: true
	},
	releaseFormat: {
		type: String,
		required: true
	},
	catalogNumber: {
		type: String,
		required: true
	},
	images: [{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'ImageFile',
		default: []
	}],
	contentMarkdown: {
		type: String, 
		default: null
	},
	contentHtml: {
		type: String, 
		default: null
	},
	soundcloud: {
		embedSongCode: String,
		embedSongText: String,
		linkUrl: String,
		linkText: String
	},
	buy: [{
		buyText: String,
		buyUrl: String
	}]
})

module.exports = mongoose.model('Release', ReleaseSchema)