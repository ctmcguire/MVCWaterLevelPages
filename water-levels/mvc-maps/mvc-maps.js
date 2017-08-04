function toggleLegend() {
	var prev = document.getElementById('map-legend').className.split(' ')
	var isDown = false;
	var i;
	if(prev.indexOf('down') < 0) {
		if(prev.indexOf('up') < 0)
			prev.push('up');
		prev[prev.indexOf('up')] = 'down';
	}
	else
		prev[prev.indexOf('down')] = 'up';
	document.getElementById('map-legend').className = prev.join(' ');
}

function drawLegend() {
	var canvas = document.getElementById('legend-canvas');//get the canvas we will be drawing an image on
	var image = document.getElementById('legend-img');
	/*image.onload = function() {}
	image.crossOrigin="anonymous";
	image.src = "../../../images/Water Gauges.jpg"
	return console.log(image);*/

	canvas.width = image.naturalWidth;//Need to set canvas's width & height values so the image scales correctly
	canvas.height = image.naturalHeight;

	var context = canvas.getContext('2d');//get the context in which we will be drawing; images are 2-dimensional, so we get a 2d context
	context.drawImage(image, 0, 0);

	var iDat = context.getImageData(0,0,canvas.width,canvas.height);
	//console.log(iDat.data)
	const RED = 0;
	const GREEN = 1;
	const BLUE = 2;
	const ALPHA = 3;
	
	for(var i = 0; i < iDat.data.length; i+=4) {
		var r = iDat.data[i+RED];
		var g = iDat.data[i+GREEN];
		var b = iDat.data[i+BLUE];
		var a = iDat.data[i+ALPHA];

		if(r < 200 || g < 200 || b < 200 || a !== 255)
			console.log(r,g,b,a);
		if(r < 200 || g < 200 || b < 200 || a !== 255)
			continue;
		iDat.data[i+RED] = 0;
		iDat.data[i+GREEN] = 0;
		iDat.data[i+BLUE] = 0;
		iDat.data[i+ALPHA] = 0;
	}

	context.putImageData(iDat, 0, 0)
}