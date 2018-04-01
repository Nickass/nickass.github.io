'use strict';
$(function () {
  $('.dd-toggler').each(function() {
    var self = $(this);
    var target = self.attr('href') ? self.attr('href') : 
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
      $("html, body").animate({ scrollTop: $(this.hash).offset().top-$('.Header').outerHeight() }, 1000);
    });
  });  

  $('.to-top-btn').on('click', function() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
  });
});

$(window).on('ready resize', function() {
  // Adding angles
  var f = window.innerWidth/2 - 960/2;
  var l = 960/2 + f;

  $('.clipping__first').attr('d','M0 0 H'+(f-40)+'l40 75 H0 z');
  $('.clipping__second').attr('d','M40 0 H'+(l+40)+' V75 H0 z')
  .attr('style', 'transform: translate('+l+'px,0);"/>');
  $('.clipping__thrid').attr('d','M40 0 H'+(l+40)+' V-75 H0 z')
  .attr('style', 'transform: translate('+l+'px,100%);"/>');
  // $('.clipping__rect').attr('height', $('.Offers').outerHeight()- 75*2 + 'px');


  // Centering
  var img = $('.Offers__bg image');
  var outH = $('.Offers').outerHeight();
  var outW = $('.Offers').outerWidth();
  var j4z = (new Image());
  j4z.src = img.attr('xlink:href');

  // I have no idea how to get image sizes
  var imgw = j4z.width - 400;
  var imgh = j4z.height -200;
  // var imgw = img[0].width.animVal.value;
  // var imgh = img[0].height.animVal.value;

  var ratioi = imgw/imgh;
  var ratioc = outW/outH;

  if( ratioi <= ratioc) {
    img.css('width', '100%'); 
    img.css('height', 'auto'); 
    img.attr('y', outH/2-imgh/2); 
    img.attr('x', 0); 
  }
  else {
    img.css('height', '100%'); 
    img.css('width', 'auto'); 
    img.attr('x', outW/2-imgw/2); 
    img.attr('y', 0); 
  }

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAnLi9jb21tb24vZGQuanMnO1xyXG5pbXBvcnQgJy4uL2NvbXBvbmVudHMvaW5kZXguZGVwJztcclxuXHJcblxyXG5mdW5jdGlvbiBtb3VzZW1vdmVWaWRlbygpIHtcclxuICAkKCcuSG9tZV9fcGxheS1idG4sIC5Ib21lX19jbG9zZS1idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICBpZih3aW5kb3cuaGlkZVZpZGVvQnRucykge1xyXG4gICAgICAkKCcuSG9tZV9fcGxheS1idG4sIC5Ib21lX19jbG9zZS1idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAkKCcuSG9tZV9fdmlkZW8nKS5vbmUoJ21vdXNlbW92ZScsIG1vdXNlbW92ZVZpZGVvKTtcclxuICAgIH1cclxuICB9LCAyMDAwKTtcclxufVxyXG5mdW5jdGlvbiBwbGF5VmlkZW8oKSB7XHJcbiAgd2luZG93LmhpZGVWaWRlb0J0bnMgPSB0cnVlO1xyXG4gICQoJy5Ib21lX192aWRlbycpLm9uZSgnbW91c2Vtb3ZlJywgbW91c2Vtb3ZlVmlkZW8pO1xyXG4gICQoJy5Ib21lX19wbGF5LWJ0biwgLkhvbWVfX2Nsb3NlLWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbn1cclxuZnVuY3Rpb24gcGF1c2VWaWRlbygpIHtcclxuICB3aW5kb3cuaGlkZVZpZGVvQnRucyA9IGZhbHNlO1xyXG4gICQoJy5Ib21lX192aWRlbycpLm9mZignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlVmlkZW8pO1xyXG4gICQoJy5Ib21lX19wbGF5LWJ0biwgLkhvbWVfX2Nsb3NlLWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJykub25lKCdjbGljaycsIG1vdXNlbW92ZVZpZGVvKTtcclxufVxyXG5mdW5jdGlvbiB0b2dnbGVWaWRlbygpIHtcclxuICAkKCcuSG9tZV9fdmlkZW8nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYodGhpcy5wYXVzZWQpIHtcclxuICAgICAgdGhpcy5wbGF5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuZnVuY3Rpb24gb3BlblZpZGVvKCkge1xyXG4gIHBsYXlWaWRlbygpO1xyXG4gICQoJy5Ib21lJykuYWRkQ2xhc3MoJ2lzLXNob3ctdmlkZW8nKTtcclxuICAvLyAkKCcuSG9tZV9fdmlkZW8nKS50cmlnZ2VyKCdwbGF5Jyk7XHJcbn1cclxuZnVuY3Rpb24gY2xvc2VWaWRlbygpIHtcclxuICBwYXVzZVZpZGVvKCk7XHJcbiAgJCgnLkhvbWUnKS5yZW1vdmVDbGFzcygnaXMtc2hvdy12aWRlbycpO1xyXG4gICQoJy5Ib21lX19jbG9zZS1idG4nKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICQoJy5Ib21lX19wbGF5LWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKS5vbmUoJ2NsaWNrJywgb3BlblZpZGVvKTtcclxuICAkKCcuSG9tZV9fdmlkZW8nKS50cmlnZ2VyKCdwYXVzZScpO1xyXG59XHJcblxyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICB2YXIgU2xpZGVyID0gJCgnLlNsaWRlcicpO1xyXG4gIFNsaWRlci5vbignaW5pdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgJCh0aGlzKS5maW5kKCcuc2xpY2stbGlzdCcpLmFkZENsYXNzKCdTbGlkZXJfX2xpc3QnKTtcclxuICB9KS5zbGljayh7XHJcbiAgICBpbml0aWFsU2xpZGU6IHBhcnNlSW50KFNsaWRlci5jaGlsZHJlbigpLmxlbmd0aCAvIDIpLFxyXG4gICAgZG90czogZmFsc2UsXHJcbiAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgIHNsaWRlc1RvU2hvdzogNyxcclxuICAgIGNlbnRlck1vZGU6IHRydWUsXHJcbiAgICB2YXJpYWJsZVdpZHRoOiB0cnVlLFxyXG4gICAgZm9jdXNPblNlbGVjdDogdHJ1ZSxcclxuICAgIGFycm93czogZmFsc2UsXHJcbiAgICAvLyBhdXRvcGxheTogdHJ1ZSxcclxuICAgIGF1dG9wbGF5U3BlZWQ6IDIwMDBcclxuICB9KTtcclxuXHJcbiAgdmFyIEJhbm5lcnMgPSAkKCcuQmFubmVycycpO1xyXG4gIEJhbm5lcnMub24oJ2luaXQnLCBmdW5jdGlvbigpIHtcclxuICAgICQodGhpcykuZmluZCgnLnNsaWNrLWxpc3QnKS5hZGRDbGFzcygnQmFubmVyc19fbGlzdCcpO1xyXG4gIH0pLnNsaWNrKHtcclxuICAgIGNlbnRlclBhZGRpbmc6IDAsXHJcbiAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgIGNlbnRlck1vZGU6IHRydWUsXHJcbiAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcclxuICAgIGZvY3VzT25TZWxlY3Q6IHRydWUsXHJcbiAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgZG90czogdHJ1ZSxcclxuICAgIGZhZGU6IHRydWUsXHJcbiAgICBjc3NFYXNlOiAnbGluZWFyJyxcclxuICAgIGRyYWdnYWJsZTogZmFsc2UsXHJcbiAgICAvLyBhdXRvcGxheTogdHJ1ZSxcclxuICAgIGF1dG9wbGF5U3BlZWQ6IDIwMDBcclxuICB9KTtcclxuICBcclxuICAkKCcuSG9tZV9fcGxheS1idG4nKS5vbmUoJ2NsaWNrJywgb3BlblZpZGVvKTtcclxuICAkKCcuSG9tZV9fcGxheS1idG4nKS5vbignY2xpY2snLCB0b2dnbGVWaWRlbyk7XHJcbiAgJCgnLkhvbWVfX2Nsb3NlLWJ0bicpLm9uKCdjbGljaycsIGNsb3NlVmlkZW8pO1xyXG4gIHZhciB2aWRlbyA9ICQoJy5Ib21lX192aWRlbycpO1xyXG5cclxuICB2aWRlby5vbigncGxheScsIHBsYXlWaWRlbyk7XHJcbiAgdmlkZW8ub24oJ3BhdXNlJywgcGF1c2VWaWRlbyk7XHJcbiAgdmlkZW8ub24oJ2VuZGVkJywgY2xvc2VWaWRlbyk7XHJcbiAgdmlkZW8ub24oJ3dhaXRpbmcnLCBmdW5jdGlvbihlKSB7XHJcbiAgICB3aW5kb3cuaGlkZVZpZGVvQnRucyA9IGZhbHNlO1xyXG4gICAgJCgnLkhvbWVfX3BsYXktYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5hZGRDbGFzcygnbG9hZGluZycpO1xyXG4gIH0pO1xyXG4gIHZpZGVvLm9uKCdjYW5wbGF5dGhyb3VnaCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIHdpbmRvdy5oaWRlVmlkZW9CdG5zID0gdHJ1ZTtcclxuICAgICQoJy5Ib21lX19wbGF5LWJ0bicpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy5NZW51IGEsIC5NYWluLW1lbnUgYScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBpZighdGhpcy5oYXNoKSByZXR1cm47XHJcblxyXG4gICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCh0aGlzLmhhc2gpLm9mZnNldCgpLnRvcC0kKCcuSGVhZGVyJykub3V0ZXJIZWlnaHQoKSB9LCAxMDAwKTtcclxuICAgIH0pO1xyXG4gIH0pOyAgXHJcblxyXG4gICQoJy50by10b3AtYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDEwMDApO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbiQod2luZG93KS5vbigncmVhZHkgcmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgLy8gQWRkaW5nIGFuZ2xlc1xyXG4gIHZhciBmID0gd2luZG93LmlubmVyV2lkdGgvMiAtIDk2MC8yO1xyXG4gIHZhciBsID0gOTYwLzIgKyBmO1xyXG5cclxuICAkKCcuY2xpcHBpbmdfX2ZpcnN0JykuYXR0cignZCcsJ00wIDAgSCcrKGYtNDApKydsNDAgNzUgSDAgeicpO1xyXG4gICQoJy5jbGlwcGluZ19fc2Vjb25kJykuYXR0cignZCcsJ000MCAwIEgnKyhsKzQwKSsnIFY3NSBIMCB6JylcclxuICAuYXR0cignc3R5bGUnLCAndHJhbnNmb3JtOiB0cmFuc2xhdGUoJytsKydweCwwKTtcIi8+Jyk7XHJcbiAgJCgnLmNsaXBwaW5nX190aHJpZCcpLmF0dHIoJ2QnLCdNNDAgMCBIJysobCs0MCkrJyBWLTc1IEgwIHonKVxyXG4gIC5hdHRyKCdzdHlsZScsICd0cmFuc2Zvcm06IHRyYW5zbGF0ZSgnK2wrJ3B4LDEwMCUpO1wiLz4nKTtcclxuICAvLyAkKCcuY2xpcHBpbmdfX3JlY3QnKS5hdHRyKCdoZWlnaHQnLCAkKCcuT2ZmZXJzJykub3V0ZXJIZWlnaHQoKS0gNzUqMiArICdweCcpO1xyXG5cclxuXHJcbiAgLy8gQ2VudGVyaW5nXHJcbiAgdmFyIGltZyA9ICQoJy5PZmZlcnNfX2JnIGltYWdlJyk7XHJcbiAgdmFyIG91dEggPSAkKCcuT2ZmZXJzJykub3V0ZXJIZWlnaHQoKTtcclxuICB2YXIgb3V0VyA9ICQoJy5PZmZlcnMnKS5vdXRlcldpZHRoKCk7XHJcbiAgdmFyIGo0eiA9IChuZXcgSW1hZ2UoKSk7XHJcbiAgajR6LnNyYyA9IGltZy5hdHRyKCd4bGluazpocmVmJyk7XHJcblxyXG4gIC8vIEkgaGF2ZSBubyBpZGVhIGhvdyB0byBnZXQgaW1hZ2Ugc2l6ZXNcclxuICB2YXIgaW1ndyA9IGo0ei53aWR0aCAtIDQwMDtcclxuICB2YXIgaW1naCA9IGo0ei5oZWlnaHQgLTIwMDtcclxuICAvLyB2YXIgaW1ndyA9IGltZ1swXS53aWR0aC5hbmltVmFsLnZhbHVlO1xyXG4gIC8vIHZhciBpbWdoID0gaW1nWzBdLmhlaWdodC5hbmltVmFsLnZhbHVlO1xyXG5cclxuICB2YXIgcmF0aW9pID0gaW1ndy9pbWdoO1xyXG4gIHZhciByYXRpb2MgPSBvdXRXL291dEg7XHJcblxyXG4gIGlmKCByYXRpb2kgPD0gcmF0aW9jKSB7XHJcbiAgICBpbWcuY3NzKCd3aWR0aCcsICcxMDAlJyk7IFxyXG4gICAgaW1nLmNzcygnaGVpZ2h0JywgJ2F1dG8nKTsgXHJcbiAgICBpbWcuYXR0cigneScsIG91dEgvMi1pbWdoLzIpOyBcclxuICAgIGltZy5hdHRyKCd4JywgMCk7IFxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGltZy5jc3MoJ2hlaWdodCcsICcxMDAlJyk7IFxyXG4gICAgaW1nLmNzcygnd2lkdGgnLCAnYXV0bycpOyBcclxuICAgIGltZy5hdHRyKCd4Jywgb3V0Vy8yLWltZ3cvMik7IFxyXG4gICAgaW1nLmF0dHIoJ3knLCAwKTsgXHJcbiAgfVxyXG5cclxufSk7XHJcblxyXG4kKHdpbmRvdykub24oJ3JlYWR5IHJlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gIHZhciBIZWFkZXIgPSAkKCcuSGVhZGVyJyk7XHJcbiAgdmFyIGJ0bnMgPSBIZWFkZXIuZmluZCgnLkhlYWRlcl9fYnRucycpO1xyXG4gIHZhciBtZW51X19saXN0ID0gSGVhZGVyLmZpbmQoJy5NYWluLW1lbnVfX2xpc3QnKTtcclxuICB2YXIgbG9nbyA9IEhlYWRlci5maW5kKCcuSGVhZGVyX19sb2dvJyk7XHJcblxyXG4gIGlmKHdpbmRvdy5pbm5lcldpZHRoID49IDc2OClcclxuICAgIGJ0bnMuaW5zZXJ0QWZ0ZXIobG9nbykuY3NzKCdkaXNwbGF5JywgJycpO1xyXG4gIGVsc2VcclxuICAgIGJ0bnMuYXBwZW5kVG8obWVudV9fbGlzdCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcblxyXG4gIHZhciBwaXRlbXMgPSAkKCcuUHJvZ3Jlc3NfX2l0ZW0nKTtcclxuICBwaXRlbXMuZWFjaChmdW5jdGlvbihpLGUpIHtcclxuICAgIHZhciBuZXh0UG9pbnQgPSBwYXJzZUZsb2F0KHBpdGVtcy5lcShpKzEpLmRhdGEoJ3BvaW50JykpIHx8IDEwMDtcclxuXHJcbiAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+PSA3NjgpXHJcbiAgICAgICQodGhpcykuY3NzKHtcclxuICAgICAgICBsZWZ0OiAkKHRoaXMpLmRhdGEoJ3BvaW50JyksXHJcbiAgICAgICAgdG9wOiAnJyxcclxuICAgICAgICByaWdodDogMTAwIC0gbmV4dFBvaW50ICsgJyUnLFxyXG4gICAgICAgIGJvdHRvbTogJydcclxuICAgICAgfSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICQodGhpcykuY3NzKHtcclxuICAgICAgICB0b3A6ICQodGhpcykuZGF0YSgncG9pbnQnKSxcclxuICAgICAgICBsZWZ0OiAnJyxcclxuICAgICAgICBib3R0b206IDEwMCAtIG5leHRQb2ludCArICclJyxcclxuICAgICAgICByaWdodDogJydcclxuICAgICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gICQoJy5Qcm9ncmVzc19fbGluZScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+PSA3NjgpXHJcbiAgICAgICQodGhpcykuY3NzKHtcclxuICAgICAgICBsZWZ0OiAkKHRoaXMpLmRhdGEoJ29mZnNldCcpLFxyXG4gICAgICAgIHdpZHRoOiAkKHRoaXMpLmRhdGEoJ3dpZHRoJyksXHJcbiAgICAgICAgaGVpZ2h0OiAnJyxcclxuICAgICAgICB0b3A6ICcnLFxyXG4gICAgICB9KTtcclxuICAgIGVsc2VcclxuICAgICAgJCh0aGlzKS5jc3Moe1xyXG4gICAgICAgIHRvcDogJCh0aGlzKS5kYXRhKCdvZmZzZXQnKSxcclxuICAgICAgICBoZWlnaHQ6ICQodGhpcykuZGF0YSgnd2lkdGgnKSxcclxuICAgICAgICB3aWR0aDogJycsXHJcbiAgICAgICAgbGVmdDogJydcclxuICAgICAgfSk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuJCh3aW5kb3cpLm9uKCdyZWFkeSBzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICB2YXIgSGVhZGVyID0gJCgnLkhlYWRlcicpO1xyXG4gIHZhciBIb21lID0gJCgnLkhvbWUnKTtcclxuICB2YXIgRm9vdGVyID0gJCgnLkZvb3RlcicpO1xyXG5cclxuICB2YXIgaXNTdGlreSA9IEhlYWRlci5pcygnLmlzLXN0aWt5Jyk7XHJcbiAgLy8gdmFyIGlzVG9wID0gSG9tZS5vdXRlckhlaWdodCgpID49IHdpbmRvdy5zY3JvbGxZO1xyXG4gIHZhciBpc1RvcCA9ICF3aW5kb3cuc2Nyb2xsWTtcclxuICB2YXIgaXNCb3R0b20gPSB3aW5kb3cuc2Nyb2xsWSA+PSAoJChkb2N1bWVudCkub3V0ZXJIZWlnaHQoKS13aW5kb3cuaW5uZXJIZWlnaHQtRm9vdGVyLm91dGVySGVpZ2h0KCkpO1xyXG5cclxuXHJcbiAgaWYoaXNUb3ApIHtcclxuICAgICQoJy50by10b3AtYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgIEhlYWRlci5yZW1vdmVDbGFzcygnaXMtc3Rpa3knKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBpZighaXNTdGlreSkge1xyXG4gICAgICBIZWFkZXIuYWRkQ2xhc3MoJ2lzLXN0aWt5Jyk7XHJcbiAgICB9XHJcbiAgICBpZighaXNTdGlreSkge1xyXG4gICAgICAkKCcudG8tdG9wLWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZihpc0JvdHRvbSkge1xyXG4gICAgICAgICQoJy50by10b3AtYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTsgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCgnLnRvLXRvcC1idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBcclxufSk7XHJcbiJdLCJmaWxlIjoibWFpbi5qcyJ9
