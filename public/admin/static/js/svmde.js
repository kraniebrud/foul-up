(function (){
	
	function getSelection() {
		// return window.getSelection().toString()
		return window.getSelection()
	}

	function textContainsANewLine (txt) {
		return txt.search('\n') !== -1
	}

	function execInsert(exTxt){
		console.log('execInsert')
		// document.execCommand('insertText', false, exTxt)
	}

	function buildElemsWithCommands (txtElem, commandList){
		var loadedTextareaValue = txtElem.value

		var mdContainer = document.createElement('div')
		var mdToolbar = document.createElement('ul')
		var mdEditor = document.createElement('div')
		var mdTextarea = document.createElement('textarea')

		var containerIdClass = 'svmde'+Date.now()
		mdContainer.className='svmde-container '+containerIdClass
		mdToolbar.className='svmde-toolbar'
		mdEditor.className = 'svmde-editor'
		mdTextarea.className = 'svmde-textarea'

		commandList.forEach(function(cmd){
			var cmdLi = document.createElement('li')
			cmdLi.dataset.cmd = cmd
			mdToolbar.appendChild(cmdLi)
		})

		mdEditor.setAttribute('contenteditable', true)
		
		mdContainer.appendChild(mdToolbar)
		mdContainer.appendChild(mdEditor)
		mdContainer.appendChild(mdTextarea)

		txtElem.outerHTML = mdContainer.outerHTML

		var container = document.querySelector('.'+containerIdClass)
		var toolbar = container.querySelector('.svmde-toolbar')
		var textarea = container.querySelector('.svmde-textarea')
		var editor = container.querySelector('.svmde-editor')
		textarea.value = loadedTextareaValue
		editor.innerHTML = loadedTextareaValue
		return {
			container: container,
			toolbar: toolbar,
			textarea: textarea,
			editor: editor
		}
	}

	if(typeof window.getSelection !== undefined){ //only if able to getSelection within browser 'window'
		document.querySelectorAll('.svmde').forEach(
			function(txtareaElem){
				newEditor(txtareaElem)
			}
		)
	}

	function newEditor (loadedTextareaElem){
		var ed = new Editor(loadedTextareaElem)
		var toolbar = ed.elem.toolbar
		var textarea = ed.elem.textarea
		var editor = ed.elem.editor
		
		toolbar.addEventListener('click', function(event){
			alert('click')
			//if(ed.isTextareaActivated){
				insert(event.target.dataset.cmd)
			//}
		})

		function markDescription(symb, description, newline) {
			var startSelect = ed.selectionStart+symb.length
			var endSelect  = ed.selectionStart+description.length+symb.length
			if(newline) endSelect++
			editor.setSelectionRange(startSelect, endSelect)
		}

		function insert (cmd){
			textarea.focus()
			var selStart = textarea.selectionStart
			var selEnd = textarea.selectionEnd
			ed.selectionStart = selStart
			ed.selectionEnd = textarea.selectionEnd




			var insTxt = textarea.value.substring(selStart, selEnd)
			
			console.log(editor.innerHTML.substring(selStart, selEnd))
			
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
	}

})()