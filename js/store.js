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
	var template = '<div class="card" data-gid="{{gid}}"> <div class="dimmable image"> <div class="ui dimmer"> <div class="content"> <div class="center"> <div class="ui inverted button view"><i class="zoom icon"></i>View</div> </div> </div> </div> <img src="{{src}}"> </div> <div class="content"> <div class="header">{{name}}</div> <div class="meta ui tag label"> <span class="price">{{price}}</span> <span class="special price">{{special}}</span> </div> <div class="description">{{description}}</div> </div> </div>';
	for(var i=0; i<this.data.length; i++) {
		var newItem = template.replace("{{name}}", this.data[i].name)
			.replace("{{gid}}", this.data[i].gid)
			.replace("{{src}}", this.data[i].src)
			.replace("{{price}}", this.data[i].price)
			.replace("{{special}}", this.data[i].special || "" )
			.replace("{{description}}", this.data[i].description || "");
		$("#goods").append(newItem);
		if( this.data[i].special )
			$(".card:last-child .meta").addClass("special");
	}
	$(".dimmable.image").dimmer({ on: "hover" });

	var obj = this;
	$(".card").on('click', function() {
		obj.view($(this).attr("data-gid"));
	});
},
store.view = function(gid) {
	console.log("view item: " + gid);
	var template = '<i class="close icon"></i> <div class="content"> <div class="ui medium image"> <img src="{{src}}"> </div> <div class="description"> <div class="ui huge header"> {{name}} </div> <div class="ui basic segment"> {{description}} </div> <div class="ui right aligned basic segment"> <div class="meta ui huge tag label"> <span class="price"> {{price}} </span>&nbsp; <span class="special price"> {{special}} </span> </div> </div> </div> </div> <div class="ui divider"></div> <div class="actions"> <div class="ui pagination menu"> <a class="icon item"> <i class="minus icon"></i> </a> <div class="item"> <div class="ui transparent input"> <input type="text" value="0"> </div> </div> <a class="icon item"> <i class="plus icon"></i> </a> </div> <div class="ui green basic inverted button" data-gid="{{gid}}"> <i class="plus icon"></i> Add to Cart </div> </div>';

	this.data.forEach(function(value, index) {
		if( value.gid == gid ) {
			var newItem = template.replace("{{name}}", value.name)
				.replace("{{gid}}", value.gid)
				.replace("{{src}}", value.src)
				.replace("{{price}}", value.price)
				.replace("{{special}}", value.special || "" )
				.replace("{{description}}", value.description || "");
			$("#goods-window").html(newItem);
			if( value.special )
				$("#goods-window .meta").addClass("special");
			$('#goods-window').modal('show');
		}
	});
},
store.cart = {
	init : function() {
		this.data = [];
	},
	add : function(gid) {
		console.log("add item to cart: " + gid);
		var inarr = false;
		this.data.forEach(function(value, index) {
			if( value["gid"] == gid ) {
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

