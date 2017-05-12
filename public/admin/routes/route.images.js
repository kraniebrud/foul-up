const server = require(__base+'/server')
const path = require('path')
const makeSlug = require('slugg')
const fs = require('fs')

const ImageFile = require(__base+'/db/models/ImageFile')

server.route({
	method: ['GET'], 
	path: '/images',
	config: {
		auth: {strategy : 'session'},
	},
	handler: ((request, reply) => {
		ImageFile.find({}).sort({_id: -1}).exec((err, images) => {
			reply.view('images/template', {
				title: "Images",
				data: {images}
			})
		})
	})
})

server.route({
	method: ['GET'], 
	path: '/images/upload',
	config: {
		auth: {strategy : 'session'},
	},
	handler: ((request, reply) => {
		ImageFile.find({}).sort({_id: -1}).exec((err, images)=>{
			reply.view('images/upload-template', {
				title: "Images, Upload",
				data: {images}
			})
		})
	})
})

const easyimage = require('easyimage')
server.route({
	method: ['POST'], 
	path: '/images/upload',
	config: {
		auth: {strategy : 'session'},
		payload: {
			output: 'stream',
			parse: true,
			allow: 'multipart/form-data'
		}
	},
	handler: ((request, reply) => {
		const data = request.payload
		
		if(data.image){
			const uploadBase = __base+'/uploads/images'
			const fileNameWithExt = data.image.hapi.filename
			const fileName = path.basename(fileNameWithExt, path.extname(fileNameWithExt))
			const sluggedFileName = makeSlug(fileName, '-')+'.jpg'
			const originalFile = uploadBase+'/original/'+sluggedFileName

			data.image.pipe(fs.createWriteStream(originalFile))

			data.image.on('end',()=>{
				easyimage.resize({
					src: originalFile, 
					dst: uploadBase+'/resized/'+sluggedFileName,
					quality: 85,
					width: 1000
				})
				easyimage.resize({
					src: originalFile, 
					dst: uploadBase+'/thumbnail/'+sluggedFileName,
					quality: 85,
					width: 175
				})
				
				new ImageFile({fileName: sluggedFileName}).save(() => {
					ImageFile.find({}).sort({_id: -1}).exec((err, images) => {
						reply.view('images/upload-template', {
							data: {images},
							toast: {
								type: 'SUCCESS', 
								message: sluggedFileName+' was uploaded'
							}
						})
					})
				})
			})
		}
	})
})

server.route({
	method: ['POST', 'DELETE'], 
	path: '/images/delete/{_id}',
	config: {
		auth: {strategy : 'session'},
	},
	handler: ((request, reply) => {
		const params = request.params
		ImageFile.findByIdAndRemove({
			_id: params._id
		})
		.then( () => reply().redirect('/images/upload'))
		.catch( err => reply(Boom.badData(err)) )
	})
})