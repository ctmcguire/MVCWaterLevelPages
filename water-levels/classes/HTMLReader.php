<?php
	/**
	 * This class contains functions to help read an html file in php,
	 * and make the necessary alterations before displaying it
	**/
	class HTMLReader
	{
		private $html;//The contents of the html file being opened

		/**
		 * The constructor function for HTMLReader takes the name of 
		 * the html file to be opened (note: this includes the file 
		 * extension), and uses it to construct an HTMLReader Object.
		 * 
		 * @param $file - The name of the file to be opened, including
		 *             the file extention.
		 * @param $home - boolean value that idicates that the file starts from www.mvc.on.ca/water-levels, and not the current directory
		 * 
		 * @returns - constructors do not return
		 * 
		 * Example usage: $htmlReader = new HTMLReader('file.html');
		 * The above example will create a new HTMLReader Object,
		 * and stores it in the $htmlReader variable (This variable
		 * name will be reused in later examples)
		**/
		function HTMLReader($file, $home=false)
		{
			if($home)
				$file = "https://www.mvc.on.ca/water-levels/" + $file;
			$this->html = file_get_contents($file, $home);
		}

		/**
		 * This function takes a placeholder string and a data string,
		 * and replaces all of the placeholder tags in the opened html
		 * file with the value stored in the data string.
		 * 
		 * @param $placeholder - the name of the placeholder tag to be
		 *                    replaced.
		 * @param $data - the data to replace all instances of the 
		 *             placeholder tag with.  Defaults to the empty 
		 *             string.
		 * 
		 * @returns - void
		 * 
		 * Example usage: $htmlReader->insert("example", 
		 *                               '<p>This is an example</p>');
		 * The above example will replace all instances of
		 * '<$example/>' with '<p>This is an example</p>'.
		**/
		public function insert($placeholder, $data="")
		{
			$this->html = str_replace('<$'.$placeholder.'/>', $data, $this->html);
		}
		
		/**
		 * This function returns the contents of the file, with any
		 * modifications made using the insert function.
		 * 
		 * @returns - The value currently contained in the HTMLReader's
		 *         $html variable, presumably to display it using echo.
		 * 
		 * Example usage: echo $htmlReader->read();
		 * The above example will write the contents of the html file
		 * to the webpage, displaying it to the end user.
		**/
		public function read()
		{
			return $this->html;
		}
	}
?>