(function() {
	if(Object.entries)
		return;
	Object.entries = function( obj ){
		var ownProps = Object.keys( obj ),
			i = ownProps.length,
			resArray = new Array(i); // preallocate the Array
		while (i--)
			resArray[i] = [ownProps[i], obj[ownProps[i]]];
		return resArray;
	};
})();

(function() {

	var Button = (function() {
		function Button(gauge, label, icon, day_range) {
			this.gauge = gauge;
			this.label = label;
			this.icon = icon;
			this.range = new Date((24*60*60*1000) * day_range);//#days * 24h * 60min * 60s * 1000ms = day range in UNIX time
			this.modal = "#data-modal";
		}

		var button_html = 
			"<div title=\"{btn-label}\" data-toggle=\"tooltip\" class=\"station-popup-button\" style=\"{btn-style}\">\
				<style>\
					.{btn-icon}\
					{\
						background-image: url('images/{btn-icon}-green.png');\
						border-color: #6ECC39;\
					}\
					.{btn-icon}.mvc-red\
					{\
						background-image: url('images/{btn-icon}-red.png');\
					}\
					.{btn-icon}.mvc-loading\
					{\
						background-image: url('images/{btn-icon}.png');\
						border-color: #00C6FF;\
					}\
					.{btn-icon}:hover\
					{\
						background-image: url('images/{btn-icon}-hover.png');\
					}\
				</style>\
				<div data-toggle=\"modal\" data-target=\"{btn-modal}\" data-mvc-gauge=\"{btn-gauge}\" class=\"station-button-icon mvc-loading {btn-icon}\" style=\"{btn-icon-style}\"></div>\
			</div>";

		Button.prototype.setModal = function(selector) {
			this.modal = selector;
			return this;
		}

		Button.prototype.getHtml = function(theta, R) {
			var obj = {
				'btn-style': "transform: rotate(" + theta + "rad);",//rotate button around circle
				'btn-label': this.label,
				'btn-gauge': this.gauge,
				'btn-icon': this.icon,
				'btn-modal': this.modal,
				'btn-icon-style': "transform: translate(" + R + "px, 0px) rotate(" + (-theta) + "rad);",//reverse rotation transformation
			};
			return L.Util.template(button_html, obj);
		}

		Button.prototype.recentData = function(container_2) {
			if(this.gauge === null)
				return;
			if(container_2)
				return loadRecnt(this.gauge, '.' + this.icon, container_2, this.range);
			return chckRecnt(this.gauge, '.' + this.icon, this.range);
		}

		Button.prototype.getStation = function() {
			return this.gauge
		}

		Button['Automated Gauge Data'] = function(gauge) {
			return new Button(gauge, 'Automated Gauge Data', 'button-automated', 1);
		}
		Button['Staff Gauge Data'] = function(gauge) {
			return new Button(gauge, 'Staff Gauge Data', 'button-staff', 7);
		}

		return Button;
	})();

	var ButtonList = (function() {
		function ButtonList(str) {
			this.buttons = [];
			var list = [];
			if(str === undefined)
				return;
			$('.leaflet-popup-content').removeClass('mvc-no-data');

			try {
				list = JSON.parse(str);
			} catch(err) {
				console.error('ERROR: station button list is not a valid JSON string and will be considered empty');
				console.log('Details:', err);
			}
			for(let i = 0; i < list.length; i++) {
				this.buttons.push(Button[list[i]["button-name"]](list[i]["station-id"]))
			}
			if(0 < this.buttons.length)
				return;
			$('.leaflet-popup-content').addClass('mvc-no-data');
		}

		ButtonList.prototype.add = function(btn) {
			if(btn === undefined)
				return this;
			if(btn === null)
				return this;
			this.buttons.push(btn);
			$('.leaflet-popup-content').removeClass('mvc-no-data');
			return this;
		}

		ButtonList.prototype.createButtons = function(radius, min_orbit_r, orbit_c) {
			var len = this.buttons.length;
			function angle() {
				var phi = Math.asin(radius/min_orbit_r);

				if(orbit_c < (2*phi) * len) {
					phi = orbit_c / (2 * len)
					min_orbit_r = radius / (Math.sin(phi));
				}
				return function(i) {
					return 2*(i - (len-1)/2) * phi;
				};
			}

			var out = "\
			<style>\
				.station-button-icon\
				{\
					width: " + (radius * 2) + "px;\
					height: " + (radius * 2) + "px;\
				}\
			</style>";
			var theta = angle();

			for(let i = 0; i < this.buttons.length; i++) {
				out += this.buttons[i].getHtml(theta(i), min_orbit_r);
			}
			return out;
		}

		ButtonList.prototype.recentData = function(container_2) {
			for(let i = 0; i < this.buttons.length; i++) {
				if(this.buttons[i] === null || this.buttons[i] === undefined)
					continue;
				this.buttons[i].recentData(container_2);
				container_2 = undefined;
			}
			if(0 < this.buttons.length)
				return "";
			return "<div class=\"mvc-no-data-icon\" title=\"No Data Available\"></div>";
		}

		ButtonList.prototype.getStation = function() {
			for(let i = 0; i < this.buttons.length; i++) {
				return this.buttons[i].getStation()
			}
		}
		ButtonList.prototype.toString = function() {
			var out = "Button List:\n";
			for(let i = 0; i < this.buttons.length; i++) {
				out += "\t>" + this.buttons[i] + "\n";
			}
			out += "___________________________"
			return out;
		}

		return ButtonList;
	})()


	function getFeature(feature, i) {
		if(i === undefined)
			return getFeature(feature, 0);
		return "https://services1.arcgis.com/d0ZCwU7eGKVeNiEE/ArcGIS/rest/services/" + feature + "/FeatureServer/" + i;
	}

	var menu_click = {
		'mvc-gauge': function($event) {
			var dat = {
				'Gauge': undefined,
			};
			var $e = $($event.target);
			var $modal = $($e.data('target'));
			if($modal.length < 1) {
				$e = $e.parents('.station-popup')
				$modal = $($e.data('target'))
			}
			dat.Gauge = $event.data !== null? $event.data.Gauge : $e.data('mvc-gauge');

			if($modal.length < 1 || dat.Gauge === undefined)
				return;

			$('.download').unbind('click', download_click);//unbind previous handler
			$('.download').bind('click', dat, download_click);

			$modal.find('#gauge-name').text(dat.Gauge);
			$table = $modal.find('#table-content')[0];
			$chart = $modal.find('#chart-content')[0];
			$button = $('.mvc-open-other');
			$button.unbind('click', menu_click['mvc-gauge']);
			$button.bind('click', dat, menu_click['mvc-gauge']);

			$modal.find('input.mvc-table[name="max"]').unbind('change', table_range_changed);
			$modal.find('input.mvc-table[name="min"]').unbind('change', table_range_changed);
			for(let i = 0; i < $modal.find('input[name="max"]').length; i++)
				$modal.find('input[name="max"]')[i].value = (new Date()).dateStr()[0];
			$modal.find('input[name="max"]').trigger('blur');
			for(let i = 0; i < $modal.find('input[name="min"]').length; i++)
				$modal.find('input[name="min"]')[i].value = (new Date()).nMonths(-3).dateStr()[0];//dateStr(new Date(temp.setMonth(temp.getMonth() - 3)));
			$modal.find('input[name="min"]').trigger('blur');
			$modal.find('input.mvc-table[name="max"]').bind('change', dat, table_range_changed);
			$modal.find('input.mvc-table[name="min"]').bind('change', dat, table_range_changed);

			$('#mvc-tab-graph-tab').tab('show');

			if($table !== undefined) {
				loadTable(dat.Gauge, '', '');
			}
			if($chart !== undefined)
				loadGraph(dat.Gauge, '', '');
		},
		'mvc-conditions': function($event) {
			var $e = $('.station-popup.conditions-popup');
			var $modal = $($e.data('target'));
			var dat = $event.data;
			if(dat === null)
				return;
			$modal.find('.mvc-cond-title').contents().remove();//Remove old title
			$modal.find('.mvc-cond-title').prepend(dat.title);//Add new title

			$modal.find('.mvc-cond-content').contents().remove();//Remove old title
			$modal.find('.mvc-cond-content').prepend(dat.message.replace_('\\"', '"'));//Add new title

			$modal.find('.mvc-cond-img').attr('style', (function() {
				/* 
				 * Get the file names from the file urls for later use
				 */
				var fName = {
					'flood': dat.img.flood.substring(dat.img.flood.lastIndexOf('/')+1, dat.img.flood.lastIndexOf('.')),
					'drought': dat.img.drought.substring(dat.img.drought.lastIndexOf('/')+1, dat.img.drought.lastIndexOf('.'))
				};

				var imgs = "";
				if(fName.flood !== "Normal" || fName.flood === fName.drought)
					imgs += "url('" + dat.img.flood + "'),";
				if(fName.drought !== "Normal" || fName.flood === fName.drought)
					imgs += "url('" + dat.img.drought + "'),";
				imgs += "url('" + '../watershed-conditions-message/images/Bar.jpg' + "')";

				return "background-image: " + imgs + ";"
			})())
		},
	}

	function range_blur($event) {
		var $e = $($event.target);
		if(/\d{3}\d+-(0[1-9]|1[0-2])-([0][1-9]|[1-2][0-9]|3[0-1])/.exec($e[0].value) === null)
			return;
		var $div = $e.parents('div.mvc-range-selector');
		if(!$e.hasClass('hasDatepicker'))
			$div.removeClass('visible');
		$div.find('text.pseudo-input span')[0].innerHTML = (new Date($e[0].value.replace_('-', '/') + ' 00:00:00')).formatStr();
	}
	function table_range_changed($event) {
		var dat = $event.data;
		var $e = $($event.target);
		if($e.length < 1)
			return;

		if(/\d{3}\d+-(0[1-9]|1[0-2])-([0][1-9]|[1-2][0-9]|3[0-1])/.exec($e[0].value) === null)
			return;
		var classes = $e[0].className;

		var $max = $('#mvc-tab-table input.' + classes.replace_(' ', '.') + '[name="max"]');
		var $min= $('#mvc-tab-table input.' + classes.replace_(' ', '.') + '[name="min"]');

		if($max.length < 1 || $min.length < 1)
			return;
		var max_val = $max[0].value.replace_('-', '/');
		var min_val = $min[0].value.replace_('-', '/');
		min_val = (new Date(Math.max(new Date(min_val + ' 00:00:00'), new Date(max_val + ' 00:00:00').nYears(-1)))).dateStr()[0];
		if(Date.dateStr(min_val.replace_('-', '/'))[0] !== Date.dateStr($min[0].value.replace_('-', '/'))[0]) {
			$('#range-alert-button').trigger('click');
			$('#range-alert-modal').find('[name="max"]').val($max.val());
			$('#range-alert-modal').find('[name="min"]').val($min.val());
			$min.unbind('change', table_range_changed);
			$min[0].value = min_val.replace_('/', '-');
			$min.bind('change', dat, table_range_changed);
		}
		range_blur($event);
		window.loadTable(dat.Gauge, min_val.replace_('/', '-'), max_val.replace_('/', '-'));
	}
	function range_click($event) {
		var $e = $($event.target);
		if($e.length < 1)
			return;
		var id = $e[0].id;
		$e.parents('div.mvc-range-selector').addClass('visible');
		$e.parents('div.mvc-range-selector').find('input.mvc-range-selector')[0].focus();
	}

	function download_click($event) {
		var dat = $event.data;
		var $e = $($event.target);
		var input = $e.data('mvc-target');

		if($(input + '[name="min"]').length === 0 || $(input + '[name="max"]').length === 0)
			return;
		var min = $(input + '[name="min"]')[0].value;
		var max = $(input + '[name="max"]')[0].value;

		return window.download(dat.Gauge, '.download', min, max);
	}

	function toggle_click($event) {
		var $e = $($event.target);
		var col = $e.data('target');

		if(col === undefined)
			return;
		$('#table-content').toggleClass('mvc-hide-' + col);
	}


	function getPopup(buttons) {
		var obj = {
			'map-items': 
				"<div id=\"map-items\" class=\"mvc-large-popup\">\
					<div title=\"{tooltip}\" class=\"station-popup {Identifier}\" data-toggle=\"modal\" data-target=\"#data-modal\" data-mvc-gauge=\"{TsId}\">\
						<div class=\"station-popup-icon mvc-primary-data\">\
							{Recent}\
						</div>\
					</div>\
					<div class=\"station-popup-title\">\
						<span class=\"station-label\">\
							{Gauge}\
						</span>\
					</div>\
					{station-buttons}\
				</div>",

			'popup': function(obj) {
				var Eval = function(str){ return L.Util.template(str, obj) };
				var str = Eval(obj['map-items']);
				return str;
			},
			'station-buttons': function(obj) {
				return buttons.createButtons(16, 48, Math.PI);
			},

			'Gauge': "{Gauge}",
			'Recent': "{Recent}",
			'TsId': "{TsId}",
			'Identifier': "{Identifier}",
			'button-label': "{button-label}",
			'button-style': "{button-style}",
			'button-icon': "{button-icon}",
			'icon-style': "{icon-style}",
			'tooltip': "{tooltip}"
		};
		var str = L.Util.template('{popup}', obj);
		return str;
	}
	function makePopup(data) {
		var $pane = $('#mvca-map .leaflet-map-pane .leaflet-popup-pane');
		$pane.unbind('click', menu_click['mvc-gauge']);//unbind previous handler
		$pane.unbind('click', menu_click['mvc-conditions']);
		$pane.bind('click', null, menu_click['mvc-gauge']);//rebind with new gauge data

		var buttons = new ButtonList(data['Buttons']);
		//

		return L.Util.template(getPopup(buttons), $.extend({}, data, {
				'Recent': function(data) {
					return buttons.recentData('.station-popup.' + data.Identifier(data));
				},
				'Identifier': function(data) {
					if(/^([a-z]|[A-Z])([a-z]|[A-Z]|[0-9]|-|_)*$/.test(data.Gauge))
						return "mvc-" + data.Gauge;
					return "mvc-station-" + data.OBJECTID_1;
				},
				'tooltip': "Most Recent Data",
				'TsId': buttons.getStation(),
			}));
	}

	var conditions = null;

	var mvca_map = L.map('mvca-map', {
		minZoom: 10,
		maxZoom:17,
	}).setView([45.114, -76.5915], 10);
	mvca_map.attributionControl.addAttribution("Automated gauge icon &copy; <a href=\"//www.simpleicon.com\">SimpleIcon</a> from <a href=\"//www.flaticon.com\">FlatIcon.com</a>, " + 
				"Staff gauge icon &copy; <a href=\"//www.freepik.com\">Freepik</a> from <a href=\"//www.flaticon.com\">FlatIcon.com</a>");
	L.esri.basemapLayer('Topographic').addTo(mvca_map);

	mvca_map.createPane('normal-levels');
	mvca_map.createPane('yellow-levels');
	mvca_map.createPane('orange-levels');
	mvca_map.createPane('red-levels');

	var icon_ = function(data) {
		return (function(w, h) {
			var options = {
				iconUrl: "https://unpkg.com/leaflet@1.2.0/dist/images/marker-icon.png",
				iconRetinaUrl: "https://unpkg.com/leaflet@1.2.0/dist/images/marker-icon.png",
				iconSize: [w, h],
				iconAnchor: [Math.round(w/2), Math.round(h)],
				popupAnchor: [-41, Math.round(109 - h)],//[-41, 68]
				className: "mvc-marker-icon",
			};
			return L.divIcon(options);
		})(25, 41);
	}

	var gauges = L.esri.Cluster.featureLayer({
		url: getFeature('All_Gauges'),
		showCoverageOnHover: false,
		fields: ["OBJECTID", "OBJECTID_1", "Gauge", "Buttons"],
		pointToLayer: function(feature, latlng) {
			return L.marker(latlng, {
				icon: icon_()
			});
		},//*/
	}).bindPopup(function(layer) {
		var data = layer.feature.properties;
		return makePopup(data);
	});

	var bounds = L.esri.featureLayer({
		url: getFeature('MVCA_Watershed_Boundary_2018')
	}).setStyle({
		color: 'black',
		fillColor: '#333',
		fillOpacity: 0.00
	});

	var divides = L.esri.featureLayer({
		url: getFeature('Water_Management_Subwatersheds'),
	});
	
	divides['mvc-update-style'] = function() {
		divides.setStyle(function(feature) {
			var options = {
				weight: 1,
				color: "#333",
				fillColor: "#333",
				fillOpacity: 0.10,
				pane: "normal-levels"
			}

			if(conditions === null)
				return options;
			var conds = conditions['sub-watersheds'][feature.properties.Name];

			if(conds === undefined || conds === "Normal")
				return options;
			options.fillOpacity = 0.325;
			options.weight = 3;
			if(conds === "Water Safety" || conds === "Flood Outlook" || conds === "Level 1 Low Water") {
				options.fillColor = "#f3e90b";
				options.color = "#f3e90b";
				options.pane = "yellow-levels";
			}
			if(conds === "Flood Watch" || conds === "Level 2 Low Water") {
				options.color = "#f7881f";
				options.fillColor = "#f7881f";
				options.pane = "orange-levels";
			}
			if(conds === "Flood Warning" || conds === "Level 3 Low Water") {
				options.color = "#ea2328";
				options.fillColor = "#ea2328";
				options.pane = "red-levels";
			}

			return options;
		});
	}
	divides['mvc-update-popup'] = function() {
		if(conditions === null)
			return;
		var popup = (new L.Popup({'offset': new L.Point(-41, 109)}));
		popup.setContent(function(layer) {
			var data = layer.feature.properties;
			var $pane = $('#mvca-map .leaflet-map-pane .leaflet-popup-pane');
			var buttons = null;

			if(conditions['sub-watersheds'][data.Name] === undefined)
				return console.error('ERROR: Unlisted station!');

			$pane.unbind('click', menu_click['mvc-gauge']);//unbind previous handler
			$pane.unbind('click', menu_click['mvc-conditions']);
			$pane.bind('click', conditions, menu_click['mvc-conditions']);//rebind with new data

			buttons = (new ButtonList());//.add((new Button(null, 'View Current Conditions', 'button-automated', 0)).setModal(''));
			return L.Util.template(getPopup(buttons), $.extend({}, data, {
				'Recent': function(data) {
					return ("<br/>"
						 + "<br/>"
						 + "<br/>"
						 + "<span class=\"station-popup-data\">"
							 + ((conditions['sub-watersheds'][data.Name] !== "Normal")?
								conditions['sub-watersheds'][data.Name] + " Statement in Effect":
								"No Statements in Effect")
							 + " as of " + conditions['timestamp']
						 + "</span>");
				},
				'Identifier': function(data) {
					return "conditions-popup\" data-toggle=\"modal\" data-target=\"#conditions-modal\""
				},
				'Gauge': data.Name + " Subwatershed",
				'tooltip': "Current Subwatershed Conditions",
				'TsId': "",
			}));
		});
		divides.bindPopup(popup);
	}
	divides['mvc-update-style']();

	$.ajax({
		dataType: "json",
		url: "/watershed-conditions-message/watershed-conditions-message.json",
		cache: false,
		success: function(res) {
			conditions = res;
			divides['mvc-update-style']();
			divides['mvc-update-popup']();
		},
		error: function(res) {
			console.error('ERROR: Unable to access watershed-conditions-message.json');
			console.log('Details:', res);
		}
	});

	var legend = L.control.htmllegend({
		position: "bottomright"
	});
	legend.addLegend({
		name: "Legend",
		elements: [
			{
				html: "\n\
					<div class=\"mvc-marker-icon mvc-legend\"></div>\n\
				",
				label: "Gauge Location"
			},
			{
				html: "\n\
					<div class=\"marker-cluster marker-cluster-small mvc-legend\">\n\
						<div>\n\
							<span>\n\
								#\n\
							</span>\n\
						</div>\n\
					</div>\n\
				",
				label: "Gauge Cluster"
			},

			{
				html: "Gauge Button Icons",
				label: "",
				style: {
					'font-weight': "bold",
				},
			},
			{
				html: "\n\
					<div class=\"station-button-icon mvc-legend mvc-auto\"></div>\n\
				",
				label: "Automated Gauge Data"
			},
			{
				html: "\n\
					<div class=\"station-button-icon mvc-legend mvc-stff\"></div>\n\
				",
				label: "Staff Gauge Data"
			},
			{
				html: "\n\
					<div class=\"station-button-icon mvc-legend mvc-green\"></div>\n\
				",
				label: "Data is up to Date"
			},
			{
				html: "\n\
					<div class=\"station-button-icon mvc-legend mvc-red\"></div>\n\
				",
				label: "Data is Outdated"
			},

			{
				html: "Subwatershed Low Water Colours:",
				label: "",
				style: {
					'font-weight': "bold",
				},
			},
			{
				html: "\n\
					<div class=\"mvc-sub-watershed-colour mvc-sub-watershed-level-i mvc-legend\"></div>\n\
				",
				label: "Level 1 Low Water",
				style: {},
			},
			{
				html: "\n\
					<div class=\"mvc-sub-watershed-colour mvc-sub-watershed-level-ii mvc-legend\"></div>\n\
				",
				label: "Level 2 Low Water",
				style: {},
			},
			{
				html: "\n\
					<div class=\"mvc-sub-watershed-colour mvc-sub-watershed-level-iii mvc-legend\"></div>\n\
				",
				label: "Level 3 Low Water",
				style: {},
			},

			{
				html: "Subwatershed High Water Colours:",
				label: "",
				style: {
					'font-weight': "bold",
				},
			},
			{
				html: "\n\
					<div class=\"mvc-sub-watershed-colour mvc-sub-watershed-level-i mvc-legend\"></div>\n\
				",
				label: "Water Safety Statement",
				style: {},
			},
			{
				html: "\n\
					<div class=\"mvc-sub-watershed-colour mvc-sub-watershed-level-i mvc-legend\"></div>\n\
				",
				label: "Flood Outlook Statement",
				style: {},
			},
			{
				html: "\n\
					<div class=\"mvc-sub-watershed-colour mvc-sub-watershed-level-ii mvc-legend\"></div>\n\
				",
				label: "Flood Watch",
				style: {},
			},
			{
				html: "\n\
					<div class=\"mvc-sub-watershed-colour mvc-sub-watershed-level-iii mvc-legend\"></div>\n\
				",
				label: "Flood Warning",
				style: {},
			},
			{
				html: "",
				label: "",
				style: {},
			},
		],
	})

	var btnHelp = L.easyButton('<i class="fa mvc-help-button">&#xf128; </i>', function() {
		$('#help-button').trigger('click');
	});

	bounds.addTo(mvca_map);
	divides.addTo(mvca_map);
	gauges.addTo(mvca_map);
	L.control.defaultExtent().addTo(mvca_map);
	legend.addTo(mvca_map);
	btnHelp.addTo(mvca_map);

	$('text.pseudo-input').bind('click', null, range_click);
	/*$('input.mvc-range-selector').bind('blur', null, function(e) {
		console.log(new Date(), 'blur!', e.originalEvent);
		range_blur(e);
	});
	$('input.mvc-range-selector').bind('mvc-show', null, function(e) {
		console.log(new Date(), 'focus!');
		range_click(e);
	});*/
	$('input.mvc-range-selector').bind('blur', null, range_blur);
	//$('input.mvc-range-selector').bind('mvc-show', null, range_click);
	$('input.mvc-range-selector:not(.mvc-table)').bind('change', null, range_blur);
	$('#mvc-tab-table').bind('click', null, toggle_click);
})();
(function() {
	function nav_shown(event) {
		$e = $(event.target)
		$twin = $('#data-modal a[data-toggle="tab"][href="' + $e.attr('href') + '"]:not(#' + $e.attr('id') + ')')
		$twin.tab('show')
	}

	$('#data-modal a[data-toggle="tab"]').bind('shown.bs.tab', nav_shown)

	$('#disclaimer-button').trigger('click');


	$.datepicker.setDefaults({
		dateFormat: 'yy-mm-dd',
		//onChangeMonthYear: function() {console.log('test')},
		onClose: function(dateText, inst) {
			this.blur();
		}
	});
	$('input.mvc-range-selector').datepicker();
	$('input.mvc-range-selector').datepicker('option', 'onClose', function(dateText) {
		if(/\d{3}\d+-(0[1-9]|1[0-2])-([0][1-9]|[1-2][0-9]|3[0-1])/.exec(dateText) !== null)
			$(this).parents('div.mvc-range-selector').removeClass('visible');
		this.blur();
	});
})();