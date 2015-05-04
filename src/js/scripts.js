(function ($, window, document, undefined) {

  'use strict';

  $(function () {
    // FastShell
    /*!
     * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
     * Code licensed under the Apache License v2.0.
     * For details, see http://www.apache.org/licenses/LICENSE-2.0.
     */

    // jQuery to collapse the navbar on scroll
    $(window).scroll(function() {
        if ($('.navbar').offset().top > 50) {
            $('.navbar-fixed-top').addClass('top-nav-collapse');
        } else {
            $('.navbar-fixed-top').removeClass('top-nav-collapse');
        }
    });

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $(function() {
        $('a.page-scroll').bind('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

  });

  window.KIOBarLoader = {
    update: function() {
        var selectedBar = $( "input[name='sc-1-1']:checked" ).attr('data-value');
        var targetWeight = $("#input-32").val();
        var stripe = $('.bar_0 .base .stripe');
        stripe.removeClass("bar_20 bar_15");
        stripe.addClass("bar_"+selectedBar);
        KIOBarLoader.calculate(selectedBar, targetWeight);
    },
    calculate: function(barWeight, targetWeight) {
        var result = "";
        var plates = [25, 20, 15, 10, 5, 2.5, 2, 1.5, 1, 0.5];
        var textPlates = ['25', '20', '15', '10', '5', '2_5', '2', '1_5', '1', '0_5'];
        var collar = 2.5;
        var plateCount = [0,0,0,0,0,0,0,0,0,0];
        var tmp;

        if (targetWeight < barWeight)
        {
            //TODO: Better out-of-bounds handling
            console.log('nope');
        }
        tmp = targetWeight - barWeight;
        tmp = tmp - (collar*2);
        for (var i = 0; i < plates.length; i++) {
          while ((tmp / plates[i]) >= 2) {
            tmp -= (plates[i] * 2);
            plateCount[i] = (plateCount[i] + 2);
          }
        }
        $('.bar_0 .discs').html("");
        $('#bar-calculator .text').html("");
        for (var j = 0; j < plates.length; j++) {
          if (plateCount[j] > 0){
            for (var n = plateCount[j]/2; n > 0; n--){
              $('.bar_0 .discs').prepend("<div class='disc_"+textPlates[j]+"'></div>")
            }
            $('#bar-calculator .text').append("<p>"+plates[j] + "kg plates: "+plateCount[j]+"</p>");
          }
          if (j==5){
            $('.bar_0 .discs').prepend("<div class='collar'></div>")
          }
    //      console.log(plates[j] + "plates:");
    //      console.log(plateCount[j]);
        }
        $('#bar-calculator .text').append("<p>plus collars.</p>");
    //    console.log("plus collars.");

    }
  };

  window.KIOTimer = {
    countdown: null,
    duration: null,
    remaining: 60,
    sound: new Audio("http://www.freespecialeffects.co.uk/soundfx/sirens/alarm_01.wav"),

    startTimer: function(duration, display) {
        var timer = duration, minutes, seconds;
        //Clear existing Interval but save the value to resume from 'pause'.
        if(KIOTimer.countdown){
            window.clearInterval(KIOTimer.countdown);
            KIOTimer.remaining = duration;
        }
        KIOTimer.countdown = setInterval(function () {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (KIOTimer.remaining == 30 || KIOTimer.remaining == 0){
                KIOTimer.sound.play();
                document.body.style.background = "white";
                document.getElementById("timer").style.color = "black";
            }
            if (KIOTimer.remaining == 29 || KIOTimer.remaining < 0){
                KIOTimer.sound.pause();
                document.body.style.background = "black";
                document.getElementById("timer").style.color = "white";
            }
            KIOTimer.remaining = --timer;
            if (KIOTimer.remaining < 0) {
                timer = 0;
            }
        }, 1000);
    },
    stopTimer: function() {
        if(KIOTimer.countdown){
            window.clearInterval(KIOTimer.countdown);
        }
        var _remaining = KIOTimer.remaining;
        var display = document.querySelector("#time");
        var minutes = parseInt(_remaining / 60, 10)
        var seconds = parseInt(_remaining % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
    }
  };

})(jQuery, window, document);

