<?php
if (in_array($_SERVER['HTTP_HOST'], array('local-mkds.malahieude.info','mkpc-translations.000webhostapp.com')))
	echo '<script type="text/javascript" src="scripts/mk.js"></script>';
else
	echo '<script type="text/javascript" src="scripts/mk.v57.js"></script>';
?>