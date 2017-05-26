<?php
	include 'HTMLReader.php';
	include 'TableLoader.php';

	mysql_connect("localhost","mvconc55_levels1","4z9!yA");
	mysql_select_db("mvconc55_mvclevels");

	$table = new TableLoader();//Create an instance of a TableLoader object, to be used by the ataglance.php file
	$reader = new HTMLReader('ataglance.html');

	$flow = $table->getFlowData();
	$daily = $table->getDailyLakeData();
	$weekly = $table->getWeeklyLakeData();

	$reader->insert('flow-data', $flow);
	$reader->insert('daily-data', $daily);
	$reader->insert('weekly-data', $weekly);

	echo $reader->read();
?>