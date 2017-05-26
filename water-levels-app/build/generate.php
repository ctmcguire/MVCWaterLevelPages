<?php
	include 'HTMLReader.php';//Include the HTMLReader class

	$reader = new HTMLReader('generate.html');//Get the html file corresponding to this php file

	$startDate = date("Y-m-d",strtotime('-2 week'));//Get the date value of 2 weeks ago

	$reader->insert('start-date', $startDate);//Replace all instances of the <$start-date/> placeholder with the value stored in $startDate
	echo $reader->read();//Display the modified contents of generate.html
?>