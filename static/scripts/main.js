'use strict';
/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

function icon(name) {
  return '<svg class="ic-'+name+'" role="img">' +
    '<use xlink:href="static/decors/sprite.svg#ic-'+name+'"></use>' +
  '</svg>';
}
$(function () {
  $('.dd-toggler').each(function() {
    var self = $(this);
    var target = self.attr('href') ? self.attr('href').substring(self.attr('href').indexOf('#')) : 
                self.data('target') ? self.data('target') : null;

    if(!target) return;

    var targetList = $(target);
    var commonparent = $(self).parent().has(targetList).first();

    function blurHandler(e) {
      if($(e.target).is(targetList) || 
        $(e.target).closest(self).length !== 0 ||
        $(e.target).closest(targetList).length !== 0 ||
        $(e.target).is(self) ) return;
      else closeDd();
    }

    function closeDd() {
      self.removeClass('active');
      targetList.slideUp(200, function() {
        targetList.removeClass('opened');
        commonparent.removeClass('active-parent');
      });
      $(document).off('click', blurHandler)
    }

    function openDd() {
      self.addClass('active');
      targetList.slideDown(200);
      targetList.addClass('opened');
      commonparent.addClass('active-parent');
      $(document).on('click', blurHandler)
    }

    if(self.is('.active')) {
      $(document).on('click', blurHandler);
      openDd();
    }
    self.on('click', function(e) {
      e.preventDefault();
      if(targetList.is('.opened')) closeDd();
      else openDd();
    });
  });
});


$(function () {
  var switcher =$('.Switcher');
  var item = switcher.children('.Switcher__item');
  var carriage = switcher.children('.Switcher__carriage');
  carriage.offset(item.filter('.on').offset());

  item.on('click', function() {
    $(this).addClass('on').removeClass('off')
    .siblings('.Switcher__item').removeClass('on').addClass('off');
    carriage.offset($(this).offset());
    $($(this).data('target')).addClass('active');
    $(this).siblings('.Switcher__item').each(function() {
      $($(this).data('target')).removeClass('active');
    });
  });

});
$(function () {
  $('.Rating').each(function() {
    var rating = $(this);
    var input = rating.find('.Rating__input');
    var stars = rating.find('.Rating__item');
    var mleave = function() {
      stars.slice(0, input.val())
      .addClass('active').last().nextAll().removeClass('active');
    }
    
    stars.on('click', function() {
      input.val($(this).prevAll('.Rating__item').add(this).length);
    });
    stars.on('mouseover', function() {
      $(this).prevAll('.Rating__item').add(this).addClass('active');
      $(this).nextAll('.Rating__item').removeClass('active');
    });
    rating.on('mouseleave', mleave);
    
    mleave();
  });
});



var Catalog = function () {
  var catalog = $(this);
  var items = catalog.find('.Catalog__item');
  var btnList = $('<button class="Catalog__btn-markup" type="button">'
    +icon('list')+'</button>');
  var btnGrid = $('<button class="Catalog__btn-markup" type="button">'
    +icon('grid')+'</button>');
  var isSlider = catalog.data('slider');
  var showCtrls = catalog.data('show-ctrls');
  var showCounter = catalog.data('show-counter')
  var ctrlContainer = $('<div class="Catalog__ctrls"></div>');
  var allNumberContainer = $('<span class="Catalog__all-number"></span>');
  var counterContainer = $('<span class="Catalog__counter"></span>');
  var leftEdge = $('<div class="Catalog__edge-left"></div>');
  var rightEdge = $('<div class="Catalog__edge-right"></div>');
  var pd = 8;
  var mark = catalog.data('mark');
  if(mark !== 'grid' || mark !== 'list') mark = 'grid';
  
  function changeProductMark(mark) {
    catalog.attr('data-mark', mark);
    if(mark === 'grid') {
      items.addClass('is-grid');
      items.removeClass('is-list');
      btnGrid.addClass('active');
      btnList.removeClass('active');
    } else if(mark === 'list') {
      items.addClass('is-list');
      items.removeClass('is-grid');
      btnList.addClass('active');
      btnGrid.removeClass('active');
    }
    if(isSlider) reloadSlider();
  }
  function getOptionSlick() {
    var count = parseInt( (
      catalog.outerWidth() - 
      catalog.outerWidth() % 
      items.outerWidth()) /
      items.outerWidth()
    );
    var mark = catalog.attr('data-mark');
    var btnLeft = '<button class="Catalog__left" ' +
    'aria-label="Previous" type="button" aria-disabled="false">'
    + self.icon('chevron') +'</button>';

    var btnRight = '<button class="Catalog__right" ' +
    'aria-label="Next" type="button" aria-disabled="false">'+
    self.icon('chevron') +'</button>';

    if($('.products-slider').hasClass('slick-initialized')) {
      $('.products-slider').slick('unslick');
    }
    return {
      rows: 1,
      initialSlide: 0,
      centerMode: false,
      slidesToShow: mark === 'list' ? 1 : count,
      focusOnSelect: false,
      slidesToScroll: 1,
      variableWidth: mark !== 'list',
      slide: '.Catalog__item',
      dots: false,
      infinite: false,
      prevArrow: btnLeft,
      nextArrow: btnRight
    }
  }
  function initSlick(e, slick) {
    var mark = catalog.attr('data-mark');
    var list = catalog.find('.slick-list');
    var track = list.find('.slick-track');
    if(mark === 'grid') {
      list.css('width','').css('height', '');
      items.css('width','').css('height', '');
    }
    var w = items.outerWidth();
    var count = parseInt(catalog.innerWidth() / w);
    var currentSlide = slick.slickCurrentSlide();
    counterContainer.text(currentSlide + count);
    allNumberContainer.text(items.length);

    slick.setOption('slidesToShow', count);

    var lOff = items.eq(currentSlide).position().left;
    var rOff = items.eq(currentSlide + count - 1).position().left +
                    items.eq(currentSlide + count - 1).outerWidth();

    leftEdge.prependTo(track)
      .css('left', lOff).width(pd).css('margin-left', -pd);
    rightEdge.appendTo(track)
      .css('left', rOff).width(pd+1).css('margin-right', -pd+1);

    var h = items.outerHeight();
    catalog.find('.slick-arrow').css('top', h/2);
    var listW = w*count+pd*2;
    list.css({
      'position': 'absolute',
      'left': catalog.outerWidth()/2-listW/2,
      'padding': pd,
      'top': -pd
    });
    list.outerWidth(listW);
    catalog.outerHeight(h);
  }
  function beforeChangeSlick(e, slick, curr, next) {
    var count = slick.getOption('slidesToShow');

    counterContainer.text(next + count);
    allNumberContainer.text(items.length);

    var lOff = items.eq(next).position().left;
    var rOff = items.eq(next + count - 1).position().left + 
                  items.eq(next + count - 1).outerWidth();

    leftEdge.css('left', lOff).width(pd).css('margin-left', -pd);
    rightEdge.css('left', rOff).width(pd).css('margin-right', -pd);
  }
  function reloadSlider() {
    if(catalog.hasClass('slick-initialized')) catalog.slick('unslick');
    if(showCtrls || showCounter) ctrlContainer.detach();

    leftEdge.detach();
    rightEdge.detach();
    allNumberContainer.css('display', 'none');
    counterContainer.css('display', 'none');
    items.off('mouseover');
    items.off('mouseleave');
    catalog.css('height', '');

    if(window.innerWidth > 767) {
      catalog.on('init', initSlick)
      .on('beforeChange', beforeChangeSlick)
      .slick(getOptionSlick());
      allNumberContainer.css('display', '');
      counterContainer.css('display', '');
      items.on('mouseover', function() {
        $(this).closest('.slick-list').css('height', 500);
      })
      items.on('mouseleave', function() {
        $(this).closest('.slick-list').css('height', '');
      })
    }

    if(showCtrls || showCounter) ctrlContainer.appendTo(catalog);
  }

  if(showCtrls || showCounter) ctrlContainer.appendTo(catalog); 
  if(showCtrls) {
    btnGrid.on('click', changeProductMark.bind(null, 'grid')).prependTo(ctrlContainer);
    btnList.on('click', changeProductMark.bind(null, 'list')).prependTo(ctrlContainer);
  }
  if(showCounter) {
    allNumberContainer.prependTo(ctrlContainer);
    counterContainer.prependTo(ctrlContainer);
  }  

  changeProductMark(mark);
  if(isSlider) {
    $(window).on('resize', reloadSlider);
  };
};

$(function() {
  $('.Catalog').each(Catalog);
});
$(window).on('load resize', function() {
  $('.width-by-content').each(function() {
    var self = $(this);
    var items = self.children();
    var pw = self.parent().innerWidth();
    var iw = items.outerWidth(true);
    self.width(parseInt(pw/iw) * iw);
  });
});

$(function() {
  $('.Brands .container').each(function() {
    var btnLeft = '<button class="Brands__left" ' +
    'aria-label="Previous" type="button" aria-disabled="false">'
    + self.icon('chevron') +'</button>';

    var btnRight = '<button class="Brands__right" ' +
    'aria-label="Next" type="button" aria-disabled="false">'+
    self.icon('chevron') +'</button>';

    $(this).slick({
      rows: 1,
      initialSlide: parseInt($(this).children().length/2),
      centerMode: true,
      focusOnSelect: false,
      slidesToScroll: 1,
      variableWidth: true,
      dots: false,
      infinite: true,
      prevArrow: btnLeft,
      nextArrow: btnRight,
    })
  });
});

$(function() {
  $('.A-pic').each(function() {
    var A_pic = $('.A-pic');
    var btnLeft = '<button class="A-pic__left" ' +
    'aria-label="Previous" type="button" aria-disabled="false">'
    + self.icon('chevron') +'</button>';
    var btnRight = '<button class="A-pic__right" ' +
    'aria-label="Next" type="button" aria-disabled="false">'+
    self.icon('chevron') +'</button>';
    
     A_pic.find('.A-pic__pic').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      lazyLoad: 'ondemand',
      asNavFor: '.A-pic__list',
      responsive: [
        {
          breakpoint: 768,
          settings: {
            dots: true,
            asNavFor: null
          }
        },
      ]
    });

    if(window.innerWidth > 767)
      A_pic.find('.A-pic__list').slick({
        rows: 1,
        centerMode: false,
        focusOnSelect: true,
        slidesToScroll: 1,
        slidesToShow: 6,
        variableWidth: false,
        dots: false,
        infinite: false,
        prevArrow: btnLeft,
        nextArrow: btnRight,
        asNavFor: '.A-pic__pic',
        responsive: [{
          breakpoint: 1020,
          settings: {
            slidesToShow: 4,
          }
        }]
      });
    else
      A_pic.find('.A-pic__list').hide();
  });
});

$(function() {
  $('.btn-cart').magnificPopup({type:'inline'});
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAnLi9jb21tb24vdGFiLmpzJztcclxuXHJcbmZ1bmN0aW9uIGljb24obmFtZSkge1xyXG4gIHJldHVybiAnPHN2ZyBjbGFzcz1cImljLScrbmFtZSsnXCIgcm9sZT1cImltZ1wiPicgK1xyXG4gICAgJzx1c2UgeGxpbms6aHJlZj1cInN0YXRpYy9kZWNvcnMvc3ByaXRlLnN2ZyNpYy0nK25hbWUrJ1wiPjwvdXNlPicgK1xyXG4gICc8L3N2Zz4nO1xyXG59XHJcblxyXG5pbXBvcnQgJy4vY29tbW9uL2RkLmpzJztcclxuaW1wb3J0ICcuLi9jb21wb25lbnRzL2luZGV4LmRlcCc7XHJcblxyXG5cclxuJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICQoJy53aWR0aC1ieS1jb250ZW50JykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIHZhciBzZWxmID0gJCh0aGlzKTtcclxuICAgIHZhciBpdGVtcyA9IHNlbGYuY2hpbGRyZW4oKTtcclxuICAgIHZhciBwdyA9IHNlbGYucGFyZW50KCkuaW5uZXJXaWR0aCgpO1xyXG4gICAgdmFyIGl3ID0gaXRlbXMub3V0ZXJXaWR0aCh0cnVlKTtcclxuICAgIHNlbGYud2lkdGgocGFyc2VJbnQocHcvaXcpICogaXcpO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbiQoZnVuY3Rpb24oKSB7XHJcbiAgJCgnLkJyYW5kcyAuY29udGFpbmVyJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIHZhciBidG5MZWZ0ID0gJzxidXR0b24gY2xhc3M9XCJCcmFuZHNfX2xlZnRcIiAnICtcclxuICAgICdhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1kaXNhYmxlZD1cImZhbHNlXCI+J1xyXG4gICAgKyBzZWxmLmljb24oJ2NoZXZyb24nKSArJzwvYnV0dG9uPic7XHJcblxyXG4gICAgdmFyIGJ0blJpZ2h0ID0gJzxidXR0b24gY2xhc3M9XCJCcmFuZHNfX3JpZ2h0XCIgJyArXHJcbiAgICAnYXJpYS1sYWJlbD1cIk5leHRcIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1kaXNhYmxlZD1cImZhbHNlXCI+JytcclxuICAgIHNlbGYuaWNvbignY2hldnJvbicpICsnPC9idXR0b24+JztcclxuXHJcbiAgICAkKHRoaXMpLnNsaWNrKHtcclxuICAgICAgcm93czogMSxcclxuICAgICAgaW5pdGlhbFNsaWRlOiBwYXJzZUludCgkKHRoaXMpLmNoaWxkcmVuKCkubGVuZ3RoLzIpLFxyXG4gICAgICBjZW50ZXJNb2RlOiB0cnVlLFxyXG4gICAgICBmb2N1c09uU2VsZWN0OiBmYWxzZSxcclxuICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXHJcbiAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgcHJldkFycm93OiBidG5MZWZ0LFxyXG4gICAgICBuZXh0QXJyb3c6IGJ0blJpZ2h0LFxyXG4gICAgfSlcclxuICB9KTtcclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICQoJy5BLXBpYycpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgQV9waWMgPSAkKCcuQS1waWMnKTtcclxuICAgIHZhciBidG5MZWZ0ID0gJzxidXR0b24gY2xhc3M9XCJBLXBpY19fbGVmdFwiICcgK1xyXG4gICAgJ2FyaWEtbGFiZWw9XCJQcmV2aW91c1wiIHR5cGU9XCJidXR0b25cIiBhcmlhLWRpc2FibGVkPVwiZmFsc2VcIj4nXHJcbiAgICArIHNlbGYuaWNvbignY2hldnJvbicpICsnPC9idXR0b24+JztcclxuICAgIHZhciBidG5SaWdodCA9ICc8YnV0dG9uIGNsYXNzPVwiQS1waWNfX3JpZ2h0XCIgJyArXHJcbiAgICAnYXJpYS1sYWJlbD1cIk5leHRcIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1kaXNhYmxlZD1cImZhbHNlXCI+JytcclxuICAgIHNlbGYuaWNvbignY2hldnJvbicpICsnPC9idXR0b24+JztcclxuICAgIFxyXG4gICAgIEFfcGljLmZpbmQoJy5BLXBpY19fcGljJykuc2xpY2soe1xyXG4gICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICBmYWRlOiB0cnVlLFxyXG4gICAgICBsYXp5TG9hZDogJ29uZGVtYW5kJyxcclxuICAgICAgYXNOYXZGb3I6ICcuQS1waWNfX2xpc3QnLFxyXG4gICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYnJlYWtwb2ludDogNzY4LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgYXNOYXZGb3I6IG51bGxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICBdXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+IDc2NylcclxuICAgICAgQV9waWMuZmluZCgnLkEtcGljX19saXN0Jykuc2xpY2soe1xyXG4gICAgICAgIHJvd3M6IDEsXHJcbiAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXHJcbiAgICAgICAgZm9jdXNPblNlbGVjdDogdHJ1ZSxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDYsXHJcbiAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXHJcbiAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICAgIHByZXZBcnJvdzogYnRuTGVmdCxcclxuICAgICAgICBuZXh0QXJyb3c6IGJ0blJpZ2h0LFxyXG4gICAgICAgIGFzTmF2Rm9yOiAnLkEtcGljX19waWMnLFxyXG4gICAgICAgIHJlc3BvbnNpdmU6IFt7XHJcbiAgICAgICAgICBicmVha3BvaW50OiAxMDIwLFxyXG4gICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiA0LFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH0pO1xyXG4gICAgZWxzZVxyXG4gICAgICBBX3BpYy5maW5kKCcuQS1waWNfX2xpc3QnKS5oaWRlKCk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICAkKCcuYnRuLWNhcnQnKS5tYWduaWZpY1BvcHVwKHt0eXBlOidpbmxpbmUnfSk7XHJcbn0pIl0sImZpbGUiOiJtYWluLmpzIn0=
