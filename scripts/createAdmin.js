require(__base+'/db/connection')

const User = require(__base+'/db/models/User')

const generatedPassword = require('shortid').generate()

const adminUser = {
	username: 'admin',
	password: generatedPassword
}

 User.findOneAndUpdate({username: 'admin'}, adminUser)
.then( res => {
	console.log('Admin created ->', adminUser)
	process.exit(0)
})
.error( err  => {
	throw err
})