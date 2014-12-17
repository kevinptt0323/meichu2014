// namespace
window.semantic = {
  handler: {}
};

// ready event
semantic.ready = function() {

  // selector cache
  var
    $peek             = $('.peek.menu'),
    $peekItem         = $peek.children('.item').add($peek.children('.menu').children('.item')),
    $peekSubItem      = $peek.find('.dropdown .menu .item'),
    $waypoints        = $('.section')
  ;

  $waypoints
    .waypoint({
      handler    : function(direction) {
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
    })
  ;

  $('body')
    .waypoint({
      handler: function(direction) {
        if(direction == 'down') {
          if( !$('body').is(':animated') ) {
            $peekItem.removeClass('active')
              .eq( 0 ).addClass('active');
          }
        }
      }
     })
  ;
  $peek.waypoint('sticky', { stuckClass : 'stuck' });
};
