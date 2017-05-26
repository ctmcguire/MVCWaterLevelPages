var seriesFull = [];//This array stores all of the series displayed by the chart
var numData = 3;//Used for the loading message

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
function makeData(tsURL, tsName, n) {
	//These 2 variables are combined with tsURL to form the KiWIS URL from which data is retrieved
	var prefix = "http://waterdata.quinteconservation.ca/KiWIS/KiWIS?service=kisters&type=queryServices&request=getTimeseriesValues&datasource=0&format=json&ts_id=";
	var suffix = "&header=true&metadata=true&md_returnfields=station_name,parametertype_name&from=2005-01-01&dateformat=UNIX";

	//Ajax query for data in JSON format
	$.getJSON(prefix + tsURL + suffix, function (data) {

		numData--;//Decrement the numData value each time the data is parsed; will be at zero once the final data series executes this line

		var data2 = data[0].data; //pointer to KVP parent object
		var data3 = []; //will store updated KVP for each item

		//Loop through date and param values and format for chart
		for (var i = 1; i < data2.length; i++) {
			//Get the date based on how requested in KiWIS, line below changes based on how you request the datestamp
			data2[i][0] = parseFloat(data2[i][0]);
			data2[i][1] = parseFloat(data2[i][1]); //Makes the param value a number
			data3.push(data2[i]); //Push new KVP into data3
		}

		//populate the series for the chart (type and tooltip default to their values for flow rate)
		var singleSeries = {
			_colorIndex: n,
			_symbolIndex: seriesFull.length,
			name: tsName,//Can also extract name directly from query
			data: data3,
			type: 'spline',//Both flow rate and water level use line charts
			yAxis: n,
			tooltip: {
				valueSuffix: ' cms'//flow rate is measured in cubic meters per second (which should really be m^3/s, but I guess that confuses people?)
			}
		};

		if(n == 2) {
			singleSeries.type = 'column';//Precipitation uses a bar chart, instead of a line chart
			singleSeries.tooltip.valueSuffix = ' mm';//Precipitation is measured in millimeters
		}
		if(n == 0)
			singleSeries.tooltip.valueSuffix = ' m';//

		seriesFull.push(singleSeries);//Add the current series to the array of serieses

		//Create and render the chart passing in the series
		var chart = new Highcharts.StockChart({
			chart: {renderTo: 'ChartContainer'},
			legend: {enabled: true},
			rangeSelector: {selected: 1},
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

		chart.showLoading();//Whichever data is loaded first displays the loading text (the others do it too, but the first one is the one that matters)

		if(numData === 0)
			chart.hideLoading();//Whichever data is loaded last hides the loading text
	});
}