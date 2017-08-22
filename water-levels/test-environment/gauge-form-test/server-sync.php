<?php
	echo '<script type="text/javascript">';
	//echo 'console.log(window.location.href);';
	/* 
	 * don't do anything if no data was received
	 */
	if(!empty($_GET['sync-data']))
	{
		if(!file_exists('staff-readings.dat'))
		{
			$file = fopen('staff-readings.dat', 'w');//create the file if it does not exist
			fclose($file);
		}
		$len = file_put_contents('staff-readings.dat', $_GET['sync-data'] . '\n', FILE_APPEND);//add the data to the end of the staff-readings file
		echo 'window.localStorage.removeItem("local-queue");';//there should probably be a check before this to make sure nothing went wrong while writing to the file
	}
	echo 'window.location.assign("./");';//return to the gauge-form-test page
	echo '</script>';//close the tag
?>