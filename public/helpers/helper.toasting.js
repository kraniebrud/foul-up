//idea ok, but it kinda sux still :P
//you should really consider chaging it,
//what if we got more users, then some long wait request and some other user
//makes change some other might receive his message.
//scopin with unique identifiers and remove could solve that though?
module.exports = ( () => {
	let toast
	return {
		setMessage: (message, withType) => {
			let type = withType ? withType : 'SUCCESS'
			toast = {message, type}
		},
		getMessage: () => {
			setTimeout( () => {
				toast = null
			}, 5)
			return toast
		}
	}
})()