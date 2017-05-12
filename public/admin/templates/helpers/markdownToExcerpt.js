module.exports = function(markdownText, excerptLen) {
	const removeMarkdown = require('remove-markdown')
	const plainText = removeMarkdown(markdownText)
	const tailingDots = plainText.length > excerptLen ? '...' : ''
	return plainText.substr(0, excerptLen)+tailingDots
}