<?php
	include $_SERVER['DOCUMENT_ROOT'].'/water-levels/db.php';
	include $_SERVER['DOCUMENT_ROOT'].'/classes/HTMLReader.php';//include the HTMLReader class

	//connect to server
	$con = mysql_connect("localhost",$uN,$pW);
	//check connection
	if (!$con) {
		die('Could not connect: ' . mysql_error());
	}
	//select database
	mysql_select_db($db);

	$cols = array(
		'Flow Rate'=>"datainfo",
		'Water Level'=>"datainfo",
		'Historical Average'=>"historicalaverage",
		'Historical Minimum'=>null,
		'Historical Maximum'=>null,
		'Precipitation'=>"precipitation"
	);

	$tsId = $_GET['ts_id'];
	$column = $_GET['col'];
	$from = $_GET['from'];
	$to = $_GET['to'];

	$columns = "date,time";
	$keys = "`tsdata`.`gauge` = `data`.`gauge`";
	$cond = "`ts_id` = '$tsId' AND '$from' <= `date` AND `date` <= '$to'";
	$order = "`date`";

	if($cols[$column] !== null)
		$columns = $columns.",".$cols[$column];

	$sqlStr = "SELECT $columns FROM `tsdata` INNER JOIN `data` ON $keys WHERE $cond ORDER BY $order";
	$query = mysql_query($sqlStr);

	while($row = mysql_fetch_array($query))
	{
		$val = null;
		if($cols[$column] !== null)
			$val = $row[$cols[$column]];

		$date_dat[] = $row['date'];
		$time_dat[] = $row['time'];
		$vals_dat[] = $val;
	}

	$sql_dat = array(
		'Date'=>$date_dat,
		'Time'=>$time_dat,
		'Data'=>$vals_dat
	);

	echo json_encode($sql_dat, JSON_NUMERIC_CHECK);
	mysql_close($con);//close connection to database
?>