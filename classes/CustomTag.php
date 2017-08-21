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

			$freq = substr_count($html,'</$'.$this->tag.'>');
			$temp = $html;
			$k = 0;
			for($k = 0; $k < $freq; $k++)
			{
				$tags = $this->getAttributes($tagOpen, $html);
				$temp = str_replace($tags[0], $tags[1], $html);
			}
			return str_replace('</$'.$this->tag.'>', $tagClose, $temp);
		}

		private function getAttributes($tagOpen, $html) {
			//$freq = substr_count($html,'</$'.$this->tag.'>');
			$k = strpos($html, '<$'.$this->tag);
			$i = $k + strlen('<$'.$this->tag);
			$j = strpos($html, '>', $i);

			$tag = substr($html, $k, $j+1 - $k);
			$attrs = substr($html, $i, $j-$i);

			//echo "<script>console.log('$i', '$j', '$tag')</script>";
			if($j - $i < 3)
				return array($tag, $tagOpen);
			$attrs = explode(' ', $attrs);

			$n = 0;
			for($n = 0; $n < count($attrs); $n++)
			{
				if($attrs[$n] === '')
					continue;
				$e = strpos($attrs[$n], '=');
				if($e === false)
					$e = strlen($attrs[$n]);
				if(substr_count($attrs[$n], '="') === 1 && substr($attrs[$n], strlen($attrs[$n])-1, 1) !== '"')
				{
					if($n+1 < count($attrs))
						$attrs[$n+1] = $attrs[$n].' '.$attrs[$n+1];
					continue;
				}
				$attr = substr($attrs[$n], 0, $e);
				$val = str_replace('=','',str_replace('"','',substr($attrs[$n], $e)));
				//echo "<script>console.log('$attr', '$val', '$e')</script>";
				$tagOpen = str_replace('($'.$attr.')', $val, $tagOpen);
				$tagOpen = str_replace('$'.$attr, $attrs[$n], $tagOpen);
			}
			return array($tag, $tagOpen);
		}
	}
?>