<?php
	include '../db.php';
	include '../classes/HTMLReader.php';
	include '../header-footer/header-footer.php';
	$reader = new HTMLReader('gauge-data.html');

	/* 
	 * The lake outflow gauges; measures flow and precipitation
	 */
	$lakeFlowGauges = array();
	$lakeFlowGauges['Bennett Lake Outflow'] = true;
	$lakeFlowGauges['Dalhousie Lake Outflow'] = true;

	/* 
	 * The lake gauges (plus the one Carp River gauge) that only measure water levels
	 */
	$lakeSpclGauges = array();
	$lakeSpclGauges['Farm Lake'] = true;
	$lakeSpclGauges['C.P. Dam'] = true;
	$lakeSpclGauges['Carp River at Maple Grove'] = true;
	$lakeSpclGauges['High Falls'] = true;

	/* 
	 * The manual gauges (or gauge, as is currently the case); only measures flow
	 */
	$manualGauges = array();
	$manualGauges['High Falls Flow'] = true;

	/* 
	 * The normal lake gauges; measures water levels, precipitation, and has historical averages
	 */
	$lakeGauges = array();
	$lakeGauges['Shabomeka Lake'] = true;
	$lakeGauges['Sharbot Lake'] = true;
	$lakeGauges['Bennett Lake'] = true;
	$lakeGauges['Dalhousie Lake'] = true;
	$lakeGauges['Palmerston Lake'] = true;
	$lakeGauges['Crotch Lake'] = true;

	/* 
	 * The normal flow gauges; measures flow, precipitation, and has historical averages
	 */
	$flowGauges = array();
	$flowGauges['Myers Cave Flow'] = true;
	$flowGauges['Buckshot Creek Flow'] = true;
	$flowGauges['Ferguson Falls Flow'] = true;
	$flowGauges['Appleton Flow'] = true;
	$flowGauges['Gordon Rapids Flow'] = true;
	$flowGauges['Lanark Stream Flow'] = true;
	$flowGauges['Mill of Kintail Flow'] = true;
	$flowGauges['Kinburn Flow'] = true;

	/* 
	 * There is no array for the weekly lake gauges, since it isn't necessary, but they measure water 
	 * levels and have historical averages
	 */


	/**
	 * This function takes an sql query and 3 boolean values, and returns a string containing a table 
	 * with the values returned by the sql query.
	 * 
	 * @param $query - sql query used to get the table data
	 * @param $hasFlow - boolean value representing whether or not the gauge measures flow (gauges that 
	 *                do not measure flow are assumed to measure water level); defaults to false
	 * @param $hasRain - boolean value representing whether or not the gauge measures precipitation; 
	 *                defaults to false
	 * @param $hasHist - boolean value representing whether or not the gauge has historical averages; 
	 *                defaults to true
	 * 
	 * @returns - A string containing html code for a table filled with the data returned by the sql 
	 *         query
	 * 
	 * Example usage:
	 * 					createTable($query, false, false, false);
	 * The above example returns an html table for a gauge that only measures water level (we will 
	 * assume that $query contains the correct sql query to do this).
	**/
	function createTable($query, $hasFlow=false, $hasRain=false, $hasHist=true)
	{
		$outStr = '';

		$outStr = $outStr . '<table align="center" cellspacing="0" cellpadding="5" width=600 border=1 cellpadding=5>
				<tr>
					<th>
						Date
					</th>
					<th>
						Time
					</th>';//Create the table and add the headers that are always the same

		if($hasFlow)
			$outStr = $outStr . '<th>Flow (cms)</th>';//Add the flow header if the gauge measures it
		else
			$outStr = $outStr . '<th>Water Level (MASL)</th>';//Otherwise (for the time being) add the water level header instead

		if($hasHist)
		{
			if($hasFlow)
				$outStr = $outStr . '<th>Historical Avg. (cms)</th>';//Add the historical average header (with the correct unit of measurement) if the gauge has one
			else
				$outStr = $outStr . '<th>Historical Avg. (MASL)</th>';
		}
		if($hasRain)
			$outStr = $outStr . '<th>Precipitation (mm)</th>';//Add the precipitation header if the gauge measures it

		$outStr = $outStr . '</tr>';//Add the end of the header row

		while($row = mysql_fetch_array($query))
		{
			$datainfo = $row['datainfo'];
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
				$rain = "Data Not Available";

			$outStr = $outStr . '<tr>';
			$outStr = $outStr . '<td>' . $date . '</td>';
			$outStr = $outStr . '<td>' . $time . '</td>';
			$outStr = $outStr . '<td>' . $datainfo . '</td>';//Add the data all gauges measure

			/* 
			 * Don't add data for precipitation/historical 
			 * average columns where said columns do not exist
			 */
			if($hasHist)
				$outStr = $outStr . '<td>' . $hist . '</td>';//Add the historical average measurements if they exist
			if($hasRain)
				$outStr = $outStr . '<td>' . $rain . '</td>';//Add the precipitation measurements if they exist

			$outStr = $outStr . '</tr>';
		}

		$outStr = $outStr . '</table>';//Add the end of the table

		return $outStr;//return the output string
	}

	/**
	 * This function takes an sql query and 2 boolean values, and returns a json string containing a 
	 * JavaScript object with the graph's chart data.  
	 * 
	 * @param $query - sql query used to get the graph data
	 * @param $hasRain - boolean value representing whether or not the gauge measures precipitation; 
	 *                defaults to false
	 * @param $hasHist - boolean value representing whether or not the gauge has historical averages; 
	 *                defaults to true
	 * 
	 * @returns - A JavaScript object that contains the gauge's graph data as a json string
	 * 
	 * Example usage:
	 * 					createGraph($query, false, false);
	 * The above example returns a json string containing the graph data for a gauge that does not have 
	 * precipitation or historical average measurements (we will again assume that $query contains the 
	 * correct sql query to do this).
	**/
	function createGraph($query, $hasRain=false, $hasHist=true)
	{
		/* 
		 * Get the data from each row returned by the sql query
		 */
		while($row = mysql_fetch_array($query))
		{
			$date_data[] = $row['date'];
			$info_data[] = $row['datainfo'];
			$rain_data[] = $row['precipitation'];
			$hist_data[] = $row['historicalaverage'];
		}

		$graph_data = array('date'=>$date_data, 'waterlevel'=>$info_data);//Add the data that all gauges have

		if($hasRain)
			$graph_data['precipitation'] = $rain_data;//Only add precipitation data if the gauge measures it
		if($hasHist)
			$graph_data['historicalaverage'] = $hist_data;//Only add historical average data if the gauge has measurements for it

		return json_encode($graph_data, JSON_NUMERIC_CHECK);//Encode the object into a json string and return it
	}

	//connect to server
	$con = mysql_connect("localhost",$uN,$pW);

	//check connection
	if (!$con) {
		die('Could not connect: ' . mysql_error());
	}
	//select database
	mysql_select_db($db);

	//set the values to be called in sql query, taken from the form on the previous page 
	$gauge = $_POST['gauge'];
	$startdate = $_POST['startdate'];
	$enddate = $_POST['enddate'];
	$type = $_POST['type'];
	
	$F = 0;//Contains a 3 digit binary number representing 3 boolean values (hasFlow, hasRain, and hasHist)
	$table = '';//table defaults to the empty string
	$result = 'null';//result defaults to a string containing the word null

	$query = mysql_query("SELECT * FROM data WHERE gauge='$gauge' AND `date` >= '$startdate' AND `date` <= '$enddate' ORDER BY date");

	if($type == "table")
	{
		/* 
		 * $table is set to the html string returned by createTable if a table is requested
		 */
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
		/* 
		 * $F gets set to a 3 digit binary number that is based on what measurements the gauge has
		 */
		if($lakeFlowGauges[$gauge])
			$F = 110;
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
			$F = 001;
		
		/* 
		 * $result gets set to the json string returned by createGraph if a graph is requested
		 */
		if($lakeFlowGauges[$gauge])
			$result = createGraph($query, true, false);
		elseif($lakeSpclGauges[$gauge] || $manualGauges[$gauge])
			$result = createGraph($query, false, false);
		elseif($lakeGauges[$gauge] || $flowGauges[$gauge])
			$result = createGraph($query, true);
		else
			$result = createGraph($query);
	}

	$reader->insert('table', $table);//Replace the <$table/> placeholder with the value of $table
	$reader->insert('result', $result);//Replace the <$result/> placeholder with the value of $result
	$reader->insert('F', $F);//Replace the <$F/> placeholder with the value of $F
	$reader->insert('gauge', $gauge);//Replace the <$gauge/> placeholder with the value of $gauge

	addHeaderFooter($reader, $gauge);
	echo $reader->read();//display the html file on the web page

	mysql_close($con);//close connection to database
?>