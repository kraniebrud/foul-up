const mongoose = require('mongoose')

//see for using ref
//https://alexanderzeitler.com/articles/mongoose-referencing-schema-in-properties-and-arrays/
const NewsSchema = new mongoose.Schema({
	slug: {
		type: String, 
		validate: new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		unique: true,
		required: true
	},
	title: {
		type: String,
		unique: true, 
		required: true
	},
	postDate: {
		type: Date,
		default: Date.now
	},
	draft: {
		type: Boolean,
		default: false
	},
	images: [{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'ImageFile',
		default: []
	}],
	tags: {
		type: Array,
		default: []
	},
	contentMarkdown: {
		type: String, 
		default: null
	},
	contentHtml: {
		type: String, 
		default: null
	},
	notesMarkdown: {
		type: String, 
		default: null
	},
	notesHtml: {
		type: String, 
		default: null
	}
})

module.exports = mongoose.model('News', NewsSchema)