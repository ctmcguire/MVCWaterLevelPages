var hasFlow = false;
var hasRain = false;
var hasHist = false;

/* 
 * Decode the 3 bit binary number into 3 true/false values
 */
if(100 <= num) {
	hasFlow = true;
	num -= 100;
}
if(10 <= num) {
	hasRain = true;
	num -= 10;
}
if(1 <= num) {
	hasHist = true;
	num -= 1;
}

$(document).ready(function() {

	if(data === null)
		return;//Don't make the chart if there isn't supposed to be one.

	var options = {
		chart: {
			renderTo: 'chart',
		},
		credits: {
			enabled: false
		},
		title: {
			//set to the name of the gauge
			text: gauge,
			x: -20
		},
		xAxis: {
			categories: [{
				
			}]
		},
		yAxis: [],
		tooltip: {
			formatter: function() {
				var s = '<b>'+ this.x +'</b>';
				
				$.each(this.points, function(i, point) {
					s += '<br>'+point.series.name+': '+point.y;
				});
				
				return s;
			},
			shared: true
		},
		series: [{}]
	};

	if(hasFlow) {//If hasFlow is true, then there is a flow measurement
		options.yAxis[0] = {
			labels:{
				format: '{value} cms',
			},
			title:{
				text: 'Flow (cms)',
			}
		};
	}
	else {//Otherwise, there is a water level measurement
		options.yAxis[0] = {
			labels:{
				format: '{value} m',
			},
			title:{
				text: 'Water Level (MASL)',
			}
		};
	}
	
	if(hasRain) {
		options.yAxis[1] = { // secondary yAxis
			opposite: true,
			title:{
				text: 'Precipitation (mm)',
			},
			labels:{
				format: '{value} mm'
			},
		};
	}

	var series = 1;

	options.xAxis.categories = data.date; //fill xAxis with the ranged date 
	options.series[0].name = options.yAxis[0].title.text; //initialize the series names and data 
	options.series[0].data = data.waterlevel;
	options.series[0].type = 'spline';
	options.series[0].step = true;

	if(hasHist) {
		options.series[series] = {};
		options.series[series].name = 'Historical Average (MASL)';
		options.series[series].data = data.historicalaverage;
		options.series[series].type = 'spline';
		options.series[series].step = true;
		if(hasFlow)
			options.series[series].name = 'Historical Average (cms)';
		series += 1;
	}
	if(hasRain) {
		options.series[series] = {};
		options.series[series].name = 'Precipitation (mm)';
		options.series[series].data = data.precipitation;
		options.series[series].type = 'column';
		options.series[series].yAxis = 1;//Precipitation uses the secondary axis
		series += 1;//This line is for consistency, in case additional data series are added in the future
	}

	var chart = new Highcharts.Chart(options); //create the chart
});