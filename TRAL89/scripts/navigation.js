"use strict";

!function () {
  function e() {
    for (var e = this; -1 === e.className.indexOf("nav-menu");) {
      "li" === e.tagName.toLowerCase() && (-1 !== e.className.indexOf("focus") ? e.className = e.className.replace(" focus", "") : e.className += " focus"), e = e.parentElement;
    }
  }var t, a, n, s, i, r, l;if (t = document.getElementById("site-navigation"), t && (a = t.getElementsByTagName("button")[0], "undefined" != typeof a)) {
    if (n = t.getElementsByTagName("ul")[0], "undefined" == typeof n) return void (a.style.display = "none");for (n.setAttribute("aria-expanded", "false"), -1 === n.className.indexOf("nav-menu") && (n.className += " nav-menu"), a.onclick = function () {
      -1 !== t.className.indexOf("toggled") ? (t.className = t.className.replace(" toggled", ""), a.setAttribute("aria-expanded", "false"), n.setAttribute("aria-expanded", "false")) : (t.className += " toggled", a.setAttribute("aria-expanded", "true"), n.setAttribute("aria-expanded", "true"));
    }, s = n.getElementsByTagName("a"), i = n.getElementsByTagName("ul"), r = 0, l = i.length; r < l; r++) {
      i[r].parentNode.setAttribute("aria-haspopup", "true");
    }for (r = 0, l = s.length; r < l; r++) {
      s[r].addEventListener("focus", e, !0), s[r].addEventListener("blur", e, !0);
    }!function (e) {
      var t,
          a,
          n = e.querySelectorAll(".menu-item-has-children > a, .page_item_has_children > a");if ("ontouchstart" in window) for (t = function t(e) {
        var t,
            a = this.parentNode;if (a.classList.contains("focus")) a.classList.remove("focus");else {
          for (e.preventDefault(), t = 0; t < a.parentNode.children.length; ++t) {
            a !== a.parentNode.children[t] && a.parentNode.children[t].classList.remove("focus");
          }a.classList.add("focus");
        }
      }, a = 0; a < n.length; ++a) {
        n[a].addEventListener("touchstart", t, !1);
      }
    }(t);
  }
}();
//# sourceMappingURL=navigation.js.map
