<?php
	if( !isset($_GET['kevinptt']) ) die();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
		<meta property="og:description" content="國立交通大學乙未梅竹後援會 踏清健身，倒梅有理" />
		<meta property="og:site_name" content="國立交通大學乙未梅竹後援會" />
		<meta property="og:type" content="article" />
		<meta property="og:url" content="" />
		<meta property='og:image' content="" />
		<title>國立交通大學乙未梅竹後援會</title>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
		<script src="js/semantic.min.js"></script>
		<script src="js/admin.js"></script>
		<link rel="stylesheet" href="css/normalize.css" />
		<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css" />
		<link rel="stylesheet" href="css/semantic.min.css" />
		<link rel="stylesheet" href="css/admin.css" />
	</head>
	<body class="black">
		<div class="ui small modal" id="global-message"> </div>
		<div class="container" id="main">
			<div class="nav ui secondary pointing inverted menu">
				<a class="item" href="?q=customer">訂單列表</a>
				<a class="item" href="?q=summary">商品統計</a>
				<div class="right menu">
					<span class="item">kevinptt，你好</span>
					<a class="item" href="#">登出</a>
				</div>
			</div>
			<div class="content">
			</div>
		</div>
	</body>
</html>
