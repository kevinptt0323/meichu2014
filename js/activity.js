activity = { };
activity.init = function(callback) {
	var obj = this;
	$.ajax({
		dataType: "json",
		url: "api/activity.php",
		success: function(b) {
			var data = b;
			if( data["errcode"] ) {
				obj.data = [];
				index.message.show(data["msg"]);
			}
			else {
				obj.data = data["activity"];
				obj.makeActivity(callback);
			}
		},
		error: function() {
			obj.data = [];
			index.message.show("資料讀取發生錯誤，請稍後再試。");
		}
	});
},
activity.makeActivity = function(callback) {
	var activity_str = '<div class="slide"> <div class="ui basic compact segment center title"> <h2 class="ui header">{{title}}</h2> <div class="ui inverted divider"></div> <div class="description">{{description}}</div> </div> </div>';
	this.data.forEach(function(elem) {
		$(".activity.section").append(
			activity_str
				.replace("{{title}}", elem.title)
				.replace("{{description}}", elem.description)
		);
	});
	callback();
}
