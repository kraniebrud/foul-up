module.exports = (isThis, greaterOrEqual, options, context) => {
	//options.fn(this) .. returns content from inside helper
	return isThis >= greaterOrEqual ? options.fn(this) : ''
}