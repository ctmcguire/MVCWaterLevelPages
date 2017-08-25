<?php
	include $_SERVER['DOCUMENT_ROOT'].'/water-levels/db.php';
	include $_SERVER['DOCUMENT_ROOT'].'/classes/HTMLReader.php';//include the HTMLReader class
	include $_SERVER['DOCUMENT_ROOT'].'/header-footer/header-footer.php';
	$reader = new HTMLReader('highstock-test.html');

	//set the values to be called in sql query, taken from the form on the previous page 
	$id = $_GET['ts_id'];//$_POST['ts_id'];//(may switch this over to the gauge name)
	$from = $_GET['from'];//$_POST['from'];
	$to = $_GET['to'];//$_POST['to'];
	$type = $_GET['type'];//$_POST['type'];

	$load = "(function(){})";//default value if $type is invalid

	if($type === "table")
		$load = "loadTable";//if $type is "table", load the table
	elseif($type === "graph" || $type === "chart")
		$load = "makeData";//if $type is "graph" (or "chart" because I kept thinking I had this set to "chart" and not "graph")

	//connect to server
	$con = mysql_connect("localhost",$uN,$pW);
	//check connection
	if (!$con) {
		die('Could not connect: ' . mysql_error());//fail if unable to connect to the sql database
	}
	//select database
	mysql_select_db($db);

	$query = mysql_query("SELECT gauge FROM tsdata WHERE ts_id='$id'");//this should be changed to use the gauge name instead, so that existing code to access gauge-data can remain unchanged
	while($row = mysql_fetch_array($query))
	{
		$gauge = $row['gauge'];//there SHOULD only be one row in the result, but maybe it should break after the first one just in case
	}

	$reader->insert('load', $load);//insert the function to load the display
	$reader->insert('id', $id);//insert the timeseries id
	$reader->insert('from', $from);//insert the start date
	$reader->insert('to', $to);//insert the end date
	$reader->insert('gauge', $gauge);//insert the gauge name
	addHeaderFooter($reader, $gauge);
	echo $reader->read();//display the html file on the web page
?>