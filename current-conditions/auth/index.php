<?php
	include 'authenticate.php';
	include $_SERVER['DOCUMENT_ROOT'].'/classes/HTMLReader.php';
	include $_SERVER['DOCUMENT_ROOT'].'/header-footer/header-footer.php';

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
	function login() {
		$reader = new HTMLReader('login.html');
		addHeaderFooter($reader, 'WIP - Watershed Conditions Statement (Editing)');
		echo $reader->read();
		return 0;
	}

	function saveData()
	{
		$title = $_POST['title'];
		$fld = $_POST['flood'];
		$drt = $_POST['drought'];
		$statement = $_POST['statement'];

		if(is_null($title) || is_null($img) || is_null($statement))
			return false;
		$statement = str_replace('"','\\\\\\"',str_replace("\r\n",'',$statement));
		$json = '{"title": "'.$title.'","img": { "flood":"'.$fld.'", "drought":"'.$drt.'"},"statement": "'.$statement.'"}';

		$len = file_put_contents('../current-conditions.json',$json);
		return true;
	}

	function loadData()
	{
		$reader = new HTMLReader('current-conditions.html');
		$json = new HTMLReader('../current-conditions.json');
		$reader->insert('json', $json->read());
		addHeaderFooter($reader, 'WIP - Watershed Conditions Statement (Editing)');
		echo $reader->read();
		return 0;
	}

	function loadPage($authenticate)
	{
		if(!authenticate($authenticate))
			return login();
		return loadData();
	}

	saveData();
	loadPage($authenticate);
?>