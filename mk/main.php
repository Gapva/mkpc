<?php
if (($_SERVER['HTTP_HOST'] !== 'mkpc.malahieude.net') || isset($_GET['metakey']))
	echo '<script type="text/javascript" src="scripts/mk.js"></script>';
else
	echo '<script type="text/javascript" src="scripts/mk.va1.js"></script>';
?>