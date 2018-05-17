<?php
	include $_SERVER['DOCUMENT_ROOT'].'/classes/HTMLReader.php';//Include the HTMLReader class
	include $_SERVER['DOCUMENT_ROOT'].'/classes/CustomTag.php';//include CustomTag if not already included
	include $_SERVER['DOCUMENT_ROOT'].'/header-footer/header-footer.php';

	$disclaimer = new CustomTag('mvc-disclaimer', $_SERVER['DOCUMENT_ROOT'].'/water-levels/mvc-disclaimer.html');
	$help = new CustomTag('mvc-help', $_SERVER['DOCUMENT_ROOT'].'/water-levels/mvc-help.html');

	$reader = new HTMLReader('water-levels.html');//Get the html file corresponding to this php file
	addHeaderFooter($reader);//Add the header and footer to this page
	$reader->insertTag($help);
	$reader->insertTag($disclaimer);
	echo $reader->read();//Display the modified contents of generate.html
?>