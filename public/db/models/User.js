const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema('User', {
	username: {
		type: String, 
		required: true,
		unique: true
	},
	password: {
		type: String, 
		validate: new RegExp('^(?=.{6,})(?=.*[A-z])'), //must be atleast 6 characters and contain atleast one letter
		required: true
	},
	isTemporaryPassword: {
		type: Boolean,
		default: true
	}
})

UserSchema.pre(save, function(next) {

})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {

}


console.log(UserSchema)