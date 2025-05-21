"use strict";

function checkSkins(){

    function getSkins(url, type){
        /*
            Get static data from api and send it to time sensative functions to update the frontend
        */
        fetch(url)
        .then(function(response){
            response.json()
            .then(function(data){
                if (url == URL_device){
                    if(type == 'bool'){
                        changeSkin(data);
                    }
                }
            })
        })
        .catch(function(error){
            console.log('Request failed', error)
        })
    }

    let skin = getSkins(URL_device, "bool");
    let nav_bar = document.getElementById("nav_bar");
    let dark_ostara_name = document.getElementById("dark_ostara_name");

    function changeSkin(value){
        if(value[0].skins == 1){
            nav_bar.classList.remove("nav-color");
            nav_bar.classList.add("nav-color_dark_ostara");
            dark_ostara_name.classList.add("dark-ostara-name-show");
            dark_ostara_name.classList.remove("dark-ostara-name-hide");
        }
    }

}