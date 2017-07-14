(function (){

	if(typeof document.execCommand === undefined) {
		console.log(' :( SVDME missing document.execCommand ')
		return
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

	document.querySelectorAll('.svmde').forEach(
		function(txtareaElem){
			newEditor(txtareaElem)
		}
	)

	function newEditor (loadedTextareaElem){
		var ed = new Editor(loadedTextareaElem)
		var toolbar = ed.elem.toolbar
		var textarea = ed.elem.textarea
		var editor = ed.elem.editor
		
		toolbar.addEventListener('click', function(event){
			insert(event.target.dataset.cmd)
		})

		function insert (cmd){
			textarea.focus()
			var txt = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
			switch(cmd) {
				case 'h1': 
					execInsert(wrappingTag('#', txt))
					break
				case 'b':
					execInsert(wrappingTag(['**'], txt))
					break
				case 'u':
					execInsert(wrappingTag(['*'], txt))
					break
				case 'ul':
					execInsert(multilineTag('*', txt))
					break
				case 'br':
					execInsert(nonWrappingTag('<br>', txt))
					break
				case 'hr':
					execInsert(nonWrappingTag('---', txt))
			}
		}

		function execInsert(txt){
			var beforeTxt = textarea.value.substring(0, textarea.selectionStart)
			var afterTxt = textarea.value.substring(textarea.selectionEnd, textarea.value.length)
			var ctx = beforeTxt+txt+afterTxt

			editor.innerHTML = ''
			editor.focus()
			document.execCommand('insertText', false, txt)
			
			textarea.value = ctx
			textarea.focus()
		}

		function textOnCurrentLine (extender) { //until cursor position
			var a = extender ? extender : 0
			var txtUptoCurr = textarea.value.substring( - textarea.value.length + textarea.selectionStart, a+textarea.selectionStart)
			var lineArr = txtUptoCurr.split('\n')
			return lineArr [ lineArr.length -1 ]
		}

		function textContains (txt, lookup, operator) {
			if(typeof lookup !== 'object'){
				if(operator === '==' ) return txt === lookup
				return txt.search(lookup) !== -1
			}
			return lookup.some(function(look){
				if(operator === '==' ) return txt === look
				return txt.search(look) !== -1
			})
		}

		//<tag></tag> is a wrapping tag
		function wrappingTag(symbol, selectionText){
			var noSelectedText = selectionText.length === 0
			var curL = textOnCurrentLine()
			if( textContains(selectionText.trim(), ['<br>', '---'], '==') ){
				return selectionText
			}
			if (typeof symbol === 'object'){ // has before and after, such as ** Bold **
				var symb = symbol[0]
				if( noSelectedText || (curL.length === 0 && textContains(selectionText, ['#', '<br>', '---'])) ) { //abort
					return selectionText 
				}
				return symb+selectionText+symb
			}
			else {
				var symb = selectionText.length === 0 || selectionText.charAt(0) !== symbol ? symbol+' ' : symbol
				var n = curL.length > 0 ? '\n' : ''
				return n+symb+selectionText
			}
		}

		function nonWrappingTag(symbol, selectionText){
			var bN = textOnCurrentLine().length !== 0 ? '\n' : ''
			var aN = textOnCurrentLine(2) !== undefined ? '\n' : ''
			return bN+selectionText+symbol+aN
		}

		function multilineTag(symbol, selectionText) {
			var txt = ''
			if( textContains (selectionText, '\n') === false) {
				txt = wrappingTag(symbol, selectionText)
			}
			else{
				var lines = selectionText.split('\n')
				for(var i = 0; lines.length > i; i++){
					var newline = '\n'
					if(i === lines.length-1) newline = ''
					txt += wrappingTag(symbol, lines[i]+newline)
				}
			}
			return txt
		}

	}

	 function Editor (txtElem) {
	 	var self = this
		this.elem = buildElemsWithCommands(txtElem, ['h1', 'b', 'u', 'ul', 'br', 'hr'])
	}

})()