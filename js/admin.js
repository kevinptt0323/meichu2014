index = { }
index.init = function() {
	$("#global-message").modal({allowMultiple: true, transition: 'fade up'});
	admin.init();
}
index.message = { };
index.message.show = function(msg) {
	console.log(msg);
	var $obj = $("#global-message");
	$obj.html("");
	$("<div></div>").addClass("content").html(msg).appendTo($obj);
	$("<div></div>").addClass("actions").html(
		$("<div></div>").addClass("ui primary button").html("OK")
	).appendTo($obj);
	$obj.modal('show');
	$obj.find(".ui.button")
		.unbind('click')
		.bind('click', function() {
			$obj.modal("hide");
			return false;
		});
}
admin = { }
admin.init = function() {
	this.query = "customer";
	this.getData();
	$("#search").on('change', function() {
		if( $("#search").val()=="" )
			admin.makeTable("customer");
		else
			admin.makeTable("customer", $("#search").val());
	});
}
admin.getData = function() {
	$.ajax({
		type: "POST",
		data: {kevinptt: true},
		dataType: "json",
		url: "api/get_purchase.php",
		success: function(b) {
			var data = b;
			if( data["errcode"] ) {
				admin.data = [];
				index.message.show(data["msg"]);
			}
			else {
				admin.data = data["data"];
				admin.makeTable(admin.query);
			}
		},
		error: function() {
			admin.data = [];
			index.message.show("資料讀取發生錯誤，請稍後再試。");
		}
	});
}
admin.makeTable = function(q, opt) {
	admin.query = q;
	$table = $("<table></table>").addClass("ui striped compact collapsing table").attr("id", "#data");
	var thead = "";
	var data = this.data[q];
	if( q=="customer" ) {
		for(key in data[0])
			thead += "<th>" + key + "</th>"
		thead += "<th>登記繳費</th><th>登記領貨</th><th>刪除</th>";

		$table.append("<thead><tr>" + thead + "</tr></thead>");
		data.forEach(function(elem) {
			if( typeof opt !== "undefined" && 
				["name","studentID", "phone", "email"].filter( function(str) { return typeof elem[str] === "string" && elem[str].search(opt)!=-1; } ).length == 0
			)
				return;
			var str = "";
			for(key in elem) {
				if( key!="purchase" )
					str += "<td>" + (elem[key]||"x") + "</td>"
				else {
					var purchases = "";
					elem[key].forEach(function(item) {
						for( key2 in item )
							if( item[key2] )
								purchases += item[key2] + " / ";
						purchases = purchases.slice(0, -3) + "<br />";
					});
					str += "<td>" + purchases + "</td>"
				}

			}
			str += "<td><a href='javascript:admin.pay(" + elem["cid"] + ")'><i class='dollar icon'></i></a></td><td><a href='javascript:admin.receive(" + elem["cid"] + ")'><i class='gift icon'></i></a></td><td><a href='javascript:admin.del(" + elem["cid"] + ")'><i class='remove icon'></i></a></td>";
			$table.append("<tr>" + str + "</tr>");
		});
	}
	else if( q=="summary" ) {
		$table.removeClass("striped").addClass("celled structured");
		for(key in data[0])
			thead += "<th>" + key + "</th>"
		thead += "<th>數量</th>";

		$table.append("<thead><tr>" + thead + "</tr></thead>");
		data.forEach(function(elem) {
			var str = "";
			var size = 0;
			for(sub_item in elem["cnt"])
				++size;
			for(key in elem)
				if( key!="cnt" )
					str += "<td rowspan=\"" + size + "\">" + elem[key] + "</td>";
			for(sub_item in elem["cnt"]) {
				str += "<td>" + sub_item + "</td><td>" + elem["cnt"][sub_item] + "</td>";
				$table.append("<tr>" + str + "</tr>");
				str = "";
			}
		});
	}
	else if( q=="purchase" ) {
		var cid = opt;
		var customer = this.data["customer"].filter(function(elem) { return elem["cid"] == cid; })[0];
		thead = "<tr><th colspan='3'>" +  customer["name"]  + " / " + customer["studentID"]  + " / " + customer["phone"] + "</th></tr><tr>";
		for(key in data[0])
			thead += "<th>" + key + "</th>"
		thead += "</tr>";
		$table.append("<thead>" + thead + "</thead>");
		data.forEach(function(item) {
			var str = "";
			for( key in item )
				str += "<td>" + item[key] + "</td>";
			$table.append("<tr>" + str + "</tr>");
		});
	}
	$table.hide().appendTo($("#main > .content").html("")).fadeIn(500);
	console.log(this.query);
}
admin.del = function(cid) {
	if( confirm("確定刪除編號 " + cid + " ?") && confirm("真的不後悔刪除編號 " + cid + " ?") ) {
		$.ajax({
			type: "POST",
			data: {kevinptt: true, delete: true, cid: cid},
			dataType: "json",
			url: "api/operation.php",
			success: function(b) {
				var data = b;
				if( data["errcode"] ) {
					index.message.show(data["msg"]);
				}
				else {
					index.message.show(data["msg"]);
					admin.getData();
				}
			},
			error: function() {
				admin.data = [];
				index.message.show("資料讀取發生錯誤，請稍後再試。");
			}
		});
	}
}
admin.reloadCID = function(cid) {
	var retData = [];
	$.ajax({
		type: "POST",
		data: {kevinptt: true, cid: cid},
		dataType: "json",
		url: "api/get_purchase.php",
		success: function(b) {
			var data = b;
			if( data["errcode"] ) {
				retData = [];
				index.message.show(data["msg"]);
			}
			else {
				retData = data["data"]["purchase"];
				admin.makeTable("purchase", cid);
			}
		},
		error: function() {
			retData = [];
			index.message.show("資料讀取發生錯誤，請稍後再試。");
		}
	});
	return retData;
}
admin.pay = function(cid) {
	if( confirm("確定登記編號" + cid + "繳費?")  ) {
		$.ajax({
			type: "POST",
			data: {kevinptt: true, pay: true, cid: cid},
			dataType: "json",
			url: "api/operation.php",
			success: function(b) {
				var data = b;
				if( data["errcode"] ) {
					index.message.show(data["msg"]);
				}
				else {
					index.message.show(data["msg"]);
					admin.getData();
				}
			},
			error: function() {
				admin.data = [];
				index.message.show("資料讀取發生錯誤，請稍後再試。");
			}
		});
	}
}
admin.receive = function(cid) {
	if( confirm("確定登記編號 " + cid + "領貨?")  ) {
		$.ajax({
			type: "POST",
			data: {kevinptt: true, receive: true, cid: cid},
			dataType: "json",
			url: "api/operation.php",
			success: function(b) {
				var data = b;
				if( data["errcode"] ) {
					index.message.show(data["msg"]);
				}
				else {
					index.message.show(data["msg"]);
					admin.getData();
				}
			},
			error: function() {
				admin.data = [];
				index.message.show("資料讀取發生錯誤，請稍後再試。");
			}
		});
	}
}



$(index.init);
