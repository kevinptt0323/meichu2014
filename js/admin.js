index = { };
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
admin = { };
admin.init = function() {
	this.query = "customer";
	this.getData();
},
admin.getData = function() {
	var obj = this;
	$.ajax({
		type: "POST",
		data: {kevinptt: true, customer: "all"}, 
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
	$table = $("<table></table>").addClass("ui striped compact table").attr("id", "#data");
	var thead = "";
	var data = this.data[q];
	for(key in data[0])
		thead += "<th>" + key + "</th>"
	thead += "<th></th><th></th>";

	$table.append("<thead><tr>" + thead + "</tr></thead>");
	data.forEach(function(elem) {
		var str = "";
		for(key in elem) {
			str += "<td>" + elem[key] + "</td>"
		}
		str += "<td>登記繳費</td><td>刪除</td>";
		$table.append("<tr>" + str + "</tr>");
	});
	$(".content").append($table);
}


$(index.init);
