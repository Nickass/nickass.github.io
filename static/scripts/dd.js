$(function () {
  $('.DD__toggler').on('click', function(e) {
    e.preventDefault();
    var self = $(this).addClass('active');
    var sibling = self.siblings('.DD__list').addClass('open');
    sibling.slideDown(200, function() {
      $(document.body).on('click', function blurHandler(e) {
        if($(e.target).is(sibling) || 
          $(e.target).closest(sibling).length !== 0)
          return;
        else {
          $(document.body).off('click', blurHandler);
          self.removeClass('active');
          sibling.slideUp(200).removeClass('open');
          return false;
        }
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uICgpIHtcclxuICAkKCcuRERfX3RvZ2dsZXInKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgc2VsZiA9ICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgdmFyIHNpYmxpbmcgPSBzZWxmLnNpYmxpbmdzKCcuRERfX2xpc3QnKS5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgc2libGluZy5zbGlkZURvd24oMjAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCBmdW5jdGlvbiBibHVySGFuZGxlcihlKSB7XHJcbiAgICAgICAgaWYoJChlLnRhcmdldCkuaXMoc2libGluZykgfHwgXHJcbiAgICAgICAgICAkKGUudGFyZ2V0KS5jbG9zZXN0KHNpYmxpbmcpLmxlbmd0aCAhPT0gMClcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICQoZG9jdW1lbnQuYm9keSkub2ZmKCdjbGljaycsIGJsdXJIYW5kbGVyKTtcclxuICAgICAgICAgIHNlbGYucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgc2libGluZy5zbGlkZVVwKDIwMCkucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pOyJdLCJmaWxlIjoiZGQuanMifQ==
