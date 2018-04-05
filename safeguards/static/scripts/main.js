'use strict';
$(function () {
  $('.dd-toggler').each(function() {
    var self = $(this);
    var target = self.attr('href') ? self.attr('href') : 
                self.data('target') ? self.data('target') : null;

    target = target.split('#')[1];
    if(!target) return;
    target = '#' + target;

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
      if(self.data('effect') == 'none') {
        targetList.removeClass('opened');
      } else {
        targetList.slideUp(200, targetList.removeClass.bind(targetList, 'opened'));
      }
      commonparent.removeClass('active-parent');
      $(document).off('click', blurHandler)
    }

    function openDd() {
      self.addClass('active');
      if(self.data('effect') == 'none') {
        targetList.addClass('opened');
      } else {
        targetList.slideDown(200, targetList.addClass.bind(targetList, 'opened'));
      }
      commonparent.addClass('active-parent');
      $(document).on('click', blurHandler)
    }

    if(self.is('.active')) $(document).on('click', blurHandler);

    self.on('click', function(e) {
      e.preventDefault();
      if(self.is('.active')) closeDd();
      else openDd();
    });
  });
});

$(function () {
  $('.Input').each(function() {
    var self = $(this);
    var field = $(this).find('.Input__field');
    var ph = $('<div class="Input__ph"></div>');

    ph.text(field.attr('placeholder')).appendTo(this);
    field.attr('placeholder', '');

    var leftHelper = $('<div></div>');
    leftHelper.css({
      'position': 'absolute',
      'z-index': 2,
      'top': -parseFloat(self.css('border-top-width'))+'px',
      'border-top-width': self.css('border-top-width'),
      'border-top-style': self.css('border-top-style'),
      'border-top-color': self.css('border-top-color'),
    })
    var rightHelper = leftHelper.clone();
    leftHelper.css('left', 0);
    rightHelper.css('right', 0);

    self.append(leftHelper).append(rightHelper)

    function toTopPh() {
      if(self.is('.inputted')) return;
      self.removeClass('error');
      self.css('border-top-color', 'transparent');
      ph.css({
        'left': 15,
        'font-size': '10px',
        'top': 0
      });
      leftHelper.css({
        'border-top-color': self.css('border-bottom-color'),
        'width': 10
      });
      rightHelper.css({
        'border-top-color': self.css('border-bottom-color'),
        'width': self.outerWidth(true) - ph.outerWidth(true)
      });
    }
    function toMidPh() {
      if(self.is('.inputted')) return;

      self.css('border-top-color', '');
      ph.css({
        'left': '',
        'font-size': '',
        'top': '',
      });
      leftHelper.css({
        'width': 0,
      });
      rightHelper.css({
        'width': 0,
      });
    }
    
    field.on('change', function() {
      if(this.value !== '') $(this).parent('.Input').addClass('inputted');
      else $(this).parent('.Input').removeClass('inputted');
    });
    field.on('focus', toTopPh);
    field.on('blur', toMidPh);
  });
})

function mousemoveVideo() {
  $('.Home__play-btn, .Home__close-btn').removeClass('hide');
  setTimeout(function() {
    if(window.hideVideoBtns) {
      $('.Home__play-btn, .Home__close-btn').addClass('hide');
      $('.Home__video').one('mousemove', mousemoveVideo);
    }
  }, 2000);
}
function playVideo() {
  window.hideVideoBtns = true;
  $('.Home__video').one('mousemove', mousemoveVideo);
  $('.Home__play-btn, .Home__close-btn').removeClass('hide');
}
function pauseVideo() {
  window.hideVideoBtns = false;
  $('.Home__video').off('mousemove', mousemoveVideo);
  $('.Home__play-btn, .Home__close-btn').removeClass('hide').one('click', mousemoveVideo);
}
function toggleVideo() {
  $('.Home__video').each(function() {
    if(this.paused) {
      this.play();
    } else {
      this.pause();
    }
  });
}
function openVideo() {
  playVideo();
  $('.Home').addClass('is-show-video');
  // $('.Home__video').trigger('play');
}
function closeVideo() {
  pauseVideo();
  $('.Home').removeClass('is-show-video');
  $('.Home__close-btn').addClass('hide');
  $('.Home__play-btn').removeClass('hide').removeClass('loading').one('click', openVideo);
  $('.Home__video').trigger('pause');
}


$(function() {
  var Slider = $('.Slider');
  Slider.on('init', function() {
    $(this).find('.slick-list').addClass('Slider__list');
  }).slick({
    initialSlide: parseInt(Slider.children().length / 2),
    dots: false,
    infinite: true,
    slidesToShow: 7,
    centerMode: true,
    variableWidth: true,
    focusOnSelect: true,
    arrows: false,
    // autoplay: true,
    autoplaySpeed: 2000
  });

  var Banners = $('.Banners');
  Banners.on('init', function() {
    $(this).find('.slick-list').addClass('Banners__list');
  }).slick({
    centerPadding: 0,
    infinite: true,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: false,
    focusOnSelect: true,
    arrows: false,
    dots: true,
    fade: true,
    cssEase: 'linear',
    draggable: false,
    // autoplay: true,
    autoplaySpeed: 2000
  });
  
  $('.Home__play-btn').one('click', openVideo);
  $('.Home__play-btn').on('click', toggleVideo);
  $('.Home__close-btn').on('click', closeVideo);
  var video = $('.Home__video');

  video.on('play', playVideo);
  video.on('pause', pauseVideo);
  video.on('ended', closeVideo);
  video.on('waiting', function(e) {
    window.hideVideoBtns = false;
    $('.Home__play-btn').removeClass('hide').addClass('loading');
  });
  video.on('canplaythrough', function(e) {
    window.hideVideoBtns = true;
    $('.Home__play-btn').removeClass('loading');
  });

  $('.Menu a, .Main-menu a').each(function() {
    if(!this.hash) return;

    $(this).on('click', function() {
      var target = $(this.hash);
      if(!target.length) return;
      $("html, body").animate({ 
        scrollTop: target.offset().top-$('.Header').outerHeight() 
      }, 1000);
    });
  });  

  $('.to-top-btn').on('click', function() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
  });
});

$(window).on('ready resize', function() {
  var img = $('.Offers__bg image');
  if(!img.length) return;
  // Adding angles
  var f = window.innerWidth/2 - 960/2;
  var l = 960/2 + f;

  $('.clipping__first').attr('d','M0 0 H'+(f-40)+'l40 75 H0 z');
  $('.clipping__second').attr('d','M40 0 H'+(l+40)+' V75 H0 z')
  .attr('style', 'transform: translate('+l+'px,0);"/>');
  $('.clipping__thrid').attr('d','M40 0 H'+(l+40)+' V-75 H0 z')
  .attr('style', 'transform: translate('+l+'px,100%);"/>');
  // $('.clipping__rect').attr('height', $('.Offers').outerHeight()- 75*2 + 'px');

});

$(window).on('ready resize', function() {
  var Header = $('.Header');
  var btns = Header.find('.Header__btns');
  var menu__list = Header.find('.Main-menu__list');
  var logo = Header.find('.Header__logo');

  if(window.innerWidth >= 768)
    btns.insertAfter(logo).css('display', '');
  else
    btns.appendTo(menu__list).css('display', 'block');

  var pitems = $('.Progress__item');
  pitems.each(function(i,e) {
    var nextPoint = parseFloat(pitems.eq(i+1).data('point')) || 100;

    if(window.innerWidth >= 768)
      $(this).css({
        left: $(this).data('point'),
        top: '',
        right: 100 - nextPoint + '%',
        bottom: ''
      });
    else
      $(this).css({
        top: $(this).data('point'),
        left: '',
        bottom: 100 - nextPoint + '%',
        right: ''
      });
  });

  $('.Progress__line').each(function() {
    if(window.innerWidth >= 768)
      $(this).css({
        left: $(this).data('offset'),
        width: $(this).data('width'),
        height: '',
        top: '',
      });
    else
      $(this).css({
        top: $(this).data('offset'),
        height: $(this).data('width'),
        width: '',
        left: ''
      });
  });
});

$(window).on('ready scroll', function() {
  var Header = $('.Header');
  var Home = $('.Home');
  var Footer = $('.Footer');

  var isStiky = Header.is('.is-stiky');
  // var isTop = Home.outerHeight() >= window.scrollY;
  var isTop = !window.scrollY;
  var isBottom = window.scrollY >= ($(document).outerHeight()-window.innerHeight-Footer.outerHeight());


  if(isTop) {
    $('.to-top-btn').addClass('hide');
    Header.removeClass('is-stiky');
  }
  else {
    if(!isStiky) {
      Header.addClass('is-stiky');
    }
    if(!isStiky) {
      $('.to-top-btn').removeClass('hide');
    } else {
      if(isBottom) {
        $('.to-top-btn').addClass('hide'); 
      } else {
        $('.to-top-btn').removeClass('hide');
      }
    }
  } 

});
$(function() {
  var toggleButton = $('.Home__nav-btn');
  var sections = $('.Section');
  var labels = sections.find('.Section__label');
  if(!labels.length || !sections.length) return;
  var tops = labels.map(function(e,i) { return $(this).offset().top; }).get();
  var bottoms = tops.slice(); // copy
  bottoms.push(labels.last().offset().top + sections.last().outerHeight()) //the last element is not exist
  bottoms.shift();

  function scrollHandler() {
    var sY = window.scrollY;

    for(var i = 0; i < labels.length; i++) {
      var lb = labels.eq(i);
      var top = tops[i];
      var bottom = bottoms[i];

      if(top < sY && bottom > sY) {
        if((bottom - lb.outerHeight()) < sY) {
          // lb is at bottom border of scrolling
          lb.css({
            'top': bottom - top - lb.outerHeight(),
            'position': 'absolute'
          })
        } else { 
          // lb is somewhere in the middle
          lb.css({
            'top': 0,
            'position': 'fixed'
          });
        }
      } else if(lb.css('position') == 'fixed') {
        lb.css('position', 'absolute'); // default value
      }
    }
  }

  var isActive = true;
  $(document).on('scroll', scrollHandler);

  toggleButton.on('click', function() {
    if(isActive) {
      $(document).off('scroll', scrollHandler);
    } else {
      $(document).on('scroll', scrollHandler);
    }
    isActive = !isActive;
  })
});

$(function() {
  $('.Entry__btn').on('click', function(e) {e.preventDefault(); $(this.form).submit(); });
  $('.Entry__form').on('submit', function(e) {
    for(var i = 0; i < this.length; i++) {
      if(this[i].required) {
        if(this[i].value == '') {
          $(this[i]).parent('.Input').addClass('error');
          e.preventDefault();
        }
      }
    }
    return !e.isDefaultPrevented();
  });
});

$(function() {
  $('.Buy-form').each(function() {
    var self = $(this);
    var inner = self.find('.Buy-form__inner');
    var ph = self.find('.Buy-form__ph');
    inner.on('focus', function () {
      ph.css('display', 'none')
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAnLi9jb21tb24vZGQuanMnO1xyXG5pbXBvcnQgJy4uL2NvbXBvbmVudHMvaW5kZXguZGVwJztcclxuXHJcblxyXG5mdW5jdGlvbiBtb3VzZW1vdmVWaWRlbygpIHtcclxuICAkKCcuSG9tZV9fcGxheS1idG4sIC5Ib21lX19jbG9zZS1idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICBpZih3aW5kb3cuaGlkZVZpZGVvQnRucykge1xyXG4gICAgICAkKCcuSG9tZV9fcGxheS1idG4sIC5Ib21lX19jbG9zZS1idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAkKCcuSG9tZV9fdmlkZW8nKS5vbmUoJ21vdXNlbW92ZScsIG1vdXNlbW92ZVZpZGVvKTtcclxuICAgIH1cclxuICB9LCAyMDAwKTtcclxufVxyXG5mdW5jdGlvbiBwbGF5VmlkZW8oKSB7XHJcbiAgd2luZG93LmhpZGVWaWRlb0J0bnMgPSB0cnVlO1xyXG4gICQoJy5Ib21lX192aWRlbycpLm9uZSgnbW91c2Vtb3ZlJywgbW91c2Vtb3ZlVmlkZW8pO1xyXG4gICQoJy5Ib21lX19wbGF5LWJ0biwgLkhvbWVfX2Nsb3NlLWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbn1cclxuZnVuY3Rpb24gcGF1c2VWaWRlbygpIHtcclxuICB3aW5kb3cuaGlkZVZpZGVvQnRucyA9IGZhbHNlO1xyXG4gICQoJy5Ib21lX192aWRlbycpLm9mZignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlVmlkZW8pO1xyXG4gICQoJy5Ib21lX19wbGF5LWJ0biwgLkhvbWVfX2Nsb3NlLWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJykub25lKCdjbGljaycsIG1vdXNlbW92ZVZpZGVvKTtcclxufVxyXG5mdW5jdGlvbiB0b2dnbGVWaWRlbygpIHtcclxuICAkKCcuSG9tZV9fdmlkZW8nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYodGhpcy5wYXVzZWQpIHtcclxuICAgICAgdGhpcy5wbGF5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuZnVuY3Rpb24gb3BlblZpZGVvKCkge1xyXG4gIHBsYXlWaWRlbygpO1xyXG4gICQoJy5Ib21lJykuYWRkQ2xhc3MoJ2lzLXNob3ctdmlkZW8nKTtcclxuICAvLyAkKCcuSG9tZV9fdmlkZW8nKS50cmlnZ2VyKCdwbGF5Jyk7XHJcbn1cclxuZnVuY3Rpb24gY2xvc2VWaWRlbygpIHtcclxuICBwYXVzZVZpZGVvKCk7XHJcbiAgJCgnLkhvbWUnKS5yZW1vdmVDbGFzcygnaXMtc2hvdy12aWRlbycpO1xyXG4gICQoJy5Ib21lX19jbG9zZS1idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICQoJy5Ib21lX19wbGF5LWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKS5vbmUoJ2NsaWNrJywgb3BlblZpZGVvKTtcclxuICAkKCcuSG9tZV9fdmlkZW8nKS50cmlnZ2VyKCdwYXVzZScpO1xyXG59XHJcblxyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICB2YXIgU2xpZGVyID0gJCgnLlNsaWRlcicpO1xyXG4gIFNsaWRlci5vbignaW5pdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgJCh0aGlzKS5maW5kKCcuc2xpY2stbGlzdCcpLmFkZENsYXNzKCdTbGlkZXJfX2xpc3QnKTtcclxuICB9KS5zbGljayh7XHJcbiAgICBpbml0aWFsU2xpZGU6IHBhcnNlSW50KFNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAvIDIpLFxyXG4gICAgZG90czogZmFsc2UsXHJcbiAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgIHNsaWRlc1RvU2hvdzogNyxcclxuICAgIGNlbnRlck1vZGU6IHRydWUsXHJcbiAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxyXG4gICAgZm9jdXNPblNlbGVjdDogdHJ1ZSxcclxuICAgIGFycm93czogZmFsc2UsXHJcbiAgICAvLyBhdXRvcGxheTogdHJ1ZSxcclxuICAgIGF1dG9wbGF5U3BlZWQ6IDIwMDBcclxuICB9KTtcclxuXHJcbiAgdmFyIEJhbm5lcnMgPSAkKCcuQmFubmVycycpO1xyXG4gIEJhbm5lcnMub24oJ2luaXQnLCBmdW5jdGlvbigpIHtcclxuICAgICQodGhpcykuZmluZCgnLnNsaWNrLWxpc3QnKS5hZGRDbGFzcygnQmFubmVyc19fbGlzdCcpO1xyXG4gIH0pLnNsaWNrKHtcclxuICAgIGNlbnRlclBhZGRpbmc6IDAsXHJcbiAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgIGNlbnRlck1vZGU6IHRydWUsXHJcbiAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcclxuICAgIGZvY3VzT25TZWxlY3Q6IHRydWUsXHJcbiAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgZG90czogdHJ1ZSxcclxuICAgIGZhZGU6IHRydWUsXHJcbiAgICBjc3NFYXNlOiAnbGluZWFyJyxcclxuICAgIGRyYWdnYWJsZTogZmFsc2UsXHJcbiAgICAvLyBhdXRvcGxheTogdHJ1ZSxcclxuICAgIGF1dG9wbGF5U3BlZWQ6IDIwMDBcclxuICB9KTtcclxuICBcclxuICAkKCcuSG9tZV9fcGxheS1idG4nKS5vbmUoJ2NsaWNrJywgb3BlblZpZGVvKTtcclxuICAkKCcuSG9tZV9fcGxheS1idG4nKS5vbignY2xpY2snLCB0b2dnbGVWaWRlbyk7XHJcbiAgJCgnLkhvbWVfX2Nsb3NlLWJ0bicpLm9uKCdjbGljaycsIGNsb3NlVmlkZW8pO1xyXG4gIHZhciB2aWRlbyA9ICQoJy5Ib21lX192aWRlbycpO1xyXG5cclxuICB2aWRlby5vbigncGxheScsIHBsYXlWaWRlbyk7XHJcbiAgdmlkZW8ub24oJ3BhdXNlJywgcGF1c2VWaWRlbyk7XHJcbiAgdmlkZW8ub24oJ2VuZGVkJywgY2xvc2VWaWRlbyk7XHJcbiAgdmlkZW8ub24oJ3dhaXRpbmcnLCBmdW5jdGlvbihlKSB7XHJcbiAgICB3aW5kb3cuaGlkZVZpZGVvQnRucyA9IGZhbHNlO1xyXG4gICAgJCgnLkhvbWVfX3BsYXktYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5hZGRDbGFzcygnbG9hZGluZycpO1xyXG4gIH0pO1xyXG4gIHZpZGVvLm9uKCdjYW5wbGF5dGhyb3VnaCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIHdpbmRvdy5oaWRlVmlkZW9CdG5zID0gdHJ1ZTtcclxuICAgICQoJy5Ib21lX19wbGF5LWJ0bicpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy5NZW51IGEsIC5NYWluLW1lbnUgYScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBpZighdGhpcy5oYXNoKSByZXR1cm47XHJcblxyXG4gICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHRhcmdldCA9ICQodGhpcy5oYXNoKTtcclxuICAgICAgaWYoIXRhcmdldC5sZW5ndGgpIHJldHVybjtcclxuICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7IFxyXG4gICAgICAgIHNjcm9sbFRvcDogdGFyZ2V0Lm9mZnNldCgpLnRvcC0kKCcuSGVhZGVyJykub3V0ZXJIZWlnaHQoKSBcclxuICAgICAgfSwgMTAwMCk7XHJcbiAgICB9KTtcclxuICB9KTsgIFxyXG5cclxuICAkKCcudG8tdG9wLWJ0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAxMDAwKTtcclxuICB9KTtcclxufSk7XHJcblxyXG4kKHdpbmRvdykub24oJ3JlYWR5IHJlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gIHZhciBpbWcgPSAkKCcuT2ZmZXJzX19iZyBpbWFnZScpO1xyXG4gIGlmKCFpbWcubGVuZ3RoKSByZXR1cm47XHJcbiAgLy8gQWRkaW5nIGFuZ2xlc1xyXG4gIHZhciBmID0gd2luZG93LmlubmVyV2lkdGgvMiAtIDk2MC8yO1xyXG4gIHZhciBsID0gOTYwLzIgKyBmO1xyXG5cclxuICAkKCcuY2xpcHBpbmdfX2ZpcnN0JykuYXR0cignZCcsJ00wIDAgSCcrKGYtNDApKydsNDAgNzUgSDAgeicpO1xyXG4gICQoJy5jbGlwcGluZ19fc2Vjb25kJykuYXR0cignZCcsJ000MCAwIEgnKyhsKzQwKSsnIFY3NSBIMCB6JylcclxuICAuYXR0cignc3R5bGUnLCAndHJhbnNmb3JtOiB0cmFuc2xhdGUoJytsKydweCwwKTtcIi8+Jyk7XHJcbiAgJCgnLmNsaXBwaW5nX190aHJpZCcpLmF0dHIoJ2QnLCdNNDAgMCBIJysobCs0MCkrJyBWLTc1IEgwIHonKVxyXG4gIC5hdHRyKCdzdHlsZScsICd0cmFuc2Zvcm06IHRyYW5zbGF0ZSgnK2wrJ3B4LDEwMCUpO1wiLz4nKTtcclxuICAvLyAkKCcuY2xpcHBpbmdfX3JlY3QnKS5hdHRyKCdoZWlnaHQnLCAkKCcuT2ZmZXJzJykub3V0ZXJIZWlnaHQoKS0gNzUqMiArICdweCcpO1xyXG5cclxufSk7XHJcblxyXG4kKHdpbmRvdykub24oJ3JlYWR5IHJlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gIHZhciBIZWFkZXIgPSAkKCcuSGVhZGVyJyk7XHJcbiAgdmFyIGJ0bnMgPSBIZWFkZXIuZmluZCgnLkhlYWRlcl9fYnRucycpO1xyXG4gIHZhciBtZW51X19saXN0ID0gSGVhZGVyLmZpbmQoJy5NYWluLW1lbnVfX2xpc3QnKTtcclxuICB2YXIgbG9nbyA9IEhlYWRlci5maW5kKCcuSGVhZGVyX19sb2dvJyk7XHJcblxyXG4gIGlmKHdpbmRvdy5pbm5lcldpZHRoID49IDc2OClcclxuICAgIGJ0bnMuaW5zZXJ0QWZ0ZXIobG9nbykuY3NzKCdkaXNwbGF5JywgJycpO1xyXG4gIGVsc2VcclxuICAgIGJ0bnMuYXBwZW5kVG8obWVudV9fbGlzdCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcblxyXG4gIHZhciBwaXRlbXMgPSAkKCcuUHJvZ3Jlc3NfX2l0ZW0nKTtcclxuICBwaXRlbXMuZWFjaChmdW5jdGlvbihpLGUpIHtcclxuICAgIHZhciBuZXh0UG9pbnQgPSBwYXJzZUZsb2F0KHBpdGVtcy5lcShpKzEpLmRhdGEoJ3BvaW50JykpIHx8IDEwMDtcclxuXHJcbiAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+PSA3NjgpXHJcbiAgICAgICQodGhpcykuY3NzKHtcclxuICAgICAgICBsZWZ0OiAkKHRoaXMpLmRhdGEoJ3BvaW50JyksXHJcbiAgICAgICAgdG9wOiAnJyxcclxuICAgICAgICByaWdodDogMTAwIC0gbmV4dFBvaW50ICsgJyUnLFxyXG4gICAgICAgIGJvdHRvbTogJydcclxuICAgICAgfSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICQodGhpcykuY3NzKHtcclxuICAgICAgICB0b3A6ICQodGhpcykuZGF0YSgncG9pbnQnKSxcclxuICAgICAgICBsZWZ0OiAnJyxcclxuICAgICAgICBib3R0b206IDEwMCAtIG5leHRQb2ludCArICclJyxcclxuICAgICAgICByaWdodDogJydcclxuICAgICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy5Qcm9ncmVzc19fbGluZScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+PSA3NjgpXHJcbiAgICAgICQodGhpcykuY3NzKHtcclxuICAgICAgICBsZWZ0OiAkKHRoaXMpLmRhdGEoJ29mZnNldCcpLFxyXG4gICAgICAgIHdpZHRoOiAkKHRoaXMpLmRhdGEoJ3dpZHRoJyksXHJcbiAgICAgICAgaGVpZ2h0OiAnJyxcclxuICAgICAgICB0b3A6ICcnLFxyXG4gICAgICB9KTtcclxuICAgIGVsc2VcclxuICAgICAgJCh0aGlzKS5jc3Moe1xyXG4gICAgICAgIHRvcDogJCh0aGlzKS5kYXRhKCdvZmZzZXQnKSxcclxuICAgICAgICBoZWlnaHQ6ICQodGhpcykuZGF0YSgnd2lkdGgnKSxcclxuICAgICAgICB3aWR0aDogJycsXHJcbiAgICAgICAgbGVmdDogJydcclxuICAgICAgfSk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuJCh3aW5kb3cpLm9uKCdyZWFkeSBzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICB2YXIgSGVhZGVyID0gJCgnLkhlYWRlcicpO1xyXG4gIHZhciBIb21lID0gJCgnLkhvbWUnKTtcclxuICB2YXIgRm9vdGVyID0gJCgnLkZvb3RlcicpO1xyXG5cclxuICB2YXIgaXNTdGlreSA9IEhlYWRlci5pcygnLmlzLXN0aWt5Jyk7XHJcbiAgLy8gdmFyIGlzVG9wID0gSG9tZS5vdXRlckhlaWdodCgpID49IHdpbmRvdy5zY3JvbGxZO1xyXG4gIHZhciBpc1RvcCA9ICF3aW5kb3cuc2Nyb2xsWTtcclxuICB2YXIgaXNCb3R0b20gPSB3aW5kb3cuc2Nyb2xsWSA+PSAoJChkb2N1bWVudCkub3V0ZXJIZWlnaHQoKS13aW5kb3cuaW5uZXJIZWlnaHQtRm9vdGVyLm91dGVySGVpZ2h0KCkpO1xyXG5cclxuXHJcbiAgaWYoaXNUb3ApIHtcclxuICAgICQoJy50by10b3AtYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgIEhlYWRlci5yZW1vdmVDbGFzcygnaXMtc3Rpa3knKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBpZighaXNTdGlreSkge1xyXG4gICAgICBIZWFkZXIuYWRkQ2xhc3MoJ2lzLXN0aWt5Jyk7XHJcbiAgICB9XHJcbiAgICBpZighaXNTdGlreSkge1xyXG4gICAgICAkKCcudG8tdG9wLWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZihpc0JvdHRvbSkge1xyXG4gICAgICAgICQoJy50by10b3AtYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTsgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCgnLnRvLXRvcC1idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBcclxuXHJcbn0pO1xyXG4kKGZ1bmN0aW9uKCkge1xyXG4gIHZhciB0b2dnbGVCdXR0b24gPSAkKCcuSG9tZV9fbmF2LWJ0bicpO1xyXG4gIHZhciBzZWN0aW9ucyA9ICQoJy5TZWN0aW9uJyk7XHJcbiAgdmFyIGxhYmVscyA9IHNlY3Rpb25zLmZpbmQoJy5TZWN0aW9uX19sYWJlbCcpO1xyXG4gIGlmKCFsYWJlbHMubGVuZ3RoIHx8ICFzZWN0aW9ucy5sZW5ndGgpIHJldHVybjtcclxuICB2YXIgdG9wcyA9IGxhYmVscy5tYXAoZnVuY3Rpb24oZSxpKSB7IHJldHVybiAkKHRoaXMpLm9mZnNldCgpLnRvcDsgfSkuZ2V0KCk7XHJcbiAgdmFyIGJvdHRvbXMgPSB0b3BzLnNsaWNlKCk7IC8vIGNvcHlcclxuICBib3R0b21zLnB1c2gobGFiZWxzLmxhc3QoKS5vZmZzZXQoKS50b3AgKyBzZWN0aW9ucy5sYXN0KCkub3V0ZXJIZWlnaHQoKSkgLy90aGUgbGFzdCBlbGVtZW50IGlzIG5vdCBleGlzdFxyXG4gIGJvdHRvbXMuc2hpZnQoKTtcclxuXHJcbiAgZnVuY3Rpb24gc2Nyb2xsSGFuZGxlcigpIHtcclxuICAgIHZhciBzWSA9IHdpbmRvdy5zY3JvbGxZO1xyXG5cclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsYWJlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGxiID0gbGFiZWxzLmVxKGkpO1xyXG4gICAgICB2YXIgdG9wID0gdG9wc1tpXTtcclxuICAgICAgdmFyIGJvdHRvbSA9IGJvdHRvbXNbaV07XHJcblxyXG4gICAgICBpZih0b3AgPCBzWSAmJiBib3R0b20gPiBzWSkge1xyXG4gICAgICAgIGlmKChib3R0b20gLSBsYi5vdXRlckhlaWdodCgpKSA8IHNZKSB7XHJcbiAgICAgICAgICAvLyBsYiBpcyBhdCBib3R0b20gYm9yZGVyIG9mIHNjcm9sbGluZ1xyXG4gICAgICAgICAgbGIuY3NzKHtcclxuICAgICAgICAgICAgJ3RvcCc6IGJvdHRvbSAtIHRvcCAtIGxiLm91dGVySGVpZ2h0KCksXHJcbiAgICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZSdcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHsgXHJcbiAgICAgICAgICAvLyBsYiBpcyBzb21ld2hlcmUgaW4gdGhlIG1pZGRsZVxyXG4gICAgICAgICAgbGIuY3NzKHtcclxuICAgICAgICAgICAgJ3RvcCc6IDAsXHJcbiAgICAgICAgICAgICdwb3NpdGlvbic6ICdmaXhlZCdcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmKGxiLmNzcygncG9zaXRpb24nKSA9PSAnZml4ZWQnKSB7XHJcbiAgICAgICAgbGIuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpOyAvLyBkZWZhdWx0IHZhbHVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBpc0FjdGl2ZSA9IHRydWU7XHJcbiAgJChkb2N1bWVudCkub24oJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIpO1xyXG5cclxuICB0b2dnbGVCdXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpZihpc0FjdGl2ZSkge1xyXG4gICAgICAkKGRvY3VtZW50KS5vZmYoJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJChkb2N1bWVudCkub24oJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIpO1xyXG4gICAgfVxyXG4gICAgaXNBY3RpdmUgPSAhaXNBY3RpdmU7XHJcbiAgfSlcclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICQoJy5FbnRyeV9fYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge2UucHJldmVudERlZmF1bHQoKTsgJCh0aGlzLmZvcm0pLnN1Ym1pdCgpOyB9KTtcclxuICAkKCcuRW50cnlfX2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYodGhpc1tpXS5yZXF1aXJlZCkge1xyXG4gICAgICAgIGlmKHRoaXNbaV0udmFsdWUgPT0gJycpIHtcclxuICAgICAgICAgICQodGhpc1tpXSkucGFyZW50KCcuSW5wdXQnKS5hZGRDbGFzcygnZXJyb3InKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAhZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKTtcclxuICB9KTtcclxufSk7XHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICQoJy5CdXktZm9ybScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9ICQodGhpcyk7XHJcbiAgICB2YXIgaW5uZXIgPSBzZWxmLmZpbmQoJy5CdXktZm9ybV9faW5uZXInKTtcclxuICAgIHZhciBwaCA9IHNlbGYuZmluZCgnLkJ1eS1mb3JtX19waCcpO1xyXG4gICAgaW5uZXIub24oJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBwaC5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpXHJcbiAgICB9KTtcclxuICB9KTtcclxufSk7Il0sImZpbGUiOiJtYWluLmpzIn0=
