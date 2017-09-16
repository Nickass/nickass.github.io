'use strict';

(function (window, document) {
    var links = document.getElementsByClassName('Menu-link');

    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
            Array.prototype.forEach.call(links, function (curr) {
                curr.classList.remove('active');
            });
            this.classList.add('active');
        });
    }
})(window, document);
'use strict';

(function (window, document) {
    var dropMenu = document.querySelectorAll('.Drop-menu');

    var _loop = function _loop(i) {
        var list = dropMenu[i].querySelector('.Drop-menu__list');
        var toggler = dropMenu[i].querySelector('.Drop-menu__toggler');

        toggler.addEventListener('click', function () {
            this.classList.toggle('is-up');
            list.classList.toggle('open');
            return false;
        });
    };

    for (var i = 0; i < dropMenu.length; i++) {
        _loop(i);
    }
})(window, document);
'use strict';

(function (window, document) {
    function getWidthAll(elements) {
        var width = 0;

        Array.prototype.forEach.call(elements, function (c) {
            var cStyle = window.getComputedStyle(c);

            width += c.offsetWidth + parseFloat(cStyle.marginLeft) + parseFloat(cStyle.marginRight);
        });

        return width;
    }

    var navs = document.querySelectorAll('.Inline-nav');

    Array.prototype.forEach.call(navs, function (nav) {
        var items = nav.querySelectorAll('.Inline-nav__item');
        var list = nav.querySelector('.Inline-nav__list');
        var toggler = nav.querySelector('.Inline-nav__toggler');

        list.style.visibility = 'hidden';
        list.style.display = 'inline-block';

        var widthFull = getWidthAll(items);

        list.style.visibility = '';
        list.style.display = '';

        toggler.addEventListener('click', function () {
            list.classList.toggle('is-open');
        });

        function responseMenu() {
            var cw = nav.clientWidth;

            if (cw < widthFull) {
                list.classList.remove('is-show');
                toggler.classList.add('is-show');
            } else {
                list.classList.add('is-show');
                toggler.classList.remove('is-show');
            }
        }

        responseMenu();
        window.addEventListener('resize', responseMenu);
    });
})(window, document);
'use strict';

(function (window, document) {
    // Search decorate
    var search = document.getElementsByClassName('Search');

    for (var i = 0; i < search.length; i++) {
        search[i].addEventListener('submit', function (e) {
            var _this = this;

            this.classList.toggle('submit');
            window.setTimeout(function () {
                _this.submit();
            }, 400);

            e.preventDefault();
            return false;
        });
    }

    return search;
})(window, document);
'use strict';

(function (window, document) {
    var sidebar = document.querySelector('.sidebar');
    var togglers = document.querySelectorAll('.sidebar__toggler');

    for (var i = 0; i < togglers.length; i++) {
        sidebar.classList.remove('open');
        togglers[i].classList.remove('open');

        togglers[i].addEventListener('click', function () {
            this.classList.toggle('is-open');
            sidebar.classList.toggle('is-open');
        });
    }
})(window, document);