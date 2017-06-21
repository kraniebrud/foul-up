(function (){
	
	var buildElemsWithCommands = function(txtElem, commandList){

		var loadedTextareaValue = txtElem.value

		var mdContainer = document.createElement('div')
		var mdToolbar = document.createElement('ul')
		var mdTextarea = document.createElement('textarea')

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

	function execInsert(exTxt){
		document.execCommand('insertText', false, exTxt)
	}

	function simpleInsert(symbol, sText){
		if (typeof symbol === 'object'){
			var symb = symbol[0]
			execInsert(symb+sText+symb)
		} 
		else if(sText.charAt(0) !== symbol){
			execInsert(symbol+' '+sText)
		}	
	}

	function insert (cmd, textarea){
		textarea.focus()
		var insTxt = getSelection()
		switch(cmd) {
			case 'h1': 
				simpleInsert('#', insTxt)
				break;
			case 'b':
				simpleInsert(['**'], insTxt)
				break;
			case 'u':
				simpleInsert(['*'], insTxt)
				break;
		}
	}

	 function Editor (txtElem) {
	 	var self = this
		this.elem = buildElemsWithCommands(txtElem, ['h1', 'b', 'u'])
		this.isTextareaActivated = false

		function setActivateTextArea () {
			self.isTextareaActivated = true 
			self.elem.textarea.removeEventListener('click', setActivateTextArea)
		}
		this.elem.textarea.addEventListener('click', setActivateTextArea)

	}

	function newEditor (loadedTextareaElem){
		var ed = new Editor(loadedTextareaElem)
		var toolbar = ed.elem.toolbar
		var textarea = ed.elem.textarea		
		toolbar.addEventListener('click', function(event){
			if(ed.isTextareaActivated){
				insert(event.target.dataset.cmd, textarea)	
			}
		})		
	}

	document.querySelectorAll('.svmde').forEach(
		function(txtareaElem){
			newEditor(txtareaElem)
		}
	)

})()