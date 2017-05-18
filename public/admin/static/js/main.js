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