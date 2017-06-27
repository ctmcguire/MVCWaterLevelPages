<?php
	class CustomTag
	{
		private $tag;
		private $html;

		function CustomTag($tag, $src)
		{
			$this->tag = $tag;
			$this->html = file_get_contents($src);
		}

		public function insertHTML($html)
		{
			$i = strpos($this->html, '<$innerHTML/>');
			if($i === false)
				return $html;
			$j = $i + strlen('<$innerHTML/>');

			$tagOpen = substr($this->html, 0, $i);
			$tagClose = substr($this->html, $j);

			$temp = str_replace('<$'.$this->tag.'>', $tagOpen, $html);
			return str_replace('</$'.$this->tag.'>', $tagClose, $temp);
		}
	}
?>