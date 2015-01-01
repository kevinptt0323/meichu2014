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
		thead += "<th></th><th></th>";

		$table.append("<thead><tr>" + thead + "</tr></thead>");
		data.forEach(function(elem) {
			var str = "";
			for(key in elem) {
				if( key!="purchase" )
					str += "<td>" + elem[key] + "</td>"
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
			str += "<td><a>登記繳費</a></td><td><a href='javascript:admin.del(" + elem["cid"] + ")'><i class='close icon'></i></a></td>";
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
	$("#main > .content").html($table);
	console.log(this.query);
}
admin.del = function(cid) {
	if( confirm("確定刪除編號 " + cid + " ?") && confirm("真的不後悔刪除編號 " + cid + " ?") ) {
		$.ajax({
			type: "POST",
			data: {kevinptt: true, cid: cid},
			dataType: "json",
			url: "api/delete.php",
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
admin.show = function(cid) {
	$.ajax({
		type: "POST",
		data: {kevinptt: true, cid: cid},
		dataType: "json",
		url: "api/get_purchase.php",
		success: function(b) {
			var data = b;
			if( data["errcode"] ) {
				admin.data["purchase"] = [];
				index.message.show(data["msg"]);
			}
			else {
				console.log(data["data"]["purchase"]);
				admin.data["purchase"] = data["data"]["purchase"];
				admin.makeTable("purchase", cid);
			}
		},
		error: function() {
			admin.data["purchase"] = [];
			index.message.show("資料讀取發生錯誤，請稍後再試。");
		}
	});
}



$(index.init);
