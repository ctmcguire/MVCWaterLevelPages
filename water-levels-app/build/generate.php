<?php
	include 'HTMLReader.php';

	$reader = new HTMLReader('generate.html');

	$startDate = date("Y-m-d",strtotime('-2 week'));
	$reader->insert('start-date', $startDate);
?>