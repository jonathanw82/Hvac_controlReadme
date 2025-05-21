"use strict";

/* This function starts when the page loads and enables the autoscroll funtion */


$(document).ready(function(){
    // this Function runs the scroll to top icon.
    //Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() > 50) {
            $('.scrollToTop').fadeIn(1000);
            $('.scrollToTop').addClass('button_fade');
        } else {
            $('.scrollToTop').fadeOut(1000);
        }
    });

    //Click event to scroll to top
    $('.scrollToTop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });

    // event to add a fade in and remove classes
    $(window).scroll(function(){
        if ($(this).scrollTop() > 20) {
            $('.scrollbuttonup').fadeIn(1000);
            $('.scrollbuttondown').removeClass('button_fade');
         }
         else{
            $('.scrollbuttondown').addClass('button_fade');
            $('.scrollbuttonup').fadeOut(1000);
         }
    });

});

/*
    function to add scroll up and won the page while used by touch screen
*/
let up = () =>{
    scroll(0, window.scrollY - 80);
}

let down = () =>{
    scroll(0, window.scrollY + 80);
}