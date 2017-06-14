var SSMDE = function(){

	function getSelection() {
		return window.getSelection().toString()
	}

	function execInsert(text){
		document.execCommand('insertText', false, text)
	}

	function simpelInsert(symbol, text){
		if (typeof symbol === 'object'){
			var symb = symbol[0]
			execInsert(symb+text+symb)
		} 
		else if(text.charAt(0) !== symbol){
			execInsert(symbol+' '+text)
		}	
	}

	function insert(cmd) {
		var mdToolbar = event.target.parentElement
		var mdArea = mdToolbar.parentElement.querySelector('textarea')
		mdArea.focus()

		var sText = getSelection()
		var text = sText.length === 0 ? 'Your text here' : sText

		switch(cmd) {
			case 'h1': 
				simpelInsert('#', text)
				break;
			case 'b':
				simpelInsert(['**'], text)
				break;
			case 'u':
				simpelInsert(['*'], text)
				break;
		}
		
	}

	var editor = function(mde){
		this.toolbar = mde.createElement('<div>')
		toolbar.createElement('<h1>').innerText = 'hej' 
	}

	var editorElems = document.querySelectorAll('.mde')

	editorElems.forEach(function(eElem){
		var blah = new editor(eElem)
		/*
		eElem.querySelector('.mde-toolbar')
			.addEventListener('click', function(event){
				console.log(event)
			})
		*/
	})

	return {
		insert: insert.bind(event)
	}

}()