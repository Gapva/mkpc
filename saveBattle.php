<?php
if (isset($_POST['id']) && isset($_POST['nom']) && isset($_POST['auteur'])) {
	include('initdb.php');
	include('getId.php');
	include('ip_banned.php');
 	if (isBanned()) {
		mysql_close();
	  	exit;
	}
	setcookie('mkauteur', $_POST['auteur'], 4294967295,'/');
	if ($getCircuit = mysql_fetch_array(mysql_query('SELECT publication_date FROM arenes WHERE id="'.$_POST['id'].'" AND identifiant='.$identifiants[0].' AND identifiant2='.$identifiants[1].' AND identifiant3='.$identifiants[2].' AND identifiant4='.$identifiants[3]))) {
		mysql_query('UPDATE `arenes` SET nom="'.$_POST['nom'].'",auteur="'.$_POST['auteur'].'",publication_date=IFNULL(publication_date,CURRENT_TIMESTAMP()) WHERE id="'.$_POST['id'].'"');
		include('session.php');
		if ($id && !$getCircuit['publication_date']) {
			$getFollowers = mysql_query('SELECT follower FROM `mkfollowusers` WHERE followed="'. $id .'"');
			while ($follower = mysql_fetch_array($getFollowers))
				mysql_query('INSERT INTO `mknotifs` SET type="follower_circuit", user="'. $follower['follower'] .'", link="2,'.$_POST['id'].'"');
		}
	}
	echo 1;
	mysql_close();
}
?>