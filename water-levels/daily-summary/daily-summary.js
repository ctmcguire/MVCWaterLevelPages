function showToolTip(e) {
	var target = $(e.target);
	if(target.hasClass('show'))
		return;
	target.addClass('show');
}
function hideToolTip(e) {
	var target = $(e.target);
	if(!target.hasClass('show'))
		return;
	target.removeClass('show');
}

function setupHandlers() {
	if(!window.$)
		return false;
	$("p.tooltip").on('click', showToolTip);
	$("p.tooltip").on('mouseout', hideToolTip);
	return true;
}