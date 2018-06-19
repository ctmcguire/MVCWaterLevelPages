function init(table_id, chart_id) {
	/**
	 * 
	**/
	function TimeSeries(name, units, full, hourly, daily, weekly, monthly, yearly) {
		var domain = undefined

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
		function setDomain(id) {
			domain = id;
			return this;
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

			if(start === "domain" && end === undefined)
				return domain;
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
			domain = yearly
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
			domain = yearly
		})();

		this.getName = getName;
		this.getUnits = getUnits;
		this.getTooltip = getTooltip;
		this.setDomain = setDomain;
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
				case 'Staff Level':
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
						for(var i = 0; res.Date !== null && i < res.Date.length; i++) {
							if(res.Time[i][0] === " ")
								res.Time[i] = res.Time[i].substr(1)
							if(0 <= res.Time[i].indexOf('AM') || 0 <= res.Time[i].indexOf('PM')) {
								if(res.Time[i].indexOf(' AM') < 0 && res.Time[i].indexOf(' PM') < 0) {
									res.Time[i] = res.Time[i].replace('AM', ' AM')
									res.Time[i] = res.Time[i].replace('PM', ' PM')
								}
								if(parseInt(res.Time[i].substr(0,2)) < 1)
									res.Time[i] = '12' + res.Time[i].substr(2);
								if(12 < parseInt(res.Time[i].substr(0,2)))
									res.Time[i] = (parseInt(res.Time[i].substr(0,2)) - 12) + res.Time[i].substr(2);
							}
							timestamp = new Date(res.Date[i].replace_('-', '/') + " " + res.Time[i]);
							if(timestamp.getHours() !== timestamp.nUTC(-5).getHours())
								timestamp = timestamp.nHours(timestamp.getHours() - timestamp.nUTC(-5).getHours())
							response[0].data.push([timestamp.valueOf(), res.Data[i]]);
						}
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

		function getId(tsName, start, end) {
			if(this.loaded)
				return DataDisplay.prototype.getId.call(this, tsName, start, end)
			return this.gauge.getTimeSeries(tsName).getTsId('domain');
		}

		function load(start, end) {
			if(end === "")
				end = today;
			if(start === "")
				start = Date.dateStr((new Date(end.replace_('-', '/') + ' 00:00:00')).nMonths(-3)/*.setMonth((new Date(end + ' 00:00:00')).getMonth() - 3)*/)[0];
			this.loaded = false;
			this.start = start.replace_('-', '/');
			this.end = end.replace_('-', '/') + ' 23:59:59';
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
					className: 'mvc-chart-fixed'
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
				rangeSelector: {
					inputDateParser: function(value) {
						let delta = new Date(value.replace_('-', '/')).nUTC(-5);
						if(delta.dateStr()[0] !== value)
							return delta.nDays(1).valueOf();
						return new Date(value.replace_('-', '/')).valueOf();
					}
				},
				title: {
					text: $('#table-title')[0] !== undefined? $('#table-title')[0].innerHTML : "",
				},
				series: [],
				responsive: {
					rules: [],
				},
				xAxis: {
					events: {
						afterSetExtremes: $.proxy(this.selectRange, this),
					},//*/
					max: new Date(today.replace_('-', '/')).valueOf(),
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
				tooltip: {
					valueDecimals: 2,
					shared: true, 
					split: false,
				},
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
			$('input.highcharts-range-selector').datepicker('hide');
			this.start = event.min;
			this.end = event.max;
			console.log(event)
			this.reload(Date.dateStr(this.start)[0], Date.dateStr(this.end)[0]);//update the chart data
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
				zIndex: -cols.indexOf(tsName),
				tooltip: {
					valueSuffix: " " + units,
				},
				dataGrouping: {
					smoothed: true,//put point in the center of a group to avoid shifting data to the left
					units: [
						[
							'minute',
							[5, 15, 30]
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
				singleSeries.zIndex = -(cols.length + 2);
			}
			if(tsName === "Target Range") {
				singleSeries.type = "areasplinerange";
				singleSeries.color = '#B0B0B0';
				singleSeries.zIndex = -(cols.length + 1);
			}
			if(tsName === "Precipitation") {
				singleSeries.type = "column";//Precipitation uses a bar chart, instead of a line chart
				singleSeries.yAxis = 1;
			}
			if(tsName === "Staff Level") {
				singleSeries.marker = {
					enabled: true
				};
				singleSeries.lineWidth = 0;
				singleSeries.states = {
					hover: {
						lineWidthPlus: 0
					}
				};
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
				this.chart.xAxis[0].setExtremes((new Date(this.start)).valueOf(), (new Date(this.end)).valueOf(), false);
			if(!is_reload)
				this.loaded = true
			this.chart.hideLoading();//hide the loading display
			this.chart.redraw();//update the chart's display
			if(!is_reload)
				$('#chart-info').removeClass('disabled');//display the units of measurement legend
			$('input.highcharts-range-selector').datepicker();
			//$('input.mvc-range-selector.mvc-graph').datepicker();
			let chart = this.chart
			$('input.highcharts-range-selector').datepicker('option', 'onselect', function(dateText) {
					chart.xAxis[0].setExtremes(
						$('input.highcharts-range-selector:eq(0)').datepicker("getDate").nUTC().getTime(), 
						$('input.highcharts-range-selector:eq(1)').datepicker("getDate").nUTC().getTime()); 
					this.onchange();
				});
			$('input.mvc-range-selector.mvc-graph').datepicker('option', 'onSelect', function(dateText) {
				chart.xAxis[0].setExtremes(
					$('input.mvc-range-selector.mvc-graph:eq(0)').datepicker("getDate").nUTC().getTime(), 
					$('input.mvc-range-selector.mvc-graph:eq(1)').datepicker("getDate").nUTC().getTime()
				);
				this.value = dateText;
				$(this).trigger('blur');
			});
			tempDat = null;
		}

		function GraphDisplay(gauge, container) {
			DataDisplay.call(this, gauge, container);
			this.chart = null;
			this.selectRange = selectRange;
			this.start = undefined;
			this.end = undefined;
			this.loaded = false;
		}


		GraphDisplay.prototype = Object.create(DataDisplay.prototype);
		GraphDisplay.prototype.constructor = GraphDisplay;

		GraphDisplay.prototype.load = load;
		GraphDisplay.prototype.reload = reload;
		GraphDisplay.prototype.getId = getId;

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
				var timestamp = new Date(dat[i][0]).nUTC(-5);//get the timestamp
				var row = this.data[dat[i][0]];//get the actual data

				function getTimeVal(val) {
					return (9 < val? "" : "0") + val;
				}

				/* 
				 * Set the row's timestamp
				 */
				if(row['Date'] === null)
					row['Date'] = timestamp.dateStr()[0];
				if(row['Time'] === null)
					row['Time'] = timestamp.dateStr()[1];
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
			document.body.appendChild(anchor);
			anchor.style = "display: none;"
			var dat = new Blob(['\ufeff', csv], { type: "text/csv" });
			var fileName = this.gauge.getId() + " Gauge Data - " + this.start + " to " + this.end + ".csv";
			if(window.navigator.msSaveBlob) {
				window.navigator.msSaveBlob(dat, fileName);
			}
			anchor.href = URL.createObjectURL(dat);
			anchor.download = fileName;
			anchor.click();
			document.body.removeChild(anchor);
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
			this.date = new Date(0).nUTC(-5);
			this.max_range = max_range.nUTC(-5);
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
			if(dat === undefined)
				return;
			this.date = new Date(dat[0]);//store the most recent day
		}

		RecntDisplay.prototype.display = function() {
			$(this.container).removeClass('mvc-loading');
			if(((new Date()).nUTC(-5) - this.date) - this.max_range <= 0)
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
			this.data.push("<br/><span class=\"station-popup-date\">" + this.date.nUTC(-5).dateStr().join('<br/>') + "</span>");
			$(this.container).find('.mvc-primary-data').prepend('<br/>' + this.data.join(''));
			$(this.container.split(',')[1]).data('target', $(this.container.split(',')[0]).data('target'));
			$(this.container.split(',')[1]).data('mvc-gauge', $(this.container.split(',')[0]).data('mvc-gauge'));
			$(this.container.split(',')[1]).data('toggle', $(this.container.split(',')[0]).data('toggle'));
			$(this.container.split(',')[1])[0].dataset['toggle'] = $(this.container.split(',')[1]).data('toggle');
			$(this.container.split(',')[1])[0].dataset['target'] = $(this.container.split(',')[1]).data('target');
			RecntDisplay.prototype.display.call(this);
			this.data = [];
			//$('.mvc-tooltip').bind('click', tooltip_show);
			//$('.mvc-tooltip').bind('mouseout', tooltip_hide);
		}

		return RecentData;
	})()

	Highcharts.setOptions({
		global: {
			timezoneOffset: 5*60,
		},
	});

	var today = (new Date()).dateStr()[0];
	var first = Date.dateStr('1918/01/01 00:00:00')[0];

	var gauges = new StationList();
	/* 
	 * Flow gauges
	 */
	{
		{(gauges.add(new Station('Appleton Flow'))
			.addTs(new TimeSeries('Flow', 'm\xB3/s', '38819042', '38692042', '3449042', '38694042', '38695042', '38696042').setDomain('44136042'), true)
			.addTs(new TimeSeries('Historical Average', 'm\xB3/s', null, null, '38698042', '5959042', '38291042'))
			.addTs(new TimeSeries('Historical Minimum', 'm\xB3/s', null, null, '38685042', '4581042', '4510042'))
			.addTs(new TimeSeries('Historical Maximum', 'm\xB3/s', null, null, '38688042', '38689042', '38690042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))
			.addTs(new TimeSeries('Precipitation', 'mm', null, '1439042', '1448042', '38821042', '8791042', '44123042'))
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
			.addTs(new TimeSeries('Flow', 'm\xB3/s', '43812042', '43807042', '43790042', '43808042', '43809042', '43810042').setDomain('44149042'), true)
			.addTs(new TimeSeries('Historical Average', 'm\xB3/s', null, null, '43811042', '43793042' , '43796042'))
			.addTs(new TimeSeries('Historical Minimum', 'm\xB3/s', null, null, '43800042', '43792042', '43791042'))
			.addTs(new TimeSeries('Historical Maximum', 'm\xB3/s', null, null, '43803042', '43804042', '43805042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))
			.addTs(new TimeSeries('Precipitation', 'mm', null, '1443042', '44124042', '44125042', '44126042', '44127042'))
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
		{(gauges.add(new Station('Big Gull Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39429042', null, '39627042', '39628042', '39629042', '39630042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39631042', '39632042', '39633042', '39634042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39636042', '39637042', '39638042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39640042', '39641042', '39642042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Buckshot Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39474042', null, '39643042', '39644042', '39645042', '39646042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39647042', '39648042', '39649042', '39650042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, '39651042', '39652042', '39653042', '39654042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, '39655042', '39656042', '39657042', '39658042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Canonto Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39431042', null, '39659042', '39660042', '39661042', '39662042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39663042', '39664042', '39665042', '39666042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, '39667042', '39668042', '39669042', '39670042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, '39671042', '39672042', '39673042', '39674042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('C.P. Dam (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39433042', null, '39675042', '39676042', '39677042', '39678042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '41662042', '41663042', '39681042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39684042', '39685042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39688042', '39689042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Clayton Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39508042', null, '39691042', '39692042', '39693042', '39694042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39695042', '39696042', '39697042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, '39699042', '39700042', '39701042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, '39703042', '39704042', '39705042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Crotch Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39435042', null, '39707042', '39708042', '39709042', '39710042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39711042', '39712042', '39713042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39716042', '39717042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39720042', '39721042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Bennett Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39486042', null, '39727042', '39728042', '39729042', '39730042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39731042', '39732042', '39733042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39736042', '39737042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39740042', '39741042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Sharbot Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39487042', null, '39743042', '39744042', '39745042', '39746042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39747042', '39748042', '39749042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39752042', '39753042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39756042', '39757042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Kashwakamak Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39488042', null, '39759042', '39760042', '39761042', '39762042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39763042', '39764042', '39765042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39768042', '39769042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39772042', '39773042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Lanark Dam (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39503042', null, '39775042', '39776042', '39777042', '39778042'), true)
			/*.addTs(new TimeSeries('Historical Average', 'MASL', null, null, null, '39780042', '39781042'))
			.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39784042', '39785042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39788042', '39789042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Lanark Bridge (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39439042', null, '39791042', '39792042', '39793042', '39794042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39795042', '39796042', '39797042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39800042', '39801042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39804042', '39805042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Little Marble Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39454042', null, '39807042', '39808042', '39809042', '39810042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39811042', '39812042', '39813042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, '39815042', '39816042', '39817042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, '39819042', '39820042', '39821042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Malcolm Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39464042', null, '39823042', '39824042', '39825042', '39826042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39827042', '39828042', '39829042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, '39831042', '39832042', '39833042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, '39835042', '39836042', '39837042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Mazinaw Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39425042', null, '39611042', '39612042', '39613042', '39614042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39615042', '39616042', '39617042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39620042', '39621042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39624042', '39625042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Mississagagon Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39427042', null, '39839042', '39840042', '39841042', '39842042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39843042', '39844042', '39845042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, '39847042', '39848042', '39849042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, '39851042', '39852042', '39853042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Almonte Bridge (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39441042', null, '39855042', '39856042', '39857042', '39858042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39859042', '39860042', '39861042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, '39863042', '39864042', '39865042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, '39867042', '39868042', '39869042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Ardoch Bridge (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39459042', null, '39871042', '39872042', '39873042', '39874042'), true)
			/*.addTs(new TimeSeries('Historical Average', 'MASL', null, null, null, '39876042', '39877042'))
			.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39880042', '39881042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39884042', '39885042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('High Falls G.S. (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39479042', null, '39887042', '39888042', '39889042', '39890042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39891042', '39892042', '39893042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39896042', '39897042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39900042', '39901042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Dalhousie Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39443042', null, '39903042', '39904042', '39905042', '39906042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39907042', '39908042', '39909042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39912042', '39913042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39916042', '39917042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Farm Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39445042', null, '39919042', '39920042', '39921042', '39922042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39923042', '39924042', '39925042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39928042', '39929042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39932042', '39933042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Mosque Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39484042', null, '39935042', '39936042', '39937042', '39938042'), true)
			/*.addTs(new TimeSeries('Historical Average', 'MASL', null, null, null, '39940042', '39941042'))
			.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39944042', '39945042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39948042', '39949042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Palmerston Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39447042', null, '39951042', '39952042', '39953042', '39954042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39955042', '39956042', '39957042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39960042', '39961042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39964042', '39965042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Pine Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39469042', null, '39967042', '39968042', '39969042', '39970042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39971042', '39972042', '39973042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, '39975042', '39976042', '39977042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, '39979042', '39980042', '39981042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Shabomeka Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39509042', null, '39983042', '39984042', '39985042', '39986042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '39987042', '39988042', '39989042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '39992042', '39993042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '39996042', '39997042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Silver Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39498042', null, '39999042', '40000042', '40001042', '40002042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '40003042', '40004042', '40005042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '40008042', '40009042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '40012042', '40013042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Summit Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39493042', null, '40015042', '40016042', '40017042', '40018042'), true)
			/*.addTs(new TimeSeries('Historical Average', 'MASL', null, null, null, '40020042', '40021042'))
			.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, null, '40024042', '40025042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, null, '40028042', '40029042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
		)};
		{(gauges.add(new Station('Widow Lake (weekly)'))
			.addTs(new TimeSeries('Staff Level', 'MASL', '39510042', null, '40031042', '40032042', '40033042', '40034042'), true)
			.addTs(new TimeSeries('Historical Average', 'MASL', null, null, '40035042', '40036042', '40037042'))
			/*.addTs(new TimeSeries('Historical Minimum', 'MASL', null, null, '40039042', '40040042', '40041042'))
			.addTs(new TimeSeries('Historical Maximum', 'MASL', null, null, '40043042', '40044042', '40045042'))
			.addRng(new Range('Historical Minimum', 'Historical Maximum', 'Historical Range'))*/
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