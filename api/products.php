<?php
require_once('../include/auth.php');
global $mysqli;
if( $mysqli->connect_error ) {
	$ret["errcode"] = 1;
	$ret["msg"] = "資料庫錯誤，請稍後再試。";
}
else {
	$ret["errcode"] = 0;
	$query = "SELECT * FROM `Products` ORDER BY `pid` ASC";
	$data = $mysqli->query($query);
	$ret["products"] = array();
	foreach($data as $row) {
		array_push($ret["products"], $row);
	}
	$data->free();
}
echo json_encode($ret);
?>
