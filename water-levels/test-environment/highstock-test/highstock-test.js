function init(table_id, chart_id) {
	var numData = 0;//Used for the loading message
	var chart = null;//Highstock chart for this page

	var table = [];//array that stores the table rows

	var today = (function(){//This will return today's date as a string
		function addZero(val) {
			return (9 < val? "":"0") + val;
		}
		var temp = new Date();
		return temp.getFullYear() + "-" + addZero(temp.getMonth() + 1) + "-" + addZero(temp.getDate());
	})();//This will set "today" to its string value
	var first = "1918-01-01";//earliest data to load

	/**
	 * 
	**/
	function TimeSeries(name, units, full, hourly, daily, weekly, monthly, yearly) {
		function getName() {
			return name;
		};
		function getUnits() {
			return units;
		}

		/**
		 * This function returns the appropriate timeseries id based on the start and end dates
		 * 
		 * @param start	: date value for the start of the date range
		 * @param end	: date value for the end of the date range
		 * 
		 * @return yearly, if the range is at least 62 years long
		 * @return monthly, if the range is at least 26 years long
		 * @return weekly, if the range is at least 6 years long
		 * @return daily, if the range is at least 2 years long
		 * @return hourly, if the range is at least 2 days long
		 * @return the full timeseries id, if the range is less than 2 days long or no range is provided
		**/
		function getTsId(start, end) {
			const day_02 = new Date('1970-01-03');//UNIX time value for  2  days
			const year02 = new Date('1972-01-01');//UNIX time value for  2 years
			const year06 = new Date('1976-01-01');//UNIX time value for  6 years
			const year26 = new Date('1996-01-01');//UNIX time value for 26 years
			const year62 = new Date('2032-01-01');//UNIX time value for 62 years

			if(start === undefined || end === undefined)
				return full;

			var diff = (new Date(end)) - (new Date(start));//difference b/w 2 dates
			if(0 <= (diff - year62))
				return yearly;
			if(0 <= (diff - year26))
				return monthly;
			if(0 <= (diff - year06))
				return weekly;
			if(0 <= (diff - year02))
				return daily;
			if(0 <= (diff - day_02))
				return hourly;
			return full;
		}

		this.getName = getName;
		this.getUnits = getUnits;
		this.getTsId = getTsId;
		this.toString = function() {
			return name + " (" + units + ")"
		}
	};

	/**
	 * 
	**/
	function Station(id) {
		var series = {};//timeseries
		var primary = "";//primary timeseries
		var links = {};//linked stations

		function getId() {
			return id;
		}

		function getTimeSeries(name, sql) {
			if(series[name] === undefined)
				name = primary;
			if(links[series[name]] !== undefined)
				return links[series[name]].getTimeSeries(name, sql);
			if(sql)
				return getId();
			return series[name];
		}

		/**
		 * 
		**/
		function addTs(ts, is_primary) {
			console.log(series);
			if(series[ts.getName()] !== undefined)
				return this;//cannot have 2 timeseries under the same name at one station
			if(is_primary)
				primary = ts.getName();
			series[ts.getName()] = ts;
			console.log(series);
			return this;
		}

		/**
		 * 
		**/
		function link(station, name) {
			if(series[name] !== undefined)
				return;//cannot have 2 timeseries under the same name at one station
			if(links[station.getId()] === undefined)
				links[station.getId()] = station;//Only add the station to the links if it is not already there
			series[name] = station.getId();
		}

		this.getId = getId;
		this.getTs = getTimeSeries;
		this.addTs = addTs;
		this.link = link;
		this.__proto__.toString = function() {
			var out = id + "\n";
			for(var str in series) {
				console.log(str, series, series[str].toString());
				out += "\t>" + series[str].toString() + "\n";
			}
			return out;
		}
	};

	/**
	 * 
	**/
	function StationList() {
		var list = {};

		function add(station) {
			list[station.getId()] = station;
			return station;//for chaining with other operations
		}
		function get(id) {
			return list[id];
		}

		this.add = add;
		this.get = get;
		this.__proto__.toString = function() {
			var out = "";
			for(var str in list)
				out += list[str].toString() + "\n";
			return out;
		}
	}

	var gauges = new StationList();
	(gauges.add(new Station('Appleton Flow')).addTs(new TimeSeries('Flow Rate', 'cms', "38819042", "38819042", "38819042", "38819042", "38819042", "38819042"), true)
		.addTs(new TimeSeries('Not Flow Rate', 'Not cms', "38819042", "38819042", "38819042", "38819042", "38819042", "38819042")))
	console.log(gauges.toString());

	/**
	 * This function returns the value of the specified parameter for the specified timeseries id
	 * 
	 * @param url	- the station id of the station to get data from
	 * @param param	- the parameter name to get; defaults to "primary"
	 * 
	 * @return	- The value of the url timeseries's param parameter
	 * 
	 * @format	- When adding new stations to the returned object, they should have the following format:
	 * 
	 * 			'station id': {
	 * 				'Ids': {
	 * 					'Measurement   1  ': {
	 * 						full: "ts_id for the complete timeseries",
	 * 						hourly: "ts_id for hourly values",
	 * 						daily: "ts_id for daily values",
	 * 						weekly: "ts_id for weekly values",
	 * 						monthly: "ts_id for monthly values",
	 * 						yearly: "ts_id for yearly values",
	 * 						units: "units of measurement to be displayed"
	 * 					},
	 * 					'Measurement   2  ': {...},
	 * 					...
	 * 					'Measurement (n-1)': {...},
	 * 					'Measurement   n  ': {...}
	 * 				},
	 * 				'primary': "Name of primary measurement"
	 * 			},
	 * 
	 * 			Things to note: all of full, hourly, daily, weekly, monthly, yearly MUST have a timeseries id.  If
	 * 			 the measurement in question does not have a timeseries for each, fill it with one of the others
	 * 			Ex: Historical Minimum has no hourly timeseries, so it is given the ts_id for the daily timeseries
	 * 			 instead.  Each measurement should have units, as this value is used for displaying the data on 
	 * 			both the chart and the table.  Finally, each gauge should have a 'primary' value; this value is 
	 * 			used in order to label the chart's primary axis, as well as determining which series is displayed 
	 * 			in the navigator.  The full/hourly/daily/weekly/monthly/yearly timeseries's values can be 
	 * 			determined whichever way you see best; they can be averages, sums, or even one particular value 
	 * 			over that frame of time (though this last option is not recommended).  The station id should be 
	 * 			the same as the one in the SQL database
	**/
	function getTsInfo(url, param="primary") {
		console.log(url);
		if(url === "undefined")
			return;
		return {
			'Appleton Flow': {
				'Ids': {
					'Flow Rate':{
						full: "38819042",
						hourly: "38692042",
						daily: "3449042",
						weekly: "38694042",
						monthly: "38695042",
						yearly: "38696042",
						units: "cms",
					},
					'Historical Average': {
						full: "38698042",
						hourly: "38698042",
						daily: "38698042",
						weekly: "5959042",
						monthly: "38291042",
						yearly: "38293042",
						units: "cms",
					},
					'Historical Minimum': {
						full: "38686042",//"38684042",
						hourly: "38686042",//"38684042",
						daily: "38686042",//"38684042",
						weekly: "38685042",
						monthly: "38684042",//"38686042",
						yearly: "38687042",
						units: "cms",
					},
					'Historical Maximum': {
						full: "38688042",
						hourly: "38688042",
						daily: "38688042",
						weekly: "38689042",
						monthly: "38690042",
						yearly: "38691042",
						units: "cms",
					},
					'Precipitation': {
						full: "1442042",
						hourly: "1442042",
						daily: "1448042",
						weekly: "38821042",
						monthly: "8791042",
						yearly: "35870042",
						units: "mm"
					},
				},
				'primary': "Flow Rate",
			},
			'Myers Cave Flow': {
				'Ids': {
					'Flow Rate': {
						units: "cms"
					},
					'Historical Average': {
						units: "cms"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Flow Rate"
			},
			'Buckshot Creek Flow': {
				'Ids': {
					'Flow Rate': {
						units: "cms"
					},
					'Historical Average': {
						units: "cms"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Flow Rate"
			},
			'Ferguson Falls Flow': {
				'Ids': {
					'Flow Rate': {
						units: "cms"
					},
					'Historical Average': {
						units: "cms"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Flow Rate"
			},
			'Gordon Rapids Flow': {
				'Ids': {
					'Flow Rate': {
						units: "cms"
					},
					'Historical Average': {
						units: "cms"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Flow Rate"
			},
			'Lanark Stream Flow': {
				'Ids': {
					'Flow Rate': {
						units: "cms"
					},
					'Historical Average': {
						units: "cms"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Flow Rate"
			},
			'Mill of Kintail Flow': {
				'Ids': {
					'Flow Rate': {
						units: "cms"
					},
					'Historical Average': {
						units: "cms"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Flow Rate"
			},
			'Kinburn Flow': {
				'Ids': {
					'Flow Rate': {
						units: "cms"
					},
					'Historical Average': {
						units: "cms"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Flow Rate"
			},
			'Bennett Lake Outflow': {
				'Ids': {
					'Flow Rate': {
						units: "cms"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Flow Rate"
			},
			'Dalhousie Lk Outflow': {
				'Ids': {
					'Flow Rate': {
						units: "cms"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Flow Rate"
			},
			'High Falls Flow': {
				'Ids': {
					'Flow Rate': {
						units: "cms"
					},
				},
				'primary': "Flow Rate"
			},

			'Shabomeka Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Water Level"
			},
			'Mazinaw Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Kashwakamak Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Farm Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Mississagagon Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Big Gull Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Crotch Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Water Level"
			},
			'Palmerston Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Water Level"
			},
			'Canonto Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Sharbot Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Water Level"
			},
			'Bennett Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Flow Rate': undefined,
					'Historical Average': {
						units: "MASL"
					},
					'Precipitation': undefined,
				},
				'Keys': {
					'Flow Rate': "Bennett Lake Outflow",
					'Precipitation': "Bennett Lake Outflow",
				},
				'primary': "Water Level"
			},
			'Dalhousie Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
					'Precipitation': undefined,
				},
				'Keys': {
					'Flow Rate': "Dalhousie Lk Outflow",
					'Precipitation': "Bennett Lake Outflow",
				},
				'primary': "Water Level"
			},
			'Lanark': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Mississippi Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'C.P. Dam': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Carp River at Maple Grove': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Precipitation': {
						units: "mm"
					},
				},
				'primary': "Water Level"
			},
			'High Falls': {
				'Ids': {
					'Flow Rate': undefined,
					'Water Level': {
						units: "MASL"
					},
				},
				'Keys': {
					'Flow Rate': "High Falls Flow"
				},
				'primary': "Water Level"
			},
			'Carp River at Richardson': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Poole Creek at Maple Grove': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Widow Lake': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},

			'Shabomeka Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Mazinaw Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Little Marble Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Mississagagon Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Kashwakamak Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Farm Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Ardoch Bridge (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
				},
				'primary': "Water Level",
			},
			'Buckshot Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Malcolm Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Pine Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Big Gull Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Crotch Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'High Falls G.S. (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Mosque Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
				},
				'primary': "Water Level",
			},
			'Palmerston Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Canonto Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Bennett Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Dalhousie Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Silver Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Widow Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Lanark Dam (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
				},
				'primary': "Water Level",
			},
			'C.P. Dam (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Almonte Bridge (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Clayton Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL",
					},
					'Historical Average': {
						units: "MASL",
					},
				},
				'primary': "Water Level",
			},
			'Summit Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Lanark Bridge (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
			'Sharbot Lake (weekly)': {
				'Ids': {
					'Water Level': {
						units: "MASL"
					},
					'Historical Average': {
						units: "MASL"
					},
				},
				'primary': "Water Level"
			},
		}[url][param]
	}

	/**
	 * This function gets the ts_id of the gauge based the size of the difference between the start and end dates
	 * 
	 * @param url		- the station's id
	 * @param tsName	- the name of the measurement to get the ts_id of
	 * @param start		- the start date of the data being retrieved
	 * @param end		- the end date of the data being retrieved
	 * 
	 * @return	- the yearly ts_id, if the end date is at least 62 years after the start date
	 * @return	- the monthly ts_id, if the end date is at least 26 years after the start date
	 * @return	- the weekly ts_id, if the end date is at least 6 years after the start date
	 * @return	- the daily ts_id, if the end date is at least 2 years after the start date
	 * @return	- the hourly ts_id, if the end date is at least 2 days after the start date
	 * @return	- the full ts_id, otherwise
	**/
	function getTSID(url, tsName, start, end) {
		const day_02 = new Date('1970-01-03');
		const year02 = new Date('1972-01-01');
		const year06 = new Date('1976-01-01');
		const year26 = new Date('1996-01-01');
		const year62 = new Date('2032-01-01');

		var ts_id = getTsInfo(url, 'Ids')[tsName];
		if(ts_id === undefined) {
			var keys = getTsInfo(url, 'Keys');
			//console.log(keys);
			ts_id = getTsInfo(getTsInfo(url, 'Keys')[tsName], 'Ids')[tsName];
			url = getTsInfo(url, 'Keys')[tsName];
		}

		if(ts_id[start] === undefined && end === undefined)
			return url;
		if(ts_id[start] !== undefined && end === undefined)
			return ts_id[start];

		var diff = end - start;

		if(0 <= diff - year62)
			return ts_id.yearly;
		if(0 <= diff - year26)
			return ts_id.monthly;
		if(0 <= diff - year06)
			return ts_id.weekly;
		if(0 <= diff - year02)
			return ts_id.daily;
		if(0 <= diff - day_02)
			return ts_id.hourly;
		return ts_id.full;
	}

	/**
	 * This function loads data for a timeseries from KiWIS
	 * 
	 * @param url		- id of the timeseries to be retrieved
	 * @param start		- start date of the data to be retrieved
	 * @param end		- end date of the data to be retrieved
	 * @param format	- data format (really only intended to be "json" at this time)
	 * @param func		- callback function to execute after data is successfully retrieved
	 * @param err		- callback function to execute upon failed response; defaults to an empty function
	 * 
	 * @return	- the result of calling loadFromKiWIS with the value of first instead of start if start is null or
	 * 			 undefined
	 * @return	- the result of calling loadFromKiWIS with the value of today instead of end if end is null or 
	 * 			undefined
	 * @return	- the result of calling loadFromKiWIS with end and start switched if start is larger than end
	**/
	function loadFromKiWIS(url, start, end, format, func, err=function(){}) {
		if(start === undefined)
			return loadFromKiWIS(url, first, end, format, func, err);
		if(end === undefined)
			return loadFromKiWIS(url, start, today, format, func, err);
		if(end < start)
			return loadFromKiWIS(url, end, start, format, func, err);

		/* 
		 * These 2 variables are combined with url to form the KiWIS URL from which data is retrieved
		 */
		var prefix = "//waterdata.quinteconservation.ca/KiWIS/KiWIS?service=kisters&type=queryServices&request=getTimeseriesValues&datasource=0&format=" + format + "&ts_id=";
		var suffix = "&header=true&metadata=true&md_returnfields=station_name,parametertype_name&dateformat=UNIX";
		if(start !== null)
			suffix += "&from=" + start;
		if(end !== null)
			suffix += "&to=" + end;

		numData++;//Keep track of how many times makeDataByYear is called in order to properly show/hide 'loading...' text
		$.ajax({
			dataType: (format === 'csv'? "text" : format),
			url: prefix + url + suffix,
			success: function(res) {
				numData--;//reduce numData now that the request has returned
				func(res);
				try {
					if(footerPos !== undefined)
						footerPos();//reposition the footer once the request has finished
				} catch(ex) {}
			},
			error: function(res) {
				numData--;//reduce numData so as to not cause problems
				err(res, func);
			}
		});
	}

	/**
	 * This function returns a function that loads data from the SQL database given an error response and callback
	 *  function
	 * 
	 * @param tsId		- id of the timeseries to be retrieved
	 * @param tsName	- name of the measurement to be retrieved
	 * @param start		- start date of the data to be retrieved
	 * @param end		- end date of the data to be retrieved
	 * @param format	- data format (really only intended to be "json" at this time)
	 * 
	 * @return	- the result of calling loadFromSql with the value of first instead of start if start is null or 
	 * 			undefined
	 * @return	- the result of calling loadFromSql with the value of today instead of end if end is null or 
	 * 			undefined
	 * @return	- the result of calling loadFromSql with end and start switched if start is larger than end
	 * @return	- a function that retrieves data from the SQL database
	**/
	function loadFromSql(tsId, tsName, start, end, format) {
		if(start === undefined)
			return loadFromSql(tsId, tsName, first, end, format);//Call loadFromKiWIS with default start and end dates if not provided
		if(end === undefined)
			return loadFromSql(tsId, tsName, start, today, format);
		if(end < start)
			return loadFromSql(tsId, tsName, end, start, format);

		/**
		 * This function loads data from the SQL database, in much the same way that loadFromKiWIS gets data from 
		 * KiWIS.  Due to function closures, this function only needs to take 2 parameters, as all of the others 
		 * can be accessed from loadFromSql through function closures.  This function is intended as an "err" 
		 * parameter for loadFromKiWIS.
		 * 
		 * @param err	- The failed response from KiWIS
		 * @param func	- The function to execute upon a successful response
		**/
		return function(err, func) {
			var url = "../highstock-test/sql-data/?ts_id=" + tsId + "&col=" + tsName;
			if(start !== null)
				url += "&from=" + start;
			if(end !== null)
				url += "&to=" + end;

			$('#alert-msg').removeClass('disabled');//alert the user that the displayed data is from the sql database and may not be the most recent data

			numData++;
			$.ajax({
				dataType: (format === 'csv'? "text" : format),
				url: url,
				success: function(res) {
					/* 
					 * format the response to be in the same format as the response given by KiWIS
					 */
					var response = [
						{
							"data": []
						}
					];
					for(var i = 0; i < res.Date.length; i++)
						response[0].data.push([(new Date(res.Date[i] + " " + res.Time[i])).valueOf(), res.Data[i]]);
					numData--;
					func(response);
					try {
						if(undefined !== footerPos)
							footerPos();
					} catch(ex) {}
				},
				error: function(res) {
					numData--;
				}
			});
		}
	}


	/**
	 * This function creates the Highstock chart.
	 * 
	 * @param tsId	- the station's id
	 * @param gauge	- name of the station; defaults to "Mississippi River at Appleton" because this page doesn't 
	 * 				yet support any other station (should probably default to something generic like 
	 * 				"Station Name" once other stations are supported)
	**/
	function makeChart(tsId, gauge="Mississippi River at Appleton") {
		var cols = getOrderedCols(tsId);

		/* 
		 * Create the Highstock chart.  Go to the Highstock section of Highcharts's website for more information 
		 * on chart options
		 */
		var options = {
			chart: {
				renderTo: chart_id,
			},
			plotOptions: {
				showInNavigator: false,
			},
			navigator: {
				adaptToUpdatedData: false,
			},
			scrollbar: {
				liveRedraw: false,
			},
			legend: {enabled: true},
			rangeSelector: {},
			title: {
				text: $('#table-title')[0] !== undefined? $('#table-title')[0].innerHTML : "",
			},
			series: [],
			xAxis: {
				events: {
					afterSetExtremes: function(e){
						selectRange(tsId, e);//Need to pass timeseries id to selectRange
					},
				},//*/
				max: (new Date(today)).valueOf(),
				//min: (new Date(first)).valueOf(),
				ordinal: false
			},
			yAxis: [
				{ // Primary yAxis
					labels: {
						format: "{value} " + getTsInfo(tsId, 'Ids')[getTsInfo(tsId, 'primary')].units,
						style: {
							color: Highcharts.getOptions().colors[cols.indexOf(getTsInfo(tsId, 'primary'))]
						}
					},
					title: {
						text: getTsInfo(tsId, 'primary') + " (" + getTsInfo(tsId, 'Ids')[getTsInfo(tsId, 'primary')].units + ")",
						style: {
							color: Highcharts.getOptions().colors[cols.indexOf(getTsInfo(tsId, 'primary'))]
						}
					},
					opposite: false
				},
			],
			exporting: {
				buttons: {
					contextButton: {
						/*symbol: "download"*/
					},
				},
			},
			tooltip: {valueDecimals: 2,shared: true}
		};

		primary_flow = getTsInfo(tsId, 'primary') === "Flow Rate";

		if(-1 < cols.indexOf('Precipitation')) {
			options.yAxis.push({ // Secondary yAxis
				gridLineWidth: 0,
				title: {
					text: "Precipitation (mm)",
					style: {
						color: Highcharts.getOptions().colors[cols.indexOf('Precipitation')]
					}
				},
				labels: {
					format: "{value} mm",
					style: {
						color: Highcharts.getOptions().colors[cols.indexOf('Precipitation')]
					}
				},
				opposite: true
			});
		}

		if(-1 < cols.indexOf('Flow Rate') && -1 < cols.indexOf('Water Level')) {
			options.yAxis.push({
				title: {
					text: primary_flow? "Water Level (MASL)" : "Flow Rate (cms)",
					style: {
						color: Highcharts.getOptions().colors[cols.indexOf(primary_flow? 'Water Level' : 'Flow Rate')]
					}
				},
				labels: {
					format: "{value}" + (primary_flow? " (MASL)" : " (cms)"),
					style: {
						color: Highcharts.getOptions().colors[cols.indexOf(primary_flow? 'Water Level' : 'Flow Rate')]
					}
				},
				opposite: false,
			})
		}

		chart = new Highcharts.StockChart(options);
		chart.showLoading();
	}

	/**
	 * This function creates a Highstock series from an http response
	 * 
	 * @param res		- the http response that contains the data
	 * @param tsId		- the station id
	 * @param tsName	- the name of the measurement that the series will represent
	 * @param cIndex	- the colour index for the series; defaults to undefined
	 * 
	 * @return	- the newly created series
	 
	**/
	function makeSeries(res, tsId, tsName, cIndex=undefined) {
		var data = res[0].data; //pointer to KVP parent object
		cols = getOrderedCols(tsId);

		//populate the series for the chart (type and tooltip default to their values for flow rate)
		var singleSeries = {
			_colorIndex: cIndex,
			_symbolIndex: cIndex,
			connectNulls: true,
			name: tsName,//Can also extract name directly from query
			data: data,
			type: "spline",//Both flow rate and water level use line charts
			yAxis: 0,
			tooltip: {
				valueSuffix: " " + getTSID(tsId, tsName, 'units')//flow rate is measured in cms, water level is measured in m, and precipitation is measured in mm
			},
		};

		if(tsName === getTsInfo(tsId, 'primary'))
			singleSeries.showInNavigator = true;
		if(getTSID(tsId, tsName, 'units') !== getTSID(tsId, getTsInfo(tsId, 'primary'), 'units'))
			singleSeries.yAxis = 1 + (-1 < cols.indexOf('Precipitation')? 1 : 0);

		if(tsName === "Precipitation") {
			singleSeries.type = "column";//Precipitation uses a bar chart, instead of a line chart
			singleSeries.yAxis = 1;
		}
		return singleSeries;
	}

	/**
	 * This function takes a KiWIS id, a data series name, and an integer; loads the KiWIS data; and 
	 * then constructs a Highchart using said data.
	 * 
	 * @param tsId - The station's id
	 * @param tsName - The name of the data series used to create a highchart.
	 * @param n - A number value used to determine which data series is being added (should maybe use 
	 *         tsName for this instead?)
	 * 
	 * @returns - void
	 * 
	 * Example usage:
	 * 					makeData('1391042', 'Water Level', 0);
	 * The above example gets the water level data for the gauge at Buckshot Creek (near plevna)
	**/
	function makeData(tsId, start=first, end=today) {
		if(end === "")
			end = today;
		if(start === "")
			start = new Date((new Date(end + ' 00:00:00')).setMonth((new Date(end + ' 00:00:00')).getMonth() - 3));

		var params = getOrderedCols(tsId);
		var series = [];
		for(var i = 0; i < params.length; i++)
			series[i] = null;

		makeChart(tsId);//This will also be passed the gauge name, once I figure out how to obtain that value at this point in the function

		for(var i = 0; i < params.length; i++) {
			/**
			 * This function is used to prevent problems due to function closure (specifically concerning the 
			 * value of i)
			 * 
			 * @param i - value of i from the for loop
			**/
			(function(i) {
				/**
				 * This function creates a new series from the response and adds it to the highstock chart
				 * 
				 * @param response	- the response from either KiWIS or the SQL database
				**/
				loadFromKiWIS(getTSID(tsId, params[i], new Date(first), new Date(today)), first, today, 'json', function(response) {
					var singleSeries = makeSeries(response, tsId, params[i], i);
					series[i] = singleSeries;//put the new series into the series array

					if(numData !== 0)
						return;//stop here until all responses are received
					for(var j = 0; j < series.length; j++)
						chart.addSeries(series[j], false);//Add all the series in the series array to preserve their order
					chart.xAxis[0].setExtremes((new Date(start)).valueOf(), (new Date(end)).valueOf(), false);//Update the xAxis's extremes to the start and end dates
					chart.hideLoading();//hide the loading display
					chart.redraw();//update the chart's display
					$('#chart-info').removeClass('disabled');//display the units of measurement legend
				}, loadFromSql(getTSID(tsId, params[i]), params[i], first, today, 'json'));
			})(i);
		}
	}

	/**
	 * This function updates the existing data in the chart with a new start and end date.
	 * 
	 * @param tsId	- the station's id
	 * @param start	- the new start date
	 * @param end	- the new end date
	**/
	function updateData(tsId, start, end) {
		var params = getOrderedCols(tsId);//get the column list for the tsNames

		if(chart === null)
			return;//The chart _should_ already exist at this point, so exit without doing anything if it doesn't
		chart.showLoading();//display "loading" on the chart

		for(var i = 0; i < params.length; i++) {
			/**
			 * This function is to get around problems caused by function closure
			 * 
			 * @param tsName	- value of params[i]
			**/
			(function(tsName) {
				/**
				 * This function updates the data in the chart's series with the new data received from the 
				 * response
				 * 
				 * @param response	- the response from KiWIS or the SQL database
				**/
				loadFromKiWIS(getTSID(tsId, tsName, new Date(start), new Date(end)), start, end, 'json', function(response) {
					var series = null;
					var data = response[0].data;//get the data from the response

					for(var j = 0; j < chart.series.length; j++) {
						if(chart.series[j].name !== tsName)
							continue;//skip this iteration if the jth series is not the one we're updating
						series = chart.series[j];//set series to the jth series
					}

					if(series === null && numData !== 0)
						return;//stop without doing anything if series is still null and this is not the last response
					if(series === null)
						return chart.hideLoading();//hide loading and stop here if series is still null
					series.setData(data, false);//update the series's data

					if(numData !== 0)
						return;//stop here if this is not the last response
					chart.hideLoading();//hide the loading message
					chart.redraw();//update the chart's display
				}, loadFromSql(getTSID(tsId, tsName), tsName, start, end, 'json'));
			})(params[i]);
		}
	}

	/**
	 * This function calls updateData to update the chart's data when the data range changes
	 * 
	 * @param tsId	- the timeseries id to be refreshed
	 * @param e		- the event that caused this function to execute
	**/
	function selectRange(tsId, e) {
		/**
		 * This function converts a date-time value from milliseconds to yyyy-mm-dd
		 * 
		 * @param ms	- the date-time value in milliseconds since 1970
		 * 
		 * @return	- the date-time value as a yyyy-mm-dd string
		**/
		function toYMD(ms) {
			var temp = new Date(ms);//convert ms from int to Date
			temp = temp.toISOString();//convert temp into a "yyyy-mm-ddThh:mm:ss.msZ"
			return temp.substr(0, temp.indexOf('T'));//Remove the "hours:minutes:seconds.milliseconds" part of temp
		}
		updateData(tsId, toYMD(e.min), toYMD(e.max));//update the chart data
	}


	/**
	 * This function is responsible for creating the table version of this page
	 * 
	 * @param tsId	- the station's id
	 * @param start	- the start date for the table's data
	 * @param end	- the end date for the table's data
	**/
	function loadTable(tsId, start, end) {
		if(end === "")
			end = today;
		if(start === "")
		{
			start = (function(){
				var temp = new Date((new Date(end)).setMonth((new Date(end)).getMonth() - 3));
				temp = temp.toISOString();
				return temp.substr(0, temp.indexOf('T'));
			})();
		}
		var params = getOrderedCols(tsId);//get tsNames

		document.getElementById(table_id).innerHTML = "<h3>Now Loading...</h3>";

		$('.mvc-tooltip').unbind('click', tooltip_show);
		$('.mvc-tooltip').unbind('mouseout', tooltip_hide);

		for(var i = 0; i < params.length; i++) {
			/**
			 * This function is meant to work around problems caused by function closure
			 * 
			 * @param tsName - the name of the measurement to get
			**/
			(function(tsName) {
				/**
				 * This function creates the table based on the responses from KiWIS or the SQL database
				 * 
				 * @param response	- the response from KiWIS or the SQL database
				**/
				loadFromKiWIS(getTSID(tsId, tsName, 'daily'), start, end, 'json', function(response) {
					addRows(response[0].data, tsId, tsName);//add the rows from the data found in this response
					if(0 < numData)
						return;//stop here if this is not the last response
					document.getElementById(table_id).innerHTML = makeTable(tsId);//create the table
					$('.mvc-tooltip').bind('click', null, tooltip_show);
					$('.mvc-tooltip').bind('mouseout', null, tooltip_hide);
					$('#table-title').removeClass('disabled');//display the table's title
				}, loadFromSql(getTSID(tsId, tsName), tsName, start, end, 'json'));
			})(params[i]);
		}
	}

	/**
	 * This function adds new rows or adds new data to existing rows if they already exist
	 * 
	 * @param data		- the data being added
	 * @param tsId		- the station id
	 * @param tsName	- the name of the measurement being added
	**/
	function addRows(data, tsId, tsName) {
		for(var i = 0; i < data.length; i++) {
			if(table[data[i][0]] === undefined)
				table[data[i][0]] = getTemplate(tsId);//Add this row to the table if no row with this timestamp exists
			var timestamp = new Date(data[i][0]);//get the timestamp
			var row = table[data[i][0]];//get the actual data

			function getTimeVal(val) {
				return (9 < val? "" : "0") + val;
			}

			/* 
			 * Set the row's timestamp
			 */
			if(row['Date'] === null)
				row['Date'] = timestamp.getFullYear() + "-" + getTimeVal(timestamp.getMonth()+1) + "-" + getTimeVal(timestamp.getDate());
			if(row['Time'] === null)
				row['Time'] = getTimeVal(timestamp.getHours()) + ":" + getTimeVal(timestamp.getMinutes()) + ":" + getTimeVal(timestamp.getSeconds());
			if(row[tsName] === undefined)
				continue;//do nothing if this column does not exist
			if(row[tsName] !== null)
				continue;//do nothing if there is already data in this column
			row[tsName] = data[i][1];//add the data for this tsName's column
			table[data[i][0]] = row;//set the row at this timestamp
		}
	}

	/**
	 * This function gets the row template for the table rows
	 * 
	 * @param tsId	- the station id, used to get what data the station measures
	 * 
	 * @return	- the row template for this station's table
	**/
	function getTemplate(tsId) {
		var cols = getOrderedCols(tsId);
		var template = {
			'Date': null,
			'Time': null,
		};

		for(var i = 0; i < cols.length; i++)
			template[cols[i]] = null;//add the station's columns to the template
		return template;
	}

	/**
	 * This function gets the columns of the station in an order specified by the value's priority
	**/
	function getOrderedCols(tsId) {
		var ids = getTsInfo(tsId, 'Ids');
		var cols = [];

		/**
		 * This function returns a given column's priority.  Higher priority number means column is placed further
		 * to the left side of the table.
		 * 
		 * @param val	- tsName for the column to get the priority of
		 * 
		 * @return	- various integer values that depend on the given val parameter
		**/
		var priority = function(val) {
			if(val === getTsInfo(tsId, 'primary'))
				return 9001;//IT'S OVER NINE THOUSAAAAAAAAAAAND!!!  (WHAT?!  NINE THOUSAND?!)
			switch(val) {
				case 'Flow Rate':
				case 'Water Level':
					return 30;
				case 'Historical Average':
				case 'Historical Maximum':
				case 'Historical Minimum':
					return 20;
				case 'Precipitation':
					return 10;
				default:
					return -1;
			}
		}

		for(var c in ids)
			cols.push(c);//add the tsNames to cols
		/**
		 * This function is a compare function that sorts an array based on the priority returned from the 
		 * priority function, with items that have a higher priority appearing first and items with a lower 
		 * priority appearing last.  Items with equal priority are compared normally.
		 * 
		 * @param a	- the item being compared
		 * @param b	- the item being compared against
		**/
		return cols.sort(function(a,b) {
			if(priority(b) < priority(a))
				return -1;
			if(priority(a) < priority(b))
				return 1;
			if(a < b)
				return -1;
			if(b < a)
				return 1;
			return 0;
		});
	}

	/**
	 * This function returns the tooltip for the table column headers based on the given units for the column
	 * 
	 * @param units	- the units for the column
	 * 
	 * @return	- the tooltip message
	**/
	function getTooltip(units) {
		switch(units) {
			case 'cms':
				return "cubic meters per second";
			case 'MASL':
				return "Meters Above Sea Level";
			case 'mm':
				return "millimeters";
			default:
				return "1.5 metric units of 'someone screwed this up'"//This should not ever be returned; if it is returned, someone used an invalid unit
		}
	}

	/**
	 * This function creates the html code for the table
	 * 
	 * @param tsId	- station id
	 * 
	 * @return	- the html code for the table
	**/
	function makeTable(tsId) {
		var html = '<table class="data-table">';
		var cols = [];

		if(tsId === undefined)
			return;
		for(var r in table) {
			if(r === undefined)
				continue;
			var row = table[r];
			/* 
			 * if the column headers haven't been added, add them
			 */
			if(cols.length === 0) {
				cols = ["Date", "Time"].concat(getOrderedCols(tsId));

				html += '<tr>';
				for(var i = 0; i < cols.length; i++) {
					html += '<th>' + cols[i];//add the tsName
					if(getTsInfo(tsId, 'Ids')[cols[i]] !== undefined)
						html += (' ('
							+ '<p class="mvc-tooltip" title="' + getTooltip(getTsInfo(tsId, 'Ids')[cols[i]].units) + '">'
							+ getTsInfo(tsId, 'Ids')[cols[i]].units
							+ '<span class="mvc-tooltip-text">'
							+ getTooltip(getTsInfo(tsId, 'Ids')[cols[i]].units)
							+ '</span>'
							+ '</p>'
							+ ')');//don't add a tooltip if the tsName has no units value
					html += '</th>';
				}
				html += '</tr>';
			}
			html += '<tr>';
			for(var i = 0; i < cols.length; i++)
				html += '<td>' + (row[cols[i]] !== null? row[cols[i]] : "") + '</td>';//Add the data to the row
			html += '</tr>';
		}
		html += '</table>';//close the table tag
		table = [];//clear the table array, as we no longer need it
		return html;
	}


	/**
	 * 
	**/
	function getPoint(tsId, func) {
		if(tsId === null)
			return;
		var params = getOrderedCols(tsId);
		var data = [];
		for(var i = 0; i < params.length; i++)
			data[i] = null;

		$('.mvc-tooltip').unbind('click', tooltip_show);
		$('.mvc-tooltip').unbind('mouseout', tooltip_hide);

		for(var i = 0; i < params.length; i++) {
			if(-1 < params[i].indexOf('Historical'))
				continue;
			/**
			 * This function is used to prevent problems due to function closure (specifically concerning the 
			 * value of i)
			 * 
			 * @param i - value of i from the for loop
			**/
			(function(i) {
				/**
				 * This function creates a new series from the response and adds it to the highstock chart
				 * 
				 * @param response	- the response from either KiWIS or the SQL database
				**/
				loadFromKiWIS(getTSID(tsId, params[i], 'full'), null, null, 'json', function(response) {
					data[i] = response[0].data[0];
					if(0 < numData)
						return;
					func(formatPoint(tsId, data, params));
					$('.mvc-tooltip').bind('click', null, tooltip_show);
					$('.mvc-tooltip').bind('mouseout', null, tooltip_hide);
				}, loadFromSql(getTSID(tsId, params[i]), params[i], null, null, 'json'));
			})(i);
		}
	}

	/**
	 * 
	**/
	function formatPoint(tsId, data, params) {
		var out = [];

		for(var i = 0; i < data.length; i++) {
			if(data[i] === null) {
				out[i] = "";
				continue;
			}
			//console.log(data[i][0]);
			out[i] = ("<span class=\"station-popup-data\">"
			 + data[i][1] + " "
			 + "<span class=\"mvc-tooltip\" title=\"" + getTooltip(getTSID(tsId, params[i], 'units')) + "\">"
			 + getTSID(tsId, params[i], 'units')
			 + "<span class=\"mvc-tooltip-text\">"
			 + getTooltip(getTSID(tsId, params[i], 'units'))
			 + "</span>"
			 + "</span>"
			 + "</span>"
			 + "<br/>");
		}
/*+ '<p class="mvc-tooltip" title="' + getTooltip(getTsInfo(tsId, 'Ids')[cols[i]].units) + '">'
							+ getTsInfo(tsId, 'Ids')[cols[i]].units
							+ '<span class="mvc-tooltip-text">'
							+ getTooltip(getTsInfo(tsId, 'Ids')[cols[i]].units)
							+ '</span>'
							+ '</p>'*/

		function getDateString(date) {
			function addZero(val) {
				if(9 < val)
					return "" + val;
				return "0" + val;
			}
			var dateStr = date.getFullYear() + "-" + addZero(date.getMonth() + 1) + "-" + addZero(date.getDate());
			var timeStr = addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds());
			return dateStr + " " + timeStr;
		}
		//var dateStr = (new Date(data[0][0])).toISOString().replace('T', ' ');
		out.push("<br/><span class=\"station-popup-date\">" + getDateString(new Date(data[0][0])) + "</span>");
		return out;
	}


	function getCSV(tsId, start, end) {
		if(end === "")
			end = today;
		if(start === "")
		{
			start = (function(){
				var temp = new Date((new Date(end)).setMonth((new Date(end)).getMonth() - 3));
				temp = temp.toISOString();
				return temp.substr(0, temp.indexOf('T'));
			})();
		}
		var params = getOrderedCols(tsId);//get tsNames

		for(var i = 0; i < params.length; i++) {
			/**
			 * This function is meant to work around problems caused by function closure
			 * 
			 * @param tsName - the name of the measurement to get
			**/
			(function(tsName) {
				/**
				 * This function creates the table based on the responses from KiWIS or the SQL database
				 * 
				 * @param response	- the response from KiWIS or the SQL database
				**/
				loadFromKiWIS(getTSID(tsId, tsName, 'full'), start, end, 'json', function(response) {
					addRows(response[0].data, tsId, tsName);//add the rows from the data found in this response
					if(0 < numData)
						return;//stop here if this is not the last response
					var csv = makeCSV(tsId);//create the table
					var anchor = document.createElement('a');
					anchor.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
					anchor.download = tsId + " Gauge Data " + start + " to " + end + ".csv";
					anchor.click();
				}, loadFromSql(getTSID(tsId, tsName), tsName, start, end, 'json'));
			})(params[i]);
		}
	}

	function makeCSV(tsId) {
		var contents = '';
		var cols = [];

		var keys = []
		for(var k in table)
			keys.push(k);
		console.log(keys);
		console.log(keys.sort());

		if(tsId === undefined)
			return;
		for(var r = 0; r < keys.length; r++) {
			if(r === undefined)
				continue;
			//console.log(r);
			var row = table[keys[r]];
			/* 
			 * if the column headers haven't been added, add them
			 */
			if(cols.length === 0) {
				cols = ["Date", "Time"].concat(getOrderedCols(tsId));

				for(var i = 0; i < cols.length; i++) {
					contents += cols[i];//add the tsName
					if(getTsInfo(tsId, 'Ids')[cols[i]] !== undefined)
						contents += (" (" + getTsInfo(tsId, 'Ids')[cols[i]].units + ")");//don't add a tooltip if the tsName has no units value
					contents += ",";
				}
			}
			contents += "\n";
			for(var i = 0; i < cols.length; i++)
				contents += (row[cols[i]] !== null? row[cols[i]] : "") + ",";//Add the data to the row
		}
		contents += '';//close the table tag
		table = [];//clear the table array, as we no longer need it
		return contents;
	}

	function tooltip_show($event) {
		$e = $($event.target);
		if($e.length < 1)
			return;
		$e.addClass('mvc-show');
	}
	function tooltip_hide($event) {
		$e = $($event.target);
		if($e.length < 1)
			return;
		$e.removeClass('mvc-show');
	}

	window.loadTable = loadTable;
	window.loadGraph = makeData;
	window.loadRecnt = getPoint;
	window.download  = getCSV;
}