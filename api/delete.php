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
		if( isset($_POST['cid']) && deleteCID($_POST['cid']) ) {
			$ret["errcode"] = 0;
			$ret["msg"] = "刪除編號" . $_POST['cid'] . "成功";
		}
		else {
			$ret["errcode"] = 1;
			$ret["msg"] = "刪除失敗";
		}
	}
}
else {
	$ret["errcode"] = 1;
	$ret["msg"] = "請登入。";
}
echo json_encode($ret);

/* function */

function deleteCID($cid) {
	global $mysqli;
	$deleteCustomer = "DELETE FROM `Customer` WHERE `cid` = '$cid'";
	if( !$mysqli->query($deleteCustomer) ) return false;
	$deletePurchase = "DELETE FROM `Purchase` WHERE `cid` = '$cid'";
	if( !$mysqli->query($deletePurchase) ) return false;
	return true;
}

?>

