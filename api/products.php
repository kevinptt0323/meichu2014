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
	$res = $mysqli->query($query);
	$ret["products"] = array();
	while( $row = $res->fetch_array() ){
		while( $field = $res->fetch_field() ) {
			if( $row[$field->name] )
				$tmp[$field->name] = $row[$field->name];
		}
		array_push($ret["products"], $tmp);
	}
	$res->free();
}
echo json_encode($ret);
?>
