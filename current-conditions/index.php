<?php
	include '../classes/HTMLReader.php';
	include '../header-footer/header-footer.php';

	$sidebar = new HTMLReader('sidebar.html');

	$reader = new HTMLReader('current-conditions.html');
	addHeaderFooter($reader, 'WIP - Watershed Conditions');
	$reader->insert('sidebar-right', $sidebar->read());
	echo $reader->read();
?>