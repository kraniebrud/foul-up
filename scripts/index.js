global.__base = __dirname+'/../public'

const script = process.env.script

switch(script){
	case 'create-admin':
		require('./createAdmin')
}