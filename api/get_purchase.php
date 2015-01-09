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
		if ( isset($_POST['cid']) ) {
			$goods_tmp = getGoods();
			foreach( $goods_tmp as $elem )
				$goods[$elem["gid"]] = $elem;
			$ret["data"]["purchase"] = getPurchaseCID($_POST['cid'], $goods);
		}
		else {
			$ret["data"]["customer"] = getCustomer();
			$ret["data"]["summary"] = getSummary();
		}
	}
}
else if( isset($_POST['summary']) ) {
	$ret["errcode"] = 0;
	$ret["data"]["summary"] = getSummary();
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

	$query = "SELECT `cid`,`gid`,`sub-id`,`num` FROM `Purchase` ORDER BY cid ASC";
	$result = $mysqli->query($query);
	$purchases = getArray($result);
	$result->free();

	$goods_tmp = getGoods();
	foreach( $goods_tmp as $elem )
		$goods[$elem["gid"]] = $elem;

	$i = 0;
	$len = count($purchases);
	foreach( $array as &$customer ) {
		$customer["purchase"] = array();
		//$customer["purchase"] = getPurchaseCID($customer["cid"], $goods);
		while( $i < $len && $purchases[$i]["cid"] < $customer["cid"] ) ++$i;
		while( $i < $len && $purchases[$i]["cid"] == $customer["cid"] ) {
			array_push($customer["purchase"], $purchases[$i]);
			++$i;
		}
	}
	return $array;
}
function getSummary() {
	$goods = getGoods();
	$array = array();
	foreach( $goods as $item ) {
		$elem["gid"] = $item["gid"];
		$elem["name"] = $item["name"];
		$elem["cnt"] = array();
		if( isset($item["sub-id"]) ) {
			if( sizeof($item["sub-id"]) == 1 )
				foreach( $item["sub-id"][0] as $sub_id ) {
					$elem["cnt"][$sub_id] = getCount($elem["gid"], $sub_id);
				}
			else if( sizeof($item["sub-id"])==2 )
				foreach( $item["sub-id"][0] as $sub_id0 )
					foreach( $item["sub-id"][1] as $sub_id1 ) {
						$elem["cnt"][$sub_id0 . "-" . $sub_id1] = getCount($elem["gid"], $sub_id0."-".$sub_id1);
					}
			else $elem["cnt"][0] = getCount($elem["gid"]);
		}
		else $elem["cnt"][0] = getCount($elem["gid"]);
		array_push($array, $elem);
	}
	return $array;
}
function getGoods() {
	global $mysqli;
	$query = "SELECT `gid`,`name`,`sub-id` FROM `Goods` ORDER BY `gid` ASC";
	$result = $mysqli->query($query);
	$array = getArray($result);
	$result->free();
	foreach( $array as &$elem ) {
		if( $elem["sub-id"] ) {
			$tmp = @unserialize($elem["src"]);
			if( $tmp ) $elem["src"] = $tmp;
			$elem["sub-id"] = unserialize($elem["sub-id"]);
		}
	}
	return $array;
}
function getCount($gid, $sub_id = "") {
	global $mysqli;
	if( $sub_id=="" )
		$query = "SELECT SUM(`num`) FROM `Purchase` WHERE `gid` = $gid";
	else
		$query = "SELECT SUM(`num`) FROM `Purchase` WHERE `sub-id` = '$sub_id' AND `gid` = $gid";
	$result = $mysqli->query($query);
	$ans =  $result->fetch_assoc()['SUM(`num`)'];
	$result->free();
	return $ans?$ans:0;
}
function getPurchaseCID(&$cid, &$goods) {
	global $mysqli;
	$query = "SELECT `gid`,`sub-id`,`num` FROM `Purchase` WHERE `cid` = $cid";
	$result = $mysqli->query($query);
	$array = getArray($result);
	$result->free();
	foreach( $array as &$elem ) {
		$elem["name"] = $goods[$elem["gid"]]["name"];
		unset($elem["gid"]);
	}
	return $array;
}
function getArray(&$mysql_query) {
	$ret = array();
	while( $row = $mysql_query->fetch_assoc() )
		array_push($ret, $row);
	return $ret;
}

?>
