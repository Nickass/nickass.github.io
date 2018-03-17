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
        $(e.target).closest(targetList).length !== 0 ||
        $(e.target).is(self) ) return;
      else closeDd();
    }

    function closeDd() {
      self.removeClass('active');
      targetList.slideUp(200, targetList.removeClass.bind(targetList, 'opened'));
      commonparent.removeClass('active-parent');
    }

    function openDd() {
      self.addClass('active');
      targetList.slideDown(200, targetList.addClass.bind(targetList, 'opened'));
      commonparent.addClass('active-parent');
    }

    $(document).on('click', blurHandler)
    self.on('click', function(e) {
      e.preventDefault();
      if(self.is('.active')) closeDd();
      else openDd();
    });
  });
});

function toggleVideo() {
  $('.Home__video').each(function() {
    if(this.paused) {
      this.play();
    } else {
      this.pause();
    }
  });
}
function initVideo() {
  var video = $('.Home__video');

  video.on('play', function() {
    $('.Home').addClass('is-show-video');
    $('.Home__play-btn')
    .removeClass('loading')
    .addClass('hide')
    .css({opacity: 0})
    .one('mouseleave', function() {$(this).css('opacity', '')});
  })
  video.on('pause', function() {
    $('.Home').removeClass('is-show-video');    
    $('.Home__play-btn').removeClass('hide').removeClass('loading').css('opacity', '');
  })
  video.on('ended', function() {
    console.log('ended');
    $('.Home').removeClass('is-show-video');
    $('.Home__play-btn').removeClass('hide').removeClass('loading');
  })
  video.on('waiting', function(e) {
    $('.Home__play-btn').addClass('loading').removeClass('hide');
  });
  video.on('canplaythrough', function(e) {
    $('.Home__play-btn').removeClass('loading').addClass('hide');
  });

  video.on('click', toggleVideo);
  video.appendTo('.Home');
}
$(function() {
  $('.Home__play-btn').one('click', initVideo);
  $('.Home__play-btn').on('click', toggleVideo);
});

$(window).on('ready resize', function() {
  var Header = $('.Header');
  var btns = Header.find('.Header__btns');
  var menu = Header.find('.Main-menu');
  var logo = Header.find('.Header__logo')

  if(window.innerWidth >= 768)
    btns.insertAfter(logo).css('display', '');
  else
    btns.appendTo(menu).css('display', 'block');
});
$(window).on('ready scroll', function() {
  var Header = $('.Header');
  var Home = $('.Home');

  if(Home.outerHeight() < window.scrollY) {
    if(!Header.is('.is-stiky')) {
      Header.css('top', -Header.outerHeight()).addClass('is-stiky').animate({'top': '0'}, 400);
    }
  }
  else Header.removeClass('is-stiky');
});


$(window).on('ready resize', function() {
  $('.Progress__item').each(function() {
    if(window.innerWidth >= 768)
      $(this).css({
        width: $(this).data('point'),
        height: ''
      });
    else
      $(this).css({
        height: $(this).data('point'),
        width: ''
      });
  })
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcblxyXG5pbXBvcnQgJy4vY29tbW9uL2RkLmpzJztcclxuaW1wb3J0ICcuLi9jb21wb25lbnRzL2luZGV4LmRlcCc7XHJcblxyXG5mdW5jdGlvbiB0b2dnbGVWaWRlbygpIHtcclxuICAkKCcuSG9tZV9fdmlkZW8nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYodGhpcy5wYXVzZWQpIHtcclxuICAgICAgdGhpcy5wbGF5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuZnVuY3Rpb24gaW5pdFZpZGVvKCkge1xyXG4gIHZhciB2aWRlbyA9ICQoJy5Ib21lX192aWRlbycpO1xyXG5cclxuICB2aWRlby5vbigncGxheScsIGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnLkhvbWUnKS5hZGRDbGFzcygnaXMtc2hvdy12aWRlbycpO1xyXG4gICAgJCgnLkhvbWVfX3BsYXktYnRuJylcclxuICAgIC5yZW1vdmVDbGFzcygnbG9hZGluZycpXHJcbiAgICAuYWRkQ2xhc3MoJ2hpZGUnKVxyXG4gICAgLmNzcyh7b3BhY2l0eTogMH0pXHJcbiAgICAub25lKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7JCh0aGlzKS5jc3MoJ29wYWNpdHknLCAnJyl9KTtcclxuICB9KVxyXG4gIHZpZGVvLm9uKCdwYXVzZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnLkhvbWUnKS5yZW1vdmVDbGFzcygnaXMtc2hvdy12aWRlbycpOyAgICBcclxuICAgICQoJy5Ib21lX19wbGF5LWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKS5jc3MoJ29wYWNpdHknLCAnJyk7XHJcbiAgfSlcclxuICB2aWRlby5vbignZW5kZWQnLCBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdlbmRlZCcpO1xyXG4gICAgJCgnLkhvbWUnKS5yZW1vdmVDbGFzcygnaXMtc2hvdy12aWRlbycpO1xyXG4gICAgJCgnLkhvbWVfX3BsYXktYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xyXG4gIH0pXHJcbiAgdmlkZW8ub24oJ3dhaXRpbmcnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAkKCcuSG9tZV9fcGxheS1idG4nKS5hZGRDbGFzcygnbG9hZGluZycpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgfSk7XHJcbiAgdmlkZW8ub24oJ2NhbnBsYXl0aHJvdWdoJywgZnVuY3Rpb24oZSkge1xyXG4gICAgJCgnLkhvbWVfX3BsYXktYnRuJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gIH0pO1xyXG5cclxuICB2aWRlby5vbignY2xpY2snLCB0b2dnbGVWaWRlbyk7XHJcbiAgdmlkZW8uYXBwZW5kVG8oJy5Ib21lJyk7XHJcbn1cclxuJChmdW5jdGlvbigpIHtcclxuICAkKCcuSG9tZV9fcGxheS1idG4nKS5vbmUoJ2NsaWNrJywgaW5pdFZpZGVvKTtcclxuICAkKCcuSG9tZV9fcGxheS1idG4nKS5vbignY2xpY2snLCB0b2dnbGVWaWRlbyk7XHJcbn0pO1xyXG5cclxuJCh3aW5kb3cpLm9uKCdyZWFkeSByZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICB2YXIgSGVhZGVyID0gJCgnLkhlYWRlcicpO1xyXG4gIHZhciBidG5zID0gSGVhZGVyLmZpbmQoJy5IZWFkZXJfX2J0bnMnKTtcclxuICB2YXIgbWVudSA9IEhlYWRlci5maW5kKCcuTWFpbi1tZW51Jyk7XHJcbiAgdmFyIGxvZ28gPSBIZWFkZXIuZmluZCgnLkhlYWRlcl9fbG9nbycpXHJcblxyXG4gIGlmKHdpbmRvdy5pbm5lcldpZHRoID49IDc2OClcclxuICAgIGJ0bnMuaW5zZXJ0QWZ0ZXIobG9nbykuY3NzKCdkaXNwbGF5JywgJycpO1xyXG4gIGVsc2VcclxuICAgIGJ0bnMuYXBwZW5kVG8obWVudSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbn0pO1xyXG4kKHdpbmRvdykub24oJ3JlYWR5IHNjcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG4gIHZhciBIZWFkZXIgPSAkKCcuSGVhZGVyJyk7XHJcbiAgdmFyIEhvbWUgPSAkKCcuSG9tZScpO1xyXG5cclxuICBpZihIb21lLm91dGVySGVpZ2h0KCkgPCB3aW5kb3cuc2Nyb2xsWSkge1xyXG4gICAgaWYoIUhlYWRlci5pcygnLmlzLXN0aWt5JykpIHtcclxuICAgICAgSGVhZGVyLmNzcygndG9wJywgLUhlYWRlci5vdXRlckhlaWdodCgpKS5hZGRDbGFzcygnaXMtc3Rpa3knKS5hbmltYXRlKHsndG9wJzogJzAnfSwgNDAwKTtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSBIZWFkZXIucmVtb3ZlQ2xhc3MoJ2lzLXN0aWt5Jyk7XHJcbn0pO1xyXG5cclxuXHJcbiQod2luZG93KS5vbigncmVhZHkgcmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgJCgnLlByb2dyZXNzX19pdGVtJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoID49IDc2OClcclxuICAgICAgJCh0aGlzKS5jc3Moe1xyXG4gICAgICAgIHdpZHRoOiAkKHRoaXMpLmRhdGEoJ3BvaW50JyksXHJcbiAgICAgICAgaGVpZ2h0OiAnJ1xyXG4gICAgICB9KTtcclxuICAgIGVsc2VcclxuICAgICAgJCh0aGlzKS5jc3Moe1xyXG4gICAgICAgIGhlaWdodDogJCh0aGlzKS5kYXRhKCdwb2ludCcpLFxyXG4gICAgICAgIHdpZHRoOiAnJ1xyXG4gICAgICB9KTtcclxuICB9KVxyXG59KTsiXSwiZmlsZSI6Im1haW4uanMifQ==
