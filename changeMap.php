<?php
$id = isset($_GET['i']) ? $_GET['i']:0;
include('getId.php');
include('initdb.php');
include('language.php');
$success = (isset($_GET['x'])&&isset($_GET['y']))+isset($_GET['pivot']);
$src = isset($_GET['arenes']) ? 'course':'map';
$db = isset($_GET['arenes']) ? 'arenes':'circuits';
$isrc = isset($_GET['arenes']) ? 'coursepreview':'racepreview';
include('getExt.php');
$aExt = $ext;
if (mysql_numrows(mysql_query('SELECT * FROM `'.$db.'` WHERE id="'.$id.'" AND identifiant='.$identifiants[0].' AND identifiant2='.$identifiants[1].' AND identifiant3='.$identifiants[2].' AND identifiant4='.$identifiants[3]))) {
	if (isset($_FILES['image'])) {
		if (!$_FILES['image']['error']) {
			$poids = $_FILES['image']['size'];
			if ($poids < 1000000) {
				include('file-quotas.php');
				$poids += file_total_size(isset($_POST['arenes']) ? array('arena'=>$id):array('circuit'=>$id));
				if ($poids < MAX_FILE_SIZE) {
					$fileType = mime_content_type($_FILES['image']['tmp_name']);
					$extensions = array(
						'image/png' => 'png',
						'image/gif' => 'gif',
						'image/jpeg' => 'jpg'
					);
					if (isset($extensions[$fileType])) {
						$ext = $extensions[$fileType];
						unlink('images/uploads/'.$src.$id.'.'.$aExt);
						move_uploaded_file($_FILES['image']['tmp_name'], 'images/uploads/'.$src.$id.'.'.$ext);
						include('cache_creations.php');
						@unlink(cachePath($isrc.$id.'.png'));
						$success = 2;
					}
					else $error = $language ? 'Your image must have the png, gif, jpg or jpeg format':'Votre image doit &ecirc;tre au format png, gif, jpg ou jpeg';
				}
				else $error = $language ? 'You have exceeded your quota of '.filesize_str(MAX_FILE_SIZE):'Vous avez d&eacute;pass&eacute; votre quota de '.filesize_str(MAX_FILE_SIZE);
			}
			else $error = $language ? 'You image mustn\'t exceed 1 Mo':'Votre image ne doit pas d&eacute;passer 1 Mo';
		}
	else $error = $language ? 'An error occured. Please try again':'Une erreur est survenue, veuillez r&eacute;essayez';
	}
}
$dimensions = getimagesize('images/uploads/'.$src.$id.'.'.$ext);
mysql_close();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $language ? 'en':'fr'; ?>" >
<head>
 <title><?php echo $language ? 'Change circuit image':'Modifier image du circuit'; ?></title>
 <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
 
<style type="text/css">
body {
	background-color: #bbbfd0;
	margin: 25px;
}
p {
	margin: 0;
}
fieldset {
	border-color: #67A;
	background-color: #cecee1;
}
fieldset:hover {
	background-color: #d6d6ec;
}
legend {
	color: #568;
	font-weight: bold;
}
#fenetre {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	background-color: #4c7eb0;
	text-align: right;
	border-top-right-radius: 5px;
}
#fenetre input {
	background-color: #69C;
	color: white;
	border: solid 1px white;
	border-top-right-radius: 5px;
	cursor: default;
	text-decoration: none;
}
#fenetre input:hover {
	background-color: #669FD9;
}
#success {
	color: #195;
	font-weight: bold;
	text-align: center;
}
#error {
	color: #d23;
	font-weight: bold;
	text-align: center;
}
input[type="text"] {
	cursor: default;
}
input[type="text"]:focus {
	cursor: text;
}
input[type="submit"] {
	cursor: pointer;
	background-color: #69C;
	color: white;
	border-color: #48A;
	font-size: 15px;
	font-weight: bold;
	margin-top: 5px;
	border-radius: 5px;
}
input[type="submit"]:hover {
	background-color: #669FD9;
	border-color: #59B;
}
input[type="submit"]:disabled {
	cursor: default;
	opacity: 0.3;
}
</style>
<script type="text/javascript">
var image = window.parent.document.getElementById("editor-img");
function apercu() {
	if (document.getElementById("apercuauto").checked) {
		image.style.width = document.forms[1].x.value+"px";
		image.style.height = document.forms[1].y.value+"px";
		window.parent.document.body.id = "changing";
	}
}
document.onclick = apercu;
function reForbid() {
	document.getElementById("redimensionner").disabled = ((document.forms[1].x.value==<?php echo $dimensions[0] ?>)&&(document.forms[1].y.value==<?php echo $dimensions[1] ?>));
}
function able() {
	document.getElementById("pivoter").disabled = false;
	able = function(){};
}
</script>
</head>
<body onkeydown="window.parent.handleKeySortcuts(event)">
<p id="fenetre"><input type="button" value="&times;" onclick="window.parent.document.getElementById('mask-image').close()" /></p>
<?php
if ($success) {

	?>
<p id="success"><?php echo $language ? "The image has been changed successfully":"L'image a &eacute;t&eacute; modifi&eacute;e avec succ&egrave;s !"; ?></p>
<script type="text/javascript">
image.src = "images/uploads/<?php echo $src.$id.'.'.$ext ?>?reload="+ new Date().getTime();
image.onload = function() {
	this.style.width = this.naturalWidth+"px";
	this.style.height = "";<?php
	if ($success!=2) echo 'window.parent.'.(isset($_GET['pivot']) ? 'rotateImg('.($_GET['pivot']+1).');':'resizeImg('.$_GET['x'].','.$_GET['y'].');');
	else echo 'window.parent.imgSize.w=this.naturalWidth;window.parent.imgSize.h=this.naturalHeight;';
	?>
	this.onload = undefined;
}
</script>
	<?php
}
elseif (isset($error))
	echo '<p id="error">'.$error.'</p>';
else
	echo '<p>&nbsp;</p>';
?>
<form method="post" enctype="multipart/form-data" action="?i=<?php
	echo $id;
	if (isset($_GET['arenes'])) echo '&arenes=1';
?>">
<fieldset>
<legend><?php echo $language ? 'Change circuit image':'Modifier l\'image du circuit'; ?></legend>
<p><input type="file" name="image" onchange="document.getElementById('modifier').disabled=!this.value" /><br />
<input type="submit" value="<?php echo $language ? 'Send':'Valider'; ?>" id="modifier" disabled="disabled" /></p>
</fieldset>
</form>
<form method="post" action="redimensionne.php">
<fieldset>
<legend><?php echo $language ? 'Resize':'Redimensionner'; ?></legend>
<p><?php echo $language ? 'Width':'Longueur'; ?> : <input type="text" name="x" value="<?php echo $dimensions[0] ?>" maxlength="4" size="1" onfocus="this.select()" onchange="if(document.getElementById('proportionnel').checked)this.form.y.value=Math.round(this.value*<?php echo $dimensions[1] ?>/<?php echo $dimensions[0] ?>);reForbid()" onblur="apercu()" /> 
&nbsp; <?php echo $language ? 'Height':'Largeur'; ?> : <input type="text" name="y" value="<?php echo $dimensions[1] ?>" maxlength="4" size="1" onfocus="this.select()" onchange="if(document.getElementById('proportionnel').checked)this.form.x.value=Math.round(this.value*<?php echo $dimensions[0] ?>/<?php echo $dimensions[1] ?>);reForbid()" onblur="apercu()" /><br />
<label for="proportionnel"><input type="checkbox" id="proportionnel" checked="checked" /> <?php echo $language ? 'Keep proportions':'Conserver les proportions'; ?></label><br />
<label for="apercuauto"><input type="checkbox" id="apercuauto" checked="checked" onchange="if(!this.checked)window.parent.resetImageOptions()" /> <?php echo $language ? 'Auto preview':'Aper&ccedil;u automatique'; ?></label><br />
<input type="hidden" name="id" value="<?php echo $id ?>" />
<?php if (isset($_GET['arenes'])) echo '<input type="hidden" name="arenes" value="1" />'; ?>
<input type="submit" value="Valider" id="redimensionner" disabled="disabled" /></p>
</fieldset>
</form>
<form method="post" action="pivote.php">
<fieldset>
<legend><?php echo $language ? 'Rotate':'Pivoter'; ?></legend>
<?php
$options = $language ?
	Array('Rotate 90 degrees CW', 'Rotate 180 degrees', 'Rotate 90 degrees CCW', 'Horizontal symmetry', 'Vertical symmetry') :
	Array('Rotation 90&deg; horaire', 'Rotation 180&deg;', 'Rotation 90&deg; antihoraire', 'Sym&eacute;trie horizontale', 'Sym&eacute;trie verticale');
for ($i=0;$i<5;$i++)
	echo '<label for="pivot'.$i.'"><input type="radio" name="pivot" id="pivot'.$i.'" value="'.$i.'" onchange="able()" /> '.$options[$i].'</label><br />';
?>
<input type="hidden" name="id" value="<?php echo $id ?>" />
<?php if (isset($_GET['arenes'])) echo '<input type="hidden" name="arenes" value="1" />'; ?>
<input type="submit" value="<?php echo $language ? 'Submit':'Valider'; ?>" id="pivoter" disabled="disabled" />
</fieldset>
</form>
</body>
</html>