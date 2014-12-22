store = { };
store.cart = { };
store.init = function() {
	this.initProducts();
	this.cart.init();
	//this.initCookie();
},
store.initProducts = function() {
	this.data = [
		{
			"id" : "1",
			"name"  : "Product 1",
			"src" : "images/product/2.png",
			"price" : "100",
			"special" : "1",
			"description" : "This is product 1"
		},
		{
			"id" : "2",
			"name"  : "Product 2",
			"src" : "images/product/1.png",
			"price" : "200",
			"description" : "This is product 2"
		},
		{
			"id" : "3",
			"name"  : "Product 3",
			"src" : "images/product/3.png",
			"price" : "300",
			"description" : "This is product 3"
		},
		{
			"id" : "4",
			"name"  : "Product 4",
			"src" : "images/product/4.png",
			"price" : "400",
			"description" : "This is product 4"
		},
		{
			"id" : "5",
			"name"  : "Product 5",
			"src" : "images/product/5.png",
			"price" : "500",
			"description" : "This is product 5"
		}
	];

	var template = '<div class="card" data-id="{{id}}"> <div class="dimmable image"> <div class="ui dimmer"> <div class="content"> <div class="center"> <div class="ui inverted button add"><i class="plus icon"></i>Add To Cart</div> </div> </div> </div> <img src="{{src}}"> </div> <div class="content"> <div class="header">{{name}}</div> <div class="meta"> <span class="price">{{price}}</span> <span class="special price">{{special}}</span> </div> <div class="description">{{description}}</div> </div> </div>';
	for(var i=0; i<this.data.length; i++) {
		var newItem = template.replace("{{name}}", this.data[i].name)
			.replace("{{id}}", this.data[i].id)
			.replace("{{src}}", this.data[i].src)
			.replace("{{price}}", this.data[i].price)
			.replace("{{special}}", this.data[i].special || "" )
			.replace("{{description}}", this.data[i].description);
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

