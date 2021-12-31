
jQuery(function($){

    $(document).mouseup(function (e){ //закрытие всплывающего меню
        if(window.matchMedia('(max-width: 800px)').matches){
            let elem = $(".right_nav");
            if (!elem.is(e.target) && elem.has(e.target).length === 0) {
                elem.hide();
                $("#burger").css("display", "inline")
            }
        }
    });

    $(document.body).on("click", "#burger", function(){
        if(window.matchMedia('(max-width: 800px)').matches){
            $(".right_nav").css("display", "flex");
            $(this).hide();
        }
    });

    $(window).resize(function(){
        if(window.matchMedia('(max-width: 800px)').matches){
            $("#burger").css("display", "inline")
            $(".right_nav").css("display", "none");
        } else {
            $("#burger").css("display", "none")
            $(".right_nav").css("display", "flex");
        }
    })

});