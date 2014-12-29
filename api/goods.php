<?php
require_once('../include/auth.php');
global $mysqli;
if( $mysqli->connect_error ) {
	$ret["errcode"] = 1;
	$ret["msg"] = "資料庫錯誤，請稍後再試。";
}
else {
	$ret["errcode"] = 0;
	$query = "SELECT * FROM `Goods` ORDER BY `gid` ASC";
	$data = $mysqli->query($query);
	$ret["goods"] = array();
	while( $row = $data->fetch_array() ) {
		if( $row["sub-id"] ) {
			$tmp = @unserialize($row["src"]);
			if( $tmp ) $row["src"] = $tmp;
			$row["sub-id"] = unserialize($row["sub-id"]);
		}
		array_push($ret["goods"], $row);
	}
	$data->free();
}
echo json_encode($ret);
?>
