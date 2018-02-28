<?php
	include $_SERVER['DOCUMENT_ROOT'].'/classes/HTMLReader.php';//Include the HTMLReader class
	include $_SERVER['DOCUMENT_ROOT'].'/header-footer/header-footer.php';

	$reader = new HTMLReader('water-levels.html');//Get the html file corresponding to this php file
	addHeaderFooter($reader);//Add the header and footer to this page
	echo $reader->read();//Display the modified contents of generate.html
?>