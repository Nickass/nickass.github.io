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
  if(mark !== 'grid' && mark !== 'list') mark = 'grid';
  
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
      slidesToScroll: 4,
      focusOnSelect: false,
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
  $('.Reviews__list').each(function() {
    var btnLeft = '<button class="Reviews__left" ' +
    'aria-label="Previous" type="button" aria-disabled="false">'
    + self.icon('chevron') +'</button>';

    var btnRight = '<button class="Reviews__right" ' +
    'aria-label="Next" type="button" aria-disabled="false">'+
    self.icon('chevron') +'</button>';

    $(this).slick({
      rows: 1,
      focusOnSelect: false,
      slidesToScroll: 2,
      slidesToShow: 2,
      variableWidth: false,
      dots: false,
      infinite: false,
      prevArrow: btnLeft,
      nextArrow: btnRight,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToScroll: 1,
            slidesToShow: 1,
          }
        },
      ]
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
            dotsClass: 'A-pic__dots',
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


$(function () {
  var page = $('.Page');
  var header = $('.Page__header');
  var toggler = $('.Header__burger');
  var menuContainer = $('.Header__menu');
  var mainMenu = header.find('.Main-menu');
  var search = header.find('.Search');
  var filters = $('.Filters');

  toggler.on('click', function() {
    if(page.is('.move')) {
      menuContainer.removeClass('open');
      page.removeClass('move');
    } else {
      menuContainer.addClass('open');
      page.addClass('move');      
    }
  });


  $(document.body).on('click', function(e) {
    if(page.is('.move') && 
      !menuContainer.has(e.target).length && 
      !menuContainer.is(e.target) && 
      !toggler.is(e.target)) {

      menuContainer.removeClass('open');
      page.removeClass('move');
    }
  });

  function responsemenuContainer() {
    var isMob = window.innerWidth < 768;
    
    if(isMob && !page.is('.mob')) {
      page.addClass('mob');
      header.find('.Header__menu').prepend(search);
      // header.append(filters);
    } else if(!isMob && page.is('.mob')) {
      page.removeClass('mob');
      header.find('.Header__search').prepend(search);
      // sidbar.prepend(filters);
    }
  }
  responsemenuContainer();
  $(window).on('resize', responsemenuContainer);

});

$(function() {
  var filters = $('.Filters');
  var fPanels = filters.find('.Filters__left, .Filters__right');

  if((window.innerWidth >= 768) || !filters.length) return;

  var scrollPos = 0;
  var pt = filters.offset().top + filters.outerHeight();

  filters.parent().outerHeight(filters.outerHeight(true));

  $(window).scroll(function(){
    var st = $(this).scrollTop();
    
    if(st > pt) {
      if(!filters.is('.fixed')) {
        
        filters.addClass('fixed');
        filters.css({
          position: 'fixed',
          top: -filters.outerHeight() + 'px',
          left: '0',
          padding: '0 15px',
        });

      }

      if(scrollPos < st) {
        filters.css('top', -filters.outerHeight());
      } else {
        filters.css('top', '0');
      }
    } else {
      if(filters.is('.fixed')) {
        filters.removeClass('fixed');
        filters.css({
          position: '',
          top: '',
          left: '',
          padding: '',
        });
      }
    }
    scrollPos = st;
  });

  var buttons = filters.find('.Filters__btn button');

  buttons.each(function() {
    var btn = $(this);
    var targetItem = $(btn.data('target'));

    function open () {
      targetItem.addClass('open');
      btn.addClass('active');
      if(buttons.is('.active')) {
        var fOutH = filters.outerHeight(true);
        var wh = window.innerHeight;

        //it fix slide window at screen
        if(window.scrollY < pt) {

          fPanels.outerHeight(wh - (filters.offset().top + fOutH) + window.scrollY)
          .css('top', filters.offset().top + fOutH);
        } else {
          fPanels.outerHeight(wh - fOutH)
          .css('top', fOutH + 'px');
        }

        //it fix window in order to except scrolling
        $('html').css({height: '100%', overflow: 'hidden'});
      }
    }
    function close () {
      targetItem.removeClass('open');
      btn.removeClass('active');
      if(!buttons.is('.active')) {
        $('html').css({height: '', overflow: ''});
      }
    }

    btn.on('click', function() {
      if(targetItem.is('.open')) close()
      else open()
    });

    $(document.body).on('click', function(e) {
      if(!targetItem.has(e.target).length && 
        !targetItem.is(e.target) &&
        !btn.is(e.target)
        ) {
        close();
      }
    });
  });
});

$(function(){
  $('.select').niceSelect();
  $('.open-popap-btn').magnificPopup({ type: 'inline' });
  tippy('[data-tippy]', {
    placement: 'bottom',
    allowTitleHTML: true,
    hideOnClick: false,
    interactive: true,
    arrow: true,
    arrowType: 'round',
  });
});


// $(function() {
//   $('#order-messages-container').on('click', '.btn-close', function(e) {
//     $(this).closest('tr').remove();
//   });
//   $('#order-messages-checkall').on('change', function() {
//     $($(this).data('target')).prop('checked', $(this).is(':checked'));
//   });
//   $('#order-messages-deleteall').on('click', function() {
//     $($(this).data('target')).each(function() {
//       if($(this).is(':checked')) $(this).closest('tr').remove();
//     });
//   });

//   $('#prodcuts-container').on('click', '.btn-close', function(e) {
//     $(this).closest('tr').remove();
//   });
//   $('#prodcuts-checkall').on('change', function() {
//     $($(this).data('target')).prop('checked', $(this).is(':checked'));
//   });
//   $('#prodcuts-deleteall').on('click', function() {
//     $($(this).data('target')).each(function() {
//       if($(this).is(':checked')) $(this).closest('tr').remove();
//     });
//   });
// });
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAnLi9jb21tb24vdGFiLmpzJztcclxuXHJcbmZ1bmN0aW9uIGljb24obmFtZSkge1xyXG4gIHJldHVybiAnPHN2ZyBjbGFzcz1cImljLScrbmFtZSsnXCIgcm9sZT1cImltZ1wiPicgK1xyXG4gICAgJzx1c2UgeGxpbms6aHJlZj1cInN0YXRpYy9kZWNvcnMvc3ByaXRlLnN2ZyNpYy0nK25hbWUrJ1wiPjwvdXNlPicgK1xyXG4gICc8L3N2Zz4nO1xyXG59XHJcblxyXG5pbXBvcnQgJy4vY29tbW9uL2RkLmpzJztcclxuaW1wb3J0ICcuLi9jb21wb25lbnRzL2luZGV4LmRlcCc7XHJcblxyXG5cclxuXHJcblxyXG4kKHdpbmRvdykub24oJ2xvYWQgcmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgJCgnLndpZHRoLWJ5LWNvbnRlbnQnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHNlbGYgPSAkKHRoaXMpO1xyXG4gICAgdmFyIGl0ZW1zID0gc2VsZi5jaGlsZHJlbigpO1xyXG4gICAgdmFyIHB3ID0gc2VsZi5wYXJlbnQoKS5pbm5lcldpZHRoKCk7XHJcbiAgICB2YXIgaXcgPSBpdGVtcy5vdXRlcldpZHRoKHRydWUpO1xyXG4gICAgc2VsZi53aWR0aChwYXJzZUludChwdy9pdykgKiBpdyk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICAkKCcuQnJhbmRzIC5jb250YWluZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGJ0bkxlZnQgPSAnPGJ1dHRvbiBjbGFzcz1cIkJyYW5kc19fbGVmdFwiICcgK1xyXG4gICAgJ2FyaWEtbGFiZWw9XCJQcmV2aW91c1wiIHR5cGU9XCJidXR0b25cIiBhcmlhLWRpc2FibGVkPVwiZmFsc2VcIj4nXHJcbiAgICArIHNlbGYuaWNvbignY2hldnJvbicpICsnPC9idXR0b24+JztcclxuXHJcbiAgICB2YXIgYnRuUmlnaHQgPSAnPGJ1dHRvbiBjbGFzcz1cIkJyYW5kc19fcmlnaHRcIiAnICtcclxuICAgICdhcmlhLWxhYmVsPVwiTmV4dFwiIHR5cGU9XCJidXR0b25cIiBhcmlhLWRpc2FibGVkPVwiZmFsc2VcIj4nK1xyXG4gICAgc2VsZi5pY29uKCdjaGV2cm9uJykgKyc8L2J1dHRvbj4nO1xyXG5cclxuICAgICQodGhpcykuc2xpY2soe1xyXG4gICAgICByb3dzOiAxLFxyXG4gICAgICBpbml0aWFsU2xpZGU6IHBhcnNlSW50KCQodGhpcykuY2hpbGRyZW4oKS5sZW5ndGgvMiksXHJcbiAgICAgIGNlbnRlck1vZGU6IHRydWUsXHJcbiAgICAgIGZvY3VzT25TZWxlY3Q6IGZhbHNlLFxyXG4gICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcclxuICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICBwcmV2QXJyb3c6IGJ0bkxlZnQsXHJcbiAgICAgIG5leHRBcnJvdzogYnRuUmlnaHQsXHJcbiAgICB9KVxyXG4gIH0pO1xyXG59KTtcclxuJChmdW5jdGlvbigpIHtcclxuICAkKCcuUmV2aWV3c19fbGlzdCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYnRuTGVmdCA9ICc8YnV0dG9uIGNsYXNzPVwiUmV2aWV3c19fbGVmdFwiICcgK1xyXG4gICAgJ2FyaWEtbGFiZWw9XCJQcmV2aW91c1wiIHR5cGU9XCJidXR0b25cIiBhcmlhLWRpc2FibGVkPVwiZmFsc2VcIj4nXHJcbiAgICArIHNlbGYuaWNvbignY2hldnJvbicpICsnPC9idXR0b24+JztcclxuXHJcbiAgICB2YXIgYnRuUmlnaHQgPSAnPGJ1dHRvbiBjbGFzcz1cIlJldmlld3NfX3JpZ2h0XCIgJyArXHJcbiAgICAnYXJpYS1sYWJlbD1cIk5leHRcIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1kaXNhYmxlZD1cImZhbHNlXCI+JytcclxuICAgIHNlbGYuaWNvbignY2hldnJvbicpICsnPC9idXR0b24+JztcclxuXHJcbiAgICAkKHRoaXMpLnNsaWNrKHtcclxuICAgICAgcm93czogMSxcclxuICAgICAgZm9jdXNPblNlbGVjdDogZmFsc2UsXHJcbiAgICAgIHNsaWRlc1RvU2Nyb2xsOiAyLFxyXG4gICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgIHZhcmlhYmxlV2lkdGg6IGZhbHNlLFxyXG4gICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICBwcmV2QXJyb3c6IGJ0bkxlZnQsXHJcbiAgICAgIG5leHRBcnJvdzogYnRuUmlnaHQsXHJcbiAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBicmVha3BvaW50OiA3NjgsXHJcbiAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIF1cclxuICAgIH0pXHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICAkKCcuQS1waWMnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIEFfcGljID0gJCgnLkEtcGljJyk7XHJcbiAgICB2YXIgYnRuTGVmdCA9ICc8YnV0dG9uIGNsYXNzPVwiQS1waWNfX2xlZnRcIiAnICtcclxuICAgICdhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1kaXNhYmxlZD1cImZhbHNlXCI+J1xyXG4gICAgKyBzZWxmLmljb24oJ2NoZXZyb24nKSArJzwvYnV0dG9uPic7XHJcbiAgICB2YXIgYnRuUmlnaHQgPSAnPGJ1dHRvbiBjbGFzcz1cIkEtcGljX19yaWdodFwiICcgK1xyXG4gICAgJ2FyaWEtbGFiZWw9XCJOZXh0XCIgdHlwZT1cImJ1dHRvblwiIGFyaWEtZGlzYWJsZWQ9XCJmYWxzZVwiPicrXHJcbiAgICBzZWxmLmljb24oJ2NoZXZyb24nKSArJzwvYnV0dG9uPic7XHJcbiAgICBcclxuICAgICBBX3BpYy5maW5kKCcuQS1waWNfX3BpYycpLnNsaWNrKHtcclxuICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgZmFkZTogdHJ1ZSxcclxuICAgICAgbGF6eUxvYWQ6ICdvbmRlbWFuZCcsXHJcbiAgICAgIGFzTmF2Rm9yOiAnLkEtcGljX19saXN0JyxcclxuICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgIGRvdHNDbGFzczogJ0EtcGljX19kb3RzJyxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgYXNOYXZGb3I6IG51bGxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICBdXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+IDc2NylcclxuICAgICAgQV9waWMuZmluZCgnLkEtcGljX19saXN0Jykuc2xpY2soe1xyXG4gICAgICAgIHJvd3M6IDEsXHJcbiAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXHJcbiAgICAgICAgZm9jdXNPblNlbGVjdDogdHJ1ZSxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDYsXHJcbiAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXHJcbiAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgICAgIHByZXZBcnJvdzogYnRuTGVmdCxcclxuICAgICAgICBuZXh0QXJyb3c6IGJ0blJpZ2h0LFxyXG4gICAgICAgIGFzTmF2Rm9yOiAnLkEtcGljX19waWMnLFxyXG4gICAgICAgIHJlc3BvbnNpdmU6IFt7XHJcbiAgICAgICAgICBicmVha3BvaW50OiAxMDIwLFxyXG4gICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiA0LFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH0pO1xyXG4gICAgZWxzZVxyXG4gICAgICBBX3BpYy5maW5kKCcuQS1waWNfX2xpc3QnKS5oaWRlKCk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuXHJcbiQoZnVuY3Rpb24gKCkge1xyXG4gIHZhciBwYWdlID0gJCgnLlBhZ2UnKTtcclxuICB2YXIgaGVhZGVyID0gJCgnLlBhZ2VfX2hlYWRlcicpO1xyXG4gIHZhciB0b2dnbGVyID0gJCgnLkhlYWRlcl9fYnVyZ2VyJyk7XHJcbiAgdmFyIG1lbnVDb250YWluZXIgPSAkKCcuSGVhZGVyX19tZW51Jyk7XHJcbiAgdmFyIG1haW5NZW51ID0gaGVhZGVyLmZpbmQoJy5NYWluLW1lbnUnKTtcclxuICB2YXIgc2VhcmNoID0gaGVhZGVyLmZpbmQoJy5TZWFyY2gnKTtcclxuICB2YXIgZmlsdGVycyA9ICQoJy5GaWx0ZXJzJyk7XHJcblxyXG4gIHRvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZihwYWdlLmlzKCcubW92ZScpKSB7XHJcbiAgICAgIG1lbnVDb250YWluZXIucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgcGFnZS5yZW1vdmVDbGFzcygnbW92ZScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbWVudUNvbnRhaW5lci5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgICBwYWdlLmFkZENsYXNzKCdtb3ZlJyk7ICAgICAgXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG5cclxuICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmKHBhZ2UuaXMoJy5tb3ZlJykgJiYgXHJcbiAgICAgICFtZW51Q29udGFpbmVyLmhhcyhlLnRhcmdldCkubGVuZ3RoICYmIFxyXG4gICAgICAhbWVudUNvbnRhaW5lci5pcyhlLnRhcmdldCkgJiYgXHJcbiAgICAgICF0b2dnbGVyLmlzKGUudGFyZ2V0KSkge1xyXG5cclxuICAgICAgbWVudUNvbnRhaW5lci5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgICBwYWdlLnJlbW92ZUNsYXNzKCdtb3ZlJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGZ1bmN0aW9uIHJlc3BvbnNlbWVudUNvbnRhaW5lcigpIHtcclxuICAgIHZhciBpc01vYiA9IHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4O1xyXG4gICAgXHJcbiAgICBpZihpc01vYiAmJiAhcGFnZS5pcygnLm1vYicpKSB7XHJcbiAgICAgIHBhZ2UuYWRkQ2xhc3MoJ21vYicpO1xyXG4gICAgICBoZWFkZXIuZmluZCgnLkhlYWRlcl9fbWVudScpLnByZXBlbmQoc2VhcmNoKTtcclxuICAgICAgLy8gaGVhZGVyLmFwcGVuZChmaWx0ZXJzKTtcclxuICAgIH0gZWxzZSBpZighaXNNb2IgJiYgcGFnZS5pcygnLm1vYicpKSB7XHJcbiAgICAgIHBhZ2UucmVtb3ZlQ2xhc3MoJ21vYicpO1xyXG4gICAgICBoZWFkZXIuZmluZCgnLkhlYWRlcl9fc2VhcmNoJykucHJlcGVuZChzZWFyY2gpO1xyXG4gICAgICAvLyBzaWRiYXIucHJlcGVuZChmaWx0ZXJzKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmVzcG9uc2VtZW51Q29udGFpbmVyKCk7XHJcbiAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCByZXNwb25zZW1lbnVDb250YWluZXIpO1xyXG5cclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gIHZhciBmaWx0ZXJzID0gJCgnLkZpbHRlcnMnKTtcclxuICB2YXIgZlBhbmVscyA9IGZpbHRlcnMuZmluZCgnLkZpbHRlcnNfX2xlZnQsIC5GaWx0ZXJzX19yaWdodCcpO1xyXG5cclxuICBpZigod2luZG93LmlubmVyV2lkdGggPj0gNzY4KSB8fCAhZmlsdGVycy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgdmFyIHNjcm9sbFBvcyA9IDA7XHJcbiAgdmFyIHB0ID0gZmlsdGVycy5vZmZzZXQoKS50b3AgKyBmaWx0ZXJzLm91dGVySGVpZ2h0KCk7XHJcblxyXG4gIGZpbHRlcnMucGFyZW50KCkub3V0ZXJIZWlnaHQoZmlsdGVycy5vdXRlckhlaWdodCh0cnVlKSk7XHJcblxyXG4gICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKXtcclxuICAgIHZhciBzdCA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XHJcbiAgICBcclxuICAgIGlmKHN0ID4gcHQpIHtcclxuICAgICAgaWYoIWZpbHRlcnMuaXMoJy5maXhlZCcpKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZmlsdGVycy5hZGRDbGFzcygnZml4ZWQnKTtcclxuICAgICAgICBmaWx0ZXJzLmNzcyh7XHJcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcclxuICAgICAgICAgIHRvcDogLWZpbHRlcnMub3V0ZXJIZWlnaHQoKSArICdweCcsXHJcbiAgICAgICAgICBsZWZ0OiAnMCcsXHJcbiAgICAgICAgICBwYWRkaW5nOiAnMCAxNXB4JyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKHNjcm9sbFBvcyA8IHN0KSB7XHJcbiAgICAgICAgZmlsdGVycy5jc3MoJ3RvcCcsIC1maWx0ZXJzLm91dGVySGVpZ2h0KCkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZpbHRlcnMuY3NzKCd0b3AnLCAnMCcpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZihmaWx0ZXJzLmlzKCcuZml4ZWQnKSkge1xyXG4gICAgICAgIGZpbHRlcnMucmVtb3ZlQ2xhc3MoJ2ZpeGVkJyk7XHJcbiAgICAgICAgZmlsdGVycy5jc3Moe1xyXG4gICAgICAgICAgcG9zaXRpb246ICcnLFxyXG4gICAgICAgICAgdG9wOiAnJyxcclxuICAgICAgICAgIGxlZnQ6ICcnLFxyXG4gICAgICAgICAgcGFkZGluZzogJycsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHNjcm9sbFBvcyA9IHN0O1xyXG4gIH0pO1xyXG5cclxuICB2YXIgYnV0dG9ucyA9IGZpbHRlcnMuZmluZCgnLkZpbHRlcnNfX2J0biBidXR0b24nKTtcclxuXHJcbiAgYnV0dG9ucy5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGJ0biA9ICQodGhpcyk7XHJcbiAgICB2YXIgdGFyZ2V0SXRlbSA9ICQoYnRuLmRhdGEoJ3RhcmdldCcpKTtcclxuXHJcbiAgICBmdW5jdGlvbiBvcGVuICgpIHtcclxuICAgICAgdGFyZ2V0SXRlbS5hZGRDbGFzcygnb3BlbicpO1xyXG4gICAgICBidG4uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICBpZihidXR0b25zLmlzKCcuYWN0aXZlJykpIHtcclxuICAgICAgICB2YXIgZk91dEggPSBmaWx0ZXJzLm91dGVySGVpZ2h0KHRydWUpO1xyXG4gICAgICAgIHZhciB3aCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbiAgICAgICAgLy9pdCBmaXggc2xpZGUgd2luZG93IGF0IHNjcmVlblxyXG4gICAgICAgIGlmKHdpbmRvdy5zY3JvbGxZIDwgcHQpIHtcclxuXHJcbiAgICAgICAgICBmUGFuZWxzLm91dGVySGVpZ2h0KHdoIC0gKGZpbHRlcnMub2Zmc2V0KCkudG9wICsgZk91dEgpICsgd2luZG93LnNjcm9sbFkpXHJcbiAgICAgICAgICAuY3NzKCd0b3AnLCBmaWx0ZXJzLm9mZnNldCgpLnRvcCArIGZPdXRIKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZlBhbmVscy5vdXRlckhlaWdodCh3aCAtIGZPdXRIKVxyXG4gICAgICAgICAgLmNzcygndG9wJywgZk91dEggKyAncHgnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vaXQgZml4IHdpbmRvdyBpbiBvcmRlciB0byBleGNlcHQgc2Nyb2xsaW5nXHJcbiAgICAgICAgJCgnaHRtbCcpLmNzcyh7aGVpZ2h0OiAnMTAwJScsIG92ZXJmbG93OiAnaGlkZGVuJ30pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjbG9zZSAoKSB7XHJcbiAgICAgIHRhcmdldEl0ZW0ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgYnRuLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgaWYoIWJ1dHRvbnMuaXMoJy5hY3RpdmUnKSkge1xyXG4gICAgICAgICQoJ2h0bWwnKS5jc3Moe2hlaWdodDogJycsIG92ZXJmbG93OiAnJ30pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZih0YXJnZXRJdGVtLmlzKCcub3BlbicpKSBjbG9zZSgpXHJcbiAgICAgIGVsc2Ugb3BlbigpXHJcbiAgICB9KTtcclxuXHJcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgaWYoIXRhcmdldEl0ZW0uaGFzKGUudGFyZ2V0KS5sZW5ndGggJiYgXHJcbiAgICAgICAgIXRhcmdldEl0ZW0uaXMoZS50YXJnZXQpICYmXHJcbiAgICAgICAgIWJ0bi5pcyhlLnRhcmdldClcclxuICAgICAgICApIHtcclxuICAgICAgICBjbG9zZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uKCl7XHJcbiAgJCgnLnNlbGVjdCcpLm5pY2VTZWxlY3QoKTtcclxuICAkKCcub3Blbi1wb3BhcC1idG4nKS5tYWduaWZpY1BvcHVwKHsgdHlwZTogJ2lubGluZScgfSk7XHJcbiAgdGlwcHkoJ1tkYXRhLXRpcHB5XScsIHtcclxuICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXHJcbiAgICBhbGxvd1RpdGxlSFRNTDogdHJ1ZSxcclxuICAgIGhpZGVPbkNsaWNrOiBmYWxzZSxcclxuICAgIGludGVyYWN0aXZlOiB0cnVlLFxyXG4gICAgYXJyb3c6IHRydWUsXHJcbiAgICBhcnJvd1R5cGU6ICdyb3VuZCcsXHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuXHJcbi8vICQoZnVuY3Rpb24oKSB7XHJcbi8vICAgJCgnI29yZGVyLW1lc3NhZ2VzLWNvbnRhaW5lcicpLm9uKCdjbGljaycsICcuYnRuLWNsb3NlJywgZnVuY3Rpb24oZSkge1xyXG4vLyAgICAgJCh0aGlzKS5jbG9zZXN0KCd0cicpLnJlbW92ZSgpO1xyXG4vLyAgIH0pO1xyXG4vLyAgICQoJyNvcmRlci1tZXNzYWdlcy1jaGVja2FsbCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuLy8gICAgICQoJCh0aGlzKS5kYXRhKCd0YXJnZXQnKSkucHJvcCgnY2hlY2tlZCcsICQodGhpcykuaXMoJzpjaGVja2VkJykpO1xyXG4vLyAgIH0pO1xyXG4vLyAgICQoJyNvcmRlci1tZXNzYWdlcy1kZWxldGVhbGwnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuLy8gICAgICQoJCh0aGlzKS5kYXRhKCd0YXJnZXQnKSkuZWFjaChmdW5jdGlvbigpIHtcclxuLy8gICAgICAgaWYoJCh0aGlzKS5pcygnOmNoZWNrZWQnKSkgJCh0aGlzKS5jbG9zZXN0KCd0cicpLnJlbW92ZSgpO1xyXG4vLyAgICAgfSk7XHJcbi8vICAgfSk7XHJcblxyXG4vLyAgICQoJyNwcm9kY3V0cy1jb250YWluZXInKS5vbignY2xpY2snLCAnLmJ0bi1jbG9zZScsIGZ1bmN0aW9uKGUpIHtcclxuLy8gICAgICQodGhpcykuY2xvc2VzdCgndHInKS5yZW1vdmUoKTtcclxuLy8gICB9KTtcclxuLy8gICAkKCcjcHJvZGN1dHMtY2hlY2thbGwnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbi8vICAgICAkKCQodGhpcykuZGF0YSgndGFyZ2V0JykpLnByb3AoJ2NoZWNrZWQnLCAkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKTtcclxuLy8gICB9KTtcclxuLy8gICAkKCcjcHJvZGN1dHMtZGVsZXRlYWxsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbi8vICAgICAkKCQodGhpcykuZGF0YSgndGFyZ2V0JykpLmVhY2goZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgIGlmKCQodGhpcykuaXMoJzpjaGVja2VkJykpICQodGhpcykuY2xvc2VzdCgndHInKS5yZW1vdmUoKTtcclxuLy8gICAgIH0pO1xyXG4vLyAgIH0pO1xyXG4vLyB9KTsiXSwiZmlsZSI6Im1haW4uanMifQ==
