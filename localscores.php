<?php
if (!isset($_GET['key'])) exit;
include('language.php');
include('session.php');
include('initdb.php');
?>
<!DOCTYPE html>
<html lang="<?php echo $language ? 'en':'fr'; ?>">
<head>
<title>Mario Kart PC</title>
<?php
include('heads.php');
?>
<link rel="stylesheet" type="text/css" href="styles/classement.css" />
<link rel="stylesheet" type="text/css" href="styles/auto-complete.css" />

<?php
include('o_online.php');
?>

<style type="text/css">
.reset_ranking {
    margin-top: 10px;
}
.reset_ranking button {
    background-color: #C66;
    color: white;
    display: inline-block;
    font-weight: bold;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}
.reset_ranking button:hover {
    background-color: #D77;
}
</style>
<script type="text/javascript">
function resetRanking() {
    if (confirm("<?php echo $language ? 'Reset ranking? Caution, this action cannot be undone':'Réinitialiser le classement ? Attention, cette action est irréversible'; ?>")) {
        document.body.style.cursor = "progress";
        o_xhr("resetLocalScores.php", "key=<?php echo $_GET['key']; ?>", function() {
            document.location.reload();
            return true;
        });
    }
}
</script>

</head>
<body>
<?php
include('header.php');
$page = 'game';
include('menu.php');
?>
<main>
	<h1><?php echo $language ? 'Private game ranking - Mario Kart PC':'Classement partie privée - Mario Kart PC'; ?></h1>
	<div>
        <?php
        if ($language) {
            ?>
            This page displays the internal ranking for your private game.<br />
            This ranking is independent of the overall online ranking.
            All players joining the private game start at 0, and at the end of each race,
            points are awarded using the same scoring system as for VS races in solo mode.<br />
            A useful option in tournaments for example, or if you organize games with friends.
            <?php
        }
        else {
            ?>
            Cette page affiche le classement interne à votre partie privée.<br />
            Ce classement est indépendant du classement en ligne global.
            Tous les joueurs qui rejoignent la partie privée commence à 0,
            et à l'issue de chaque course, les points sont attribués
            en utilisant le même système de score que pour les courses VS du mode solo.<br />
            Une option utile pour les tournois par exemple, ou si vous organisez des parties entre amis.
            <?php
        }
        ?>
    </div>
    <br />
	<?php
    $records = mysql_query('SELECT j.id,j.nom,r.pts,c.code FROM `mkjoueurs` j INNER JOIN `mkprofiles` p ON p.id=j.id LEFT JOIN `mkcountries` c ON c.id=p.country INNER JOIN `mkgamerank` r ON r.game="'. $_GET['key'] .'" AND r.player=j.id ORDER BY r.pts DESC,j.id');
    if (mysql_numrows($records)) {
        ?>
	<table>
	<tr id="titres">
	<td>Place</td>
	<td><?php echo $language ? 'Nick':'Pseudo'; ?></td>
	<td>Score</td>
	</tr>
    <?php
    $i = 0;
	while ($record=mysql_fetch_array($records)) {
        $i++;
        $place = $i;
		?>
	<tr class="<?php echo (($i%2) ? 'clair':'fonce') ?>">
	<td><?php
		echo $place .'<sup>';
		if ($language) {
			$centaines = $place%100;
			if (($centaines >= 10) && ($centaines < 20))
				echo 'th';
			else {
				switch ($place%10) {
				case 1 :
					echo 'st';
					break;
				case 2 :
					echo 'nd';
					break;
				case 3 :
					echo 'rd';
					break;
				default :
					echo 'th';
				}
			}
		}
		else
			echo 'e'. ($place>1 ? null:'r');
		echo '</sup>';
	?></td>
	<td><a href="profil.php?id=<?php echo $record['id']; ?>" class="recorder"><?php
	if ($record['code'])
		echo '<img src="images/flags/'.$record['code'].'.png" alt="'.$record['code'].'" onerror="this.style.display=\'none\'" /> ';
		echo $record['nom'];
	?></a></td>
	<td><?php echo $record['pts'] ?></td>
	</tr>
		<?php
	}
	?>
    </table>
        <?php
        if ($linkCreator = mysql_fetch_array(mysql_query('SELECT player FROM `mkprivgame` WHERE id="'. $_GET['key'] .'"'))) {
            if ($linkCreator['player'] == $id) {
                ?>
                <div class="reset_ranking">
                    <button class="action_button" onclick="resetRanking()"><?php echo $language ? 'Reset ranking':'Réinitialiser le classement'; ?></button>
                </div>
                <?php
            }
        }
    }
    else {
        echo '<strong>';
        if ($language)
            echo 'No score for the moment. Make some races to fill the rankings!';
        else
            echo 'Aucun score pour le moment. Réalisez des courses pour remplir le classement !';
        ?>
        <?php
        echo '</strong>';
    }
    ?>
	<p><a href="online.php?<?php echo http_build_query($_GET); ?>"><?php echo $language ? 'Back to private game':'Retour &agrave; la partie privée'; ?></a><br />
	<a href="index.php"><?php echo $language ? 'Back to Mario Kart PC':'Retour &agrave; Mario Kart PC'; ?></a></p>
</main>
<?php
include('footer.php');
?>
<script type="text/javascript" src="scripts/auto-complete.min.js"></script>
<script type="text/javascript" src="scripts/autocomplete-player.js"></script>
<script type="text/javascript">
autocompletePlayer('#joueur');
</script>
<?php
mysql_close();
?>
</body>
</html>