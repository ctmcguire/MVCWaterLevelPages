<?php
	include 'HTMLReader.php';//include the HTMLReader class
	include 'TableLoader.php';//include the TableLoader class
	include 'headerfooter.php';

	mysql_connect("localhost","mvconc55_levels1","4z9!yA");
	mysql_select_db("mvconc55_mvclevels");

	$table = new TableLoader();//Create an instance of a TableLoader object
	$reader = new HTMLReader('ataglance.html');//Create an instance of an HTMLReader object, using the ataglance.html file

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