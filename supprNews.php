<?php
include('language.php');
include('session.php');
include('initdb.php');
require_once('getRights.php');
if (isset($_GET['id']) && ($news=mysql_fetch_array(mysql_query('SELECT * FROM `mknews` WHERE id="'. $_GET['id'] .'"'))) && (hasRight('publisher')||($news['author']==$id))) {
	?>
<!DOCTYPE html>
<html lang="<?php echo $language ? 'en':'fr'; ?>">
<head>
<title>News Mario Kart PC</title>
<?php
include('heads.php');
?>
<link rel="stylesheet" type="text/css" href="styles/news.css" />

<?php
include('o_online.php');
?>
</head>
<body>
<?php
include('header.php');
$page = 'home';
include('menu.php');
?>
<main>
<?php
include('smileys.php');
?>
<h1><?php echo $language ? 'Deletion':'Suppression'; ?></h1>
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<!-- Forum MKPC -->
<p class="pub"><ins class="adsbygoogle"
     style="display:inline-block;width:728px;height:90px"
     data-ad-client="ca-pub-1340724283777764"
     data-ad-slot="4919860724"></ins></p>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
<?php
	mysql_query('DELETE FROM `mknews` WHERE id="'. $_GET['id'] .'"');
	if ($news['author'] != $id)
		mysql_query('INSERT INTO `mklogs` VALUES(NULL,NULL, '. $id .', "SNews '. $_GET['id'] .'")');
	echo $language ? '<p id="successSent">News deleted successfully<br />
	<a href="listNews.php">Click here</a> to return to the news list.</p>' :
	'<p id="successSent">News supprimée avec succès<br />
	<a href="listNews.php">Cliquez ici</a> pour retourner à la liste des news.</p>';
?>
</main>
<?php
include('footer.php');
?>
</body>
</html>
	<?php
}
else
	echo 'Access denied';
mysql_close();
?>