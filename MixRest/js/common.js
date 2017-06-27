'use strict';

/**********************************************************************/
function mediaQueries(){
  var width = window.innerWidth;

  /* Mover of elements*/
  try{
  (function(){
    var mover = $('.js-mover');

    if(!mover[0])return;

    var from = $('.js-from', mover);
    var to = $('.js-to', mover);

    var title = $('.js-title', mover);
    var button = $('.js-button', mover);

    if(width >= 400 && width <= 900 ) {
      to.prepend(title);
      to.append(button);
    } else if( to.has(title) || to.has(button) ) {
      from.prepend(title);
      from.append(button);
    }
  })();
  }catch(e){console.log(e)}

  /* Panel smooth opener */
  try{
  (function(){
    var el = $('.panel__center');
    var helper = $('#panel-helper', '.panel');
    
    if(!el[0]) return;


    if(width <= 1024){       
      if( !helper[0].checked ) el.css('overflow', 'hidden');
      helper.off('click n1');
      helper.on('click n1', 
        function(e){
          if( this.checked ){
            window.setTimeout(function(){ 
              el.css('overflow', 'visible');
            }, 400);
          } else if( !this.checked ){
            el.css('overflow', 'hidden');
          }
        });
    } else {
      el[0].style.overflow = '';
    }
  })();
  }catch(e){console.log(e);}

}//End mediaqueries.

/**********************************************************************/
function category_handler($){
  var root = $('.js-category');
  var crumbs = root.children('.js-crumbs');
  var catItem = root.find('.js-cat-item:has(.js-cat-list)');

  catItem.each(function(){
    var self = $(this);
    var parentList = self.closest('.js-cat-list');
    var childList = self.children('.js-cat-list');
    var name = self.children('.js-cat-name').text();
    var crumb = $('<span> >> '+name+' </span>').css({'cursor': 'pointer'});

    crumb.hide();
    childList.hide();
    crumbs.append(crumb);
    root.append(childList);

    crumb.on('click', function(){
      crumb.hide().nextAll('.open').last().click().prevUntil(crumb).click();
      parentList.show();
      childList.hide();
      crumb.removeClass('open');
    })

    self.on('click', function(){
      parentList.hide();
      childList.show();

      crumb.show();
      crumb.addClass('open');
    })
  });
}


/**********************************************************************/
function datepickerHandler(self, actionForDay){

  function setCurrentEvents(data){
    var datesEvent = data.responseJSON;

    // Set handler for display date on calendar
    self.datepicker('option', 'beforeShowDay', function(date){
      for(var i in datesEvent){
        var trueDate = new Date(i);
        trueDate.setHours(0,0,0,0);
        if( trueDate.getTime() === date.getTime() ) return [true, 'active'];
      }
      
      return false;      
    });

    // Set handler for bind link with url
    self.datepicker('option', 'onSelect', function(date){
      date = new Date(date);
      for(var i in datesEvent){
        var trueDate = new Date(i);
        trueDate.setHours(0,0,0,0);
        if( trueDate.getTime() === date.getTime() ) actionForDay(datesEvent[i]);
      }

      return false;
    });

    self.datepicker('refresh');
  }

  self.datepicker({
    firstDay: 1,
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота' ],
    dayNamesMin: [ 'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ],
    monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],
    monthNamesShort: [ "Янв", "Фев", "Мар", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Ноя", "Дек" ],
    nextText: '',
    prevText: '',
    onSelect: function(){},
  });

  $.ajax({
    url: self.data('pathtojson'),
    complete: setCurrentEvents,      
  });
}



/**********************************************************************/
/**********************************************************************/
jQuery(document).ready(function($) {
/* Media queries */
  mediaQueries();
  $(window).on('resize', mediaQueries);


/* Select for header */
  $('.js-select').selectmenu();


/* Datepicker in main page */
  datepickerHandler($('#datepicker'), function(url){
    window.location = url;
  });


/* Tabs for settings of user */
  $('#tabs').tabs();


/* Slider in firm and event page */
  $('.slider--sm').slick({
    infinite: true,
    slidesToShow: 3,
    nextArrow: '<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="Previous" role="button"></button>',
    prevArrow: '<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="Next" role="button"></button>',
  });


/* Slider in popup */
  var element_psf = $('.popup-slider-for');
  var element_psn = $('<div class="popup-slider-nav"></div>');

  element_psn.append(element_psf.children().clone());
  element_psn.insertAfter(element_psf);

  var psf = element_psf.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    nextArrow: '<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="Previous" role="button"></button>',
    prevArrow: '<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="Next" role="button"></button>',
    asNavFor: '.popup-slider-nav'
  });

  var psn = $('.popup-slider-nav').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: '<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="Previous" role="button"></button>',
    prevArrow: '<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="Next" role="button"></button>',
    focusOnSelect: true,
    centerMode: false,
    asNavFor: '.popup-slider-for'
  });


/* Popup */
  $('.popup').magnificPopup({
    type: 'iframe',
  });


/* Open sidebar */
  try{
  (function(){
    var label = $( '.show-sidebar--left' );
    var helper = $( '#' + label.attr('for') )[0];
    var sidebar = $( '.left-sidebar' );
    var xLenght = 0,
        startX = 0,
        endX = 0;

    if(!label[0]) return;

    $('body').on('touchstart', function(e){
      startX = e.originalEvent.touches[0].clientX;
    })
    $('body').on('touchmove', function(e){
      endX = e.originalEvent.touches[0].clientX;
      xLenght = endX - startX;

      if(xLenght > 100){
        helper.checked = true;
      } else if(xLenght < -100){
        helper.checked = false;
      }
    })
  })()
  }catch(e){console.log(e);}


/* Script for category picker */
  category_handler($);
});