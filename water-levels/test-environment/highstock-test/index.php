<?php
	include '../../db.php';
	include '../classes/HTMLReader.php';
	include '../header-footer/header-footer.php';
	$reader = new HTMLReader('highstock-test.html');

	//set the values to be called in sql query, taken from the form on the previous page 
	$id = $_GET['ts_id'];//$_POST['ts_id'];
	$from = $_GET['from'];//$_POST['startdate'];
	$to = $_GET['to'];//$_POST['enddate'];
	$type = $_GET['type'];//$_POST['type'];

	$load = "(function(){})";

	if($type == "table")
		$load = "loadTable";
	elseif($type == "graph")
		$load = "makeData";

	//connect to server
	$con = mysql_connect("localhost",$uN,$pW);
	//check connection
	if (!$con) {
		die('Could not connect: ' . mysql_error());
	}
	//select database
	mysql_select_db($db);

	$query = mysql_query("SELECT gauge FROM tsdata WHERE ts_id='$id'");
	while($row = mysql_fetch_array($query))
	{
		$gauge = $row['gauge'];
	}

	$reader->insert('load', $load);//Replace the <$load/> placeholder with the value of $load
	$reader->insert('id', $id);//Replace the <$id/> placeholder with the value of $id
	$reader->insert('from', $from);//Replace the <$gauge/> placeholder with the value of $gauge
	$reader->insert('to', $to);
	$reader->insert('gauge', $gauge);
	addHeaderFooter($reader, $gauge);
	echo $reader->read();//display the html file on the web page
?>