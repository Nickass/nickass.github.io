'use strict'

function mSliderConf(elem){
	elem.slick({
		prevArrow: '<button type="button" class="p-slider__arrow--prev"></button>',
		nextArrow: '<button type="button" class="p-slider__arrow--next"></button>'
	});
}

function rSliderConf(elem){
	elem.slick({
		slidesToShow: 3,
		prevArrow: '<button type="button" class="p-slider__arrow--prev"></button>',
		nextArrow: '<button type="button" class="p-slider__arrow--next"></button>',
		responsive: [{
	    breakpoint: 560,
	    settings: {
	      slidesToShow: 2,
	      slidesToScroll: 1,
	      infinite: true,
	    }
	  },
	  {
	    breakpoint: 420,
	    settings: {
	      slidesToShow: 1,
	      slidesToScroll: 1,
	      infinite: true,
	    }
	  }]
	});
}

function pSliderConf(view){
	var nav = $('<div class="p-slider--nav" id="p-slider--nav"></div>');

	nav.append(view.children().clone());
	// nav.children().addClass('p-slider__item');
	nav.find('img').unwrap('a'); // Remove links for popup
  nav.insertAfter(view);

  function calcSlides(slides){
		slides.outerHeight(slides.outerWidth()); //for aspect ratio like a sqare
		slides.css('line-height', slides.height() + 'px'); //for vertical-align of inner slide
  }

	$(window).on('resize',function(){
		var slides = $('#p-slider--nav').find('.slick-slide');
		calcSlides(slides);
	});

	nav.add(view).on('init', function(){
		var slides = $(this).find('.slick-slide');
		calcSlides(slides);
	});

	view.slick({
		slidesToShow: 1,
		focusOnSelect: true,
    centerMode: false,
		prevArrow: false,//'<button type="button" class="p-slider__arrow--prev"></button>',
		nextArrow: false,//'<button type="button" class="p-slider__arrow--next"></button>',
		asNavFor: '#p-slider--nav',
		// responsive: [{
	 //    breakpoint: 1024,
	 //    settings: {
	 //      slidesToShow: 3,
	 //      slidesToScroll: 3,
	 //      infinite: true,
	 //      dots: true
	 //    }
	 //  }]
	});

	nav.slick({
		slidesToShow: 3,
		focusOnSelect: true,
		prevArrow: '<button type="button" class="p-slider__arrow--prev"></button>',
		nextArrow: '<button type="button" class="p-slider__arrow--next"></button>',
		asNavFor: '#p-slider',
	});
}


function sidebarConf(button, sidebar){
	button.on('click', function(){
		sidebar.toggleClass('open');
	});
}


function tPanelConf(tPanel, sidebar){
	var tp_top = tPanel.offset().top;

	$(window).on('scroll', function(e){
		if( $(this).scrollTop() >= tp_top ){
			tPanel.addClass('sticky');
			sidebar.addClass('sticky')
		} else {
			tPanel.removeClass('sticky');
			sidebar.removeClass('sticky');
		}
	});
}

function toTopConf(button){
	button.on('click', function(){
		$("html, body").animate({ scrollTop: 0 }, "slow");
	});
}

function tabsConf(elem) { 
  var nav = elem.find('#tabs-nav');
  var view = elem.find('#tabs-view');

  nav.find('a').on('click', function(e){
    $(this).toggleClass('active').parent('li').siblings().children().removeClass('active');
    openTab(view.find(this.href.match(/\#.*$/)[0]));
    e.preventDefault();
  });
  if( !(nav.find('a').is('active')) ) nav.find('a').eq(0).addClass('active');

  function openTab(elem) {
    elem.addClass('open').removeClass('close').siblings().addClass('close').removeClass('open');
    return elem;
  }

  view.children().addClass('close').each(function(){
    var self = this;

    if( self.id == window.location.hash.substr(1) ) openTab( $(self) );

    $(window).on('hashchange', function(){
      if( self.id == window.location.hash.substr(1) ) openTab( $(self) );     
    });
  });
  if(view.children().is('.close')) openTab( view.children().eq(0) ) ;
}

function openCartConf(button){
	button.on('click', function(){
		var target = $('#float-cart');
		target.addClass('show');

		window.setTimeout(function(){
			target.removeClass('show');
		},2000);

	});
}

jQuery(function ($) {
	var TABLET_W = 800;
	var MOBILE_W = 560;

	var mSlider  = $('#m-slider');
	var rSlider  = $('#r-slider');
	var pSlider  = $('#p-slider');
	var sidebar  = $('#sidebar');
	var tgButton = $('#tg-sidebar');
	var tPanel   = $('#tools-panel');
	var tTopBtn  = $('#to-top');
	var tabs 		 = $('#tabs');
	var opCart   = $('#p-open-cart');

	var width 	 = window.innerWidth;

	mSliderConf(mSlider);
	rSliderConf(rSlider);
	sidebarConf(tgButton, sidebar);
	toTopConf(tTopBtn);
	pSliderConf(pSlider);
	tabsConf(tabs);
	openCartConf(opCart);

	$('.popup-img').magnificPopup({ type: 'image'	});		


	if( width <= TABLET_W ) {
		tPanelConf(tPanel, sidebar);
	}

	if( width >= MOBILE_W ) {
		// HAAAACK %-[ for align item__general in page of product
		var pIt = $('.p-item');
		var pV  = pIt.find('.p-item__view');
		var pG  = pIt.find('.p-item__general');
		var pH = Math.max( pV.height(), pG.height() );
		pV.height(pH);
		pG.height(pH);
	}



});
