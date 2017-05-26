<?php
	include 'HTMLReader.php';
	$reader = new HTMLReader('data.html');

	$lakeFlowGauges = array();
	$lakeFlowGauges['Bennett Lake outflow'] = true;
	$lakeFlowGauges['Dalhousie Lk outflow'] = true;

	$lakeSpclGauges = array();
	$lakeSpclGauges['Farm Lake'] = true;
	$lakeSpclGauges['C.P. Dam'] = true;
	$lakeSpclGauges['Carp River at Maple Grove'] = true;
	$lakeSpclGauges['High Falls'] = true;

	$manualGauges = array();
	$manualGauges['High Falls Flow'] = true;

	$lakeGauges = array();
	$lakeGauges['Shabomeka Lake'] = true;
	$lakeGauges['Sharbot Lake'] = true;
	$lakeGauges['Bennett Lake'] = true;
	$lakeGauges['Dalhousie Lake'] = true;
	$lakeGauges['Palmerston Lake'] = true;
	$lakeGauges['Crotch Lake'] = true;

	$flowGauges = array();
	$flowGauges['Myers Cave flow'] = true;
	$flowGauges['Buckshot Creek flow'] = true;
	$flowGauges['Ferguson Falls flow'] = true;
	$flowGauges['Appleton flow'] = true;
	$flowGauges['Gordon Rapids flow'] = true;
	$flowGauges['Lanark Stream flow'] = true;
	$flowGauges['Mill of Kintail flow'] = true;
	$flowGauges['Kinburn flow'] = true;

	/**
	 * 
	**/
	function createTable($query, $hasFlow=false, $hasRain=false, $hasHist=true)
	{
		$outStr = '';

		$outStr = $outStr . '<br>
			<br>
			<table align="center" cellspacing="0" cellpadding="5" width=600 border=1 cellpadding=5>
				<tr>
					<td colspan=6>
						<center>
							<img src="../images/header2.jpg"/>
						</center>
					</td>
				</tr>
				<tr>
					<td colspan=6>
						<a href="javascript:history.back();">
							<font face="Arial" color="#000080">
								<img border="0" src="back.jpg" width="66" height="28" alt="Back" title="Back"/>
							</font>
						</a>
					</td>
				</tr>
				<tr>
					<th>
						Gauge
					</th>
					<th>
						Date
					</th>
					<th>
						Time
					</th>';

		if($hasFlow)
			$outStr = $outStr . '<th>Flow (cms)</th>';
		else
			$outStr = $outStr . '<th>Water Level (MASL)</th>';

		if($hasHist)
		{
			if($hasFlow)
				$outStr = $outStr . '<th>Historical Avg. (cms)</th>';
			else
				$outStr = $outStr . '<th>Historical Avg. (MASL)</th>';
		}
		if($hasRain)
			$outStr = $outStr . '<th>Precipitation (mm)</th>';

		$outStr = $outStr . '</tr>';

		while($row = mysql_fetch_array($query))
		{
			$datainfo = $row['datainfo'];
			$gauge = $row['gauge'];
			$date = $row['date'];
			$time = $row['time'];
			$hist = $row['historicalaverage'];//historical average
			$rain = $row['precipitation'];//precipitation

			/* 
			 * If historical average or precipitation are null,
			 * replace the null values with "Data Not Available"
			 */
			if($hist === null)
				$hist = "Data Not Available";
			if($rain === null)
				$rain = "";

			$outStr = $outStr . '<tr>';//Start of the row
			$outStr = $outStr . '<td>' . $gauge . '</td>';
			$outStr = $outStr . '<td>' . $date . '</td>';
			$outStr = $outStr . '<td>' . $time . '</td>';
			$outStr = $outStr . '<td>' . $datainfo . '</td>';

			/* 
			 * Don't add data for precipitation/historical 
			 * average columns where said columns do not exist
			 */
			if($hasHist)
				$outStr = $outStr . '<td>' . $hist . '</td>';
			if($hasRain)
				$outStr = $outStr . '<td>' . $rain . '</td>';

			$outStr = $outStr . '</tr>';//End of the row
		}

		$outStr = $outStr . '</table>';

		return $outStr;
	}

	/**
	 * 
	**/
	function createGraph($query, $hasRain=false, $hasHist=true)
	{
		while($row = mysql_fetch_array($query))
		{
			$date_data[] = $row['date'];
			$info_data[] = $row['datainfo'];
			$rain_data[] = $row['precipitation'];
			$hist_data[] = $row['historicalaverage'];
		}

		$graph_data = array('date'=>$date_data, 'waterlevel'=>$info_data);

		if($hasRain)
			$graph_data['precipitation'] = $rain_data;
		if($hasHist)
			$graph_data['historicalaverage'] = $hist_data;

		return json_encode($graph_data, JSON_NUMERIC_CHECK);
	}

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
	$table = '';
	$result = 'null';

	$query = mysql_query("SELECT * FROM data WHERE gauge='$gauge' AND `date` >= '$startdate' AND `date` <= '$enddate' ORDER BY date");

	if($type == "table")
	{
		if($lakeFlowGauges[$gauge])
			$table = createTable($query, true, true, false);
		elseif($lakeSpclGauges[$gauge])
			$table = createTable($query, false, false, false);
		elseif($manualGauges[$gauge])
			$table = createTable($query, true, false, false);
		elseif($lakeGauges[$gauge])
			$table = createTable($query, false, true);
		elseif($flowGauges[$gauge])
			$table = createTable($query, true, true);
		// where all the graph for all the weekly gauge levels are set since none of them include precipitation 
		else
			$table = createTable($query);

		
	}
	elseif($type == "graph")
	{
		if($lakeFlowGauges[$gauge])
			$F = 110;//5;
		elseif($lakeSpclGauges[$gauge])
			$F = 000;//4;
		elseif($manualGauges[$gauge])
			$F = 100;//3;
		elseif($lakeGauges[$gauge])
			$F = 011;//2;
		elseif($flowGauges[$gauge])
			$F = 111;//1;
		// where all the graph for all the weekly gauge levels are set since none of them include precipitation 
		else
			$F = 001;//0;

		if($lakeFlowGauges[$gauge])
			$result = createGraph($query, true, false);
		elseif($lakeSpclGauges[$gauge] || $manualGauges[$gauge])
			$result = createGraph($query, false, false);
		elseif($lakeGauges[$gauge] || $flowGauges[$gauge])
			$result = createGraph($query, true);
		else
			$result = createGraph($query);
	}

	$reader->insert('table', $table);
	$reader->insert('result', $result);
	$reader->insert('F', $F);
	$reader->insert('gauge', $gauge);
	echo $reader->read();

	mysql_close($con);//close connection to database
?>