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
	var obj = this;
	$.ajax({
		type: "POST",
		data: {kevinptt: true},
		dataType: "json",
		url: "api/get_purchase.php",
		success: function(b) {
			var data = b;
			if( data["errcode"] ) {
				obj.data = [];
				index.message.show(data["msg"]);
			}
			else {
				obj.data = data["data"];
				obj.makeTable(obj.query);
			}
		},
		error: function() {
			obj.data = [];
			index.message.show("資料讀取發生錯誤，請稍後再試。");
		}
	});
}
admin.makeTable = function(q) {
	admin.query = q;
	$table = $("<table></table>").addClass("ui striped compact table").attr("id", "#data");
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
				str += "<td>" + elem[key] + "</td>"
			}
			str += "<td>登記繳費</td><td><a href='javascript:admin.del(" + elem["cid"] + ")'>刪除</a></td>";
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
				obj.data = [];
				index.message.show("資料讀取發生錯誤，請稍後再試。");
			}
		});
	}
}



$(index.init);
