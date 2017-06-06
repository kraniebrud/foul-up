module.exports = function(markdownText) {
	const marked = require('marked')
	return marked(markdownText)
}