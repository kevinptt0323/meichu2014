<?php

require_once('../include/auth.php');
global $mysqli;
if( !isset($_POST["name"]) || !isset($_POST["studentID"]) || !isset($_POST["phone"]) || !isset($_POST["list"]) ) {
	$ret["errcode"] = 1;
	$ret["msg"] = "請務必輸入資料。";
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
	foreach($list as $elem) {
		if( !isset($goods[$elem["gid"]]) ) {
			$ret["errcode"] = 1;
			$ret["msg"] = "輸入錯誤，請稍後再試。";
			break;
		}
		$elem2 = $goods[$elem["gid"]];
		$price = $elem2["price"];
		if( isset($elem2["special"]) )
			$price = $elem2["special"];
		$total += $price * $elem["num"];
		$sub_id = null;
		$insert = "";
		if( isset($elem["sub-id"]) ) {
			$sub_id = $elem["sub-id"];
			if( isset($sub_id[0]) ) {
				$sub_id = $sub_id[0] . "-" . $sub_id[1];
			}
			$insert = "INSERT INTO `Purchase` (
				`cid`, `gid`, `sub-id`, `num`, `price`
				) VALUES (
				'$cid', '$elem[gid]', '$sub_id', '$elem[num]', '$price'
			)";
		}
		else {
			$insert = "INSERT INTO `Purchase` (
				`cid`, `gid`, `num`, `price`
				) VALUES (
				'$cid', '$elem[gid]', '$elem[num]', '$price'
			)";
		}
		//echo $insert + "\n";
		$mysqli->query($insert);
	}
	if( !isset($ret["msg"]) ) {
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
	foreach($data as $row) {
		if( $row["sub-id"] ) $row["sub-id"] = unserialize($row["sub-id"]);
		$ret[$row["gid"]] = $row;
	}
	$data->free();
	return $ret;
}

?>
