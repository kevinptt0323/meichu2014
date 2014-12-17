var index = {
	init : function() {
		$("#header .ui.dropdown.item")
			.dropdown({ on: 'hover' })
		;
		store.init();
	}
}
var store = {
	data : [
		{
			"name"  : "Product 1",
			"src" : "images/product/2.png",
			"price" : "100",
			"description" : "This is product 1"
		},
		{
			"name"  : "Product 2",
			"src" : "images/product/1.png",
			"price" : "200",
			"description" : "This is product 2"
		},
		{
			"name"  : "Product 3",
			"src" : "images/product/3.png",
			"price" : "300",
			"description" : "This is product 3"
		},
		{
			"name"  : "Product 4",
			"src" : "images/product/4.png",
			"price" : "400",
			"description" : "This is product 4"
		},
		{
			"name"  : "Product 5",
			"src" : "images/product/5.png",
			"price" : "500",
			"description" : "This is product 5"
		}
	],
	init : function() {
		this.initProducts();
		$(".dimmable.image").dimmer({ on: "hover" });
	},
	initProducts : function() {
		var template = '<div class="card"> <div class="dimmable image"> <div class="ui dimmer"> <div class="content"> <div class="center"> <div class="ui inverted button"><i class="plus icon"></i>Add To Cart</div> </div> </div> </div> <img src="{{src}}"> </div> <div class="content"> <div class="header">{{name}}</div> <div class="meta price">{{price}}</div> <div class="description">{{description}}</div> </div> </div>';
		for(var i=0; i<this.data.length; i++) {
			var newItem = template.replace("{{name}}", this.data[i].name)
				.replace("{{src}}", this.data[i].src)
				.replace("{{price}}", this.data[i].price)
				.replace("{{description}}", this.data[i].description);
			$("#products").append(newItem);
		}
	}
};
$(index.init);
