var numData = 0;//Used for the loading message
var chart = null;
var useSql = false;

var table = []
var rowTemplate = {}

var today = (function(){//This will return today's date as a string
	var temp = new Date();
	temp = temp.toISOString();
	return temp.substr(0, temp.indexOf('T'));
})();//This will set "today" to its string value
var first = "1970-01-01"

function getTsInfo(url, param="Gauge") {
	return {
		'13790042': {
			'Ids': {//This is just in case I decide to add other parameters to this object later
				'Flow Rate':{
					full: "13790042",
					hourly: "38291042",
					daily: "3449042",
					weekly: "5959042",
					monthly: "38683042",
					yearly: "38293042",
					units: "cms",
				},
				'Historical Average': {
					full: "38692042",
					hourly: "38692042",
					daily: "38693042",
					weekly: "38694042",
					monthly: "38695042",
					yearly: "38696042",
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
				//'Precipitation': {},
			},
			'primary': "Flow Rate"
		},
	}[url][param]
}

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

function makeChart(tsId, gauge="Mississippi River at Appleton") {
	chart = new Highcharts.StockChart({
		chart: {
			renderTo: "data-content",
			//marginLeft: 300,//In order to prevent the y-axis labels from resizing the chart; the more space the better (using 300 for the test page because it works)
			//marginRight: 300,
			//height: 800,
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
			//selected: 1
		},
		title: {text: gauge},
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
						color: Highcharts.getOptions().colors[0]//Personally I think this colour is too bright for an axis label; makes it hard to read
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
			{ // Former secondary yAxis
				gridLineWidth: 0,
				title: {
					text: "Historical Flow Rate (cms)",
					style: {
						color: Highcharts.getOptions().colors[1]
					}
				},
				labels: {
					format: "{value} cms",
					style: {
						color: Highcharts.getOptions().colors[1]
					}
				},
				opposite: false
			},
			{ // Secondary yAxis
				gridLineWidth: 0,
				title: {
					text: "Precipitation (mm)",
					style: {
						color: Highcharts.getOptions().colors[2]//I also think this one is too bright; perhaps a darker shade of green would work better?
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

function loadFromKiWIS(url, start, end, format, func, err=function(){}) {
	if(start == null)
		return loadFromKiWIS(url, first, end, format, func, err);//Call loadFromKiWIS with default start and end dates if not provided
	if(end == null)
		return loadFromKiWIS(url, start, today, format, func, err);
	if(end < start)
		return loadFromKiWIS(url, end, start, format, func, err);

	//These 2 variables are combined with url to form the KiWIS URL from which data is retrieved
	var prefix = "http://waterdata.quinteconservation.ca/KiWIS/KiWIS?service=kisters&type=queryServices&request=getTimeseriesValues&datasource=0&format=" + format + "&ts_id=";
	var suffix = "&header=true&metadata=true&md_returnfields=station_name,parametertype_name&dateformat=UNIX&from=" + start + "&to=" + end;

	numData++;//Keep track of how many times makeDataByYear is called in order to properly show/hide 'loading...' text
	$.ajax({
		dataType: (format === 'csv'? "text" : format),
		url: prefix + url + suffix,
		success: function(res) {
			numData--;
			func(res);
		},
		error: function(res) {
			//This should attempt to load the sql one instead
			numData--;
			err(res, func);
		}
	});
}

function loadFromSql(tsId, tsName, start, end, format) {
	if(start == null)
		return loadFromSql(tsId, tsName, first, end, format, func);//Call loadFromKiWIS with default start and end dates if not provided
	if(end == null)
		return loadFromSql(tsId, tsName, start, today, format, func);
	if(end < start)
		return loadFromSql(tsId, tsName, end, start, format, func);

	return function(err, func) {
		var url = "sql-data/?ts_id=" + tsId + "&col=" + tsName + "&from=" + start + "&to=" + end;

		$.ajax({
			dataType: (format === 'csv'? "text" : format),
			url: url,//prefix + url + suffix,
			success: function(res) {
					var response = [
						{
							"data": []
						}
					];
					for(var i = 0; i < res.Date.length; i++)
						response[0].data.push([(new Date(res.Date[i] + " " + res.Time[i])).valueOf(), res.Data[i]]);
				func(response);
			},
			error: function(res) {
				//do something fancy
			}
		});
	}
}
/*function loadFromSql(tsId, tsName, start, end, format, func) {
	if(start == null)
		return loadFromSql(tsId, tsName, first, end, format, func);//Call loadFromKiWIS with default start and end dates if not provided
	if(end == null)
		return loadFromSql(tsId, tsName, start, today, format, func);
	if(end < start)
		return loadFromSql(tsId, tsName, end, start, format, func);
}*/


function makeSeries(res, tsId, tsName='Looks like SOMEone forgot to label this series!', n=undefined) {
	var data = res[0].data; //pointer to KVP parent object

	//populate the series for the chart (type and tooltip default to their values for flow rate)
	var singleSeries = {
		_colorIndex: n,
		_symbolIndex: n,
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
 * @param tsURL - The ts_id of the data to retrieve; formally the entire KiWIS URL to retrieve from 
 *             (should maybe be renamed?).
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
		(function(tsName, n) {
			loadFromKiWIS(getTSID(tsId, tsName, new Date(first), new Date(today)), first, today, 'json', function(response) {
				var singleSeries = makeSeries(response, tsId, tsName, n);
				series[n] = singleSeries;//chart.addSeries(singleSeries, false);

				if(numData !== 0)
					return;
				for(var j = 0; j < series.length; j++)
					chart.addSeries(series[j], false);
				chart.xAxis[0].setExtremes((new Date(start)).valueOf(), (new Date(end)).valueOf(), false);
				chart.hideLoading();
				chart.redraw();
			}, loadFromSql(tsId, tsName, first, today, 'json'));
		})(params[i], i);
	}
}

function updateData(tsId, start, end) {
	var params = getOrderedCols(tsId);

	if(chart === null)
		return "A LANDSLIDE HAS OCCURRED!  A LANDSLIDE HAS OCCURRED!  Variable 'chart' is not initialized";
	chart.showLoading();

	for(var i = 0; i < params.length; i++) {
		(function(tsName) {
			loadFromKiWIS(getTSID(tsId, tsName, new Date(start), new Date(end)), start, end, 'json', function(response) {
				var series = null;
				var data = response[0].data;

				for(var j = 0; j < chart.series.length; j++) {
					if(chart.series[j].name !== tsName)
						continue;
					series = chart.series[j];
				}

				if(series === null && numData !== 0)
					return;
				if(series === null)
					return chart.hideLoading();
				series.setData(data);

				if(numData !== 0)
					return;
				chart.hideLoading();
			}, loadFromSql(tsId, tsName, start, end, 'json'));
		})(params[i])
	}
}

function selectRange(e) {
	function toYMD(ms) {
		var temp = new Date(ms);
		temp = temp.toISOString();
		return temp.substr(0, temp.indexOf('T'));
	}
	updateData('13790042', toYMD(e.min), toYMD(e.max))
}


function loadTable(tsId, start, end) {
	var params = getOrderedCols(tsId);

	for(var i = 0; i < params.length; i++) {
		(function(tsName) {
			loadFromKiWIS(getTsInfo(tsId, 'Ids')[tsName].daily, start, end, 'json', function(response) {
				addRows(response[0].data, tsId, tsName)
				if(numData === 0)
					document.getElementById('data-content').innerHTML = makeTable(tsId)
			}, loadFromSql(tsId, tsName, start, end, 'json'));
		})(params[i])
	}
}


function addRows(data, tsId, tsName) {
	for(var i = 0; i < data.length; i++) {
		if(table[data[i][0]] === undefined)
			table[data[i][0]] = getTemplate(tsId);
		var timestamp = new Date(data[i][0]);
		var row = table[data[i][0]];

		if(row['Date'] === null)
			row['Date'] = timestamp.getFullYear() + "-" + (8 < timestamp.getMonth()? "" : "0") + (timestamp.getMonth()+1) + "-" + (9 < timestamp.getDate()? "" : "0") + timestamp.getDate()
		if(row['Time'] === null)
			row['Time'] = (timestamp.getHours() % 12) + ":" + (9 < timestamp.getMinutes()? "" : "0") + timestamp.getMinutes() + " " + (timestamp.getHours() < 12? "AM" : "PM")
		if(row[tsName] === undefined)
			continue;
		if(row[tsName] !== null)
			continue;
		row[tsName] = data[i][1];
		table[data[i][0]] = row;
	}
}


function getTemplate(tsId) {
	var cols = getOrderedCols(tsId);
	var template = {
		'Date': null,
		'Time': null,
	}

	for(var i = 0; i < cols.length; i++)
		template[cols[i]] = null;
	return template;
}


function getOrderedCols(tsId) {
	var ids = getTsInfo(tsId, 'Ids');
	var cols = [];

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
		cols.push(c);
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


function makeTable(tsId) {
	var html = '<table>';
	var cols = []

	if(tsId === undefined)
		return;
	for(var r in table) {
		if(r === undefined)
			continue;
		var row = table[r];
		if(cols.length === 0) {
			cols = ["Date","Time"].concat(getOrderedCols(tsId));

			html += '<tr>';
			for(var i = 0; i < cols.length; i++) {
				html += '<th>' + cols[i];
				if(getTsInfo(tsId, 'Ids')[cols[i]] !== undefined)
					html += ' (' + getTsInfo(tsId, 'Ids')[cols[i]].units + ')';
				html += '</th>';
			}
			html += '</tr>';
		}
		html += '<tr>';
		for(var i = 0; i < cols.length; i++)
			html += '<td>' + (row[cols[i]] !== null? row[cols[i]] : "") + '</td>'
		html += '</tr>';
	}
	html += '</table>';
	return html;
}