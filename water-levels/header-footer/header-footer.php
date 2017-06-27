<?php
	if(!class_exists('HTMLReader'))
		include '../classes/HTMLReader.php';
	if(!class_exists('HTMLReader'))
		include '../classes/CustomTag.php';

	$themes = new HTMLReader('/home/mvconc55/public_html/water-levels/header-footer/wp-themes.html');
	$header = new HTMLReader('/home/mvconc55/public_html/water-levels/header-footer/wp-header.html');
	$content = new CustomTag('wp-content', '/home/mvconc55/public_html/water-levels/header-footer/wp-footer.html');
	$footer = new HTMLReader('/home/mvconc55/public_html/water-levels/header-footer/wp-footer.html');

	$themes->insert('greenearth', '/wp-content/themes/greenearth-v1-06/');
	$themes->insert('plugins', '/wp-content/plugins/');
	$themes->insert('shortcode', '/include/otw_components/otw_shortcode/css/');
	$themes->insert('google-font', 'https://fonts.googleapis.com/css?family=Droid+Sans%3Asubset%3Dlatin%3An%2Ci%2Cb%2Cbi%7CDroid+Serif%3Asubset%3Dlatin%3An%2Ci%2Cb%2Cbi%7C&amp;ver=4.7.5');

	function addHeaderFooter($reader, $name="Water Levels & Flows")
	{
		global $header;
		global $content;
		global $footer;
		global $themes;

		$header->insert('page-name', $name);

		$reader->insert('wp-themes', $themes->read());
		$reader->insert('wp-header', $header->read());
		$reader->insertTag($content);
		$reader->insert('wp-footer', $footer->read());
	}
?>