<?php
	$online = false;
	include '../../classes/HTMLReader.php';//include the HTMLReader class
	include '../../classes/CustomTag.php';
	include '../../header-footer/header-footer.php';

	$reader = new HTMLReader('gauge-form-test.html');//reload page every time?
	addHeaderFooter($reader, 'Staff Gauge Readings');
	echo $reader->read();
?>