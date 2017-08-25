function toggleLegend() {
	var classes = document.getElementById('map-legend').classList;
	if(classes.contains('up'))
		return classes.remove('up');
	classes.add('up');
}