(function(src, json) {
	function get(url, pass,fail) {
		if(pass === undefined)
			pass=function(res){console.log([res])};
		if(fail === undefined)
			fail=function(res){console.log([res])};
		var http = new XMLHttpRequest();
		http.onreadystatechange = function() {
			if(http.readyState !== 4)
				return;//do nothing if request not returned
			if(http.status !== 200)
				return fail(http.responseText);//execute the fail function if an http error code is returned
			return pass(http.responseText);//execute the pass function if no error has occurred
		}
		http.open('GET', url, true);
		http.send(null);
	}

	return get(src, function(res){
		document.getElementById('wp-display-content').innerHTML = res;//add the image display to the page (wordpress likes to mess with it if you put the html code in directly)
		get(json, function(res){
			var url = JSON.parse(res).img;//Get the image urls
			var bgImgs = "";//string for background images; starts empty because images are rendered from last to first
			var imgs = document.querySelectorAll('.cond-img');//object (not an array, but behaves similarly) containing all elements to receive the background images
			if(url.flood !== "/watershed-conditions-message/images/Normal.png" || url.flood === url.drought)
				bgImgs += "url('" + url.flood + "'),";//Add the flood image url to the background images
			if(url.drought !== "/watershed-conditions-message/images/Normal.png" || url.flood === url.drought)
				bgImgs += "url('" + url.drought + "'),";//Add the drought image url to the background images
			bgImgs += "url('" + '/watershed-conditions-message/images/Bar.jpg' + "')";//Add the background image's background image last, since it is behind everything else

			for(var i = 0; i < imgs.length; i++)
				imgs[i].style.backgroundImage = bgImgs;//Set the background image of all elements in imgs
		})
	})
})("/watershed-conditions-message/wp-display/","/watershed-conditions-message/watershed-conditions-message.json");