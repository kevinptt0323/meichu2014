store = { };
store.cart = { };
store.init = function() {
	this.initProducts();
	//this.initCookie();
},
store.initProducts = function() {
	var obj = this;
	$.ajax({
		type: "json",
		url: "api/goods.php",
		success: function(b) {
			var data = JSON.parse(b);
			if( data["errcode"] ) {
				console.error("get goods failed");
			}
			else {
				obj.data = data["goods"];
				obj.makeStore();
				obj.cart.init();
			}
		}
	});
},
store.makeStore = function() {
	var card = '<div class="card" data-gid="{{gid}}"> <div class="dimmable image"> <div class="ui dimmer"> <div class="content"> <div class="center"> <div class="ui inverted button view"><i class="zoom icon"></i>View</div> </div> </div> </div> <img src="{{src}}"> </div> <div class="content"> <a class="header">{{name}}</a> <div class="meta ui tag label price"> <span>{{price}}</span> <span class="special">{{special}}</span> </div> </div> </div>';
	this.data.forEach(function(elem) {
		var newItem = card
			.replace("{{name}}", elem.name)
			.replace("{{gid}}", elem.gid)
			.replace("{{src}}", elem.src)
			.replace("{{price}}", elem.price)
			.replace("{{special}}", elem.special || "" )
		$("#goods").append(newItem);
		if( elem.special )
			$(".card:last-child .price").addClass("special");
	})
	$(".dimmable.image").dimmer({ on: "hover" });

	var gwindow = '<i class="close icon"></i> <div class="content"> <div class="ui medium image"> <a class="preview" target="_blank"><img></a> </div> <div class="description"> <div class="ui huge header name"> {{name}} </div> <div class="ui basic segment description"> {{description}} </div> <div class="ui right aligned basic segment"> <div class="meta ui huge tag label price"> <span> {{price}} </span>&nbsp; <span class="special"> {{special}} </span> </div> </div> </div> </div> <div class="ui divider"></div> <div class="actions"> <div id="selector"></div> <div class="ui medium pagination menu" id="amount"> <a class="minus icon item"> <i class="minus icon"></i> </a> <div class="item"> <div class="ui transparent input"> <input type="text" value="1"> </div> </div> <a class="add icon item"> <i class="plus icon"></i> </a> </div> <div class="ui green button add-to-cart" data-gid="{{gid}}"> <i class="plus icon"></i> Add to Cart </div> </div>';
	$("#goods-window").html(gwindow);

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
			$gwindow.find("a.preview").attr("href", elem.src).children("img").attr("src", elem.src);
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
				elem["sub-id"].forEach(function(sub_items) {
					var $dd = $("<select></select>").addClass("ui bottom left pointing dropdown");
					sub_items.forEach(function(sub_item) {
						$dd.append(new Option(sub_item, sub_item));
					});
					$dd.appendTo("#selector").dropdown({transition:"fade up"});
				});
			}
			else {
				$("#selector").removeClass("sub-item").html("");
				$("<select></select>").addClass("ui bottom left pointing dropdown").appendTo($("#selector"));
				var $dd = $("#selector > .ui.dropdown");
				$dd.dropdown({transition:"fade up"});
			}

			/* show gwindow */
			$gwindow.modal({
				transition: "fade up"
			}).modal('show');

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
			$gwindow.find(".add-to-cart.button")
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
},
store.cart.initCookie = function() {
	this.cookieID = "test-cart";
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
	this.list.forEach(function(value, index) {
		if( value["gid"] == gid && ( !sub_id || value["sub-id"] == sub_id || (value["sub-id"][0]==sub_id[0]&&value["sub-id"][1]==sub_id[1]) ) ) {
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
	this.list.forEach(function(elem, index) {
		var data = store.data.filter(function(elem2) {
			return elem2.gid==elem.gid;
		})[0];
		var newItem = cart_item
			.replace("{{index}}", index)
			.replace("{{gid}}", elem.gid)
			.replace(/{{sub-id}}/g, elem["sub-id"] || "無")
			.replace("{{src}}", data.src)
			.replace("{{name}}", data.name)
			.replace("{{price}}", data.price)
			.replace("{{special}}", data.special)
			.replace("{{amount}}", elem.num)
			.replace("{{total}}", (data.special||data.price) * elem.num);
		$cart.append(newItem);
		if( data.special )
			$cart.find(".item:last-child .price").addClass("special");
		total += (data.special||data.price) * elem.num;
	});

	/* events */
	var obj = this;
	$cart.find(".ui.header").on("click", function() {
		store.view($(this).closest(".item").attr("data-gid"));
	});
	$cart.find(".close.icon").on("click", function() {
		obj.remove($(this).closest(".item").attr("data-index"));
	});
	$("#cart .actions .total").html(total);
	$(window).trigger("resize");
};

store.cart.checkout.show = function() {
	$checkout = $("#checkout-window");
	$
},
store.cart.checkout.send = function() {
}
