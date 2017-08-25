<!--
	The editor for this page is located at mcv.on.ca/wcm-update
-->
<?php
	include $_SERVER['DOCUMENT_ROOT'].'/classes/HTMLReader.php';//Include HTMLReader for replacing code in the html file
	include $_SERVER['DOCUMENT_ROOT'].'/header-footer/header-footer.php';//include header-footer to add the header and footers

	$sidebar = new HTMLReader('sidebar.html');//get the sidebar content

	$reader = new HTMLReader('watershed-conditions-message.html');
	addHeaderFooter($reader, 'Watershed Conditions Message');
	$reader->insert('sidebar-right', $sidebar->read());//add the sidebar
	echo $reader->read();
?>