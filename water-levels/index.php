<?php
	include $_SERVER['DOCUMENT_ROOT'].'/classes/HTMLReader.php';//Include the HTMLReader class
	include $_SERVER['DOCUMENT_ROOT'].'/header-footer/header-footer.php';

	$reader = new HTMLReader('water-levels.html');//Get the html file corresponding to this php file
	$startDate = date("Y-m-d",strtotime('-2 week'));//Get the date value of 2 weeks ago
	$reader->insert('start-date', $startDate);//Replace all instances of the <$start-date/> placeholder with the value stored in $startDate

	addHeaderFooter($reader);//Add the header and footer to this page

	echo $reader->read();//Display the modified contents of generate.html
?>