<?php
require_once('../include/auth.php');
session_start();

if( 1 ) { // avoid hacking
	$ret["errcode"] = 1;
	$ret["msg"] = "為避免此頁面遭流出，目前功能為不開放狀態，請洽管理員。";
}
else if( isLogin() ) {
	global $mysqli;
	if( $mysqli->connect_error ) {
		$ret["errcode"] = 1;
		$ret["msg"] = "資料庫錯誤，請稍後再試。";
	}
	else if( isset($_POST['cid']) ) {
		if( isset($_POST['delete']) ) {
			if( deleteCID($_POST['cid']) ) {
				$ret["errcode"] = 0;
				$ret["msg"] = "刪除編號" . $_POST['cid'] . "成功";
			}
			else {
				$ret["errcode"] = 1;
				$ret["msg"] = "刪除編號" . $_POST['cid'] . "失敗";
			}
		}
		else if( isset($_POST['pay']) ) {
			if( payCID($_POST['cid']) ) {
				$ret["errcode"] = 0;
				$ret["msg"] = "登記編號" . $_POST['cid'] . "繳費成功";
			}
			else {
				$ret["errcode"] = 1;
				$ret["msg"] = "登記編號" . $_POST['cid'] . "繳費失敗";
			}
		}
		else if( isset($_POST['receive']) ) {
			if( receiveCID($_POST['cid']) ) {
				$ret["errcode"] = 0;
				$ret["msg"] = "登記編號" . $_POST['cid'] . "領貨成功";
			}
			else {
				$ret["errcode"] = 1;
				$ret["msg"] = "登記編號" . $_POST['cid'] . "領貨失敗";
			}
		}
	}
	else {
		$ret["errcode"] = 1;
		$ret["msg"] = "指令錯誤";
	}
}
else {
	$ret["errcode"] = 1;
	$ret["msg"] = "請登入";
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
function payCID($cid) {
	global $mysqli;
	$pay = "UPDATE `Customer` SET `pay` = now() WHERE `cid` = '$cid'";
	if( !$mysqli->query($pay) ) return false;
	return true;
}
function receiveCID($cid) {
	global $mysqli;
	$receive = "UPDATE `Customer` SET `receive` = now() WHERE `cid` = '$cid'";
	if( !$mysqli->query($receive) ) return false;
	return true;
}

?>

