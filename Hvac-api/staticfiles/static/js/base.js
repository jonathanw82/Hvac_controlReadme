"use strict";

// The page function starts any functions as the page first loads
let page = () => {
    clock();
    standby();
    checkStanbyData();
    checkSkins();
};

window.addEventListener("load", page);

let standby_val;

setInterval(clock, 1000);
function clock(){
    /*
     This function creates a working digital clock
     and adds it to the clock Html
     */
    const time = document.getElementById("clock");
    const d = new Date();
    let day = d.getDay();
    let month = d.getMonth();
    let year = d.getFullYear();
    let h = d.getHours();
    let m =d.getMinutes();
    let s = d.getSeconds();

    function hasDST(date = new Date()) {
        /*
            Check to see if daylight saving is active, if so return true
        */
        const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
        const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
        return Math.max(january, july) !== date.getTimezoneOffset();
    }

    if(daylight_val){
        /*
            if daylight_val is true the switch is turned on check to see if the clock is already in 
            daylight saving if it is do nothing else advance the clock one hour.
        */
        if(hasDST(new Date(year, month, day))){}
        else{h+=1;}
    }
    time.innerHTML= `${h}:${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
}


function moveClock(){
    /*
        Add css classes to mve the clock to the nav bar on certain pages
    */
    let clockmove = document.getElementById('clock');
    clockmove.classList.remove('clock');
    clockmove.classList.add('clockchart');

}

function standby(){
    /*
        Add event listeners to set standby
    */

    let standby_overlay = document.getElementById('standby_overlay');
    let bottom_logo = document.getElementById('bottom_logo');

    const main_stanby_button = document.getElementById('standby');
    main_stanby_button.addEventListener('click', function(){
        send_data_to_mqtt('standby', 1);
        standby_overlay.classList.remove('hide');
        standby_overlay.classList.add('show_standby');
    })

    const standby_button = document.getElementById('standby_button');
    standby_button.addEventListener('click', function(){
        send_data_to_mqtt('standby', 0);
        standby_overlay.classList.remove('show_standby');
        standby_overlay.classList.add('hide');
    })
}

function checkStanbyData(){
    /*
        check stanby every 2 seconds
    */
    fetch(getCurrentUrlLocation() + "/api/hvac_controllers/")
    .then(function(response){
        response.json()
        .then(function(data){
            Object.keys(data[0]).forEach(function(key){
                if(key == "standby")standby_val = data[0][key];
                if(standby_val == true){
                    standby_overlay.classList.remove('hide');
                    standby_overlay.classList.add('show_standby');
                    bottom_logo.classList.remove('hide');
                    bottom_logo.classList.add('show_logo');
                }else{
                    standby_overlay.classList.remove('show_standby');
                    standby_overlay.classList.add('hide');
                    bottom_logo.classList.add('hide');
                    bottom_logo.classList.remove('show_logo');
                }
            })
        })
    })
    .catch(function(error){
        console.log('Request failed', error);
    })
}
setInterval(checkStanbyData,1000);