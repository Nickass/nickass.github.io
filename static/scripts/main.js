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

$(function() {
  $('.btn-entry').magnificPopup({
    items: {
      type:'inline', src: '#checkin'
    }
  });
  $("#producer-reg-form").validate();
  $("#customer-reg-form").validate();
});
$(function(){
  tippy('[data-tippy]', {
    placement: 'bottom',
    allowTitleHTML: true,
    hideOnClick: false,
    interactive: true,
    arrow: true,
    arrowType: 'round',
  });
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

$(function() {
  $('.btn-cart').magnificPopup({type:'inline'});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAnLi9jb21tb24vdGFiLmpzJztcclxuXHJcbmZ1bmN0aW9uIGljb24obmFtZSkge1xyXG4gIHJldHVybiAnPHN2ZyBjbGFzcz1cImljLScrbmFtZSsnXCIgcm9sZT1cImltZ1wiPicgK1xyXG4gICAgJzx1c2UgeGxpbms6aHJlZj1cInN0YXRpYy9kZWNvcnMvc3ByaXRlLnN2ZyNpYy0nK25hbWUrJ1wiPjwvdXNlPicgK1xyXG4gICc8L3N2Zz4nO1xyXG59XHJcblxyXG5pbXBvcnQgJy4vY29tbW9uL2RkLmpzJztcclxuaW1wb3J0ICcuLi9jb21wb25lbnRzL2luZGV4LmRlcCc7XHJcblxyXG5cclxuJChmdW5jdGlvbigpe1xyXG4gIHRpcHB5KCdbZGF0YS10aXBweV0nLCB7XHJcbiAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxyXG4gICAgYWxsb3dUaXRsZUhUTUw6IHRydWUsXHJcbiAgICBoaWRlT25DbGljazogZmFsc2UsXHJcbiAgICBpbnRlcmFjdGl2ZTogdHJ1ZSxcclxuICAgIGFycm93OiB0cnVlLFxyXG4gICAgYXJyb3dUeXBlOiAncm91bmQnLFxyXG4gIH0pO1xyXG59KTtcclxuXHJcbiQod2luZG93KS5vbignbG9hZCByZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAkKCcud2lkdGgtYnktY29udGVudCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9ICQodGhpcyk7XHJcbiAgICB2YXIgaXRlbXMgPSBzZWxmLmNoaWxkcmVuKCk7XHJcbiAgICB2YXIgcHcgPSBzZWxmLnBhcmVudCgpLmlubmVyV2lkdGgoKTtcclxuICAgIHZhciBpdyA9IGl0ZW1zLm91dGVyV2lkdGgodHJ1ZSk7XHJcbiAgICBzZWxmLndpZHRoKHBhcnNlSW50KHB3L2l3KSAqIGl3KTtcclxuICB9KTtcclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICQoJy5CcmFuZHMgLmNvbnRhaW5lcicpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgYnRuTGVmdCA9ICc8YnV0dG9uIGNsYXNzPVwiQnJhbmRzX19sZWZ0XCIgJyArXHJcbiAgICAnYXJpYS1sYWJlbD1cIlByZXZpb3VzXCIgdHlwZT1cImJ1dHRvblwiIGFyaWEtZGlzYWJsZWQ9XCJmYWxzZVwiPidcclxuICAgICsgc2VsZi5pY29uKCdjaGV2cm9uJykgKyc8L2J1dHRvbj4nO1xyXG5cclxuICAgIHZhciBidG5SaWdodCA9ICc8YnV0dG9uIGNsYXNzPVwiQnJhbmRzX19yaWdodFwiICcgK1xyXG4gICAgJ2FyaWEtbGFiZWw9XCJOZXh0XCIgdHlwZT1cImJ1dHRvblwiIGFyaWEtZGlzYWJsZWQ9XCJmYWxzZVwiPicrXHJcbiAgICBzZWxmLmljb24oJ2NoZXZyb24nKSArJzwvYnV0dG9uPic7XHJcblxyXG4gICAgJCh0aGlzKS5zbGljayh7XHJcbiAgICAgIHJvd3M6IDEsXHJcbiAgICAgIGluaXRpYWxTbGlkZTogcGFyc2VJbnQoJCh0aGlzKS5jaGlsZHJlbigpLmxlbmd0aC8yKSxcclxuICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgICAgZm9jdXNPblNlbGVjdDogZmFsc2UsXHJcbiAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxyXG4gICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgIHByZXZBcnJvdzogYnRuTGVmdCxcclxuICAgICAgbmV4dEFycm93OiBidG5SaWdodCxcclxuICAgIH0pXHJcbiAgfSk7XHJcbn0pO1xyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICQoJy5SZXZpZXdzX19saXN0JykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIHZhciBidG5MZWZ0ID0gJzxidXR0b24gY2xhc3M9XCJSZXZpZXdzX19sZWZ0XCIgJyArXHJcbiAgICAnYXJpYS1sYWJlbD1cIlByZXZpb3VzXCIgdHlwZT1cImJ1dHRvblwiIGFyaWEtZGlzYWJsZWQ9XCJmYWxzZVwiPidcclxuICAgICsgc2VsZi5pY29uKCdjaGV2cm9uJykgKyc8L2J1dHRvbj4nO1xyXG5cclxuICAgIHZhciBidG5SaWdodCA9ICc8YnV0dG9uIGNsYXNzPVwiUmV2aWV3c19fcmlnaHRcIiAnICtcclxuICAgICdhcmlhLWxhYmVsPVwiTmV4dFwiIHR5cGU9XCJidXR0b25cIiBhcmlhLWRpc2FibGVkPVwiZmFsc2VcIj4nK1xyXG4gICAgc2VsZi5pY29uKCdjaGV2cm9uJykgKyc8L2J1dHRvbj4nO1xyXG5cclxuICAgICQodGhpcykuc2xpY2soe1xyXG4gICAgICByb3dzOiAxLFxyXG4gICAgICBmb2N1c09uU2VsZWN0OiBmYWxzZSxcclxuICAgICAgc2xpZGVzVG9TY3JvbGw6IDIsXHJcbiAgICAgIHNsaWRlc1RvU2hvdzogMixcclxuICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXHJcbiAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICAgIHByZXZBcnJvdzogYnRuTGVmdCxcclxuICAgICAgbmV4dEFycm93OiBidG5SaWdodCxcclxuICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgXVxyXG4gICAgfSlcclxuICB9KTtcclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICQoJy5BLXBpYycpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgQV9waWMgPSAkKCcuQS1waWMnKTtcclxuICAgIHZhciBidG5MZWZ0ID0gJzxidXR0b24gY2xhc3M9XCJBLXBpY19fbGVmdFwiICcgK1xyXG4gICAgJ2FyaWEtbGFiZWw9XCJQcmV2aW91c1wiIHR5cGU9XCJidXR0b25cIiBhcmlhLWRpc2FibGVkPVwiZmFsc2VcIj4nXHJcbiAgICArIHNlbGYuaWNvbignY2hldnJvbicpICsnPC9idXR0b24+JztcclxuICAgIHZhciBidG5SaWdodCA9ICc8YnV0dG9uIGNsYXNzPVwiQS1waWNfX3JpZ2h0XCIgJyArXHJcbiAgICAnYXJpYS1sYWJlbD1cIk5leHRcIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1kaXNhYmxlZD1cImZhbHNlXCI+JytcclxuICAgIHNlbGYuaWNvbignY2hldnJvbicpICsnPC9idXR0b24+JztcclxuICAgIFxyXG4gICAgIEFfcGljLmZpbmQoJy5BLXBpY19fcGljJykuc2xpY2soe1xyXG4gICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICBmYWRlOiB0cnVlLFxyXG4gICAgICBsYXp5TG9hZDogJ29uZGVtYW5kJyxcclxuICAgICAgYXNOYXZGb3I6ICcuQS1waWNfX2xpc3QnLFxyXG4gICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYnJlYWtwb2ludDogNzY4LFxyXG4gICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgZG90c0NsYXNzOiAnQS1waWNfX2RvdHMnLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBhc05hdkZvcjogbnVsbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIF1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoID4gNzY3KVxyXG4gICAgICBBX3BpYy5maW5kKCcuQS1waWNfX2xpc3QnKS5zbGljayh7XHJcbiAgICAgICAgcm93czogMSxcclxuICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcclxuICAgICAgICBmb2N1c09uU2VsZWN0OiB0cnVlLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogNixcclxuICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcclxuICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICAgICAgcHJldkFycm93OiBidG5MZWZ0LFxyXG4gICAgICAgIG5leHRBcnJvdzogYnRuUmlnaHQsXHJcbiAgICAgICAgYXNOYXZGb3I6ICcuQS1waWNfX3BpYycsXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogW3tcclxuICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMjAsXHJcbiAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDQsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfV1cclxuICAgICAgfSk7XHJcbiAgICBlbHNlXHJcbiAgICAgIEFfcGljLmZpbmQoJy5BLXBpY19fbGlzdCcpLmhpZGUoKTtcclxuICB9KTtcclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICQoJy5idG4tY2FydCcpLm1hZ25pZmljUG9wdXAoe3R5cGU6J2lubGluZSd9KTtcclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcGFnZSA9ICQoJy5QYWdlJyk7XHJcbiAgdmFyIGhlYWRlciA9ICQoJy5QYWdlX19oZWFkZXInKTtcclxuICB2YXIgdG9nZ2xlciA9ICQoJy5IZWFkZXJfX2J1cmdlcicpO1xyXG4gIHZhciBtZW51Q29udGFpbmVyID0gJCgnLkhlYWRlcl9fbWVudScpO1xyXG4gIHZhciBtYWluTWVudSA9IGhlYWRlci5maW5kKCcuTWFpbi1tZW51Jyk7XHJcbiAgdmFyIHNlYXJjaCA9IGhlYWRlci5maW5kKCcuU2VhcmNoJyk7XHJcbiAgdmFyIGZpbHRlcnMgPSAkKCcuRmlsdGVycycpO1xyXG5cclxuICB0b2dnbGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgaWYocGFnZS5pcygnLm1vdmUnKSkge1xyXG4gICAgICBtZW51Q29udGFpbmVyLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgIHBhZ2UucmVtb3ZlQ2xhc3MoJ21vdmUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1lbnVDb250YWluZXIuYWRkQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgcGFnZS5hZGRDbGFzcygnbW92ZScpOyAgICAgIFxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuXHJcbiAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICBpZihwYWdlLmlzKCcubW92ZScpICYmIFxyXG4gICAgICAhbWVudUNvbnRhaW5lci5oYXMoZS50YXJnZXQpLmxlbmd0aCAmJiBcclxuICAgICAgIW1lbnVDb250YWluZXIuaXMoZS50YXJnZXQpICYmIFxyXG4gICAgICAhdG9nZ2xlci5pcyhlLnRhcmdldCkpIHtcclxuXHJcbiAgICAgIG1lbnVDb250YWluZXIucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgcGFnZS5yZW1vdmVDbGFzcygnbW92ZScpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiByZXNwb25zZW1lbnVDb250YWluZXIoKSB7XHJcbiAgICB2YXIgaXNNb2IgPSB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2ODtcclxuICAgIFxyXG4gICAgaWYoaXNNb2IgJiYgIXBhZ2UuaXMoJy5tb2InKSkge1xyXG4gICAgICBwYWdlLmFkZENsYXNzKCdtb2InKTtcclxuICAgICAgaGVhZGVyLmZpbmQoJy5IZWFkZXJfX21lbnUnKS5wcmVwZW5kKHNlYXJjaCk7XHJcbiAgICAgIC8vIGhlYWRlci5hcHBlbmQoZmlsdGVycyk7XHJcbiAgICB9IGVsc2UgaWYoIWlzTW9iICYmIHBhZ2UuaXMoJy5tb2InKSkge1xyXG4gICAgICBwYWdlLnJlbW92ZUNsYXNzKCdtb2InKTtcclxuICAgICAgaGVhZGVyLmZpbmQoJy5IZWFkZXJfX3NlYXJjaCcpLnByZXBlbmQoc2VhcmNoKTtcclxuICAgICAgLy8gc2lkYmFyLnByZXBlbmQoZmlsdGVycyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlc3BvbnNlbWVudUNvbnRhaW5lcigpO1xyXG4gICQod2luZG93KS5vbigncmVzaXplJywgcmVzcG9uc2VtZW51Q29udGFpbmVyKTtcclxuXHJcbn0pO1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICB2YXIgZmlsdGVycyA9ICQoJy5GaWx0ZXJzJyk7XHJcbiAgdmFyIGZQYW5lbHMgPSBmaWx0ZXJzLmZpbmQoJy5GaWx0ZXJzX19sZWZ0LCAuRmlsdGVyc19fcmlnaHQnKTtcclxuXHJcbiAgaWYoKHdpbmRvdy5pbm5lcldpZHRoID49IDc2OCkgfHwgIWZpbHRlcnMubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gIHZhciBzY3JvbGxQb3MgPSAwO1xyXG4gIHZhciBwdCA9IGZpbHRlcnMub2Zmc2V0KCkudG9wICsgZmlsdGVycy5vdXRlckhlaWdodCgpO1xyXG5cclxuICBmaWx0ZXJzLnBhcmVudCgpLm91dGVySGVpZ2h0KGZpbHRlcnMub3V0ZXJIZWlnaHQodHJ1ZSkpO1xyXG5cclxuICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgc3QgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xyXG4gICAgXHJcbiAgICBpZihzdCA+IHB0KSB7XHJcbiAgICAgIGlmKCFmaWx0ZXJzLmlzKCcuZml4ZWQnKSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZpbHRlcnMuYWRkQ2xhc3MoJ2ZpeGVkJyk7XHJcbiAgICAgICAgZmlsdGVycy5jc3Moe1xyXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXHJcbiAgICAgICAgICB0b3A6IC1maWx0ZXJzLm91dGVySGVpZ2h0KCkgKyAncHgnLFxyXG4gICAgICAgICAgbGVmdDogJzAnLFxyXG4gICAgICAgICAgcGFkZGluZzogJzAgMTVweCcsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZihzY3JvbGxQb3MgPCBzdCkge1xyXG4gICAgICAgIGZpbHRlcnMuY3NzKCd0b3AnLCAtZmlsdGVycy5vdXRlckhlaWdodCgpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmaWx0ZXJzLmNzcygndG9wJywgJzAnKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYoZmlsdGVycy5pcygnLmZpeGVkJykpIHtcclxuICAgICAgICBmaWx0ZXJzLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xyXG4gICAgICAgIGZpbHRlcnMuY3NzKHtcclxuICAgICAgICAgIHBvc2l0aW9uOiAnJyxcclxuICAgICAgICAgIHRvcDogJycsXHJcbiAgICAgICAgICBsZWZ0OiAnJyxcclxuICAgICAgICAgIHBhZGRpbmc6ICcnLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBzY3JvbGxQb3MgPSBzdDtcclxuICB9KTtcclxuXHJcbiAgdmFyIGJ1dHRvbnMgPSBmaWx0ZXJzLmZpbmQoJy5GaWx0ZXJzX19idG4gYnV0dG9uJyk7XHJcblxyXG4gIGJ1dHRvbnMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIHZhciBidG4gPSAkKHRoaXMpO1xyXG4gICAgdmFyIHRhcmdldEl0ZW0gPSAkKGJ0bi5kYXRhKCd0YXJnZXQnKSk7XHJcblxyXG4gICAgZnVuY3Rpb24gb3BlbiAoKSB7XHJcbiAgICAgIHRhcmdldEl0ZW0uYWRkQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgYnRuLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgaWYoYnV0dG9ucy5pcygnLmFjdGl2ZScpKSB7XHJcbiAgICAgICAgdmFyIGZPdXRIID0gZmlsdGVycy5vdXRlckhlaWdodCh0cnVlKTtcclxuICAgICAgICB2YXIgd2ggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG4gICAgICAgIC8vaXQgZml4IHNsaWRlIHdpbmRvdyBhdCBzY3JlZW5cclxuICAgICAgICBpZih3aW5kb3cuc2Nyb2xsWSA8IHB0KSB7XHJcblxyXG4gICAgICAgICAgZlBhbmVscy5vdXRlckhlaWdodCh3aCAtIChmaWx0ZXJzLm9mZnNldCgpLnRvcCArIGZPdXRIKSArIHdpbmRvdy5zY3JvbGxZKVxyXG4gICAgICAgICAgLmNzcygndG9wJywgZmlsdGVycy5vZmZzZXQoKS50b3AgKyBmT3V0SCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZQYW5lbHMub3V0ZXJIZWlnaHQod2ggLSBmT3V0SClcclxuICAgICAgICAgIC5jc3MoJ3RvcCcsIGZPdXRIICsgJ3B4Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2l0IGZpeCB3aW5kb3cgaW4gb3JkZXIgdG8gZXhjZXB0IHNjcm9sbGluZ1xyXG4gICAgICAgICQoJ2h0bWwnKS5jc3Moe2hlaWdodDogJzEwMCUnLCBvdmVyZmxvdzogJ2hpZGRlbid9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY2xvc2UgKCkge1xyXG4gICAgICB0YXJnZXRJdGVtLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgIGJ0bi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgIGlmKCFidXR0b25zLmlzKCcuYWN0aXZlJykpIHtcclxuICAgICAgICAkKCdodG1sJykuY3NzKHtoZWlnaHQ6ICcnLCBvdmVyZmxvdzogJyd9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgaWYodGFyZ2V0SXRlbS5pcygnLm9wZW4nKSkgY2xvc2UoKVxyXG4gICAgICBlbHNlIG9wZW4oKVxyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGlmKCF0YXJnZXRJdGVtLmhhcyhlLnRhcmdldCkubGVuZ3RoICYmIFxyXG4gICAgICAgICF0YXJnZXRJdGVtLmlzKGUudGFyZ2V0KSAmJlxyXG4gICAgICAgICFidG4uaXMoZS50YXJnZXQpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgY2xvc2UoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pOyJdLCJmaWxlIjoibWFpbi5qcyJ9
