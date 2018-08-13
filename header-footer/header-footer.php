<?php
	if(!class_exists('HTMLReader'))
		include $_SERVER['DOCUMENT_ROOT'].'/classes/HTMLReader.php';//include HTMLReader if not already included
	if(!class_exists('CustomTag'))
		include $_SERVER['DOCUMENT_ROOT'].'/classes/CustomTag.php';//include CustomTag if not already included

	/* 
	 * Set up the HTMLReaders and CustomTags
	 */
	$themes = new HTMLReader($_SERVER['DOCUMENT_ROOT'].'/header-footer/wp-themes.html');
	$header = new HTMLReader($_SERVER['DOCUMENT_ROOT'].'/header-footer/wp-header.html');
	$content = new CustomTag('wp-content', $_SERVER['DOCUMENT_ROOT'].'/header-footer/wp-content.html');
	$sideRight = new CustomTag('wp-sidebar-right', $_SERVER['DOCUMENT_ROOT'].'/header-footer/wp-sidebar-right.html');
	$footer = new HTMLReader($_SERVER['DOCUMENT_ROOT'].'/header-footer/wp-footer.html');

	/**
	 * This function adds the header, footer, wordpress themes, and page-container tags to the given HTMLReader
	 * 
	 * @param $reader 	- The HTMLReader to be given themes/header/footer/content
	 * @param $name 		- The name to be displayed in the header portion; defaults to "Water Levels & Flows"
	**/
	function addHeaderFooter($reader, $name="Water Levels & Flows")
	{
		global $header;
		global $content;
		global $sideRight;
		global $footer;
		global $themes;

		$header->insert('page-name', $name);

		$reader->insert('wp-themes', $themes->read());
		$reader->insert('wp-header', $header->read());
		$reader->insertTag($content);
		$reader->insertTag($sideRight);
		$reader->insert('wp-footer', $footer->read());
		$reader->insert('page-name', $name);
	}
?>