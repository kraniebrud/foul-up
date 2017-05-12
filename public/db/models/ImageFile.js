'USE STRICT'

const mongoose = require('mongoose')

const ImageFileSchema = new mongoose.Schema({
	title: {
		type: String, 
		default: '',
		required: false
	},
	fileName: {
		type: String,
		unique: true,
		required: true
	}
})

module.exports = mongoose.model('ImageFile', ImageFileSchema)