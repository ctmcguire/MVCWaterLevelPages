/**
 * This function handles a submission when running in offline mode, and sends the data to localStorage
**/
function localSubmit() {
	/**
	 * This function clears out the values in the inputs, in order to prepare for the next value to be entered
	**/
	function clearInputs() {
		document.getElementById('gauge').selectedIndex = 0;
		document.getElementById('reading').value = "";
		document.getElementById('conditions').selectedIndex = 0;
		document.getElementById('comments').value = "";
		validateForm();
	}
	/* 
	 * Get the data from the input fields
	 */
	var gauge = document.getElementById('gauge').value;
	var reading = document.getElementById('reading').value;
	var conditions = document.getElementById('conditions').value;
	var comments = document.getElementById('comments').value;

	var data = gauge + '|' + reading + '|' + conditions + '|' + comments;//combine the data into one string

	var queue = [];
	if(window.localStorage['local-queue'] !== undefined)
		queue = window.localStorage['local-queue'].split('\n');//split the data in localStorage into an array
	queue.push(data);//add the new data to the array of locally submitted data

	window.localStorage['local-queue'] = queue.join('\n');//Note that this gets auto-converted into a string
	validateServerSubmit();//checks if the data is valid
	clearInputs();//empty the input fields
}

/**
 * This function reloads the page in order to check if it can access the internet
**/
function serverSync() {
	window.localStorage['sync'] = "true";//Sets sync to true to indicate that we are attempting to sync data to the server
	window.location.assign('./');//reload the page
}


/**
 * This function enables or disables the local-submit button, based on the validity of the data in the 
 * mandatory input fields.
**/
function validateForm() {
	/**
	 * This function checks if the data that has been entered is valid
	 * 
	 * @return	- false if a required field is blank
	 * @return	- true otherwise
	**/
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

/**
 * This function enabled or disables the server-submit button, based on the validity of the data in 
 * localStorage
**/
function validateServerSubmit() {
	/**
	 * This function checks if the localStorage data is valid
	 * 
	 * @return	- false if there is no local-queue in localStorage
	 * @return	- false if there is incomplete data in localStorage
	 * @return	- true otherwise
	**/
	function isDataValid() {
		if(window.localStorage['local-queue'] === undefined)
			return false;
		var queue = window.localStorage['local-queue'].split('\n');//split the localStorage string into an array
		
		for(var i = 0; i < queue.length; i++) {
			var data = queue[i].split('|');//split each line of data into its 4 individual values
			if(data.length !== 4)
				return false;//There are supposed to be 4 values, even if optional values are blank
		}
		return true;
	}
	document.getElementById('server-submit').disabled = !isDataValid();
}


/**
 * This function is a dummy function that indicates that the page is offline.  If the page is not online, an 
 * uncached JavaScript file that overwrites this function with another is loaded successfully.  
**/
var offline = function() {
	return true;
}

/**
 * This function checks if the user is trying to sync data with the server, checks if the page is offline, and
 *  navigates to an uncached webpage that will write the data to the server.
 * 
 * @return	- false, if there is no 'sync' value in localStorage
 * @return	- true, if the page is offline
 * @return	- undefined otherwise
**/
function handleSync() {
	function ifOffline() {
		window.alert('No response from server; please try again later once there is an internet connection');//alert the user that they are currently offline and so the sync failed
		return true;
	}
	if(window.localStorage['sync'] !== "true")
		return false;
	window.localStorage.removeItem('sync');//remove sync so that reloading the page normally won't attempt to sync data to the server again
	if(offline())
		return ifOffline();

	window.location.assign('./server-sync.php?sync-data=' + window.localStorage['local-queue']);//navigate to the data sync page
}