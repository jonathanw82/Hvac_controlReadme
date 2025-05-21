"use strict";

const reset_info = document.getElementById('reset_info');
const warning_box = document.getElementById('warning_box');
const daylightSavingswitch = document.getElementById('daylightswitch');
const daylightSavinginfo = document.getElementById('daylightsavinginfo');
const time_period_val_input = document.getElementById('time_period_val_input');
const period_up = document.getElementById('period_up');
const period_down = document.getElementById('period_down');
const skininfo = document.getElementById('skininfo');
const skinswitch = document.getElementById('skinswitch');

reset.addEventListener('click', function(){
    /*
        Reboot only the Controllino
    */
    send_data_to_mqtt("reset", "reset");
    warning_box.classList.add('hide');
    reset_info.innerHTML ="The Controllino is being Rebooted";
    redirect();
})

let redirect = () =>{
    /*
        redirect automaitcally and remove class from warning box and clear info message
    */
    let close = document.getElementById('close');
    setTimeout(function(){
        close.click();
        warning_box.classList.remove('hide');
        reset_info.innerHTML ="";
    }, 2000);
}

daylightSavingswitch.addEventListener('click', function(){
    /*
        If the switch is checked change the value and send the correct message to mqtt
    */
    if(daylightSavingswitch.checked){
        daylightinnertext('on');
        daylightSavingswitch.checked = true;
        send_data_to_mqtt("daylight_saving", 1);
    }else{
        daylightSavingswitch.checked;
        daylightinnertext('off');
        daylightSavingswitch.checked = false;
        send_data_to_mqtt("daylight_saving", 0);
    }
})

function daylightSavingvalue(value){
    /*
        Get the inital button status from the Api
    */
    if(value[0].daylight_saving == 1){
        daylightinnertext('on');
        daylightSavingswitch.checked = true;
    }else{
        daylightinnertext('off');
        daylightSavingswitch.checked = false;
    }
}

function daylightinnertext(value){
     /*
        Inner text to be displayed by datlight saving switch
    */

    if(value == 'on')daylightSavinginfo.innerHTML = `Daylight Saving is switched <b>ON</b>`;
    else daylightSavinginfo.innerHTML = `Daylight Saving is switched <b>OFF</b>`;
}

let time_value;
let display_value;
function time_period_value(value){
     /*
        Get the inital time value from the Api and convert it
        to a solid number.
    */
   
    time_value = value[0].time_period;
    display_value = Math.floor(time_value / 60)
    time_period_val_input.value = display_value;
}

period_up.addEventListener('click', function(){
    display_value +=1;
    time_period_val_input.value = display_value;
    convertTimeValues(display_value);
})

period_down.addEventListener('click', function(){
    display_value -=1;
    if(display_value <= 0)display_value = 0;
    time_period_val_input.value = display_value;
    convertTimeValues(display_value);
})

function convertTimeValues(display_time_value){
    let min_to_sec = display_time_value * 60;
    let val_to_send = min_to_sec;
    send_data_to_mqtt("time_period", val_to_send);
}

skinswitch.addEventListener('click', function(){
    /*
        If the switch is checked change the value and send the correct message to mqtt
    */
    if(skinswitch.checked){
        skinInfo('on');
        skinswitch.checked = true;
        send_data_to_mqtt("skins", 1);
    }else{
        skinswitch.checked;
        skinInfo('off');
        skinswitch.checked = false;
        send_data_to_mqtt("skins", 0);
    }
})

function skinValue(value){
    /*
        Get the inital button status from the Api
    */
    if(value[0].skins == 1){
        skinInfo('on');
        skinswitch.checked = true;
    }else{
        skinInfo('off');
        skinswitch.checked = false;
    }
}

function skinInfo(value){
    /*
       Inner text to be displayed by skin switch
   */
   if(value == 'on')skininfo.innerHTML = `Dark Ostara Skin <b>Active</b>`;
   else skininfo.innerHTML = `Dark Ostara Skin <b>OFF</b>`;
}