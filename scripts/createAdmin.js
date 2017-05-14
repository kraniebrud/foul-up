require(__base+'/db/connection')

const bcrypt = require('bcryptjs')
const User = require(__base+'/db/models/User')
const generatedPassword = require('shortid').generate()

const adminUser = {
	username: 'admin',
	password:  bcrypt.hashSync(generatedPassword, 10) 
}

return  User.findOneAndUpdate({username: 'admin'}, adminUser)

.then( foundAdminUser => {
	if(foundAdminUser) {
		console.log('Admin password updated...')
		console.log('username:', adminUser.username)
		console.log('password:', generatedPassword)
		return process.exit(0)
	}

	return new User(adminUser).save()	
})

.then( res => {
	console.log('Admin created...')
	console.log('username:', adminUser.username)
	console.log('password:', generatedPassword)
	return process.exit(0)
})

.catch( err  => {
	console.log(err)
	process.exit(1)
})