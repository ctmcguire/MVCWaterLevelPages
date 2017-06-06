var seriesFull = [];//This array stores all of the series displayed by the chart
var numData = 0;//Used for the loading message
var chart = null;

var today;
var minDate;
var maxDate;

var startChangeHandler = null;
var endChangeHandler = null;

function initDates() {
	function formatDate(year, month, day) {
		if(year < 1000)
			year += 1900;
		if(month < 10)
			month = '0' + month;
		if(day < 10)
			day = '0' + day;

		return year + "-" + month + "-" + day;
	}
	var temp = new Date();

	var day = temp.getDate();
	var month = temp.getMonth() + 1;//getMonth returns 0-11, and we want 1-12; therefore, we add 1 to the returned value
	var year = temp.getYear();

	if(year < 1000)
		year += 1900;

	today = formatDate(year, month, day);

	month -= 3;
	if(month < 1) {
		month += 12;
		year -= 1;
	}
	var max = 31;
	
	if(month === 2) {
		max = 29;
		if(year % 4)
			max = 28;
	}
	if(month === 4 || month === 6 || month === 9 || month === 11)
		max = 30;

	if(max < day) {
		day -= max;
		month += 1;
	}

	var startDate = formatDate(year, month, day);

	//document.getElementById("start-date").value = startDate;
	//document.getElementById("end-date").value = endDate;

	minDate = startDate;
	maxDate = today;
}


function makeChart() {
	chart = new Highcharts.StockChart({
		chart: {
			renderTo: 'ChartContainer',
			marginLeft: 300,//In order to prevent the y-axis labels from resizing the chart; the more space the better (using 300 for the test page because it works)
			marginRight: 300
		},
		legend: {enabled: true},
		rangeSelector: {
			selected: 5
		},
		title: {text: "Buckshot Creek Near Plevna"},
		series: seriesFull,
		xAxis: {ordinal: false},
		yAxis: [
			{ // Primary yAxis
				labels: {
					format: '{value} m',
					style: {
						color: Highcharts.getOptions().colors[0]//Personally I think this colour is too bright for an axis label; makes it hard to read
					}
				},
				title: {
					text: 'Water Level (m)',
					style: {
						color: Highcharts.getOptions().colors[0]
					}
				},
				opposite: false
			},
			{ // Secondary yAxis
				gridLineWidth: 0,
				title: {
					text: 'Flow Rate (cms)',
					style: {
						color: Highcharts.getOptions().colors[1]
					}
				},
				labels: {
					format: '{value} cms',
					style: {
						color: Highcharts.getOptions().colors[1]
					}
				},
				opposite: false
			},
			{ // Tertiary yAxis
				gridLineWidth: 0,
				title: {
					text: 'Precipitation (mm)',
					style: {
						color: Highcharts.getOptions().colors[2]//I also think this one is too bright; perhaps a darker shade of green would work better?
					}
				},
				labels: {
					format: '{value} mm',
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


function loadFromKiWIS(url, start, end, func) {
	if(start == null || end == null)
		return loadFromKiWIS(url, minDate, maxDate, func);//Call loadFromKiWIS with default start and end dates if not provided

	var temp = new Date(end);
	temp.setDate(temp.getDate()-1);
	end = temp.toISOString();
	end = end.substr(0, end.indexOf('T'));//Remove the time information from the end of the string

	//These 2 variables are combined with url to form the KiWIS URL from which data is retrieved
	var prefix = "http://waterdata.quinteconservation.ca/KiWIS/KiWIS?service=kisters&type=queryServices&request=getTimeseriesValues&datasource=0&format=json&ts_id=";
	var suffix = "&header=true&metadata=true&md_returnfields=station_name,parametertype_name&dateformat=UNIX&from=" + start + "&to=" + end;

	numData++;//Keep track of how many times makeDataByYear is called in order to properly show/hide 'loading...' text
	$.getJSON(prefix + url + suffix, func);
}


function makeSeries(res, tsName='Looks like SOMEone forgot to label this series!', n=0) {
	var data = res[0].data; //pointer to KVP parent object

	//populate the series for the chart (type and tooltip default to their values for flow rate)
	var singleSeries = {
		_colorIndex: n,
		_symbolIndex: seriesFull.length,
		name: tsName,//Can also extract name directly from query
		data: data,
		type: 'spline',//Both flow rate and water level use line charts
		yAxis: n,
		tooltip: {
			valueSuffix: ' cms'//flow rate is measured in cubic meters per second (which should really be m^3/s, but I guess that confuses people?)
		}
	};

	if(n === 2) {
		singleSeries.type = 'column';//Precipitation uses a bar chart, instead of a line chart
		singleSeries.tooltip.valueSuffix = ' mm';//Precipitation is measured in millimeters
	}
	if(n === 0)
		singleSeries.tooltip.valueSuffix = ' m';//Water levels are measured in meters

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
function makeData(url, tsName, n, start, end) {

	if(chart === null)
		makeChart();//Make the chart if it doesn't already exist

	loadFromKiWIS(url, start, end, function(response) {
		numData--;//Decrement the numData value each time the data is parsed; will be at zero once the final data series executes this line

		//populate the series for the chart (type and tooltip default to their values for flow rate)
		var singleSeries = makeSeries(response, tsName, n);

		seriesFull.push(singleSeries);//Add the current series to the array of serieses

		chart.addSeries(singleSeries, false);//Otherwise, add the series to the already existing chart

		if(numData !== 0)
			return;//Stop here if this is not the last data to be loaded

		chart.hideLoading();//Whichever data is loaded last hides the loading text
		chart.redraw();

		startChangeHandler = $("input.highcharts-range-selector[name='min']")[0].onchange;//Store the original handler so we can use it in the new one.
		endChangeHandler = $("input.highcharts-range-selector[name='max']")[0].onchange;//Store the original handler so we can use it in the new one.

		$("input.highcharts-range-selector[name='min']")[0].onchange = null;//The existing handlers interfere with the new one, so we need to disable them
		$("input.highcharts-range-selector[name='min']")[0].onkeypress = null;
		$("input.highcharts-range-selector[name='max']")[0].onchange = null;
		$("input.highcharts-range-selector[name='max']")[0].onkeypress = null;
		$("input.highcharts-range-selector").bind('change', selectRange);
	});
}


function addData(url, tsName, start, end) {
	function handleResponse(response) {
		numData--;

		var i;
		var data;
		var oldData;

		for(i = 0; i < chart.series.length; i++) {
			if(chart.series[i].name !== tsName)
				continue;
			oldData = seriesFull[i].data;
			break;
		}

		data = response[0].data;

		if(start < minDate)
			data = data.concat(oldData);
		else if(maxDate < end)
			data = oldData.concat(data);

		seriesFull[i].data = data;
		chart.series[i].setData(data, false);

		if(numData !== 0)
			return;

		chart.hideLoading();

		minDate = start;
		maxDate = end;

		//$("input.highcharts-range-selector[name='min']")[0].value = minDate;
		//$("input.highcharts-range-selector[name='max']")[0].value = maxDate;

		chart.redraw();

		//chart.xAxis[0].setExtremes(data[0][0], data[data.length-1][0]);

		/*startChangeHandler();
		endChangeHandler();*/

		$("input.highcharts-range-selector[name='min']").trigger('change');//Need to do some bout dis
		//minDate = $("input.highcharts-range-selector[name='min']")[0].value;//Maybe check if min.value is what it is supposed to be?
		//maxDate = $("input.highcharts-range-selector[name='max']")[0].value;
	}

	if(chart === null)
		return;
	chart.showLoading();

	if(start < minDate)
		loadFromKiWIS(url, start, minDate, handleResponse);
	if(maxDate < end)
		loadFromKiWIS(url, maxDate, end, handleResponse);
	return true;//Returns true if the end of the function is reached successfully
}

function selectRange() {
	var startDate = $("input.highcharts-range-selector[name='min']")[0].value;//document.getElementById("end-date").value;
	var endDate = $("input.highcharts-range-selector[name='max']")[0].value;//document.getElementById("end-date").value;

	if(startDate === "" || endDate === "" || endDate < startDate || today < endDate)
		return;

	if(endDate <= maxDate && minDate <= startDate) {
		startChangeHandler();
		endChangeHandler();
		return;
	}

	if(minDate < startDate)
		startDate = minDate;
	if(endDate < maxDate)
		endDate = maxDate;

	addData('1391042', 'Water Level', startDate, endDate);
	addData('32335042', 'Flow Rate (cms)', startDate, endDate);
	addData('1437042', 'Precipitation (mm)', startDate, endDate);
}