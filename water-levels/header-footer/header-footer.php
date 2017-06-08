<?php
	if(!class_exists('HTMLReader'))
		include 'https://www.mvc.on.ca/water-levels/classes/HTMLReader.php';

	$themes = new HTMLReader('/home/mvconc55/public_html/water-levels/header-footer/wp-themes.html');
	$header = new HTMLReader('/home/mvconc55/public_html/water-levels/header-footer/wp-header.html', true);
	$footer = new HTMLReader('/home/mvconc55/public_html/water-levels/header-footer/wp-footer.html', true);

	$themes->insert('greenearth', "http://mvc.on.ca/wp-content/themes/greenearth-v1-06/");
	$themes->insert('plugins', "http://mvc.on.ca/wp-content/plugins/");
	$themes->insert('shortcode', "/include/otw_components/otw_shortcode/css/");
	$themes->insert('google-font', "http://fonts.googleapis.com/css?family=Droid+Sans%3Asubset%3Dlatin%3An%2Ci%2Cb%2Cbi%7CDroid+Serif%3Asubset%3Dlatin%3An%2Ci%2Cb%2Cbi%7C&amp;ver=4.7.5");

	function addHeaderFooter($reader, $name="Water Levels & Flows")
	{
		global $header;
		global $footer;
		global $themes;

		$header->insert('page-name', $name);

		$reader->insert('wp-themes', $themes->read());
		$reader->insert('wp-header', $header->read());
		$reader->insert('wp-footer', $footer->read());
	}
?>