var
	index = { },
	fullpage = { },
	nav = { }
;

index.init = function() {
	store.init();
	activity.init(function() {fullpage.init(nav.init);});
	$("#global-message").modal({allowMultiple: true, transition: 'fade up'});
}
index.message = { };

// show msg and hide other modals if !allowMultiple
index.message.show = function(msg, allowMultiple) {
	allowMultiple = !( (typeof allowMultiple === "boolean") && !allowMultiple );
	console.log(msg);
	var $obj = $("#global-message");
	$obj.html("");
	$("<div></div>").addClass("content").html(msg).appendTo($obj);
	$("<div></div>").addClass("actions").html(
		$("<div></div>").addClass("ui primary button").html("OK")
	).appendTo($obj);
	if( allowMultiple ) {
		$obj.modal('show');
		$obj.find(".ui.button")
			.unbind('click')
			.bind('click', function() {
				$obj.modal("hide");
				return false;
			});
	}
	else {
		$obj.modal({allowMultiple: false, transition: 'fade up'}).modal('show');
		$obj.find(".ui.button")
			.unbind('click')
			.bind('click', function() {
				$obj.modal({allowMultiple: true, transition: 'fade up'}).modal('hide');
				return false;
			});
	}
}

fullpage.init = function(callback) {
	$('#fullpage').fullpage({
			//navigation
			'anchors': ['index', 'store', 'activity'],
			'sectionsColor': ['transparent','transparent', 'transparent'],
			//'sectionsColor': ['rgba(255, 255, 255, 0.6)','rgba(255, 255, 220, 0.6)', 'rgba(255, 220, 255, 0.6)'],
			'scrollBar': true,

			//scrolling
			'css3': true,
			'easing': 'easeOutQuart',
			'easingcss3': 'ease-out',
			'scrollingSpeed': 1000,
			'scrollOverflow': true,

			//design
			'controlArrowColor': 'rgba(100, 100, 100, .8)',
			'resize': false,
			'paddingTop': '48px',
			'responsive': 400,

			//events
			'afterRender' : callback
		});
}

nav.init = function() {
	activity.data.forEach(function(elem, index) {
		var activity_item = '<a class="item" href="#activity/{{index}}">{{title}}</a>';
		$("#Nav > .menu > .activity.item > .dropdown > .menu").append(
			activity_item
				.replace("{{index}}", index)
				.replace("{{title}}", elem.title)
		);
	});

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
		},
		offset: "40px"
	});

	$("#Nav .ui.item .dropdown").dropdown({
		on: 'hover',
		transition : 'fade',
		className : { active : 'myActive' }
	});
	$peekItem.removeClass('active').eq( 0 ).addClass('active');
};
$(index.init);
