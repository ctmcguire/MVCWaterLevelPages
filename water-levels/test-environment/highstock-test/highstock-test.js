var numData = 0;//Used for the loading message
var chart = null;//Highstock chart for this page

var table = [];//array that stores the table rows

var today = (function(){//This will return today's date as a string
	var temp = new Date();
	temp = temp.toISOString();
	return temp.substr(0, temp.indexOf('T'));
})();//This will set "today" to its string value
var first = "1900-01-01";//earliest data to load

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
	return {
		'13790042': {
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
					full: "38684042",
					hourly: "38684042",
					daily: "38684042",
					weekly: "38685042",
					monthly: "38686042",
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
			'primary': "Flow Rate"
		},
	}[url][param]
}

/**
 * This function gets the ts_id of the gauge based the size of the difference between the start and end dates
 * 
 * @param url		- the station's id
 * @param tsName	- the name of the measurement to get the ts_id of
 * @param start		- the start date of the data being retrieved; defaults to the value of first
 * @param end		- the end date of the data being retrieved; defaults to the value of today
 * 
 * @return	- the yearly ts_id, if the end date is at least 62 years after the start date
 * @return	- the monthly ts_id, if the end date is at least 26 years after the start date
 * @return	- the weekly ts_id, if the end date is at least 6 years after the start date
 * @return	- the daily ts_id, if the end date is at least 2 years after the start date
 * @return	- the hourly ts_id, if the end date is at least 2 days after the start date
 * @return	- the full ts_id, otherwise
**/
function getTSID(url, tsName, start=new Date(first), end=new Date(today)) {
	if(url === undefined || start === undefined)
		return url;

	const day_02 = new Date("1970-01-02");
	const year02 = new Date("1972-01-01");
	const year06 = new Date("1976-01-01");
	const year26 = new Date("1996-01-01");
	const year62 = new Date("2032-01-01");

	var ts_id = getTsInfo(url, "Ids")[tsName];

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
 * This function creates the Highstock chart.
 * 
 * @param tsId	- the station's id
 * @param gauge	- name of the station; defaults to "Mississippi River at Appleton" because this page doesn't 
 * 				yet support any other station (should probably default to something generic like 
 * 				"Station Name" once other stations are supported)
**/
function makeChart(tsId, gauge="Mississippi River at Appleton") {
	/* 
	 * Create the Highstock chart.  Go to the Highstock section of Highcharts's website for more information 
	 * on chart options
	 */
	chart = new Highcharts.StockChart({
		chart: {
			renderTo: "data-content",
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
			text: $('#table-title')[0].innerHTML,
		},
		series: [],
		xAxis: {
			events: {
				afterSetExtremes: selectRange,
			},//*/
			max: (new Date()).valueOf(),
			min: (new Date('1900-01-01')).valueOf(),
			ordinal: false
		},
		yAxis: [
			{ // Primary yAxis
				labels: {
					format: "{value} " + getTsInfo(tsId, 'Ids')[getTsInfo(tsId, 'primary')].units,
					style: {
						color: Highcharts.getOptions().colors[0]
					}
				},
				title: {
					text: getTsInfo(tsId, 'primary') + " (" + getTsInfo(tsId, 'Ids')[getTsInfo(tsId, 'primary')].units + ")",
					style: {
						color: Highcharts.getOptions().colors[0]
					}
				},
				opposite: false
			},
			{ // Secondary yAxis
				gridLineWidth: 0,
				title: {
					text: "Precipitation (mm)",
					style: {
						color: Highcharts.getOptions().colors[2]
					}
				},
				labels: {
					format: "{value} mm",
					style: {
						color: Highcharts.getOptions().colors[2]
					}
				},
				opposite: true
			}
		],
		tooltip: {valueDecimals: 2,shared: true}
	});

	chart.showLoading();
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
	if(start === null || start === undefined)
		return loadFromKiWIS(url, first, end, format, func, err);
	if(end === null || end === undefined)
		return loadFromKiWIS(url, start, today, format, func, err);
	if(end < start)
		return loadFromKiWIS(url, end, start, format, func, err);

	/* 
	 * These 2 variables are combined with url to form the KiWIS URL from which data is retrieved
	 */
	var prefix = "//waterdata.quinteconservation.ca/KiWIS/KiWIS?service=kisters&type=queryServices&request=getTimeseriesValues&datasource=0&format=" + format + "&ts_id=";
	var suffix = "&header=true&metadata=true&md_returnfields=station_name,parametertype_name&dateformat=UNIX&from=" + start + "&to=" + end;

	numData++;//Keep track of how many times makeDataByYear is called in order to properly show/hide 'loading...' text
	$.ajax({
		dataType: (format === 'csv'? "text" : format),
		url: prefix + url + suffix,
		success: function(res) {
			numData--;//reduce numData now that the request has returned
			func(res);
			if(footerPos !== undefined)
				footerPos();//reposition the footer once the request has finished
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
	if(start === null || start === undefined)
		return loadFromSql(tsId, tsName, first, end, format, func);//Call loadFromKiWIS with default start and end dates if not provided
	if(end === null || end === undefined)
		return loadFromSql(tsId, tsName, start, today, format, func);
	if(end < start)
		return loadFromSql(tsId, tsName, end, start, format, func);

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
		var url = "sql-data/?ts_id=" + tsId + "&col=" + tsName + "&from=" + start + "&to=" + end;

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
				if(footerPos !== undefined)
					footerPos();
			},
			error: function(res) {
				numData--;
			}
		});
	}
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
			valueSuffix: " " + getTsInfo(tsId, 'Ids')[tsName].units//flow rate is measured in cms, water level is measured in m, and precipitation is measured in mm
		},
	};

	if(tsName === getTsInfo(tsId, 'primary'))
		singleSeries.showInNavigator = true;

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
	var params = getOrderedCols(tsId);
	var series = []
	for(var i = 0; i < params.length; i++)
		series[i] = null;


	if(chart === null)
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
			}, loadFromSql(tsId, params[i], first, today, 'json'));
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
			}, loadFromSql(tsId, tsName, start, end, 'json'));
		})(params[i]);
	}
}

/**
 * This function calls updateData to update the chart's data when the data range changes
 * 
 * @param e	- the event that caused this function to execute
**/
function selectRange(e) {
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
	updateData('13790042', toYMD(e.min), toYMD(e.max));//update the chart data
}


/**
 * This function is responsible for creating the table version of this page
 * 
 * @param tsId	- the station's id
 * @param start	- the start date for the table's data
 * @param end	- the end date for the table's data
**/
function loadTable(tsId, start, end) {
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
			loadFromKiWIS(getTsInfo(tsId, 'Ids')[tsName].daily, start, end, 'json', function(response) {
				addRows(response[0].data, tsId, tsName);//add the rows from the data found in this response
				if(0 < numData)
					return;//stop here if this is not the last response
				document.getElementById('data-content').innerHTML = makeTable(tsId);//create the table
				setupHandlers();//Add event handlers for the table's tooltips
				$('#table-title').removeClass('disabled');//display the table's title
			}, loadFromSql(tsId, tsName, start, end, 'json'));
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

		/* 
		 * Set the row's timestamp
		 */
		if(row['Date'] === null)
			row['Date'] = timestamp.getFullYear() + "-" + (8 < timestamp.getMonth()? "" : "0") + (timestamp.getMonth()+1) + "-" + (9 < timestamp.getDate()? "" : "0") + timestamp.getDate();
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
 * This function sets up the event handlers
**/
function setupHandlers() {
	var tars = document.querySelectorAll('p.tooltip');
	for(var i = 0; i < tars.length; i++) {
		/**
		 * This function displays the tooltip for the target element
		 * 
		 * @param e	- event that triggered this function
		**/
		tars[i].onclick = function(e) {
			if(e.target === undefined)
				return;//exit if the event had no target
			var classes = e.target.classList;
			if(classes.contains('show'))
				return;//do nothing if the target element already has the show class
			classes.add('show');//add the show class
		};
		/**
		 * This function hides the tooltip for the target element
		 * 
		 * @param e	- event that triggered this function
		**/
		tars[i].onmouseout = function(e) {
			if(e.target === undefined)
				return;
			var classes = e.target.classList;
			if(!classes.contains('show'))
				return;
			classes.remove('show');
		};
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
	var html = '<table>';
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
			cols = ["Date"].concat(getOrderedCols(tsId));

			html += '<tr>';
			for(var i = 0; i < cols.length; i++) {
				html += '<th>' + cols[i];//add the tsName
				if(getTsInfo(tsId, 'Ids')[cols[i]] !== undefined)
					html += (' ('
						+ '<p class="tooltip" title="' + getTooltip(getTsInfo(tsId, 'Ids')[cols[i]].units) + '">'
						+ getTsInfo(tsId, 'Ids')[cols[i]].units
						+ '<span class="tooltip-text">'
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
	return html;
}