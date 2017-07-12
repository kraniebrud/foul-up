(function (){
	
	var ed

	function newEditor (loadedTextareaElem){
		ed = new Editor(loadedTextareaElem)
		var toolbar = ed.elem.toolbar
		var textarea = ed.elem.textarea		
		toolbar.addEventListener('click', function(event){
			if(ed.isTextareaActivated){
				insert(event.target.dataset.cmd)
			}
		})		
	}

	 function Editor (txtElem) {
	 	var self = this
		this.elem = buildElemsWithCommands(txtElem, ['h1', 'b', 'u', 'ul', 'br', 'hr'])
		this.isTextareaActivated = false

		function setActivateTextArea () {
			self.isTextareaActivated = true 
			self.elem.textarea.removeEventListener('click', setActivateTextArea)
		}
		this.elem.textarea.addEventListener('click', setActivateTextArea)

		this.elem.container.addEventListener('mouseenter', function () {
			//swaps active editor on mouseenter)
			ed = self
		})
	}

	document.querySelectorAll('.svmde').forEach(
		function(txtareaElem){
			newEditor(txtareaElem)
		}
	)

	function buildElemsWithCommands (txtElem, commandList){
		var loadedTextareaAttributes = txtElem.attributes
		var loadedTextareaValue = txtElem.value

		var mdContainer = document.createElement('div')
		var mdToolbar = document.createElement('ul')
		var mdTextarea = document.createElement('textarea')

		//keep the originated attributes on textarea
		for(var i = 0; loadedTextareaAttributes.length > i; i++){
			var attr = loadedTextareaAttributes[i]
			mdTextarea.setAttribute(attr.nodeName, attr.nodeValue)
		}

		var containerIdClass = 'svmde'+Date.now()
		mdContainer.className='svmde-container '+containerIdClass
		mdToolbar.className='svmde-toolbar'

		commandList.forEach(function(cmd){
			var cmdLi = document.createElement('li')
			cmdLi.dataset.cmd = cmd
			mdToolbar.appendChild(cmdLi)
		})
		
		mdContainer.appendChild(mdToolbar)
		mdContainer.appendChild(mdTextarea)

		txtElem.outerHTML = mdContainer.outerHTML

		var container = document.querySelector('.'+containerIdClass)
		var toolbar = container.firstElementChild
		var textarea = container.lastElementChild

		textarea.value = loadedTextareaValue
		return {
			container: container,
			toolbar: toolbar,
			textarea: textarea
		}
	}

	function getSelection() {
		return window.getSelection().toString()
	}

	function textContainsANewLine (txt) {
		return txt.search('\n') !== -1
	}

	function execInsert(exTxt){
		document.execCommand('insertText', false, exTxt)
	}

	function markDescription(symb, description, newline) {
		var startSelect = ed.selectionStart+symb.length
		var endSelect  = ed.selectionStart+description.length+symb.length
		if(newline) endSelect++
		ed.elem.textarea.setSelectionRange(startSelect, endSelect)
	}

	//<tag></tag> is a wrapping tag
	function wrappingTag(symbol, sText, description){
		var noSelectedText = sText.length === 0
		if(sText === description) return
		if(description !== undefined && noSelectedText === true){
			sText = description
		}
		if (typeof symbol === 'object'){
			var symb = symbol[0]
			execInsert(symb+sText+symb)
		} 
		else {
			var firstChar = sText.charAt(0)
			var symb = firstChar !== symbol ? symbol+' ' : symbol
			var tValue = ed.elem.textarea.value
			var charBeforeCursor = tValue.substring(ed.selectionStart, ed.selectionStart-1)
			execInsert(symb+sText)
		}
		if(noSelectedText){
			markDescription(symb, sText)
		}
	}

	function nonWrappingTag(symbol, sText){
		execInsert(sText+symbol)
	}

	function multilineTag(symbol, sText, description) {
		if(textContainsANewLine(sText) === false) {
			wrappingTag(symbol, sText, description)
		}
		else{
			var lines = sText.split('\n')
			for(var i = 0; lines.length > i; i++){
				var newline = '\n'
				if(i === lines.length-1) newline = ''
				wrappingTag(symbol, lines[i]+newline)
			}
		}
	}

	function insert (cmd){
		ed.elem.textarea.focus()
		ed.selectionStart = ed.elem.textarea.selectionStart
		var insTxt = getSelection()
		switch(cmd) {
			case 'h1': 
				wrappingTag('#', insTxt, 'Headline text')
				break;
			case 'b':
				wrappingTag(['**'], insTxt, 'Bold text')
				break;
			case 'u':
				wrappingTag(['*'], insTxt, 'Underlined text')
				break;
			case 'ul':
				multilineTag('*', insTxt, 'Listed text')
				break;
			case 'br':
				nonWrappingTag('<br>\n', insTxt)
				break;
			case 'hr':
				nonWrappingTag('\n---\n', insTxt)
		}
	}

})()