var md = function(){

	function getSelection() {
		return window.getSelection().toString()
	}

	function mdH1() {

	}

	function execInsert(text){
		document.execCommand('insertText', false, text)
	}

	function simpelInsert(symbol, text){
		if(typeof symbol === 'object') execInsert(symbol[0]+text+symbol[0])
		else if(text.charAt(0) !== symbol.trim()) execInsert(symbol+text)	
	}

	function insert(cmd) {
		var mdToolbar = event.target.parentElement
		var mdArea = mdToolbar.parentElement.querySelector('textarea')
		mdArea.focus()

		var sText = getSelection()
		var text = sText.length === 0 ? 'Your text here' : sText

		switch(cmd) {
			case 'h1': 
				simpelInsert('# ', text)
				break;
			case 'b':
				simpelInsert(['**'], text)
				break;
			case 'u':
				simpelInsert(['*'], text)
				break;
		}
		
	}

	return {
		insert: insert.bind(event)
	}

}()