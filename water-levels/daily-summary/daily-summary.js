/**
 * This function sets up the event handlers
**/
(function() {
	var tars = document.querySelectorAll('p.tooltip');
	for(var i = 0; i < tars.length; i++) {
		/**
		 * This function displays the tooltip for the target element
		 * 
		 * @param e	- event that triggered this function
		**/
		tars[i].onclick = function(e) {
			if(e.target === undefined)
				return;//exit if the event had no target
			var classes = e.target.classList;
			if(classes.contains('show'))
				return;//do nothing if the target element already has the show class
			classes.add('show');//add the show class
		};
		/**
		 * This function hides the tooltip for the target element
		 * 
		 * @param e	- event that triggered this function
		**/
		tars[i].onmouseout = function(e) {
			if(e.target === undefined)
				return;
			var classes = e.target.classList;
			if(!classes.contains('show'))
				return;
			classes.remove('show');
		};
	}
})();