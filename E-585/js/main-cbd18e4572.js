'use strict';

function mainMenuHandler() {
  var navJQ = $('#main-nav');
  var parJQ = navJQ.parent();
  var navTg = $('#m-nav-togle');
  var wasDid = false;

  navTg.on('click', function () { 
    if(navJQ.is(':visible')){
      navJQ.slideUp();
    }else{
      navJQ.slideDown();
    }
  });
  var wNav = navJQ.outerWidth(true);
  var wSum = parJQ
    .children()
    .map(function(){ 
      var self = $(this);
      /*Calculates the sum of all elements without
       menu items for their verification by fitting*/
      return self.is('#main-nav, #m-nav-togle') ? 0 : self.outerWidth(true);
    })
    .toArray()
    .reduce(function(c,n) {return c + n;});
  var wSumClear = wSum + 10 ;// compensates letter spacing whole elements

  function responseMenu() {
    var wPar = parJQ.outerWidth();
    var isMob = wPar - wSumClear  < wNav;

    if(!wasDid && isMob){
      wasDid = true;
      navTg.show();
      navJQ.addClass('isMob').hide();
    }else if(wasDid && !isMob) {
      wasDid = false;
      navTg.hide();
      navJQ.removeClass('isMob').show();
    }
  }
  responseMenu();
  $(window).on('resize', responseMenu);
}



$(function () {
  // Suports svg for old browsers
  svg4everybody({polyfill:true});
  
  // Sliders for main page
  $('.Banners').slick({
    prevArrow: 
    '<button type="button" class="Banners__arrow--prev Btn-arrow">\
      <svg role="img" class="icon--arrow-left Btn-arrow__icon">\
        <use xlink:href="decor/svgsprite.svg#arrow-left"></use>\
      </svg>\
    </button>',
    nextArrow: 
    '<button type="button" class="Banners__arrow--next Btn-arrow">\
      <svg role="img" class="icon--arrow-right Btn-arrow__icon">\
        <use xlink:href="decor/svgsprite.svg#arrow-right"></use>\
      </svg>\
    </button>',
    autoplay: true,
    autoplaySpeed: 7000,
  });


  $('.Relative').slick({
    prevArrow: 
    '<button type="button" class="Relative__arrow--prev Btn-arrow">\
      <svg role="img" class="icon--arrow-left Btn-arrow__icon">\
        <use xlink:href="decor/svgsprite.svg#arrow-left"></use>\
      </svg>\
    </button>',
    nextArrow: 
    '<button type="button" class="Relative__arrow--next Btn-arrow">\
      <svg role="img" class="icon--arrow-right Btn-arrow__icon">\
        <use xlink:href="decor/svgsprite.svg#arrow-right"></use>\
      </svg>\
    </button>',
    slidesToShow: 5,
    responsive: [
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 2,
        }
      }
    ] // end responsive
  }); // end slick

  // Responsible menu
  mainMenuHandler();

  // Responsible sidebar
  $('#tog-side').on('click', function(){ $('#sidebar').toggleClass('open'); })

  // Delete b-item
  function dlBItem(elem){
    var props = {
      opacity: 'hide',
      left: 100,
    };
    $(elem).animate(props, 500, function(){
      $(this).remove();
    });
  }
  
  $('.Del').on('click', function(){
    dlBItem( $(this).parent('.B-item') )
  });


  // Checkout goods
  $('#b-checkout-form').hide();
  $('#b-checkout').on('click', function(){
    $('#b-checkout-form').slideToggle();
  });
  
});