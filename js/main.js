/*!
    * Start Bootstrap - Agency v6.0.0 (https://startbootstrap.com/template-overviews/agency)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/BlackrockDigital/startbootstrap-agency/blob/master/LICENSE)
    */
   (function ($) {
    "use strict"; // Start of use strict
    
    function scrollToTarget() {
    // Smooth scrolling using jQuery easing
        $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
            if (
                location.pathname.replace(/^\//, "") ==
                    this.pathname.replace(/^\//, "") &&
                location.hostname == this.hostname
            ) {
                var target = $(this.hash);
                target = target.length
                    ? target
                    : $("[name=" + this.hash.slice(1) + "]");
                if (target.length) {
                    $("html, body").animate(
                        {
                            scrollTop: target.offset().top - $('a.navbar-brand').outerHeight(true)-32+1, // padding 2rem - 32px
                        },
                        1000,
                        "easeInOutExpo"
                    );
                    return false;
                }
            }
        })
    }
    scrollToTarget()
    $(document).resize(scrollToTarget())
    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function () {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#mainNav",
        offset: $('#mainNav').outerHeight(true)+1,
    });

    // Collapse Navbar
    var navbarCollapse = function () {
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

    // Custom

    // CSRF
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    // End of CSRF

    $('#contact button.btn').click(function(){
        $('#contact .error-msg').remove()
        $('#contact input').removeClass('input-red-outline')
        $('#contact textarea').removeClass('input-red-outline')
        var fields = [$('#name'), $('#email'), $('#message')]
        // Order: username, email, message
        var valid = [true, true, true]
        var usernameRegex = /^[a-zA-Z ]+$/
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        // Empty Value Validation
        var i = 0
        fields.forEach(field => {
            if (field.val().replace(/\s/g, '').length == 0) { //.replace... is used to remove spaces
                field.addClass('input-red-outline')
                valid[i] = false
            }
            i += 1
        });
        // Username Validation
        if (!usernameRegex.test(fields[0].val()) && valid[0]) {
            valid[0] = false
            fields[0].addClass('input-red-outline')
            fields[0].after($(`<p class="error-msg">Full names can only contain letters.</p>`))
        }
        // Email Validation
        if (!emailRegex.test(fields[1].val()) && valid[1]) {
            valid[1] = false
            fields[1].addClass('input-red-outline')
            fields[1].after($(`<p class="error-msg">Please enter a valid email address.</p>`))
        }
        
        if (valid.every(v => v == true )) {
            $('#contact button.btn').remove()
            $('#contact').addClass('brightness-80')
            $('#contact .container').addClass('brightness-50')
            $('<img src="/static/main_app/img/Ripple-1s-200px.svg" class="loader-xl">').appendTo($('#contact'))
            
            $.ajax({
                type: 'POST',
                url: '/ajax/contact-us/',
                data: {
                    'name': fields[0].val().trim(),
                    'email': fields[1].val().trim(),
                    'message': fields[2].val().trim(),
                },
                success: function(data) {
                    $('.loader-xl').remove()
                    if (data) {
                        var card = 
                            `
                            <div class="centered-card">
                                <svg class="mx-auto my-4" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                                <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
                                </svg>
                                <h3 class="text-center font-weight-bold">Confirmation link has been sent to your email.</h3>
                            </div>
                            `
                        $(card).appendTo('#contact')
                        var height = $('#contact .centered-card').outerHeight(true)/2
                        var width = $('#contact .centered-card').outerWidth(true)/2
                        $('#contact .centered-card').css({"top": `calc(50% - ${height}px)`, "left": `calc(50% - ${width}px)`})
                    }
                }
            })
        }
        
    })
    // Remove red border if user starts to input
    $('#contact input').click(function(){
        $('#contact input').removeClass('input-red-outline')
        $('#contact textarea').removeClass('input-red-outline')
    })
    // End of Custom
})(jQuery); // End of use strict