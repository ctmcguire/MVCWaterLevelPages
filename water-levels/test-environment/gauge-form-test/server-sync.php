<?php
	echo '<script type="text/javascript">';
	echo 'console.log(window.location.href);';
	if(!empty($_GET['sync-data']))
	{
		if(!file_exists('staff-readings.dat'))
		{
			$file = fopen('staff-readings.dat', 'w');
			fclose($file);
		}
		$len = file_put_contents('staff-readings.dat', $_GET['sync-data'] . '\n', FILE_APPEND);
		echo 'window.localStorage.removeItem("local-queue");';
	}
	echo 'window.location.assign("./");';
	echo '</script>';
?>