"use strict";

// On page load get data from API
window.addEventListener("load", getData);


let temp_p_input_val = document.getElementById('temp_p_input_val');
let temp_i_input_val = document.getElementById('temp_i_input_val');
let temp_d_input_val = document.getElementById('temp_d_input_val');
let hum_p_input_val = document.getElementById('hum_p_input_val');
let hum_i_input_val = document.getElementById('hum_i_input_val');
let hum_d_input_val = document.getElementById('hum_d_input_val');
let temp_p, temp_i, temp_d, hum_p, hum_i, hum_d;


function getData(){
    /*
        Get static data every 20 seconds
    */
    fetch(URL_device)
    .then(function(response){
        response.json()
        .then(function(data){
            display_data(data);
        })
    })
    .catch(function(error){
        console.log('Request failed', error)
    })
}
setInterval(getData, 20000);


function display_data(data){
    /*
        Get PID data from the api and pass it to variables
    */
    Object.keys(data[0]).forEach(function(key){
        if(key == "temp_p")temp_p = data[0][key];
        if(key == "temp_i")temp_i = data[0][key];
        if(key == "temp_d")temp_d = data[0][key];
        if(key == "hum_p")hum_p = data[0][key];
        if(key == "hum_i")hum_i = data[0][key];
        if(key == "hum_d")hum_d = data[0][key];
    })
    temp_p_input_val.value = parseFloat(temp_p).toFixed(2);
    temp_i_input_val.value = parseFloat(temp_i).toFixed(2);
    temp_d_input_val.value = parseFloat(temp_d).toFixed(2);
    hum_p_input_val.value = parseFloat(hum_p).toFixed(2);
    hum_i_input_val.value = parseFloat(hum_i).toFixed(2);
    hum_d_input_val.value = parseFloat(hum_d).toFixed(2);
}
