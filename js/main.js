var
	index = { },
	fullpage = { },
	store = { },
	nav = { }
;

index.init = function() {
	store.init();
	fullpage.init(nav.init);
	$("body").css("overflow", "hidden");
}

fullpage.init = function(callback) {
	$('#fullpage').fullpage({
			//navigation
			'anchors': ['index', 'store', 'activity', 'about'],
			//'sectionsColor': ['transparent','transparent', 'transparent'],
			'sectionsColor': ['rgba(255, 255, 255, 0.6)','rgba(255, 255, 220, 0.6)', 'rgba(255, 220, 255, 0.6)', 'rgba(220, 255, 255, 0.6)'],
			'scrollBar': true,

			//scrolling
			'css3': true,
			'easing': 'easeOutBounce',
			'scrollingSpeed': 1000,
			'scrollOverflow': true,

			//design
			'resize': false,
			'paddingTop': '45px',

			//events
			'afterRender' : callback
		});
}

store.init = function() {
	this.initProducts();
	$(".dimmable.image").dimmer({ on: "hover" });
},
store.initProducts = function() {
	store.data = [
		{
			"name"  : "Product 1",
			"src" : "images/product/2.png",
			"price" : "100",
			"special" : "1",
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
	];
	var template = '<div class="card"> <div class="dimmable image"> <div class="ui dimmer"> <div class="content"> <div class="center"> <div class="ui inverted button"><i class="plus icon"></i>Add To Cart</div> </div> </div> </div> <img src="{{src}}"> </div> <div class="content"> <div class="header">{{name}}</div> <div class="meta"> <span class="price">{{price}}</span> <span class="special price">{{special}}</span> </div> <div class="description">{{description}}</div> </div> </div>';
	for(var i=0; i<this.data.length; i++) {
		var newItem = template.replace("{{name}}", this.data[i].name)
			.replace("{{src}}", this.data[i].src)
			.replace("{{price}}", this.data[i].price)
			.replace("{{special}}", this.data[i].special || "" )
			.replace("{{description}}", this.data[i].description);
		$("#products").append(newItem);
		if( this.data[i].special )
			$(".card:last-child").find(".meta").addClass("special");
	}
};
nav.init = function() {

	var
		$peek = $('.peek.menu'),
		$peekItem = $peek.children('.item').add($peek.children('.menu').children('.item')),
		$peekSubItem = $peek.find('.dropdown .menu .item'),
		$waypoints = $('.section')
	;

	$waypoints .waypoint({
		handler : function(direction) {
			var
				index = (direction == 'down')
					? $waypoints.index(this)
					: ($waypoints.index(this) - 1 >= 0)
						? ($waypoints.index(this) - 1)
						: 0
			;
			$peekItem.removeClass('active')
				.eq( index ).addClass('active');
		}
	});

	$("#Nav .ui.dropdown.item").dropdown({
		on: 'hover',
		transition : 'fade',
		className : { active : 'myActive' }
	});
	$peekItem.removeClass('active').eq( 0 ).addClass('active');
};
$(index.init);
