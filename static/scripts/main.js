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
      targetList.slideUp(200, targetList.removeClass.bind(targetList, 'opened'));
      commonparent.removeClass('active-parent');
      $(document).off('click', blurHandler)
    }

    function openDd() {
      self.addClass('active');
      targetList.slideDown(200, targetList.addClass.bind(targetList, 'opened'));
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

$(window).on('ready resize', function() {
  var Header = $('.Header');
  var btns = Header.find('.Header__btns');
  var menu = Header.find('.Main-menu');
  var logo = Header.find('.Header__logo')

  if(window.innerWidth >= 768)
    btns.insertAfter(logo).css('display', '');
  else
    btns.appendTo(menu).css('display', 'block');

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
  });
});

$(window).on('ready scroll', function() {
  var Header = $('.Header');
  var Home = $('.Home');
  var Footer = $('.Footer');

  var isStiky = Header.is('.is-stiky');
  var isTop = Home.outerHeight() >= window.scrollY;
  var isBottom = window.scrollY >= ($(document).outerHeight()-window.innerHeight-Footer.outerHeight());


  if(isTop) {
    $('.to-top-btn').addClass('hide');
    Header.removeClass('is-stiky');
  }
  else {
    if(!isStiky) {
      Header
      .css('top', -Header.outerHeight())
      .addClass('is-stiky')
      .animate({'top': '0'}, 400);
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
    window.scrollTo(0,1);
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
    $('.Home__play-btn').addClass('loading').removeClass('hide').css('opacity', '');
  });
  video.on('canplaythrough', function(e) {
    $('.Home__play-btn').removeClass('loading').addClass('hide');
  });

  video.on('click', toggleVideo);
  video.appendTo('.Home');
}

(function($) {
  var CustomList = FlipClock.List.extend({
    classes: {
      active: 'T-number__next',
      before: 'T-number__prev',
      flip: 'T-number'  
    },
    constructor: function(factory, digit, options) {
      this.base(factory, digit, options);
    }, 
    createListItem: function(css, value) {
      return [
        '<div class="'+css+'">',
          '<div class="T-number__up">'+(value ? value : '')+'</div>',
          '<div class="T-number__down">'+(value ? value : '')+'</div>',
        '</div>'
      ].join('');
    },
    createList: function() {
      var lastDigit = this.getPrevDigit() ? this.getPrevDigit() : this.digit;

      var html = $([
          '<div class="'+this.classes.flip+' '+(this.factory.running ? this.factory.classes.play : '')+'">',
            this.createListItem(this.classes.before, lastDigit),
            this.createListItem(this.classes.active, this.digit),
          '</div>',
      ].join(''));
      return html;
    },
  });


  FlipClock.DailyCounterCustomFace = FlipClock.Face.extend({
    showSeconds: true,
    classes: { 
      wrapper: 'Timer',
      item: 'Timer__item',
      name: 'Timer__name'
    },
    constructor: function(factory, options) {
      factory.time.digitize = function(obj) {
        var data = [];

        $.each(obj, function(i, value) {
          value = value.toString();
          
          if(value.length == 1) {
            value = '0'+value;
          }
          data.push(value);
        });

        if(data.length > this.minimumDigits) {
          this.minimumDigits = data.length;
        }

        return data;
      }
      this.base(factory, options);
    },
    createList: function(digit, options) {
      if(typeof digit === "object") {
        options = digit;
        digit = 0;
      }

      var obj = new CustomList(this.factory, digit, options);
      this.lists.push(obj);

      return obj;
    },

    build: function(time) {
      var t = this;

      time = time ? time : this.factory.time.getDayCounter(this.showSeconds);
      $.each(time, function(i, digit) {
        t.createList(digit);
      });

      var items = ['Days', 'Hours', 'Minutes', 'Seconds'];
      for (var i = this.lists.length - 1; i >= 0; i--) {
        $('<div class="'+this.classes.item+'"></div>')
        .prependTo(this.factory.$el)
        .append(this.lists[i].$el)
        .append('<div class="'+this.classes.name+'">'+this.factory.localize(items[i])+'</div>');
      }
      this.base();
    },
    flip: function(time, doNotAddPlayClass) {
      if(!time) {
        time = this.factory.time.getDayCounter(this.showSeconds);
      }
      this.autoIncrement();
      this.base(time, doNotAddPlayClass);
    }
  });
}(jQuery));

$(function() {
  $('.Home__play-btn').one('click', initVideo);
  $('.Home__play-btn').on('click', toggleVideo);

  $('.Menu a, .Main-menu a').each(function() {
    if(!this.hash) return;

    $(this).on('click', function() {
      switch(this.hash) {
        case '#about':
          $("html, body").animate({ scrollTop: $(this.hash).offset().top+1 }, 1000);
          break;
        case '#how-to-use':
          $("html, body").animate({ scrollTop: $(this.hash).offset().top - window.innerHeight/2 }, 1000);
          break;
        default:
          $("html, body").animate({ scrollTop: $(this.hash).offset().top-$('.Header').outerHeight() }, 1000);
      }
    });
  });

  var clock  = $('.Timer').FlipClock(2330000, {
    countdown: true,
    clockFace: 'DailyCounterCustom',
  });

  $('.to-top-btn').on('click', function() {
    $("html, body").animate({ scrollTop: 0 }, 1000);
  });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAnLi9jb21tb24vZGQuanMnO1xyXG5pbXBvcnQgJy4uL2NvbXBvbmVudHMvaW5kZXguZGVwJztcclxuXHJcbiQod2luZG93KS5vbigncmVhZHkgcmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgdmFyIEhlYWRlciA9ICQoJy5IZWFkZXInKTtcclxuICB2YXIgYnRucyA9IEhlYWRlci5maW5kKCcuSGVhZGVyX19idG5zJyk7XHJcbiAgdmFyIG1lbnUgPSBIZWFkZXIuZmluZCgnLk1haW4tbWVudScpO1xyXG4gIHZhciBsb2dvID0gSGVhZGVyLmZpbmQoJy5IZWFkZXJfX2xvZ28nKVxyXG5cclxuICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+PSA3NjgpXHJcbiAgICBidG5zLmluc2VydEFmdGVyKGxvZ28pLmNzcygnZGlzcGxheScsICcnKTtcclxuICBlbHNlXHJcbiAgICBidG5zLmFwcGVuZFRvKG1lbnUpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cclxuICAkKCcuUHJvZ3Jlc3NfX2l0ZW0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYod2luZG93LmlubmVyV2lkdGggPj0gNzY4KVxyXG4gICAgICAkKHRoaXMpLmNzcyh7XHJcbiAgICAgICAgd2lkdGg6ICQodGhpcykuZGF0YSgncG9pbnQnKSxcclxuICAgICAgICBoZWlnaHQ6ICcnXHJcbiAgICAgIH0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAkKHRoaXMpLmNzcyh7XHJcbiAgICAgICAgaGVpZ2h0OiAkKHRoaXMpLmRhdGEoJ3BvaW50JyksXHJcbiAgICAgICAgd2lkdGg6ICcnXHJcbiAgICAgIH0pO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbiQod2luZG93KS5vbigncmVhZHkgc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcbiAgdmFyIEhlYWRlciA9ICQoJy5IZWFkZXInKTtcclxuICB2YXIgSG9tZSA9ICQoJy5Ib21lJyk7XHJcbiAgdmFyIEZvb3RlciA9ICQoJy5Gb290ZXInKTtcclxuXHJcbiAgdmFyIGlzU3Rpa3kgPSBIZWFkZXIuaXMoJy5pcy1zdGlreScpO1xyXG4gIHZhciBpc1RvcCA9IEhvbWUub3V0ZXJIZWlnaHQoKSA+PSB3aW5kb3cuc2Nyb2xsWTtcclxuICB2YXIgaXNCb3R0b20gPSB3aW5kb3cuc2Nyb2xsWSA+PSAoJChkb2N1bWVudCkub3V0ZXJIZWlnaHQoKS13aW5kb3cuaW5uZXJIZWlnaHQtRm9vdGVyLm91dGVySGVpZ2h0KCkpO1xyXG5cclxuXHJcbiAgaWYoaXNUb3ApIHtcclxuICAgICQoJy50by10b3AtYnRuJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICAgIEhlYWRlci5yZW1vdmVDbGFzcygnaXMtc3Rpa3knKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBpZighaXNTdGlreSkge1xyXG4gICAgICBIZWFkZXJcclxuICAgICAgLmNzcygndG9wJywgLUhlYWRlci5vdXRlckhlaWdodCgpKVxyXG4gICAgICAuYWRkQ2xhc3MoJ2lzLXN0aWt5JylcclxuICAgICAgLmFuaW1hdGUoeyd0b3AnOiAnMCd9LCA0MDApO1xyXG4gICAgfVxyXG4gICAgaWYoIWlzU3Rpa3kpIHtcclxuICAgICAgJCgnLnRvLXRvcC1idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYoaXNCb3R0b20pIHtcclxuICAgICAgICAkKCcudG8tdG9wLWJ0bicpLmFkZENsYXNzKCdoaWRlJyk7IFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQoJy50by10b3AtYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gXHJcblxyXG59KTtcclxuXHJcblxyXG5mdW5jdGlvbiB0b2dnbGVWaWRlbygpIHtcclxuICAkKCcuSG9tZV9fdmlkZW8nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYodGhpcy5wYXVzZWQpIHtcclxuICAgICAgdGhpcy5wbGF5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuZnVuY3Rpb24gaW5pdFZpZGVvKCkge1xyXG4gIHZhciB2aWRlbyA9ICQoJy5Ib21lX192aWRlbycpO1xyXG5cclxuICB2aWRlby5vbigncGxheScsIGZ1bmN0aW9uKCkge1xyXG4gICAgd2luZG93LnNjcm9sbFRvKDAsMSk7XHJcbiAgICAkKCcuSG9tZScpLmFkZENsYXNzKCdpcy1zaG93LXZpZGVvJyk7XHJcbiAgICAkKCcuSG9tZV9fcGxheS1idG4nKVxyXG4gICAgLnJlbW92ZUNsYXNzKCdsb2FkaW5nJylcclxuICAgIC5hZGRDbGFzcygnaGlkZScpXHJcbiAgICAuY3NzKHtvcGFjaXR5OiAwfSlcclxuICAgIC5vbmUoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHskKHRoaXMpLmNzcygnb3BhY2l0eScsICcnKX0pO1xyXG4gIH0pXHJcbiAgdmlkZW8ub24oJ3BhdXNlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAkKCcuSG9tZScpLnJlbW92ZUNsYXNzKCdpcy1zaG93LXZpZGVvJyk7ICAgIFxyXG4gICAgJCgnLkhvbWVfX3BsYXktYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpLmNzcygnb3BhY2l0eScsICcnKTtcclxuICB9KVxyXG4gIHZpZGVvLm9uKCdlbmRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc29sZS5sb2coJ2VuZGVkJyk7XHJcbiAgICAkKCcuSG9tZScpLnJlbW92ZUNsYXNzKCdpcy1zaG93LXZpZGVvJyk7XHJcbiAgICAkKCcuSG9tZV9fcGxheS1idG4nKS5yZW1vdmVDbGFzcygnaGlkZScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XHJcbiAgfSlcclxuICB2aWRlby5vbignd2FpdGluZycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICQoJy5Ib21lX19wbGF5LWJ0bicpLmFkZENsYXNzKCdsb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5jc3MoJ29wYWNpdHknLCAnJyk7XHJcbiAgfSk7XHJcbiAgdmlkZW8ub24oJ2NhbnBsYXl0aHJvdWdoJywgZnVuY3Rpb24oZSkge1xyXG4gICAgJCgnLkhvbWVfX3BsYXktYnRuJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gIH0pO1xyXG5cclxuICB2aWRlby5vbignY2xpY2snLCB0b2dnbGVWaWRlbyk7XHJcbiAgdmlkZW8uYXBwZW5kVG8oJy5Ib21lJyk7XHJcbn1cclxuXHJcbihmdW5jdGlvbigkKSB7XHJcbiAgdmFyIEN1c3RvbUxpc3QgPSBGbGlwQ2xvY2suTGlzdC5leHRlbmQoe1xyXG4gICAgY2xhc3Nlczoge1xyXG4gICAgICBhY3RpdmU6ICdULW51bWJlcl9fbmV4dCcsXHJcbiAgICAgIGJlZm9yZTogJ1QtbnVtYmVyX19wcmV2JyxcclxuICAgICAgZmxpcDogJ1QtbnVtYmVyJyAgXHJcbiAgICB9LFxyXG4gICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKGZhY3RvcnksIGRpZ2l0LCBvcHRpb25zKSB7XHJcbiAgICAgIHRoaXMuYmFzZShmYWN0b3J5LCBkaWdpdCwgb3B0aW9ucyk7XHJcbiAgICB9LCBcclxuICAgIGNyZWF0ZUxpc3RJdGVtOiBmdW5jdGlvbihjc3MsIHZhbHVlKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgJzxkaXYgY2xhc3M9XCInK2NzcysnXCI+JyxcclxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiVC1udW1iZXJfX3VwXCI+JysodmFsdWUgPyB2YWx1ZSA6ICcnKSsnPC9kaXY+JyxcclxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiVC1udW1iZXJfX2Rvd25cIj4nKyh2YWx1ZSA/IHZhbHVlIDogJycpKyc8L2Rpdj4nLFxyXG4gICAgICAgICc8L2Rpdj4nXHJcbiAgICAgIF0uam9pbignJyk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlTGlzdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBsYXN0RGlnaXQgPSB0aGlzLmdldFByZXZEaWdpdCgpID8gdGhpcy5nZXRQcmV2RGlnaXQoKSA6IHRoaXMuZGlnaXQ7XHJcblxyXG4gICAgICB2YXIgaHRtbCA9ICQoW1xyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCInK3RoaXMuY2xhc3Nlcy5mbGlwKycgJysodGhpcy5mYWN0b3J5LnJ1bm5pbmcgPyB0aGlzLmZhY3RvcnkuY2xhc3Nlcy5wbGF5IDogJycpKydcIj4nLFxyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUxpc3RJdGVtKHRoaXMuY2xhc3Nlcy5iZWZvcmUsIGxhc3REaWdpdCksXHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTGlzdEl0ZW0odGhpcy5jbGFzc2VzLmFjdGl2ZSwgdGhpcy5kaWdpdCksXHJcbiAgICAgICAgICAnPC9kaXY+JyxcclxuICAgICAgXS5qb2luKCcnKSk7XHJcbiAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfSxcclxuICB9KTtcclxuXHJcblxyXG4gIEZsaXBDbG9jay5EYWlseUNvdW50ZXJDdXN0b21GYWNlID0gRmxpcENsb2NrLkZhY2UuZXh0ZW5kKHtcclxuICAgIHNob3dTZWNvbmRzOiB0cnVlLFxyXG4gICAgY2xhc3NlczogeyBcclxuICAgICAgd3JhcHBlcjogJ1RpbWVyJyxcclxuICAgICAgaXRlbTogJ1RpbWVyX19pdGVtJyxcclxuICAgICAgbmFtZTogJ1RpbWVyX19uYW1lJ1xyXG4gICAgfSxcclxuICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbihmYWN0b3J5LCBvcHRpb25zKSB7XHJcbiAgICAgIGZhY3RvcnkudGltZS5kaWdpdGl6ZSA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgIHZhciBkYXRhID0gW107XHJcblxyXG4gICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGksIHZhbHVlKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmKHZhbHVlLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gJzAnK3ZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZGF0YS5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYoZGF0YS5sZW5ndGggPiB0aGlzLm1pbmltdW1EaWdpdHMpIHtcclxuICAgICAgICAgIHRoaXMubWluaW11bURpZ2l0cyA9IGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5iYXNlKGZhY3RvcnksIG9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZUxpc3Q6IGZ1bmN0aW9uKGRpZ2l0LCBvcHRpb25zKSB7XHJcbiAgICAgIGlmKHR5cGVvZiBkaWdpdCA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIG9wdGlvbnMgPSBkaWdpdDtcclxuICAgICAgICBkaWdpdCA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBvYmogPSBuZXcgQ3VzdG9tTGlzdCh0aGlzLmZhY3RvcnksIGRpZ2l0LCBvcHRpb25zKTtcclxuICAgICAgdGhpcy5saXN0cy5wdXNoKG9iaik7XHJcblxyXG4gICAgICByZXR1cm4gb2JqO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZDogZnVuY3Rpb24odGltZSkge1xyXG4gICAgICB2YXIgdCA9IHRoaXM7XHJcblxyXG4gICAgICB0aW1lID0gdGltZSA/IHRpbWUgOiB0aGlzLmZhY3RvcnkudGltZS5nZXREYXlDb3VudGVyKHRoaXMuc2hvd1NlY29uZHMpO1xyXG4gICAgICAkLmVhY2godGltZSwgZnVuY3Rpb24oaSwgZGlnaXQpIHtcclxuICAgICAgICB0LmNyZWF0ZUxpc3QoZGlnaXQpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciBpdGVtcyA9IFsnRGF5cycsICdIb3VycycsICdNaW51dGVzJywgJ1NlY29uZHMnXTtcclxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMubGlzdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAkKCc8ZGl2IGNsYXNzPVwiJyt0aGlzLmNsYXNzZXMuaXRlbSsnXCI+PC9kaXY+JylcclxuICAgICAgICAucHJlcGVuZFRvKHRoaXMuZmFjdG9yeS4kZWwpXHJcbiAgICAgICAgLmFwcGVuZCh0aGlzLmxpc3RzW2ldLiRlbClcclxuICAgICAgICAuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiJyt0aGlzLmNsYXNzZXMubmFtZSsnXCI+Jyt0aGlzLmZhY3RvcnkubG9jYWxpemUoaXRlbXNbaV0pKyc8L2Rpdj4nKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmJhc2UoKTtcclxuICAgIH0sXHJcbiAgICBmbGlwOiBmdW5jdGlvbih0aW1lLCBkb05vdEFkZFBsYXlDbGFzcykge1xyXG4gICAgICBpZighdGltZSkge1xyXG4gICAgICAgIHRpbWUgPSB0aGlzLmZhY3RvcnkudGltZS5nZXREYXlDb3VudGVyKHRoaXMuc2hvd1NlY29uZHMpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuYXV0b0luY3JlbWVudCgpO1xyXG4gICAgICB0aGlzLmJhc2UodGltZSwgZG9Ob3RBZGRQbGF5Q2xhc3MpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59KGpRdWVyeSkpO1xyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICAkKCcuSG9tZV9fcGxheS1idG4nKS5vbmUoJ2NsaWNrJywgaW5pdFZpZGVvKTtcclxuICAkKCcuSG9tZV9fcGxheS1idG4nKS5vbignY2xpY2snLCB0b2dnbGVWaWRlbyk7XHJcblxyXG4gICQoJy5NZW51IGEsIC5NYWluLW1lbnUgYScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBpZighdGhpcy5oYXNoKSByZXR1cm47XHJcblxyXG4gICAgJCh0aGlzKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgc3dpdGNoKHRoaXMuaGFzaCkge1xyXG4gICAgICAgIGNhc2UgJyNhYm91dCc6XHJcbiAgICAgICAgICAkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKHRoaXMuaGFzaCkub2Zmc2V0KCkudG9wKzEgfSwgMTAwMCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICcjaG93LXRvLXVzZSc6XHJcbiAgICAgICAgICAkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKHRoaXMuaGFzaCkub2Zmc2V0KCkudG9wIC0gd2luZG93LmlubmVySGVpZ2h0LzIgfSwgMTAwMCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCh0aGlzLmhhc2gpLm9mZnNldCgpLnRvcC0kKCcuSGVhZGVyJykub3V0ZXJIZWlnaHQoKSB9LCAxMDAwKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHZhciBjbG9jayAgPSAkKCcuVGltZXInKS5GbGlwQ2xvY2soMjMzMDAwMCwge1xyXG4gICAgY291bnRkb3duOiB0cnVlLFxyXG4gICAgY2xvY2tGYWNlOiAnRGFpbHlDb3VudGVyQ3VzdG9tJyxcclxuICB9KTtcclxuXHJcbiAgJCgnLnRvLXRvcC1idG4nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgMTAwMCk7XHJcbiAgfSk7XHJcbn0pO1xyXG4iXSwiZmlsZSI6Im1haW4uanMifQ==
