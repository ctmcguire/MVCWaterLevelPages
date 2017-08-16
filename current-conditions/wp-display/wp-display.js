(function(src="/current-conditions/wp-display/", json="/current-conditions/current-conditions.json") {
	function defRes(res) {
		console.log([res])
	}
	function get(url, pass=function(res){console.log([res])},fail=function(res){console.log([res])}) {
		var http = new XMLHttpRequest();
		http.onreadystatechange = function() {
			if(http.readyState !== 4)
				return;
			if(http.status !== 200)
				return fail(http.responseText);
			return pass(http.responseText);
			(function(res) {
				console.log([res]);
				document.getElementById('wp-display-content').innerHTML = res;
			})(http.responseText);
		}
		http.open('GET', url, true);
		http.send(null);
	}

	return get(src, function(res){
		//console.log([res]);
		document.getElementById('wp-display-content').innerHTML = res;
		get(json, function(res){
			var url = JSON.parse(res).img;
			//console.log(url);
			if(url.drought !== "/current-conditions/images/Normal.png" || url.drought === url.flood)
				document.getElementById('drought-img').style.backgroundImage = "url(" + url.drought + ")";
			if(url.flood === "/current-conditions/images/Normal.png")
				document.getElementById('flood-img').style.visibility = "hidden";
			document.getElementById('flood-img').src = url.flood;
			document.getElementById('flood-msg-form-2').style.display = "";
		})
	})
})();