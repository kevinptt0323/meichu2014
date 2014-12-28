store = { };
store.cart = { };
store.init = function() {
	this.initProducts();
	this.cart.init();
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
			}
		}
	});
},
store.makeStore = function() {
	var card = '<div class="card" data-gid="{{gid}}"> <div class="dimmable image"> <div class="ui dimmer"> <div class="content"> <div class="center"> <div class="ui inverted button view"><i class="zoom icon"></i>View</div> </div> </div> </div> <img src="{{src}}"> </div> <div class="content"> <a class="header">{{name}}</a> <div class="meta ui tag label price"> <span>{{price}}</span> <span class="special">{{special}}</span> </div> </div> </div>';
	for(var i=0; i<this.data.length; i++) {
		var newItem = card.replace("{{name}}", this.data[i].name)
			.replace("{{gid}}", this.data[i].gid)
			.replace("{{src}}", this.data[i].src)
			.replace("{{price}}", this.data[i].price)
			.replace("{{special}}", this.data[i].special || "" )
		$("#goods").append(newItem);
		if( this.data[i].special )
			$(".card:last-child .meta").addClass("special");
	}
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
				$gwindow.find(".meta").addClass("special");
			else
				$gwindow.find(".meta").removeClass("special");
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
			$gwindow.modal('setting', 'transition', 'fade up').modal('show');

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
			$gwindow.find(".add-to-cart.button")
				.unbind('click')
				.on('click', function(){
					var val = $amount.find("div > .ui.input input").val()|0;
					if( val<=0 ) val = 1;
					obj.cart.add(
						elem.gid,
						$("#selector > .ui.dropdown").dropdown("get value"),
						parseInt($amount.find("div > .ui.input > input").val(val).val())
					);
				});
		}
	});
},
store.cart = {
	init : function() {
		this.initCookie();
		this.list = JSON.parse($.cookie(this.cookieID));
	},
	add : function(gid, sub_id, amount) {
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
	},
	update : function() {
		$.cookie(this.cookieID, JSON.stringify(this.list), { expires: 1 });
	}
},

store.cart.initCookie = function() {
	this.cookieID = "test-cart";
	var preCookie = $.cookie(this.cookieID);
	if( 0&&preCookie ) {
		$.cookie(this.cookieID, preCookie, { expires: 1 });
		console.log("previous cookie detected");
		console.log(preCookie);
	}
	else {
		$.cookie(this.cookieID, '[]', { expires: 1 });
		console.log("new cookie construct");
	}
}

