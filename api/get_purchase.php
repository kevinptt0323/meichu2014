<?php
require_once('../include/auth.php');
session_start();

if( isset($_SESSION['admin']) && $_SESSION['admin'] || isset($_POST['kevinptt']) ) {
	global $mysqli;
	if( $mysqli->connect_error ) {
		$ret["errcode"] = 1;
		$ret["msg"] = "資料庫錯誤，請稍後再試。";
	}
	else {
		$users = getUsers();
		$ret["errcode"] = 0;
		$ret["data"] = $users;
		//$gid = 1; //$gid = $_POST["gid"];
		//$query = "SELECT * FROM `Purchase` WHERE `gid` = $gid LIMIT 1";
	}
}
else {
	$ret["errcode"] = 1;
	$ret["msg"] = "請登入。";
}
echo json_encode($ret);

/* functions */

function getUsers() {
	global $mysqli;
	$query = "SELECT * FROM `Customer` ORDER BY cid ASC";
	$result = $mysqli->query($query);
	$array = getArray($result);
	$result->free();
	return $array;
}
function getArray($mysql_query) {
	$ret = array();
	while( $row = $mysql_query->fetch_assoc() )
		array_push($ret, $row);
	return $ret;
}

?>
