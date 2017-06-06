<?php
	include 'HTMLReader.php';//Include the HTMLReader class

	$header = new HTMLReader('siteheader.html');//Get the html file for the page header
	$reader = new HTMLReader('generate.html');//Get the html file corresponding to this php file
	$footer = new HTMLReader('sitefooter.html');

	$startDate = date("Y-m-d",strtotime('-2 week'));//Get the date value of 2 weeks ago

	$header->insert('page-name', 'Water Levels & Flows');

	$reader->insert('start-date', $startDate);//Replace all instances of the <$start-date/> placeholder with the value stored in $startDate
	$reader->insert('site-header', $header->read());
	$reader->insert('site-footer', $footer->read());
	echo $reader->read();//Display the modified contents of generate.html
?>