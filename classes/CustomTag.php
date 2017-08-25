<?php
	/**
	 * This class contains functions and properties to create a custom tag that references specific html code, and can be 
	 * used in combination with HTMLReader to insert the referenced code in place of the custom tags
	**/
	class CustomTag
	{
		private $tag;//The name for the custom tag
		private $html;//The html code that this custom tag represents

		/**
		 * The constructor function for CustomTag takes the tag name and the source file for its html code (including the 
		 * file extension) and creates a CustomTag Object
		 * 
		 * @param $tag 	- The name for the tag that will be replaced by the CustomTag's html code
		 * @param $html 	- The html code that will replace this CustomTag's tag
		**/
		function CustomTag($tag, $src)
		{
			$this->tag = $tag;
			$this->html = file_get_contents($src);
		}

		/**
		 * The insertHTML function is used to replace all instances of this CustomTag's tag with its html code.  This 
		 * function is used in HTMLReader's insertTag function.
		 * 
		 * @param $html 	- The html code to be modified
		 * 
		 * @return 	- $html if this CustomTag's html code does not contain <$innerHTML/>
		 * @return 	- The modified html code otherwise
		**/
		public function insertHTML($html)
		{
			$i = strpos($this->html, '<$innerHTML/>');//find the start position for the tag's innerHTML
			if($i === false)
				return $html;//return the unmodified $html code if <$innerHTML/> was not found in this CustomTag's html
			$j = $i + strlen('<$innerHTML/>');//find the end position for the tag's innerHTML

			$tagOpen = substr($this->html, 0, $i);//Open tag is replaced by all html preceding <$innerHTML/>
			$tagClose = substr($this->html, $j);//Close tag is replaced by all html after <$innerHTML/>

			$freq = substr_count($html,'</$'.$this->tag.'>');//End tags are always the same, so this gets the frequency of this CustomTag in $html
			$k = 0;//loop iterator
			for($k = 0; $k < $freq; $k++)
			{
				$tags = $this->getAttributes($tagOpen, $html);//Get the next opening tag from html and the opening tag to replace it with
				if($tags === false)
					break;//If getAttributes returned false, there are no more occurences of this CustomTag in $html left
				$html = str_replace($tags[0], $tags[1], $html);//replace the opening tags in $html and repeat in case others with different attributes are also in $html
			}
			return str_replace('</$'.$this->tag.'>', $tagClose, $html);//Replace every closing tag in $html (which is significantly easier since closing tags are always identical)
		}

		/**
		 * The getAttributes function is used by the insertHTML function to handle finding the tag in the specified html 
		 * code and inserting the values for the CustomTag's html attributes.
		 * 
		 * @param $tagOpen 	- this tag's html code before its innerHTML
		 * @param $html 		- the html code to replace
		 * 
		 * @return 	- false if the CustomTag's tag was not found in $html
		 * @return 	- an array containing the tag as it appears in $html and the $tagOpen value if the tag was found in 
		 * 			$html without html attributes
		 * @return 	- an array containing the tag and its attributes as they appear in $html and the value of $tagOpen with
		 * 			 its attributes inserted if the tag was found in $html with html attributes
		**/
		private function getAttributes($tagOpen, $html) {
			$k = strpos($html, '<$'.$this->tag);//Find the next instance of this CustomTag in $html
			if($k === false)
				return false;//return false if not found
			$i = $k + strlen('<$'.$this->tag);//move to the index after the tag name
			$j = strpos($html, '>', $i);//get the position of the end of the opening tag <$0 a>

			$tag = substr($html, $k, $j+1 - $k);//get the full tag from $html
			$attrs = substr($html, $i, $j-$i);//get the tag's attributes

			if($j - $i < 2)
				return array($tag, $tagOpen);//There needs to be at least 2 characters between $i and $j for there to be html attributes
			$attrs = explode(' ', $attrs);//split $attrs into a list of attributes

			$n = 0;//loop iterator
			for($n = 0; $n < count($attrs); $n++)
			{
				if($attrs[$n] === '')
					continue;//skip any blank attributes that may have been created during the string split
				$e = strpos($attrs[$n], '=');//find the position of the equals sign (some attributes don't need values)
				if($e === false)
					$e = strlen($attrs[$n]);//if no equals sign, $e is the length of the attribute
				if(substr_count($attrs[$n], '="') === 1 && substr($attrs[$n], strlen($attrs[$n])-1, 1) !== '"')
				{
					if($n+1 < count($attrs))
						$attrs[$n+1] = $attrs[$n].' '.$attrs[$n+1];//Add the incomplete attribute to the next one (if it exists) if the attribute is missing its end-quote
					continue;//skip this iteration because we can't use the incomplete attribute for anything
				}
				$attr = substr($attrs[$n], 0, $e);//get the attribute name
				$val = str_replace('=','',str_replace('"','',substr($attrs[$n], $e)));//get the attribute value
				$tagOpen = str_replace('($'.$attr.')', $val, $tagOpen);//replace occurences of the attribute name in parenthesis in this CustomTag with the attribute value only
				$tagOpen = str_replace('$'.$attr, $attrs[$n], $tagOpen);//replace all other occurences with the entire attribute, both name and value
			}
			return array($tag, $tagOpen);//return the tag that appeared in $html and the modified $tagOpen in an array
		}
	}
?>