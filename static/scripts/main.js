'use strict';

$(document).ready(function() {
  $('select').niceSelect();
});

$(function () {
  $('.Search').on('click', function() {
    var self = $(this);
    if(self.is('.isSmall:not(.isShow)')) {
      self.addClass('isShow')
      .find('.Search__field').focus();

      $(document.body).on('click', function handleOnBlur(e) {
        if(!$(e.target).is(self) && $(e.target).closest(self).length === 0) {
          self.removeClass('isShow');
          $(document.body).off('click', handleOnBlur);
        }
      });
      return false;
    }
  });
});
$(function () {
  $('.input')
  .on('click', function() {
    $(this).find('.input__field').focus()
  })
  .on('input', function() {
    var self = $(this);
    var field = self.find('.input__field')
    if(field.val().length)
      self.addClass('empty');
    else
      self.removeClass('empty');
  })
  .find('.input__field')
    .on('focus', function() {
      $(this).closest('.input').addClass('focused');
    })
    .on('blur', function() {
      $(this).closest('.input').removeClass('focused');
    })
    .on('error', function() {
      $(this).closest('.input').addClass('error');
    })
})
$(function () {
  var sideList = $('.Side-list');
  sideList.find('.Side-list__link').on('click', function() {
    sideList.find('.Side-list__link').not(this).removeClass('active');
    $(this).toggleClass('active');
  })
});


var BIG_HEIGHT = 165;

function responsiveHeader() {
  var header = $('.Header');
  var hbtns  = header.find('.Header__btns');
  var hinfo  = header.find('.Header__info');
  var search = header.find('.Header__search');
  var mainNav= header.find('.Header__nav');
  var mobMenu= header.find('.Header__mobile-menu');
  var basket = header.find('.Header__cart');
  var phones = header.find('.Header__phones');
  var social = header.find('.Header__social');
  var login  = header.find('.Header__login');
  var lang   = header.find('.Header__lang.nice-select');

  var first_btns = hbtns.first();
  var last_btns = hbtns.last();


  return function() {
    if(lang.length == 0) lang = header.find('div.Header__lang'); // if nice-select not loaded
    var isStiky = BIG_HEIGHT < window.scrollY;
    var isTablet = window.innerWidth < 1200 && window.innerWidth >= 768;
    var isMobile = window.innerWidth < 768;


    if(isStiky) {
      header.parent().css('padding-top', header.outerHeight());
      header.css({'top': -BIG_HEIGHT}).addClass('is-stiky').animate({'top': '0'}, 400);
      search.addClass('isSmall');
    } else {
      header.parent().css('padding-top', 0);
      header.removeClass('is-stiky');
      search.removeClass('isSmall');
    }

    if(isTablet) {
      login.prependTo(last_btns);
      lang.appendTo(last_btns);
      mainNav.appendTo(mobMenu);
      search.addClass('isSmall');
      if(isStiky) {
        search.prependTo(last_btns);
        phones.appendTo(mobMenu);
        social.appendTo(mobMenu);
        basket.prependTo(first_btns);
      } else {
        search.prependTo(first_btns);
        phones.appendTo(hinfo.first());
        social.appendTo(hinfo.first());
        basket.insertAfter(search);
      }
    } else if(isMobile) {
      search.prependTo(first_btns);
      basket.insertAfter(search);
      mainNav.appendTo(mobMenu);
      phones.appendTo(mobMenu);
      social.appendTo(mobMenu);
      search.addClass('isSmall');
      if(isStiky) {
        lang.insertAfter(search);
        login.appendTo(mobMenu);   
      } else {
        lang.prependTo(last_btns);
        login.prependTo(last_btns);
      }
    } else /* is desktop*/ {
      login.prependTo(last_btns);   
      mainNav.appendTo(hinfo.last());
      search.prependTo(first_btns);
      phones.appendTo(hinfo.first());
      social.appendTo(hinfo.first());
      if(isStiky) {
        basket.appendTo(last_btns);   
      } else {        
        basket.appendTo(last_btns);   
        search.removeClass('isSmall');
      }
    }
  }
}

$(function() {
  var headerHandler = responsiveHeader();
  headerHandler();
  $(window).on('resize', headerHandler);

  var needReload = false;

  $(window).on('scroll', function() {
    needReload = (BIG_HEIGHT <= window.scrollY &&  !$('.Header').is('.is-stiky')) || 
                     (BIG_HEIGHT >= window.scrollY && $('.Header').is('.is-stiky'));
    if (needReload) {
      headerHandler();
      needReload = false;
    }
  });
});




// function responsiveHeader(device, isStiky) {
//   var header = $('.Header').clone(true);
//   var hbtns  = header.find('.Header__btns');
//   var hinfo  = header.find('.Header__info');
//   var search = header.find('.Header__search');
//   var mainNav= header.find('.Header__nav');
//   var mobMenu= header.find('.Header__mobile-menu');
//   var basket = header.find('.Header__cart');
//   var phones = header.find('.Header__phones');
//   var social = header.find('.Header__social');
//   var login  = header.find('.Header__login');
//   var lang   = header.find('.Header__lang.nice-select');

//   var first_btns = hbtns.first();
//   var last_btns = hbtns.last();

//     if(isStiky) {
//       header.addClass('is-stiky');
//       search.addClass('isSmall');
//     } else {
//       header.removeClass('is-stiky');
//       search.removeClass('isSmall');
//     }
    

    // if(isTablet) {
    //   login.prependTo(last_btns);
    //   lang.appendTo(last_btns);
    //   mainNav.appendTo(mobMenu);
    //   search.addClass('isSmall');
    //   if(isStiky) {
    //     search.prependTo(last_btns);
    //     phones.appendTo(mobMenu);
    //     social.appendTo(mobMenu);
    //     basket.prependTo(first_btns);
    //   } else {
    //     search.prependTo(first_btns);
    //     phones.appendTo(hinfo.first());
    //     social.appendTo(hinfo.first());
    //     basket.insertAfter(search);
    //   }
    // } else if(isMobile) {
    //   search.prependTo(first_btns);
    //   basket.insertAfter(search);
    //   mainNav.appendTo(mobMenu);
    //   phones.appendTo(mobMenu);
    //   social.appendTo(mobMenu);
    //   search.addClass('isSmall');
    //   if(isStiky) {
    //     lang.insertAfter(search);
    //     login.appendTo(mobMenu);   
    //   } else {
    //     lang.prependTo(last_btns);
    //     login.prependTo(last_btns);
    //   }
    // } else /* is desktop*/ {
    //   login.prependTo(last_btns);   
    //   mainNav.appendTo(hinfo.last());
    //   search.prependTo(first_btns);
    //   phones.appendTo(hinfo.first());
    //   social.appendTo(hinfo.first());
    //   if(isStiky) {
    //     basket.appendTo(last_btns);   
    //   } else {        
    //     basket.appendTo(last_btns);   
      //   search.removeClass('isSmall');
    //   }
    // }

//   return header;
// }

// $(function() {
//   var device = (window.innerWidth < 1200 && window.innerWidth >= 768) ? 'tablet' :
//             (window.innerWidth < 768) ? 'mobile' : 'desctop';
//   var isStiky = 165 < window.scrollY;
//   var currentHeader = responsiveHeader(device, isStiky);
//   $('.Header').replaceWith(currentHeader);

//   if(isStiky) {
//     $(document.body).css('padding-top', '165px');
//   } else {
//     $(document.body).css('padding-top', '0px');
//   }

//   var altHeader = responsiveHeader(device, !isStiky);
//   var needReload = false;

//   $(window).on('scroll', function() {
//     isStiky = 165 < window.scrollY;

//     needReload = (isStiky &&  !currentHeader.is('.is-stiky')) || 
//                      (!isStiky && currentHeader.is('.is-stiky'));

//     if (needReload) {
//       var temp = currentHeader;
//       currentHeader = altHeader
//       altHeader = temp;

//       if(isStiky) {
//         $(document.body).css('padding-top', '165px');
//         currentHeader.css({'top': '-165px'}).replaceAll('.Header').animate({'top': '0'}, 400);
//       } else {
//         $(document.body).css('padding-top', '0px');
//         $('.Header').replaceWith(currentHeader);
//       }

//       needReload = false;
//     }
//   });
// });

$(function(){
  var slider = $('.Slider');
  var wink = slider.find('.Slider__wink');
  var state = 1;
  setInterval(function(){
    state ?
    wink.attr('src', '/img/japan-wink.svg') : 
    wink.attr('src', '/img/japan.svg');
    state = !state;
  }, 1000);

  if(slider.find('.Slider__item').length > 1) {
    slider.one('mouseover', function() {
      $(this).find('.Slider__arrow').fadeIn()
    });
  }

});

$(function () {
  $('.konstruktor-selected')
  .on('init', function(event, slick, direction) {
    var self = $(this);
    var items = self.find('.slick-slide');
    var dotsContainer = $('<div class="text-center"></div>');

    items.each(function(i) {
      $('<button style="margin: 10px;" type="button"></button>')
      .on('click', slick.slickGoTo.bind(slick, i))
      .text(i+1)
      .addClass('btn-square')
      .addClass(i ? 'bg-success' : 'bg-primary') // For demonstration/ You need to change it as you like.
      .appendTo(dotsContainer); // For mobile devices I add dots into container(in list) else in item
    });

    innerWidth < 768 ? dotsContainer.insertBefore(self) : dotsContainer.prependTo(self);
  })
  .slick({
    initialSlide: 1,
    dots: false,
    infinite: false,
    slidesToShow: 3,
    centerMode: true,
    variableWidth: true,
    focusOnSelect: true,
    arrows: false,
  });


  $('.konstruktor-list')
  .on('init', function() {
    if(innerWidth < 1200) return;
    var width = 0;
    $(this).find('.slick-slide').each(function() { 
      width += $(this).width() 
    });
    $(this).css({width: width, margin: '0 auto;'});
  })
  .slick({
    rows: innerWidth < 768 ? 1 : innerWidth < 1200 ? 2 : 1,
    slidesPerRow: innerWidth < 768 ? 1 : innerWidth < 1200 ? 2 : 1,
    initialSlide: innerWidth < 768 ? 2 : 0,
    centerMode: innerWidth < 1200,
    slidesToShow: innerWidth < 768 ? 1 : 4,
    focusOnSelect: innerWidth < 768,
    variableWidth: true,
    dots: false,
    infinite: false,
    arrows: false
  });
});


$(function() {
  var wh = $(window).height();
  $('.showByScroll').each(function() {
    if($(this).offset().top > wh) 
      $(this).css({opacity: 0});
  });
  $(window).on('scroll', function() {
    $('.showByScroll').each(function() {
      if($(this).offset().top <= $(window).scrollTop() + wh)  $(this).animate({opacity: 1}, 600);
    });
  });
});

$('.Form').on('submit', function(e) {
  $(this).addClass('sended').find('.btn-primary').addClass('btn-success').removeClass('btn-primary');

  console.log( $(this).find('.btn-primary'))
  e.preventDefault();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICQoJ3NlbGVjdCcpLm5pY2VTZWxlY3QoKTtcclxufSk7XHJcblxyXG5pbXBvcnQgJy4uL2NvbXBvbmVudHMvaW5kZXguZGVwJztcclxuXHJcblxyXG4kKGZ1bmN0aW9uICgpIHtcclxuICAkKCcua29uc3RydWt0b3Itc2VsZWN0ZWQnKVxyXG4gIC5vbignaW5pdCcsIGZ1bmN0aW9uKGV2ZW50LCBzbGljaywgZGlyZWN0aW9uKSB7XHJcbiAgICB2YXIgc2VsZiA9ICQodGhpcyk7XHJcbiAgICB2YXIgaXRlbXMgPSBzZWxmLmZpbmQoJy5zbGljay1zbGlkZScpO1xyXG4gICAgdmFyIGRvdHNDb250YWluZXIgPSAkKCc8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj48L2Rpdj4nKTtcclxuXHJcbiAgICBpdGVtcy5lYWNoKGZ1bmN0aW9uKGkpIHtcclxuICAgICAgJCgnPGJ1dHRvbiBzdHlsZT1cIm1hcmdpbjogMTBweDtcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+JylcclxuICAgICAgLm9uKCdjbGljaycsIHNsaWNrLnNsaWNrR29Uby5iaW5kKHNsaWNrLCBpKSlcclxuICAgICAgLnRleHQoaSsxKVxyXG4gICAgICAuYWRkQ2xhc3MoJ2J0bi1zcXVhcmUnKVxyXG4gICAgICAuYWRkQ2xhc3MoaSA/ICdiZy1zdWNjZXNzJyA6ICdiZy1wcmltYXJ5JykgLy8gRm9yIGRlbW9uc3RyYXRpb24vIFlvdSBuZWVkIHRvIGNoYW5nZSBpdCBhcyB5b3UgbGlrZS5cclxuICAgICAgLmFwcGVuZFRvKGRvdHNDb250YWluZXIpOyAvLyBGb3IgbW9iaWxlIGRldmljZXMgSSBhZGQgZG90cyBpbnRvIGNvbnRhaW5lcihpbiBsaXN0KSBlbHNlIGluIGl0ZW1cclxuICAgIH0pO1xyXG5cclxuICAgIGlubmVyV2lkdGggPCA3NjggPyBkb3RzQ29udGFpbmVyLmluc2VydEJlZm9yZShzZWxmKSA6IGRvdHNDb250YWluZXIucHJlcGVuZFRvKHNlbGYpO1xyXG4gIH0pXHJcbiAgLnNsaWNrKHtcclxuICAgIGluaXRpYWxTbGlkZTogMSxcclxuICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgaW5maW5pdGU6IGZhbHNlLFxyXG4gICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXHJcbiAgICBmb2N1c09uU2VsZWN0OiB0cnVlLFxyXG4gICAgYXJyb3dzOiBmYWxzZSxcclxuICB9KTtcclxuXHJcblxyXG4gICQoJy5rb25zdHJ1a3Rvci1saXN0JylcclxuICAub24oJ2luaXQnLCBmdW5jdGlvbigpIHtcclxuICAgIGlmKGlubmVyV2lkdGggPCAxMjAwKSByZXR1cm47XHJcbiAgICB2YXIgd2lkdGggPSAwO1xyXG4gICAgJCh0aGlzKS5maW5kKCcuc2xpY2stc2xpZGUnKS5lYWNoKGZ1bmN0aW9uKCkgeyBcclxuICAgICAgd2lkdGggKz0gJCh0aGlzKS53aWR0aCgpIFxyXG4gICAgfSk7XHJcbiAgICAkKHRoaXMpLmNzcyh7d2lkdGg6IHdpZHRoLCBtYXJnaW46ICcwIGF1dG87J30pO1xyXG4gIH0pXHJcbiAgLnNsaWNrKHtcclxuICAgIHJvd3M6IGlubmVyV2lkdGggPCA3NjggPyAxIDogaW5uZXJXaWR0aCA8IDEyMDAgPyAyIDogMSxcclxuICAgIHNsaWRlc1BlclJvdzogaW5uZXJXaWR0aCA8IDc2OCA/IDEgOiBpbm5lcldpZHRoIDwgMTIwMCA/IDIgOiAxLFxyXG4gICAgaW5pdGlhbFNsaWRlOiBpbm5lcldpZHRoIDwgNzY4ID8gMiA6IDAsXHJcbiAgICBjZW50ZXJNb2RlOiBpbm5lcldpZHRoIDwgMTIwMCxcclxuICAgIHNsaWRlc1RvU2hvdzogaW5uZXJXaWR0aCA8IDc2OCA/IDEgOiA0LFxyXG4gICAgZm9jdXNPblNlbGVjdDogaW5uZXJXaWR0aCA8IDc2OCxcclxuICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXHJcbiAgICBkb3RzOiBmYWxzZSxcclxuICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgIGFycm93czogZmFsc2VcclxuICB9KTtcclxufSk7XHJcblxyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICB2YXIgd2ggPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcbiAgJCgnLnNob3dCeVNjcm9sbCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBpZigkKHRoaXMpLm9mZnNldCgpLnRvcCA+IHdoKSBcclxuICAgICAgJCh0aGlzKS5jc3Moe29wYWNpdHk6IDB9KTtcclxuICB9KTtcclxuICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnLnNob3dCeVNjcm9sbCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmKCQodGhpcykub2Zmc2V0KCkudG9wIDw9ICQod2luZG93KS5zY3JvbGxUb3AoKSArIHdoKSAgJCh0aGlzKS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgNjAwKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbiQoJy5Gb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAkKHRoaXMpLmFkZENsYXNzKCdzZW5kZWQnKS5maW5kKCcuYnRuLXByaW1hcnknKS5hZGRDbGFzcygnYnRuLXN1Y2Nlc3MnKS5yZW1vdmVDbGFzcygnYnRuLXByaW1hcnknKTtcclxuXHJcbiAgY29uc29sZS5sb2coICQodGhpcykuZmluZCgnLmJ0bi1wcmltYXJ5JykpXHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG59KTsiXSwiZmlsZSI6Im1haW4uanMifQ==
