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
	while( $row = $data->fetch_assoc() ) {
		if( $row["sub-id"] ) {
			$tmp = @unserialize($row["src"]);
			if( $tmp ) $row["src"] = $tmp;
			$row["sub-id"] = unserialize($row["sub-id"]);
		}
		array_push($ret["goods"], $row);
	}
	$data->free();

	if( hideOrangeBlanket() ) {
		foreach( $ret["goods"] as &$goods ) {
			if( $goods["gid"]=="1" ) {
				array_splice($goods["sub-id"][1], 0, 1);
				array_splice($goods["sub-id"][1], 7, 1);
			}
			else if( $goods["gid"]=="3" )
				$goods["sub-id"][0] = array("黃");
			else if( $goods["gid"]=="8" ) {
				$goods["sub-id"][3] = array("黃");
			}
			else if( $goods["gid"]=="9" ) {
				array_splice($goods["sub-id"][1], 0, 1);
				array_splice($goods["sub-id"][1], 7, 1);
			}
		}
	}
}
echo json_encode($ret);

function hideOrangeBlanket() {
	$purchases = getPurchaseGID(3);
	$cnt = 0;
	foreach( $purchases as $purchase ) {
		if( isset($purchase["sub-id"]) && $purchase["sub-id"]=="橘" )
			$cnt++;
	}
	return $cnt>=0;
}
function getPurchaseGID($gid) {
	global $mysqli;
	$query = "SELECT * FROM `Purchase` WHERE `gid` = $gid";
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
