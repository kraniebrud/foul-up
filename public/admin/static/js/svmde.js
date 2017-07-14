(function (){

	if(typeof document.execCommand === undefined) {
		console.log(' :( SVDME missing document.execCommand ')
		return
	}

	var commandList = ['h', 'b', 'i', 'ul', 'br', 'hr']

	function Editor (txtElem) {
	 	var self = this
		this.elem = buildElemsWithCommands(txtElem, commandList)
	}

	function buildElemsWithCommands (txtElem, commandList){
		var loadedTextareaAttributes = txtElem.attributes
		var loadedTextareaValue = txtElem.value

		var mdContainer = document.createElement('div')
		var mdToolbar = document.createElement('ul')
		var mdEditor = document.createElement('div')
		var mdTextarea = document.createElement('textarea')

		//keep the originated attributes on textarea
		for(var i = 0; loadedTextareaAttributes.length > i; i++){
			var attr = loadedTextareaAttributes[i]
			mdTextarea.setAttribute(attr.nodeName, attr.value)
		}

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
	
	function enableOrDisableCommands (disableCmd, toolbar, cmds) {
		var disableClass = disableCmd ? 'disabled' : ''
		cmds.forEach( function(cmd) {
			toolbar.querySelector('li[data-cmd='+cmd+']').className=disableClass
		})
		
	}

	function newEditor (loadedTextareaElem){
		var ed = new Editor(loadedTextareaElem)
		var toolbar = ed.elem.toolbar
		var textarea = ed.elem.textarea
		var editor = ed.elem.editor
		
		toolbar.addEventListener('click', function(event){
			var t = event.target
			if(t.className.indexOf('disabled') === -1) {
				insert(t.dataset.cmd)
			}
		})
		
		setInterval(function(){
			var selectionText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
			var noSelectedText = selectionText.trim().length === 0
			enableOrDisableCommands(noSelectedText, toolbar, ['b', 'i'])
		}, 200)

		function insert (cmd){
			textarea.focus() //keeps the history (ctrl+z happy)
			var txt = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
			switch(cmd) {
				case 'h': 
					execInsert(wrappingTag('#', txt))
					break
				case 'b':
					execInsert(wrappingTag(['**'], txt))
					break
				case 'i':
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

		editor.addEventListener('keyup', function(){
			editor.innerHTML = ''
			editor.focus()
			document.execCommand('insertText', false, textarea.value)
		})

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

		function textOnCurrentLine (extender) { //that is until cursor position
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
			var curL = textOnCurrentLine()
			if( textContains(selectionText.trim(), ['<br>', '---'], '==') ){
				return selectionText
			}
			if (typeof symbol === 'object'){ // has before and after, such as ** Bold **
				var symb = symbol[0]
				if(curL.length === 0 && textContains(selectionText, ['# ', '<br>', '---'])) { //abort
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
})()