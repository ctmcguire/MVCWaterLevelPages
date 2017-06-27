function localSubmit() {
	function clearInputs() {
		document.getElementById('gauge').selectedIndex = 0;
		document.getElementById('reading').value = "";
		document.getElementById('conditions').selectedIndex = 0;
		document.getElementById('comments').value = "";
		validateForm();
	}
	var gauge = document.getElementById('gauge').value;
	var reading = document.getElementById('reading').value;
	var conditions = document.getElementById('conditions').value;
	var comments = document.getElementById('comments').value;

	var data = gauge + '|' + reading + '|' + conditions + '|' + comments;

	var queue = [];
	if(window.localStorage['local-queue'] !== undefined)
		queue = window.localStorage['local-queue'].split('\n');
	queue.push(data);

	window.localStorage['local-queue'] = queue;//Note that this gets auto-converted into a string
	validateServerSubmit();
	clearInputs();
}

/*function serverSync() {
	var data = window.localStorage['local-queue'];
	window.localStorage.removeItem('local-queue');//Empty the local submission queue

	document.getElementById('sync-data').value = data;
	document.getElementById('sync').submit();
}*/

function serverSync() {
	window.localStorage['sync'] = "true";
	window.location.assign('./');
}


function validateForm() {
	function isFormValid() {
		var required = [
			"gauge",
			"reading",
			"conditions",
		];
		for(var i=0; i < required.length; i++) {
			if(document.getElementById(required[i]).value === "")
				return false;
		}
		return true;
	}
	document.getElementById('local-submit').disabled = !isFormValid();
}

function validateServerSubmit() {
	function isDataValid() {
		if(window.localStorage['local-queue'] === undefined)
			return false;
		var queue = window.localStorage['local-queue'].split('\n');
		
		for(var i = 0; i < queue.length; i++) {
			var data = queue[i].split('|');
			if(data.length !== 4)
				return false;
		}
		return true;
	}
	document.getElementById('server-submit').disabled = !isDataValid();
}


var offline = function() {
	return true;
}

function handleSync() {
	function ifOffline() {
		window.alert('No response from server; please try again later once there is an internet connection');
		return true;
	}
	if(window.localStorage['sync'] !== "true")
		return false;
	window.localStorage.removeItem('sync');
	if(offline())
		return ifOffline();

	window.location.assign('./server-sync.php?sync-data=' + window.localStorage['local-queue']);
}