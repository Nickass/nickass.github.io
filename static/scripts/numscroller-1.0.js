/**
* jQuery scroroller Plugin 1.0
*
* http://www.tinywall.net/
* 
* Developers: Arun David, Boobalan
* Copyright (c) 2014 
*/
(function($){
    $(window).on("load",function(){
        $(document).scrollzipInit();
        $(document).rollerInit();
    });
    $(window).on("load scroll resize", function(){
        $('.numscroller').scrollzip({
            showFunction    :   function() {
                                    numberRoller($(this).attr('data-slno'));
                                },
            wholeVisible    :     false,
        });
    });
    $.fn.scrollzipInit=function(){
        $('body').prepend("<div style='position:fixed;top:0px;left:0px;width:0;height:0;' id='scrollzipPoint'></div>" );
    };
    $.fn.rollerInit=function(){
        var i=0;
        $('.numscroller').each(function() {
            i++;
           $(this).attr('data-slno',i); 
           $(this).addClass("roller-title-number-"+i);
        });        
    };
    $.fn.scrollzip = function(options){
        var settings = $.extend({
            showFunction    : null,
            hideFunction    : null,
            showShift       : 0,
            wholeVisible    : false,
            hideShift       : 0,
        }, options);
        return this.each(function(i,obj){
            $(this).addClass('scrollzip');
            if ( $.isFunction( settings.showFunction ) ){
                if(
                    !$(this).hasClass('isShown')&&
                    ($(window).outerHeight()+$('#scrollzipPoint').offset().top-settings.showShift)>($(this).offset().top+((settings.wholeVisible)?$(this).outerHeight():0))&&
                    ($('#scrollzipPoint').offset().top+((settings.wholeVisible)?$(this).outerHeight():0))<($(this).outerHeight()+$(this).offset().top-settings.showShift)
                ){
                    $(this).addClass('isShown');
                    settings.showFunction.call( this );
                }
            }
            if ( $.isFunction( settings.hideFunction ) ){
                if(
                    $(this).hasClass('isShown')&&
                    (($(window).outerHeight()+$('#scrollzipPoint').offset().top-settings.hideShift)<($(this).offset().top+((settings.wholeVisible)?$(this).outerHeight():0))||
                    ($('#scrollzipPoint').offset().top+((settings.wholeVisible)?$(this).outerHeight():0))>($(this).outerHeight()+$(this).offset().top-settings.hideShift))
                ){
                    $(this).removeClass('isShown');
                    settings.hideFunction.call( this );
                }
            }
            return this;
        });
    };
    function numberRoller(slno){
            var min=$('.roller-title-number-'+slno).attr('data-min');
            var max=$('.roller-title-number-'+slno).attr('data-max');
            var timediff=$('.roller-title-number-'+slno).attr('data-delay');
            var increment=$('.roller-title-number-'+slno).attr('data-increment');
            var numdiff=max-min;
            var timeout=(timediff*1000)/numdiff;
            //if(numinc<10){
                //increment=Math.floor((timediff*1000)/10);
            //}//alert(increment);
            numberRoll(slno,min,max,increment,timeout);
            
    }
    function numberRoll(slno,min,max,increment,timeout){//alert(slno+"="+min+"="+max+"="+increment+"="+timeout);
        if(min<=max){
            $('.roller-title-number-'+slno).html(min);
            min=parseInt(min)+parseInt(increment);
            setTimeout(function(){numberRoll(eval(slno),eval(min),eval(max),eval(increment),eval(timeout))},timeout);
        }else{
            $('.roller-title-number-'+slno).html(max);
        }
    }
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJudW1zY3JvbGxlci0xLjAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qIGpRdWVyeSBzY3Jvcm9sbGVyIFBsdWdpbiAxLjBcbipcbiogaHR0cDovL3d3dy50aW55d2FsbC5uZXQvXG4qIFxuKiBEZXZlbG9wZXJzOiBBcnVuIERhdmlkLCBCb29iYWxhblxuKiBDb3B5cmlnaHQgKGMpIDIwMTQgXG4qL1xuKGZ1bmN0aW9uKCQpe1xuICAgICQod2luZG93KS5vbihcImxvYWRcIixmdW5jdGlvbigpe1xuICAgICAgICAkKGRvY3VtZW50KS5zY3JvbGx6aXBJbml0KCk7XG4gICAgICAgICQoZG9jdW1lbnQpLnJvbGxlckluaXQoKTtcbiAgICB9KTtcbiAgICAkKHdpbmRvdykub24oXCJsb2FkIHNjcm9sbCByZXNpemVcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLm51bXNjcm9sbGVyJykuc2Nyb2xsemlwKHtcbiAgICAgICAgICAgIHNob3dGdW5jdGlvbiAgICA6ICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1iZXJSb2xsZXIoJCh0aGlzKS5hdHRyKCdkYXRhLXNsbm8nKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3aG9sZVZpc2libGUgICAgOiAgICAgZmFsc2UsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQuZm4uc2Nyb2xsemlwSW5pdD1mdW5jdGlvbigpe1xuICAgICAgICAkKCdib2R5JykucHJlcGVuZChcIjxkaXYgc3R5bGU9J3Bvc2l0aW9uOmZpeGVkO3RvcDowcHg7bGVmdDowcHg7d2lkdGg6MDtoZWlnaHQ6MDsnIGlkPSdzY3JvbGx6aXBQb2ludCc+PC9kaXY+XCIgKTtcbiAgICB9O1xuICAgICQuZm4ucm9sbGVySW5pdD1mdW5jdGlvbigpe1xuICAgICAgICB2YXIgaT0wO1xuICAgICAgICAkKCcubnVtc2Nyb2xsZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2RhdGEtc2xubycsaSk7IFxuICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwicm9sbGVyLXRpdGxlLW51bWJlci1cIitpKTtcbiAgICAgICAgfSk7ICAgICAgICBcbiAgICB9O1xuICAgICQuZm4uc2Nyb2xsemlwID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgICAgIHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHtcbiAgICAgICAgICAgIHNob3dGdW5jdGlvbiAgICA6IG51bGwsXG4gICAgICAgICAgICBoaWRlRnVuY3Rpb24gICAgOiBudWxsLFxuICAgICAgICAgICAgc2hvd1NoaWZ0ICAgICAgIDogMCxcbiAgICAgICAgICAgIHdob2xlVmlzaWJsZSAgICA6IGZhbHNlLFxuICAgICAgICAgICAgaGlkZVNoaWZ0ICAgICAgIDogMCxcbiAgICAgICAgfSwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSxvYmope1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnc2Nyb2xsemlwJyk7XG4gICAgICAgICAgICBpZiAoICQuaXNGdW5jdGlvbiggc2V0dGluZ3Muc2hvd0Z1bmN0aW9uICkgKXtcbiAgICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAgICAgISQodGhpcykuaGFzQ2xhc3MoJ2lzU2hvd24nKSYmXG4gICAgICAgICAgICAgICAgICAgICgkKHdpbmRvdykub3V0ZXJIZWlnaHQoKSskKCcjc2Nyb2xsemlwUG9pbnQnKS5vZmZzZXQoKS50b3Atc2V0dGluZ3Muc2hvd1NoaWZ0KT4oJCh0aGlzKS5vZmZzZXQoKS50b3ArKChzZXR0aW5ncy53aG9sZVZpc2libGUpPyQodGhpcykub3V0ZXJIZWlnaHQoKTowKSkmJlxuICAgICAgICAgICAgICAgICAgICAoJCgnI3Njcm9sbHppcFBvaW50Jykub2Zmc2V0KCkudG9wKygoc2V0dGluZ3Mud2hvbGVWaXNpYmxlKT8kKHRoaXMpLm91dGVySGVpZ2h0KCk6MCkpPCgkKHRoaXMpLm91dGVySGVpZ2h0KCkrJCh0aGlzKS5vZmZzZXQoKS50b3Atc2V0dGluZ3Muc2hvd1NoaWZ0KVxuICAgICAgICAgICAgICAgICl7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2lzU2hvd24nKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3Muc2hvd0Z1bmN0aW9uLmNhbGwoIHRoaXMgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoICQuaXNGdW5jdGlvbiggc2V0dGluZ3MuaGlkZUZ1bmN0aW9uICkgKXtcbiAgICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5oYXNDbGFzcygnaXNTaG93bicpJiZcbiAgICAgICAgICAgICAgICAgICAgKCgkKHdpbmRvdykub3V0ZXJIZWlnaHQoKSskKCcjc2Nyb2xsemlwUG9pbnQnKS5vZmZzZXQoKS50b3Atc2V0dGluZ3MuaGlkZVNoaWZ0KTwoJCh0aGlzKS5vZmZzZXQoKS50b3ArKChzZXR0aW5ncy53aG9sZVZpc2libGUpPyQodGhpcykub3V0ZXJIZWlnaHQoKTowKSl8fFxuICAgICAgICAgICAgICAgICAgICAoJCgnI3Njcm9sbHppcFBvaW50Jykub2Zmc2V0KCkudG9wKygoc2V0dGluZ3Mud2hvbGVWaXNpYmxlKT8kKHRoaXMpLm91dGVySGVpZ2h0KCk6MCkpPigkKHRoaXMpLm91dGVySGVpZ2h0KCkrJCh0aGlzKS5vZmZzZXQoKS50b3Atc2V0dGluZ3MuaGlkZVNoaWZ0KSlcbiAgICAgICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdpc1Nob3duJyk7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmhpZGVGdW5jdGlvbi5jYWxsKCB0aGlzICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgZnVuY3Rpb24gbnVtYmVyUm9sbGVyKHNsbm8pe1xuICAgICAgICAgICAgdmFyIG1pbj0kKCcucm9sbGVyLXRpdGxlLW51bWJlci0nK3Nsbm8pLmF0dHIoJ2RhdGEtbWluJyk7XG4gICAgICAgICAgICB2YXIgbWF4PSQoJy5yb2xsZXItdGl0bGUtbnVtYmVyLScrc2xubykuYXR0cignZGF0YS1tYXgnKTtcbiAgICAgICAgICAgIHZhciB0aW1lZGlmZj0kKCcucm9sbGVyLXRpdGxlLW51bWJlci0nK3Nsbm8pLmF0dHIoJ2RhdGEtZGVsYXknKTtcbiAgICAgICAgICAgIHZhciBpbmNyZW1lbnQ9JCgnLnJvbGxlci10aXRsZS1udW1iZXItJytzbG5vKS5hdHRyKCdkYXRhLWluY3JlbWVudCcpO1xuICAgICAgICAgICAgdmFyIG51bWRpZmY9bWF4LW1pbjtcbiAgICAgICAgICAgIHZhciB0aW1lb3V0PSh0aW1lZGlmZioxMDAwKS9udW1kaWZmO1xuICAgICAgICAgICAgLy9pZihudW1pbmM8MTApe1xuICAgICAgICAgICAgICAgIC8vaW5jcmVtZW50PU1hdGguZmxvb3IoKHRpbWVkaWZmKjEwMDApLzEwKTtcbiAgICAgICAgICAgIC8vfS8vYWxlcnQoaW5jcmVtZW50KTtcbiAgICAgICAgICAgIG51bWJlclJvbGwoc2xubyxtaW4sbWF4LGluY3JlbWVudCx0aW1lb3V0KTtcbiAgICAgICAgICAgIFxuICAgIH1cbiAgICBmdW5jdGlvbiBudW1iZXJSb2xsKHNsbm8sbWluLG1heCxpbmNyZW1lbnQsdGltZW91dCl7Ly9hbGVydChzbG5vK1wiPVwiK21pbitcIj1cIittYXgrXCI9XCIraW5jcmVtZW50K1wiPVwiK3RpbWVvdXQpO1xuICAgICAgICBpZihtaW48PW1heCl7XG4gICAgICAgICAgICAkKCcucm9sbGVyLXRpdGxlLW51bWJlci0nK3Nsbm8pLmh0bWwobWluKTtcbiAgICAgICAgICAgIG1pbj1wYXJzZUludChtaW4pK3BhcnNlSW50KGluY3JlbWVudCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bnVtYmVyUm9sbChldmFsKHNsbm8pLGV2YWwobWluKSxldmFsKG1heCksZXZhbChpbmNyZW1lbnQpLGV2YWwodGltZW91dCkpfSx0aW1lb3V0KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAkKCcucm9sbGVyLXRpdGxlLW51bWJlci0nK3Nsbm8pLmh0bWwobWF4KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKGpRdWVyeSk7Il0sImZpbGUiOiJudW1zY3JvbGxlci0xLjAuanMifQ==
