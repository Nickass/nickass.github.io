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
});

$(window).on('ready scroll', function() {
  var Header = $('.Header');
  var Home = $('.Home');

  if(Home.outerHeight() < window.scrollY) {
    if(!Header.is('.is-stiky')) {
      Header
      .css('top', -Header.outerHeight())
      .addClass('is-stiky')
      .animate({'top': '0'}, 400);
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
    $('.Home__play-btn').addClass('loading').removeClass('hide').css('opacity', '');
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
    classes: { wrapper: 'Timer' },
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
      var children = this.factory.$el;


      time = time ? time : this.factory.time.getDayCounter(this.showSeconds);
      $.each(time, function(i, digit) {
        t.createList(digit);
      });

      var items = ['Days', 'Hours', 'Minutes', 'Seconds'];
      for (var i = this.lists.length - 1; i >= 0; i--) {
        $('<div class="Timer__item"></div>')
        .prependTo(this.factory.$el)
        .append(this.lists[i].$el)
        .append('<div class="Timer__name">'+this.factory.localize(items[i])+'</div>');
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
  

var clock  = $('.Timer').FlipClock(2330000, {
  countdown: true,
  clockFace: 'DailyCounterCustom',
  classes: { wrapper: 'Timer', play: 'play' }
});

});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAnLi9jb21tb24vZGQuanMnO1xyXG5pbXBvcnQgJy4uL2NvbXBvbmVudHMvaW5kZXguZGVwJztcclxuXHJcbiQod2luZG93KS5vbigncmVhZHkgcmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgdmFyIEhlYWRlciA9ICQoJy5IZWFkZXInKTtcclxuICB2YXIgYnRucyA9IEhlYWRlci5maW5kKCcuSGVhZGVyX19idG5zJyk7XHJcbiAgdmFyIG1lbnUgPSBIZWFkZXIuZmluZCgnLk1haW4tbWVudScpO1xyXG4gIHZhciBsb2dvID0gSGVhZGVyLmZpbmQoJy5IZWFkZXJfX2xvZ28nKVxyXG5cclxuICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+PSA3NjgpXHJcbiAgICBidG5zLmluc2VydEFmdGVyKGxvZ28pLmNzcygnZGlzcGxheScsICcnKTtcclxuICBlbHNlXHJcbiAgICBidG5zLmFwcGVuZFRvKG1lbnUpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG59KTtcclxuXHJcbiQod2luZG93KS5vbigncmVhZHkgc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcbiAgdmFyIEhlYWRlciA9ICQoJy5IZWFkZXInKTtcclxuICB2YXIgSG9tZSA9ICQoJy5Ib21lJyk7XHJcblxyXG4gIGlmKEhvbWUub3V0ZXJIZWlnaHQoKSA8IHdpbmRvdy5zY3JvbGxZKSB7XHJcbiAgICBpZighSGVhZGVyLmlzKCcuaXMtc3Rpa3knKSkge1xyXG4gICAgICBIZWFkZXJcclxuICAgICAgLmNzcygndG9wJywgLUhlYWRlci5vdXRlckhlaWdodCgpKVxyXG4gICAgICAuYWRkQ2xhc3MoJ2lzLXN0aWt5JylcclxuICAgICAgLmFuaW1hdGUoeyd0b3AnOiAnMCd9LCA0MDApO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIEhlYWRlci5yZW1vdmVDbGFzcygnaXMtc3Rpa3knKTtcclxufSk7XHJcblxyXG4kKHdpbmRvdykub24oJ3JlYWR5IHJlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICQoJy5Qcm9ncmVzc19faXRlbScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+PSA3NjgpXHJcbiAgICAgICQodGhpcykuY3NzKHtcclxuICAgICAgICB3aWR0aDogJCh0aGlzKS5kYXRhKCdwb2ludCcpLFxyXG4gICAgICAgIGhlaWdodDogJydcclxuICAgICAgfSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICQodGhpcykuY3NzKHtcclxuICAgICAgICBoZWlnaHQ6ICQodGhpcykuZGF0YSgncG9pbnQnKSxcclxuICAgICAgICB3aWR0aDogJydcclxuICAgICAgfSk7XHJcbiAgfSlcclxufSk7XHJcblxyXG5mdW5jdGlvbiB0b2dnbGVWaWRlbygpIHtcclxuICAkKCcuSG9tZV9fdmlkZW8nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYodGhpcy5wYXVzZWQpIHtcclxuICAgICAgdGhpcy5wbGF5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuZnVuY3Rpb24gaW5pdFZpZGVvKCkge1xyXG4gIHZhciB2aWRlbyA9ICQoJy5Ib21lX192aWRlbycpO1xyXG5cclxuICB2aWRlby5vbigncGxheScsIGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnLkhvbWUnKS5hZGRDbGFzcygnaXMtc2hvdy12aWRlbycpO1xyXG4gICAgJCgnLkhvbWVfX3BsYXktYnRuJylcclxuICAgIC5yZW1vdmVDbGFzcygnbG9hZGluZycpXHJcbiAgICAuYWRkQ2xhc3MoJ2hpZGUnKVxyXG4gICAgLmNzcyh7b3BhY2l0eTogMH0pXHJcbiAgICAub25lKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7JCh0aGlzKS5jc3MoJ29wYWNpdHknLCAnJyl9KTtcclxuICB9KVxyXG4gIHZpZGVvLm9uKCdwYXVzZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgJCgnLkhvbWUnKS5yZW1vdmVDbGFzcygnaXMtc2hvdy12aWRlbycpOyAgICBcclxuICAgICQoJy5Ib21lX19wbGF5LWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKS5jc3MoJ29wYWNpdHknLCAnJyk7XHJcbiAgfSlcclxuICB2aWRlby5vbignZW5kZWQnLCBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKCdlbmRlZCcpO1xyXG4gICAgJCgnLkhvbWUnKS5yZW1vdmVDbGFzcygnaXMtc2hvdy12aWRlbycpO1xyXG4gICAgJCgnLkhvbWVfX3BsYXktYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xyXG4gIH0pXHJcbiAgdmlkZW8ub24oJ3dhaXRpbmcnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAkKCcuSG9tZV9fcGxheS1idG4nKS5hZGRDbGFzcygnbG9hZGluZycpLnJlbW92ZUNsYXNzKCdoaWRlJykuY3NzKCdvcGFjaXR5JywgJycpO1xyXG4gIH0pO1xyXG4gIHZpZGVvLm9uKCdjYW5wbGF5dGhyb3VnaCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICQoJy5Ib21lX19wbGF5LWJ0bicpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuICB9KTtcclxuXHJcbiAgdmlkZW8ub24oJ2NsaWNrJywgdG9nZ2xlVmlkZW8pO1xyXG4gIHZpZGVvLmFwcGVuZFRvKCcuSG9tZScpO1xyXG59XHJcblxyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICAkKCcuSG9tZV9fcGxheS1idG4nKS5vbmUoJ2NsaWNrJywgaW5pdFZpZGVvKTtcclxuICAkKCcuSG9tZV9fcGxheS1idG4nKS5vbignY2xpY2snLCB0b2dnbGVWaWRlbyk7XHJcbiAgJCgnLk1lbnUgYSwgLk1haW4tbWVudSBhJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIGlmKCF0aGlzLmhhc2gpIHJldHVybjtcclxuXHJcbiAgICAkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBzd2l0Y2godGhpcy5oYXNoKSB7XHJcbiAgICAgICAgY2FzZSAnI2Fib3V0JzpcclxuICAgICAgICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQodGhpcy5oYXNoKS5vZmZzZXQoKS50b3ArMSB9LCAxMDAwKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJyNob3ctdG8tdXNlJzpcclxuICAgICAgICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQodGhpcy5oYXNoKS5vZmZzZXQoKS50b3AgLSB3aW5kb3cuaW5uZXJIZWlnaHQvMiB9LCAxMDAwKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKHRoaXMuaGFzaCkub2Zmc2V0KCkudG9wLSQoJy5IZWFkZXInKS5vdXRlckhlaWdodCgpIH0sIDEwMDApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcblxyXG5cclxuKGZ1bmN0aW9uKCQpIHtcclxuICB2YXIgQ3VzdG9tTGlzdCA9IEZsaXBDbG9jay5MaXN0LmV4dGVuZCh7XHJcbiAgICBjbGFzc2VzOiB7XHJcbiAgICAgIGFjdGl2ZTogJ1QtbnVtYmVyX19uZXh0JyxcclxuICAgICAgYmVmb3JlOiAnVC1udW1iZXJfX3ByZXYnLFxyXG4gICAgICBmbGlwOiAnVC1udW1iZXInICBcclxuICAgIH0sXHJcbiAgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oZmFjdG9yeSwgZGlnaXQsIG9wdGlvbnMpIHtcclxuICAgICAgdGhpcy5iYXNlKGZhY3RvcnksIGRpZ2l0LCBvcHRpb25zKTtcclxuICAgIH0sIFxyXG4gICAgY3JlYXRlTGlzdEl0ZW06IGZ1bmN0aW9uKGNzcywgdmFsdWUpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICAnPGRpdiBjbGFzcz1cIicrY3NzKydcIj4nLFxyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJULW51bWJlcl9fdXBcIj4nKyh2YWx1ZSA/IHZhbHVlIDogJycpKyc8L2Rpdj4nLFxyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJULW51bWJlcl9fZG93blwiPicrKHZhbHVlID8gdmFsdWUgOiAnJykrJzwvZGl2PicsXHJcbiAgICAgICAgJzwvZGl2PidcclxuICAgICAgXS5qb2luKCcnKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVMaXN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGxhc3REaWdpdCA9IHRoaXMuZ2V0UHJldkRpZ2l0KCkgPyB0aGlzLmdldFByZXZEaWdpdCgpIDogdGhpcy5kaWdpdDtcclxuXHJcbiAgICAgIHZhciBodG1sID0gJChbXHJcbiAgICAgICAgICAnPGRpdiBjbGFzcz1cIicrdGhpcy5jbGFzc2VzLmZsaXArJyAnKyh0aGlzLmZhY3RvcnkucnVubmluZyA/IHRoaXMuZmFjdG9yeS5jbGFzc2VzLnBsYXkgOiAnJykrJ1wiPicsXHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTGlzdEl0ZW0odGhpcy5jbGFzc2VzLmJlZm9yZSwgbGFzdERpZ2l0KSxcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVMaXN0SXRlbSh0aGlzLmNsYXNzZXMuYWN0aXZlLCB0aGlzLmRpZ2l0KSxcclxuICAgICAgICAgICc8L2Rpdj4nLFxyXG4gICAgICBdLmpvaW4oJycpKTtcclxuICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9LFxyXG4gIH0pO1xyXG5cclxuXHJcbiAgRmxpcENsb2NrLkRhaWx5Q291bnRlckN1c3RvbUZhY2UgPSBGbGlwQ2xvY2suRmFjZS5leHRlbmQoe1xyXG4gICAgc2hvd1NlY29uZHM6IHRydWUsXHJcbiAgICBjbGFzc2VzOiB7IHdyYXBwZXI6ICdUaW1lcicgfSxcclxuICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbihmYWN0b3J5LCBvcHRpb25zKSB7XHJcbiAgICAgIGZhY3RvcnkudGltZS5kaWdpdGl6ZSA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgIHZhciBkYXRhID0gW107XHJcblxyXG4gICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGksIHZhbHVlKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmKHZhbHVlLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gJzAnK3ZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZGF0YS5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYoZGF0YS5sZW5ndGggPiB0aGlzLm1pbmltdW1EaWdpdHMpIHtcclxuICAgICAgICAgIHRoaXMubWluaW11bURpZ2l0cyA9IGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5iYXNlKGZhY3RvcnksIG9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZUxpc3Q6IGZ1bmN0aW9uKGRpZ2l0LCBvcHRpb25zKSB7XHJcbiAgICAgIGlmKHR5cGVvZiBkaWdpdCA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIG9wdGlvbnMgPSBkaWdpdDtcclxuICAgICAgICBkaWdpdCA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBvYmogPSBuZXcgQ3VzdG9tTGlzdCh0aGlzLmZhY3RvcnksIGRpZ2l0LCBvcHRpb25zKTtcclxuICAgIFxyXG4gICAgICB0aGlzLmxpc3RzLnB1c2gob2JqKTtcclxuXHJcbiAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9LFxyXG5cclxuICAgIGJ1aWxkOiBmdW5jdGlvbih0aW1lKSB7XHJcbiAgICAgIHZhciB0ID0gdGhpcztcclxuICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5mYWN0b3J5LiRlbDtcclxuXHJcblxyXG4gICAgICB0aW1lID0gdGltZSA/IHRpbWUgOiB0aGlzLmZhY3RvcnkudGltZS5nZXREYXlDb3VudGVyKHRoaXMuc2hvd1NlY29uZHMpO1xyXG4gICAgICAkLmVhY2godGltZSwgZnVuY3Rpb24oaSwgZGlnaXQpIHtcclxuICAgICAgICB0LmNyZWF0ZUxpc3QoZGlnaXQpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciBpdGVtcyA9IFsnRGF5cycsICdIb3VycycsICdNaW51dGVzJywgJ1NlY29uZHMnXTtcclxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMubGlzdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAkKCc8ZGl2IGNsYXNzPVwiVGltZXJfX2l0ZW1cIj48L2Rpdj4nKVxyXG4gICAgICAgIC5wcmVwZW5kVG8odGhpcy5mYWN0b3J5LiRlbClcclxuICAgICAgICAuYXBwZW5kKHRoaXMubGlzdHNbaV0uJGVsKVxyXG4gICAgICAgIC5hcHBlbmQoJzxkaXYgY2xhc3M9XCJUaW1lcl9fbmFtZVwiPicrdGhpcy5mYWN0b3J5LmxvY2FsaXplKGl0ZW1zW2ldKSsnPC9kaXY+Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYmFzZSgpO1xyXG4gICAgfSxcclxuICAgIGZsaXA6IGZ1bmN0aW9uKHRpbWUsIGRvTm90QWRkUGxheUNsYXNzKSB7XHJcbiAgICAgIGlmKCF0aW1lKSB7XHJcbiAgICAgICAgdGltZSA9IHRoaXMuZmFjdG9yeS50aW1lLmdldERheUNvdW50ZXIodGhpcy5zaG93U2Vjb25kcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYXV0b0luY3JlbWVudCgpO1xyXG5cclxuICAgICAgdGhpcy5iYXNlKHRpbWUsIGRvTm90QWRkUGxheUNsYXNzKTtcclxuICAgIH1cclxuXHJcbiAgfSk7XHJcblxyXG59KGpRdWVyeSkpO1xyXG4gIFxyXG5cclxudmFyIGNsb2NrICA9ICQoJy5UaW1lcicpLkZsaXBDbG9jaygyMzMwMDAwLCB7XHJcbiAgY291bnRkb3duOiB0cnVlLFxyXG4gIGNsb2NrRmFjZTogJ0RhaWx5Q291bnRlckN1c3RvbScsXHJcbiAgY2xhc3NlczogeyB3cmFwcGVyOiAnVGltZXInLCBwbGF5OiAncGxheScgfVxyXG59KTtcclxuXHJcbn0pO1xyXG4iXSwiZmlsZSI6Im1haW4uanMifQ==
