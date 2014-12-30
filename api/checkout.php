<?php

require_once('../include/auth.php');
global $mysqli;
if( !isset($_POST["name"]) || !isset($_POST["studentID"]) || !isset($_POST["phone"]) ) {
	$ret["errcode"] = 1;
	$ret["msg"] = "請務必輸入完整資料。";
}
else if( !isset($_POST["list"]) ) {
	$ret["errcode"] = 1;
	$ret["msg"] = "購物車內無商品！";
}
else if( $mysqli->connect_error ) {
	$ret["errcode"] = 1;
	$ret["msg"] = "資料庫錯誤，請稍後再試。";
}
else {
	$name = $_POST["name"];
	$studentID = $_POST["studentID"];
	$phone = $_POST["phone"];
	$list = $_POST["list"];
	$insert = "INSERT INTO `Customer` (
		`time`, `name`, `studentID`, `phone`, `total`
		) VALUES (
		now(), '$name', '$studentID', '$phone', 0
	)";
	if( $mysqli->query($insert) );
	else {
		$ret["errcode"] = 1;
		$ret["msg"] = "資料庫錯誤，請稍後再試。";
	}
	$cid = $mysqli->insert_id;

	$goods = get_data();

	$total = 0;
	$poker_count = 0;
	foreach($list as $elem) {
		if( !isset($goods[$elem["gid"]]) ) {
			$ret["errcode"] = 1;
			$ret["msg"] = "輸入錯誤，請稍後再試。";
		}
		else {
			$elem2 = $goods[$elem["gid"]];
			$price = isset($elem2["special"]) ? $elem2["special"] : $elem2["price"];
			if( $elem["gid"] == 7 ) $poker_count += $elem["num"];
			$total += add_purchase($mysqli, $cid, $elem["gid"], isset($elem["sub-id"])?$elem["sub-id"]:null, $price, $elem["num"]);
		}
	}
	if( !isset($ret["msg"]) ) {
		$total -= (int)($poker_count/2) * 20;
		$mysqli->query("UPDATE `Customer` SET `total` = '$total' WHERE `cid` = '$cid'");
		$ret["errcode"] = 0;
		$ret["msg"] = "結帳成功！請務必於指定時間前往攤位繳費。";
	}
}
echo json_encode($ret);
function get_data() {
	global $mysqli;
	$query = "SELECT * FROM `Goods` ORDER BY `gid` ASC";
	$data = $mysqli->query($query);
	$ret = array();
	while( $row = $data->fetch_assoc() ) {
		if( $row["sub-id"] ) $row["sub-id"] = unserialize($row["sub-id"]);
		$ret[$row["gid"]] = $row;
	}
	$data->free();
	return $ret;
}
function add_purchase($mysqli, $cid, $gid, $sub_id, $price, $num) {
	
	if( $gid == 8 ) {
		add_purchase($mysqli, $cid, 1, array($sub_id[0], $sub_id[1]), 0, $num);
		add_purchase($mysqli, $cid, 2, $sub_id[2], 0, $num);
		add_purchase($mysqli, $cid, 3, $sub_id[3], 0, $num);
		add_purchase($mysqli, $cid, 4, null, 0, $num);
		add_purchase($mysqli, $cid, 5, $sub_id[4], 0, $num);
		add_purchase($mysqli, $cid, 6, null, 0, $num);
		$sub_id = null;
	}
	$insert = "";
	if( $sub_id !== null ) {
		if( is_array($sub_id) ) {
			$sub_id = $sub_id[0] . "-" . $sub_id[1];
		}
		$insert = "INSERT INTO `Purchase` (
			`cid`, `gid`, `sub-id`, `num`, `price`
			) VALUES (
			'$cid', '$gid', '$sub_id', '$num', '$price'
		)";
	}
	else {
		$insert = "INSERT INTO `Purchase` (
			`cid`, `gid`, `num`, `price`
			) VALUES (
			'$cid', '$gid', '$num', '$price'
		)";
	}
	$mysqli->query($insert);
	return $price * $num;
}

?>
