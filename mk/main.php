<?php
if (in_array($_SERVER['HTTP_HOST'], array('local-mkpc.malahieude.info','mkpc-translations.000webhostapp.com')))
	echo '<script type="text/javascript" src="scripts/mk.js?reload=1"></script>';
else
	echo '<script type="text/javascript" src="scripts/mk.v6f.js"></script>';
?>