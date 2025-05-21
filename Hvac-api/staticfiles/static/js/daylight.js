"use strict";

let daylight_val;

function getData(url, type){
    /*
        Get static data from api and send it to time sensative functions to update the frontend
    */
    fetch(url)
    .then(function(response){
        response.json()
        .then(function(data){

            if (url == URL_device){
                if(type == 'bool'){
                    day(data);
                }
            }
    })
    .catch(function(error){
        console.log('Request failed', error)
    })
})
}


let daylight_saving = getData(URL_device, 'bool');

function day(data){
    Object.keys(data[0]).forEach(function(key){
        if(key == "daylight_saving")daylight_val = data[0][key];
    })
}
