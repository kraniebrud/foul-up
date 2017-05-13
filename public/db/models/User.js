'USE STRICT'

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//validate: new RegExp('^(?=.{6,})(?=.*[A-z])'), //must be atleast 6 characters and contain atleast one letter
const UserSchema = new mongoose.Schema({
	username: {
		type: String, 
		required: true,
		unique: true
	},
	password: {
		type: String, 

		required: true
	},
	isTemporaryPassword: {
		type: Boolean,
		default: true
	}
})

//make the password a hashed one before saving ... 
UserSchema.pre('save', function(next) { 
	const user = this
	if (!user.isModified('password')) return next()
	bcrypt.hash(user.password, 10, (err, hashedPwd) => {
		if(err) return next(err)
		user.password = hashedPwd
		next()
	})
})

module.exports = mongoose.model('User', UserSchema)