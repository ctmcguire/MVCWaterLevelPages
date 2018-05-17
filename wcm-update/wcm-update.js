(function() {
	var isInitialized = false;//Only let this function get called once
	var imgHandler;//stores the event handler for the radio buttons

	function getCondRange() {
		var min = null;
		var max = null;

		function func_helper($list) {
			for(let i = 0; i < $list.length; i++) {
				//console.log([$list[i]]);
				if($list[i].checked)
					return i;
			}
			return null;
		}

		var $list = {
			'drought': $('input[name="drought"]'),
			'flood': $('input[name="flood"]')
		}
		min = func_helper($list['drought']);
		max = func_helper($list['flood']);
		if(max === null)
			return [min, max]
		return [min,$list['drought'].length + max]
	}
	function updateCondRange() {
		var $rows = $('tr.mvc-affected-areas');
		var rng = getCondRange();
		if(rng[0] === null || rng[1] === null) {
			rng[1] = $('input[name="drought"]').length + $('input[name="flood"]').length - 1;
			rng[0] = rng[1];
		}
		function disable_helper($list) {
			for(let i = 0; i < rng[0]; i++) {
				if($list[i].checked)
					$list[rng[0]].checked = true;
				$list[i].disabled = true;
			}
			for(let i = rng[0]; i < rng[1]; i++)
				$list[i].disabled = false;
			for(let i = rng[1]; i < $list.length; i++) {
				if($list[i].checked)
					$list[rng[1]-1].checked = true;
				$list[i].disabled = true;
			}
		}
		for(let i = 0; i < $rows.length; i++) {
			let $row = $($rows[i]);
			disable_helper($row.find('input[type="radio"]'));
		}
	}

	/**
	 * This function checks if the title, images, and text values are valid
	 * 
	 * @return 	- whether or not the title, images, and text contain valid data
	**/
	function validateForm() {
		/**
		 * This function returns whether or not the title value is valid
		 * 
		 * @return 	- true, if title is not blank
		 * @return 	- false otherwise
		**/
		function validateTitle() {
			return (document.getElementById('title').value !== "");
		}
		/**
		 * This function returns whether or not the title is valid
		 * 
		 * @return 	- true if drought and flood images are valid
		 * @return 	- false, if one or both images are invalid
		**/
		function validateImg() {
			var drts = document.getElementsByName('drought');
			var flds = document.getElementsByName('flood');
			/**
			 * This function returns whether or not the given list of radio buttons is in a valid state
			 * 
			 * @param imgs 	- object containing the radio buttons to be checked
			 * 
			 * @return 	- true, if there is a checked radio button
			 * @return 	- false otherwise
			**/
			function isValid(imgs) {
				for(var i = 0; i < imgs.length; i++) {
					if(imgs[i].checked)
						return true;//If the set of radio buttons has a checked button, return true
				}
				return false;//If there are no checked radio buttons, return false
			}
			return isValid(drts) && isValid(flds);//check image validity for both drought and flood radio buttons
		}
		/**
		 * 
		**/
		function validateAffectedAreas() {
			var obj = {};
			var $rows = $('tr.mvc-affected-areas');

			for(let i = 0; i < $rows.length; i++) {
				let $row = $($rows[i]);
				let $btn = (function($list) {
					for(let i = 0; i < $list.length; i++) {
						if($list[i].checked)
							return $($list[i]);
					}
					return;
				})($row.find('input[type="radio"]'));

				if($btn === undefined)
					return false;
				obj[$row.data('name')] = $btn.attr('value');
			}
			try {
				$('input.mvc-sub-watersheds.mvc-json').attr('value', JSON.stringify(obj));
				return true;
			} catch(e) {
				console.error(e);
				return true;
			}
		}
		/**
		 * This function returns whether or not the message body is valid
		 * 
		 * @return 	- true, as I was unable to find a way to check the value of the text editor
		**/
		function validateStatement() {
			return true;//as of right now, no way to check this before clicking submit
		}
		return validateTitle() && validateImg() && validateAffectedAreas() && validateStatement();
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
						document.getElementById('flood-img').classList.remove(this.value);//Remove the old class if it isn't blank (which causes an error)
					if(img !== "")
						document.getElementById('flood-img').classList.add(img);//Add the new class if it isn't blank (which also causes an error)
					this.value = img;//Update the value
				}
			},
			'drought': {
				value: "",
				change: function(img) {
					if(this.value !== "")
						document.getElementById('drought-img').classList.remove(this.value);//Remove the old class if it isn't blank (which causes an error)
					if(img !== "")
						document.getElementById('drought-img').classList.add(img);//Add the new class if it isn't blank (which also causes an error)
					this.value = img;//Update the value
				}
			}
		};

		imgs['flood'].change(fld);//Load the current flood and drought images
		imgs['drought'].change(drt);

		/* 
		 * return the event handler function
		 */
		/**
		 * This function updates the currently displayed image using function closure
		 * 
		 * @param event 	- the event the triggered this function
		**/
		return function(event) {
			var e = event.target;

			if(e === undefined || e === null)
				return;
			imgs[e.name].change('i' + e.id.substr(3));
		};
	}

	function affectedAreasTable() {
		var $cols = $('th.mvc-affected-areas-header');
		var $rows = $('tr.mvc-affected-areas');
		for(let i = 0; i < $rows.length; i++) {
			var $row = $($rows[i]);
			$row.append('<th>'
						 + $row.data('name')
					 + '</th>');
			for(let j = 0; j < $cols.length; j++) {
				$row.append('<td>'
							 + '<input type="radio" name="' + $row.data('name') + '-conditions" value="' + $cols[j].innerHTML.trim() + '"/>'
						 + '</td>');
			}
			console.log($row.data('selected'), $row.find('input[type="radio"][value="' + $row.data('selected') + '"]'));
			$row.find('input[type="radio"][value="' + $row.data('selected') + '"]').attr('checked', '');
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
		/**
		 * This function sets the initial value of the title input field
		 * 
		 * @param title 	- the initial title value
		**/
		function setTitle(title) {
			document.getElementById('title').value = title;
		}
		/**
		 * This function sets the initial value of the image and its radio buttons
		 * 
		 * @param img 	- object containing the initial image values
		**/
		function setImgs(img) {
			/**
			 * This function checks one of the radio buttons with the given name based on img
			 * 
			 * @param img 	- image url that should match the value attribute of one of the radio buttons
			 * @param name 	- name attribute of the group of radio buttons to set
			 * 
			 * @return 	- The value of the class that sets the image to the checked button's value attribute
			 * @return 	- the empty string, if no radio button was checked
			**/
			function setImg(img, name) {
				var imgs = document.getElementsByName(name);
				for(var i = 0; i < imgs.length; i++) {
					if(imgs[i].value !== img)
						continue;
					imgs[i].checked = true;
					return "i" + imgs[i].id.substr(3);//class value is i followed by the number part of the button's id
				}
				return "";//If we get to this part of the function, no radio button has been checked
			}

			imgHandler = getHandler(setImg(img.flood, 'flood'), setImg(img.drought, 'drought'));//Set both sets of radio buttons, the image display, and the event handler
		}
		/**
		 * 
		**/
		function setAffectedAreas(dat) {
			$('input.mvc-sub-watersheds.mvc-json').attr('value', JSON.stringify(dat));
			for(let key in dat) {
				$('table.mvc-affected-areas').append('<tr class="mvc-affected-areas" data-name="' + key + '" data-selected="' + dat[key] + '"></tr>');
			}//*/
			affectedAreasTable();
		}
		/**
		 * This function sets the initial value of the text editor
		 * 
		 * @param message 	- the initial message body value
		**/
		function setStatement(message) {
			document.getElementById('message').innerHTML = message;
		}
		/**
		 * 
		**/
		function setTimestamp(date) {
			if(date === "<$timestamp/>")
				date = Date.dateStr()[0];
			$('#timestamp')[0].value = date;
		}
		/* 
		 * If not set, asign a default value to the json string
		 */
		if(json === '<$json/>')
			json = '{"title":"<$title/>","img":{"id":"<$id/>","src":"<$src/>"},"sub-watersheds":{},"message":"<$message/>","timestamp":"<$timestamp/>"}';
		var dat = JSON.parse(json);//parse the json string
		setTitle(dat.title);//set initial title value
		setImgs(dat.img);//set initial image values
		setAffectedAreas(dat['sub-watersheds']);
		setStatement(dat.message);//set initial message body values
		setTimestamp(dat.timestamp)
		$('#image-select input[type="radio"]').bind('change', updateCondRange);
		updateCondRange();
	}

	function selectAll(event) {
		var $e = $(event.target);
		if($e === undefined)
			return;
		var col = $e[0].innerHTML.trim();
		$list = $('.mvc-affected-areas input[type="radio"][value="' + col + '"]');
		for(let i = 0; i < $list.length; i++) {
			if($list[i].disabled)
				continue;
			$list[i].checked = true;
		}
		validateForm();
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
			return console.error('ERROR: Not allowed to call function window.init twice');
		isInitialized = true;//assign isInitialized to true after executing once

		loadData(json);//load the initial data

		/* 
		 * set the validation event handlers
		 */
		document.getElementById('submit-message').disabled = !validateForm();
		document.getElementById('condition-message').onchange = function() {
			document.getElementById('submit-message').disabled = !validateForm();
			$('#timestamp')[0].value = Date.dateStr()[0];
		};
		$('.mvc-select-all').bind('click', null, selectAll);

		/* 
		 * set the image change event handlers
		 */
		var flds = document.getElementsByName('flood')
		for(var i = 0; i < flds.length; i++)
			flds[i].onclick = imgHandler;
		var drts = document.getElementsByName('drought');
		for(var i = 0; i < drts.length; i++)
			drts[i].onclick = imgHandler;
		return true;
	}

	window.init = init;//make the init function "public"
})();