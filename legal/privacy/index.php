<?php
	include $_SERVER['DOCUMENT_ROOT'].'/classes/HTMLReader.php';//Include the HTMLReader class
	include $_SERVER['DOCUMENT_ROOT'].'/classes/CustomTag.php';//include CustomTag if not already included
	include $_SERVER['DOCUMENT_ROOT'].'/header-footer/header-footer.php';

	$reader = new HTMLReader('privacy.html', 'Privacy');//Get the html file corresponding to this php file
	addHeaderFooter($reader);//Add the header and footer to this page
	echo $reader->read();//Display the modified contents of generate.html
?>