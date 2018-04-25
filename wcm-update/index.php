<?php
	include 'authenticate.php';
	include $_SERVER['DOCUMENT_ROOT'].'/classes/HTMLReader.php';//Include HTMLReader for replacing code in the html file
	include $_SERVER['DOCUMENT_ROOT'].'/header-footer/header-footer.php';//include header-footer to add the header and footers

	/**
	 * This function checks if the user has entered their username and/or password, and if they are correct
	 * 
	 * @param $authenticate - data to check against
	 * 
	 * @returns - false if the username and/or password is missing or incorrect
	 * @returns - true, otherwise
	**/
	function authenticate($authenticate)
	{
		$un = $_POST['un'];
		$pw = $_POST['pw'];

		if(is_null($un) || is_null($pw))
			return false;
		if(is_null($authenticate[$un]))
			return false;
		return ($authenticate[$un] === $pw);
	}
	/**
	 * This function displays the login page to the user
	 * 
	 * @return 	- 0 upon success
	**/
	function login()
	{
		$reader = new HTMLReader('login.html');
		addHeaderFooter($reader, 'Watershed Conditions Message (Editor)');
		echo $reader->read();
		return 0;
	}

	/**
	 * This function checks if the watershed conditions are valid and writes them to the json file
	 * 
	 * @return 	- 1 if data is invalid
	 * @return 	- 0 otherwise
	**/
	function saveData()
	{
		$timestamp = $_POST['timestamp'];
		$title = $_POST['title'];
		$fld = $_POST['flood'];
		$drt = $_POST['drought'];
		$sws = $_POST['sub-watersheds'];
		$message = $_POST['message'];

		if(is_null($title) || is_null($fld) || is_null($drt) || is_null($message))
			return 1;
		$message = str_replace('"','\\\\\\"',str_replace("\r\n",'',$message));
		$json = '{'
			.'"timestamp": "'.$timestamp.'",'
			.'"title": "'.$title.'",'
			.'"img": {'
				.'"flood":"'.$fld.'",'
				.'"drought":"'.$drt.'"'
			.'},'
			.'"sub-watersheds": '.$sws.','
			.'"message": "'.$message.'"'
		.'}';

		$len = file_put_contents($_SERVER['DOCUMENT_ROOT'].'/watershed-conditions-message/watershed-conditions-message.json',$json);
		return 0;
	}

	/**
	 * This function loads the watershed conditions's json data and displays the editor page
	 * 
	 * @return 	- 0 if successful
	**/
	function loadData()
	{
		$reader = new HTMLReader('wcm-update.html');
		$json = new HTMLReader($_SERVER['DOCUMENT_ROOT'].'/watershed-conditions-message/watershed-conditions-message.json');
		$reader->insert('json', str_replace("'", "\\'", $json->read()));
		addHeaderFooter($reader, 'Watershed Conditions Message (Editor)');
		echo $reader->read();
		return 0;
	}

	/**
	 * This function loads the correct page for this url
	 * 
	 * @param $authenticate 	- data to check against
	 * 
	 * @return 	- 0 if the respective page is loaded successfully
	**/
	function loadPage($authenticate)
	{
		if(!authenticate($authenticate))
			return login();
		return loadData();
	}

	/* 
	 * save the watershed conditions message;
	 * alert the user if the message is successfully saved
	 */
	if(saveData() === 0)
		echo '<script>alert("Message changes successfully updated");</script>';
	loadPage($authenticate);//load the correct page (login or editor)
?>