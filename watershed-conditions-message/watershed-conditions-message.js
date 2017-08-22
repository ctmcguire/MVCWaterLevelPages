(function(src) {
	var http = new XMLHttpRequest();
	http.onreadystatechange = function() {
		if(http.readyState !== 4)
			return;//do nothing if the request hasn't finished yet
		if(http.status !== 200)
			return console.log([http.responseText]);//log the response text if there is an error code
		(function(res) {
			var obj = JSON.parse(res);
			console.log([obj]);
			document.title = obj.title;//assign page title
			document.getElementById('content').innerHTML = obj.message;//replace the contents of the content div with the watershed conditions message

			/* 
			 * Get the file names from the file urls for later use
			 */
			var fName = {
				'flood': obj.img.flood.substring(obj.img.flood.lastIndexOf('/')+1, obj.img.flood.lastIndexOf('.')),
				'drought': obj.img.drought.substring(obj.img.drought.lastIndexOf('/')+1, obj.img.drought.lastIndexOf('.'))
			};

			var imgs = "";//multiple background images are rendered from last to first, so this string starts out empty

			/* 
			 * Only set the flood image if it is not normal, or both flood and drought share the same image
			 */
			if(fName.flood !== "Normal" || fName.flood === fName.drought) {
				document.getElementById(fName.flood).style.display = "block";//display the flood status info in the sidebar
				imgs += "url('" + obj.img.flood + "'),";//add the flood image to the background images
			}
			/* 
			 * Only set the drought image if it is not normal, or both flood and drought share the same image
			 */
			if(fName.drought !== "Normal" || fName.flood === fName.drought) {
				document.getElementById(fName.drought).style.display = "block";//display the drought status info in the sidebar
				imgs += "url('" + obj.img.drought + "'),";//add the drought image to the background images
			}
			/* 
			 * Add the abnormal status message when there is both a drought status and a flood status
			 */
			if(fName.flood !== "Normal" && fName.drought !== "Normal")
				document.getElementById('Abnormal').style.display = "block";
			imgs += "url('" + '/watershed-conditions-message/images/Bar.jpg' + "')";//Add the background part of the image last, since it needs to be behind the other images

			/* 
			 * Add the background images to all the elements with the "cond-img" class
			 */
			var tags = document.querySelectorAll('.cond-img');
			for(var i = 0; i < tags.length; i++)
				tags[i].style.backgroundImage = imgs;
		})(http.responseText);
	};
	http.open('GET', src, true);
	http.send(null);
})('watershed-conditions-message.json');