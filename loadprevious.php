<?php
include('session.php');
if ($id && isset($_POST['member']) && isset($_POST['lastID'])) {
	include('initdb.php');
	echo '[';
	include('o_consts.php');
	include('o_utils.php');
	$getMsgs = mysql_query('SELECT * FROM `mkchats` WHERE id<"'. $_POST['lastID'] .'" AND ((sender="'. $id .'" AND receiver="'. $_POST['member'] .'") OR (sender="'. $_POST['member'] .'" AND receiver="'. $id .'")) ORDER BY id DESC LIMIT '. $MSGS_PACKET_SIZE);
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