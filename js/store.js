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
		url: "api/products.php",
		success: function(b) {
			var data = JSON.parse(b);
			if( data["errcode"] ) {
				console.error("get products failed");
			}
			else {
				obj.data = data["products"];
				obj.makeStore();
			}
		}
	});
},
store.makeStore = function() {
	var template = '<div class="card" data-id="{{id}}"> <div class="dimmable image"> <div class="ui dimmer"> <div class="content"> <div class="center"> <div class="ui inverted button add"><i class="plus icon"></i>Add To Cart</div> </div> </div> </div> <img src="{{src}}"> </div> <div class="content"> <div class="header">{{name}}</div> <div class="meta"> <span class="price">{{price}}</span> <span class="special price">{{special}}</span> </div> <div class="description">{{description}}</div> </div> </div>';
	for(var i=0; i<this.data.length; i++) {
		var newItem = template.replace("{{name}}", this.data[i].name)
			.replace("{{id}}", this.data[i].id)
			.replace("{{src}}", this.data[i].src)
			.replace("{{price}}", this.data[i].price)
			.replace("{{special}}", this.data[i].special || "" )
			.replace("{{description}}", this.data[i].description || "");
		$("#products").append(newItem);
		if( this.data[i].special )
			$(".card:last-child").find(".meta").addClass("special");
	}
	$(".dimmable.image").dimmer({ on: "hover" });

	var obj = this;
	$(".add.button").on('click', function() {
		obj.cart.add($(this).closest(".card").attr("data-id"));
	});
},
store.cart = {
	init : function() {
		this.data = [];
	},
	add : function(id) {
		console.log("add item to cart: " + id);
		var inarr = false;
		this.data.forEach(function(value, index) {
			if( value["id"] == id ) {
				value["num"]++;
				inarr = true;
			}
		});
		if( !inarr ) 
			this.data.push({ "id" : id, "num" : 1 });
		console.log(this.data);
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

