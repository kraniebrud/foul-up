'USE STRICT'

const server = require(__base+'/server')

server.route({
	method: ['GET'], 
	path: '/help/typing-with-markdown',
	handler: ((request, reply) => {
		reply.view('help/typing-with-markdown', {
			title: 'Typing with markdown',
			data: [
				{
					header: 'Headline',
					items: [
						{ 
							example: ''
								+ '# YEAH BOII'
								+	'<p>And other hiphop stuff</p>',
							description: ''
								+ '	Makes a headline with apropriate space and provides better search optimization.',
							md: ''
								+ '# YEAH BOII \n'
								+	'And other hiphop stuff'
						}
					]
				},
				{
					header: 'Links',
					items: [
						{ 
							example: 'http://www.lenesberner.dk/',
							description: 'Makes a link with the url-address as text',
							md: 'http://www.lenesberner.dk/'
						},
						{ 
							example: '[The original HOT Sauce](http://hotsauce.com)',
							description: 'Makes a link with where the content wrapped within \'[ ]\' becomes the content of the link text',
							md: '[The original HOT Sauce](http://hotsauce.com)'
						}
					]
				},
				{
					header: 'Seperator',
					items: [
						{
							example: ''
								+ '<p>Wiggy wiggy</p>'
								+ '---'
								+ '<p>Slim shady</p>',
							description: 'Makes additionally whitespace inorder to seperate content from eachother',
							md: ''
								//Trouble with this one for some reason, renders ok in article.. promise
								+ '<p>Wiggy wiggy</p>'
								+ '<hr />'
								+ '<p>Slim shady</p>'
						}
					]
				},
				{
					header: 'Text in italic',
					items: [
						{
							example: '*This take text is leaning, like your dad at the local pub*',
							description: 'Makes the text go italic',
							md: '*This take text is leaning, like your dad at the local pub*'
						}
					]
				},
				{
					header: 'Text in bold',
					items: [
						{
							example: '**This text is fat, like your mom**',
							description: 'Makes the text goes bold',
							md: '**This text is fat, like your mom**'
						}
					]
				},
				{
					header: 'An unordered listed of items',
					items: [
						{
							example: ''
								+ '- Forever young <br>'
								+ '- I wanna be <br>'
								+ '- Forever young <br>',
							description: 'Makes a list of items with &ndash; used as list symbol',
							md: ''
								+ '- Forever young \n'
								+ '- I wanna be \n'
								+ '- Forever young \n'
						}
					]
				},
				{
					header: 'An ordered list of items',
					items: [
						{
							example: ''
								+ '1. Forever young <br>'
								+ '2. I wanna be <br>'
								+ '3. Forever young <br>',
							description: 'Makes a list of items in a numbered order',
							md: ''
								+ '1. Forever young \n'
								+ '2. I wanna be \n'
								+ '3. Forever young \n'
						}
					]
				},
				{
					header: 'Soft line-break',
					items: [
						{
							example: ''
								+ 'I am a ..&lt;br&gt; <br>'
								+ '.. softy guy.',
							description: 'Makes a line-break with lesser space',
							md: ''
								+ 'I am a .. <br>\n'
								+ '..softy guy'						}
					]
				}
			]
		})
		.code(401)
	})
})