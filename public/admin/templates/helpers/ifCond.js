module.exports = (isThis, operator, theSame, options) => {
	//options.fn(this) .. returns content from inside helper
	switch(operator){
		case '===' : {
			return isThis === theSame ? options.fn(this) : options.inverse(this)
			break
		}
		case '!==' : {
			return isThis !== theSame ? options.fn(this) : options.inverse(this)
			break
		}
	}
	
}