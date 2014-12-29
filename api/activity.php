<?php
require_once('../include/auth.php');
global $mysqli;
if( $mysqli->connect_error ) {
	$ret["errcode"] = 1;
	$ret["msg"] = "資料庫錯誤，請稍後再試。";
}
else {
	$ret["errcode"] = 0;
	$query = "SELECT * FROM `Activity` ORDER BY `aid` ASC";
	$data = $mysqli->query($query);
	$ret["activity"] = array();
	while( $row = $data->fetch_assoc() ) {
		array_push($ret["activity"], $row);
	}
	$data->free();
}
echo json_encode($ret);
?>
