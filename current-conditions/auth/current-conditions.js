(function(obj) {
	var isInitialized = false;

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
						return true;
				}
				return false;
			}
			return isValid(drts) && isValid(flds);
		}
		function validateStatement() {
			return true;//as of right now, no way to check this before clicking submit
		}
		return validateTitle() && validateImg() && validateStatement();
	}

	var imgHandler;
	function getHandler(fld,drt) {
		var img = {
			'flood': fld,
			'drought': drt
		};

		document.getElementById('flood-img').classList.add(fld);
		document.getElementById('drought-img').classList.add(drt);

		return function(event) {
			var iFld = document.getElementById('flood-img');
			var iDrt = document.getElementById('drought-img');
			var e = event.target;

			if(e === undefined || e === null)
				return;
			document.getElementById(e.name + '-img').classList.remove(img[e.name]);
			img[e.name] = 'i' + e.id.substr(3);
			document.getElementById(e.name + '-img').classList.add(img[e.name]);
		}
	}

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
		function setStatement(statement) {
			document.getElementById('statement').innerHTML = statement;
		}
		if(json === '<$json/>')
			json = '{"title":"<$title/>","img":{"id":"<$id/>","src":"<$src/>"},"statement":"<$statement/>"}'
		var dat = JSON.parse(json);
		console.log(dat);
		setTitle(dat.title);
		setImgs(dat.img);
		setStatement(dat.statement);
	}

	function init(json='<$json/>') {
		loadData(json);

		document.getElementById('submit-statement').disabled = !validateForm();
		document.getElementById('condition-statement').onchange = function() {
			document.getElementById('submit-statement').disabled = !validateForm();
		};

		var flds = document.getElementsByName('flood')
		for(var i = 0; i < flds.length; i++)
			flds[i].onclick = imgHandler;
		var drts = document.getElementsByName('drought');
		for(var i = 0; i < drts.length; i++)
			drts[i].onclick = imgHandler;
	}

	obj.init = function(json='<$json/>') {
		if(isInitialized)
			return console.log('ERROR: Not allowed to call function window.init twice');
		init(json);

		isInitialized = true;
		return true;
	}
})(window);