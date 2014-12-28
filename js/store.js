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
	var card = '<div class="card" data-gid="{{gid}}"> <div class="dimmable image"> <div class="ui dimmer"> <div class="content"> <div class="center"> <div class="ui inverted button view"><i class="zoom icon"></i>View</div> </div> </div> </div> <img src="{{src}}"> </div> <div class="content"> <div class="header">{{name}}</div> <div class="meta ui tag label"> <span class="price">{{price}}</span> <span class="special price">{{special}}</span> </div> </div> </div>';
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

	var gwindow = '<i class="close icon"></i> <div class="content"> <div class="ui medium image"> <a class="preview" target="_blank"><img></a> </div> <div class="description"> <div class="ui huge header name"> {{name}} </div> <div class="ui basic segment description"> {{description}} </div> <div class="ui right aligned basic segment"> <div class="meta ui huge tag label"> <span class="price"> {{price}} </span>&nbsp; <span class="special price"> {{special}} </span> </div> </div> </div> </div> <div class="ui divider"></div> <div class="actions"> <div id="selector"></div> <div class="ui medium pagination menu"> <a class="minus icon item"> <i class="minus icon"></i> </a> <div class="item"> <div class="ui transparent input"> <input type="text" value="1"> </div> </div> <a class="add icon item"> <i class="plus icon"></i> </a> </div> <div class="ui green basic inverted button add-to-cart" data-gid="{{gid}}"> <i class="plus icon"></i> Add to Cart </div> </div>';
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
			console.log(elem.name);
			$gwindow.find(".name.header").html(elem.name);
			$gwindow.find(".button").attr("data-gid", elem.gid);
			$gwindow.find("a.preview").attr("href", elem.src).children("img").attr("src", elem.src);
			$gwindow.find(".price").html(elem.price);
			$gwindow.find(".special.price").html(elem.special || "");
			$gwindow.find(".description.segment").html(elem.description || "");
			if( elem.special )
				$gwindow.find(".meta").addClass("special");
			else
				$gwindow.find(".meta").removeClass("special");
			if( elem["sub-id"] ) {
				$("#selector").addClass("sub-item").html("");
				$("<select></select>").addClass("ui bottom left pointing dropdown").appendTo($("#selector"));
				var $dd = $("#selector > .ui.dropdown");
				elem["sub-id"].forEach(function(sub_item) {
					$dd.append(new Option(sub_item, sub_item));
				});
				$dd.dropdown({transition:"fade up"});
			}
			else {
				$("#selector").removeClass("sub-item").html("");
				$("<select></select>").addClass("ui bottom left pointing dropdown").appendTo($("#selector"));
				var $dd = $("#selector > .ui.dropdown");
				$dd.dropdown({transition:"fade up"});
			}
			$gwindow.modal('show');
			$gwindow.find(".add-to-cart.button")
				.unbind('click')
				.on('click', function(){
					obj.cart.add(elem.gid, $("#selector > .ui.dropdown").dropdown("get value"));
				});
			$gwindow.find("")
		}
	});
},
store.cart = {
	init : function() {
		this.list = [];
	},
	add : function(gid, sub_id) {
		console.log("add item to cart: " + gid + " - " + sub_id);
		var inarr = false;
		this.list.forEach(function(value, index) {
			if( value["gid"] == gid && ( !sub_id || value["sub-id"] == sub_id ) ) {
				value["num"]++;
				inarr = true;
			}
		});
		if( !inarr ) {
			if( sub_id )
				this.list.push({ "gid" : gid, "sub-id" : sub_id, "num" : 1 });
			else
				this.list.push({ "gid" : gid, "num" : 1 });
		}
		console.log(this.list);
		this.update();
	},
	update : function() {
	}
},

store.initCookie = function() {
	this.cookieID = "test";
	var preCookie = $.cookie(this.cookieID);
	if( preCookie ) {
		$.cookie(this.cookieID, preCookie, { expires: 1 });
		console.log("previous cookie detected");
	}
	else {
		$.cookie(this.cookieID, '', { expires: 1 });
		console.log("new cookie construct");
	}
}

