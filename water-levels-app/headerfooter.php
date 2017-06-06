<?php
	if(!class_exists('HTMLReader'))
		include 'HTMLReader.php';

	$themes = new HTMLReader('wp_themes.html');
	$header = new HTMLReader('siteheader.html');//Get the html file for the page header
	$footer = new HTMLReader('sitefooter.html');

	$themes->insert('greenearth', "http://mvc.on.ca/wp-content/themes/greenearth-v1-06/");
	$themes->insert('plugins', "http://mvc.on.ca/wp-content/plugins/");
	$themes->insert('shortcode', "/include/otw_components/otw_shortcode/css/");
	$themes->insert('google-font', "http://fonts.googleapis.com/css?family=Droid+Sans%3Asubset%3Dlatin%3An%2Ci%2Cb%2Cbi%7CDroid+Serif%3Asubset%3Dlatin%3An%2Ci%2Cb%2Cbi%7C&amp;ver=4.7.5");

	$header->insert('page-name', 'Water Levels & Flows');

	function addHeaderFooter($reader)
	{
		global $header;
		global $footer;
		global $themes;

		$reader->insert('wp-themes', $themes->read());
		$reader->insert('site-header', $header->read());
		$reader->insert('site-footer', $footer->read());
	}
?>