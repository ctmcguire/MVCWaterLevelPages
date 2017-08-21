(function(src="/watershed-conditions-message/wp-display/", json="/watershed-conditions-message/watershed-conditions-message.json") {
	function get(url, pass=function(res){console.log([res])},fail=function(res){console.log([res])}) {
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
			var bgImgs = "";
			var imgs = document.querySelectorAll('.cond-img');
			/*if(url.drought !== "/watershed-conditions-message/images/Normal.png" || url.drought === url.flood)
				document.getElementById('drought-img').style.backgroundImage = "url(" + url.drought + ")";//only set the drought image to normal if both images are normal
			if(url.flood === "/watershed-conditions-message/images/Normal.png")
				document.getElementById('flood-img').style.visibility = "hidden";//don't display the flood image if it is normal
			document.getElementById('flood-img').src = url.flood;*/
			if(url.flood !== "/watershed-conditions-message/images/Normal.png" || url.flood === url.drought)
				bgImgs += "url('" + url.flood + "'),";
			if(url.drought !== "/watershed-conditions-message/images/Normal.png" || url.flood === url.drought)
				bgImgs += "url('" + url.drought + "'),";
			bgImgs += "url('" + '/watershed-conditions-message/images/Bar.jpg' + "')";

			for(var i = 0; i < imgs.length; i++)
				imgs[i].style.backgroundImage = bgImgs
		})
	})
})();