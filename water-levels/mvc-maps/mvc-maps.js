function toggleLegend() {
	var prev = document.getElementById('map-legend').className.split(' ');//get the class string; may be changed to class list, which supports add/remove operations
	if(prev.indexOf('down') < 0) {
		if(prev.indexOf('up') < 0)
			prev.push('up');//If neither up nor down, add up (which is immediately replaced with down)
		prev[prev.indexOf('up')] = 'down';//replace up with down if the legend is up
	}
	else
		prev[prev.indexOf('down')] = 'up';//replace down with up if the legend is down
	document.getElementById('map-legend').className = prev.join(' ');//update the className
}