/**
 * This function initializes this module's functions and variables
 * 
 * @param obj 	- obj to recieve any public scoped variables or functions
**/
(function(obj) {
	var isInitialized = false;//Only let this function get called once
	var imgHandler;//stores the event handler for the radio buttons

	/**
	 * This function checks if the title, images, and text values are valid
	 * 
	 * @return 	- whether or not the title, images, and text contain valid data
	**/
	function validateForm() {
		function validateTitle() {
			return (document.getElementById('title').value !== "");
		}
		function validateImg() {
			var drts = document.getElementsByName('drought');
			var flds = document.getElementsByName('flood');
			function isValid(imgs) {
				for(var i = 0; i < imgs.length; i++) {
					if(imgs[i].checked)
						return true;//If the set of radio buttons has a checked button, return true
				}
				return false;//If there are no checked radio buttons, return false
			}
			return isValid(drts) && isValid(flds);//check image validity for both drought and flood radio buttons
		}
		function validateStatement() {
			return true;//as of right now, no way to check this before clicking submit
		}
		return validateTitle() && validateImg() && validateStatement();
	}

	/**
	 * This function loads the current image data and returns the event handler for the radio buttons, using 
	 * function closure to keep the current drought or flood image in memory
	 * 
	 * @param fld 	- css class for the loaded flood image (determines displayed image)
	 * @param drt 	- css class for the loaded drought image (determines display image)
	 * 
	 * @return 	- the event handler function for the image radio buttons
	**/
	function getHandler(fld,drt) {
		var imgs = {
			'flood': {
				value: "",
				change: function(img) {
					if(this.value !== "")
						document.getElementById('flood-img').classList.remove(this.value);
					if(img !== "")
						document.getElementById('flood-img').classList.add(img);
					this.value = img;
				}
			},
			'drought': {
				value: "",
				change: function(img) {
					if(this.value !== "")
						document.getElementById('drought-img').classList.remove(this.value);
					if(img !== "")
						document.getElementById('drought-img').classList.add(img);
					this.value = img;
				}
			}
		};

		//document.getElementById('flood-img').classList.add(fld);
		//document.getElementById('drought-img').classList.add(drt);
		imgs['flood'].change(fld);
		imgs['drought'].change(drt);

		return function(event) {
			var iFld = document.getElementById('flood-img');
			var iDrt = document.getElementById('drought-img');
			var e = event.target;

			if(e === undefined || e === null)
				return;
			imgs[e.name].change('i' + e.id.substr(3));
			//document.getElementById(e.name + '-img').classList.remove(imgs[e.name]);
			//imgs[e.name] = 'i' + e.id.substr(3);
			//document.getElementById(e.name + '-img').classList.add(imgs[e.name]);
		}
	}

	/**
	 * This function takes a json string and uses it to load the current data to be displayed in the input 
	 * fields (title box, radio buttons, text editor)
	 * 
	 * @param json 	- json string containing the data; if set to '<$json/>' assigns default values instead; 
	 * 				defaults to '<$json/>'
	**/
	function loadData(json='<$json/>') {
		function setTitle(title) {
			document.getElementById('title').value = title;
		}
		function setImgs(img) {
			function setImg(img, name) {
				var imgs = document.getElementsByName(name);
				for(var i = 0; i < imgs.length; i++) {
					if(imgs[i].value !== img)
						continue;
					imgs[i].checked = true;
					return "i" + imgs[i].id.substr(3);
				}
				return "";
			}

			imgHandler = getHandler(setImg(img.flood, 'flood'), setImg(img.drought, 'drought'));
		}
		function setStatement(message) {
			document.getElementById('message').innerHTML = message;
		}
		if(json === '<$json/>')
			json = '{"title":"<$title/>","img":{"id":"<$id/>","src":"<$src/>"},"message":"<$message/>"}';
		var dat = JSON.parse(json);
		console.log(dat);
		setTitle(dat.title);
		setImgs(dat.img);
		setStatement(dat.message);
	}

	/**
	 * This function initializes all the data for this page.
	 * 
	 * @param json 	- json string data; defaults to '<$json/>'
	 * 
	 * @return 	- true upon being run for the first time
	 * @return 	- undefined otherwise
	**/
	function init(json='<$json/>') {
		if(isInitialized)
			return console.log('ERROR: Not allowed to call function window.init twice');
		isInitialized = true;//assign isInitialized to true after executing once

		loadData(json);

		document.getElementById('submit-message').disabled = !validateForm();
		document.getElementById('condition-message').onchange = function() {
			document.getElementById('submit-message').disabled = !validateForm();
		};

		var flds = document.getElementsByName('flood')
		for(var i = 0; i < flds.length; i++)
			flds[i].onclick = imgHandler;
		var drts = document.getElementsByName('drought');
		for(var i = 0; i < drts.length; i++)
			drts[i].onclick = imgHandler;
		return true;
	}

	obj.init = init;//make the init function "public"
})(window);