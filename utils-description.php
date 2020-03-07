<?php
function removeBbCode($desc) {
	$desc = preg_replace('#\[center\](.*)\[/center\]#isU', '$1 ', $desc);
	$desc = preg_replace('#\[right\](.*)\[/right\]#isU', '$1 ', $desc);
	$desc = preg_replace('#\[left\](.*)\[/left\]#isU', '$1 ', $desc);
	$desc = preg_replace('#\[b\](.*)\[/b\]#isU', '$1', $desc);
	$desc = preg_replace('#\[i\](.*)\[/i\]#isU', '$1', $desc);
	$desc = preg_replace('#\[u\](.*)\[/u\]#isU', '$1', $desc);
	$desc = preg_replace('#\[s\](.*)\[/s\]#isU', '$1', $desc);
	$desc = preg_replace('#\[fr\](.*)\[/fr\]#isU', '$1 ', $desc);
	$desc = preg_replace('#\[en\](.*)\[/en\]#isU', '$1 ', $desc);
	$desc = preg_replace('#\[yt\](.*)\[/yt\]#isU', ' ', $desc);
	$desc = preg_replace('#\[url\]([^\[]*)\[/url\]#isU', '$1', $desc);
	$desc = preg_replace('#\[img\]([^\[]*)\[/img\]#isU', ' ', $desc);
	$desc = preg_replace('#\[url=([^\]]+)\](.*)\[/url\]#isU', '$2', $desc);
	$desc = preg_replace('#\[color=([^\]]+)\](.*)\[/color\]#isU', '$2', $desc);
	$desc = preg_replace('#\[font=([a-zA-Z ]+)\](.*)\[/font\]#isU', '$2', $desc);
	$desc = preg_replace('#\[size=([0-9]{1,2})\](.*)\[/size\]#isU', '$2', $desc);
	$desc = preg_replace('#\[spoiler](.*)\[/spoiler\]#isU', ' ', $desc);
	$desc = preg_replace('#\[quote](.*)\[/quote\]#isU', '$1 ', $desc);
	$desc = preg_replace('#\[quote=(.+)](.*)\[/quote\]#isU', '$2 ', $desc);
	$desc = preg_replace('#[\r\n ]+#', " ", $desc);
	$desc = trim($desc);
	return $desc;
}
?>