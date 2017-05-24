<?php

//connect to server
$con = mysql_connect("localhost","mvconc55_levels1","4z9!yA");

//check connection
if (!$con) {
  die('Could not connect: ' . mysql_error());
}
//select database
mysql_select_db("mvconc55_mvclevels");

//set the values to be called in sql query, taken from the form on the previous page 
 $gauge = $_POST['gauge'];
 $startdate = $_POST['startdate'];
 $enddate = $_POST['enddate'];
 $type = $_POST['type'];
 $F = 0; // tag to set the version of chart created 

if($type == "table"){



	 $query = mysql_query("SELECT * FROM data WHERE gauge='$gauge' AND `date` >= '$startdate' AND `date` <= '$enddate' ORDER BY date");

 /*
  echo '<BR><BR><table align="center" cellspacing="0" cellpadding="5" WIDTH=600 BORDER=1 CELLPADDING=5>
    <TR><TD COLSPAN=6><CENTER><IMG SRC="../images/header2.jpg"></CENTER></TD></TR>
    <TR><TD COLSPAN=6><a href="javascript:history.back();"><font face="Arial" color="#000080"><img border="0" src="back.jpg" width="66" height="28" ALT="Back" TITLE="Back"></font></a></TD></TR>
	<tr><td><b>Gauge</b></td><td><b>Date</b></td><td><b>Time</b></td><td><b>Gauge Reading</b></td><td><b>Historical Avg.</b></td><td><b>Precipitation (mm)</b></td></tr>';
	
 while($row = mysql_fetch_array($query))
 {
             $datainfo = $row['datainfo'];
            $gauge = $row['gauge'];
            $date = $row['date'];
            $time = $row['time'];
            $historical = $row['historicalaverage'];
            		IF($historical == NULL) { $historical = 'Data Not Available'; }
            $precipitation = $row['precipitation'];
			IF($precipitation == NULL) { $precipitation = 'Data Not Available'; }
             echo '<tr><td>' . $gauge . '</td><td>' . $date . '</td><td>' . $time . '</td><td>' . $datainfo . '</td><td>' . $historical . '</td><td>' . $precipitation . '</td></tr>';
 


            }
echo '</table>'; */









if( $gauge== "Bennett Lake outflow" || $gauge== "Dalhousie Lk outflow"){
	
	  echo '<BR><BR><table align="center" cellspacing="0" cellpadding="5" WIDTH=600 BORDER=1 CELLPADDING=5>
    <TR><TD COLSPAN=6><CENTER><IMG SRC="../images/header2.jpg"></CENTER></TD></TR>
    <TR><TD COLSPAN=6><a href="javascript:history.back();"><font face="Arial" color="#000080"><img border="0" src="back.jpg" width="66" height="28" ALT="Back" TITLE="Back"></font></a></TD></TR>
	<tr><td><b>Gauge</b></td><td><b>Date</b></td><td><b>Time</b></td><td><b>Flow (cms)</b></td><td><b>Precipitation (mm)</b></td></tr>';
	
 while($row = mysql_fetch_array($query))
 {
             $datainfo = $row['datainfo'];
            $gauge = $row['gauge'];
            $date = $row['date'];
            $time = $row['time'];
            $precipitation = $row['precipitation'];
			IF($precipitation == NULL) { $precipitation = 'Data Not Available'; }
             echo '<tr><td>' . $gauge . '</td><td>' . $date . '</td><td>' . $time . '</td><td>' . $datainfo . '</td><td>' . $precipitation . '</td></tr>';
 


            }
	
	
}elseif($gauge== "Farm Lake" || $gauge== "C.P. Dam"|| $gauge=="Carp River at Maple Grove"|| $gauge=="High Falls"){
	
	 echo '<BR><BR><table align="center" cellspacing="0" cellpadding="5" WIDTH=600 BORDER=1 CELLPADDING=5>
    <TR><TD COLSPAN=6><CENTER><IMG SRC="../images/header2.jpg"></CENTER></TD></TR>
    <TR><TD COLSPAN=6><a href="javascript:history.back();"><font face="Arial" color="#000080"><img border="0" src="back.jpg" width="66" height="28" ALT="Back" TITLE="Back"></font></a></TD></TR>
	<tr><td><b>Gauge</b></td><td><b>Date</b></td><td><b>Time</b></td><td><b>Water Level (MASL)</b></td></tr>';
	
 while($row = mysql_fetch_array($query))
 {
             $datainfo = $row['datainfo'];
            $gauge = $row['gauge'];
            $date = $row['date'];
            $time = $row['time'];
             echo '<tr><td>' . $gauge . '</td><td>' . $date . '</td><td>' . $time . '</td><td>' . $datainfo . '</td></tr>';
            }
	



}elseif($gauge== "High Falls Flow"){
	
	  echo '<BR><BR><table align="center" cellspacing="0" cellpadding="5" WIDTH=600 BORDER=1 CELLPADDING=5>
    <TR><TD COLSPAN=6><CENTER><IMG SRC="../images/header2.jpg"></CENTER></TD></TR>
    <TR><TD COLSPAN=6><a href="javascript:history.back();"><font face="Arial" color="#000080"><img border="0" src="back.jpg" width="66" height="28" ALT="Back" TITLE="Back"></font></a></TD></TR>
	<tr><td><b>Gauge</b></td><td><b>Date</b></td><td><b>Time</b></td><td><b>Flow (cms)</b></td></tr>';
	
 while($row = mysql_fetch_array($query))
 {
             $datainfo = $row['datainfo'];
            $gauge = $row['gauge'];
            $date = $row['date'];
            $time = $row['time'];
             echo '<tr><td>' . $gauge . '</td><td>' . $date . '</td><td>' . $time . '</td><td>' . $datainfo . '</td></tr>';
            }
	
}elseif($gauge== "Shabomeka Lake" || $gauge== "Sharbot Lake" || $gauge== "Bennett Lake"|| $gauge== "Dalhousie Lake" || $gauge== "Palmerston Lake"|| $gauge== "Crotch Lake"){
  echo '<BR><BR><table align="center" cellspacing="0" cellpadding="5" WIDTH=600 BORDER=1 CELLPADDING=5>
    <TR><TD COLSPAN=6><CENTER><IMG SRC="../images/header2.jpg"></CENTER></TD></TR>
    <TR><TD COLSPAN=6><a href="javascript:history.back();"><font face="Arial" color="#000080"><img border="0" src="back.jpg" width="66" height="28" ALT="Back" TITLE="Back"></font></a></TD></TR>
	<tr><td><b>Gauge</b></td><td><b>Date</b></td><td><b>Time</b></td><td><b>Water Level (MASL)</b></td><td><b>Historical Avg. (MASL)</b></td><td><b>Precipitation (mm)</b></td></tr>';
	
 while($row = mysql_fetch_array($query))
 {
             $datainfo = $row['datainfo'];
            $gauge = $row['gauge'];
            $date = $row['date'];
            $time = $row['time'];
            $historical = $row['historicalaverage'];
            		IF($historical == NULL) { $historical = 'Data Not Available'; }
            $precipitation = $row['precipitation'];
			IF($precipitation == NULL) { $precipitation = 'Data Not Available'; }
             echo '<tr><td>' . $gauge . '</td><td>' . $date . '</td><td>' . $time . '</td><td>' . $datainfo . '</td><td>' . $historical . '</td><td>' . $precipitation . '</td></tr>';
            }	
	
}elseif($gauge== "Myers Cave flow" || $gauge== "Buckshot Creek flow" 
|| $gauge== "Ferguson Falls flow" || $gauge== "Appleton flow" || $gauge== "Gordon Rapids flow"
|| $gauge== "Lanark Stream flow" || $gauge== "Mill of Kintail flow" || $gauge== "Kinburn flow"){
	  
	  echo '<BR><BR><table align="center" cellspacing="0" cellpadding="5" WIDTH=600 BORDER=1 CELLPADDING=5>
    <TR><TD COLSPAN=6><CENTER><IMG SRC="../images/header2.jpg"></CENTER></TD></TR>
    <TR><TD COLSPAN=6><a href="javascript:history.back();"><font face="Arial" color="#000080"><img border="0" src="back.jpg" width="66" height="28" ALT="Back" TITLE="Back"></font></a></TD></TR>
	<tr><td><b>Gauge</b></td><td><b>Date</b></td><td><b>Time</b></td><td><b>Flow (cms)</b></td><td><b>Historical Avg. (cms)</b></td><td><b>Precipitation (mm)</b></td></tr>';
	
 while($row = mysql_fetch_array($query))
 {
             $datainfo = $row['datainfo'];
            $gauge = $row['gauge'];
            $date = $row['date'];
            $time = $row['time'];
            $historical = $row['historicalaverage'];
            		IF($historical == NULL) { $historical = 'Data Not Available'; }
            $precipitation = $row['precipitation'];
			IF($precipitation == NULL) { $precipitation = 'Data Not Available'; }
             echo '<tr><td>' . $gauge . '</td><td>' . $date . '</td><td>' . $time . '</td><td>' . $datainfo . '</td><td>' . $historical . '</td><td>' . $precipitation . '</td></tr>';
            }
	
// where all the graph for all the weekly gauge levels are set since none of them include precipitation 
}else{
	
	  echo '<BR><BR><table align="center" cellspacing="0" cellpadding="5" WIDTH=600 BORDER=1 CELLPADDING=5>
    <TR><TD COLSPAN=6><CENTER><IMG SRC="../images/header2.jpg"></CENTER></TD></TR>
    <TR><TD COLSPAN=6><a href="javascript:history.back();"><font face="Arial" color="#000080"><img border="0" src="back.jpg" width="66" height="28" ALT="Back" TITLE="Back"></font></a></TD></TR>
	<tr><td><b>Gauge</b></td><td><b>Date</b></td><td><b>Time</b></td><td><b>Water Level (MASL)</b></td><td><b>Historical Avg. (MASL)</b></td></tr>';
	
 while($row = mysql_fetch_array($query))
 {
             $datainfo = $row['datainfo'];
            $gauge = $row['gauge'];
            $date = $row['date'];
            $time = $row['time'];
            $historical = $row['historicalaverage'];
            		IF($historical == NULL) { $historical = 'Data Not Available'; }
             echo '<tr><td>' . $gauge . '</td><td>' . $date . '</td><td>' . $time . '</td><td>' . $datainfo . '</td><td>' . $historical . '</td></tr>';
 


            }


}


echo '</table>';



	
}elseif($type == "graph"){
	 //sql query called 
$sth = mysql_query("SELECT * FROM data WHERE gauge='$gauge' AND date(date) >= '$startdate' AND date(date) <= '$enddate' ORDER BY date");

if( $gauge== "Bennett Lake outflow" || $gauge== "Dalhousie Lk outflow"){
	$F = 5; 
	//loop query and set arrays of data 
	while($r = mysql_fetch_array($sth)) {
		$row[] = $r['date'];
		$row1[] = $r['datainfo'];
		$row2[] = $r['precipitation'];
	}
	//group data together into one array 
	$graph_data = array('date'=>$row, 'waterlevel'=>$row1,'precipitation'=> $row2);
	
}elseif($gauge== "Farm Lake" || $gauge== "C.P. Dam"|| $gauge=="Carp River at Maple Grove"|| $gauge=="High Falls"){
	$F = 4; 
	//loop query and set arrays of data 
	while($r = mysql_fetch_array($sth)) {
		$row[] = $r['date'];
		$row1[] = $r['datainfo'];
	}
	//group data together into one array 
	$graph_data = array('date'=>$row, 'waterlevel'=>$row1);


}elseif($gauge== "High Falls Flow"){
	$F = 3; 
	//loop query and set arrays of data 
	while($r = mysql_fetch_array($sth)) {
		$row[] = $r['date'];
		$row1[] = $r['datainfo'];
	}
	//group data together into one array 
	$graph_data = array('date'=>$row, 'waterlevel'=>$row1);
	
}elseif($gauge== "Shabomeka Lake" || $gauge== "Sharbot Lake" || $gauge== "Bennett Lake"|| $gauge== "Dalhousie Lake" || $gauge== "Palmerston Lake"|| $gauge== "Crotch Lake"){
	$F = 2; 
	//loop query and set arrays of data 
	while($r = mysql_fetch_array($sth)) {
		$row[] = $r['date'];
		$row1[] = $r['datainfo'];
		$row2[] = $r['precipitation'];
		$row3[] = $r['historicalaverage'];
	}
	
	$graph_data = array('date'=>$row, 'waterlevel'=>$row1, 'precipitation'=>$row2, 'historicalaverage'=>$row3);
	
}elseif($gauge== "Myers Cave flow" || $gauge== "Buckshot Creek flow" 
|| $gauge== "Ferguson Falls flow" || $gauge== "Appleton flow" || $gauge== "Gordon Rapids flow"
|| $gauge== "Lanark Stream flow" || $gauge== "Mill of Kintail flow" || $gauge== "Kinburn flow"){
	$F = 1; 
	//loop query and set arrays of data 
	while($r = mysql_fetch_array($sth)) {
		$row[] = $r['date'];
		$row1[] = $r['datainfo'];
		$row2[] = $r['precipitation'];
		$row3[] = $r['historicalaverage'];
	}
	
	$graph_data = array('date'=>$row, 'waterlevel'=>$row1, 'precipitation'=>$row2, 'historicalaverage'=>$row3);
	
	// where all the graph for all the weekly gauge levels are set since none of them include precipitation 
}else{
	$F = 0;
	//loop query and set arrays of data with no precipitation
	while($r = mysql_fetch_array($sth)) {
		$row[] = $r['date'];
		$row1[] = $r['datainfo'];
		$row2[] =  $r['historicalaverage'];
	}
	//convert array into json format 
	$graph_data = array('date'=>$row, 'waterlevel'=>$row1, 'historicalaverage'=>$row2);
}

$result = json_encode($graph_data, JSON_NUMERIC_CHECK);
//close connection to database 
}

mysql_close($con);
?>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="//code.highcharts.com/highcharts.js"></script>

<div id="chart"></div>

<script>

var data = <?php echo $result; ?>;
var num = <?php echo $F; ?>;


$(document).ready(function() {
if(num == 0){
	var options = {
		chart: {
			renderTo: 'chart',
		},
		credits: {
			enabled: false
		},
		title: {
			//set to the name of the gauge 			
			text: '<?php echo $gauge; ?>',
			x: -20
		},
		xAxis: {
			categories: [{
				
			}]
		},
                yAxis:[{
			labels:{
				format: '{value} m',
			},
			title:{
				text: 'Water Level (MASL)',
			}
		}],
		// tooltip set to display value when hovering over a point in the chart 		
		tooltip: {
               formatter: function() {
                var s = '<b>'+ this.x +'</b>';
                
                $.each(this.points, function(i, point) {
                    s += '<br/>'+point.series.name+': '+point.y;
                });
                
                return s;
            },
            shared: true
        },
		//series is set down below 
		series: [{},{}]
	};

			
			options.xAxis.categories = data.date; //fill xAxis with the ranged date 
			options.series[0].name = 'Water Level (MASL)'; //initialize the series names and data 
			options.series[0].data = data.waterlevel;
            options.series[0].type = 'spline';
            options.series[0].step = true;
			options.series[1].name = 'Historical Average (MASL)';
			options.series[1].data = data.historicalaverage;
			options.series[1].type = 'spline';
            options.series[1].step = true;
			
			var chart = new Highcharts.Chart(options); //create the chart 			

}else if(num == 1){
	var options = {
		chart: {
			renderTo: 'chart',
		},
		credits: {
			enabled: false
		},
		title: {
			//set to the name of the gauge 			
			text: '<?php echo $gauge; ?>',
			x: -20
		},
		xAxis: {
			categories: [{
				
			}]
		},
                yAxis:[{
			labels:{
				format: '{value} cms',
			},
			title:{
				text: 'Flow (cms)',
			}
		},{ // secondary yAxis
                        opposite: true,
			title:{
				text: 'Precipitation (mm)',
			},
			labels:{
				format: '{value} mm'
			},
			
		
		}],
		// tooltip set to display value when hovering over a point in the chart 		
		tooltip: {
               formatter: function() {
                var s = '<b>'+ this.x +'</b>';
                
                $.each(this.points, function(i, point) {
                    s += '<br/>'+point.series.name+': '+point.y;
                });
                
                return s;
            },
            shared: true
        },
		//series is set down below 
		series: [{},{},{}]
	};

			
			options.xAxis.categories = data.date; //fill xAxis with the ranged date 
			options.series[0].name = 'Flow (cms)'; //initialize the series names and data 
			options.series[0].data = data.waterlevel;
            options.series[0].type = 'spline';
            options.series[0].step = true;
			options.series[1].name = 'Historical Average (cms)';
			options.series[1].data = data.historicalaverage;
			options.series[1].type = 'spline';
            options.series[1].step = true;
			options.series[2].name = 'Precipitation (mm)';
			options.series[2].data = data.precipitation;
			options.series[2].type = 'column';  // set the precipitation series to be columns 
            options.series[2].yAxis = 1; //set the precipitation column as a different yAxis 
			
			var chart = new Highcharts.Chart(options); //create the chart 	
	
}else if(num == 2){
	var options = {
		chart: {
			renderTo: 'chart',
		},
		credits: {
			enabled: false
		},
		title: {
			//set to the name of the gauge 			
			text: '<?php echo $gauge; ?>',
			x: -20
		},
		xAxis: {
			categories: [{
				
			}]
		},
                yAxis:[{
			labels:{
				format: '{value} m',
			},
			title:{
				text: 'Water Level (MASL)',
			}
		},{ // secondary yAxis
                        opposite: true,
			title:{
				text: 'Precipitation (mm)',
			},
			labels:{
				format: '{value} mm'
			},
			
		
		}],
		// tooltip set to display value when hovering over a point in the chart 		
		tooltip: {
               formatter: function() {
                var s = '<b>'+ this.x +'</b>';
                
                $.each(this.points, function(i, point) {
                    s += '<br/>'+point.series.name+': '+point.y;
                });
                
                return s;
            },
            shared: true
        },
		//series is set down below 
		series: [{},{},{}]
	};

			
			options.xAxis.categories = data.date; //fill xAxis with the ranged date 
			options.series[0].name = 'Water Level (MASL)'; //initialize the series names and data 
			options.series[0].data = data.waterlevel;
            options.series[0].type = 'spline';
            options.series[0].step = true;
			options.series[1].name = 'Historical Average (MASL)';
			options.series[1].data = data.historicalaverage;
			options.series[1].type = 'spline';
            options.series[1].step = true;
			options.series[2].name = 'Precipitation (mm)';
			options.series[2].data = data.precipitation;
			options.series[2].type = 'column';  // set the precipitation series to be columns 
            options.series[2].yAxis = 1; //set the precipitation column as a different yAxis 
			
			var chart = new Highcharts.Chart(options); //create the chart 					

}else if(num == 3){
	var options = {
		chart: {
			renderTo: 'chart',
		},
		credits: {
			enabled: false
		},
		title: {
			//set to the name of the gauge 			
			text: '<?php echo $gauge; ?>',
			x: -20
		},
		xAxis: {
			categories: [{
				
			}]
		},
                yAxis:[{
			labels:{
				format: '{value} cms',
			},
			title:{
				text: 'Flow (cms)',
			}
		}],
		// tooltip set to display value when hovering over a point in the chart 		
		tooltip: {
               formatter: function() {
                var s = '<b>'+ this.x +'</b>';
                
                $.each(this.points, function(i, point) {
                    s += '<br/>'+point.series.name+': '+point.y;
                });
                
                return s;
            },
            shared: true
        },
		//series is set down below 
		series: [{}]
	};

			
			options.xAxis.categories = data.date; //fill xAxis with the ranged date 
			options.series[0].name = 'Flow (cms)'; //initialize the series names and data 
			options.series[0].data = data.waterlevel;
            options.series[0].type = 'spline';
			
			var chart = new Highcharts.Chart(options); //create the chart 	
	
}else if(num == 4){
	var options = {
		chart: {
			renderTo: 'chart',
		},
		credits: {
			enabled: false
		},
		title: {
			//set to the name of the gauge 			
			text: '<?php echo $gauge; ?>',
			x: -20
		},
		xAxis: {
			categories: [{
				
			}]
		},
                yAxis:[{
			labels:{
				format: '{value} m',
			},
			title:{
				text: 'Water Level (MASL)',
			}
		}],
		// tooltip set to display value when hovering over a point in the chart 		
		tooltip: {
               formatter: function() {
                var s = '<b>'+ this.x +'</b>';
                
                $.each(this.points, function(i, point) {
                    s += '<br/>'+point.series.name+': '+point.y;
                });
                
                return s;
            },
            shared: true
        },
		//series is set down below 
		series: [{}]
	};

			
			options.xAxis.categories = data.date; //fill xAxis with the ranged date 
			options.series[0].name = 'Water Level (MASL)'; //initialize the series names and data 
			options.series[0].data = data.waterlevel;
            options.series[0].type = 'spline';
			
			var chart = new Highcharts.Chart(options); //create the chart 	
			
}else if(num == 5){
		var options = {
		chart: {
			renderTo: 'chart',
		},
		credits: {
			enabled: false
		},
		title: {
			//set to the name of the gauge 			
			text: '<?php echo $gauge; ?>',
			x: -20
		},
		xAxis: {
			categories: [{
				
			}]
		},
                yAxis:[{
			labels:{
				format: '{value} cms',
			},
			title:{
				text: 'Flow (cms)',
			}
		},{ // secondary yAxis
                        opposite: true,
			title:{
				text: 'Precipitation (mm)',
			},
			labels:{
				format: '{value} mm'
			},
			
		
		}],
		// tooltip set to display value when hovering over a point in the chart 		
		tooltip: {
               formatter: function() {
                var s = '<b>'+ this.x +'</b>';
                
                $.each(this.points, function(i, point) {
                    s += '<br/>'+point.series.name+': '+point.y;
                });
                
                return s;
            },
            shared: true
        },
		//series is set down below 
		series: [{},{}]
	};

			
			options.xAxis.categories = data.date; //fill xAxis with the ranged date 
			options.series[0].name = 'Flow (cms)'; //initialize the series names and data 
			options.series[0].data = data.waterlevel;
            options.series[0].type = 'spline';
			options.series[1].name = 'Precipitation (mm)';
			options.series[1].data = data.precipitation;
			options.series[1].type = 'column';  // set the precipitation series to be columns 
            options.series[1].yAxis = 1;
			
			var chart = new Highcharts.Chart(options); //create the chart 	
}
});
</script>
