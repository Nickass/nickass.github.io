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

function setPosLabels() {
  var Home = $('.Home');
  var bgcss = Home.css('background-image').match(/^url\("(.*)"\)$/im);

  if(!bgcss || !bgcss[1]) return;

  Home.css('background-size', 'cover');
  Home.css('background-position', '50% 50%');

  var img = new Image();
  img.src = bgcss[1];

  var nwidth = img.naturalWidth;
  var nheight = img.naturalHeight;

  var hwidth = Home.outerWidth();
  var hheight = Home.outerHeight();

  var hratio = hwidth / hheight;
  var nratio = nwidth / nheight;

  var wrat = (hratio >= nratio ? hratio : nratio);
  var hrat = (hratio >= nratio ? nratio : hratio);

  var realH = hwidth / hrat;
  var realW = hheight * wrat;

  var hOffset = (realH - hheight)/2;
  var wOffset = (realW - hwidth)/2;


  $('.Price-label').each(function() {
    var self = $(this);
    var left = realW / 100 * parseFloat(self.data('left'));
    var top = realH / 100 * parseFloat(self.data('top'));

    self.css({
      left: left - wOffset - self.outerWidth()/2 + 'px',
      top: top - hOffset - self.outerHeight()/2 + 'px'
    });
  });
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

      var befClasses = this.factory.countdown ? this.classes.active : this.classes.before;
      var aftClasses = this.factory.countdown ? this.classes.before : this.classes.active;

      var html = $([
          '<div class="'+this.classes.flip+' '+(this.factory.running ? this.factory.classes.play : '')+'">',
            this.createListItem(befClasses, lastDigit),
            this.createListItem(aftClasses, this.digit),
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
  $('.Home__play-btn').one('click', openVideo);
  $('.Home__play-btn').on('click', toggleVideo);
  $('.Home__close-btn').on('click', closeVideo);
  var video = $('.Home__video');

  video.on('play', playVideo);
  video.on('pause', pauseVideo);
  video.on('ended', closeVideo);
  video.on('waiting', function(e) {
    window.hideVideoBtns = false;
    $('.Home__play-btn').addClass('loading');
  });
  video.on('canplaythrough', function(e) {
    window.hideVideoBtns = true;
    $('.Home__play-btn').removeClass('loading');
  });


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

  setPosLabels();
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
      .css('top', 0)
      .addClass('is-stiky')
      .animate({'top': Header.outerHeight()}, 400);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCAnLi9jb21tb24vZGQuanMnO1xyXG5pbXBvcnQgJy4uL2NvbXBvbmVudHMvaW5kZXguZGVwJztcclxuXHJcbmZ1bmN0aW9uIHNldFBvc0xhYmVscygpIHtcclxuICB2YXIgSG9tZSA9ICQoJy5Ib21lJyk7XHJcbiAgdmFyIGJnY3NzID0gSG9tZS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKS5tYXRjaCgvXnVybFxcKFwiKC4qKVwiXFwpJC9pbSk7XHJcblxyXG4gIGlmKCFiZ2NzcyB8fCAhYmdjc3NbMV0pIHJldHVybjtcclxuXHJcbiAgSG9tZS5jc3MoJ2JhY2tncm91bmQtc2l6ZScsICdjb3ZlcicpO1xyXG4gIEhvbWUuY3NzKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJywgJzUwJSA1MCUnKTtcclxuXHJcbiAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gIGltZy5zcmMgPSBiZ2Nzc1sxXTtcclxuXHJcbiAgdmFyIG53aWR0aCA9IGltZy5uYXR1cmFsV2lkdGg7XHJcbiAgdmFyIG5oZWlnaHQgPSBpbWcubmF0dXJhbEhlaWdodDtcclxuXHJcbiAgdmFyIGh3aWR0aCA9IEhvbWUub3V0ZXJXaWR0aCgpO1xyXG4gIHZhciBoaGVpZ2h0ID0gSG9tZS5vdXRlckhlaWdodCgpO1xyXG5cclxuICB2YXIgaHJhdGlvID0gaHdpZHRoIC8gaGhlaWdodDtcclxuICB2YXIgbnJhdGlvID0gbndpZHRoIC8gbmhlaWdodDtcclxuXHJcbiAgdmFyIHdyYXQgPSAoaHJhdGlvID49IG5yYXRpbyA/IGhyYXRpbyA6IG5yYXRpbyk7XHJcbiAgdmFyIGhyYXQgPSAoaHJhdGlvID49IG5yYXRpbyA/IG5yYXRpbyA6IGhyYXRpbyk7XHJcblxyXG4gIHZhciByZWFsSCA9IGh3aWR0aCAvIGhyYXQ7XHJcbiAgdmFyIHJlYWxXID0gaGhlaWdodCAqIHdyYXQ7XHJcblxyXG4gIHZhciBoT2Zmc2V0ID0gKHJlYWxIIC0gaGhlaWdodCkvMjtcclxuICB2YXIgd09mZnNldCA9IChyZWFsVyAtIGh3aWR0aCkvMjtcclxuXHJcblxyXG4gICQoJy5QcmljZS1sYWJlbCcpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9ICQodGhpcyk7XHJcbiAgICB2YXIgbGVmdCA9IHJlYWxXIC8gMTAwICogcGFyc2VGbG9hdChzZWxmLmRhdGEoJ2xlZnQnKSk7XHJcbiAgICB2YXIgdG9wID0gcmVhbEggLyAxMDAgKiBwYXJzZUZsb2F0KHNlbGYuZGF0YSgndG9wJykpO1xyXG5cclxuICAgIHNlbGYuY3NzKHtcclxuICAgICAgbGVmdDogbGVmdCAtIHdPZmZzZXQgLSBzZWxmLm91dGVyV2lkdGgoKS8yICsgJ3B4JyxcclxuICAgICAgdG9wOiB0b3AgLSBoT2Zmc2V0IC0gc2VsZi5vdXRlckhlaWdodCgpLzIgKyAncHgnXHJcbiAgICB9KTtcclxuICB9KTtcclxufVxyXG5cclxuXHJcbihmdW5jdGlvbigkKSB7XHJcbiAgdmFyIEN1c3RvbUxpc3QgPSBGbGlwQ2xvY2suTGlzdC5leHRlbmQoe1xyXG4gICAgY2xhc3Nlczoge1xyXG4gICAgICBhY3RpdmU6ICdULW51bWJlcl9fbmV4dCcsXHJcbiAgICAgIGJlZm9yZTogJ1QtbnVtYmVyX19wcmV2JyxcclxuICAgICAgZmxpcDogJ1QtbnVtYmVyJyAgXHJcbiAgICB9LFxyXG4gICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKGZhY3RvcnksIGRpZ2l0LCBvcHRpb25zKSB7XHJcbiAgICAgIHRoaXMuYmFzZShmYWN0b3J5LCBkaWdpdCwgb3B0aW9ucyk7XHJcbiAgICB9LCBcclxuICAgIGNyZWF0ZUxpc3RJdGVtOiBmdW5jdGlvbihjc3MsIHZhbHVlKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgJzxkaXYgY2xhc3M9XCInK2NzcysnXCI+JyxcclxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiVC1udW1iZXJfX3VwXCI+JysodmFsdWUgPyB2YWx1ZSA6ICcnKSsnPC9kaXY+JyxcclxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwiVC1udW1iZXJfX2Rvd25cIj4nKyh2YWx1ZSA/IHZhbHVlIDogJycpKyc8L2Rpdj4nLFxyXG4gICAgICAgICc8L2Rpdj4nXHJcbiAgICAgIF0uam9pbignJyk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlTGlzdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBsYXN0RGlnaXQgPSB0aGlzLmdldFByZXZEaWdpdCgpID8gdGhpcy5nZXRQcmV2RGlnaXQoKSA6IHRoaXMuZGlnaXQ7XHJcblxyXG4gICAgICB2YXIgYmVmQ2xhc3NlcyA9IHRoaXMuZmFjdG9yeS5jb3VudGRvd24gPyB0aGlzLmNsYXNzZXMuYWN0aXZlIDogdGhpcy5jbGFzc2VzLmJlZm9yZTtcclxuICAgICAgdmFyIGFmdENsYXNzZXMgPSB0aGlzLmZhY3RvcnkuY291bnRkb3duID8gdGhpcy5jbGFzc2VzLmJlZm9yZSA6IHRoaXMuY2xhc3Nlcy5hY3RpdmU7XHJcblxyXG4gICAgICB2YXIgaHRtbCA9ICQoW1xyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCInK3RoaXMuY2xhc3Nlcy5mbGlwKycgJysodGhpcy5mYWN0b3J5LnJ1bm5pbmcgPyB0aGlzLmZhY3RvcnkuY2xhc3Nlcy5wbGF5IDogJycpKydcIj4nLFxyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUxpc3RJdGVtKGJlZkNsYXNzZXMsIGxhc3REaWdpdCksXHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlTGlzdEl0ZW0oYWZ0Q2xhc3NlcywgdGhpcy5kaWdpdCksXHJcbiAgICAgICAgICAnPC9kaXY+JyxcclxuICAgICAgXS5qb2luKCcnKSk7XHJcbiAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfSxcclxuICB9KTtcclxuXHJcblxyXG4gIEZsaXBDbG9jay5EYWlseUNvdW50ZXJDdXN0b21GYWNlID0gRmxpcENsb2NrLkZhY2UuZXh0ZW5kKHtcclxuICAgIHNob3dTZWNvbmRzOiB0cnVlLFxyXG4gICAgY2xhc3NlczogeyBcclxuICAgICAgd3JhcHBlcjogJ1RpbWVyJyxcclxuICAgICAgaXRlbTogJ1RpbWVyX19pdGVtJyxcclxuICAgICAgbmFtZTogJ1RpbWVyX19uYW1lJ1xyXG4gICAgfSxcclxuICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbihmYWN0b3J5LCBvcHRpb25zKSB7XHJcbiAgICAgIGZhY3RvcnkudGltZS5kaWdpdGl6ZSA9IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgICAgIHZhciBkYXRhID0gW107XHJcblxyXG4gICAgICAgICQuZWFjaChvYmosIGZ1bmN0aW9uKGksIHZhbHVlKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmKHZhbHVlLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gJzAnK3ZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZGF0YS5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYoZGF0YS5sZW5ndGggPiB0aGlzLm1pbmltdW1EaWdpdHMpIHtcclxuICAgICAgICAgIHRoaXMubWluaW11bURpZ2l0cyA9IGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5iYXNlKGZhY3RvcnksIG9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZUxpc3Q6IGZ1bmN0aW9uKGRpZ2l0LCBvcHRpb25zKSB7XHJcbiAgICAgIGlmKHR5cGVvZiBkaWdpdCA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIG9wdGlvbnMgPSBkaWdpdDtcclxuICAgICAgICBkaWdpdCA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBvYmogPSBuZXcgQ3VzdG9tTGlzdCh0aGlzLmZhY3RvcnksIGRpZ2l0LCBvcHRpb25zKTtcclxuICAgICAgdGhpcy5saXN0cy5wdXNoKG9iaik7XHJcblxyXG4gICAgICByZXR1cm4gb2JqO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZDogZnVuY3Rpb24odGltZSkge1xyXG4gICAgICB2YXIgdCA9IHRoaXM7XHJcblxyXG4gICAgICB0aW1lID0gdGltZSA/IHRpbWUgOiB0aGlzLmZhY3RvcnkudGltZS5nZXREYXlDb3VudGVyKHRoaXMuc2hvd1NlY29uZHMpO1xyXG4gICAgICAkLmVhY2godGltZSwgZnVuY3Rpb24oaSwgZGlnaXQpIHtcclxuICAgICAgICB0LmNyZWF0ZUxpc3QoZGlnaXQpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciBpdGVtcyA9IFsnRGF5cycsICdIb3VycycsICdNaW51dGVzJywgJ1NlY29uZHMnXTtcclxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMubGlzdHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAkKCc8ZGl2IGNsYXNzPVwiJyt0aGlzLmNsYXNzZXMuaXRlbSsnXCI+PC9kaXY+JylcclxuICAgICAgICAucHJlcGVuZFRvKHRoaXMuZmFjdG9yeS4kZWwpXHJcbiAgICAgICAgLmFwcGVuZCh0aGlzLmxpc3RzW2ldLiRlbClcclxuICAgICAgICAuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiJyt0aGlzLmNsYXNzZXMubmFtZSsnXCI+Jyt0aGlzLmZhY3RvcnkubG9jYWxpemUoaXRlbXNbaV0pKyc8L2Rpdj4nKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmJhc2UoKTtcclxuICAgIH0sXHJcbiAgICBmbGlwOiBmdW5jdGlvbih0aW1lLCBkb05vdEFkZFBsYXlDbGFzcykge1xyXG4gICAgICBpZighdGltZSkge1xyXG4gICAgICAgIHRpbWUgPSB0aGlzLmZhY3RvcnkudGltZS5nZXREYXlDb3VudGVyKHRoaXMuc2hvd1NlY29uZHMpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuYXV0b0luY3JlbWVudCgpO1xyXG4gICAgICB0aGlzLmJhc2UodGltZSwgZG9Ob3RBZGRQbGF5Q2xhc3MpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59KGpRdWVyeSkpO1xyXG5cclxuXHJcbmZ1bmN0aW9uIG1vdXNlbW92ZVZpZGVvKCkge1xyXG4gICQoJy5Ib21lX19wbGF5LWJ0biwgLkhvbWVfX2Nsb3NlLWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgIGlmKHdpbmRvdy5oaWRlVmlkZW9CdG5zKSB7XHJcbiAgICAgICQoJy5Ib21lX19wbGF5LWJ0biwgLkhvbWVfX2Nsb3NlLWJ0bicpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICAgICQoJy5Ib21lX192aWRlbycpLm9uZSgnbW91c2Vtb3ZlJywgbW91c2Vtb3ZlVmlkZW8pO1xyXG4gICAgfVxyXG4gIH0sIDIwMDApO1xyXG59XHJcbmZ1bmN0aW9uIHBsYXlWaWRlbygpIHtcclxuICB3aW5kb3cuaGlkZVZpZGVvQnRucyA9IHRydWU7XHJcbiAgJCgnLkhvbWVfX3ZpZGVvJykub25lKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmVWaWRlbyk7XHJcbiAgJCgnLkhvbWVfX3BsYXktYnRuLCAuSG9tZV9fY2xvc2UtYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxufVxyXG5mdW5jdGlvbiBwYXVzZVZpZGVvKCkge1xyXG4gIHdpbmRvdy5oaWRlVmlkZW9CdG5zID0gZmFsc2U7XHJcbiAgJCgnLkhvbWVfX3ZpZGVvJykub2ZmKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmVWaWRlbyk7XHJcbiAgJCgnLkhvbWVfX3BsYXktYnRuLCAuSG9tZV9fY2xvc2UtYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5vbmUoJ2NsaWNrJywgbW91c2Vtb3ZlVmlkZW8pO1xyXG59XHJcbmZ1bmN0aW9uIHRvZ2dsZVZpZGVvKCkge1xyXG4gICQoJy5Ib21lX192aWRlbycpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBpZih0aGlzLnBhdXNlZCkge1xyXG4gICAgICB0aGlzLnBsYXkoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucGF1c2UoKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5mdW5jdGlvbiBvcGVuVmlkZW8oKSB7XHJcbiAgcGxheVZpZGVvKCk7XHJcbiAgJCgnLkhvbWUnKS5hZGRDbGFzcygnaXMtc2hvdy12aWRlbycpO1xyXG4gIC8vICQoJy5Ib21lX192aWRlbycpLnRyaWdnZXIoJ3BsYXknKTtcclxufVxyXG5mdW5jdGlvbiBjbG9zZVZpZGVvKCkge1xyXG4gIHBhdXNlVmlkZW8oKTtcclxuICAkKCcuSG9tZScpLnJlbW92ZUNsYXNzKCdpcy1zaG93LXZpZGVvJyk7XHJcbiAgJCgnLkhvbWVfX2Nsb3NlLWJ0bicpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgJCgnLkhvbWVfX3BsYXktYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpLm9uZSgnY2xpY2snLCBvcGVuVmlkZW8pO1xyXG4gICQoJy5Ib21lX192aWRlbycpLnRyaWdnZXIoJ3BhdXNlJyk7XHJcbn1cclxuXHJcblxyXG4kKGZ1bmN0aW9uKCkge1xyXG4gICQoJy5Ib21lX19wbGF5LWJ0bicpLm9uZSgnY2xpY2snLCBvcGVuVmlkZW8pO1xyXG4gICQoJy5Ib21lX19wbGF5LWJ0bicpLm9uKCdjbGljaycsIHRvZ2dsZVZpZGVvKTtcclxuICAkKCcuSG9tZV9fY2xvc2UtYnRuJykub24oJ2NsaWNrJywgY2xvc2VWaWRlbyk7XHJcbiAgdmFyIHZpZGVvID0gJCgnLkhvbWVfX3ZpZGVvJyk7XHJcblxyXG4gIHZpZGVvLm9uKCdwbGF5JywgcGxheVZpZGVvKTtcclxuICB2aWRlby5vbigncGF1c2UnLCBwYXVzZVZpZGVvKTtcclxuICB2aWRlby5vbignZW5kZWQnLCBjbG9zZVZpZGVvKTtcclxuICB2aWRlby5vbignd2FpdGluZycsIGZ1bmN0aW9uKGUpIHtcclxuICAgIHdpbmRvdy5oaWRlVmlkZW9CdG5zID0gZmFsc2U7XHJcbiAgICAkKCcuSG9tZV9fcGxheS1idG4nKS5hZGRDbGFzcygnbG9hZGluZycpO1xyXG4gIH0pO1xyXG4gIHZpZGVvLm9uKCdjYW5wbGF5dGhyb3VnaCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIHdpbmRvdy5oaWRlVmlkZW9CdG5zID0gdHJ1ZTtcclxuICAgICQoJy5Ib21lX19wbGF5LWJ0bicpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XHJcbiAgfSk7XHJcblxyXG5cclxuICAkKCcuTWVudSBhLCAuTWFpbi1tZW51IGEnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYoIXRoaXMuaGFzaCkgcmV0dXJuO1xyXG5cclxuICAgICQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHN3aXRjaCh0aGlzLmhhc2gpIHtcclxuICAgICAgICBjYXNlICcjYWJvdXQnOlxyXG4gICAgICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCh0aGlzLmhhc2gpLm9mZnNldCgpLnRvcCsxIH0sIDEwMDApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnI2hvdy10by11c2UnOlxyXG4gICAgICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCh0aGlzLmhhc2gpLm9mZnNldCgpLnRvcCAtIHdpbmRvdy5pbm5lckhlaWdodC8yIH0sIDEwMDApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQodGhpcy5oYXNoKS5vZmZzZXQoKS50b3AtJCgnLkhlYWRlcicpLm91dGVySGVpZ2h0KCkgfSwgMTAwMCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICB2YXIgY2xvY2sgID0gJCgnLlRpbWVyJykuRmxpcENsb2NrKDIzMzAwMDAsIHtcclxuICAgIGNvdW50ZG93bjogdHJ1ZSxcclxuICAgIGNsb2NrRmFjZTogJ0RhaWx5Q291bnRlckN1c3RvbScsXHJcbiAgfSk7XHJcblxyXG4gICQoJy50by10b3AtYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDEwMDApO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcbiQod2luZG93KS5vbigncmVhZHkgcmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgdmFyIEhlYWRlciA9ICQoJy5IZWFkZXInKTtcclxuICB2YXIgYnRucyA9IEhlYWRlci5maW5kKCcuSGVhZGVyX19idG5zJyk7XHJcbiAgdmFyIG1lbnUgPSBIZWFkZXIuZmluZCgnLk1haW4tbWVudScpO1xyXG4gIHZhciBsb2dvID0gSGVhZGVyLmZpbmQoJy5IZWFkZXJfX2xvZ28nKVxyXG5cclxuICBpZih3aW5kb3cuaW5uZXJXaWR0aCA+PSA3NjgpXHJcbiAgICBidG5zLmluc2VydEFmdGVyKGxvZ28pLmNzcygnZGlzcGxheScsICcnKTtcclxuICBlbHNlXHJcbiAgICBidG5zLmFwcGVuZFRvKG1lbnUpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG5cclxuICAkKCcuUHJvZ3Jlc3NfX2l0ZW0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgaWYod2luZG93LmlubmVyV2lkdGggPj0gNzY4KVxyXG4gICAgICAkKHRoaXMpLmNzcyh7XHJcbiAgICAgICAgd2lkdGg6ICQodGhpcykuZGF0YSgncG9pbnQnKSxcclxuICAgICAgICBoZWlnaHQ6ICcnXHJcbiAgICAgIH0pO1xyXG4gICAgZWxzZVxyXG4gICAgICAkKHRoaXMpLmNzcyh7XHJcbiAgICAgICAgaGVpZ2h0OiAkKHRoaXMpLmRhdGEoJ3BvaW50JyksXHJcbiAgICAgICAgd2lkdGg6ICcnXHJcbiAgICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBzZXRQb3NMYWJlbHMoKTtcclxufSk7XHJcblxyXG4kKHdpbmRvdykub24oJ3JlYWR5IHNjcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG4gIHZhciBIZWFkZXIgPSAkKCcuSGVhZGVyJyk7XHJcbiAgdmFyIEhvbWUgPSAkKCcuSG9tZScpO1xyXG4gIHZhciBGb290ZXIgPSAkKCcuRm9vdGVyJyk7XHJcblxyXG4gIHZhciBpc1N0aWt5ID0gSGVhZGVyLmlzKCcuaXMtc3Rpa3knKTtcclxuICB2YXIgaXNUb3AgPSBIb21lLm91dGVySGVpZ2h0KCkgPj0gd2luZG93LnNjcm9sbFk7XHJcbiAgdmFyIGlzQm90dG9tID0gd2luZG93LnNjcm9sbFkgPj0gKCQoZG9jdW1lbnQpLm91dGVySGVpZ2h0KCktd2luZG93LmlubmVySGVpZ2h0LUZvb3Rlci5vdXRlckhlaWdodCgpKTtcclxuXHJcblxyXG4gIGlmKGlzVG9wKSB7XHJcbiAgICAkKCcudG8tdG9wLWJ0bicpLmFkZENsYXNzKCdoaWRlJyk7XHJcbiAgICBIZWFkZXIucmVtb3ZlQ2xhc3MoJ2lzLXN0aWt5Jyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaWYoIWlzU3Rpa3kpIHtcclxuICAgICAgSGVhZGVyXHJcbiAgICAgIC5jc3MoJ3RvcCcsIDApXHJcbiAgICAgIC5hZGRDbGFzcygnaXMtc3Rpa3knKVxyXG4gICAgICAuYW5pbWF0ZSh7J3RvcCc6IEhlYWRlci5vdXRlckhlaWdodCgpfSwgNDAwKTtcclxuICAgIH1cclxuICAgIGlmKCFpc1N0aWt5KSB7XHJcbiAgICAgICQoJy50by10b3AtYnRuJykucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmKGlzQm90dG9tKSB7XHJcbiAgICAgICAgJCgnLnRvLXRvcC1idG4nKS5hZGRDbGFzcygnaGlkZScpOyBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKCcudG8tdG9wLWJ0bicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9IFxyXG59KTtcclxuIl0sImZpbGUiOiJtYWluLmpzIn0=
