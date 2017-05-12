//modals, as used in create / update news
var toggleModal = function(modalRef){
	var modalElems = document.getElementsByClassName('modal')
	for (var mItem of modalElems) {
		mItem.className='modal'
		if(modalRef && mItem.dataset.modal == modalRef) mItem.className = 'modal open'
	}
}
var modalOpen = function(modalRef){
	toggleModal(modalRef)
}
var modalClose = function(event){
	if(event.target.className == 'modal-wrapper') toggleModal(false)
}

var countCheckedImages = function(){
	var chooseImageElem = document.querySelector('.chooseImage')
	if(!chooseImageElem) return

	var inputElems = chooseImageElem.getElementsByTagName('input')
	var count = 0
	for(var inputElem of inputElems) {
		//var inputElem = inputElems[i]
		if(inputElem.checked){
			count ++
			inputElem.parentNode.className="image checked"
		} 
	}
	var countText = count > 0 ? 'choosen images: '+count : ''
	document.querySelector('.chooseImageCount').innerText = countText
}

var checkImage = function(e){
	var inputElem = e.target.querySelector('input')
	var setCheck = !inputElem.checked
	e.target.className = setCheck ? 'image checked' : 'image'
	inputElem.checked = setCheck
	countCheckedImages()
}
countCheckedImages()

var toggleElement = function(querySelector){
	var elem = document.querySelector(querySelector)
	var currentClassName = elem.className
	var isVisibleClass = currentClassName.indexOf('visible ') === 0
	elem.className = (
		isVisibleClass 
		? currentClassName.replace('visible ', '') 
		: 'visible '+currentClassName
	)
}