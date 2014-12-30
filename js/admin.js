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
				console.log(obj.data);
			}
		},
		error: function() {
			obj.data = [];
			index.message.show("資料讀取發生錯誤，請稍後再試。");
		}
	});
}


$(index.init);
