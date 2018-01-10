<?php
	include '../water-levels/db.php';
	include $_SERVER['DOCUMENT_ROOT'].'/classes/HTMLReader.php';//include the HTMLReader class
	include $_SERVER['DOCUMENT_ROOT'].'/classes/TableLoader.php';//include the TableLoader class
	include $_SERVER['DOCUMENT_ROOT'].'/header-footer/header-footer.php';

	mysql_connect("localhost",$uN,$pW);
	mysql_select_db($db);

	$table = new TableLoader();//Create an instance of a TableLoader object
	$reader = new HTMLReader('current-conditions.html');//Create an instance of an HTMLReader object, using the ataglance.html file

	/* 
	 * Get the rows for all of the gauges
	 */
	$flow = $table->getFlowData();
	$daily = $table->getDailyLakeData();
	$weekly = $table->getWeeklyLakeData();

	/* 
	 * Replace the placeholder tags with the rows for their respective gauges
	 */
	$reader->insert('flow-data', $flow);
	$reader->insert('daily-data', $daily);
	$reader->insert('weekly-data', $weekly);

	addHeaderFooter($reader, "Most Recent Watershed Summary");
	echo $reader->read();//display the html file
?>