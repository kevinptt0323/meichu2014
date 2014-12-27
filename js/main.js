var
	index = { },
	fullpage = { },
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
			'easing': 'easeOutQuart',
			'easingcss3': 'ease-out',
			'scrollingSpeed': 1000,
			'scrollOverflow': true,

			//design
			'resize': false,
			'paddingTop': '45px',

			//events
			'afterRender' : callback
		});
}

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
