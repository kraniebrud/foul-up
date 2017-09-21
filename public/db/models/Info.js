const mongoose = require('mongoose')

const InfoSchema = new mongoose.Schema({
	contentHeader: {
		type: String,
		default: undefined
	},
	contentMarkdown: {
		type: String, 
		default: null
	},
	contentHtml: {
		type: String, 
		default: null
	},
	emailAddress: String,
	soundcloudUrl: String,
	facebookUrl: String,
	instagramUrl: String,
	youtubeUrl: String,
	spotifyUrl: String,
	distributionUrl: String,
	distributionText: String
})

module.exports = mongoose.model('Info', InfoSchema)