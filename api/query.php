<?php
require_once('../include/auth.php');

global $mysqli;
if( !isset($_POST['name']) || !isset($_POST['phone']) ) {
	$ret["errcode"] = 1;
	$ret["msg"] = "請務必輸入完整資料！";
}
else if( $mysqli->connect_error ) {
	$ret["errcode"] = 1;
	$ret["msg"] = "資料庫錯誤，請稍後再試。";
}
else {
	$name = escape($_POST['name']);
	$phone = escape($_POST['phone']);
	$query = "SELECT * FROM `Customer` WHERE `name` LIKE '%$name%' and `phone` = '$phone'";
	if( ($result = $mysqli->query($query)) && $result->num_rows ) {
		$array = getArray($result);
		foreach( $array as &$customer ) {
			$customer["purchase"] = getPurchaseCID($customer["cid"]);
			unset($customer["cid"]);
			unset($customer["time"]);
		}
		$result->free();
		$ret["errcode"] = 0;
		$ret["data"] = $array;
	}
	else {
		$ret["errcode"] = 1;
		$ret["msg"] = "找不到資料，請確定輸入資料正確，或是在電話中加入連字號(-)。";
	}
}
echo json_encode($ret);

/* function */

function getGoods() {
	global $mysqli;
	$query = "SELECT * FROM `Goods` ORDER BY `gid` ASC";
	$result = $mysqli->query($query);
	$array = getArray($result);
	foreach( $array as &$elem ) {
		if( $elem["sub-id"] ) {
			$tmp = @unserialize($elem["src"]);
			if( $tmp ) $elem["src"] = $tmp;
			$elem["sub-id"] = unserialize($elem["sub-id"]);
		}
	}
	$result->free();
	return $array;
}
function getPurchaseCID($cid) {
	global $mysqli;
	$query = "SELECT * FROM `Purchase` WHERE `cid` = $cid";
	$result = $mysqli->query($query);
	$array = getArray($result);
	$goods_tmp = getGoods();
	foreach( $goods_tmp as $elem ) {
		$goods[$elem["gid"]] = $elem;
	}
	foreach( $array as &$elem ) {
		$elem = ["name" => $goods[$elem["gid"]]["name"], "sub-id" => $elem["sub-id"], "num" => $elem["num"] ];
	}
	$result->free();
	return $array;
}
function getArray($mysql_query) {
	$ret = array();
	while( $row = $mysql_query->fetch_assoc() )
		array_push($ret, $row);
	return $ret;
}
function escape($str) {
	global $mysqli;
	$str = htmlspecialchars($str);
	$str = $mysqli->real_escape_string($str);
	return $str;
}



?>
