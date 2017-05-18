'USE STRICT'

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//
const UserSchema = new mongoose.Schema({
	username: {
		type: String, 
		required: true,
		unique: true
	},
	password: {
		type: String, 
		required: true,
		validate: new RegExp('^(?=.*[A-z])'), //must be atleast 6 characters and contain atleast one letter
	},
	role: {
		type: String,
		required: false,
		default: 'user'
	},
	isTemporaryPassword: {
		type: Boolean,
		default: true
	}
})

module.exports = mongoose.model('User', UserSchema)