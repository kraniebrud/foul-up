const server = require(__base+'/server')

server.route({
	method: ['GET', 'POST'], 
	path: '/login',
	handler: function(request, reply){
		const data = request.payload ? request.payload : {}
		reply.view('login/template', {
			title: "Login",
			data: data,
			toast: {type: 'FAILED', message: 'Bleh. No good.'}
		})
		.code(401)
	}
})