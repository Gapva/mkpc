<?php
include('session.php');
if ($id && isset($_POST['member'])) {
	include('initdb.php');
	if (mysql_numrows(mysql_query('SELECT * FROM `mkjoueurs` WHERE id="'. $_POST['member'] .'"'))) {
		mysql_query('INSERT INTO `mkconvs` VALUES(NULL,"'. $id .'","'. $_POST['member'] .'",NULL)');
		mysql_query('UPDATE `mkchats` SET seen=1 WHERE sender="'. $_POST['member'] .'" AND receiver="'. $id .'"');
		mysql_query('DELETE FROM `mkignores` WHERE ignorer="'. $id .'" AND ignored="'. $_POST['member'] .'"');
	}
	echo '[';
	include('o_consts.php');
	include('o_utils.php');
	$getMsgs = mysql_query('SELECT * FROM `mkchats` WHERE ((sender="'. $id .'" AND receiver="'. $_POST['member'] .'") OR (sender="'. $_POST['member'] .'" AND receiver="'. $id .'")) ORDER BY id DESC LIMIT '. $MSGS_PACKET_SIZE);
	$v = '';
	while ($msg = mysql_fetch_array($getMsgs)) {
		echo $v;
		$v = ',';
		echo '['.$msg['id'].','.$msg['sender'].',"'.parse_msg($msg['message']).'","'.to_local_tz($msg['date']).'"]';
	}
	echo ']';
	mysql_close();
}
?>