"use strict";

const keyboard_icon = document.getElementById("keyboard_button");
const hidden_keyboard = document.getElementById("hidden_keyboard");

keyboard_icon.addEventListener('click', function(){

    /*
        Pressing the keyboard icon will toggle the keyboard on or off
    */
    if(hidden_keyboard.classList == "hidden"){
        hidden_keyboard.classList.remove("hidden");
        hidden_keyboard.classList.add("show");
    }else{
         hidden_keyboard.classList.remove("show");
         hidden_keyboard.classList.add("hidden");
    }
})
