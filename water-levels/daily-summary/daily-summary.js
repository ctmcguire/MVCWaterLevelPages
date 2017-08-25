/**
 * This function displays the tooltip for the target element
**/
function showToolTip(e) {
	var target = $(e.target);
	if(target.hasClass('show'))
		return;
	target.addClass('show');
}
/**
 * This function hides the tooltip for the target element
**/
function hideToolTip(e) {
	var target = $(e.target);
	if(!target.hasClass('show'))
		return;
	target.removeClass('show');
}

/**
 * This function sets up the event handlers
 * 
 * @return	- false if jQuery is not included
 * @return	- true otherwise
**/
function setupHandlers() {
	if(window.$ === undefined)
		return false;//currently this is dependent on jQuery (I may remove this dependency in the future)
	$("p.tooltip").on('click', showToolTip);//set up the click event handler
	$("p.tooltip").on('mouseout', hideToolTip);//set up the mouseout event handler
	return true;
}