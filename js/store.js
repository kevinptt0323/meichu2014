store = { };
store.cart = { };
store.query = { };
store.init = function() {
	this.initProducts();
	this.query.init();
	//this.initCookie();
},
store.initProducts = function() {
	var obj = this;
	$.ajax({
		dataType: "json",
		url: "api/goods.php",
		timeout: 10000,
		success: function(b) {
			var data = b;
			if( data["errcode"] ) {
				obj.data = [];
				index.message.show(data["msg"]);
			}
			else {
				obj.data = data["goods"];
				obj.makeStore();
				obj.cart.init();
			}
		},
		error: function() {
			obj.data = [];
			index.message.show("資料讀取發生錯誤，請稍後再試。");
		}
	});
},
store.makeStore = function() {
	var card = '<div class="card" data-gid="{{gid}}"> <div class="dimmable image"> <div class="ui dimmer"> <div class="content"> <div class="center"> <div class="ui inverted button view"><i class="zoom icon"></i>商品資訊</div> </div> </div> </div> <img src="{{src}}"> </div> <div class="content"> <a class="header">{{name}}</a> <div class="meta ui tag label price"> <span>{{price}}</span> <span class="special">{{special}}</span> </div> </div> </div>';
	this.data.forEach(function(elem) {
		if( elem.amount<0 ) return;
		var newItem = card
			.replace("{{name}}", elem.name)
			.replace("{{gid}}", elem.gid)
			.replace("{{src}}", (elem.src instanceof Array)?elem.src[0]:elem.src)
			.replace("{{price}}", elem.price)
			.replace("{{special}}", elem.special || "" )
		$("#goods").append(newItem);
		if( elem.special )
			$(".card:last-child .price").addClass("special");
	})
	$(".dimmable.image").dimmer({ on: "hover" });

	var gwindow = '<i class="close icon"></i> <div class="content"> <div class="ui medium image"> <a class="preview" target="_blank"><img title="點此可觀看放大圖"></a> </div> <div class="description"> <div class="ui huge header name"> {{name}} </div> <div class="ui basic segment description"> {{description}} </div> <div class="ui right aligned basic segment"> <div class="meta ui huge tag label price"> <span> {{price}} </span>&nbsp; <span class="special"> {{special}} </span> </div> </div> </div> </div> <div class="actions"> <div id="selector"></div> <div class="ui medium pagination menu" id="amount"> <a class="minus icon item"> <i class="minus icon"></i> </a> <div class="item"> <div class="ui transparent input"> <input type="text" value="1"> </div> </div> <a class="add icon item"> <i class="plus icon"></i> </a> </div> <div class="ui positive button add-to-cart" data-gid="{{gid}}"> <i class="plus icon"></i> 新增至購物車 </div> <div class="ui negative button sold-out" data-gid="{{gid}}"> <i class="remove circle icon"></i> 售罄 QAQ </div></div>';
	$("#goods-window")
		.html(gwindow)
		.modal({allowMultiple: true, transition: 'fade up'});
	$(window).trigger("resize");

	var obj = this;
	$(".card").on('click', function() {
		obj.view($(this).attr("data-gid"));
	});
},
store.view = function(gid) {
	console.log("view item: " + gid);

	$gwindow = $("#goods-window");
	var obj = this;
	this.data.forEach(function(elem) {
		if( elem.gid == gid ) {
			/* replace data in $gwindow */
			console.log(elem.name);
			$gwindow.find(".name.header").html(elem.name);
			$gwindow.find(".button").attr("data-gid", elem.gid);
			$gwindow.find("a.preview").attr("href", (elem.src instanceof Array)?elem.src[0]:elem.src).children("img").attr("src", (elem.src instanceof Array)?elem.src[0]:elem.src);
			$gwindow.find(".price > span:not(.special)").html(elem.price);
			$gwindow.find(".price > span.special").html(elem.special || "");
			$gwindow.find(".description.segment").html(elem.description || "");
			$gwindow.find("#amount > div > .ui.input input").val(1);
			if( elem.special )
				$gwindow.find(".price").addClass("special");
			else
				$gwindow.find(".price").removeClass("special");
			if( elem["sub-id"] ) {
				$("#selector").addClass("sub-item").html("");
				elem["sub-id"].forEach(function(sub_items,index) {
					var $dd = $("<select></select>").addClass("ui bottom left pointing compact dropdown");
					sub_items.forEach(function(sub_item) {
						$dd.append(new Option(sub_item, sub_item));
					});
					if( (elem.src instanceof Array) && sub_items.length == elem.src.length )
						$dd.appendTo("#selector").dropdown({
							transition:"fade up",
							onChange: function(value, text) {
								var src = elem.src[sub_items.indexOf(value)];
								$gwindow.find("a.preview").attr("href", src).children("img").attr("src", src);
							},
						});
					else 
						$dd.appendTo("#selector").dropdown({
							transition:"fade up",
						});
				});
			}
			else {
				$("#selector").removeClass("sub-item").html("");
				$("<select></select>").addClass("ui bottom left pointing dropdown").appendTo($("#selector"));
				var $dd = $("#selector > .ui.dropdown");
				$dd.dropdown({transition:"fade up"});
			}

			/* show gwindow */
			$gwindow.modal('show');

			/* pagination menu handler */
			var $amount = $gwindow.find("#amount")
			$amount.children(".minus.item")
				.unbind('click')
				.on('click', function() {
					var val = $amount.find("div > .ui.input input").val()|0;
					$amount.find("div > .ui.input > input").val(val>1?val-1:1);
				});
			$amount.children(".add.item")
				.unbind('click')
				.on('click', function() {
					var val = $amount.find("div > .ui.input input").val()|0;
					$amount.find("div > .ui.input > input").val(val<1?1:val+1);
				});

			/* add to cart handler */
			if( elem.amount==parseInt(0) ) {
				$gwindow.find(".add-to-cart.button")
					.hide()
					.unbind('click');
				$gwindow.find(".sold-out.button")
					.show()
					.unbind('click');
			}
			else {
				$gwindow.find(".sold-out.button")
					.hide();
				$gwindow.find(".add-to-cart.button")
					.show()
					.unbind('click')
					.on('click', function(){
						var val = $amount.find("div > .ui.input input").val()|0;
						if( val<=0 ) val = 1;
						if( obj.cart.add(
								elem.gid,
								$("#selector > .ui.dropdown").dropdown("get value"),
								parseInt($amount.find("div > .ui.input > input").val(val).val())
							)
						)
							index.message.show("加入購物車成功!");
					});
			}
		}
	});
};

store.cart.checkout = { },
store.cart.init = function() {
	this.initCookie();
	this.list = JSON.parse($.cookie(this.cookieID));
	this.update();

	var obj = this;
	$("#cart .actions .checkout.button").on("click", function() {
		obj.checkout.show();
	});
	$("#cart .actions .clear.button").on("click", function() {
		obj.list = [];
		obj.update();
	});
	$("#checkout-window").modal({allowMultiple: true, transition: 'fade up'});

	$("#checkout-window .form").form({
		name: { identifier: 'name', rules: [ { type: 'empty', } ] },
		studentID: { identifier: 'studentID', rules: [ { type: 'empty', } ] },
		phone: { identifier: 'phone', rules: [ { type: 'empty', } ] },
		email: { identifier: 'email', rules: [ { type: 'email', } ] }
	});
},
store.cart.initCookie = function() {
	this.cookieID = "cart";
	var preCookie = $.cookie(this.cookieID);
	if( preCookie ) {
		console.log("previous cookie detected");
		console.log(preCookie);
	}
	else {
		$.cookie(this.cookieID, '[]', { expires: 1 });
		console.log("new cookie construct");
	}
},
store.cart.add = function(gid, sub_id, amount) {
	console.log("add item to cart: " + gid + "-" + sub_id + " * " + amount);
	var inarr = false;
	var same = function(a, b) {
		var ret = true;
		if( (a instanceof Array) && (b instanceof Array) ) {
			if( a.length!=b.length ) ret = false;
			else
				a.forEach(function(elem, index) {
					if( elem!=b[index] )
						ret = false;
				});
		}
		else if( !(a instanceof Array) && !(b instanceof Array) ) {
			ret = (a==b);
		}
		else
			ret = false;
		return ret;
	};
	this.list.forEach(function(value, index) {
		if( value["gid"] == gid && ( !sub_id || same(value["sub-id"], sub_id) ) ) {
			value["num"] += amount;
			//value["num"] = parseInt(value["num"]) + parseInt(amount);
			inarr = true;
		}
	});
	if( !inarr ) {
		if( sub_id )
			this.list.push({ "gid" : gid, "sub-id" : sub_id, "num" : parseInt(amount) });
		else
			this.list.push({ "gid" : gid, "num" : parseInt(amount) });
	}
	console.log(this.list);
	this.update();
	return true;
},
store.cart.remove = function(index) {
	console.log("remove item from cart: " + index);
	this.list.splice(index, 1);
	this.update();
},
store.cart.update = function() {
	this.list.sort(function(a,b) {
		return a["gid"]!=b["gid"]?a["gid"]-b["gid"]:a["sub-id"]-b["sub-id"];
	});
	$.cookie(this.cookieID, JSON.stringify(this.list), { expires: 1 });

	$cart = $("#cart > .items");
	$cart.html($cart.children().first());
	var cart_item = '<div class="item" data-index="{{index}}" data-gid="{{gid}}" data-subid="{{sub-id}}"> <div class="image"> <img src="{{src}}"> </div> <div class="content"> <div class="ui grid"> <div class="seven wide column description"> <a class="ui header">{{name}}</a> <div class="meta">{{sub-id}}</div> </div> <div class="four wide column price"> <span>{{price}}</span>&nbsp;<span class="special">{{special}}</span> </div> <div class="two wide column amount">{{amount}}</div> <div class="two wide column total">{{total}}</div> <div class="one wide column"><i class="large link close icon"></i></div> </div> </div> </div>';
	var total = 0;
	var poker_count = 0;
	this.list.forEach(function(elem, index) {
		var data = store.data.filter(function(elem2) {
			return elem2.gid==elem.gid;
		})[0];
		var src = (data.src instanceof Array)?data.src[data["sub-id"][0].indexOf((elem["sub-id"] instanceof Array)?elem["sub-id"][0]:elem["sub-id"])]:data.src;
		var newItem = cart_item
			.replace("{{index}}", index)
			.replace("{{gid}}", elem.gid)
			.replace(/{{sub-id}}/g, elem["sub-id"] || "無")
			.replace("{{src}}", src)
			.replace("{{name}}", data.name)
			.replace("{{price}}", data.price)
			.replace("{{special}}", data.special)
			.replace("{{amount}}", elem.num)
			.replace("{{total}}", (data.special||data.price) * elem.num);
		$cart.append(newItem);
		if( data.special )
			$cart.find(".item:last-child .price").addClass("special");
		total += (data.special||data.price) * elem.num;
		if( elem.gid==7 ) poker_count += elem.num;
	});
	console.log(poker_count);
	if( poker_count>1 ) {
		total += (poker_count/2|0) * -20;
		var newItem = cart_item
			.replace("{{index}}", this.list.length)
			.replace("{{gid}}", "")
			.replace(/{{sub-id}}/g, "")
			.replace("{{src}}", store.data[6].src)
			.replace("{{name}}", "梅竹撲克牌(兩副特價$180)")
			.replace("{{price}}", "0")
			.replace("{{special}}", "-20")
			.replace("{{amount}}", (poker_count/2|0))
			.replace("{{total}}", (poker_count/2|0) * -20);
		$cart.append(newItem);
		$cart.find(".item:last-child .price").addClass("special");
	}

	/* events */
	var obj = this;
	$cart.find(".item").on("click", function() {
		store.view($(this).attr("data-gid"));
	});
	$cart.find(".close.icon").on("click", function() {
		obj.remove($(this).closest(".item").attr("data-index"));
	});
	$("#cart .actions .total").html(total);
	$(window).trigger("resize");
};

store.cart.checkout.show = function() {
	var total = $("#cart .actions .total").html();
	if( total == 0 ) {
		index.message.show("購物車內無商品！");
		return false;
	}
	var $checkout = $("#checkout-window");
	$('.modal').modal('hide');
	$checkout.modal('show');
	$checkout.find(".actions .positive.button")
		.unbind("click")
		.bind("click", this.send);
},
store.cart.checkout.send = function() {
	if( !$("#checkout-window .form").form('validate form') ) {
		index.message.show("請務必輸入完整資料！");
		return false;
	}
	$("#checkout-window > .content > .ui.dimmer").addClass("active");
	$("#checkout-window .actions .positive.button").unbind("click");
	var $checkout = $("#checkout-window");
	var $inputs = $checkout.find(".ui.input");
	var data = {
		"name" : $inputs.find("input.name").val(),
		"studentID" : $inputs.find("input.studentID").val(),
		"phone" : $inputs.find("input.phone").val(),
		"email" : $inputs.find("input.email").val(),
		"list" : store.cart.list
	};
	console.log(data);
	$.ajax({
		type: "POST",
		url: "api/checkout.php",
		data: data,
		dataType: "json",
		timeout: 10000,
		success: function(b) {
			var data = b;
			if( data["errcode"] ) {
				console.error(data["errcode"]);
				index.message.show(data["msg"]);
			}
			else {
				index.message.show(data["msg"], false);
				store.cart.list = [];
				store.cart.update();
			}
		},
		error: function() {
			index.message.show("伺服器發生錯誤，請稍後再試。");
		},
		complete: function() {
			$("#checkout-window > .content > .ui.dimmer").removeClass("active");
			$("#checkout-window .actions .positive.button").bind("click", store.cart.checkout.send);
		}
	});
}

store.query.init = function () {
	$("#query > .ui.form").form({
		name: { identifier: 'name', rules: [ { type: 'empty', } ] },
		phone: { identifier: 'phone', rules: [ { type: 'empty', } ] }
	});
	$("#query .query.button").on('click', function() {
		if( !$("#query > .ui.form").form('validate form') ) {
			index.message.show("請務必輸入完整資料！");
			return false;
		}
		$("#query-window").modal({transition: 'fade up'});
		$.ajax({
			type: "POST",
			url: "api/query.php",
			data: {name: $("#query > .form .name").val(), phone: $("#query > .form .phone").val()},
			dataType: "json",
			timeout: 10000,
			success: function(b) {
				var data = b;
				if( data["errcode"] ) {
					console.error(data["errcode"]);
					index.message.show(data["msg"]);
				}
				else {
					var $result = $("#query-window");
					$result.find(".content").html("共查到 " + data["data"].length + "筆資料");
					$table = $("<table></table>").addClass("ui striped compact collapsing table");
					$table.html("<thead><tr><th>姓名</th><th>學號</th><th>電話</th><th>e-mail</th><th>總計</th><th>繳費時間</th><th>領貨時間</th><th>訂單內容</th></tr></thead>");
					data["data"].forEach(function(elem) {
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
						$table.append("<tr>" + str + "</tr>");
					});
					$result.find(".content").append($table);
					$result.modal('show');
				}
			},
			error: function() {
				index.message.show("伺服器發生錯誤，請稍後再試。");
			},
		});
	});
}
