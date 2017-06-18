'use strict';

/* Selectmenu start */
(function ($) {
    $('.u-select').niceSelect();
})(jQuery);
/* Selectmenu end */
'use strict';

/* Background slider start */
(function ($) {
    $('.w-bg-slider').slick({
        accessibility: false,
        draggable: false,
        swipe: false,
        touchMove: false,
        fade: true,
        pauseOnFocus: false,
        pauseOnHover: false,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 1000
    });
})(jQuery);
/* Background slider end */
'use strict';

/* Drop menu start */
(function (window, document, $) {
    var menus = $('.w-drop-menu');

    menus.addClass('is-close');

    if (!('ontouchstart' in window)) {
        // If not mobile than not use hover
        menus.on('mouseover', function () {
            $(this).addClass('is-open').removeClass('is-close');
        });
        menus.on('mouseout', function () {
            $(this).addClass('is-close').removeClass('is-open');
        });
    } else {
        // Else if it is mobile devise use click
        menus.on('click', function () {
            menus.not(this).addClass('is-close').removeClass('is-open');

            if ($(this).is('.is-close')) {
                $(this).removeClass('is-close').addClass('is-open');
            } else {
                $(this).removeClass('is-open').addClass('is-close');
            }
        });

        $(document).on('click', function (e) {
            // And auto close for mobile, if click on not menu.
            var isTarget = $(e.target).is('.w-drop-menu') || $(e.target).closest('.w-drop-menu').length;

            if (!isTarget) {
                menus.removeClass('is-open').addClass('is-close');
            }
        });
    }
})(window, document, jQuery);
/* Drop menu end */
"use strict";

/* Form-list start */
(function ($) {
    $.validate();
})(jQuery);
/* Form-list end */
'use strict';

/* Mega-menu start */
(function ($) {
    var mm = $('.l-mega-menu');
    var toggler = mm.find('.l-mega-menu__toggler');

    toggler.on('click', function () {
        mm.toggleClass('is-open');
    });
})(jQuery);
/* Mega-menu end */