var numData = 0;//Used for the loading message
var chart = null;

var today = (function(){//This will return today's date as a string
	var temp = new Date();
	temp = temp.toISOString();
	return temp.substr(0, temp.indexOf('T'));
})();//This will set "today" to its string value
var first = "1970-01-01"

function getTSID(url, start=new Date(first), end=new Date(today)) {
	if(url === null || start === null)
		return url;

	const day_02 = new Date("1970-01-02");
	const year02 = new Date("1972-01-01");
	const year06 = new Date("1976-01-01");
	const year26 = new Date("1996-01-01");
	const year62 = new Date("2032-01-01");

	var ts_id = {
		'13790042': {
			full: "13790042",
			hourly: "38291042",
			daily: "3449042",
			weekly: "5959042",
			monthly: "38683042",
			yearly: "38293042",
		},
		'38692042': {
			full: "38692042",
			hourly: "38692042",
			daily: "38693042",
			weekly: "38694042",
			monthly: "38695042",
			yearly: "38696042",
		},
		'38684042': {
			full: "38684042",
			hourly: "38684042",
			daily: "38684042",
			weekly: "38685042",
			monthly: "38686042",
			yearly: "38687042",
		},
		'38688042': {
			full: "38688042",
			hourly: "38688042",
			daily: "38688042",
			weekly: "38689042",
			monthly: "38690042",
			yearly: "38691042",
		}
	}

	if(ts_id[url] == null)
		return url;

	var diff = end - start;

	if(0 <= diff - year62)
		return ts_id[url].yearly;
	if(0 <= diff - year26)
		return ts_id[url].monthly;
	if(0 <= diff - year06)
		return ts_id[url].weekly;
	if(0 <= diff - year02)
		return ts_id[url].daily;
	if(0 <= diff - day_02)
		return ts_id[url].hourly;
	return url;
}

function makeChart() {
	chart = new Highcharts.StockChart({
		chart: {
			renderTo: 'ChartContainer',
			marginLeft: 300,//In order to prevent the y-axis labels from resizing the chart; the more space the better (using 300 for the test page because it works)
			marginRight: 300,
			height: 800,
		},
		navigator: {
			adaptToUpdatedData: false,
		},
		scrollbar: {
			liveRedraw: false,
		},
		boost: {
			useGPUTranslations: true
		},
		legend: {enabled: true},
		rangeSelector: {
			selected: 1
		},
		title: {text: "Mississippi River at Appleton"},
		series: [],
		xAxis: {
			events: {
				afterSetExtremes: selectRange
			},
			ordinal: false
		},
		yAxis: [
			{ // Primary yAxis
				labels: {
					format: '{value} cms',
					style: {
						color: Highcharts.getOptions().colors[0]//Personally I think this colour is too bright for an axis label; makes it hard to read
					}
				},
				title: {
					text: 'Flow Rate (cms)',
					style: {
						color: Highcharts.getOptions().colors[0]
					}
				},
				opposite: false
			},
			{ // Secondary yAxis
				gridLineWidth: 0,
				title: {
					text: 'Historical Flow Rate (cms)',
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
	if(start == null)
		return loadFromKiWIS(url, first, end, func);//Call loadFromKiWIS with default start and end dates if not provided
	if(end == null)
		return loadFromKiWIS(url, start, today, func);
	if(end < start)
		return loadFromKiWIS(url, end, start, func);

	//These 2 variables are combined with url to form the KiWIS URL from which data is retrieved
	var prefix = "http://waterdata.quinteconservation.ca/KiWIS/KiWIS?service=kisters&type=queryServices&request=getTimeseriesValues&datasource=0&format=json&ts_id=";
	var suffix = "&header=true&metadata=true&md_returnfields=station_name,parametertype_name&dateformat=UNIX&from=" + start + "&to=" + end;

	numData++;//Keep track of how many times makeDataByYear is called in order to properly show/hide 'loading...' text
	$.getJSON(prefix + url + suffix, function(res){
		numData--;//Decrement the numData value each time the data is parsed; will be at zero once the final data series executes this line
		func(res);
	});
}


function makeSeries(res, tsName='Looks like SOMEone forgot to label this series!', n=0) {
	var data = res[0].data; //pointer to KVP parent object

	//populate the series for the chart (type and tooltip default to their values for flow rate)
	var singleSeries = {
		//_colorIndex: n,
		//_symbolIndex: n,
		connectNulls: true,
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
function makeData(url, tsName, n, axis=n, start=first, end=today) {

	console.log(axis);

	if(chart === null)
		makeChart();//Make the chart if it doesn't already exist

	loadFromKiWIS(getTSID(url, new Date(start)), start, end, function(response) {
		//populate the series for the chart (type and tooltip default to their values for flow rate)
		var singleSeries = makeSeries(response, tsName, n);

		chart.addSeries(singleSeries, false);//Otherwise, add the series to the already existing chart

		if(numData !== 0)
			return;//Stop here if this is not the last data to be loaded

		chart.hideLoading();//Whichever data is loaded last hides the loading text
		chart.redraw();
	});
}
function makeDataOld(url, tsName, n, start=first, end=today) {

	if(chart === null)
		makeChart();//Make the chart if it doesn't already exist

	loadFromKiWIS(url, start, end, function(response) {
		//populate the series for the chart (type and tooltip default to their values for flow rate)
		var singleSeries = makeSeries(response, tsName, n);

		chart.addSeries(singleSeries, false);//Otherwise, add the series to the already existing chart

		if(numData !== 0)
			return;//Stop here if this is not the last data to be loaded

		chart.hideLoading();//Whichever data is loaded last hides the loading text
		chart.redraw();
	});
}


function updateData(url, tsName, start, end) {
	if(chart === null)
		return "A LANDSLIDE HAS OCCURRED!  A LANDSLIDE HAS OCCURRED!  Variable 'chart' is not initialized";
	chart.showLoading();

	loadFromKiWIS(getTSID(url, new Date(start), new Date(end)), start, end, function(response){
		var series = null;
		var data = response[0].data;

		for(var i = 0; i < chart.series.length; i++) {
			if(chart.series[i].name !== tsName)
				continue;
			series = chart.series[i];
		}



		if(series === null && numData !== 0)
			return;
		if(series === null)
			return chart.hideLoading();
		series.setData(data);

		if(numData !== 0)
			return;
		chart.hideLoading();
	});
}

function selectRange(e) {
	function toYMD(ms) {
		var temp = new Date(ms);
		temp = temp.toISOString();
		return temp.substr(0, temp.indexOf('T'));
	}
	updateData('13790042', 'Flow Rate (cms)', toYMD(e.min), toYMD(e.max))
	updateData('38692042', 'Historical Flow Rate Average (cms)', toYMD(e.min), toYMD(e.max))
	updateData('38684042', 'Historical Flow Rate Minimum (cms)', toYMD(e.min), toYMD(e.max))
	updateData('38688042', 'Historical Flow Rate Maximum (cms)', toYMD(e.min), toYMD(e.max))
}