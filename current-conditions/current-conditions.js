(function(src) {
	var http = new XMLHttpRequest();
	http.onreadystatechange = function() {
		if(http.readyState !== 4)
			return;
		if(http.status !== 200)
			return console.log(http.responseText);
		(function(res) {
			var obj = JSON.parse(res);
			console.log(obj);
			document.title = obj.title;
			document.getElementById('drought-img').style.backgroundImage = obj.img.drought;
			document.getElementById('flood-img').src = obj.img.flood;
			document.getElementById('flood-img').alt = obj.img.flood.substr(obj.img.flood.lastIndexOf('/')+1, obj.img.flood.lastIndexOf('.') - (obj.img.flood.lastIndexOf('/')+1));
			document.getElementById('content').innerHTML = obj.statement;
		})(http.responseText);
	}
	http.open('GET', src, true);
	http.send(null);
})('current-conditions.json');