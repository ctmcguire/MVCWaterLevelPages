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

			var fName = {
				'flood': obj.img.flood.substring(obj.img.flood.lastIndexOf('/')+1, obj.img.flood.lastIndexOf('.')),
				'drought': obj.img.drought.substring(obj.img.drought.lastIndexOf('/')+1, obj.img.drought.lastIndexOf('.'))
			};

			var imgs = "";

			if(fName.flood !== "Normal" || fName.flood === fName.drought) {
				document.getElementById(fName.flood).style.display = "block";
				imgs += "url('" + obj.img.flood + "'),";
			}
			if(fName.drought !== "Normal" || fName.flood === fName.drought) {
				document.getElementById(fName.drought).style.display = "block";
				imgs += "url('" + obj.img.drought + "'),";
			}
			if(fName.flood !== "Normal" && fName.drought !== "Normal")
				document.getElementById('Abnormal').style.display = "block";
			imgs += "url('" + '/watershed-conditions-message/images/Bar.jpg' + "')";

			var tags = document.querySelectorAll('.cond-img');
			for(var i = 0; i < tags.length; i++)
				tags[i].style.backgroundImage = imgs;
		})(http.responseText);
	};
	http.open('GET', src, true);
	http.send(null);
})('watershed-conditions-message.json');