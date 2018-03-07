(function() {
	function addZero(val) {
		if(9 < val)
			return "" + val;
		return "0" + val;
	}
	function dayTotal(m, y) {
		if(m === 1)
			return (y % 4? 28:29);//return 28 (29 if year is divisible by 4 [leap year]) if month is February
		if([3, 5, 8, 10].indexOf(m)+1)
			return 30;//return 30 if month is one of April, June, September, or November
		return 31;//otherwise return 31
	}

	Date.dateStr = function(date) {
		return (new Date(date)).dateStr();
	}
	Date.prototype.dateStr = function() {
		var dateStr = this.getFullYear() + "-" + addZero(this.getMonth() + 1) + "-" + addZero(this.getDate());
		var timeStr = addZero(this.getHours()) + ":" + addZero(this.getMinutes()) + ":" + addZero(this.getSeconds());
		return [dateStr, timeStr];
	}

	Date.nYears = function(n) {
		return (new Date('1970/01/01 00:00:00')).nYears(n)//new Date((1970+n) + '/01/01 00:00:00');
	}
	Date.prototype.nYears = function(n) {
		return new Date((new Date((1970+n) + '/01/01')).valueOfGMT() + this.valueOf());
	}

	Date.nMonths = function(n) {
		return (new Date('1970/01/01 00:00:00')).nMonths(n)//new Date((1970+n) + '/01/01 00:00:00');
	}
	Date.prototype.nMonths = function(n) {
		if(n === 0)
			return this;
		if(n < 0)
			return this.nYears(-1).nMonths(12+n);
		return new Date(this.nYears(Math.floor(n/12)).valueOfGMT() + (new Date('1970/' + addZero(1 + (n%12)) + '/01')).valueOf());
	}

	Date.nDays = function(n) {
		return (new Date('1970/01/01 00:00:00')).nDays(n)//new Date((1970+n) + '/01/01 00:00:00');
	}
	Date.prototype.nDays = function(n) {
		if(n === 0)
			return this;
		if(n < 0)
			return this.nMonths(-1).nDays(n + 31);
		if(31 < n+1)
			return this.nMonths(1).nDays(n - 31);
		return new Date((new Date('1970/01/' + addZero(1 + n))).valueOfGMT() + this.valueOf());
	}

	Date.prototype.valueOfGMT = function() {
		return this.valueOf() - (new Date('1970/01/01 00:00:00')).valueOf();
	}

	Date.formatStr = function(date) {
		return (new Date(date)).formatStr();
	}
	Date.prototype.formatStr = function() {
		var year = this.getFullYear();
		var day = this.getDate();
		var month = ([
			"Jan",
			"Feb",
			"Mar",
			"Apr",//3
			"May",
			"Jun",//5
			"Jul",
			"Aug",
			"Sep",//8
			"Oct",
			"Nov",//10
			"Dec"
		][this.getMonth()]);

		return month + " " + day + ", " + year;
	}

	/**
	 * Replaces *ALL* instances of a given substring with a given string.  JavaScript should really provide this by default...
	**/
	String.prototype.replace_ = function(sub, str) {
		return this.split(sub).join(str);
	}
})()

function init(table_id, chart_id) {
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
		function getTooltip() {
			switch(this.getUnits()) {
				case 'cms':
				case 'm\xB3/s':
					return "cubic meters per second";
				case 'MASL':
				case 'm':
					return "Meters Above Sea Level";
				case 'mm':
					return "millimeters";
				default:
					return "1.5 metric units of 'someone screwed this up'"//This should not ever be returned; if it is returned, someone used an invalid unit
			}
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
			const day_02 = new Date('1970/01/03');//UNIX time value for  2  days
			const year02 = new Date('1972/01/01');//UNIX time value for  2 years
			const year06 = new Date('1976/01/01');//UNIX time value for  6 years
			const year26 = new Date('1996/01/01');//UNIX time value for 26 years
			const year62 = new Date('2032/01/01');//UNIX time value for 62 years

			if(start === undefined || end === undefined)
				return full;

			var diff = (new Date(end)) - (new Date(start));//difference b/w 2 dates
			if(0 <= (diff - year62))
				return monthly;//yearly;
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

		function toString() {
			return this.getName() + " (" + this.getUnits() + ")"
		}

		/* 
		 * Fill in null parameters with the next largest interval
		 */
		(function() {
			if(monthly === null)
				monthly = yearly;
			if(weekly === null)
				weekly = monthly;
			if(daily === null)
				daily = weekly;
			if(hourly === null)
				hourly = daily;
			if(full === null)
				full = hourly;
		})();

		/* 
		 * Fill in undefined parameters with the next smallest interval
		 */
		(function() {
			if(hourly === undefined)
				hourly = full;
			if(daily === undefined)
				daily = hourly;
			if(weekly === undefined)
				weekly = daily;
			if(monthly === undefined)
				monthly = weekly;
			if(yearly === undefined)
				yearly = monthly;
		})();

		this.getName = getName;
		this.getUnits = getUnits;
		this.getTooltip = getTooltip;
		this.getTsId = getTsId;
		this.toString = toString;
	};

	var Range = (function() {
		function Range(low, high, tsName) {
			this.tsName = tsName
			this.low = {
				name: low,
				data: null,
			};
			this.high = {
				name: high,
				data: null,
			};
		}

		Range.prototype.getName = function() {
			return this.tsName;
		}
		Range.prototype.getLow = function() {
			return this.low.name;
		}
		Range.prototype.getHigh = function() {
			return this.high.name;
		}

		Range.prototype.isLow = function(tsName) {
			return (this.low.name === tsName && this.low.data === null);
		}
		Range.prototype.isHigh = function(tsName) {
			return (this.high.name === tsName && this.high.data === null);
		}

		Range.prototype.addData = function(dat, tsName) {
			if(this.isLow(tsName))
				this.low.data = dat;
			if(this.isHigh(tsName))
				this.high.data = dat;
			return this;
		}
		Range.prototype.combineData = function() {
			if(this.low.data === null || this.high.data === null)
				return;
			var out = [];
			for(let i = 0; i < this.high.data.length; i++) {
				let timestamp = this.high.data[i][0];
				for(let j = 0; j < this.low.data.length; j++) {
					if(this.low.data[j][0] < timestamp)
						continue;
					if(timestamp < this.low.data[j][0])
						break;
					out.push([timestamp, this.low.data[j][1], this.high.data[i][1]]);
					break;
				}
			}

			return out;
		}

		Range.prototype.useData = function(dat, name, func) {
			var temp = this.addData(dat, name).combineData();
			if(!temp)
				return this;
			this.low.data = null;
			this.high.data = null;
			func(temp, this.tsName);
			return this;
		}

		Range.prototype.reset = function() {
			this.low.data = null;
			this.high.data = null;
			return this;
		}

		return Range
	})()

	/**
	 * 
	**/
	function Station(id) {
		var series = {};//timeseries
		var ranges = {};//ranges
		var primary = "";//primary timeseries
		var links = {};//linked stations

		function getId() {
			return id;
		}

		/**
		 * This function gets the columns of the station in an order specified by the value's priority
		**/
		function getOrderedSeries() {
			var cols = [];
			for(var ts in series)
				cols.push(ts);
			return cols.sort(function(a, b) {
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
		function getOrderedRanges() {
			var list = [];
			for(var rng in ranges)
				list.push(rng);
			return list.sort(function(a, b) {
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
		 * This function returns a given column's priority.  Higher priority number means column is placed further
		 * to the left side of the table.
		 * 
		 * @param val	- tsName for the column to get the priority of
		 * 
		 * @return	- various integer values that depend on the given val parameter
		**/
		function priority(val, no_range) {
			if(val === primary)
				return 9001;//IT'S OVER NINE THOUSAAAAAAAAAAAND!!!  (WHAT?!  NINE THOUSAND?!)
			switch(val) {
				case 'Flow':
				case 'Level':
					return 30;
				case 'Historical Average':
				case 'Historical Maximum':
				case 'Historical Minimum':
				case 'Historical Range':
					return 20;
				case 'Precipitation':
					return 10;
				default:
					return -1;
			}
		}

		function getTimeSeries(name, sql) {
			if(name === undefined)
				return getTimeSeries(primary, sql);
			if(links[series[name]] !== undefined)
				return links[series[name]].getTimeSeries(name, sql);
			if(sql)
				return getId();
			return series[name];
		}
		function getRange(name) {
			return ranges[name];
		}

		/**
		 * 
		**/
		function addTs(ts, is_primary) {
			if(series[ts.getName()] !== undefined)
				return this;//cannot have 2 timeseries under the same name at one station
			if(is_primary)
				primary = ts.getName();
			series[ts.getName()] = ts;
			return this;//for chaining operations
		}
		function addRng(range) {
			if(this.getTimeSeries(range.getLow()) === undefined || this.getTimeSeries(range.getHigh()) === undefined) {
				console.error('ERROR: the given range *must* have a matching low *and* a matching high timeseries name.');
				return this;
			}
			if(ranges[range.getName()] !== undefined)
				return this;
			ranges[range.getName()] = range;
			return this;
		}

		/**
		 * 
		**/
		function link(station, name) {
			if(series[name] !== undefined)
				return this;//cannot have 2 timeseries under the same name at one station
			if(links[station.getId()] === undefined)
				links[station.getId()] = station;//Only add the station to the links if it is not already there
			series[name] = station.getId();
			return this;//for chaining operations
		}

		/**
		 * 
		**/
		function toString() {
			var out = this.getId() + "\n";
			for(var str in series)
				out += "\t>" + this.getTimeSeries(str).toString() + "\n";
			return out;
		}

		this.getId = getId;

		this.getOrderedSeries = getOrderedSeries;
		this.getOrderedRanges = getOrderedRanges;
		this.getTimeSeries = getTimeSeries;
		this.getRange = getRange;

		this.addTs = addTs;
		this.addRng = addRng;// = Math.random...wait...
		this.link = link;

		this.toString = toString;
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

		function toString() {
			var out = "";
			for(var str in list)
				out += this.get(str).toString() + "\n";
			return out;
		}

		this.add = add;
		this.get = get;
		this.toString = toString;
	}

	/**
	 * 
	**/
	var DataDisplay = (function() {
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
		function loadFromKiWIS(tsName, start, end, format, func, err) {
			if(err === undefined)
				err = function() {};
			if(end < start)
				return this.loadFromKiWIS(tsName, end, start, format, func, err);

			/* 
			 * These 2 variables are combined with the timeseries id to form the KiWIS URL from which data is retrieved
			 */
			var prefix = "http://waterdata.quinteconservation.ca/KiWIS/KiWIS?service=kisters&type=queryServices&request=getTimeseriesValues&datasource=0&format=" + format + "&ts_id=";
			var suffix = "&header=true&metadata=true&md_returnfields=station_name,parametertype_name&dateformat=UNIX";
			if(start !== null)
				suffix += "&from=" + start;
			if(end !== null)
				suffix += "&to=" + end;

			this.numData++;//Keep track of how many times makeDataByYear is called in order to properly show/hide 'loading...' text
			$.ajax({
				dataType: (format === 'csv'? "text" : format),
				url: prefix + this.getId(tsName, start, end) + suffix,
				success: $.proxy(function(res) {
					this.numData--;//reduce numData now that the request has returned
					$.proxy(func, this)(res);
					try {
						if(footerPos !== undefined)
							footerPos();//reposition the footer once the request has finished
					} catch(ex) {}
				}, this),
				error: $.proxy(function(res) {
					this.numData--;//reduce numData so as to not cause problems
					err(res, func);
				}, this)
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
			return $.proxy(function(err, func) {
				var url = "sql-data/?ts_id=" + tsId + "&col=" + tsName;
				if(start !== null)
					url += "&from=" + start;
				if(end !== null)
					url += "&to=" + end;

				$('#alert-msg').removeClass('disabled');//alert the user that the displayed data is from the sql database and may not be the most recent data

				this.numData++;
				$.ajax({
					dataType: (format === 'csv'? "text" : format),
					url: url,
					success: $.proxy(function(res) {
						/* 
						 * format the response to be in the same format as the response given by KiWIS
						 */
						var response = [
							{
								"data": []
							}
						];
						for(var i = 0; i < res.Date.length; i++)
							response[0].data.push([(new Date(res.Date[i].replace_('-', '/') + " " + res.Time[i])).valueOf(), res.Data[i]]);
						this.numData--;
						$.proxy(func, this)(response);
						try {
							if(undefined !== footerPos)
								footerPos();
						} catch(ex) {}
					}, this),
					error: $.proxy(function(res) {
						this.numData--;
					}, this)
				});
			}, this);
		}

		function finished() {
			if(this.numData < 0)
				this.numData = 0;//Just in case this ever happens
			return !(0 < this.numData)
		}

		function load(start, end) {
			if(!(this.finished()))
				return console.error('Previous request not completed');
			if(end === "")
				end = today;
			if(start === "")
				start = Date.dateStr((new Date(end.replace_('-', '/') + ' 00:00:00')).nMonths(-3)/*.setMonth((new Date(end + ' 00:00:00')).getMonth() - 3)*/)[0];
			var params = this.gauge.getOrderedSeries();

			var data = [];
			for(var i = 0; i < params.length; i++)
				data[i] = null;

			this.createDisplay();

			for(var i = 0; i < params.length; i++) {
				$.proxy(function(tsName, i) {
					this.loadFromKiWIS(tsName, start, end, 'json', $.proxy(function(response) {
						data[i] = this.formatData(response[0].data, tsName);

						if(!(this.finished()))
							return;//stop here until all responses are received
						for(var j = 0; j < data.length; j++)
							this.appendData(data[j], j)
						this.display();
					}, this), this.loadFromSql(this.gauge.getTimeSeries(tsName, true), tsName, start, end, 'json'));
				}, this)(params[i], i);
			}
		}

		function reload(start, end) {
			var params = this.gauge.getOrderedSeries();//get the column list for the tsNames

			displayLoad();

			for(let i = 0; i < params.length; i++) {
				$.proxy(function(tsName, i) {
					this.loadFromKiWIS(tsName, start, end, 'json', function(response) {
						this.refresh(response[0].data, tsName);

						if(!this.finished())
							return;//stop here if this is not the last response
						this.display(true);
					}, this.loadFromSql(this.gauge.getId(), tsName, start, end, 'json'));
				}, this)(params[i], i);
			}
		}

		function createDisplay() {}

		function getId(tsName, start, end) {
			return this.gauge.getTimeSeries(tsName).getTsId(start, end);
		}

		function formatData(dat, tsName) {
			return dat;
		}

		function appendData(dat, i) {}

		function display(is_reload) {}

		function displayLoad() {}

		function refresh(dat, tsName) {}

		function DataDisplay(gauge, container) {
			this.data = [];
			this.gauge = gauge;
			this.container = container;
			this.finished = finished;
			this.numData = 0;

			this.loadFromKiWIS = loadFromKiWIS;
			this.loadFromSql = loadFromSql;
		}


		DataDisplay.prototype.load = load;
		DataDisplay.prototype.reload = reload;
		DataDisplay.prototype.getId = getId;

		DataDisplay.prototype.createDisplay = createDisplay;
		DataDisplay.prototype.formatData = formatData;
		DataDisplay.prototype.appendData = appendData;

		DataDisplay.prototype.displayLoad = displayLoad;
		DataDisplay.prototype.refresh = refresh;

		DataDisplay.prototype.display = display;

		return DataDisplay
	})()

	/**
	 * 
	**/
	var GraphDisplay = (function() {
		var tempDat = null;

		function load(start, end) {
			if(end === "")
				end = today;
			if(start === "")
				start = Date.dateStr((new Date(end.replace_('-', '/') + ' 00:00:00')).nMonths(-3)/*.setMonth((new Date(end + ' 00:00:00')).getMonth() - 3)*/)[0];
			this.start = start.replace_('-', '/');
			this.end = end.replace_('-', '/');
			DataDisplay.prototype.load.call(this, first, today);
		}
		function reload(start, end) {
			if(this.chart === null)
				return;
			DataDisplay.prototype.reload.call(this, start, end);
		}

		/**
		 * This function creates the Highstock chart.
		**/
		function createDisplay() {
			var cols = this.gauge.getOrderedSeries();

			/* 
			 * Create the Highstock chart.  Go to the Highstock section of Highcharts's website for more information 
			 * on chart options
			 */
			var options = {
				chart: {
					renderTo: this.container,
					//inverted: true,
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
				responsive: {
					rules: [{
						condition: {
							maxWidth: 425,
							maxHeight: 425,
						},
						chartOptions: {
							rangeSelector: {
								enabled: false,
							},
						},
					}],
				},
				xAxis: {
					events: {
						afterSetExtremes: $.proxy(this.selectRange, this),
					},//*/
					max: (new Date(today.replace_('-', '/'))).valueOf(),
					//min: (new Date(first.replace_('-', '/'))).valueOf(),
					ordinal: false
				},
				yAxis: [
					{ // Primary yAxis
						labels: {
							format: "{value} " + this.gauge.getTimeSeries().getUnits(),
							style: {
								color: Highcharts.getOptions().colors[cols.indexOf(this.gauge.getTimeSeries().getName())]
							}
						},
						title: {
							text: this.gauge.getTimeSeries().toString(),
							style: {
								color: Highcharts.getOptions().colors[cols.indexOf(this.gauge.getTimeSeries().getName())]
							}
						},
						opposite: false,
						floor: 0,
					},
				],
				tooltip: {valueDecimals: 2,shared: true}
			};

			primary_flow = this.gauge.getTimeSeries().getName() === "Flow";

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

			if(-1 < cols.indexOf('Flow') && -1 < cols.indexOf('Level')) {
				options.yAxis.push({
					title: {
						text: primary_flow? "Level (MASL)" : "Flow (m\xB3/s)",
						style: {
							color: Highcharts.getOptions().colors[cols.indexOf(primary_flow? 'Level' : 'Flow')]
						}
					},
					labels: {
						format: "{value}" + (primary_flow? " (MASL)" : " (m\xB3/s)"),
						style: {
							color: Highcharts.getOptions().colors[cols.indexOf(primary_flow? 'Level' : 'Flow')]
						}
					},
					opposite: false,
				})
			}

			this.chart = new Highcharts.StockChart(options);
			this.chart.showLoading();

			var rngs = this.gauge.getOrderedRanges();
			for(let i = 0; i < rngs.length; i++) {
				this.gauge.getRange(rngs[i]).reset();
			}
		}
		function selectRange(event) {
			this.reload(Date.dateStr(event.min)[0], Date.dateStr(event.max)[0]);//update the chart data
		}

		/**
		 * This function creates a Highstock series from an http response
		 * 
		 * @param dat		- pointer to KVP parent object
		 * @param tsName	- the name of the measurement that the series will represent
		 * 
		 * @return	- the newly created series
		 
		**/
		function formatData(dat, tsName) {
			var cols = this.gauge.getOrderedSeries();
			var units = this.gauge.getTimeSeries(tsName) !== undefined? this.gauge.getTimeSeries(tsName).getUnits() : this.gauge.getTimeSeries().getUnits();

			//populate the series for the chart (type and tooltip default to their values for flow rate)
			var singleSeries = {
				_colorIndex: cols.indexOf(tsName) % 10,
				_symbolIndex: 0,//cols.indexOf(tsName),
				connectNulls: true,
				name: tsName,//Can also extract name directly from query
				data: dat,
				type: "spline",//Both flow rate and water level use line charts
				yAxis: 0,
				tooltip: {
					valueSuffix: " " + units,
				},
				dataGrouping: {
					smoothed: true,//put point in the center of a group to avoid shifting data to the left
					units: [
						[
							'millisecond', // unit name
							[1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
						],
						[
							'second',
							[1, 2, 5, 10, 15, 30]
						],
						[
							'minute',
							[1, 2, 5, 10, 15, 30]
						],
						[
							'hour',
							[1, 2, 3, 4, 6, 8, 12]
						],
						[
							'day',
							[1]
						],
						[
							'week',
							[1]
						],
						[
							'month',
							[1, 3, 6]
						],
						/*[
							'year',
							null
						]*/
					],
				},
			};

			if(tsName === this.gauge.getTimeSeries().getName())
				singleSeries.showInNavigator = true;
			if(units !== this.gauge.getTimeSeries().getUnits())
				singleSeries.yAxis = 1 + (-1 < cols.indexOf('Precipitation')? 1 : 0);

			if(tsName === "Historical Maximum")
				singleSeries.dataGrouping.approximation = "high";
			if(tsName === "Historical Minimum")
				singleSeries.dataGrouping.approximation = "low";
			if(tsName === "Historical Range") {
				singleSeries.type = "areasplinerange";
				singleSeries.color = '#D0D0D0';
				singleSeries.lineWidth = 2;
				singleSeries.zIndex = -2;
			}
			if(tsName === "Target Range") {
				singleSeries.type = "areasplinerange";
				singleSeries.color = '#B0B0B0'
				singleSeries.zIndex = -1
			}
			if(tsName === "Precipitation") {
				singleSeries.type = "column";//Precipitation uses a bar chart, instead of a line chart
				singleSeries.yAxis = 1;
			}
			
			return singleSeries;
		}

		function appendData(dat, i) {
			var rngs = this.gauge.getOrderedRanges();
			var tsName = i < 0? this.gauge.getOrderedRanges()[-(i+1)] : this.gauge.getOrderedSeries()[i];

			if(rngs.length === 0)
				return this.chart.addSeries(dat, false);
			for(let j = 0; j < rngs.length; j++)
			{
				if(tsName === this.gauge.getRange(rngs[j]).getLow())
					break;
				if(tsName === this.gauge.getRange(rngs[j]).getHigh())
					break;
				if(j + 1 < rngs.length)
					continue;
				this.chart.addSeries(dat, false);
				break;
			}

			var appendRange = $.proxy(function(dat, rngName) {
				let temp = this.formatData(dat, rngName);
				if(temp === undefined)
					return;
				this.appendData(temp, -(rngs.indexOf(rngName)+1));
			}, this);
			for(let j = 0; j < rngs.length; j++) {
				this.gauge.getRange(rngs[j]).useData(dat.data, tsName, appendRange);
			}
		}

		function displayLoad() {
			this.chart.showLoading();
			var rngs = this.gauge.getOrderedRanges();
			for(let i = 0; i < rngs.length; i++) {
				this.gauge.getRange(rngs[i]).reset();
			}
		}

		function refresh(dat, tsName) {
			var series = null;

			var refreshRange = $.proxy(function(dat, rngName) {
				this.refresh(dat, rngName);
			}, this);

			var rngs = this.gauge.getOrderedRanges();
			for(let i = 0; i < rngs.length; i++) {
				this.gauge.getRange(rngs[i]).useData(dat, tsName, refreshRange);
			}

			for(var j = 0; j < this.chart.series.length; j++) {
				if(this.chart.series[j].name !== tsName)
					continue;//skip this iteration if the jth series is not the one we're updating
				series = this.chart.series[j];//set series to the jth series
			}

			if(series === null && !this.finished())
				return;//stop without doing anything if series is still null and this is not the last response
			if(series === null)
				return this.chart.hideLoading();//hide loading and stop here if series is still null
			series.setData(dat, false);//update the series's data
		}

		function display(is_reload) {
			if(!is_reload)
				this.chart.xAxis[0].setExtremes((new Date(this.start)).valueOfGMT(), (new Date(this.end)).valueOfGMT(), false);
			this.chart.hideLoading();//hide the loading display
			this.chart.redraw();//update the chart's display
			if(!is_reload)
				$('#chart-info').removeClass('disabled');//display the units of measurement legend
			tempDat = null;
		}

		function GraphDisplay(gauge, container) {
			DataDisplay.call(this, gauge, container);
			this.chart = null;
			this.selectRange = selectRange;
		}


		GraphDisplay.prototype = Object.create(DataDisplay.prototype);
		GraphDisplay.prototype.constructor = GraphDisplay;

		GraphDisplay.prototype.load = load;
		GraphDisplay.prototype.reload = reload;

		GraphDisplay.prototype.createDisplay = createDisplay;
		GraphDisplay.prototype.formatData = formatData;
		GraphDisplay.prototype.appendData = appendData;

		GraphDisplay.prototype.displayLoad = displayLoad;
		GraphDisplay.prototype.refresh = refresh;

		GraphDisplay.prototype.display = display;//*/


		return GraphDisplay;
	})()

	/**
	 * 
	**/
	var TableDisplay = (function() {

		function createDisplay() {
			$('.mvc-tooltip').unbind('click', tooltip_show);
			$('.mvc-tooltip').unbind('mouseout', tooltip_hide);
			$('#' + this.container)[0].innerHTML = "<h3>Now Loading...</h3>";
		}

		function appendData(dat, j) {
			var tsName = this.gauge.getOrderedSeries()[j];
			for(var i = 0; i < dat.length; i++) {
				if(this.data[dat[i][0]] === undefined)
					this.data[dat[i][0]] = this.getTemplate();//Add this row to the table if no row with this timestamp exists
				var timestamp = new Date(dat[i][0]);//get the timestamp
				var row = this.data[dat[i][0]];//get the actual data

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
				row[tsName] = dat[i][1];//add the data for this tsName's column
				this.data[dat[i][0]] = row;//set the row at this timestamp
			}
		}
		function getTemplate() {
			var cols = this.gauge.getOrderedSeries();
			var template = {
				'Date': null,
				'Time': null,
			};

			for(var i = 0; i < cols.length; i++)
				template[cols[i]] = null;//add the station's columns to the template
			return template;
		}

		function display() {
			var $table = $('#' + this.container);
			$table[0].innerHTML = "<style>"
									+ this.setStyles()
								+ "</style>"
								+ "<table class=\"data-table\">"
									+ this.makeTable()
								+ "</table>";//create the table
			$('.mvc-tooltip').bind('click', null, tooltip_show);
			$('.mvc-tooltip').bind('mouseout', null, tooltip_hide);
			$('#table-title').removeClass('disabled');//display the table's title
		}

		function makeTable() {
			var html = "";
			var cols = [];

			var keys = []
			for(var k in this.data)
				keys.push(k);
			keys.sort(function(a, b) {
				//> 1 means b goes before a
				//> 0 means do nothing
				//>-1 means a goes before b
				let compare = function(a, b) {
					if(a < b)
						return -1;
					if(b < a)
						return 1;
					return 0;
				}
				return compare(parseInt(a), parseInt(b));
			});

			for(var k = 0; k < keys.length; k++) {
				if(keys[k] === undefined)
					continue;
				/* 
				 * if the column headers haven't been added, add them
				 */
				if(cols.length === 0) {
					cols = ["Date", "Time"].concat(this.gauge.getOrderedSeries());
					html += this.setHeaders(cols);
				}
				html += this.buildRow(this.data[keys[k]], cols);
			}
			this.data = [];//clear the table array, as we no longer need it
			return html;
		}

		function setStyles() {
			var css = "";
			var cols = this.gauge.getOrderedSeries();

			for(let i = 0; i < cols.length; i++) {
				css += "#" + this.container + ".mvc-hide-" + cols[i].replace_(' ', '-') + " ." + cols[i].replace_(' ', '-') + "\
				{\
					visibility: collapse;\
				}";
			}

			function subset(list, n) {
				if(n === 0)
					return [];
				var prev = subset(list, n-1);
				var next = [[list[n-1]]];
				for(let i = 0; i < prev.length; i++)
					next.push(prev[i].concat([list[n-1]]));
				return prev.concat(next);
			}

			let list = subset(cols, cols.length);
			for(let i = 0; i < list.length; i++) {
				if(list[i].length < 1)
					continue;
				for(let j = 0; j < list[i].length; j++) {
					css += ".mvc-hide-" + list[i][j].replace_(' ', '-');
				}
				css += " tr.mvc-row-" + list[i].join('-').replace_(' ', '-') + " {display: none;}\n";
			}

			return css;
		}

		function buildToggles() {
			var html = "";
			var cols = this.gauge.getOrderedSeries();

			for(let i = 0; i < cols.length; i++) {
				html += "<div class=\"mvc-column-toggle mvc-button\" data-target=\"" + cols[i].replace_(' ', '-') + "\">" + cols[i].replace_(' ', '-') + "</div>"
			}

			return html;
		}

		function setHeaders(cols) {
			var html = "";

			var getCell = $.proxy(function(col) {
				if(this.gauge.getTimeSeries(col) === undefined)
					return col;
				return (col + " ("
					+ "<p class=\"mvc-tooltip\" title=\"" + this.gauge.getTimeSeries(cols[i]).getTooltip() + "\">"
						+ this.gauge.getTimeSeries(cols[i]).getUnits()
						+ "<span class=\"mvc-tooltip-text\">"
							+ this.gauge.getTimeSeries(cols[i]).getTooltip()
						+ "</span>"
					+ "</p>"
				+ ")");
			}, this);
			var getAttr = $.proxy(function(col) {
				if(this.gauge.getTimeSeries(col) === undefined)
					return "";
				return " class=\"mvc-column-toggle mvc-button\" data-target =\"" + col.replace_(' ', '-') + "\""
			}, this);

			for(var i = 0; i < cols.length; i++) {
				html += ("<th" + getAttr(cols[i]) + ">"
						 + getCell(cols[i])
					 + "</th>");
			}
			return "<tr>" + html + "</tr>";
		}
		function buildRow(row, cols) {
			var html = "";
			var params = [];
			for(let i = 0; i < cols.length; i++) {
				let val = "";
				if(row[cols[i]] !== null) {
					val = row[cols[i]];
					if(cols[i] !== "Date" && cols[i] !== "Time")
						params.push(cols[i]);
				}
				html += "<td class=\"" + cols[i].replace_(' ', '-') + "\">" + val + "</td>";//Add the data to the row
			}
			return "<tr class=\"mvc-row-" + params.join('-').replace_(' ', '-') + "\">" + html + "</tr>";
		}

		function TableDisplay(gauge, container) {
			DataDisplay.call(this, gauge, container);

			this.getTemplate = getTemplate;
		}


		TableDisplay.prototype= Object.create(DataDisplay.prototype);
		TableDisplay.prototype.constructor = TableDisplay;

		TableDisplay.prototype.createDisplay = createDisplay;
		TableDisplay.prototype.appendData = appendData;

		TableDisplay.prototype.display = display;

		TableDisplay.prototype.makeTable = makeTable;
		TableDisplay.prototype.setStyles = setStyles;
		TableDisplay.prototype.buildToggles = buildToggles;
		TableDisplay.prototype.setHeaders = setHeaders;
		TableDisplay.prototype.buildRow = buildRow;

		return TableDisplay;
	})()

	/**
	 * 
	**/
	var CSVDownload = (function() {
		function CSVDownload(gauge, container) {
			TableDisplay.call(this, gauge, container);
			$(this.container).attr('disabled', '')
		}

		function load(start, end) {
			if(end === "")
				end = today.replace_('-', '/');
			if(start === "")
				start = Date.dateStr((new Date(end + ' 00:00:00')).setMonth((new Date(end + ' 00:00:00')).getMonth() - 3))[0];
			this.start = start;
			this.end = end;
			DataDisplay.prototype.load.call(this, start, end);
		}

		function getId(tsName, start, end) {
			return DataDisplay.prototype.getId.call(this, tsName);
		}

		function display() {
			$(this.container).removeAttr('disabled');
			var csv = this.makeTable();//create the table
			var anchor = document.createElement('a');
			var dat = new Blob(['\ufeff', csv], { type: "text/csv" });
			var fileName = this.gauge.getId() + " Gauge Data - " + this.start + " to " + this.end + ".csv";
			if(window.navigator.msSaveBlob) {
				window.navigator.msSaveBlob(dat, fileName);
			}
			anchor.href = URL.createObjectURL(dat);
			anchor.download = fileName;
			anchor.click();
		}

		function setHeaders(cols) {
			var contents = "";

			for(var i = 0; i < cols.length; i++) {
				contents += cols[i];//add the tsName
				if(this.gauge.getTimeSeries(cols[i]) !== undefined)
					contents += (" (" + this.gauge.getTimeSeries(cols[i]).getUnits() + ")");//don't add a tooltip if the tsName has no units value
				contents += ",";
			}
			return contents + "\n";
		}
		function buildRow(row, cols) {
			var contents = "";
			for(var i = 0; i < cols.length; i++)
				contents += (row[cols[i]] !== null? row[cols[i]] : "") + ",";//Add the data to the row
			return contents + "\n";
		}


		CSVDownload.prototype= Object.create(TableDisplay.prototype);
		CSVDownload.prototype.constructor = CSVDownload;

		CSVDownload.prototype.load = load;
		CSVDownload.prototype.getId = getId;

		CSVDownload.prototype.createDisplay = DataDisplay.prototype.createDisplay;

		CSVDownload.prototype.display = display;

		CSVDownload.prototype.setHeaders = setHeaders;
		CSVDownload.prototype.buildRow = buildRow;

		return CSVDownload;
	})()

	/**
	 * 
	**/
	var RecntDisplay = (function() {
		function RecntDisplay(gauge, container, max_range) {
			DataDisplay.call(this, gauge, container);
			this.date = new Date(0);
			this.max_range = max_range;
		}

		RecntDisplay.prototype = Object.create(DataDisplay.prototype);
		RecntDisplay.prototype.constructor = RecntDisplay;

		RecntDisplay.prototype.load = function(f) {
			DataDisplay.prototype.load.call(this, null, null);
		}

		RecntDisplay.prototype.createDisplay = function() {
			$(this.container).removeClass('mvc-red');
		}

		RecntDisplay.prototype.formatData = function(dat, tsName) {
			return dat[0];
		}
		RecntDisplay.prototype.appendData = function(dat, j) {
			if(j !== 0)
				return;
			this.date = new Date(dat[0]);//store the most recent day
		}

		RecntDisplay.prototype.display = function() {
			$(this.container).removeClass('mvc-loading');
			if(((new Date()) - this.date) - this.max_range <= 0)
				return;
			$(this.container).addClass('mvc-red');
		}

		return RecntDisplay;
	})()

	/**
	 * 
	**/
	var RecentData = (function() {
		function RecentData(gauge, container_1, container_2, max_range) {
			RecntDisplay.call(this, gauge, [container_1, container_2].join(','), max_range);
			this.station_popup = container_2;
		}

		RecentData.prototype = Object.create(RecntDisplay.prototype);
		RecentData.prototype.constructor = RecentData;

		RecentData.prototype.createDisplay = function() {
			$('.mvc-tooltip').unbind('click', tooltip_show);
			$('.mvc-tooltip').unbind('mouseout', tooltip_hide);
			RecntDisplay.prototype.createDisplay.call(this);
		}

		RecentData.prototype.formatData = function(dat, tsName) {
			if(-1 < tsName.indexOf('Historical'))
				return null;
			return RecntDisplay.prototype.formatData.call(this, dat, tsName);
		}

		RecentData.prototype.appendData = function(dat, i) {
			this.data[i] = "";
			RecntDisplay.prototype.appendData.call(this, dat, i)
			if(dat === null)
				return;
			var cols = this.gauge.getOrderedSeries();

			this.data[i] = ("<span class=\"station-popup-data\">"
			 + cols[i] + ": " + (dat[1] !== null? dat[1] : "---") + " "
			 + "<span class=\"mvc-tooltip\" title=\"" + this.gauge.getTimeSeries(cols[i]).getTooltip() + "\">"
			 + this.gauge.getTimeSeries(cols[i]).getUnits()
			 + "<span class=\"mvc-tooltip-text\">"
			 + this.gauge.getTimeSeries(cols[i]).getTooltip()
			 + "</span>"
			 + "</span>"
			 + "</span>"
			 + "<br/>");
		}

		RecentData.prototype.display = function() {
			this.data.push("<br/><span class=\"station-popup-date\">" + this.date.dateStr().join('<br/>') + "</span>");
			$(this.container).find('.mvc-primary-data').prepend('<br/>' + this.data.join(''));
			RecntDisplay.prototype.display.call(this);
			this.data = [];
			$('.mvc-tooltip').bind('click', tooltip_show);
			$('.mvc-tooltip').bind('mouseout', tooltip_hide);
		}

		return RecentData;
	})()

	var today = (new Date()).dateStr()[0];
	var first = Date.dateStr('1918/01/01 00:00:00')[0];

	var gauges = new StationList();
	/* 
	 * Flow gauges
	 */
	{
		{(gauges.add(new Station('Appleton Flow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s', '38819042', '38692042', '3449042', '38694042', '38695042', '38696042'), true)
			.addTs(new TimeSeries('Historical Average', 'm\xB3/s', null, null, '38698042', '5959042', '38291042', '38293042'))
			.addTs(new TimeSeries('Historical Minimum', 'm\xB3/s', null, null, '38685042', '4581042', '4510042', '39306042'))
			.addTs(new TimeSeries('Historical Maximum', 'm\xB3/s', null, null, '38688042', '38689042', '38690042', '38691042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))
			.addTs(new TimeSeries('Precipitation', 'mm', null, '1439042', '1448042', '38821042', '8791042', '35870042'))
		)};
		{(gauges.add(new Station('Myers Cave Flow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s'), true)
			.addTs(new TimeSeries('Historical Average', 'm\xB3/s'))
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Buckshot Creek Flow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s'), true)
			.addTs(new TimeSeries('Historical Average', 'm\xB3/s'))
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Ferguson Falls Flow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s'), true)
			.addTs(new TimeSeries('Historical Average', 'm\xB3/s'))
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Gordon Rapids Flow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s'), true)
			.addTs(new TimeSeries('Historical Average', 'm\xB3/s'))
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Lanark Stream Flow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s'), true)
			.addTs(new TimeSeries('Historical Average', 'm\xB3/s'))
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Mill of Kintail Flow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s'), true)
			.addTs(new TimeSeries('Historical Average', 'm\xB3/s'))
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Kinburn Flow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s'), true)
			.addTs(new TimeSeries('Historical Average', 'm\xB3/s'))
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Bennett Lake Outflow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s'), true)
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Dalhousie Lk Outflow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s'), true)
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('High Falls Flow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s'), true)
		)};
	}

	/* 
	 * Lake gauges
	 */
	{
		{(gauges.add(new Station('Shabomeka Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Mazinaw Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Kashwakamak Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Farm Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
		)};
		{(gauges.add(new Station('Mississagagon Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Big Gull Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Crotch Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Palmerston Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Canonto Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Sharbot Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('Bennett Lake'))
			.link(gauges.get('Bennett Lake Outflow'), 'Flow')
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
			.link(gauges.get('Bennett Lake Outflow'), 'Precipitation')
		)};
		{(gauges.add(new Station('Dalhousie Lake'))
			.link(gauges.get('Dalhousie Lk Outflow'), 'Flow')
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
			.link(gauges.get('Dalhousie Lk Outflow'), 'Precipitation')
		)};
		{(gauges.add(new Station('Lanark'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Mississippi Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('C.P. Dam'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Carp River at Maple Grove'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Precipitation', 'mm'))
		)};
		{(gauges.add(new Station('High Falls'))
			.link(gauges.get('High Falls Flow'), 'Flow')
			.addTs(new TimeSeries('Level', 'MASL'), true)
		)};
		{(gauges.add(new Station('Carp River at Richardson')))};
		{(gauges.add(new Station('Poole Creek at Maple Grove')))};
		{(gauges.add(new Station('Widow Lake'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
	}

	/* 
	 * Staff gauges
	 */
	{
		{(gauges.add(new Station('Shabomeka Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Mazinaw Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Little Marble Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Mississagagon Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Kashwakamak Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Farm Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Ardoch Bridge (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
		)};
		{(gauges.add(new Station('Buckshot Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Malcolm Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Pine Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Big Gull Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Crotch Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('High Falls G.S. (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Mosque Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
		)};
		{(gauges.add(new Station('Palmerston Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Canonto Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Bennett Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Dalhousie Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Silver Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Widow Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Lanark Dam (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
		)};
		{(gauges.add(new Station('C.P. Dam (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Almonte Bridge (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Clayton Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Summit Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
		)};
		{(gauges.add(new Station('Lanark Bridge (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
		{(gauges.add(new Station('Sharbot Lake (weekly)'))
			.addTs(new TimeSeries('Level', 'MASL'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL'))
		)};
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

	window.loadGraph = function(tsId, start, end) {
		var graph_ = new GraphDisplay(gauges.get(tsId), chart_id);
		graph_.load(start, end);
	};
	window.loadTable = function(tsId, start, end) {
		var table_ = new TableDisplay(gauges.get(tsId), table_id);
		table_.load(start, end);
	};
	window.loadRecnt = function(tsId, container_1, container_2, range) {
		var temp = new RecentData(gauges.get(tsId), container_1, container_2, range);
		temp.load();
	}
	window.chckRecnt = function(tsId, container, range) {
		var temp = new RecntDisplay(gauges.get(tsId), container, range);
		temp.load();
	};
	window.download  = function(tsId, container, start, end) {
		var csv_ = new CSVDownload(gauges.get(tsId), container);
		csv_.load(start, end);
	};
}