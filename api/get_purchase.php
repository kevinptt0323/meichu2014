<?php
require_once('../include/auth.php');
session_start();

if( isLogin() ) {
	global $mysqli;
	if( $mysqli->connect_error ) {
		$ret["errcode"] = 1;
		$ret["msg"] = "資料庫錯誤，請稍後再試。";
	}
	else {
		$ret["errcode"] = 0;
		$ret["data"]["customer"] = getCustomer();
		$ret["data"]["summary"] = getSummary();
		/*
		ig( isset($_GET['customer']) || isset($_POST['customer']) )
			$ret["data"] = getCustomer();
		else if( isset($_GET['summary']) || isset($_POST['summary']) )
			$ret["data"] = getSummary();
		else
			$ret["data"] = getCustomer();
		*/
	}
}
else {
	$ret["errcode"] = 1;
	$ret["msg"] = "請登入。";
}
echo json_encode($ret);

/* functions */

function getCustomer() {
	global $mysqli;
	$query = "SELECT * FROM `Customer` ORDER BY cid ASC";
	$result = $mysqli->query($query);
	$array = getArray($result);
	$result->free();
	return $array;
}
function getSummary() {
	$goods = getGoods();
	$array = array();
	foreach( $goods as $item ) {
		$purchases = getPurchases($item["gid"]);
		$elem["gid"] = $item["gid"];
		$elem["name"] = $item["name"];
		$elem["cnt"] = array();
		if( isset($item["sub-id"]) ) {
			if( sizeof($item["sub-id"]) == 1 )
				foreach( $item["sub-id"][0] as $sub_id )
					$elem["cnt"][$sub_id] = 0;
			else if( sizeof($item["sub-id"])==2 )
				foreach( $item["sub-id"][0] as $sub_id0 )
					foreach( $item["sub-id"][1] as $sub_id1 )
						$elem["cnt"][$sub_id0 . "-" . $sub_id1] = 0;
			else $elem["cnt"][0] = 0;
		}
		else $elem["cnt"][0] = 0;
		foreach( $purchases as $purchase ) {
			if( isset($purchase["sub-id"]) )
				$elem["cnt"][$purchase["sub-id"]]++;
			else
				$elem["cnt"][0]++;
		}
		array_push($array, $elem);
	}
	return $array;
}
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
function getPurchases($gid) {
	global $mysqli;
	$query = "SELECT * FROM `Purchase` WHERE `gid` = $gid";
	$result = $mysqli->query($query);
	$array = getArray($result);
	/*
	foreach( $array as &$purchase )
		if( isset($purchase["sub-id"]) )
			$purchase["sub-id"] = explode("-",$purchase["sub-id"]);
			*/
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
