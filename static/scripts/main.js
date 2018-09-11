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
    } else if(!isMob && page.is('.mob')) {
      page.removeClass('mob');
      header.find('.Header__search').prepend(search);
    }
  }
  responsemenuContainer();
  $(window).on('resize', responsemenuContainer);
});

$(function() {
  var filters = $('.Filters');

  if((window.innerWidth >= 768) || !filters.length) return;

  var btnsContainer = filters.find('.Filters__btns');
  var buttons = filters.find('.Filters__btn button');
  var pt = parseInt($('body').css('padding-top')) + filters.outerHeight();
console.log($('body').css('padding-top'), filters.outerHeight())
  $('body').css('padding-top', pt);

  var scrollPos = 0;
  $(window).scroll(function(){
    var st = $(this).scrollTop();
    if(st > pt) {
      if(scrollPos < st) {
        btnsContainer.addClass('hide');      
      } else {
        btnsContainer.removeClass('hide');
      }
    }
    scrollPos = st;
  });

  buttons.each(function() {
    var btn = $(this);
    var targetItem = $(btn.data('target'));

    function open () {
      targetItem.addClass('open');
      btn.addClass('active');
      if(buttons.is('.active')) {
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

$(function() {
  if(window.innerWidth > 767) return;

  $(window).on('resize', function() {
    $('.Header__menu').outerHeight($(window).height()); 
  });
});