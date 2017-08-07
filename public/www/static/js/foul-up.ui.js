var switchCover
var scpToggle
var scpSeeker
var toggleScp
var scpSeek
var showModal
var signupSubmit
var JSONCB

document.addEventListener("DOMContentLoaded", function(event) {
	
	switchCover = function(coverEle){
		var images = coverEle.getElementsByTagName("img")
		for(i=0; i < images.length; i++){
			if(images[i].className == "visible"){
				var n = i+1
				var nextVisible = images[n]
			}
			images[i].className=""
		}
		if(!nextVisible) var nextVisible = images[0]
		nextVisible.className="visible"
		coverEle.dataset.count = nextVisible.dataset.count
	}

	var signupModal
	showModal = function(e){
		e.preventDefault()
		signupModal = document.getElementById("signup-modal")
		signupModal.className="show"
		var clickedModal = function(e){
			if(e.target.className == "modal-inner"){
				signupModal.className=""
				signupModal.removeEventListener('click', clickedModal)
			}
		}
		signupModal.addEventListener('click', clickedModal.bind(event))
		signupModal.querySelector('form').className=""
		signupModal.querySelector('.output').innerHTML=""
	}

	signupSubmit = function(e){
		e.preventDefault()
		var formEle = e.target 
		var inputs = formEle.getElementsByTagName('input')
		JSONP({
			url: "http://foul-up.us14.list-manage.com/subscribe/post-json",
			data: {
				u: "7280b8a7257131a2c4116001d",
				id: "3e2d19f16b",
				c: "JSONCB",
				FNAME: inputs.FNAME.value,
				LNAME: inputs.LNAME.value,
				EMAIL: inputs.EMAIL.value
			}
		})
		JSONCB = function(res){
			for(i=0;i<inputs.length;i++){
				inputs[i].value = ""
			}
			signupModal.querySelector('.output').innerHTML=res.msg
			signupModal.querySelector('form').className="hide"
		}
	}

	var scpPlayer = function(widget){
		widget.bind(SC.Widget.Events.READY, function(){
			//initial
			widget.setVolume(100)
			widget.getCurrentSound(function(sound){
				scpToggle = document.getElementById("scpToggle")
				scpSeekEle = document.getElementById("scpSeek")
				scpSeekEleHolder = document.getElementById("scpSeekHolder")

				scpSeekEle.max = sound.full_duration

				toggleScp = function(e, btn){
					e.preventDefault()
					widget.isPaused(function(paused){
						paused ? widget.play() : widget.pause()
					})
					scpSeekEleHolder.className = "show"
				}

				scpSeek = function(rangeValue){
					widget.seekTo(rangeValue)
				}

			})
		})
		widget.bind(SC.Widget.Events.PLAY, function() {
			scpToggle.className = "scpButton pause"
		})

		widget.bind(SC.Widget.Events.PAUSE, function() { 
			scpToggle.className = "scpButton play"
		})

		widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(progress){
			widget.getPosition(function(position){
				scpSeekEle.value = position
			})
		})
	}
	var scpEle = document.getElementById("scp")
	if(scpEle){
		scpPlayer(SC.Widget(scpEle))
	}

	// setting all external links to open in a new tab
	(function () {
		var links = document.links;
		for (var i = 0, linksLength = links.length; i < linksLength; i++) {
			if (links[i].hostname != window.location.hostname) {
				links[i].target = '_blank';
			} 
		}
	})()

})