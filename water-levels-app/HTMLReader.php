<?php
	/**
	 * This class contains functions that 
	**/
	class HTMLReader
	{
		private $html;

		function HTMLReader($file="")
		{
			$this->html = file_get_contents($file);
		}

		public function insert($placeholder, $data="")
		{
			$this->html = str_replace('<$'.$placeholder.'/>', $data, $this->html);
		}
		public function read()
		{
			return $this->html;
		}
	}
?>